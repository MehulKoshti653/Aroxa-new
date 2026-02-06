# Aroxa Crop Science Website

A complete Next.js website with admin panel for Aroxa Crop Science products management.

## Features

### Frontend
- 🏠 Home page with hero section and features
- 📦 Products listing page
- 📄 Product details page with QR code
- ℹ️ About Us page
- 📞 Contact Us page
- 🎨 Theme color: #7DD50B (Green) + White

### Admin Panel
- 🔐 6-digit PIN authentication
- ➕ Add new products with auto-generated batch numbers
- 📊 Dashboard with product statistics
- 🔍 View all products in a table
- 🏷️ Auto-generate QR codes for each product

### Product Fields
- Name, Technical Name, Pack Size
- UID No, Batch No (auto-generated as ABPB10 format)
- MFG Date, EXP Date
- Web Link, Price, Unit Price
- Manufactured By, Marketed By
- Recommendation (Text Area)
- How to Use (WYSIWYG Editor)
- QR Code (auto-generated)

## Prerequisites

- Node.js 18+ installed
- XAMPP installed (for MySQL database)
- Modern web browser

## Installation & Setup

### 1. Database Setup

1. Start XAMPP and run Apache & MySQL
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `aroxa_cropscience`
4. Import the database schema:
   - Go to the database
   - Click "SQL" tab
   - Copy contents from `database/schema.sql` and execute

### 2. Environment Configuration

The `.env.local` file is already configured with default values:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aroxa_cropscience
ADMIN_PIN=123456
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Change the ADMIN_PIN** to your desired 6-digit number for security.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The website will be available at: http://localhost:3000

## Usage

### Frontend
- Visit http://localhost:3000 to see the home page
- Navigate to Products, About Us, Contact Us from the header
- Click on any product to see its details and QR code

### Admin Panel
1. Click "Login" in the header
2. Enter your 6-digit PIN (default: 123456)
3. You'll be redirected to the admin dashboard
4. Click "Add Product" to add new products
5. The batch number will be auto-generated from the product name (format: ABPB10)
6. You can modify the batch number if needed
7. QR code will be generated automatically with product details

### Batch Number Format
- Automatically generated from product name
- Format: `[First 4 letters of product name]PB[Random 2-digit number]`
- Example: Product "Acetamiprid" → "ACEPB42"
- Can be manually changed during product creation

### QR Code Content
Each QR code contains:
- Batch Number
- Manufacturing Date (MFG)
- Expiry Date (EXP)
- MRP (Maximum Retail Price)
- Unit per Price

## Build for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL (via XAMPP)
- **QR Code**: qrcode library
- **WYSIWYG Editor**: React Quill
- **Authentication**: Cookie-based sessions

## Project Structure

```
aroxa-cropscience/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── products/     # Product CRUD endpoints
│   ├── admin/            # Admin panel pages
│   ├── products/         # Product pages
│   ├── about/            # About Us page
│   ├── contact/          # Contact Us page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── db.ts            # Database connection
│   └── utils.ts         # Utility functions
├── types/               # TypeScript types
├── database/            # Database schema
└── .env.local          # Environment variables
```

## Security Notes

- Change the default ADMIN_PIN in `.env.local`
- In production, use strong passwords for database
- Enable HTTPS for production deployment
- Set secure cookie flags in production

## Troubleshooting

### Database Connection Issues
- Ensure XAMPP MySQL is running
- Check database credentials in `.env.local`
- Verify database name is correct

### Port Already in Use
- Change port: `npm run dev -- -p 3001`

### QR Code Not Generating
- Check product details are complete
- Ensure all required fields are filled

## Support

For issues or questions, contact: info@aroxacropscience.com

## License

© 2026 Aroxa Crop Science Private Limited. All rights reserved.
