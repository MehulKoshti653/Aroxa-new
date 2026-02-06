# 🚀 Complete Deployment Guide - Vercel + TiDB Cloud

## Your Setup Details:
- **Vercel Account**: https://vercel.com/mehulk-7245s-projects
- **Email**: mehul.k@cre8r.in
- **Database**: TiDB Cloud (MySQL Compatible)
- **GitHub Repo**: https://github.com/saurav1702/aroxacropscience

---

## 📦 Step 1: Get TiDB Connection Details

1. Go to your TiDB Dashboard: https://tidbcloud.com/clusters/10288133458141763452/overview

2. Click on **"Connect"** button

3. Copy these connection details:
   ```
   Host: xxxxx.tidbcloud.com
   Port: 4000
   Username: xxxxxxx
   Password: xxxxxxx
   Database: test (or your database name)
   ```

4. **Connection String Format**:
   ```
   mysql://username:password@host:4000/database_name?ssl={"rejectUnauthorized":true}
   ```

---

## 🌐 Step 2: Deploy to Vercel (5 Minutes)

### A. Login to Vercel
1. Go to: https://vercel.com/login
2. Login with your GitHub account (mehul.k@cre8r.in)

### B. Import GitHub Repository
1. Click **"Add New..." → "Project"**
2. Click **"Import Git Repository"**
3. Paste: `https://github.com/saurav1702/aroxacropscience`
4. Click **"Import"**

### C. Configure Project Settings
**Framework Preset**: Next.js (Auto-detected) ✅
**Root Directory**: `./` (Default) ✅
**Build Command**: `npm run build` (Default) ✅
**Output Directory**: `.next` (Default) ✅

### D. Add Environment Variables

Click **"Environment Variables"** and add these ONE BY ONE:

#### 1. DATABASE_HOST
```
xxxxx.tidbcloud.com
```
*(Get from TiDB Connect page)*

#### 2. DATABASE_USER
```
your_tidb_username
```

#### 3. DATABASE_PASSWORD
```
your_tidb_password
```

#### 4. DATABASE_NAME
```
test
```
*(or your database name)*

#### 5. DATABASE_PORT
```
4000
```
*(TiDB default port)*

#### 6. DATABASE_SSL
```
true
```
*(TiDB requires SSL)*

#### 7. ADMIN_USERNAME
```
admin
```
*(Your admin login username)*

#### 8. ADMIN_PASSWORD
Generate hash first (run this locally):
```bash
node -e "console.log(require('bcrypt').hashSync('YourPassword123', 10))"
```
Then paste the output:
```
$2b$10$XxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
```

#### 9. NEXT_PUBLIC_APP_URL
```
https://your-project.vercel.app
```
*(Will be provided after first deploy - you can update this later)*

### E. Deploy!
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. You'll get a URL: `https://aroxacropscience-xxxxx.vercel.app`

---

## 🗄️ Step 3: Setup TiDB Database (10 Minutes)

### A. Create Tables in TiDB

1. Go to TiDB Dashboard → **SQL Editor** or **Chat2Query**

2. Run this SQL to create all tables:

```sql
-- 1. Migrations Table
CREATE TABLE IF NOT EXISTS migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  version INT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_token (session_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Custom Fields Table
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

-- 4. Products Table
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

-- 5. Contact Inquiries Table
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

-- 6. Insert Default Custom Fields
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

-- 7. Insert migration records
INSERT INTO migrations (version, name) VALUES
(1, 'create_migrations_table'),
(2, 'create_admin_sessions_table'),
(3, 'create_custom_fields_table'),
(4, 'create_products_table'),
(5, 'insert_default_custom_fields'),
(6, 'create_contact_inquiries_table');
```

### B. Verify Tables Created
```sql
SHOW TABLES;
```

You should see:
- ✅ migrations
- ✅ admin_sessions
- ✅ custom_fields
- ✅ products
- ✅ contact_inquiries

---

## 🔧 Step 4: Update Connection Configuration (Optional)

If TiDB connection fails, update `lib/db.ts`:

### For TiDB Cloud (SSL Required):
```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT) || 4000,
  ssl: {
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
```

Push the changes:
```bash
git add lib/db.ts
git commit -m "Update database config for TiDB Cloud"
git push
```

Vercel will auto-redeploy! 🚀

---

## ✅ Step 5: Test Your Deployment

### A. Update NEXT_PUBLIC_APP_URL
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` with your actual URL:
   ```
   https://aroxacropscience-xxxxx.vercel.app
   ```
3. Click **"Save"**
4. Go to Deployments → Click **"Redeploy"**

### B. Test Admin Login
1. Visit: `https://your-app.vercel.app`
2. Login with:
   - Username: `admin`
   - Password: `YourPassword123` (whatever you used for hash)

### C. Create Test Product
1. Go to **"Add Product"**
2. Fill in the form
3. Upload an image (< 2MB)
4. Click **"Submit"**
5. Test QR code scan
6. Download label

### D. Test Contact Form
1. Go to `/contact`
2. Fill form and submit
3. Check `/admin/inquiries` to see submission

---

## 🎯 Step 6: Custom Domain (Optional)

1. Go to Vercel → Your Project → Settings → Domains
2. Add your domain: `aroxacropscience.com`
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

---

## 🔐 Security Checklist

- ✅ Database password is strong
- ✅ Admin password is hashed
- ✅ Environment variables are set
- ✅ SSL enabled for database
- ✅ No sensitive data in GitHub repo
- ✅ `.env.local` is in `.gitignore`

---

## 🐛 Troubleshooting

### Build Failed
- Check build logs in Vercel
- Ensure all environment variables are set
- Verify database connection string

### Database Connection Failed
- Verify TiDB credentials
- Check if SSL is enabled
- Ensure port 4000 is correct
- Test connection from TiDB dashboard

### Admin Login Not Working
- Regenerate password hash
- Clear browser cookies
- Check ADMIN_USERNAME and ADMIN_PASSWORD in Vercel

### Images Not Uploading
- TiDB LONGTEXT supports up to 4GB
- Frontend validates < 2MB
- Check browser console for errors

---

## 📞 Quick Commands

### Generate Admin Password Hash:
```bash
node -e "console.log(require('bcrypt').hashSync('YourPassword', 10))"
```

### Test Database Connection:
```bash
mysql -h your-host.tidbcloud.com -P 4000 -u username -p
```

### Deploy from CLI:
```bash
vercel --prod
```

---

## 🎉 Success Checklist

- ✅ Vercel project created
- ✅ GitHub repo connected
- ✅ Environment variables configured
- ✅ TiDB database setup complete
- ✅ Tables created and populated
- ✅ First deployment successful
- ✅ Admin login working
- ✅ Products can be created
- ✅ QR codes working
- ✅ Contact form working

---

## 📊 Your Deployment URLs

**Vercel Dashboard**: https://vercel.com/mehulk-7245s-projects
**TiDB Dashboard**: https://tidbcloud.com/clusters/10288133458141763452/overview
**GitHub Repo**: https://github.com/saurav1702/aroxacropscience
**Live Site**: https://[your-project].vercel.app (after deployment)

---

## 💡 Pro Tips

1. **Auto Deploy**: Every git push will auto-deploy to Vercel
2. **Preview Deployments**: Pull requests get preview URLs
3. **Rollback**: Can rollback to any previous deployment
4. **Logs**: View real-time logs in Vercel dashboard
5. **Analytics**: Enable Vercel Analytics for insights

---

**Total Time**: ~15-20 minutes
**Difficulty**: Easy 🟢

Need help? Let me know! 🚀
