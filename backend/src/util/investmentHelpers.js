function calculatePortfolioOverview(accounts) {
    let totalPortfolioValue = 0;
    let totalCashEquiv = 0;
    let totalInvestmentValue = 0;
    let totalPortfolioCostBasis = 0;

    const securityMap = {};

    accounts.forEach(account => {
        account.holdings.forEach(holding => {
            const securityId = holding.security_id;
            const quantity = holding.quantity;
            const costBasis = holding.buy_price * quantity;

            totalPortfolioValue += holding.current_value;

            if (!securityMap[securityId]) {
                securityMap[securityId] = {
                    security_id: holding.security_id,
                    name: holding.name,
                    ticker: holding.ticker,
                    type: holding.type,
                    totalQuantity: 0,
                    totalCostBasis: 0,
                    currentPrice: holding.current_price,
                    iso_currency_code: holding.iso_currency_code,
                    is_cash_equivalent: holding.is_cash_equivalent,
                    sector: holding.sector,
                };
            }

            securityMap[securityId].totalQuantity += quantity;
            securityMap[securityId].totalCostBasis += costBasis;
        });

        totalPortfolioCostBasis += account.holdings.reduce((sum, holding) => sum + holding.buy_price * holding.quantity, 0);
        totalCashEquiv += account.holdings.filter(holding => holding.is_cash_equivalent).reduce((sum, holding) => sum + holding.current_value, 0);
        totalInvestmentValue += account.holdings.filter(holding => !holding.is_cash_equivalent).reduce((sum, holding) => sum + holding.current_value, 0);
    });

    const portfolioOverview = Object.values(securityMap).map(security => {
        const averageBuyPrice = security.totalCostBasis / security.totalQuantity;
        return {
            security_id: security.security_id,
            name: security.name,
            ticker: security.ticker,
            type: security.type,
            totalQuantity: security.totalQuantity,
            averageBuyPrice: averageBuyPrice,
            currentPrice: security.currentPrice,
            iso_currency_code: security.iso_currency_code,
            is_cash_equivalent: security.is_cash_equivalent,
            sector: security.sector,
        };
    });

    const totalPortfolioGain = totalPortfolioValue - totalPortfolioCostBasis;
    const totalPortfolioGainPercentage = totalPortfolioCostBasis === 0 ? 0 : (totalPortfolioGain / totalPortfolioCostBasis) * 100;

    return {
        overall: {
            totalAccountValue: totalPortfolioValue,
            totalCashEquiv: totalCashEquiv,
            totalInvestmentValue: totalInvestmentValue,
            totalPortfolioCostBasis: totalPortfolioCostBasis,
            totalPortfolioGain: totalPortfolioGain,
            totalPortfolioGainPercentage: totalPortfolioGainPercentage,
        },
        holdings: portfolioOverview
    };
}


function processHoldings(data) {
    const accounts = data.accounts;
    const holdings = data.holdings;
    const securities = data.securities;

    // Create a map of securities by ID for easy lookup
    const securityMap = {};
    securities.forEach(security => {
        securityMap[security.security_id] = security;
    });

    // Process accounts and their holdings — skip depository/credit accounts
    const processedAccounts = accounts.filter(a => a.type === 'investment').map(account => {
        const accountHoldings = holdings.filter(holding => holding.account_id === account.account_id);

        const detailedHoldings = accountHoldings.map(holding => {
            const security = securityMap[holding.security_id];
            return {
                security_id: holding.security_id,
                name: security?.name || 'Unknown',
                ticker: security?.ticker_symbol || 'N/A',
                type: security?.type || 'Unknown',
                current_price: holding.institution_price,
                buy_price: holding.cost_basis,
                quantity: holding.quantity,
                current_value: holding.institution_value,
                iso_currency_code: holding.iso_currency_code,
                close_price_as_of: security?.close_price_as_of,
                close_price: security?.close_price,
                market_identifier_code: security?.market_identifier_code,
                is_cash_equivalent: security?.is_cash_equivalent,
                sector: security?.sector,
            };
        });

        const totalAccountValue = accountHoldings.reduce((sum, holding) => sum + holding.institution_value, 0);

        return {
            account_id: account.account_id,
            name: account.name,
            official_name: account.official_name,
            subtype: account.subtype,
            type: account.type,
            current_balance: account.balances.current,
            iso_currency_code: account.balances.iso_currency_code,
            holdings_count: detailedHoldings.length,
            holdings: detailedHoldings,
            total_value: totalAccountValue,
        };
    });

    return processedAccounts;
}

function calculateDashboardOverview(institutionsSyncData, totalPortfolioValue) {
    const holdingsMap = {};
    let totalAccounts = 0;

    institutionsSyncData.forEach(inst => {
        const accounts = inst.data?.processed || [];
        totalAccounts += accounts.length;

        const holdings = inst.data?.portfolioOverview?.holdings || [];
        holdings.forEach(holding => {
            const key = holding.ticker || holding.name;
            const value = holding.currentPrice * holding.totalQuantity;
            const costBasis = holding.averageBuyPrice * holding.totalQuantity;

            if (holdingsMap[key]) {
                holdingsMap[key].totalQuantity += holding.totalQuantity;
                holdingsMap[key].totalValue += value;
                holdingsMap[key].totalCostBasis += costBasis;
            } else {
                holdingsMap[key] = {
                    ticker: holding.ticker,
                    name: holding.name,
                    type: holding.type,
                    isCash: holding.is_cash_equivalent,
                    currentPrice: holding.currentPrice,
                    totalQuantity: holding.totalQuantity,
                    totalValue: value,
                    totalCostBasis: costBasis,
                };
            }
        });
    });

    const allHoldings = Object.values(holdingsMap).map(h => ({
        ...h,
        avgCostBasis: h.totalQuantity === 0 ? 0 : h.totalCostBasis / h.totalQuantity,
        gain: h.totalValue - h.totalCostBasis,
        gainPercent: h.totalCostBasis === 0 ? 0 : ((h.totalValue - h.totalCostBasis) / h.totalCostBasis) * 100,
        portfolioPercent: totalPortfolioValue === 0 ? 0 : (h.totalValue / totalPortfolioValue) * 100,
    })).sort((a, b) => {
        if (a.isCash !== b.isCash) return a.isCash ? 1 : -1;
        return b.totalValue - a.totalValue;
    });

    const pieChartData = allHoldings
        .filter(h => !h.isCash)
        .map(h => ({ label: h.ticker || h.name, value: h.totalValue }));

    const topInstitutions = institutionsSyncData
        .map(inst => ({
            institution_id: inst.institution_id,
            institution_name: inst.institution_name,
            institution_logo: inst.institution_logo,
            totalValue: inst.data?.portfolioOverview?.overall?.totalAccountValue || 0,
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 3);

    return {
        totalInstitutions: institutionsSyncData.length,
        totalAccounts,
        uniqueHoldings: Object.keys(holdingsMap).length,
        allHoldings,
        pieChartData,
        topInstitutions,
    };
}

module.exports = { processHoldings, calculatePortfolioOverview, calculateDashboardOverview };