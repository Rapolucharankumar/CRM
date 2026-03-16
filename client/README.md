# Frontend Client - CRM Pro

React + Vite frontend for the CRM Pro application.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

### Start Development Server
```bash
npm run dev
```

App will be available at http://localhost:5173

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

## Features

✅ Modern, responsive UI with Tailwind CSS
✅ React Router for navigation
✅ Context API for authentication state
✅ Axios interceptor for JWT tokens
✅ Protected routes with authentication
✅ Form validation and error handling
✅ Toast notifications
✅ Drag-and-drop Kanban board
✅ Charts and analytics
✅ Pagination
✅ Search and filtering

## Pages

### Authentication
- **Login** - `/login` - Sign in to existing account
- **Register** - `/register` - Create new account

### Dashboard Application
- **Dashboard** - `/dashboard` - Analytics and metrics
- **Leads** - `/leads` - Lead management (CRUD)
- **Pipeline** - `/pipeline` - Kanban board view
- **Follow-ups** - `/followups` - Today & overdue follow-ups

## Components

### Layout Components
- `Sidebar` - Navigation menu
- `Navbar` - Top header with user info
- `Layout` - Main layout wrapper

### UI Components (UI.jsx)
- `Button` - Multiple variants and sizes
- `Input` - Text input with label and error
- `Select` - Dropdown select
- `Card` - Container component
- `Modal` - Dialog overlay
- `Toast` - Notification system
- `Badge` - Status badges
- `LoadingSpinner` - Loading indicator

## Context & Services

### AuthContext
- Manages user authentication state
- Provides login/logout functions
- Stores JWT token in localStorage
- Auto-logout on token expiry

### API Service
- Centralized axios instance
- Auto-adds JWT token to requests
- Methods for:
  - Authentication (register, login, getMe)
  - Leads (CRUD, dashboard, followups)

## Project Structure

```
src/
├── components/
│   └── UI.jsx              # Reusable UI components
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Analytics dashboard
│   ├── Leads.jsx           # Lead management
│   ├── Pipeline.jsx        # Kanban board
│   └── FollowUps.jsx       # Follow-ups tracker
├── layouts/
│   └── Layout.jsx          # Sidebar + Navbar layout
├── services/
│   └── api.js              # API service
├── context/
│   └── AuthContext.jsx     # Auth state management
├── App.jsx                 # Main routing
├── main.jsx                # React entry point
└── index.css               # Global styles

```

## Styling

### Tailwind CSS
- Pre-configured with custom theme
- Primary color: Blue (#3B82F6)
- Secondary color: Purple (#8B5CF6)
- Accent color: Pink (#EC4899)
- Custom shadows and spacing

### Color Palette
```javascript
{
  primary: "#3B82F6",      // Blue
  secondary: "#8B5CF6",    // Purple
  accent: "#EC4899",       // Pink
  dark: "#1F2937",         // Dark gray
  light: "#F3F4F6"         // Light gray
}
```

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token added to all API requests via axios interceptor
5. Protected routes check for valid token
6. Logout removes token and redirects to login

## Lead Management Flow

1. **Create**: Fill form → API POST → Update state
2. **Read**: Fetch with filters → Display in table
3. **Update**: Click edit → Modal form → API PUT
4. **Delete**: Confirm → API DELETE → Refresh

## Kanban Board Features

- Drag leads between 6 status columns
- Real-time status update on drop
- Shows lead count per column
- Displays total deal value per column
- Visual feedback during drag

## Dashboard Analytics

- **Metrics Cards**: Total leads, closed deals, revenue, overdue
- **Pie Charts**: Leads by status, lead sources
- **Bar Chart**: Monthly revenue trend

## Error Handling

- API errors shown as toast notifications
- Form validation before submission
- Auto-redirect on auth failure
- Graceful error messages for user

## Performance

- Code splitting with React Router
- Image optimization
- Lazy loading components
- Efficient re-renders with Context
- Memoization where needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Demo Credentials

After backend seeding:
- Email: `demo@crm.com`
- Password: `demo123456`

Also available:
- manager@crm.com (Manager role)
- admin@crm.com (Admin role)
- Password: `demo123456` (same for all demo accounts)

## Troubleshooting

**API Connection Error**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` environment variable
- Verify CORS is enabled on backend

**Blank Page**
- Check browser console for errors
- Ensure all dependencies are installed
- Clear cache and hard refresh

**Authentication Issues**
- Check localStorage for token
- Verify token expiration (7 days)
- Try logging in again

**Drag-and-Drop Not Working**
- Ensure react-beautiful-dnd is installed
- Check browser console for errors
- Try refreshing the page

## Performance Tips

1. Use pagination for large datasets
2. Implement search instead of loading all leads
3. Cache frequently accessed data
4. Minimize component re-renders
5. Use production build for deployment

---

**Frontend for CRM Pro Application**
