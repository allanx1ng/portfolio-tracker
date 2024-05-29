

DROP TABLE IF EXISTS Portfolio_assets CASCADE;
DROP TABLE IF EXISTS StockAsset CASCADE;
DROP TABLE IF EXISTS CryptoAsset CASCADE;
DROP TABLE IF EXISTS Asset CASCADE;
DROP TABLE IF EXISTS Portfolio CASCADE;
DROP TABLE IF EXISTS UserInfo CASCADE;
DROP TABLE IF EXISTS Login CASCADE;
DROP TABLE IF EXISTS UserAccount CASCADE;

DROP TABLE IF EXISTS AccountInfo;
DROP TABLE IF EXISTS Account;


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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid, portfolio_name),
    FOREIGN KEY (uid) REFERENCES useraccount(uid)
);

CREATE TABLE Asset (
    asset_name VARCHAR(60),
    asset_ticker VARCHAR(20),
    asset_type VARCHAR(20),
    PRIMARY KEY (asset_name, asset_ticker)
);

CREATE TABLE CryptoAsset (
    asset_name VARCHAR(60),
    asset_ticker VARCHAR(20),
    cmc_id int,
    decimals int,
    PRIMARY KEY (asset_name, asset_ticker),
    FOREIGN KEY (asset_name, asset_ticker) REFERENCES Asset(asset_name, asset_ticker)
);

CREATE TABLE StockAsset (
    asset_name VARCHAR(60),
    asset_ticker VARCHAR(20),
    exchange VARCHAR(60),
    industry VARCHAR(60),
    PRIMARY KEY (asset_name, asset_ticker),
    FOREIGN KEY (asset_name, asset_ticker) REFERENCES Asset(asset_name, asset_ticker)
);



CREATE TABLE Portfolio_assets (

    uid integer,
    portfolio_name VARCHAR(60),
    asset_name VARCHAR(60),
    asset_ticker VARCHAR(20),
    amount NUMERIC(36, 18),
    PRIMARY KEY (uid, portfolio_name, asset_name, asset_ticker),
    FOREIGN KEY (uid) REFERENCES useraccount(uid),
    FOREIGN KEY (portfolio_nam) REFERENCES Portfolio(portfolio_name),
    FOREIGN KEY (asset_name, asset_ticker) REFERENCES Asset(asset_name, asset_ticker)
);




INSERT INTO UserAccount(email, username, created_on, verified) VALUES
('test1@test1.com', '1', '2023-10-10 00:00:00', TRUE),
('1', '4', '2023-10-10 00:00:00', TRUE),
('test2@test1.com', '2', '2023-10-10 00:00:00', FALSE);

INSERT INTO Login(email, password) VALUES
('test1@test1.com', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO'),
('1', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO'),
('test2@test1.com', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO');
