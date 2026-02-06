-- Create Database
CREATE DATABASE IF NOT EXISTS aroxa_cropscience;
USE aroxa_cropscience;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
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
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_token (session_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
