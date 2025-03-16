const plaidClient = require('../util/plaid');
const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();

class ConnectAccount {
    static async createLinkToken(req, res) {
        try {
            const { uid } = req.user;
            const { institution_id, institution_name } = req.body;
            console.log(req.body);
            const configs = {
                user: { client_user_id: uid.toString() },
                client_name: 'Your App Name',
                products: ['transactions'],
                transactions: {
                    days_requested: 10
                  },
                country_codes: ['CA'],
                language: 'en',
                // institution_id: institution_id
            };
            
            const response = await plaidClient.linkTokenCreate(configs);
            console.log(response.data);
            res.json({ link_token: response.data.link_token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async connectBrokerage(req, res) {
        try {
            const { public_token, institution_id, institution_name } = req.body;
            const { uid } = req.user;
            console.log(req.body);
            // Exchange public token for access token
            const tokenResponse = await plaidClient.itemPublicTokenExchange({
                public_token,
            });
            const { access_token, item_id } = tokenResponse.data;
            console.log(access_token);

            // Get investment holdings
            const holdings = await plaidClient.investmentsHoldingsGet({
                access_token,
            });
            console.log(holdings.data)

            // Store access token and account info in database
            const query = `
            INSERT INTO plaid_connections 
            (uid, access_token, item_id, institution_id, institution_name) 
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (uid, institution_id) 
            DO UPDATE SET 
                access_token = EXCLUDED.access_token,
                item_id = EXCLUDED.item_id,
                last_updated = CURRENT_TIMESTAMP`;

        await db.queryDbValues(query, [
            uid, 
            access_token, 
            item_id, 
            institution_id, 
            institution_name
        ]);

            console.log('Account connected successfully');
            // Format holdings data for frontend
            const formattedHoldings = holdings.data.holdings.map(holding => ({
                security_id: holding.security_id,
                quantity: holding.quantity,
                value: holding.institution_value
            }));

            res.status(200).json({ holdings: formattedHoldings });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getHoldings(req, res) {
        try {
            const { uid } = req.user;

            // Get stored access token
            const connection = await db.queryDbValues(
                'SELECT access_token FROM plaid_connections WHERE uid = $1',
                [uid]
            );

            if (!connection.rows[0]) {
                return res.status(404).json({ error: 'No connected accounts found' });
            }

            const { access_token } = connection.rows[0];

            // Fetch latest holdings data
            const holdings = await plaidClient.investmentsHoldingsGet({
                access_token,
            });

            res.json({ holdings: holdings.data });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async plaid(req, res) {
        const request = {
            query: 'wealthsimple',
            products: ['investments'],
            country_codes: ['CA'],
        };
        try {
            const response = await plaidClient.institutionsSearch(request);
            const institutions = response.data.institutions;
            console.log(institutions);
        } catch (error) {
            // Handle error
        }
    }
}

module.exports = ConnectAccount;