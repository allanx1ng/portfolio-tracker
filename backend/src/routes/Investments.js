const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();
const InvestmentSync = require('./InvestmentSync');
const { calculatePortfolioOverview, calculateDashboardOverview } = require('../util/investmentHelpers');

class Investments {
    static async getAllInvestments(req, res) {
        try {
            const { uid } = req.user;

            // Get all connected investment institutions
            const institutions = await db.queryDbValues(
                `SELECT DISTINCT institution_id, institution_name, institution_logo
                 FROM plaid_connections
                 WHERE uid = $1 AND product = $2`,
                [uid, 'investments']
            );

            if (!institutions || institutions.length === 0) {
                return res.status(200).json({
                    message: 'No connected investment accounts found',
                    institutions: [],
                    overallPortfolioOverview: {}
                });
            }

            // For each institution: check staleness, refresh if needed, then read from cache
            const institutionsSyncData = [];
            for (const institution of institutions) {
                const { institution_id, institution_name, institution_logo } = institution;

                try {
                    const stale = await InvestmentSync.isStale(uid, institution_id);
                    if (stale) {
                        await InvestmentSync.syncHoldings(uid, institution_id);
                    }

                    const accounts = await InvestmentSync.getCachedHoldings(uid, institution_id);
                    if (accounts) {
                        const portfolioOverview = calculatePortfolioOverview(accounts);
                        // Get latest last_synced across accounts for this institution
                        const last_synced = accounts.reduce((latest, acc) => {
                            const synced = acc.last_synced ? new Date(acc.last_synced) : null;
                            return synced && (!latest || synced > latest) ? synced : latest;
                        }, null);

                        institutionsSyncData.push({
                            institution_id,
                            institution_name,
                            institution_logo,
                            last_synced,
                            data: { processed: accounts, portfolioOverview }
                        });
                    }
                } catch (err) {
                    console.error(`Failed to load investments for ${institution_name}:`, err.message);
                }
            }

            // Calculate overall portfolio overview
            let totalPortfolioValue = 0;
            let totalCashEquiv = 0;
            let totalInvestmentValue = 0;
            let totalPortfolioGain = 0;

            institutionsSyncData.forEach(inst => {
                const overview = inst.data?.portfolioOverview?.overall;
                if (overview) {
                    totalPortfolioValue += overview.totalAccountValue;
                    totalCashEquiv += overview.totalCashEquiv;
                    totalInvestmentValue += overview.totalInvestmentValue;
                    totalPortfolioGain += overview.totalPortfolioGain;
                }
            });

            const totalPortfolioGainPercentage = totalPortfolioValue === 0
                ? 0
                : (totalPortfolioGain / totalPortfolioValue) * 100;

            const dashboardOverview = calculateDashboardOverview(institutionsSyncData, totalPortfolioValue);

            return res.status(200).json({
                institutions: institutionsSyncData,
                overallPortfolioOverview: {
                    totalAccountValue: totalPortfolioValue,
                    totalCashEquiv,
                    totalInvestmentValue,
                    totalPortfolioGain,
                    totalPortfolioGainPercentage,
                },
                dashboardOverview,
            });
        } catch (err) {
            console.error('Error fetching all investments:', err);
            return res.status(500).json({ error: err.message });
        }
    }

    static async getAccountDetail(req, res) {
        try {
            const { uid } = req.user;
            const { accountId } = req.params;

            const accounts = await db.queryDbValues(
                `SELECT a.account_id, a.name, a.official_name, a.subtype, a.type,
                        a.current_balance, a.iso_currency_code, a.total_value,
                        a.holdings_count, a.last_synced, a.institution_id,
                        c.institution_name, c.institution_logo
                 FROM plaid_investment_accounts a
                 JOIN plaid_connections c ON a.institution_id = c.institution_id
                      AND a.uid = c.uid AND c.product = 'investments'
                 WHERE a.account_id = $1 AND a.uid = $2`,
                [accountId, uid]
            );

            if (!accounts || accounts.length === 0) {
                return res.status(404).json({ error: 'Account not found' });
            }

            const account = accounts[0];

            const stale = await InvestmentSync.isStale(uid, account.institution_id);
            if (stale) {
                await InvestmentSync.syncHoldings(uid, account.institution_id);
            }

            const holdings = await db.queryDbValues(
                `SELECT h.security_id, h.current_price, h.buy_price,
                        h.quantity, h.current_value, h.iso_currency_code,
                        s.name, s.ticker, s.type, s.is_cash_equivalent, s.sector,
                        s.close_price_as_of, s.close_price, s.market_identifier_code
                 FROM plaid_investment_holdings h
                 JOIN plaid_investment_securities s ON h.security_id = s.security_id
                 WHERE h.account_id = $1`,
                [accountId]
            );

            return res.status(200).json({
                account: {
                    account_id: account.account_id,
                    name: account.name,
                    official_name: account.official_name,
                    subtype: account.subtype,
                    type: account.type,
                    current_balance: parseFloat(account.current_balance),
                    iso_currency_code: account.iso_currency_code,
                    total_value: parseFloat(account.total_value),
                    holdings_count: account.holdings_count,
                    last_synced: account.last_synced,
                    institution_id: account.institution_id,
                    institution_name: account.institution_name,
                    institution_logo: account.institution_logo,
                },
                holdings: (holdings || []).map(h => ({
                    security_id: h.security_id,
                    name: h.name,
                    ticker: h.ticker,
                    type: h.type,
                    current_price: parseFloat(h.current_price),
                    buy_price: parseFloat(h.buy_price),
                    quantity: parseFloat(h.quantity),
                    current_value: parseFloat(h.current_value),
                    iso_currency_code: h.iso_currency_code,
                    is_cash_equivalent: h.is_cash_equivalent,
                    sector: h.sector,
                    close_price_as_of: h.close_price_as_of,
                    close_price: h.close_price ? parseFloat(h.close_price) : null,
                    market_identifier_code: h.market_identifier_code,
                }))
            });
        } catch (err) {
            console.error('Error fetching account detail:', err);
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = Investments;
