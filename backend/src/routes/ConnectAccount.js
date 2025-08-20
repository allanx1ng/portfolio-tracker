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
                client_name: 'Portfolio Tracker',
                products: ['investments'],
                // products: ['investments', 'transactions'], // Include both transactions and investments
                // required_if_supported_products: ['transactions'],
                // transactions: {
                //     days_requested: 30
                // },
                country_codes: ['CA'], // Focus on Canadian institutions
                language: 'en',
                // institution_id: 'ins_42'
            };

            // Only add institution_id if it's provided
            // if (institution_id) {
            //     configs.institution_id = institution_id;
            // }
            try {
                const response = await plaidClient.linkTokenCreate(configs);
                console.log('response.data', response.data);
                res.json({ link_token: response.data.link_token });
            } catch (error) {
                console.error('Error creating link token:', error);
                return res.status(500).json({ error: 'Failed to create link token' });
            }

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async connectAccount(req, res) {
        try {
            const { public_token } = req.body;
            const { uid } = req.user;
            console.log(req.body);

            // Check if this institution is already connected for this user
            // const existingConnections = await db.queryDbValues(
            //     'SELECT institution_name FROM plaid_connections WHERE uid = $1 AND institution_id = $2',
            //     [uid, institution_id]
            // );

            // if (existingConnections && existingConnections.length > 0) {
            //     return res.status(409).json({
            //         error: 'Account already connected',
            //         message: `${institution_name} is already connected to your account. You can refresh your transactions from the dashboard.`,
            //         institutionId: institution_id
            //     });
            // }

            // Exchange public token for access token
            const tokenResponse = await plaidClient.itemPublicTokenExchange({
                public_token,
            });
            const { access_token, item_id } = tokenResponse.data;
            console.log(tokenResponse.data);
            console.log('plaid connect account')

            // Fetch institution_id using /item/get
            const itemResponse = await plaidClient.itemGet({ access_token });
            const institution_id = itemResponse.data.item.institution_id;
            const product = itemResponse.data.item.products[0]; // e.g. 'transactions' or 'investments'
            console.log(itemResponse.data);

            // Fetch institution_name using /institutions/get_by_id
            let institution_name = null;
            if (institution_id) {
                const instResponse = await plaidClient.institutionsGetById({
                    institution_id,
                    country_codes: ['CA'],
                });
                institution_name = instResponse.data.institution.name;
            }

            console.log({ access_token, item_id, institution_id, institution_name, product });
            // res.status(500).json({});
            // return

            // Store access token and account info in database
            const query = `
            INSERT INTO plaid_connections 
            (uid, access_token, item_id, institution_id, institution_name, product, last_updated)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            ON CONFLICT (uid, institution_id, product)
            DO UPDATE SET 
                access_token = EXCLUDED.access_token,
                item_id = EXCLUDED.item_id,
                institution_name = EXCLUDED.institution_name,
                last_updated = CURRENT_TIMESTAMP
            `;

            await db.queryDbValues(query, [
                uid,
                access_token,
                item_id,
                institution_id,
                institution_name,
                product
            ]);

            console.log('Account connected successfully, added to DB');

            // Trigger an initial transaction sync after connecting
            // This can be async - we don't need to wait for it to complete
            // try {
            //     const Transactions = require('./Transactions');
            //     Transactions.SyncTransactions({
            //         body: { item_id },
            //         user: { uid }
            //     }, {
            //         // Mock response object for background sync
            //         status: () => ({ json: () => { } })
            //     });
            // } catch (syncError) {
            //     console.error('Initial sync error (non-fatal):', syncError);
            // }

            // Try logging investments holdings
            try {
                const InvestmentSync = require('./InvestmentSync');
                await InvestmentSync.syncHoldings({
                    body: { institution_id },
                    user: { uid }
                }, {
                    status: () => ({ json: () => { } })
                });
            } catch (error) {
                console.error('Initial sync error (non-fatal):', error);
            }

            res.status(200).json({
                success: true,
                message: 'Account connected successfully'
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getHoldings(req, res) {
        try {
            const { uid } = req.user;
            const { institution_id } = req.body;

            // Get stored access token
            const connection = await db.queryDbValues(
                'SELECT access_token FROM plaid_connections WHERE uid = $1 AND institution_id = $2',
                [uid, institution_id]
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
