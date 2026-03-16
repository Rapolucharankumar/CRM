<div align="center">
  <h1>🚀 CRM Pro</h1>
  <p><b>Full Stack Customer Relationship Management System</b></p>
  
  <p>
    A modern, production-ready CRM application built with the MERN stack. Manage leads, track follow-ups, visualize your sales pipeline with Kanban boards, and monitor analytics through an intuitive dashboard.
  </p>

  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="ExpressJS" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </div>
</div>

<br />

## 📖 Table of Contents

- [🎯 Features](#-features)
- [🏗️ Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentation Index](#-documentation-index)
- [📦 Project Structure](#-project-structure)
- [💡 Usage Guide](#-usage-guide)
- [🌐 Deployment](#-deployment)
- [🐛 Troubleshooting](#-troubleshooting)

---

## 🎯 Features

**CRM Pro** offers a comprehensive suite of tools designed to streamline your sales process:

- **📋 Lead Management**: Create, filter, and track leads with automatic overdue detection.
- **📊 Sales Pipeline**: Interactive Kanban board with drag-and-drop functionality across 6 stages.
- **📈 Dashboard Analytics**: Visual insights through pie charts, bar charts, and key performance metrics.
- **📅 Follow-up Tracking**: Keep track of daily and overdue follow-ups effortlessly.
- **🔐 Secure Access**: Role-based access control (Admin, Manager, Sales Rep) with JWT authentication.
- **🎨 Modern UI/UX**: Responsive, SaaS-style design with loading states and toast notifications.

> 🔗 For a detailed breakdown of all features, see [FEATURES.md](./FEATURES.md).

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State & Routing**: React Router DOM, Context API
- **Utilities**: Axios, React Beautiful DnD, Recharts

### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT, bcryptjs, express-validator, CORS

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Clone & Install
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies (in a new terminal)
cd client
npm install
```

### 2. Environment Setup
Create `.env` files in both `server` and `client` directories using their respective `.env.example` templates.

**Server (.env)**:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client (.env)**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application
```bash
# Start backend (from /server)
npm run seed  # Optional: Seed demo data
npm run dev

# Start frontend (from /client)
npm run dev
```

> 🔗 See [QUICKSTART.md](./QUICKSTART.md) for more detailed setup instructions.

---

## 📚 Documentation Index

To keep this README concise, detailed information has been organized into dedicated files:

| Document | Description |
|----------|-------------|
| 🚀 [QUICKSTART.md](./QUICKSTART.md) | Detailed installation and setup guide |
| 📋 [FEATURES.md](./FEATURES.md) | Comprehensive list of application features |
| 📖 [API_TESTING.md](./API_TESTING.md) | Complete API documentation and endpoints |
| 🏗️ [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | High-level architectural overview |
| 🗂️ [FILE_MANIFEST.md](./FILE_MANIFEST.md) | Detailed directory and file structure |
| 🚢 [DEPLOYMENT.md](./DEPLOYMENT.md) | Guides for deploying to production |

---

## 📦 Project Structure

```text
CRM/
├── server/                 # Node.js / Express Backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routing
│   ├── middleware/         # Auth & validation
│   └── server.js           # Entry point
│
└── client/                 # React / Vite Frontend
    ├── src/
    │   ├── components/     # Reusable UI elements
    │   ├── pages/          # Main application views
    │   ├── context/        # Global state management
    │   └── services/       # API integration
    └── index.html          # HTML template
```

---

## 💡 Usage Guide

1. **Dashboard**: Get a bird's-eye view of your sales performance.
2. **Leads**: Add new prospects and manage their details.
3. **Pipeline**: Drag and drop leads between stages: `New` → `Contacted` → `Qualified` → `Proposal` → `Won` / `Lost`.
4. **Follow-ups**: Check your daily tasks and clear overdue follow-ups.

---

## 🌐 Deployment

- **Backend**: Recommended to deploy on **Render**, **Railway**, or **Heroku**.
- **Frontend**: Recommended to deploy on **Vercel** or **Netlify**.

> 🔗 See full deployment steps in [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Ensure your `.env` connection string is correct and your IP is whitelisted (if using Atlas).
- **CORS Error**: Verify the `CLIENT_URL` in the backend `.env` matches your exact frontend URL.
- **Token Expired**: Simply log out and log back in to generate a fresh JWT.

---

<div align="center">
  <p>Created for educational purposes and real-world application management.</p>
  <p><b>Built with ❤️ using the MERN Stack</b></p>
</div>