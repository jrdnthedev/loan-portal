# Backend Testing Guide

## Running Tests

```powershell
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

## Test Structure

```
src/__tests__/
├── setup.ts                           # Global test configuration
├── helpers/
│   ├── prisma-mock.ts                 # Prisma client mock
│   └── mock-data.ts                   # Test data factories
├── unit/
│   ├── controllers/
│   │   ├── auth.controller.spec.ts    # Auth controller tests
│   │   └── loan.controller.spec.ts    # Loan controller tests
│   └── middleware/
│       ├── auth.middleware.spec.ts    # Auth middleware tests
│       └── error.middleware.spec.ts   # Error middleware tests
└── integration/
    └── routes/
        ├── auth.routes.spec.ts        # Auth routes integration tests
        └── loan.routes.spec.ts        # Loan routes integration tests
```

## Test Coverage

### Auth Controller

- ✓ Login validation (missing fields, invalid credentials)
- ✓ Successful login with JWT generation
- ✓ Registration with all validations
- ✓ Password hashing
- ✓ Error handling

### Loan Controller

- ✓ Get all loans with pagination and filtering
- ✓ Get loan by ID
- ✓ Create loan with applicant and co-signer
- ✓ Update loan status
- ✓ Delete loan
- ✓ Error handling

### Auth Middleware

- ✓ Token validation
- ✓ Role-based authorization
- ✓ Error cases (missing/invalid tokens)

### Error Middleware

- ✓ Error response formatting
- ✓ Stack trace in development mode
- ✓ Production mode security

## Note on TypeScript Errors

The test files may show TypeScript errors related to Prisma mocking. These are type-checking issues
that don't affect test execution. Vitest runs the tests at runtime where the mocks work correctly.

To suppress these in your IDE, you can:

1. Configure your IDE to ignore test files for TypeScript errors
2. Or run tests which will execute successfully despite the type warnings
