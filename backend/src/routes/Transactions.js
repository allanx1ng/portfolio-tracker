const plaidClient = require('../util/plaid');
const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();

class Transactions {
    /**
     * Retrieve the latest cursor for an item_id from the database, or null if not found
     * @param {string} itemId - The Plaid item ID
     * @returns {Promise<string|null>} The cursor or null if not found
     */
    static async getLatestCursorOrNull(itemId) {
        const query = "SELECT cursor FROM plaid_sync_cursors WHERE item_id = $1";
        const result = await db.queryDbValues(query, [itemId]);
        
        if (result && result.length > 0) {
            return result[0].cursor;
        }
        return null;
    }

    /**
     * Apply transaction updates from Plaid sync
     * @param {string} itemId - The Plaid item ID
     * @param {number} uid - User ID
     * @param {Array} added - Array of transactions to add
     * @param {Array} modified - Array of transactions to modify
     * @param {Array} removed - Array of transaction IDs to remove
     * @param {string} cursor - The new cursor value
     * @returns {Promise<void>}
     */
    static async applyUpdates(itemId, uid, added, modified, removed, cursor) {
        const client = await db.pool.connect();
        
        try {
            // Start a transaction
            await client.query('BEGIN');
            
            // Process added transactions
            if (added.length > 0) {
                for (const transaction of added) {
                    const query = `
                        INSERT INTO plaid_transactions 
                        (uid, item_id, account_id, transaction_id, category, transaction_type, 
                        name, amount, date, pending, merchant_name, payment_channel) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                        ON CONFLICT (transaction_id) DO NOTHING
                    `;
                    
                    await client.query(query, [
                        uid,
                        itemId,
                        transaction.account_id,
                        transaction.transaction_id,
                        transaction.category || [],
                        transaction.transaction_type,
                        transaction.name,
                        transaction.amount,
                        transaction.date,
                        transaction.pending,
                        transaction.merchant_name,
                        transaction.payment_channel
                    ]);
                }
            }
            
            // Process modified transactions
            if (modified.length > 0) {
                for (const transaction of modified) {
                    const query = `
                        UPDATE plaid_transactions SET
                        account_id = $3,
                        category = $4,
                        transaction_type = $5,
                        name = $6,
                        amount = $7,
                        date = $8,
                        pending = $9,
                        merchant_name = $10,
                        payment_channel = $11
                        WHERE transaction_id = $2 AND uid = $1
                    `;
                    
                    await client.query(query, [
                        uid,
                        transaction.transaction_id,
                        transaction.account_id,
                        transaction.category || [],
                        transaction.transaction_type,
                        transaction.name,
                        transaction.amount,
                        transaction.date,
                        transaction.pending,
                        transaction.merchant_name,
                        transaction.payment_channel
                    ]);
                }
            }
            
            // Process removed transactions
            if (removed.length > 0) {
                for (const removedTrans of removed) {
                    await client.query(
                        'DELETE FROM plaid_transactions WHERE transaction_id = $1 AND uid = $2',
                        [removedTrans.transaction_id, uid]
                    );
                }
            }
            
            // Update cursor
            await client.query(`
                INSERT INTO plaid_sync_cursors (item_id, cursor, last_synced) 
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                ON CONFLICT (item_id, cursor) 
                DO UPDATE SET 
                last_synced = CURRENT_TIMESTAMP
            `, [itemId, cursor]);
            
            // Commit transaction
            await client.query('COMMIT');
            
        } catch (error) {
            // Rollback in case of error
            await client.query('ROLLBACK');
            console.error('Error in applyUpdates:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Sync transactions for a specific Plaid item
     * This implements the Plaid transactionsSync API to fetch new, modified, and removed transactions
     */
    static async SyncTransactions(req, res) {
        try {
            const { item_id } = req.body;
            const { uid } = req.user;

            // Get access token for the item
            const tokenQuery = `SELECT access_token FROM plaid_connections WHERE uid = $1 AND item_id = $2`;
            const tokenResult = await db.queryDbValues(tokenQuery, [uid, item_id]);
            
            if (!tokenResult || tokenResult.length === 0) {
                return res.status(404).json({ error: 'Plaid connection not found' });
            }
            
            const accessToken = tokenResult[0].access_token;
            
            // Get the latest cursor from the database, or null if this is the first sync
            let cursor = await Transactions.getLatestCursorOrNull(item_id);
            
            // New transaction updates since "cursor"
            let added = [];
            let modified = [];
            // Removed transaction ids
            let removed = [];
            let hasMore = true;
            
            // Iterate through each page of new transaction updates for item
            while (hasMore) {
                const request = {
                    access_token: accessToken,
                    cursor: cursor,
                };
                
                const response = await plaidClient.transactionsSync(request);
                const data = response.data;
                
                // Add this page of results
                added = added.concat(data.added);
                modified = modified.concat(data.modified);
                removed = removed.concat(data.removed);
                
                hasMore = data.has_more;
                
                // Update cursor to the next cursor
                cursor = data.next_cursor;
            }
            
            // Persist cursor and updated data
            await Transactions.applyUpdates(item_id, uid, added, modified, removed, cursor);
            
            return res.status(200).json({
                success: true,
                added: added.length,
                modified: modified.length,
                removed: removed.length
            });
        } catch (error) {
            console.error('Error syncing transactions:', error);
            return res.status(500).json({ 
                error: 'Failed to sync transactions',
                message: error.message 
            });
        }
    }
    
    /**
     * Get transactions for a user
     */
    static async GetTransactions(req, res) {
        try {
            const { uid } = req.user;
            const { 
                item_id, 
                account_id, 
                start_date, 
                end_date,
                limit = 50,
                offset = 0
            } = req.query;
            
            // Build the query based on provided filters
            let query = 'SELECT * FROM plaid_transactions WHERE uid = $1';
            const queryParams = [uid];
            let paramIndex = 2;
            
            if (item_id) {
                query += ` AND item_id = $${paramIndex}`;
                queryParams.push(item_id);
                paramIndex++;
            }
            
            if (account_id) {
                query += ` AND account_id = $${paramIndex}`;
                queryParams.push(account_id);
                paramIndex++;
            }
            
            if (start_date) {
                query += ` AND date >= $${paramIndex}`;
                queryParams.push(start_date);
                paramIndex++;
            }
            
            if (end_date) {
                query += ` AND date <= $${paramIndex}`;
                queryParams.push(end_date);
                paramIndex++;
            }
            
            // Add sorting and pagination
            query += ' ORDER BY date DESC LIMIT $' + paramIndex + ' OFFSET $' + (paramIndex + 1);
            queryParams.push(limit, offset);
            
            const transactions = await db.queryDbValues(query, queryParams);
            
            // Get total count for pagination
            let countQuery = 'SELECT COUNT(*) as total FROM plaid_transactions WHERE uid = $1';
            let countParams = [uid];
            paramIndex = 2;
            
            if (item_id) {
                countQuery += ` AND item_id = $${paramIndex}`;
                countParams.push(item_id);
                paramIndex++;
            }
            
            if (account_id) {
                countQuery += ` AND account_id = $${paramIndex}`;
                countParams.push(account_id);
                paramIndex++;
            }
            
            if (start_date) {
                countQuery += ` AND date >= $${paramIndex}`;
                countParams.push(start_date);
                paramIndex++;
            }
            
            if (end_date) {
                countQuery += ` AND date <= $${paramIndex}`;
                countParams.push(end_date);
                paramIndex++;
            }
            
            const countResult = await db.queryDbValues(countQuery, countParams);
            const total = parseInt(countResult[0].total);
            
            return res.status(200).json({
                transactions,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    has_more: total > (parseInt(offset) + parseInt(limit))
                }
            });
        } catch (error) {
            console.error('Error getting transactions:', error);
            return res.status(500).json({ 
                error: 'Failed to get transactions',
                message: error.message 
            });
        }
    }
}

module.exports = Transactions;
