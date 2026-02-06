# Deployment Guide - Aroxa Crop Science

## 🚀 GitHub Setup

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Initial commit with CI/CD setup"
git remote add origin https://github.com/saurav1702/aroxacropscience.git
git branch -M master
git push -u origin master
```

### 2. Configure GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
- `DATABASE_HOST` - Your production MySQL host (e.g., from PlanetScale, Railway, or AWS RDS)
- `DATABASE_USER` - Database username
- `DATABASE_PASSWORD` - Database password
- `DATABASE_NAME` - Database name
- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password (hashed)
- `VERCEL_TOKEN` - Get from Vercel account settings
- `VERCEL_ORG_ID` - Get from Vercel project settings
- `VERCEL_PROJECT_ID` - Get from Vercel project settings

## 🌐 Vercel Deployment

### Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `aroxacropscience` repository
5. Configure environment variables:
   - `DATABASE_HOST`
   - `DATABASE_USER`
   - `DATABASE_PASSWORD`
   - `DATABASE_NAME`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
6. Click "Deploy"

### Step 3: Database Setup (PlanetScale Recommended)
1. Create free account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Update environment variables in Vercel
5. Run migrations:
   ```bash
   # Connect to production database
   npm run migrate:prod
   ```

### Step 4: Post-Deployment
1. Visit your Vercel deployment URL
2. Run database migrations via API: `https://your-domain.vercel.app/api/migrate`
3. Test admin login
4. Create test product

## 🔄 CI/CD Pipeline

### What Happens on Push:
1. **Build Job**:
   - Runs on Node 18.x and 20.x
   - Installs dependencies
   - Runs linting
   - Builds Next.js project
   - Runs tests

2. **Deploy Job**:
   - Triggers only on master/main branch
   - Automatically deploys to Vercel
   - Updates production environment

### Manual Deploy:
```bash
vercel --prod
```

## 📝 Environment Variables Required

### Development (.env.local)
```
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=aroxa_cropscience
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2b$10$hashedpassword
```

### Production (Vercel)
Same variables but with production database credentials.

## 🗄️ Database Options for Production

### Option 1: PlanetScale (Recommended)
- ✅ Free tier available
- ✅ MySQL compatible
- ✅ Serverless
- ✅ Auto-scaling
- 🔗 [planetscale.com](https://planetscale.com)

### Option 2: Railway
- ✅ Easy setup
- ✅ $5 free credit
- 🔗 [railway.app](https://railway.app)

### Option 3: AWS RDS
- For production at scale
- Pay as you go

### Option 4: Vercel Postgres + MySQL Adapter
- ✅ Integrated with Vercel
- ✅ Simple setup

## 🔐 Security Checklist
- ✅ Environment variables configured
- ✅ .env files in .gitignore
- ✅ Database credentials secure
- ✅ Admin password hashed
- ✅ CORS configured properly
- ✅ SQL injection protection (using parameterized queries)

## 🧪 Testing Deployment
1. Visit production URL
2. Test homepage loads
3. Test products page
4. Test contact form
5. Test admin login
6. Test product creation
7. Test QR code generation
8. Test label download

## 📞 Support
If deployment fails, check:
1. Build logs in GitHub Actions
2. Vercel deployment logs
3. Database connection
4. Environment variables spelling

## 🎉 Post-Deployment Steps
1. Add custom domain in Vercel
2. Configure SSL (automatic in Vercel)
3. Set up monitoring
4. Configure analytics
5. Add Google Search Console
