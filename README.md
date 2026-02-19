# CRM Pro - Full Stack Customer Relationship Management System

A modern, production-ready CRM application built with the MERN stack. Manage leads, track follow-ups, visualize your sales pipeline with Kanban boards, and monitor analytics through an intuitive dashboard.

## 🎯 Features

### 📋 Lead Management
- Create, read, update, and delete leads
- Filter leads by status, source, or search by name/company
- Pagination (10 leads per page)
- Automatic overdue detection for follow-ups

### 📊 Sales Pipeline (Kanban Board)
- Drag-and-drop leads between 6 stages (New → Lost)
- Real-time status updates
- View total deal value per stage
- Count leads in each stage

### 📈 Dashboard Analytics
- Total leads, closed deals, and revenue metrics
- Leads by status (pie chart)
- Monthly revenue trend (bar chart)
- Lead source distribution (pie chart)
- Overdue follow-ups alert

### 📅 Follow-up Management
- View today's follow-ups
- Track overdue follow-ups
- Quick mark as completed
- Automatic overdue detection

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access (Sales Rep, Manager, Admin)
- Protected routes and API endpoints
- Token stored in localStorage

### 🎨 UI/UX
- Modern, clean SaaS-style design
- Responsive design (mobile, tablet, desktop)
- Soft shadows and rounded corners
- Sidebar navigation
- Toast notifications
- Loading states

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Other**: CORS, dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Drag & Drop**: React Beautiful DnD
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Context API

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas connection string)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your MongoDB URI**
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/crm
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

5. **Seed the database with demo data** (optional)
   ```bash
   npm run seed
   ```
   
   Demo credentials:
   - Email: `demo@crm.com`
   - Password: `demo123456`

6. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with API URL**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   App will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "sales"
}

Response: { token, user: { id, name, email, role } }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: { token, user: { id, name, email, role } }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: { user: { id, name, email, role } }
```

### Leads Endpoints

#### Get All Leads
```
GET /api/leads?page=1&status=New&source=Website&search=Acme
Authorization: Bearer <token>

Response: { leads: [...], pagination: { total, pages, currentPage } }
```

#### Create Lead
```
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Company Name",
  "email": "contact@company.com",
  "phone": "555-1234",
  "company": "Company Inc",
  "source": "Website",
  "dealValue": 50000,
  "nextFollowUp": "2024-02-25T00:00:00Z"
}

Response: { message, lead }
```

#### Get Single Lead
```
GET /api/leads/:id
Authorization: Bearer <token>

Response: { lead }
```

#### Update Lead
```
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Contacted",
  "nextFollowUp": "2024-02-26T00:00:00Z"
}

Response: { message, lead }
```

#### Delete Lead
```
DELETE /api/leads/:id
Authorization: Bearer <token>

Response: { message }
```

#### Get Dashboard Stats
```
GET /api/leads/stats/dashboard
Authorization: Bearer <token>

Response: {
  stats: { totalLeads, closedDeals, totalRevenue, overdueFollowups },
  charts: { leadsByStatus, monthlyRevenue, sourceDistribution }
}
```

#### Get Follow-ups
```
GET /api/leads/followups/list
Authorization: Bearer <token>

Response: { todayFollowUps, overdueFollowUps }
```

## 📂 Project Structure

```
CRM/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Lead.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── leadController.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── leads.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   └── UI.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Leads.jsx
    │   │   ├── Pipeline.jsx
    │   │   └── FollowUps.jsx
    │   ├── layouts/
    │   │   └── Layout.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

## 🔒 Security Features

- ✅ JWT-based authentication with expiration
- ✅ Password hashing with bcryptjs (salted)
- ✅ Protected API routes with authentication middleware
- ✅ Role-based access control (RBAC)
- ✅ CORS enabled
- ✅ Request body validation
- ✅ Secure token storage in localStorage

## 🎨 UI Components

### Reusable Components
- `Button` - Primary, secondary, danger, success variants
- `Input` - With label and error states
- `Select` - Dropdown input
- `Card` - Rounded container with shadow
- `Modal` - Dialog for adding/editing leads
- `Toast` - Notifications (success, error, info)
- `Badge` - Status and source badges
- `LoadingSpinner` - Loading indicator

## 💡 Usage Examples

### Adding a Lead
1. Click "Add Lead" button on the Leads page
2. Fill in the form (Name, Email, Company required)
3. Optionally set source, deal value, and follow-up date
4. Click "Create Lead"

### Moving Leads in Pipeline
1. Go to Pipeline (Kanban Board)
2. Drag a lead card to a different stage
3. Status updates automatically in the database

### Viewing Analytics
1. Go to Dashboard
2. View metrics cards at the top
3. Analyze charts for leads, sources, and revenue
4. Monitor overdue follow-ups

### Managing Follow-ups
1. Go to Follow-ups page
2. View overdue follow-ups (red section)
3. View today's follow-ups (blue section)
4. Click "Done" to mark follow-up as completed

## 🚀 Deployment

### Deploy Backend on Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

### Deploy Frontend on Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Set environment variables
7. Deploy

## 📊 Sample Data

The application comes with seed data that includes:
- 3 demo users (Sales Rep, Manager, Admin)
- 10 sample leads across all statuses
- Various lead sources
- Different deal values
- Mixed follow-up dates

Run `npm run seed` in the server directory to populate the database.

## 🐛 Common Issues

### "MongoDB connection error"
- Ensure MongoDB is running locally or update `MONGO_URI` with your Atlas connection string
- Check that the URL format is correct

### "CORS error"
- Verify `CLIENT_URL` in backend `.env` matches your frontend URL
- Check that both frontend and backend are running

### "Token expired"
- Refresh the page to login again
- JWT tokens expire after 7 days

### "Leads not updating in Kanban"
- Ensure backend is running
- Check browser console for API errors
- Verify lead ID is correct

## 📝 License

Created for educational purposes. Feel free to modify and use for your projects.

## 🤝 Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure both backend and frontend are running
4. Review the API documentation above

---

**Built with ❤️ using MERN Stack**
#   C R M  
 