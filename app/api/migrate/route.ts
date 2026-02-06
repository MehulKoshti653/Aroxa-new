import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/migrations';

// API endpoint to run database migrations
// Visit: https://your-domain.vercel.app/api/migrate
export async function GET() {
  try {
    console.log('Starting database migrations...');
    const result = await runMigrations();

    return NextResponse.json({
      success: true,
      message: 'All migrations completed successfully!',
      result
    });
  } catch (error: unknown) {
    console.error('Migration failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
