const TransactionSync = require('./TransactionSync');
const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();

class Transactions {
    /**
     * POST /transactions/sync
     * Body: { item_id }
     * Triggers a cursor-based sync for the given item.
     */
    static async syncTransactions(req, res) {
        try {
            const { uid } = req.user;
            const { item_id } = req.body;

            if (!item_id) {
                return res.status(400).json({ error: 'item_id is required' });
            }

            const result = await TransactionSync.syncTransactions(uid, item_id);

            return res.status(200).json({ success: true, ...result });
        } catch (err) {
            console.error('Error syncing transactions:', err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * GET /transactions
     * Query params: account_id, start_date, end_date, limit, offset
     */
    static async getTransactions(req, res) {
        try {
            const { uid } = req.user;
            const {
                account_id,
                start_date,
                end_date,
                limit = 50,
                offset = 0,
            } = req.query;

            let query = `
                SELECT t.*, a.name as account_name, a.type as account_type, a.subtype as account_subtype
                FROM plaid_transactions t
                JOIN plaid_transaction_accounts a ON t.account_id = a.account_id
                WHERE t.uid = $1
            `;
            const params = [uid];
            let i = 2;

            if (account_id) {
                query += ` AND t.account_id = $${i++}`;
                params.push(account_id);
            }
            if (start_date) {
                query += ` AND t.date >= $${i++}`;
                params.push(start_date);
            }
            if (end_date) {
                query += ` AND t.date <= $${i++}`;
                params.push(end_date);
            }

            query += ` ORDER BY t.date DESC, t.transaction_id DESC`;
            query += ` LIMIT $${i++} OFFSET $${i++}`;
            params.push(parseInt(limit), parseInt(offset));

            const transactions = await db.queryDbValues(query, params);

            return res.status(200).json({ transactions });
        } catch (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * GET /transactions/accounts
     * Returns all linked transaction accounts for the user.
     */
    static async getAccounts(req, res) {
        try {
            const { uid } = req.user;

            const accounts = await db.queryDbValues(
                `SELECT a.*, c.institution_name, c.institution_logo
                 FROM plaid_transaction_accounts a
                 JOIN plaid_connections c ON a.item_id = c.item_id
                 WHERE a.uid = $1
                 ORDER BY c.institution_name, a.name`,
                [uid]
            );

            return res.status(200).json({ accounts });
        } catch (err) {
            console.error('Error fetching transaction accounts:', err);
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = Transactions;
