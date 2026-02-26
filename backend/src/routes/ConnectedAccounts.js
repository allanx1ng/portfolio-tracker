const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();

class ConnectedAccounts {
    /**
     * Get all connected Plaid accounts for a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async getConnectedAccounts(req, res) {
        try {
            const { uid } = req.user;
            
            // Query to get all connected accounts for the user
            const query = `
                SELECT 
                    item_id,
                    institution_id,
                    institution_name,
                    institution_logo,
                    product,
                    last_updated
                FROM 
                    plaid_connections 
                WHERE 
                    uid = $1
                ORDER BY 
                    last_updated DESC
            `;
            
            const connections = await db.queryDbValues(query, [uid]);
            
            if (!connections || connections.length === 0) {
                return res.status(200).json({ 
                    connections: [],
                    message: 'No connected accounts found' 
                });
            }
            
            return res.status(200).json({
                connections
            });
        } catch (error) {
            console.error('Error getting connected accounts:', error);
            return res.status(500).json({ 
                error: 'Failed to get connected accounts',
                message: error.message 
            });
        }
    }
    static async disconnectAccount(req, res) {
        try {
            const { uid } = req.user;
            const { item_id } = req.body;

            if (!item_id) {
                return res.status(400).json({ error: 'item_id is required' });
            }

            // Verify ownership and get connection details
            const connection = await db.queryDbValues(
                'SELECT access_token, institution_id FROM plaid_connections WHERE uid = $1 AND item_id = $2',
                [uid, item_id]
            );

            if (!connection || connection.length === 0) {
                return res.status(404).json({ error: 'Connection not found' });
            }

            const { access_token, institution_id } = connection[0];

            // Revoke access token with Plaid
            try {
                const plaidClient = require('../util/plaid');
                await plaidClient.itemRemove({ access_token });
            } catch (plaidErr) {
                console.error('Plaid itemRemove failed (non-fatal):', plaidErr.message);
            }

            // Delete cached investment data for this institution
            await db.queryDbValues(
                `DELETE FROM plaid_investment_holdings WHERE account_id IN (
                    SELECT account_id FROM plaid_investment_accounts WHERE uid = $1 AND institution_id = $2
                )`,
                [uid, institution_id]
            );
            await db.queryDbValues(
                'DELETE FROM plaid_investment_accounts WHERE uid = $1 AND institution_id = $2',
                [uid, institution_id]
            );

            // Delete the connection itself
            await db.queryDbValues(
                'DELETE FROM plaid_connections WHERE uid = $1 AND item_id = $2',
                [uid, item_id]
            );

            return res.status(200).json({ success: true, message: 'Account disconnected' });
        } catch (error) {
            console.error('Error disconnecting account:', error);
            return res.status(500).json({ error: 'Failed to disconnect account', message: error.message });
        }
    }
}

module.exports = ConnectedAccounts;
