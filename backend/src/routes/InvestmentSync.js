const plaidClient = require('../util/plaid');
const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();

const { processHoldings, calculatePortfolioOverview } = require('../util/investmentHelpers');

/**
 * Returns the most recent 5pm EST that has already passed.
 * If it's currently after 5pm EST today, returns today at 5pm EST.
 * Otherwise, returns yesterday at 5pm EST.
 */
function getMostRecent5pmEST() {
    const now = new Date();
    // Get current time in EST
    const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const nowEST = new Date(estString);

    // Build today's 5pm EST as a UTC timestamp
    const estOffset = getESTOffsetHours(now);
    const today5pmEST = new Date(nowEST);
    today5pmEST.setHours(17, 0, 0, 0);

    // Convert back to UTC for comparison with DB timestamps
    const today5pmUTC = new Date(today5pmEST.getTime() + estOffset * 60 * 60 * 1000);

    if (now >= today5pmUTC) {
        return today5pmUTC;
    } else {
        // Yesterday at 5pm EST
        return new Date(today5pmUTC.getTime() - 24 * 60 * 60 * 1000);
    }
}

/**
 * Get EST/EDT offset in hours from UTC.
 * EST = UTC-5, EDT = UTC-4
 */
function getESTOffsetHours(date) {
    const estFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        timeZoneName: 'short'
    });
    const parts = estFormatter.formatToParts(date);
    const tzAbbr = parts.find(p => p.type === 'timeZoneName')?.value;
    return tzAbbr === 'EDT' ? 4 : 5;
}

class InvestmentSync {
    /**
     * Check if cached data for a user's institution is stale.
     * Data is stale if last_synced is before the most recent 5pm EST.
     */
    static async isStale(uid, institution_id) {
        const rows = await db.queryDbValues(
            `SELECT MAX(last_synced) as last_synced
             FROM plaid_investment_accounts
             WHERE uid = $1 AND institution_id = $2`,
            [uid, institution_id]
        );

        const lastSynced = rows[0]?.last_synced;
        if (!lastSynced) return true;

        const cutoff = getMostRecent5pmEST();
        return new Date(lastSynced) < cutoff;
    }

    /**
     * Fetch holdings from Plaid, process them, and persist to DB.
     * Returns { accounts, portfolioOverview }.
     */
    static async syncHoldings(uid, institution_id) {
        // Get access token
        const rows = await db.queryDbValues(
            'SELECT access_token FROM plaid_connections WHERE uid = $1 AND institution_id = $2 AND product = $3',
            [uid, institution_id, 'investments']
        );

        if (!rows[0]) {
            throw new Error('No connected investment account found');
        }

        const { access_token } = rows[0];

        // Fetch from Plaid
        const holdingsResponse = await plaidClient.investmentsHoldingsGet({ access_token });
        const processed = processHoldings(holdingsResponse.data);
        const portfolioOverview = calculatePortfolioOverview(processed);

        // Persist to DB
        await InvestmentSync._persistData(uid, institution_id, holdingsResponse.data, processed);

        return { accounts: processed, portfolioOverview };
    }

    /**
     * Read cached holdings from DB.
     * Returns data in the same shape as processHoldings output.
     */
    static async getCachedHoldings(uid, institution_id) {
        // Fetch accounts
        const accounts = await db.queryDbValues(
            `SELECT account_id, name, official_name, subtype, type,
                    current_balance, iso_currency_code, total_value, holdings_count, last_synced
             FROM plaid_investment_accounts
             WHERE uid = $1 AND institution_id = $2`,
            [uid, institution_id]
        );

        if (accounts.length === 0) return null;

        // Fetch holdings with security info for each account
        const accountIds = accounts.map(a => a.account_id);
        const holdings = await db.queryDbValues(
            `SELECT h.account_id, h.security_id, h.current_price, h.buy_price,
                    h.quantity, h.current_value, h.iso_currency_code,
                    s.name, s.ticker, s.type, s.is_cash_equivalent, s.sector,
                    s.close_price_as_of, s.close_price, s.market_identifier_code
             FROM plaid_investment_holdings h
             JOIN plaid_investment_securities s ON h.security_id = s.security_id
             WHERE h.account_id = ANY($1)`,
            [accountIds]
        );

        // Assemble into the same shape as processHoldings output
        const processedAccounts = accounts.map(account => {
            const accountHoldings = holdings
                .filter(h => h.account_id === account.account_id)
                .map(h => ({
                    security_id: h.security_id,
                    name: h.name,
                    ticker: h.ticker,
                    type: h.type,
                    current_price: parseFloat(h.current_price),
                    buy_price: parseFloat(h.buy_price),
                    quantity: parseFloat(h.quantity),
                    current_value: parseFloat(h.current_value),
                    iso_currency_code: h.iso_currency_code,
                    close_price_as_of: h.close_price_as_of,
                    close_price: h.close_price ? parseFloat(h.close_price) : null,
                    market_identifier_code: h.market_identifier_code,
                    is_cash_equivalent: h.is_cash_equivalent,
                    sector: h.sector,
                }));

            return {
                account_id: account.account_id,
                name: account.name,
                official_name: account.official_name,
                subtype: account.subtype,
                type: account.type,
                current_balance: parseFloat(account.current_balance),
                iso_currency_code: account.iso_currency_code,
                holdings_count: account.holdings_count,
                holdings: accountHoldings,
                total_value: parseFloat(account.total_value),
                last_synced: account.last_synced,
            };
        });

        return processedAccounts;
    }

    /**
     * Persist Plaid data to DB tables.
     */
    static async _persistData(uid, institution_id, rawData, processedAccounts) {
        // Upsert securities
        for (const security of rawData.securities) {
            await db.queryDbValues(
                `INSERT INTO plaid_investment_securities
                    (security_id, name, ticker, type, is_cash_equivalent, sector, close_price_as_of, close_price, market_identifier_code)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (security_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    ticker = EXCLUDED.ticker,
                    type = EXCLUDED.type,
                    is_cash_equivalent = EXCLUDED.is_cash_equivalent,
                    sector = EXCLUDED.sector,
                    close_price_as_of = EXCLUDED.close_price_as_of,
                    close_price = EXCLUDED.close_price,
                    market_identifier_code = EXCLUDED.market_identifier_code`,
                [
                    security.security_id,
                    security.name,
                    security.ticker_symbol,
                    security.type,
                    security.is_cash_equivalent,
                    security.sector,
                    security.close_price_as_of,
                    security.close_price,
                    security.market_identifier_code
                ]
            );
        }

        // Upsert accounts and replace holdings
        for (const account of processedAccounts) {
            await db.queryDbValues(
                `INSERT INTO plaid_investment_accounts
                    (account_id, uid, institution_id, name, official_name, subtype, type,
                     current_balance, iso_currency_code, total_value, holdings_count, last_synced)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
                 ON CONFLICT (account_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    official_name = EXCLUDED.official_name,
                    subtype = EXCLUDED.subtype,
                    type = EXCLUDED.type,
                    current_balance = EXCLUDED.current_balance,
                    iso_currency_code = EXCLUDED.iso_currency_code,
                    total_value = EXCLUDED.total_value,
                    holdings_count = EXCLUDED.holdings_count,
                    last_synced = NOW()`,
                [
                    account.account_id,
                    uid,
                    institution_id,
                    account.name,
                    account.official_name,
                    account.subtype,
                    account.type,
                    account.current_balance,
                    account.iso_currency_code,
                    account.total_value,
                    account.holdings_count
                ]
            );

            // Delete old holdings for this account, insert fresh
            await db.queryDbValues(
                'DELETE FROM plaid_investment_holdings WHERE account_id = $1',
                [account.account_id]
            );

            for (const holding of account.holdings) {
                await db.queryDbValues(
                    `INSERT INTO plaid_investment_holdings
                        (account_id, security_id, current_price, buy_price, quantity, current_value, iso_currency_code)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        account.account_id,
                        holding.security_id,
                        holding.current_price,
                        holding.buy_price,
                        holding.quantity,
                        holding.current_value,
                        holding.iso_currency_code
                    ]
                );
            }
        }
    }

    /**
     * Sync all connected investment institutions for a user at once.
     * Returns an array of { institution_id, institution_name, accounts, portfolioOverview } per institution.
     */
    static async syncAllHoldings(uid) {
        const institutions = await db.queryDbValues(
            `SELECT DISTINCT institution_id, institution_name
             FROM plaid_connections
             WHERE uid = $1 AND product = $2`,
            [uid, 'investments']
        );

        const results = [];
        for (const { institution_id, institution_name } of institutions) {
            try {
                const data = await InvestmentSync.syncHoldings(uid, institution_id);
                results.push({ institution_id, institution_name, ...data });
            } catch (err) {
                console.error(`Failed to sync ${institution_name}:`, err.message);
            }
        }
        return results;
    }
}

module.exports = InvestmentSync;
