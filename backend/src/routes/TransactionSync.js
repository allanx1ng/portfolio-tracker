const plaidClient = require('../util/plaid');
const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();

class TransactionSync {
    /**
     * Sync depository + credit + loan accounts for a given item,
     * persisting to plaid_transaction_accounts.
     */
    static async syncAccounts(uid, access_token, item_id) {
        const accountsResponse = await plaidClient.accountsGet({ access_token });
        const accounts = accountsResponse.data.accounts.filter(
            a => a.type === 'depository' || a.type === 'credit' || a.type === 'loan'
        );

        for (const account of accounts) {
            await db.queryDbValues(
                `INSERT INTO plaid_transaction_accounts
                    (account_id, uid, item_id, name, official_name, type, subtype,
                     current_balance, available_balance, iso_currency_code, last_synced)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                 ON CONFLICT (account_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    official_name = EXCLUDED.official_name,
                    type = EXCLUDED.type,
                    subtype = EXCLUDED.subtype,
                    current_balance = EXCLUDED.current_balance,
                    available_balance = EXCLUDED.available_balance,
                    iso_currency_code = EXCLUDED.iso_currency_code,
                    last_synced = NOW()`,
                [
                    account.account_id,
                    uid,
                    item_id,
                    account.name,
                    account.official_name || null,
                    account.type,
                    account.subtype || null,
                    account.balances.current,
                    account.balances.available,
                    account.balances.iso_currency_code || null,
                ]
            );
        }

        console.log(`[TransactionSync] Synced ${accounts.length} transaction accounts for item ${item_id}`);
        return accounts;
    }

    /**
     * Cursor-based sync using /transactions/sync.
     * Fetches all pages until has_more is false, then persists to DB.
     */
    static async syncTransactions(uid, item_id) {
        const rows = await db.queryDbValues(
            'SELECT access_token FROM plaid_connections WHERE uid = $1 AND item_id = $2 AND product = $3',
            [uid, item_id, 'transactions']
        );

        if (!rows[0]) throw new Error('No transactions connection found for this item');
        const { access_token } = rows[0];

        // Sync accounts first so FK constraints are satisfied when inserting transactions
        await TransactionSync.syncAccounts(uid, access_token, item_id);

        // Load existing cursor (null = first sync, returns full 24-month history)
        const cursorRows = await db.queryDbValues(
            'SELECT cursor FROM plaid_sync_cursors WHERE item_id = $1',
            [item_id]
        );
        let cursor = cursorRows[0]?.cursor || null;

        let added = [], modified = [], removed = [];
        let hasMore = true;

        while (hasMore) {
            const response = await plaidClient.transactionsSync({ access_token, cursor });
            const data = response.data;

            added = added.concat(data.added);
            modified = modified.concat(data.modified);
            removed = removed.concat(data.removed);

            hasMore = data.has_more;
            cursor = data.next_cursor;
        }

        console.log(`[TransactionSync] item ${item_id}: +${added.length} ~${modified.length} -${removed.length}`);

        await TransactionSync._persistData(uid, item_id, added, modified, removed, cursor);

        return {
            added: added.length,
            modified: modified.length,
            removed: removed.length,
        };
    }

    /**
     * Persist transaction changes + updated cursor inside a DB transaction.
     */
    static async _persistData(uid, item_id, added, modified, removed, cursor) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Insert new transactions
            for (const t of added) {
                const m = TransactionSync._mapTransaction(t, uid);
                await client.query(
                    `INSERT INTO plaid_transactions
                        (transaction_id, account_id, uid, amount, date, authorized_date,
                         name, merchant_name, category_primary, category_detailed,
                         payment_channel, pending, iso_currency_code, logo_url)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
                     ON CONFLICT (transaction_id) DO NOTHING`,
                    [
                        m.transaction_id, m.account_id, uid, m.amount, m.date,
                        m.authorized_date, m.name, m.merchant_name,
                        m.category_primary, m.category_detailed,
                        m.payment_channel, m.pending, m.iso_currency_code, m.logo_url,
                    ]
                );
            }

            // Update modified transactions
            for (const t of modified) {
                const m = TransactionSync._mapTransaction(t, uid);
                await client.query(
                    `UPDATE plaid_transactions SET
                        amount = $2, date = $3, authorized_date = $4,
                        name = $5, merchant_name = $6,
                        category_primary = $7, category_detailed = $8,
                        payment_channel = $9, pending = $10,
                        iso_currency_code = $11, logo_url = $12
                     WHERE transaction_id = $1`,
                    [
                        m.transaction_id, m.amount, m.date, m.authorized_date,
                        m.name, m.merchant_name, m.category_primary, m.category_detailed,
                        m.payment_channel, m.pending, m.iso_currency_code, m.logo_url,
                    ]
                );
            }

            // Delete removed transactions
            for (const r of removed) {
                await client.query(
                    'DELETE FROM plaid_transactions WHERE transaction_id = $1',
                    [r.transaction_id]
                );
            }

            // Upsert cursor
            await client.query(
                `INSERT INTO plaid_sync_cursors (item_id, uid, cursor, last_synced)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (item_id) DO UPDATE SET
                    cursor = EXCLUDED.cursor,
                    last_synced = NOW()`,
                [item_id, uid, cursor]
            );

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    /**
     * Map a raw Plaid transaction to the plaid_transactions schema.
     */
    static _mapTransaction(t, uid) {
        return {
            transaction_id: t.transaction_id,
            account_id: t.account_id,
            uid,
            amount: t.amount,
            date: t.date,
            authorized_date: t.authorized_date || null,
            name: t.name,
            merchant_name: t.merchant_name || null,
            category_primary: t.personal_finance_category?.primary || null,
            category_detailed: t.personal_finance_category?.detailed || null,
            payment_channel: t.payment_channel || null,
            pending: t.pending,
            iso_currency_code: t.iso_currency_code || null,
            logo_url: t.logo_url || null,
        };
    }
}

module.exports = TransactionSync;
