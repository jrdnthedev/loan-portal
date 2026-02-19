# SQLite Setup (Quick Development)

Use SQLite for quick development without installing PostgreSQL.

## Setup

1. **Replace schema:**

   ```powershell
   cd backend
   Copy-Item prisma\schema.sqlite.prisma prisma\schema.prisma -Force
   ```

2. **Update .env:**

   ```env
   # Comment out PostgreSQL
   # DATABASE_URL="postgresql://postgres:postgres@localhost:5432/loan_portal_db?schema=public"

   # SQLite doesn't need DATABASE_URL - defined in schema
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=loan-portal-secret-key-change-in-production-2024
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:4200
   ```

3. **Run setup:**
   ```powershell
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   npm run dev
   ```

Done! Your database will be in `prisma/dev.db`

## View Database

```powershell
npm run prisma:studio
```

## Switch Back to PostgreSQL Later

When ready for production PostgreSQL:

1. Copy `prisma\schema.prisma.backup` back to `prisma\schema.prisma`
2. Update `.env` with PostgreSQL connection
3. Run migrations again

## Pros & Cons

**Pros:**

- ✅ No installation required
- ✅ Fast setup
- ✅ Perfect for development
- ✅ File-based database

**Cons:**

- ❌ Not recommended for production
- ❌ Limited concurrent connections
- ❌ No advanced PostgreSQL features

For serious development and production, use PostgreSQL.
