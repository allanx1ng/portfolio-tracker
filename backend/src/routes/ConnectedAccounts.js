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
}

module.exports = ConnectedAccounts;
