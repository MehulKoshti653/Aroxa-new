# 🚀 Production Deployment Guide - Aroxa Crop Science

## ✅ Build Status: SUCCESSFUL

Your application is **production-ready**! Build completed with no errors.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env` or `.env.production`
- [ ] Update `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Set secure `ADMIN_PIN` (6 digits)
- [ ] Configure production database credentials

### 2. Database Setup
```bash
# On your production server, run migrations:
npm run migrate
```

### 3. Security
- [ ] Change default admin PIN from `123456`
- [ ] Use strong database password
- [ ] Enable HTTPS on production domain
- [ ] Set `max_allowed_packet=64M` in MySQL config

### 4. Logo
- [ ] Replace `/public/images/logo.jpg` with your actual logo
- [ ] Update Header and Footer components to use logo

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - **Important:** You'll need a MySQL database (use PlanetScale, Railway, or your own server)

3. **Environment Variables in Vercel:**
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `ADMIN_PIN`
   - `NEXT_PUBLIC_APP_URL` (your vercel domain)

### Option 2: VPS (DigitalOcean, AWS, etc.)

1. **Install Node.js & MySQL**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs mysql-server
   ```

2. **Clone & Install**
   ```bash
   git clone YOUR_REPO
   cd aroxa-cropscience
   npm install
   ```

3. **Setup MySQL**
   ```bash
   mysql -u root -p
   CREATE DATABASE aroxa_cropscience;
   EXIT;
   
   # Run migrations
   npm run migrate
   ```

4. **Build & Start**
   ```bash
   npm run build
   npm start
   ```

5. **Setup PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "aroxa" -- start
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx**
   ```nginx
   server {
       listen 80;
       server_name aroxacropscience.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d aroxacropscience.com
   ```

---

## 🗄️ Database Options for Production

### Option 1: PlanetScale (MySQL, Free tier available)
- https://planetscale.com
- Serverless MySQL
- Easy to use with Vercel

### Option 2: Railway (All-in-one)
- https://railway.app
- MySQL + Hosting
- Simple deployment

### Option 3: Your Own MySQL Server
- Install on VPS
- More control
- Requires server management

---

## 📝 Post-Deployment Tasks

1. **Test Everything:**
   - [ ] Login to admin panel
   - [ ] Add custom fields
   - [ ] Create a product
   - [ ] Download label
   - [ ] Scan QR code
   - [ ] Test search and pagination
   - [ ] Edit and delete products

2. **Performance:**
   - [ ] Enable caching
   - [ ] Optimize images
   - [ ] Add CDN if needed

3. **Monitoring:**
   - [ ] Setup error tracking (Sentry)
   - [ ] Monitor database performance
   - [ ] Check logs regularly

---

## 🔒 Security Recommendations

1. **Immediate:**
   - Change admin PIN
   - Use environment variables (never commit .env)
   - Enable HTTPS

2. **Important:**
   - Regular database backups
   - Keep dependencies updated
   - Use strong passwords

3. **Advanced:**
   - Rate limiting on admin routes
   - Database connection pooling
   - WAF (Web Application Firewall)

---

## 📞 Support

If you face any issues during deployment:
1. Check logs: `pm2 logs aroxa` (if using PM2)
2. Check build errors: `npm run build`
3. Database connection: Test MySQL credentials

---

## 🎉 You're Ready!

Your application is production-ready. Choose your deployment option and follow the steps above.

**Recommended:** Start with Vercel + PlanetScale for easiest deployment.
