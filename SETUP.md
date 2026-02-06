# Quick Setup Guide

Follow these steps to set up the Aroxa Crop Science website:

## Step 1: Start XAMPP

1. Open XAMPP Control Panel
2. Click "Start" for **Apache**
3. Click "Start" for **MySQL**
4. Wait until both show green "Running" status

## Step 2: Create Database

1. Open your browser and go to: http://localhost/phpmyadmin
2. Click "New" on the left sidebar
3. Database name: `aroxa_cropscience`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

## Step 3: Import Database Schema

1. Click on the `aroxa_cropscience` database you just created
2. Click the "SQL" tab at the top
3. Open the file: `database/schema.sql` in Notepad
4. Copy all the SQL code
5. Paste it into the SQL tab in phpMyAdmin
6. Click "Go" button at the bottom
7. You should see: "2 tables created successfully"

## Step 4: Configure Admin PIN (Optional)

1. Open `.env.local` file in Notepad
2. Find the line: `ADMIN_PIN=123456`
3. Change `123456` to your desired 6-digit PIN
4. Save the file

## Step 5: Install Dependencies

1. Open Command Prompt (CMD)
2. Navigate to project folder:
   ```
   cd C:\Users\Admin\Desktop\aroxa-cropscience
   ```
3. Run:
   ```
   npm install
   ```
4. Wait for installation to complete (may take 2-3 minutes)

## Step 6: Start the Website

1. In the same Command Prompt, run:
   ```
   npm run dev
   ```
2. Wait for "Ready" message
3. Open browser and go to: http://localhost:3000

## Step 7: Test Admin Login

1. Click "Login" in the header
2. Enter PIN: `123456` (or your custom PIN)
3. Click "Login"
4. You should see the Admin Dashboard

## Step 8: Add Your First Product

1. In Admin Dashboard, click "Add Product"
2. Fill in the product details:
   - Name: `Test Product`
   - UID No: `UID001`
   - EXP Date: Select a future date
   - Web Link: `https://www.aroxacropscience.com`
3. Click "Add Product"
4. QR Code will be generated automatically
5. Check the Products page to see your product

## Verification Checklist

✅ XAMPP is running (Apache + MySQL green)
✅ Database `aroxa_cropscience` exists
✅ Tables `products` and `admin_sessions` exist
✅ Website loads at http://localhost:3000
✅ Admin login works with PIN
✅ Can add products
✅ Products show on Products page

## Default Admin PIN

**Default PIN: 123456**

⚠️ **Important**: Change this PIN in `.env.local` for security!

## Common Issues

### "Cannot connect to database"
- Make sure XAMPP MySQL is running
- Check if database name is correct: `aroxa_cropscience`

### "Port 3000 already in use"
- Close any other applications using port 3000
- Or run on different port: `npm run dev -- -p 3001`

### "Invalid PIN" when logging in
- Check `.env.local` file for correct PIN
- Default PIN is: `123456`

### Products not showing
- Add products from Admin Panel first
- Refresh the page
- Check browser console for errors

## Need Help?

If you encounter any issues:
1. Check XAMPP is running
2. Check database is created
3. Check `.env.local` configuration
4. Restart the development server

## Next Steps

After setup is complete:
1. Add your products from Admin Panel
2. Customize colors if needed (search for #7DD50B in code)
3. Update contact information in Contact Us page
4. Add your company logo images

Enjoy your new website! 🚀
