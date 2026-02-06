import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET single product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE slug = ?',
      [slug]
    ) as [Array<Record<string, unknown>>, unknown];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = {
      ...rows[0],
      custom_data: typeof rows[0].custom_data === 'string'
        ? JSON.parse(rows[0].custom_data as string)
        : rows[0].custom_data,
    };

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
