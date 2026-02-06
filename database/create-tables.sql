-- Use the existing database
USE aroxa_cropscience;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS admin_sessions;

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    technical_name VARCHAR(255),
    pack_size VARCHAR(100),
    uid_no VARCHAR(100) NOT NULL,
    batch_no VARCHAR(50) NOT NULL UNIQUE,
    mfg_date DATE,
    exp_date DATE NOT NULL,
    web_link TEXT,
    price DECIMAL(10, 2),
    unit_price DECIMAL(10, 2),
    manufactured_by VARCHAR(255),
    marketed_by VARCHAR(255),
    recommendation TEXT,
    how_to_use LONGTEXT,
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_batch_no (batch_no),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Sessions Table
CREATE TABLE admin_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_token (session_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Show created tables
SHOW TABLES;

-- Show structure of products table
DESCRIBE products;

-- Show structure of admin_sessions table
DESCRIBE admin_sessions;
