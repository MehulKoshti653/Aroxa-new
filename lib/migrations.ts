import pool from './db';

export interface Migration {
  version: number;
  name: string;
  up: string;
  down: string;
}

// All migrations in order
export const migrations: Migration[] = [
  {
    version: 1,
    name: 'create_migrations_table',
    up: `
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        version INT NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    down: `DROP TABLE IF EXISTS migrations;`,
  },
  {
    version: 2,
    name: 'create_admin_sessions_table',
    up: `
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_token (session_token)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    down: `DROP TABLE IF EXISTS admin_sessions;`,
  },
  {
    version: 3,
    name: 'create_custom_fields_table',
    up: `
      CREATE TABLE IF NOT EXISTS custom_fields (
        id INT AUTO_INCREMENT PRIMARY KEY,
        field_name VARCHAR(100) NOT NULL UNIQUE,
        field_label VARCHAR(255) NOT NULL,
        field_type ENUM('text', 'number', 'date', 'textarea', 'url', 'email') NOT NULL DEFAULT 'text',
        is_required BOOLEAN DEFAULT FALSE,
        max_length INT DEFAULT NULL,
        placeholder VARCHAR(255) DEFAULT NULL,
        field_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_field_order (field_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    down: `DROP TABLE IF EXISTS custom_fields;`,
  },
  {
    version: 4,
    name: 'create_products_table',
    up: `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        batch_no VARCHAR(50) NOT NULL UNIQUE,
        product_image LONGTEXT,
        custom_data JSON,
        qr_code LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_batch_no (batch_no),
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    down: `DROP TABLE IF EXISTS products;`,
  },
  {
    version: 5,
    name: 'insert_default_custom_fields',
    up: `
      INSERT INTO custom_fields (field_name, field_label, field_type, is_required, max_length, placeholder, field_order) VALUES
      ('name', 'Product Name', 'text', TRUE, 255, 'Enter product name', 1),
      ('technical_name', 'Technical Name', 'text', FALSE, 255, 'Enter technical/scientific name', 2),
      ('pack_size', 'Pack Size', 'text', FALSE, 100, 'e.g., 100ml, 500g', 3),
      ('uid_no', 'UID Number', 'text', TRUE, 100, 'Enter unique identifier', 4),
      ('mfg_date', 'Manufacturing Date', 'date', FALSE, NULL, NULL, 5),
      ('exp_date', 'Expiry Date', 'date', TRUE, NULL, NULL, 6),
      ('web_link', 'Website Link', 'url', TRUE, NULL, 'https://example.com', 7),
      ('price', 'Price (MRP)', 'number', FALSE, NULL, '0.00', 8),
      ('unit_price', 'Unit per Price', 'number', FALSE, NULL, '0.00', 9),
      ('manufactured_by', 'Manufactured By', 'text', FALSE, 255, 'Manufacturer name', 10),
      ('marketed_by', 'Marketed By', 'text', FALSE, 255, 'Marketer name', 11),
      ('recommendation', 'Recommendation', 'textarea', FALSE, NULL, 'Usage recommendations', 12),
      ('how_to_use', 'How to Use', 'textarea', FALSE, NULL, 'Usage instructions', 13);
    `,
    down: `DELETE FROM custom_fields;`,
  },
  {
    version: 6,
    name: 'create_contact_inquiries_table',
    up: `
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NULL,
        subject VARCHAR(255) NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    down: `DROP TABLE IF EXISTS contact_inquiries;`,
  },
];

// Run pending migrations
export async function runMigrations() {
  const connection = await pool.getConnection();

  try {
    // Start transaction
    await connection.beginTransaction();

    // Create migrations table if it doesn't exist
    await connection.execute(migrations[0].up);

    // Get executed migrations
    const [executedMigrations] = await connection.execute(
      'SELECT version FROM migrations ORDER BY version'
    ) as [Array<{version: number}>, unknown];
    const executedVersions = executedMigrations.map((m) => m.version);

    // Run pending migrations
    for (const migration of migrations) {
      if (!executedVersions.includes(migration.version)) {
        console.log(`Running migration ${migration.version}: ${migration.name}`);

        // Execute migration
        await connection.execute(migration.up);

        // Record migration
        await connection.execute(
          'INSERT INTO migrations (version, name) VALUES (?, ?)',
          [migration.version, migration.name]
        );

        console.log(`✓ Migration ${migration.version} completed`);
      }
    }

    await connection.commit();
    console.log('All migrations completed successfully!');
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('Migration failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Rollback last migration
export async function rollbackMigration() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get last executed migration
    const [lastMigration] = await connection.execute(
      'SELECT version, name FROM migrations ORDER BY version DESC LIMIT 1'
    ) as [Array<{version: number, name: string}>, unknown];

    if (lastMigration.length === 0) {
      console.log('No migrations to rollback');
      return { success: false, message: 'No migrations to rollback' };
    }

    const version = lastMigration[0].version;
    const name = lastMigration[0].name;
    const migration = migrations.find(m => m.version === version);

    if (!migration) {
      throw new Error(`Migration ${version} not found`);
    }

    console.log(`Rolling back migration ${version}: ${name}`);

    // Execute rollback
    await connection.execute(migration.down);

    // Remove migration record
    await connection.execute('DELETE FROM migrations WHERE version = ?', [version]);

    await connection.commit();
    console.log(`✓ Migration ${version} rolled back`);
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('Rollback failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}
