# Backend Server - CRM Pro

Express.js + MongoDB backend for the CRM Pro application.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Seed Database (Optional)
Populate the database with demo data:
```bash
npm run seed
```

### Start Server
```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```

Server will listen on http://localhost:5000

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Leads
- `GET /api/leads` - Get all leads (with filters & pagination)
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/stats/dashboard` - Get dashboard statistics
- `GET /api/leads/followups/list` - Get follow-ups (today & overdue)

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (sales, manager, admin),
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Lead
```javascript
{
  name: String,
  email: String,
  phone: String,
  company: String,
  source: String (Website, Phone, Email, Referral, Social Media, Other),
  status: String (New, Contacted, Qualified, Proposal Sent, Closed, Lost),
  notes: String,
  dealValue: Number,
  nextFollowUp: Date,
  assignedTo: ObjectId (ref: User),
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Middleware

### Authentication (`verifyToken`)
Validates JWT token from Authorization header.

### Role-based Access
- `verifyAdmin` - Admin only
- `verifyManager` - Admin or Manager only

## Features

✅ JWT authentication with 7-day expiration
✅ Password hashing with bcryptjs
✅ Role-based access control
✅ Lead filtering by status, source, search
✅ Pagination (10 leads per page)
✅ Dashboard statistics aggregation
✅ Follow-up tracking with overdue detection
✅ Error handling and validation
✅ CORS enabled

## MongoDB Indexes

- `Lead`: `{ assignedTo, status }` - For faster queries
- `Lead`: `{ email }` - For email lookups

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Validate all input data
- CORS is configured - update `origin` for production
- Passwords are hashed with bcryptjs (10 salt rounds)

## Demo Credentials

After seeding:
- Email: `demo@crm.com`
- Password: `demo123456`

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port Already in Use**
- Change PORT in `.env` to an available port
- Or kill the process using port 5000

**Token Errors**
- JWT tokens expire after 7 days
- Update JWT_SECRET if needed (all existing tokens will be invalid)

---

**Backend for CRM Pro Application**
