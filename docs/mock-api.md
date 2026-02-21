# Mock JSON API Setup (Legacy)

> **⚠️ DEPRECATED:** This documentation is for historical reference only. The loan portal now uses a production-ready Node.js + PostgreSQL backend. See the [Backend API Documentation](./backend-api.md) and [Migration Guide](./backend-migration.md) for current setup instructions.

This project **previously used** a mock JSON API server using `json-server` for development and testing purposes. It has been replaced with a full Express.js backend with PostgreSQL.

## Current Recommended Setup

For new development, please use:

1. **[Backend API](./backend-api.md)** - Production-ready Node.js + Express + PostgreSQL backend
2. **[Backend Migration Guide](./backend-migration.md)** - Step-by-step migration from json-server
3. **[Docker Setup](./backend-docker-setup.md)** - Easy PostgreSQL setup with Docker
4. **[SQLite Setup](./backend-sqlite-setup.md)** - Quick development without PostgreSQL

---

## Legacy Documentation (json-server)

The sections below document the old json-server setup for historical reference.

## Quick Start

### 1. Start the Mock API Server

```bash
npm run api
```

This starts the JSON server on `http://localhost:3001`

### 2. Start Both API and Angular Dev Server

```bash
npm run dev
```

This runs both the mock API server and Angular development server concurrently.

### 3. Start Only the Angular Development Server

```bash
npm start
```

## API Endpoints

The mock API provides the following endpoints:

### Loans

- `GET /loans` - Get all loans
- `GET /loans/:id` - Get a specific loan
- `POST /loans` - Create a new loan
- `PUT /loans/:id` - Update a loan
- `DELETE /loans/:id` - Delete a loan
- `POST /loans/submit` - Submit a loan application (custom endpoint)

### Applicants

- `GET /applicants` - Get all applicants
- `GET /applicants/:id` - Get a specific applicant
- `POST /applicants` - Create a new applicant
- `PUT /applicants/:id` - Update an applicant

### Loan Types

- `GET /loan-types` - Get available loan types

### Users (for authentication)

- `GET /users` - Get all users
- `POST /auth/login` - Login endpoint (custom)

### Query Parameters

JSON Server supports various query parameters:

- `?status=pending` - Filter by status
- `?applicant.id=applicant-001` - Filter by nested property
- `?_sort=submittedAt&_order=desc` - Sort results
- `?_page=1&_limit=10` - Pagination

## Example API Calls

### Get all loans

```javascript
fetch('http://localhost:3001/loans')
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Create a new loan

```javascript
fetch('http://localhost:3001/loans', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'personal',
    amount: { requested: 15000 },
    termMonths: 24,
    applicant: {
      id: 'applicant-001',
      fullName: 'John Doe',
      // ... other applicant fields
    },
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Login

```javascript
fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john.doe@example.com',
    password: 'password123',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Mock Data

The mock database (`db.json`) includes:

- 3 sample loans with different statuses
- 4 sample applicants
- 3 loan types (personal, auto, home)
- 2 sample users (customer and loan officer)

## Authentication

The mock API includes basic authentication simulation:

- **Customer Account**: `john.doe@example.com` / `password123`
- **Loan Officer Account**: `loan.officer@bank.com` / `admin123`

## Configuration

### JSON Server Configuration (`json-server.json`)

- Port: 3001
- Watch mode: enabled
- Static files: served from `./public`
- Custom middleware: `json-server-middleware.js`

### Custom Middleware Features

- CORS headers for cross-origin requests
- Simulated network delay (200ms)
- Custom authentication endpoints
- Custom loan submission endpoint

## File Structure

```
├── db.json                     # Mock database
├── json-server.json           # JSON server configuration
├── json-server-middleware.js  # Custom middleware
└── src/
    ├── environments/
    │   ├── environment.ts     # Development API URL
    │   └── environment.prod.ts # Production API URL
    └── app/domains/loan-application/services/
        └── loan-api.service.ts # Angular service for API calls
```

## Development Tips

1. **Data Persistence**: Changes made through the API are saved to `db.json` automatically
2. **Reset Data**: To reset the mock data, restore the original `db.json` content
3. **Custom Routes**: Add custom endpoints in `json-server-middleware.js`
4. **CORS**: Already configured for Angular development
5. **Error Simulation**: Modify middleware to simulate API errors for testing

## Production

For production, use the Node.js backend instead of json-server. See [Backend API Documentation](./backend-api.md) for deployment instructions.

## Why We Moved to a Real Backend

The json-server was sufficient for initial prototyping but had limitations:

- ❌ No real authentication/authorization
- ❌ Limited query capabilities
- ❌ No data relationships or integrity
- ❌ Not production-ready
- ❌ No transaction support

The new backend provides:

- ✅ Real JWT authentication
- ✅ Role-based authorization
- ✅ PostgreSQL with proper relationships
- ✅ Production-ready architecture
- ✅ Transaction support and data integrity
- ✅ Audit logging
- ✅ Better performance and scalability

## Related Documentation

- [Backend API](./backend-api.md) - Complete backend API documentation
- [Backend Migration Guide](./backend-migration.md) - Migrate from json-server
- [Authentication](./auth.md) - Frontend authentication integration
