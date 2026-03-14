# Loan Portal Documentation

Welcome to the Loan Portal documentation. This guide will help you understand, set up, and develop with the Loan Portal application.

## 📚 Table of Contents

### Getting Started

- **[Main README](../README.md)** - Project overview and quick start guide
- **[Backend Migration Guide](./backend-migration.md)** - Migrate from json-server to the production backend

### Backend Documentation

- **[Backend API](./backend-api.md)** - Complete backend API documentation
- **[Docker Setup](./backend-docker-setup.md)** - Run PostgreSQL with Docker
- **[SQLite Setup](./backend-sqlite-setup.md)** - Quick development with SQLite

### Frontend Documentation

- **[Authentication System](./auth.md)** - JWT authentication and authorization
- **[Loan Form Component](./loan-form-component.md)** - Reusable loan form documentation
- **[Shared Components](./shared-components.md)** - Complete guide to reusable UI components
- **[Testing Guide](./TESTING.md)** - Testing setup and best practices

### Legacy Documentation

- **[Mock API (Deprecated)](./mock-api.md)** - Legacy json-server documentation

## 🚀 Quick Start

### For New Developers

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd loan-portal
   npm install
   ```

2. **Set Up Backend**

   Choose one of these options:

   **Option A: PostgreSQL with Docker (Recommended)**

   ```bash
   cd backend
   docker-compose up -d
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   npm run dev
   ```

   See [Docker Setup](./backend-docker-setup.md) for details.

   **Option B: SQLite (Quick Development)**

   ```bash
   cd backend
   # Follow steps in SQLite Setup guide
   ```

   See [SQLite Setup](./backend-sqlite-setup.md) for details.

3. **Start Frontend**

   ```bash
   # In project root
   npm start
   ```

4. **Login**
   - Navigate to `http://localhost:4200`
   - Use test credentials:
     - Customer: `john.doe@example.com` / `password123`
     - Loan Officer: `loan.officer@bank.com` / `admin123`

## 🏗️ Architecture Overview

### Frontend (Angular 20)

```
src/app/
├── core/                 # Core functionality
│   └── auth/            # Authentication system
├── domains/             # Business domains
│   ├── admin/           # Admin & user management
│   ├── loan-application/ # Loan management
│   └── underwriting/    # Underwriting workflow
├── layout/              # Layout components
└── shared/              # Shared components
```

### Backend (Node.js + Express)

```
backend/src/
├── controllers/         # Request handlers
├── routes/             # API routes
├── middleware/         # Auth & error handling
├── lib/               # Prisma client
└── scripts/           # Database seeding
```

## 🔐 Authentication Flow

1. User submits credentials to `/auth/login`
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. HTTP interceptor adds token to all requests
5. Backend validates token on protected routes
6. Role-based guards control access to routes

See [Authentication System](./auth.md) for detailed documentation.

## 📡 API Integration

The frontend communicates with the backend via REST API:

- **Base URL (Dev)**: `http://localhost:3001`
- **Base URL (Prod)**: Configured in `environment.prod.ts`
- **Authentication**: JWT Bearer tokens
- **Endpoints**: See [Backend API](./backend-api.md)

### Key Endpoints

| Endpoint         | Method | Auth        | Description       |
| ---------------- | ------ | ----------- | ----------------- |
| `/auth/login`    | POST   | No          | User login        |
| `/auth/register` | POST   | No          | User registration |
| `/loans`         | GET    | Yes         | List loans        |
| `/loans`         | POST   | Yes         | Create loan       |
| `/loan-types`    | GET    | No          | Get loan types    |
| `/applicants`    | GET    | Yes         | List applicants   |
| `/audit-logs`    | GET    | Yes (Admin) | View audit logs   |

## 🗃️ Database

The application uses **PostgreSQL** (recommended) or **SQLite** (development):

### PostgreSQL Schema

- **User** - Authentication and user info
- **LoanType** - Loan product definitions
- **Applicant** - Loan applicant information
- **Loan** - Loan applications
- **VehicleInfo** - Auto loan details
- **AuditLog** - Audit trail

### Prisma Commands

```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
npm run seed            # Seed test data
```

## 🛡️ Security

### Frontend Security

- JWT token storage in localStorage
- HTTP interceptor for auth headers
- Route guards (Auth, Role, Guest)
- Role-based UI rendering

### Backend Security

- Password hashing with bcrypt
- JWT token signing and validation
- CORS configuration
- Role-based route protection
- Input validation and sanitization

## 🧪 Testing

### Frontend Tests

```bash
npm test          # Run unit tests
npm run test:ui   # Open test UI
```

### Backend Tests

```bash
cd backend
npm test
```

## 📦 Deployment

### Frontend Deployment

```bash
ng build --configuration production
```

Deploy the `dist/` folder to your hosting provider.

### Backend Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations
4. Deploy Node.js application

See [Backend API](./backend-api.md) for detailed deployment instructions.

## 🔧 Development Tools

- **Prisma Studio**: Visual database editor

  ```bash
  cd backend
  npm run prisma:studio
  ```

- **Angular DevTools**: Browser extension for Angular debugging

- **VS Code Extensions**:
  - Angular Language Service
  - Prisma
  - ESLint
  - Prettier

## 📝 Contributing

### Coding Standards

- Follow Angular style guide
- Use TypeScript strict mode
- Write unit tests for new features
- Document complex logic
- Use semantic commit messages

### Adding New Features

1. Create feature branch
2. Implement changes
3. Write/update tests
4. Update documentation
5. Submit pull request

## 🆘 Common Issues

### Backend won't start

- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Run `npm run prisma:generate`

### Authentication fails

- Check backend is running on port 3001
- Verify JWT_SECRET is set in `.env`
- Use correct test credentials

### Database errors

- Run `npx prisma migrate reset`
- Re-seed database with `npm run seed`

## 📞 Getting Help

- Check documentation in this folder
- Review code comments
- Search existing issues
- Create new issue with details

## 📋 Roadmap

Future enhancements:

- [ ] Document upload and management
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile application
- [ ] Multi-language support

## 📄 License

ISC

---

Last Updated: February 2026
