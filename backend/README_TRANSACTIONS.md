# Plaid Transactions Integration

This document provides information about the Plaid Transactions integration in the portfolio tracker application.

## Overview

The Plaid Transactions integration allows users to sync their financial transactions from connected bank accounts and credit cards. The implementation uses Plaid's `transactionsSync` API, which provides an efficient way to keep transaction data up-to-date by only fetching new, modified, or removed transactions since the last sync.

## Database Schema

The integration adds two new tables to the database:

1. `plaid_sync_cursors` - Stores the sync cursor for each Plaid item, which is used to track the sync state.
2. `plaid_transactions` - Stores the transaction data fetched from Plaid.

To apply the schema to your database, run:

```bash
npm run apply-transaction-schema
```

## API Endpoints

### Sync Transactions

**Endpoint:** `POST /transactions/sync`

**Authentication:** Required

**Request Body:**
```json
{
  "item_id": "your_plaid_item_id"
}
```

**Response:**
```json
{
  "success": true,
  "added": 10,
  "modified": 2,
  "removed": 1
}
```

### Get Transactions

**Endpoint:** `GET /transactions`

**Authentication:** Required

**Query Parameters:**
- `item_id` (optional) - Filter by Plaid item ID
- `account_id` (optional) - Filter by account ID
- `start_date` (optional) - Filter by start date (YYYY-MM-DD)
- `end_date` (optional) - Filter by end date (YYYY-MM-DD)
- `limit` (optional, default: 50) - Number of transactions to return
- `offset` (optional, default: 0) - Offset for pagination

**Response:**
```json
{
  "transactions": [
    {
      "id": 1,
      "uid": 123,
      "item_id": "abc123",
      "account_id": "def456",
      "transaction_id": "ghi789",
      "category": ["Food and Drink", "Restaurants"],
      "transaction_type": "place",
      "name": "Restaurant Name",
      "amount": 25.50,
      "date": "2025-03-15",
      "pending": false,
      "merchant_name": "Restaurant Corp",
      "payment_channel": "in store"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

## Implementation Details

### Transaction Syncing Process

1. The `SyncTransactions` method in the `Transactions` class handles the syncing process.
2. It retrieves the access token for the specified Plaid item.
3. It gets the latest cursor from the database (or null if this is the first sync).
4. It calls the Plaid `transactionsSync` API with the cursor, handling pagination if necessary.
5. It calls the `applyUpdates` method to persist the changes to the database.

### Transaction Updates

The `applyUpdates` method handles three types of updates:

1. **Added Transactions** - New transactions that weren't previously synced.
2. **Modified Transactions** - Existing transactions that have been updated.
3. **Removed Transactions** - Transactions that have been deleted or no longer available.

All updates are performed within a database transaction to ensure data consistency.

## Usage Example

To sync transactions for a Plaid item:

```javascript
// Frontend code example
async function syncTransactions(itemId) {
  try {
    const response = await fetch('/transactions/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify({ item_id: itemId })
    });
    
    const data = await response.json();
    console.log(`Synced ${data.added} new transactions`);
    return data;
  } catch (error) {
    console.error('Error syncing transactions:', error);
    throw error;
  }
}
```

To retrieve transactions:

```javascript
// Frontend code example
async function getTransactions(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`/transactions?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
}
```
