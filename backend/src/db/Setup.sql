DROP TABLE IF EXISTS AccountInfo;
DROP TABLE IF EXISTS Login;
DROP TABLE IF EXISTS Account;

CREATE TABLE Account (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(63) UNIQUE NOT NULL,
	username VARCHAR(24) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
    verified boolean DEFAULT FALSE
    
);

CREATE TABLE Login (
	email VARCHAR(63) PRIMARY KEY,
	password VARCHAR(80),
    FOREIGN KEY (email) REFERENCES Account(email)
    ON DELETE CASCADE
);

CREATE TABLE AccountInfo (
    user_id integer PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES Account(user_id)
    ON DELETE CASCADE,
    given_name VARCHAR(24) DEFAULT NULL,
    family_name VARCHAR(24) DEFAULT NULL,
    age integer DEFAULT NULL,
    country VARCHAR(24) DEFAULT NULL
);

INSERT INTO Account(email, username, created_on, verified) VALUES
('test1@test1.com', '1', '2023-10-10 00:00:00', TRUE),
('1', '4', '2023-10-10 00:00:00', TRUE),
('test2@test1.com', '2', '2023-10-10 00:00:00', FALSE);

INSERT INTO Login(email, password) VALUES
('test1@test1.com', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO'),
('1', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO'),
('test2@test1.com', '$2b$10$O0u7e875hwBfQtVVf/SY5uDy29d2Eqhw9N7BY2wsTZMb91US/LcJO');
