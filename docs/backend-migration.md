# Loan Portal - Backend Migration Guide

This guide will help you migrate from json-server to the new Node.js + PostgreSQL backend.

## What Changed?

### From json-server to Express + PostgreSQL

- **Before**: Simple file-based JSON database
- **After**: Production-ready PostgreSQL database with proper relationships
- **Benefits**: Better performance, data integrity, transactions, and scalability

## Step-by-Step Migration

### 1. Install PostgreSQL

**Windows:**

- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer and remember your password
- Default port: 5432

**Check Installation:**

```bash
psql --version
```

### 2. Create Database

Open psql (SQL Shell) or use pgAdmin:

```sql
CREATE DATABASE loan_portal_db;
```

### 3. Set Up Backend

```bash
cd backend
npm install
```

### 4. Configure Environment

Copy `.env.example` to `.env` and update:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/loan_portal_db?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### 5. Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Import data from db.json
npm run seed
```

### 6. Start Backend

```bash
npm run dev
```

Server should start on `http://localhost:3001`

### 7. Update Angular App

The Angular environment has already been configured to use the backend:

**src/environments/environment.ts**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
};
```

The authentication system is already integrated with JWT tokens from the backend.

### 8. Test the Migration

1. **Login Test:**
   - Email: `john.doe@example.com`
   - Password: `password123`

2. **Verify API:**
   - GET `http://localhost:3001/health` - Should return 200 OK
   - POST `http://localhost:3001/auth/login` - Should return JWT token
   - GET `http://localhost:3001/loan-types` - Should return loan types

3. **Test in Angular:**
   - Start Angular: `npm start`
   - Login with test credentials
   - Create a loan application
   - View loan list

## API Differences

### Authentication

**Before (json-server):**

```javascript
// Mock token
token: 'mock-jwt-token-customer';
```

**After (Express):**

```javascript
// Real JWT token
token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Response Format

Most endpoints remain the same. Loans endpoint now includes pagination:

**Before:**

```json
[{ loan1 }, { loan2 }]
```

**After:**

```json
{
  "data": [{ loan1 }, { loan2 }],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Angular service already handles this:**

```typescript
getLoans(page = 1, limit = 10): Observable<LoansResponse> {
  return this.http.get<LoansResponse>(
    `${this.apiUrl}/loans?page=${page}&limit=${limit}`
  );
}
```

## Troubleshooting

### "Cannot connect to PostgreSQL"

- Verify PostgreSQL is running:
  ```bash
  # Windows
  Get-Service postgresql*
  ```
- Check DATABASE_URL in `.env`
- Test connection: `psql -U postgres`

### "Port 3001 already in use"

- Stop json-server if still running
- Or change PORT in `backend/.env`

### "Prisma Client not generated"

```bash
cd backend
npm run prisma:generate
```

### "Authentication failed"

- Make sure you're using credentials from the seeded database
- Check if JWT_SECRET is set in `.env`
- Verify token is being sent in Authorization header

### "Migration failed"

Reset and try again:

```bash
cd backend
npx prisma migrate reset
npm run seed
```

## Production Deployment

When ready for production:

1. **Update Environment Variables:**

   ```env
   NODE_ENV=production
   DATABASE_URL=your-production-db-url
   JWT_SECRET=very-secure-random-string
   CORS_ORIGIN=https://your-domain.com
   ```

2. **Build and Deploy:**

   ```bash
   npm run build
   npm start
   ```

3. **Deploy PostgreSQL:**
   - Use managed services: AWS RDS, Heroku Postgres, DigitalOcean
   - Or deploy your own PostgreSQL server

## Related Documentation

- [Backend API](./backend-api.md) - Full backend API documentation
- [Docker Setup](./backend-docker-setup.md) - Using Docker for PostgreSQL
- [SQLite Setup](./backend-sqlite-setup.md) - Alternative quick development setup
- [Authentication](./auth.md) - Frontend authentication integration
