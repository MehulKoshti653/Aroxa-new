import { runMigrations } from '../lib/migrations';

async function main() {
  console.log('Starting database migrations...\n');

  try {
    await runMigrations();
    console.log('\n✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
