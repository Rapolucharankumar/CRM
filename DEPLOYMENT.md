# Deployment Guide - CRM Pro

Deploy your MERN CRM application to production.

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

```bash
cd client
npm run build  # Verify build works
```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/crm-client
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Configure:
   - **Framework**: React
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
7. Click "Deploy"

### Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## Backend Deployment (Render)

### Step 1: Prepare Repository

```bash
cd server
# Ensure package.json has start script
# Ensure .gitignore excludes .env
```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/crm-server
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up / Sign in
3. Click "New +"
4. Select "Web Service"
5. Connect GitHub
6. Select your repository
7. Configure:
   - **Name**: crm-api (or your choice)
   - **Environment**: Node
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or paid
8. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/crm
   JWT_SECRET=your_super_secret_key_change_this
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-domain.vercel.app
   ```
9. Click "Create Web Service"

### Step 4: Update Frontend

After backend deploys, update `VITE_API_URL` in Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Update `VITE_API_URL` to your Render backend URL
5. Redeploy

---

## Alternative: Deploy Both on Railway

### Railway Setup

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. New Project → Deploy from GitHub

### Backend on Railway

```bash
# In server directory
# Create railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "heroku.buildpacks"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start",
    "restartPolicyMaxRetries": 5
  }
}
```

### Frontend on Railway (Static Site)

- Build locally: `npm run build`
- Deploy dist folder as static site
- Or use Railway's GitHub integration

---

## Using Docker

### Create Docker Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_DATABASE: crm
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./server
    environment:
      MONGO_URI: mongodb://mongodb:27017/crm
      JWT_SECRET: your_secret_key
      NODE_ENV: production
      CLIENT_URL: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    build: ./client
    ports:
      - "3000:5173"
    environment:
      VITE_API_URL: http://backend:5000/api

volumes:
  mongodb_data:
```

### Build and Run

```bash
docker-compose up --build
```

---

## Environment Variables (Production)

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/crm
JWT_SECRET=your_super_secret_key_with_random_chars
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.com/api
```

---

## MongoDB Atlas Setup

### Create Free Cluster

1. Go to [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Create Organization
4. Create Project
5. Create Cluster (Free tier)
6. Create Database User
7. Get Connection String

### Update Backend

```
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/crm?retryWrites=true&w=majority
```

---

## Performance Optimization

### Frontend
```bash
# Minimize bundle
npm run build

# Check bundle size
npm install -g webpack-bundle-analyzer
```

### Backend
```bash
# Add database indexes (already done)
# Monitor performance
# Use CDN for static files
```

---

## SSL/HTTPS

Both Vercel and Render provide free SSL certificates automatically.

---

## Monitoring & Logs

### Vercel
- Dashboard → Deployments → View logs

### Render
- Dashboard → Service → Logs

### MongoDB Atlas
- Atlas Dashboard → Metrics

---

## Database Backup

### Schedule Backups
- MongoDB Atlas: Automatic daily backups
- Manual backup: Export data regularly

### Export Data
```bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/crm" --out ./backup
```

---

## Continuous Deployment

Both Vercel and Render support:
- Automatic deployments on git push
- Preview deployments for pull requests
- Rollback to previous versions

---

## Cost Estimation

### Free Options
- Vercel Frontend: Free
- Render Backend: Free (with sleep after 15 min inactivity)
- MongoDB Atlas: Free tier (512 MB storage)

### Paid Options
- Vercel Pro: $20/month
- Render Paid Plan: $10+/month
- MongoDB Atlas Paid: $57+/month

### Total (Minimal)
- Production setup: ~$67/month (Vercel Pro + Render Paid + MongoDB)
- Hobby setup: Free (with limitations)

---

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables set correctly
- [ ] Database connection working
- [ ] CORS properly configured
- [ ] SSL certificates active
- [ ] Backup system configured
- [ ] Monitoring enabled
- [ ] Error tracking setup (optional: Sentry)
- [ ] Test login and key features

---

## Troubleshooting

### Backend won't connect to MongoDB
- Check connection string
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### CORS errors in production
- Verify CLIENT_URL in backend matches frontend URL
- Check origin header in requests

### Frontend can't reach backend
- Verify VITE_API_URL is correct
- Check backend is running and publicly accessible
- Look at network tab in browser dev tools

### Slow performance
- Check database indexes
- Monitor backend CPU/memory
- Optimize frontend bundle size
- Enable caching

---

**Happy Deploying! 🚀**
