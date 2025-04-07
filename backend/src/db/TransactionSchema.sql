-- Add transaction-related tables to the database schema

-- Table to store transaction sync cursors
CREATE TABLE IF NOT EXISTS plaid_sync_cursors (
    item_id TEXT NOT NULL,
    cursor TEXT NOT NULL,
    last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (item_id, cursor),
    FOREIGN KEY (item_id) REFERENCES plaid_connections(item_id) ON DELETE CASCADE
);

-- Table to store transaction data
CREATE TABLE IF NOT EXISTS plaid_transactions (
    transaction_id TEXT PRIMARY KEY,
    uid INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    category TEXT[],
    transaction_type TEXT,
    name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    date DATE NOT NULL,
    pending BOOLEAN NOT NULL,
    merchant_name TEXT,
    payment_channel TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES plaid_connections(item_id) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES useraccount(uid)
);

-- Index on transaction_id for faster lookups during updates
CREATE INDEX IF NOT EXISTS idx_transaction_id ON plaid_transactions(transaction_id);
-- Index on uid for filtering by user
CREATE INDEX IF NOT EXISTS idx_transaction_uid ON plaid_transactions(uid);
-- Index on item_id for filtering by Plaid Item
CREATE INDEX IF NOT EXISTS idx_transaction_item ON plaid_transactions(item_id);
-- Index on account_id for filtering by account
CREATE INDEX IF NOT EXISTS idx_transaction_account ON plaid_transactions(account_id);
-- Index on date for date-range queries
CREATE INDEX IF NOT EXISTS idx_transaction_date ON plaid_transactions(date);
