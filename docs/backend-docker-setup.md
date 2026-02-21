# Using Docker for PostgreSQL

If you have Docker Desktop installed, you can run PostgreSQL without installing it directly on your system.

## Prerequisites

Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

## Start PostgreSQL

```powershell
cd backend
docker-compose up -d
```

This will:

- Download PostgreSQL image (first time only)
- Start PostgreSQL on port 5432
- Create database automatically

## Stop PostgreSQL

```powershell
docker-compose down
```

## View Logs

```powershell
docker-compose logs postgres
```

## Connect

Your `.env` file is already configured:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/loan_portal_db?schema=public"
```

## Continue Setup

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

## Troubleshooting

### Port 5432 already in use

If you have another PostgreSQL instance running:

```powershell
# Check what's using port 5432
Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue

# Stop any PostgreSQL service
Get-Service *postgresql* | Stop-Service

# Or change port in docker-compose.yml to "5433:5432" and update DATABASE_URL
```

## Related Documentation

- [Backend API](./backend-api.md) - Main backend documentation
- [SQLite Setup](./backend-sqlite-setup.md) - Alternative lightweight database
- [Migration Guide](./backend-migration.md) - Migrating from json-server
