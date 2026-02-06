import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import QRCode from 'qrcode';
import { generateBatchNumber, generateSlug, formatDate, validateAdminSession } from '@/lib/utils';

// GET all products with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) as total FROM products';
    const params: any[] = [];

    // Add search filter
    if (search) {
      const searchCondition = ` WHERE batch_no LIKE ? OR JSON_EXTRACT(custom_data, '$.name') LIKE ? OR JSON_EXTRACT(custom_data, '$.price') LIKE ?`;
      query += searchCondition;
      countQuery += searchCondition;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add ordering and pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const queryParams = [...params, limit, offset];

    const [rows]: any = await pool.execute(query, queryParams);
    const [countResult]: any = await pool.execute(countQuery, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Parse custom_data JSON for each product
    const products = rows.map((product: any) => ({
      ...product,
      custom_data: typeof product.custom_data === 'string'
        ? JSON.parse(product.custom_data)
        : product.custom_data,
    }));

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create product
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

    // Generate slug from product name
    let slug = generateSlug(data.custom_data?.name || 'product');

    // Ensure slug uniqueness
    let slugUnique = false;
    let slugAttempts = 0;
    while (!slugUnique && slugAttempts < 10) {
      const [existingSlug]: any = await pool.execute(
        'SELECT id FROM products WHERE slug = ?',
        [slug]
      );
      if (existingSlug.length === 0) {
        slugUnique = true;
      } else {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        slugAttempts++;
      }
    }

    // Generate batch number if not provided
    let batchNo = data.batch_no;
    if (!batchNo && data.custom_data?.name) {
      batchNo = generateBatchNumber(data.custom_data.name);

      // Ensure uniqueness
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        const [existing]: any = await pool.execute(
          'SELECT id FROM products WHERE batch_no = ?',
          [batchNo]
        );
        if (existing.length === 0) {
          isUnique = true;
        } else {
          batchNo = generateBatchNumber(data.custom_data.name);
          attempts++;
        }
      }
    }

    // Generate QR code with product URL (for scanning)
    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${slug}`;
    const qrCodeDataURL = await QRCode.toDataURL(productUrl, {
      width: 300,
      margin: 2,
    });

    // Store product data for label
    const qrData = {
      batchNo: batchNo,
      mfg: data.custom_data?.mfg_date ? formatDate(data.custom_data.mfg_date) : 'N/A',
      exp: data.custom_data?.exp_date ? formatDate(data.custom_data.exp_date) : 'N/A',
      mrp: data.custom_data?.price ? `₹${data.custom_data.price}` : 'N/A',
      unitPrice: data.custom_data?.unit_price ? `₹${data.custom_data.unit_price}` : 'N/A',
    };

    // Insert product into database
    const [result]: any = await pool.execute(
      `INSERT INTO products (slug, batch_no, product_image, custom_data, qr_code)
       VALUES (?, ?, ?, ?, ?)`,
      [
        slug,
        batchNo,
        data.product_image || null,
        JSON.stringify(data.custom_data),
        qrCodeDataURL,
      ]
    );

    return NextResponse.json({
      success: true,
      productId: result.insertId,
      slug: slug,
      batchNo: batchNo,
      qrCode: qrCodeDataURL,
      productUrl: productUrl,
      qrData: qrData,
    });
  } catch (error: unknown) {
    console.error('Create product error:', error);

    const isDbError = error && typeof error === 'object' && 'code' in error;
    if (isDbError) {
      console.error('Error details:', {
        code: (error as {code?: string}).code,
        message: (error as {message?: string}).message,
        sql: (error as {sql?: string}).sql,
      });
    }

    if (isDbError && (error as {code?: string}).code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Batch number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: isDbError ? (error as {code?: string}).code : undefined
      },
      { status: 500 }
    );
  }
}
// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;
    const isValid = await validateAdminSession(sessionToken);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await pool.execute('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;
    const isValid = await validateAdminSession(sessionToken);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, batch_no, product_image, custom_data } = data;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await pool.execute(
      'UPDATE products SET batch_no = ?, product_image = ?, custom_data = ? WHERE id = ?',
      [batch_no, product_image, JSON.stringify(custom_data), id]
    );

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error: unknown) {
    console.error('Update product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update product', details: errorMessage }, { status: 500 });
  }
}
