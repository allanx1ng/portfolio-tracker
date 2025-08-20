function calculatePortfolioOverview(accounts) {
    const securityMap = {};

    accounts.forEach(account => {
        account.holdings.forEach(holding => {
            const securityId = holding.security_id;
            const quantity = holding.quantity;
            const costBasis = holding.buy_price * quantity;

            if (!securityMap[securityId]) {
                securityMap[securityId] = {
                    name: holding.name,
                    ticker: holding.ticker,
                    type: holding.type,
                    totalQuantity: 0,
                    totalCostBasis: 0,
                    currentPrice: holding.current_price,
                    iso_currency_code: holding.iso_currency_code,
                    is_cash_equivalent: holding.is_cash_equivalent,
                };
            }

            securityMap[securityId].totalQuantity += quantity;
            securityMap[securityId].totalCostBasis += costBasis;
        });
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
        };
    });

    return portfolioOverview;
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

    // Process accounts and their holdings
    const processedAccounts = accounts.map(account => {
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

module.exports = { processHoldings, calculatePortfolioOverview };