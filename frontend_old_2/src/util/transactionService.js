// transactionService.js
import apiClient from './apiClient';

/**
 * Fetch transactions with optional filters
 * @param {Object} filters - Optional filters like account_id, start_date, etc.
 * @param {number} limit - Number of transactions to fetch (default: 50)
 * @param {number} offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} Response with transactions and pagination data
 */
export const fetchTransactions = async (filters = {}, limit = 50, offset = 0) => {
  const params = {
    ...filters,
    limit,
    offset
  };
  
  const response = await apiClient.get('/transactions', { params });
  return response.data;
};

/**
 * Sync transactions for a specific Plaid item
 * @param {string} itemId - The Plaid item ID to sync transactions for
 * @returns {Promise<Object>} Response with sync results
 */
export const syncTransactions = async (itemId) => {
  const response = await apiClient.post('/transactions/sync', { item_id: itemId });
  return response.data;
};

/**
 * Create a Plaid link token
 * @param {string} institutionId - Optional institution ID
 * @param {string} institutionName - Optional institution name
 * @returns {Promise<Object>} Response with link token
 */
export const createLinkToken = async (product = 'investments') => {
  const payload = { product };

  const response = await apiClient.post('/connect/plaid/create-link', payload);
  return response.data;
};

/**
 * Exchange a public token for an access token and store the connection
 * @param {string} publicToken - The public token from Plaid Link
 * @param {string} institutionId - The institution ID
 * @param {string} institutionName - The institution name
 * @returns {Promise<Object>} Response with connection result
 */
export const exchangePublicToken = async (publicToken) => {
  const response = await apiClient.post('/connect/plaid/exchange-token', {
    public_token: publicToken,
  });
  return response.data;
};

/**
 * Get connected financial accounts for the current user
 * @returns {Promise<Object>} Response with connected accounts
 */
export const getConnectedAccounts = async () => {
  const response = await apiClient.get('/connected-accounts');
  return response.data;
};

export const disconnectAccount = async (itemId) => {
  const response = await apiClient.post('/connected-accounts/disconnect', { item_id: itemId });
  return response.data;
};

/**
 * Get financial data including transactions, accounts, etc.
 * @param {Object} params - Optional parameters for data fetching
 * @returns {Promise<Object>} Consolidated financial data
 */
export const getFinancialData = async (params = {}) => {
  // This is a placeholder for a more comprehensive function
  // that would fetch multiple data types at once
  try {
    const transactions = await fetchTransactions(params);
    
    // In the future, you could add more API calls here
    // const accounts = await fetchAccounts();
    // const balanceHistory = await fetchBalanceHistory();
    
    return {
      transactions: transactions.transactions,
      pagination: transactions.pagination,
      // accounts,
      // balanceHistory,
      useMockData: false
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw error;
  }
};
