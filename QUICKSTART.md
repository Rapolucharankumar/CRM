# Quick Start Guide - CRM Pro

Get up and running in 5 minutes!

## 1️⃣ Prerequisites
- Node.js v16+ and npm
- MongoDB (local or Atlas)

## 2️⃣ Backend Setup (3 minutes)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and set your MongoDB URI
# Example for local: mongodb://localhost:27017/crm
# Example for Atlas: mongodb+srv://user:pass@cluster.mongodb.net/crm

# Seed database with demo data
npm run seed

# Start server
npm run dev
```

✅ Backend running on http://localhost:5000

## 3️⃣ Frontend Setup (2 minutes)

```bash
# In another terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

✅ Frontend running on http://localhost:5173

## 4️⃣ Login with Demo Account

Navigate to http://localhost:5173/login

**Demo Credentials:**
```
Email: demo@crm.com
Password: demo123456
```

Other demo accounts:
```
manager@crm.com (Manager role)
admin@crm.com (Admin role)
Password: demo123456 (same for all)
```

## 5️⃣ Explore the Application

### 📊 Dashboard
- View your sales metrics
- Check revenue trends
- See lead distribution

### 📋 Leads
- Add new leads
- Filter by status/source
- Edit or delete leads
- Paginate through leads

### 🚀 Pipeline
- Drag leads between stages
- See total deal value per stage
- Visual sales pipeline

### 📅 Follow-ups
- Track today's follow-ups
- See overdue items
- Mark as completed

## 🔧 Configuration

### Change MongoDB Database

Edit `server/.env`:
```
MONGO_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/crm
```

### Change API Port

Edit `server/.env`:
```
PORT=3001
```

Then update `client/.env`:
```
VITE_API_URL=http://localhost:3001/api
```

### Change JWT Secret

Edit `server/.env`:
```
JWT_SECRET=your_new_super_secret_key_here_with_random_chars
```

## 📦 NPM Scripts

### Backend
```bash
npm run dev      # Development with auto-reload
npm start        # Production
npm run seed     # Seed database with demo data
```

### Frontend
```bash
npm run dev      # Development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Windows: netstat -ano | findstr :5000
# Linux/Mac: lsof -i :5000

# Change PORT in .env or kill process using port
```

### MongoDB connection fails
```bash
# Ensure MongoDB is running
# Local: mongod should be running
# Atlas: Check connection string and IP whitelist

# Test connection
mongo mongodb://localhost:27017/crm
```

### Frontend shows blank page
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### API calls fail
```bash
# Ensure backend is running on correct port
# Check VITE_API_URL in .env
# Check browser console for error details
```

## 🚀 What's Next?

1. **Customize**: Modify colors, logos, and branding
2. **Add Users**: Create more team members
3. **Import Data**: Add your real leads
4. **Deploy**: Push to Vercel (frontend) and Render (backend)
5. **Integrate**: Connect with email, CRM integrations

## 📚 Full Documentation

- [Backend README](./server/README.md)
- [Frontend README](./client/README.md)
- [Main README](./README.md)

## 💬 Need Help?

1. Check error messages in browser console
2. Review server logs in terminal
3. Verify all environment variables are set
4. Ensure both services are running
5. Check documentation files

## 🎉 You're All Set!

Your CRM Pro application is ready to use. Start managing leads and tracking sales today!

---

**Happy CRMing! 🚀**
