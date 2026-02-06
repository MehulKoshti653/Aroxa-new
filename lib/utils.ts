// Generate batch number from product name
export function generateBatchNumber(productName: string): string {
  // Remove special characters and spaces, take first 4 letters
  const cleanName = productName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const prefix = cleanName.substring(0, 4).padEnd(4, 'X');

  // Add PB (Product Batch) and random number
  const randomNum = Math.floor(Math.random() * 90) + 10;

  return `${prefix}PB${randomNum}`;
}

// Generate URL slug from product name
export function generateSlug(productName: string): string {
  return productName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

// Validate admin session
export async function validateAdminSession(sessionToken: string | undefined) {
  if (!sessionToken) {
    return false;
  }

  try {
    const pool = (await import('@/lib/db')).default;
    const [rows] = await pool.execute(
      'SELECT * FROM admin_sessions WHERE session_token = ? AND expires_at > NOW()',
      [sessionToken]
    ) as [unknown[], unknown];
    return (rows as Array<unknown>).length > 0;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}
