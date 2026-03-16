# API Testing Guide - CRM Pro

Complete guide to test all API endpoints using curl commands.

## Prerequisites

- Backend running on `http://localhost:5000`
- cURL installed (or use Postman)
- MongoDB with seed data (run `npm run seed`)

## Authentication

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "sales"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "sales"
  }
}
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@crm.com",
    "password": "demo123456"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Smith",
    "email": "demo@crm.com",
    "role": "sales"
  }
}
```

### Get Current User

```bash
# Replace TOKEN with actual JWT token from login
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Leads - CRUD Operations

### Get All Leads

```bash
TOKEN="your_jwt_token_here"

# Basic
curl -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl -X GET "http://localhost:5000/api/leads?page=1" \
  -H "Authorization: Bearer $TOKEN"

# With filters
curl -X GET "http://localhost:5000/api/leads?status=New&source=Website" \
  -H "Authorization: Bearer $TOKEN"

# With search
curl -X GET "http://localhost:5000/api/leads?search=Acme" \
  -H "Authorization: Bearer $TOKEN"

# Combined
curl -X GET "http://localhost:5000/api/leads?page=1&status=Contacted&search=Company&source=Referral" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "leads": [
    {
      "_id": "...",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "phone": "555-0101",
      "company": "Acme Corporation",
      "source": "Website",
      "status": "New",
      "notes": "...",
      "dealValue": 50000,
      "nextFollowUp": "2024-02-25T00:00:00.000Z",
      "assignedTo": { "name": "John Smith" },
      "createdAt": "2024-02-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "pages": 1,
    "currentPage": 1
  }
}
```

### Create Lead

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Company Inc",
    "email": "contact@newcompany.com",
    "phone": "555-9999",
    "company": "New Company",
    "source": "Website",
    "dealValue": 75000,
    "nextFollowUp": "2024-03-01T00:00:00Z",
    "notes": "Interested in enterprise plan"
  }'
```

**Response:**
```json
{
  "message": "Lead created successfully",
  "lead": {
    "_id": "...",
    "name": "New Company Inc",
    "email": "contact@newcompany.com",
    "status": "New",
    ...
  }
}
```

### Get Single Lead

```bash
TOKEN="your_jwt_token_here"
LEAD_ID="lead-id-here"

curl -X GET http://localhost:5000/api/leads/$LEAD_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update Lead

```bash
TOKEN="your_jwt_token_here"
LEAD_ID="lead-id-here"

curl -X PUT http://localhost:5000/api/leads/$LEAD_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Contacted",
    "notes": "Called client, very interested",
    "nextFollowUp": "2024-02-20T00:00:00Z"
  }'
```

### Delete Lead

```bash
TOKEN="your_jwt_token_here"
LEAD_ID="lead-id-here"

curl -X DELETE http://localhost:5000/api/leads/$LEAD_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Analytics Endpoints

### Get Dashboard Statistics

```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:5000/api/leads/stats/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "stats": {
    "totalLeads": 10,
    "closedDeals": 2,
    "totalRevenue": 275000,
    "overdueFollowups": 2
  },
  "charts": {
    "leadsByStatus": [
      { "_id": "New", "count": 3 },
      { "_id": "Contacted", "count": 2 },
      { "_id": "Qualified", "count": 2 },
      { "_id": "Proposal Sent", "count": 1 },
      { "_id": "Closed", "count": 2 }
    ],
    "monthlyRevenue": [
      {
        "_id": { "year": 2024, "month": 2 },
        "revenue": 175000,
        "count": 1
      }
    ],
    "sourceDistribution": [
      { "_id": "Website", "count": 3 },
      { "_id": "Referral", "count": 2 },
      { "_id": "Phone", "count": 2 }
    ]
  }
}
```

### Get Follow-ups

```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:5000/api/leads/followups/list \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "todayFollowUps": [
    {
      "_id": "...",
      "name": "Company Name",
      "email": "contact@company.com",
      "company": "Company Inc",
      "status": "Contacted",
      "dealValue": 50000,
      "nextFollowUp": "2024-02-19T00:00:00.000Z",
      "notes": "Demo scheduled"
    }
  ],
  "overdueFollowUps": [
    {
      "_id": "...",
      "name": "Global Industries",
      "email": "procurement@global.com",
      "company": "Global Industries",
      "status": "Qualified",
      "dealValue": 75000,
      "nextFollowUp": "2024-02-17T00:00:00.000Z",
      "notes": "Waiting for budget approval"
    }
  ]
}
```

---

## Status Code Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - No token or invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Common Filters

### Status Filter
```
?status=New
?status=Contacted
?status=Qualified
?status=Proposal Sent
?status=Closed
?status=Lost
```

### Source Filter
```
?source=Website
?source=Phone
?source=Email
?source=Referral
?source=Social Media
?source=Other
```

### Search Examples
```
?search=Acme           # Search by name
?search=test@email.com # Search by email
?search=Manufacturing  # Search by company
```

### Pagination
```
?page=1  # Default
?page=2  # Second page
```

---

## Testing Workflow

### 1. Login and Get Token

```bash
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@crm.com",
    "password": "demo123456"
  }')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
```

### 2. Create a Lead

```bash
TOKEN="your_token_here"

LEAD=$(curl -s -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "email": "test@company.com",
    "company": "Test Company Inc",
    "dealValue": 50000
  }')

LEAD_ID=$(echo $LEAD | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Created Lead: $LEAD_ID"
```

### 3. Get Leads

```bash
TOKEN="your_token_here"

curl -s -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 4. Update Lead Status

```bash
TOKEN="your_token_here"
LEAD_ID="lead-id-here"

curl -X PUT http://localhost:5000/api/leads/$LEAD_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Contacted"}'
```

### 5. Get Dashboard Numbers

```bash
TOKEN="your_token_here"

curl -s -X GET http://localhost:5000/api/leads/stats/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import collection:
   - File → New → HTTP Request
   - Or import the endpoints manually
3. Set Base URL: `http://localhost:5000`
4. Create Environment variable for `token`
5. Test each endpoint

---

## Debugging Tips

### View Full Response
```bash
curl -v -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN"
```

### Pretty Print JSON
```bash
curl -s http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Check Headers
```bash
curl -i -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN"
```

### Save Response to File
```bash
curl -o response.json http://localhost:5000/api/leads \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Examples

### Invalid Token
```json
{
  "message": "No token provided"
}
```

### Lead Not Found
```json
{
  "message": "Lead not found"
}
```

### Missing Required Field
```json
{
  "message": "Name, email, and company are required"
}
```

### Access Denied
```json
{
  "message": "Access denied"
}
```

---

**Happy API Testing! 🚀**
