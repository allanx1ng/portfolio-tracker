const plaidClient = require('../util/plaid');
const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();

const { processHoldings, calculatePortfolioOverview } = require('../util/investmentHelpers');

class InvestmentSync {
    static async syncHoldings(req, res) {
        try {
            const { uid } = req.user;
            const institution_id = req.body.institution_id || req.query.institution_id;

            // Get stored access token for this user/institution (for investments)
            const result = await db.queryDbValues(
                'SELECT access_token FROM plaid_connections WHERE uid = $1 AND institution_id = $2 AND product = $3',
                [uid, institution_id, 'investments']
            );

            const rows = result.rows || result; // Support both { rows: [...] } and [...] forms

            if (!rows[0]) {
                return res.status(404).json({ error: 'No connected investment account found' });
            }

            const { access_token } = rows[0];

            // Fetch current holdings from Plaid
            const holdingsResponse = await plaidClient.investmentsHoldingsGet({ access_token });
            // console.log('Current holdings:', holdingsResponse.data);
            const processed = processHoldings(holdingsResponse.data);
            const portfolioOverview = calculatePortfolioOverview(processed);

            // console.log('Processed holdings:', processed);
            // console.log('Portfolio overview:', portfolioOverview);

            // console.log('Processed holdings:', processed[5].holdings);

            return res.status(200).json({ success: true, data: {processed: processed, portfolioOverview: portfolioOverview} });
        } catch (err) {
            console.error('Error syncing holdings:', err);
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = InvestmentSync;