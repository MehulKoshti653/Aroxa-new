# 🚀 Complete Vercel Deployment Steps

## ✅ Step 1: GitHub Setup (DONE!)
Your code is now live at: https://github.com/saurav1702/aroxacropscience

## 📦 Step 2: Database Setup (DO THIS FIRST!)

### Option A: PlanetScale (Recommended - FREE)
1. Go to https://planetscale.com
2. Sign up with GitHub account
3. Click "Create a new database"
4. Name: `aroxa-cropscience`
5. Region: Choose closest to India (AWS Mumbai)
6. Click "Create database"
7. Go to "Connect" → "Create password"
8. Select "Node.js" and copy connection details:
   ```
   Host: xxx.aws.psdb.cloud
   Username: xxx
   Password: pscale_pw_xxx
   Database: aroxa-cropscience
   ```
9. **IMPORTANT**: Run this query in PlanetScale console to create tables:
   - Go to "Console" tab
   - Copy-paste the SQL from `database/schema.sql`
   - Or use the migration API after deployment

### Option B: Railway (Alternative)
1. Go to https://railway.app
2. Sign up and create new project
3. Add MySQL database
4. Copy connection details from "Connect" tab

## 🌐 Step 3: Deploy to Vercel

### 3.1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### 3.2: Import Project
1. Click "Add New" → "Project"
2. Find and import `aroxacropscience` repository
3. Click "Import"

### 3.3: Configure Project
**Framework Preset**: Next.js (Auto-detected)
**Root Directory**: `./`
**Build Command**: `npm run build`
**Output Directory**: `.next`

### 3.4: Add Environment Variables
Click "Environment Variables" and add these:

```
DATABASE_HOST=xxx.aws.psdb.cloud
DATABASE_USER=xxx
DATABASE_PASSWORD=pscale_pw_xxx
DATABASE_NAME=aroxa-cropscience
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2b$10$your_hashed_password_here
```

**To generate ADMIN_PASSWORD hash:**
```bash
# Run this in your local terminal
node -e "console.log(require('bcrypt').hashSync('your_password', 10))"
```

### 3.5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Your app will be live at: `https://your-project.vercel.app`

## 🔄 Step 4: Run Database Migration

After deployment, run migrations:

**Method 1: Via Browser**
1. Visit: `https://your-project.vercel.app/api/migrate`
2. You should see: `{"success": true, "message": "All migrations completed"}`

**Method 2: Manual SQL**
1. Open PlanetScale Console
2. Copy SQL from `database/schema.sql`
3. Run all CREATE TABLE statements

## 🧪 Step 5: Test Your Deployment

1. **Homepage**: Visit your Vercel URL
2. **Admin Login**: `https://your-project.vercel.app/`
   - Username: admin
   - Password: (what you set)
3. **Create Test Product**:
   - Go to "Add Product"
   - Fill form with test data
   - Upload small image (< 2MB)
   - Submit
4. **Test QR Code**: Scan the QR code, should open product page
5. **Test Contact Form**: Submit a test inquiry

## 🎯 Step 6: Setup CI/CD (GitHub Actions)

### 6.1: Add GitHub Secrets
1. Go to: https://github.com/saurav1702/aroxacropscience/settings/secrets/actions
2. Click "New repository secret"
3. Add these secrets one by one:

```
DATABASE_HOST = (your PlanetScale host)
DATABASE_USER = (your PlanetScale username)
DATABASE_PASSWORD = (your PlanetScale password)
DATABASE_NAME = aroxa-cropscience
ADMIN_USERNAME = admin
ADMIN_PASSWORD = (your hashed password)
VERCEL_TOKEN = (get from Vercel)
VERCEL_ORG_ID = (get from Vercel)
VERCEL_PROJECT_ID = (get from Vercel)
```

### 6.2: Get Vercel Tokens
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: "GitHub Actions"
4. Copy token → Add to GitHub as `VERCEL_TOKEN`

### 6.3: Get Vercel Project IDs
1. Go to your Vercel project settings
2. Scroll to "Project ID" and "Team ID"
3. Copy both and add to GitHub secrets:
   - `VERCEL_PROJECT_ID`
   - `VERCEL_ORG_ID` (this is Team ID)

### 6.4: Test CI/CD
1. Make any small change in code
2. Commit and push to GitHub
3. Go to: https://github.com/saurav1702/aroxacropscience/actions
4. Watch the CI/CD pipeline run
5. On success, changes auto-deploy to Vercel!

## 🎨 Step 7: Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your domain: `aroxacropscience.com`
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

## 📊 Step 8: Enable Analytics

1. In Vercel project → Analytics → Enable
2. Get real-time traffic data
3. Monitor performance

## 🔐 Security Checklist

- ✅ All environment variables set
- ✅ Admin password is hashed
- ✅ Database password is secure
- ✅ .env files not in GitHub
- ✅ CORS properly configured
- ✅ SQL injection protection active

## 🐛 Troubleshooting

### Build Failed
- Check build logs in Vercel
- Ensure all environment variables are set
- Try building locally: `npm run build`

### Database Connection Failed
- Verify DATABASE_HOST, USER, PASSWORD
- Check PlanetScale is running
- Test connection string locally

### Admin Login Not Working
- Regenerate password hash
- Clear browser cookies
- Check ADMIN_USERNAME and ADMIN_PASSWORD in Vercel env vars

### Images Not Uploading
- Vercel has 4.5MB payload limit
- Ensure images < 2MB on frontend
- Consider using Cloudinary for large images

## 📞 Need Help?

1. Check Vercel logs: Project → Deployments → [Latest] → Logs
2. Check GitHub Actions: Repository → Actions tab
3. Database logs: PlanetScale → Database → Insights

## 🎉 Success Checklist

- ✅ Code pushed to GitHub
- ✅ PlanetScale database created
- ✅ Vercel project deployed
- ✅ Environment variables configured
- ✅ Database migrations run
- ✅ Admin login working
- ✅ Products can be created
- ✅ QR codes working
- ✅ Contact form working
- ✅ CI/CD pipeline active

## 🚀 Your Live URLs

- **GitHub Repo**: https://github.com/saurav1702/aroxacropscience
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live Site**: https://[your-project].vercel.app
- **Admin Panel**: https://[your-project].vercel.app/admin

---

## 📝 Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Deploy to Vercel (manual)
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

## 🎯 Next Steps After Deployment

1. Add Google Analytics
2. Setup error monitoring (Sentry)
3. Add backup system for database
4. Setup email notifications for contact form
5. Add sitemap.xml for SEO
6. Submit to Google Search Console
7. Add robots.txt
8. Enable CDN for images
9. Setup monitoring alerts
10. Document API endpoints

---

**Deployment Date**: $(date)
**Version**: 1.0.0
**Status**: Ready for Production 🚀
