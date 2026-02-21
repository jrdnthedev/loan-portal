# Authentication System

This module provides a complete authentication system for the Angular loan portal application.

## Features

- 🔐 JWT-based authentication
- 🔄 Automatic token refresh
- 🛡️ Route guards (Auth, Role, Guest)
- 📡 HTTP interceptor for adding auth headers
- 🎯 Signal-based state management (Angular 20+)
- 💾 Secure token storage
- 🔀 Role-based access control

## Setup

### 1. Update app.config.ts

Add the authentication providers to your application configuration:

```typescript
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { provideAuth } from './core/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAuth(), // Add this line
  ],
};
```

### 2. Configure Backend API

The authentication system is configured to use the backend API URL from environment settings.

**Environment Configuration:**

`src/environments/environment.ts` (Development):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
};
```

`src/environments/environment.prod.ts` (Production):

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
};
```

The `AuthService` automatically uses `environment.apiUrl` for all API calls. No additional configuration needed.

## Usage

### Using the Auth Service

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './core/auth';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="email" type="email" placeholder="Email" required />
      <input [(ngModel)]="password" type="password" placeholder="Password" required />
      <button type="submit" [disabled]="authService.isLoading()">
        {{ authService.isLoading() ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);

  email = '';
  password = '';

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Logged in successfully', response);
        // Navigation will be handled automatically by the service
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }

  // Access reactive state
  get user() {
    return this.authService.user();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
```

### Using Route Guards

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard, GuestGuard } from './core/auth';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard], // Only accessible when not authenticated
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Requires authentication
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'super-admin'] }, // Requires specific roles
  },
  {
    path: 'loan-officer',
    component: LoanOfficerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['loan-officer', 'admin'] },
  },
];
```

### Using Auth State in Components

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './core/auth';

@Component({
  selector: 'app-header',
  template: `
    <nav>
      @if (authService.isAuthenticated()) {
        <div>Welcome, {{ authService.user()?.firstName }}!</div>
        <button (click)="logout()">Logout</button>
      } @else {
        <a routerLink="/login">Login</a>
      }
    </nav>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
```

### Role-based UI Rendering

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './core/auth';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <h1>Dashboard</h1>

      @if (authService.hasRole('admin')) {
        <button routerLink="/admin">Admin Panel</button>
      }

      @if (authService.hasAnyRole(['loan-officer', 'admin'])) {
        <button routerLink="/loans">Manage Loans</button>
      }
    </div>
  `,
})
export class DashboardComponent {
  authService = inject(AuthService);
}
```

## Backend API Integration

The authentication system integrates with the Node.js backend API. See [Backend API Documentation](./backend-api.md) for complete details.

### POST /auth/login

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

### POST /auth/register

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

**Response:**

```json
{
  "user": {
    "id": "user-002",
    "email": "new.user@example.com",
    "role": "customer",
    "firstName": "New",
    "lastName": "User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

## JWT Token Structure

The backend returns JWT tokens with the following structure:

**Token Payload:**

```json
{
  "userId": "user-001",
  "email": "john.doe@example.com",
  "role": "customer",
  "iat": 1708564800,
  "exp": 1708651200
}
```

**Token Usage:**

All authenticated API requests must include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The HTTP interceptor automatically adds this header to all outgoing requests.

## Test Credentials

After running the backend seed script, use these credentials:

**Customer Account:**

- Email: `john.doe@example.com`
- Password: `password123`

**Loan Officer Account:**

- Email: `loan.officer@bank.com`
- Password: `admin123`

## Security Features

- **JWT-based authentication**: Secure token-based authentication with the backend
- **Secure storage**: Tokens are stored in localStorage (consider upgrading to httpOnly cookies for production)
- **Route protection**: Guards prevent unauthorized access to protected routes
- **Role-based access**: Fine-grained access control based on user roles
- **HTTP interceptor**: Automatically adds authentication headers to API requests
- **Automatic logout**: Users are logged out when tokens expire or become invalid

## Best Practices

1. **Environment Variables**: API URLs are configured in environment files (`environment.ts`)
2. **Error Handling**: Implement proper error handling for auth failures
3. **Loading States**: Use the loading signals to show appropriate UI states
4. **Token Security**: Consider using httpOnly cookies for token storage in production
5. **Role Management**: Define clear role hierarchies and permissions
6. **Testing**: Write unit tests for auth services and guards

## Related Documentation

- [Backend API](./backend-api.md) - Complete backend API documentation
- [Backend Migration](./backend-migration.md) - Migrating from json-server to backend
- [Docker Setup](./backend-docker-setup.md) - Running backend with Docker
