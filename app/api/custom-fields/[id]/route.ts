import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAdminSession } from '@/lib/utils';

// PUT update custom field
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const data = await request.json();

    // Update custom field
    await pool.execute(
      `UPDATE custom_fields
       SET field_label = ?, field_type = ?, is_required = ?,
           max_length = ?, placeholder = ?
       WHERE id = ?`,
      [
        data.field_label,
        data.field_type,
        data.is_required ? 1 : 0,
        data.max_length || null,
        data.placeholder || null,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update custom field error:', error);
    return NextResponse.json(
      { error: 'Failed to update custom field' },
      { status: 500 }
    );
  }
}

// DELETE custom field
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Delete custom field
    await pool.execute('DELETE FROM custom_fields WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete custom field error:', error);
    return NextResponse.json(
      { error: 'Failed to delete custom field' },
      { status: 500 }
    );
  }
}
