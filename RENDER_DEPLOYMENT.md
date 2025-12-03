# 🚀 Render Deployment - CutListCreator

## Quick Start Guide for Render (Free Tier)

---

## 📋 **Render Free Tier Includes:**

- ✅ **Web Services**: Free tier with 750 hours/month
- ✅ **PostgreSQL Database**: Free tier (90 days, then expires - plan ahead!)
- ✅ **Automatic HTTPS**
- ✅ **Auto-deploy from Git**
- ✅ **Build minutes**: 500 free build minutes/month

**Note**: Free tier services spin down after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## 🎯 **Step-by-Step Deployment**

### **Step 1: Sign Up / Log In to Render**

1. Go to: **https://render.com**
2. Click **"Get Started for Free"** or **"Sign In"**
3. Sign up with GitHub (recommended) - this makes repository connection easier
4. Authorize Render to access your GitHub repositories

---

### **Step 2: Create PostgreSQL Database (Optional but Recommended)**

**Note**: You already have Supabase PostgreSQL, so you can skip this and use your existing `DATABASE_URL`. But if you want a free Render database:

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. **Name**: `cutlistcreator-db`
3. **Database**: `cutlistcreator`
4. **User**: `cutlistcreator` (auto-generated is fine)
5. **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
6. **Plan**: **Free** (select this!)
7. Click **"Create Database"**
8. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgres://`)
9. Save this URL - you'll need it for environment variables

**⚠️ Important**: Free PostgreSQL databases on Render expire after 90 days. For production, consider keeping your Supabase database.

---

### **Step 3: Create Web Service**

1. From Render Dashboard, click **"New +"** → **"Web Service"**

2. **Connect Repository**:
   - Click **"Connect account"** (if not connected)
   - Select **GitHub**
   - Find and select: `mayainteriorsin-lang/CutListCreator`
   - Click **"Connect"**

3. **Configure Service**:
   
   **Basic Settings:**
   - **Name**: `cutlistcreator` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank (default: `.`)
   - **Runtime**: **Node**
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```

4. **Plan**: Select **Free**

5. Click **"Advanced"** to expand more options

---

### **Step 4: Environment Variables**

In the **Environment Variables** section, add these:

**If using your existing Supabase database:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:XE95fSkCZSOonozg@db.cxiuughnauwahlujkraj.supabase.co:5432/postgres` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render uses port 10000 by default) |

**If using Render's PostgreSQL:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Copy from your Render PostgreSQL database (Internal Database URL) |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

**Optional (if using Google Cloud Storage):**

| Key | Value |
|-----|-------|
| `GOOGLE_CLOUD_PROJECT_ID` | Your Google Cloud project ID |
| `GOOGLE_CLOUD_STORAGE_BUCKET` | Your bucket name |

Click **"Add Environment Variable"** for each one.

---

### **Step 5: Deploy!**

1. **Review** all settings
2. Click **"Create Web Service"**
3. Render will:
   - Clone your repository
   - Install dependencies
   - Run build command
   - Start your application

4. **Wait 3-5 minutes** for the first build

5. **Monitor** the build logs in real-time

---

## 📊 **After Deployment**

### **Your App URL**

Once deployed, your app will be available at:
```
https://cutlistcreator.onrender.com
```
(Or whatever name you chose)

### **Auto-Deploy**

Every time you push to the `main` branch on GitHub:
- ✅ Render automatically detects changes
- ✅ Rebuilds your application
- ✅ Deploys the new version

### **View Logs**

- Go to your service in Render Dashboard
- Click **"Logs"** tab
- See real-time application logs

### **Service Status**

- **Running**: Green indicator - app is live
- **Building**: Yellow - deployment in progress
- **Failed**: Red - check logs for errors

---

## 🔧 **Database Migrations**

After first deployment, run migrations:

### **Option 1: Via Render Shell**

1. In Render Dashboard, go to your Web Service
2. Click **"Shell"** tab
3. Wait for shell to connect
4. Run:
   ```bash
   npm run db:push
   ```

### **Option 2: Locally with Production Database**

```bash
# Set production DATABASE_URL
export DATABASE_URL="your_render_or_supabase_database_url"

# Run migrations
npm run db:push
```

---

## ⚡ **Performance Notes**

### **Free Tier Limitations**

- **Cold Starts**: Service spins down after 15 minutes of inactivity
- **First Request**: Takes ~30 seconds after sleep
- **Active**: Normal response times when active

### **Keep Warm (Optional)**

Use a service like:
- **UptimeRobot** (free) - Ping every 5 minutes
- **Cron-job.org** (free) - Scheduled pings

Set up a cron job to ping: `https://cutlistcreator.onrender.com/test`

---

## 🐛 **Troubleshooting**

### **Build Fails**

**Check build logs**:
- Missing dependencies? Add to `package.json`
- TypeScript errors? Run `npm run check` locally
- Build command wrong? Verify in `package.json`

**Common fixes**:
```bash
# Ensure all dependencies are listed
npm install
npm run build  # Test locally first
```

### **App Crashes on Start**

**Check logs** for errors:
- Database connection issues?
  - Verify `DATABASE_URL` is correct
  - Check SSL settings (Render requires SSL)
- Port issues?
  - Ensure using `process.env.PORT`
  - Default should be 10000 on Render

**Fix in `server/index.ts`**:
```typescript
const port = parseInt(process.env.PORT || '10000', 10);
```

### **Database Connection Errors**

If using Supabase with SSL certificate issues:

1. Go to Render Dashboard
2. Your Web Service → Environment
3. Add: `NODE_TLS_REJECT_UNAUTHORIZED` = `0`

**⚠️ This is already configured in your `server/db.ts`**

### **Environment Variables Not Working**

- Check spelling - must match exactly
- After adding variables, **manually trigger redeploy**:
  - Go to service → **Manual Deploy** → **Deploy Latest Commit**

---

## 💡 **Post-Deployment Checklist**

After successful deployment:

- ✅ Test the live URL
- ✅ Try adding a cabinet
- ✅ Test PDF generation
- ✅ Check database persistence
- ✅ Test all major features
- ✅ Set up uptime monitoring (optional)
- ✅ Configure custom domain (optional, paid)

---

## 🆙 **Upgrading from Free Tier**

When you're ready to upgrade:

**Starter Plan** ($7/month):
- No sleep/spin down
- 400 hours/month (plenty for most apps)
- Faster builds

**Standard Plan** ($25/month):
- 1000 hours/month
- Priority builds
- Scalable

---

## 📈 **Scaling Considerations**

Free tier is great for:
- ✅ Development
- ✅ Testing
- ✅ Low-traffic apps
- ✅ Personal projects

Upgrade when:
- Site gets >100 daily users
- Cold starts become annoying
- Need 24/7 availability
- Database needs >1GB storage

---

## 🎉 **You're All Set!**

Your CutListCreator should now be:
- ✅ Live on the internet
- ✅ Auto-deploying from GitHub
- ✅ Free to use (with limitations)
- ✅ HTTPS enabled

**Enjoy your deployed app!** 🚀

---

## 🔗 **Useful Links**

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **Render Community**: https://community.render.com

Need help? Ask in the Render community forum!
