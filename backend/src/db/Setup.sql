
DROP TABLE IF EXISTS plaid_connections CASCADE;
DROP TABLE IF EXISTS Portfolio_assets CASCADE;
DROP TABLE IF EXISTS StockAsset CASCADE;
DROP TABLE IF EXISTS CryptoAsset CASCADE;
DROP TABLE IF EXISTS Asset CASCADE;
DROP TABLE IF EXISTS Portfolio CASCADE;
DROP TABLE IF EXISTS UserInfo CASCADE;
DROP TABLE IF EXISTS GoogleLogin CASCADE;
DROP TABLE IF EXISTS Login CASCADE;
DROP TABLE IF EXISTS UserAccount CASCADE;

-- DROP TABLE IF EXISTS AccountInfo;
-- DROP TABLE IF EXISTS Account;


CREATE TABLE UserAccount (
    uid SERIAL PRIMARY KEY,
    email VARCHAR(63) UNIQUE NOT NULL,
	username VARCHAR(24) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
    verified boolean DEFAULT FALSE
    
);

CREATE TABLE Login (
	email VARCHAR(63) PRIMARY KEY,
	password VARCHAR(80),
    FOREIGN KEY (email) REFERENCES UserAccount(email)
    ON DELETE CASCADE
);

CREATE TABLE GoogleLogin (
    googleId VARCHAR(63) PRIMARY KEY,
    email VARCHAR(63) UNIQUE NOT NULL,
    FOREIGN KEY (email) REFERENCES UserAccount(email)
    ON DELETE CASCADE
)

CREATE TABLE UserInfo (
    uid integer PRIMARY KEY,
    FOREIGN KEY (uid) REFERENCES UserAccount(uid)
    ON DELETE CASCADE,
    given_name VARCHAR(24) DEFAULT NULL,
    family_name VARCHAR(24) DEFAULT NULL,
    age integer DEFAULT NULL,
    country VARCHAR(24) DEFAULT NULL
);

CREATE TABLE Portfolio (
    uid integer,
    portfolio_name VARCHAR(60),
    account_type VARCHAR(50), -- e.g., 'brokerage', 'exchange', 'wallet'
    provider VARCHAR(100), -- e.g., 'Wealthsimple', 'Binance'
    wallet_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid, portfolio_name),
    FOREIGN KEY (uid) REFERENCES useraccount(uid)
);
CREATE UNIQUE INDEX unique_wallet_address ON Portfolio (uid, wallet_address) WHERE wallet_address IS NOT NULL;

CREATE TABLE Asset (
    asset_id VARCHAR(20) PRIMARY KEY,
    asset_name VARCHAR(60),
    asset_ticker VARCHAR(20),
    asset_type VARCHAR(20) CHECK (asset_type IN ('coin', 'stock'))
);

CREATE TABLE CryptoAsset (
    asset_id VARCHAR(20) PRIMARY KEY,
    -- asset_name VARCHAR(60),
    -- asset_ticker VARCHAR(20),
    decimals int,
    latest_price NUMERIC(36, 18),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES Asset(asset_id)
);

CREATE TABLE StockAsset (
    asset_id VARCHAR(20) PRIMARY KEY,
    -- asset_name VARCHAR(60),
    -- asset_ticker VARCHAR(20),
    exchange VARCHAR(60),
    latest_price NUMERIC(36, 18),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES Asset(asset_id)
);



CREATE TABLE Portfolio_assets (

    uid integer,
    portfolio_name VARCHAR(60),
    asset_id VARCHAR(20),
    -- asset_name VARCHAR(60),
    -- asset_ticker VARCHAR(20),
    amount NUMERIC(36, 18),
    avg_price NUMERIC(36, 18),
    PRIMARY KEY (uid, portfolio_name, asset_id),
    -- FOREIGN KEY (uid) REFERENCES useraccount(uid),
    
    FOREIGN KEY (uid, portfolio_name) REFERENCES Portfolio(uid, portfolio_name),
    ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES Asset(asset_id)
    ON DELETE CASCADE
);

CREATE TABLE plaid_connections (
    item_id TEXT PRIMARY KEY,
    uid INTEGER REFERENCES useraccount(uid) ON DELETE RESTRICT,
    access_token TEXT NOT NULL,
    institution_id TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    product TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(uid, institution_id, product) -- Change unique constraint
);




INSERT INTO UserAccount(email, username, created_on, verified) VALUES
('test', '1', '2023-10-10 00:00:00', TRUE),
('1', '4', '2023-10-10 00:00:00', TRUE),
('test2@test1.com', '2', '2023-10-10 00:00:00', FALSE);

INSERT INTO Login(email, password) VALUES
('test', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO'),
('1', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO'),
('test2@test1.com', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO');
