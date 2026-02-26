const DatabaseInstance = require("../db/Database");
const db = DatabaseInstance.getInstance();
const InvestmentSync = require('./InvestmentSync');
const { calculatePortfolioOverview } = require('../util/investmentHelpers');

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

            return res.status(200).json({
                institutions: institutionsSyncData,
                overallPortfolioOverview: {
                    totalAccountValue: totalPortfolioValue,
                    totalCashEquiv,
                    totalInvestmentValue,
                    totalPortfolioGain,
                    totalPortfolioGainPercentage,
                }
            });
        } catch (err) {
            console.error('Error fetching all investments:', err);
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = Investments;
