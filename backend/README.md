# Loan Portal Backend

A production-ready Node.js backend for the Loan Portal application, built with Express, TypeScript, PostgreSQL, and Prisma ORM.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe code
- **PostgreSQL** - Robust relational database with ACID compliance
- **Prisma ORM** - Type-safe database access
- **JWT Authentication** - Secure token-based authentication
- **Role-based Authorization** - Customer, Loan Officer, and Admin roles
- **RESTful API** - Standard HTTP methods and status codes
- **Audit Logging** - Track all important actions
- **CORS** - Configured for Angular frontend

## 📋 Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update the values:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/loan_portal_db?schema=public"
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:4200
   ```

4. **Set up PostgreSQL database**

   Create a new database:

   ```sql
   CREATE DATABASE loan_portal_db;
   ```

   Or using psql:

   ```bash
   psql -U postgres
   CREATE DATABASE loan_portal_db;
   \q
   ```

5. **Run Prisma migrations**

   ```bash
   npm run prisma:migrate
   ```

6. **Generate Prisma Client**

   ```bash
   npm run prisma:generate
   ```

7. **Seed the database with initial data**
   ```bash
   npm run seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3001` with hot-reloading enabled.

### Production Mode

```bash
npm run build
npm start
```

## 📚 API Documentation

### Authentication

#### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "user-001",
    "email": "john.doe@example.com",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

#### POST /auth/register

Register a new user.

**Request:**

```json
{
  "email": "new.user@example.com",
  "password": "securePassword123",
  "firstName": "New",
  "lastName": "User",
  "phone": "+1-555-1234",
  "role": "customer"
}
```

### Loans

All loan endpoints require authentication. Include JWT token in headers:

```
Authorization: Bearer <token>
```

#### GET /loans

Get all loans with pagination and filtering.

**Query Parameters:**

- `status` - Filter by status (pending, approved, rejected)
- `type` - Filter by loan type (personal, auto, home)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

#### GET /loans/:id

Get a specific loan by ID.

#### POST /loans (or /loans/submit)

Create a new loan application.

**Request:**

```json
{
  "type": "auto",
  "amount": {
    "requested": 35000,
    "currency": "USD"
  },
  "termMonths": 60,
  "applicant": {
    "fullName": "Jane Smith",
    "dateOfBirth": "1990-03-22",
    "ssn": "123-45-6789",
    "income": 85000,
    "employmentStatus": "full-time",
    "creditScore": 780
  },
  "vehicleInfo": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "vin": "1234567890ABCDEFGH",
    "mileage": 15000,
    "value": 30000
  },
  "downPayment": 5000
}
```

#### PUT /loans/:id

Update loan status (requires loan-officer or admin role).

**Request:**

```json
{
  "status": "approved",
  "approvedAmount": 32000
}
```

#### DELETE /loans/:id

Delete a loan (requires admin role).

### Loan Types

#### GET /loan-types

Get all available loan types (no authentication required).

#### GET /loan-types/:id

Get a specific loan type by ID.

### Applicants

#### GET /applicants

Get all applicants (requires authentication).

#### GET /applicants/:id

Get a specific applicant with their loan history.

### Audit Logs

#### GET /audit-logs

Get audit logs (requires loan-officer or admin role).

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)

## 🗃️ Database Schema

The database uses PostgreSQL with the following main tables:

- **User** - Authentication and user information
- **LoanType** - Loan product definitions
- **Applicant** - Loan applicant information
- **Loan** - Loan applications and their status
- **VehicleInfo** - Vehicle details for auto loans
- **AuditLog** - Audit trail of all actions

## 🔐 Authentication & Authorization

### Roles

- **customer** - Can create and view their own loans
- **loan-officer** - Can view all loans and update their status
- **admin** - Full access including deletion

### Test Users

After seeding, you can use these credentials:

**Customer:**

- Email: `john.doe@example.com`
- Password: `password123`

**Loan Officer:**

- Email: `loan.officer@bank.com`
- Password: `admin123`

## 🛠️ Useful Commands

```bash
# Development
npm run dev                 # Start development server with hot-reload

# Database
npm run prisma:migrate      # Run database migrations
npm run prisma:generate     # Generate Prisma Client
npm run prisma:studio       # Open Prisma Studio (GUI for database)
npm run seed                # Seed database with initial data

# Production
npm run build               # Build TypeScript to JavaScript
npm start                   # Start production server
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── loan.controller.ts
│   │   ├── applicant.controller.ts
│   │   ├── loan-type.controller.ts
│   │   └── audit-log.controller.ts
│   ├── routes/            # API routes
│   │   ├── auth.routes.ts
│   │   ├── loan.routes.ts
│   │   ├── applicant.routes.ts
│   │   ├── loan-type.routes.ts
│   │   └── audit-log.routes.ts
│   ├── middleware/        # Custom middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── lib/              # Utilities and configs
│   │   └── prisma.ts
│   ├── scripts/          # Database scripts
│   │   └── seed.ts
│   └── index.ts          # Application entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json
└── tsconfig.json
```

## 🔄 Migrating from json-server

The backend is fully compatible with your existing Angular application. The API endpoints match json-server's structure:

1. Update your Angular environment files to point to the new backend
2. Update the auth interceptor to use the new JWT token format
3. All endpoints remain the same (`/loans`, `/applicants`, etc.)

## 🚨 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Environment Variables

| Variable         | Description                          | Default               |
| ---------------- | ------------------------------------ | --------------------- |
| `DATABASE_URL`   | PostgreSQL connection string         | -                     |
| `PORT`           | Server port                          | 3001                  |
| `NODE_ENV`       | Environment (development/production) | development           |
| `JWT_SECRET`     | Secret key for JWT signing           | -                     |
| `JWT_EXPIRES_IN` | JWT expiration time                  | 24h                   |
| `CORS_ORIGIN`    | Allowed CORS origin                  | http://localhost:4200 |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests (if available)
4. Submit a pull request

## 📄 License

ISC

## 🆘 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check PostgreSQL user has proper permissions

### Port Already in Use

- Change PORT in `.env` file
- Kill process using port 3001: `npx kill-port 3001`

### Prisma Client Errors

- Regenerate Prisma Client: `npm run prisma:generate`
- Reset database: `npx prisma migrate reset`

## 📞 Support

For issues or questions, please create an issue in the repository.
