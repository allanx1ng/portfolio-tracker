const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();
const InvestmentSync = require('./InvestmentSync');

class Investments {
    static async getAllInvestments(req, res) {
        try {
            const { uid } = req.user;

            // 1. Query the DB for all institution IDs and names
            const query = `
                SELECT DISTINCT institution_id, institution_name
                FROM plaid_connections
                WHERE uid = $1 AND product = $2
            `;
            const result = await db.queryDbValues(query, [uid, 'investments']);
            console.log(result)

            if (!result[0] || result.length === 0) {
                return res.status(200).json({
                    message: 'No connected investment accounts found',
                    institutions: [],
                    overallPortfolioOverview: {}
                });
            }

            const institutionsData = result.map(row => ({
                institution_id: row.institution_id,
                institution_name: row.institution_name
            }));

            // 2. Call InvestmentSync for all different institutions
            const institutionsSyncData = [];
            for (const institution of institutionsData) {
                const { institution_id, institution_name } = institution;

                // Mock request and response objects for InvestmentSync
                const reqMock = {
                    user: { uid },
                    body: { institution_id: institution_id },
                    // query: { institution_id: institutionId } // Ensure institution_id is in query as well
                };
                const resMock = {
                    status: (code) => ({
                        json: (data) => {
                            return { code, data }; // Return code and data for processing
                        }
                    })
                };

                const syncResult = await InvestmentSync.syncHoldings(reqMock, resMock);

                if (syncResult && syncResult.code === 200) {
                    institutionsSyncData.push({
                        institution_id: institution_id,
                        institution_name: institution_name,
                        data: syncResult.data.data,
                    });
                } else {
                    console.error(`Failed to sync investments for institution ${institution_id}`);
                }
            }

            // 4. Calculate overall portfolio overview across all accounts
            let overallTotalPortfolioValue = 0;
            let overallTotalCashEquiv = 0;
            let overallTotalInvestmentValue = 0;
            let overallTotalPortfolioGain = 0;
            let overallTotalPortfolioGainPercentage = 0;

            institutionsSyncData.forEach(institutionData => {
                if (institutionData.data && institutionData.data.portfolioOverview) {
                    overallTotalPortfolioValue += institutionData.data.portfolioOverview.totalAccountValue;
                    overallTotalCashEquiv += institutionData.data.portfolioOverview.totalCashEquiv;
                    overallTotalInvestmentValue += institutionData.data.portfolioOverview.totalInvestmentValue;
                    overallTotalPortfolioGain += institutionData.data.portfolioOverview.totalPortfolioGain;
                }
            });

            overallTotalPortfolioGainPercentage = overallTotalPortfolioValue === 0 ? 0 : (overallTotalPortfolioGain / overallTotalPortfolioValue) * 100;

            const overallPortfolioOverview = {
                totalAccountValue: overallTotalPortfolioValue,
                totalCashEquiv: overallTotalCashEquiv,
                totalInvestmentValue: overallTotalInvestmentValue,
                totalPortfolioGain: overallTotalPortfolioGain,
                totalPortfolioGainPercentage: overallTotalPortfolioGainPercentage,
            };

            // 3. Gather the results in an array and return them
            return res.status(200).json({
                institutions: institutionsSyncData,
                overallPortfolioOverview: overallPortfolioOverview
            });

        } catch (err) {
            console.error('Error fetching all investments:', err);
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = Investments;