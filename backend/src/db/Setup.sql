DROP TABLE IF EXISTS AccountInfo
DROP TABLE IF EXISTS Login
DROP TABLE IF EXISTS Account

CREATE TABLE Account (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(63) UNIQUE NOT NULL,
	username VARCHAR(24) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
    verified boolean DEFAULT FALSE,
    
);

CREATE TABLE Login (
	username VARCHAR(20) PRIMARY KEY,
	password VARCHAR(80),
    FOREIGN KEY (username) REFERENCES Account(username)
    ON DELETE CASCADE,
);

CREATE TABLE AccountInfo (
    user_id integer PRIMARY KEY
    FOREIGN KEY (user_id) REFERENCES Account(user_id)
    ON DELETE CASCADE,
    given_name VARCHAR(24) DEFAULT NULL,
    family_name VARCHAR(24) DEFAULT NULL,
    age integer DEFAULT NULL,
    country VARCHAR(24) DEFAULT NULL
);