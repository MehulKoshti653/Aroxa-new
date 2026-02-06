import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAdminSession } from '@/lib/utils';

// GET all custom fields
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM custom_fields ORDER BY field_order ASC'
    );

    return NextResponse.json({ fields: rows });
  } catch (error) {
    console.error('Get custom fields error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom fields' },
      { status: 500 }
    );
  }
}

// POST create custom field
export async function POST(request: NextRequest) {
  try {
    // Validate admin session
    const sessionToken = request.cookies.get('admin_session')?.value;
    const isValid = await validateAdminSession(sessionToken);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate field_name (only alphanumeric and underscore)
    if (!/^[a-z][a-z0-9_]*$/i.test(data.field_name)) {
      return NextResponse.json(
        { error: 'Field name must start with a letter and contain only letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Get max field_order
    const [maxOrder] = await pool.execute(
      'SELECT MAX(field_order) as max_order FROM custom_fields'
    ) as [Array<{max_order: number | null}>, unknown];
    const nextOrder = (maxOrder[0].max_order || 0) + 1;

    // Insert custom field
    await pool.execute(
      `INSERT INTO custom_fields
       (field_name, field_label, field_type, is_required, max_length, placeholder, field_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.field_name,
        data.field_label,
        data.field_type,
        data.is_required ? 1 : 0,
        data.max_length || null,
        data.placeholder || null,
        nextOrder,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Create custom field error:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Field name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create custom field' },
      { status: 500 }
    );
  }
}
