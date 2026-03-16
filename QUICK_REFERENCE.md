# CRM Pro - Quick Reference Card

## 🚀 QUICK START (5 Minutes)

```bash
# Terminal 1 - Backend
cd server && npm install && npm run dev

# Terminal 2 - Frontend (different window)
cd client && npm install && npm run dev

# Open browser
http://localhost:5173

# Login
Email: demo@crm.com
Password: demo123456
```

---

## 📂 IMPORTANT FILES

| File | Purpose |
|------|---------|
| server/server.js | Backend entry point |
| client/src/App.jsx | Frontend router |
| server/.env | Backend config |
| client/.env | Frontend config |
| server/models/{User,Lead}.js | Database schemas |
| client/src/pages/*.jsx | Page components |

---

## 🔐 AUTHENTICATION

### Login Endpoint
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### How to use token in requests
```bash
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Demo Accounts
```
Email: demo@crm.com (Sales Rep)
Email: manager@crm.com (Manager)
Email: admin@crm.com (Admin)
Password: demo123456 (all)
```

---

## 📋 MAIN PAGES & URLs

| URL | Purpose |
|-----|---------|
| /login | Sign in |
| /register | Create account |
| /dashboard | Analytics & metrics |
| /leads | Manage leads |
| /pipeline | Kanban board |
| /followups | Today & overdue |

---

## 📞 COMMON API CALLS

### Get All Leads
```bash
GET /api/leads?page=1
```

### Create Lead
```bash
POST /api/leads
{
  "name": "Company",
  "email": "contact@company.com",
  "company": "Company Inc",
  "dealValue": 50000
}
```

### Update Lead
```bash
PUT /api/leads/LEAD_ID
{ "status": "Contacted" }
```

### Delete Lead
```bash
DELETE /api/leads/LEAD_ID
```

### Get Analytics
```bash
GET /api/leads/stats/dashboard
```

---

## 🎨 COMPONENT USAGE

### Button
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Input
```jsx
<Input 
  label="Name" 
  type="text" 
  value={value}
  onChange={handleChange}
/>
```

### Modal
```jsx
<Modal isOpen={open} onClose={closeModal} title="Title">
  <p>Content here</p>
</Modal>
```

### Toast
```jsx
<Toast 
  message="Success!" 
  type="success"
  onClose={handleClose}
/>
```

---

## 🏗️ PROJECT STRUCTURE

```
server/
├── models/ (Database schemas)
├── controllers/ (Business logic)
├── routes/ (API endpoints)
├── middleware/ (Auth, validation)
└── server.js

client/
├── pages/ (Full pages)
├── components/ (Reusable parts)
├── services/ (API calls)
├── context/ (State management)
├── layouts/ (Sidebar/Navbar)
└── App.jsx
```

---

## 🔧 ENVIRONMENT VARIABLES

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Can't login | Check MongoDB running, verify credentials |
| API error | Ensure backend running on :5000 |
| Blank page | Check browser console, restart dev server |
| CORS error | Check backend .env CLIENT_URL |
| Drag-drop fails | Refresh page, check console for errors |
| Build error | Delete node_modules, npm install again |

---

## 📊 DATABASE MODELS

### User
```javascript
{ name, email, password (hashed), role, department }
```

### Lead
```javascript
{ 
  name, email, phone, company, source, status,
  notes, dealValue, nextFollowUp, assignedTo
}
```

---

## 🎯 LEAD STATUSES

New → Contacted → Qualified → Proposal Sent → Closed/Lost

---

## 🔤 LEAD SOURCES

Website, Phone, Email, Referral, Social Media, Other

---

## 👥 USER ROLES

- **Sales**: Can see own leads
- **Manager**: Can see team leads
- **Admin**: Can see all leads

---

## 🚀 DEPLOY COMMANDS

### Backend (Render)
```bash
git push
# (Auto-deploys from GitHub)
```

### Frontend (Vercel)
```bash
npm run build  # Local test
git push
# (Auto-deploys from GitHub)
```

---

## 📝 USEFUL COMMANDS

```bash
# Backend
npm run dev           # Start dev
npm start            # Production
npm run seed         # Add demo data
npm install          # Install deps

# Frontend
npm run dev          # Start dev
npm run build        # Build prod
npm install          # Install deps

# Git
git status           # See changes
git add .            # Stage all
git commit -m "msg"  # Commit
git push             # Push
```

---

## 💾 SEED DATABASE

```bash
cd server
npm run seed
```

Creates:
- 3 demo users
- 10 sample leads
- Various statuses & sources

---

## 🔑 FEATURE CHECKLIST

- ✅ User auth with JWT
- ✅ Lead CRUD operations
- ✅ Kanban board with drag-drop
- ✅ Dashboard with charts
- ✅ Follow-up tracking
- ✅ Filtering & search
- ✅ Role-based access
- ✅ Responsive design

---

## 📚 DOCUMENTATION

- README.md - Full guide
- QUICKSTART.md - 5-min setup
- DEPLOYMENT.md - Deploy to prod
- API_TESTING.md - Test endpoints
- FEATURES.md - All features
- DEVELOPER_CHECKLIST.md - Dev guide

---

## 🌐 URLS

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API | http://localhost:5000/api |
| MongoDB | mongodb://localhost:27017 |

---

## ⚡ PERFORMANCE TARGETS

- API Response: < 100ms
- Page Load: < 2s
- Dashboard: < 1.5s
- Search: < 500ms

---

## 🆘 EMERGENCY CONTACTS

**Backend Issues**: Check server/README.md  
**Frontend Issues**: Check client/README.md  
**Deployment**: Check DEPLOYMENT.md  
**API Issues**: Check API_TESTING.md  

---

## 📋 BEFORE YOU START CODE

1. Read README.md
2. Run npm install (both dirs)
3. Create .env files
4. Run npm run seed
5. Test login
6. Check all 4 pages load

---

## 🎓 LEARNING PATHS

### For Backend
1. Review server/server.js
2. Study models/ folder
3. Review controllers/ logic
4. Test API endpoints

### For Frontend
1. Review src/App.jsx
2. Study components/UI.jsx
3. Review pages/ components
4. Test form submissions

---

## ✅ DONE! YOU'RE READY!

Your CRM Pro app is fully functional. Start building! 🚀

---

**Print this card and keep it handy!**
