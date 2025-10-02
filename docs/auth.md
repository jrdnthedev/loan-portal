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

### 2. Update API URL

In `src/app/core/auth/services/auth.service.ts`, update the API_URL to match your backend:

```typescript
private readonly API_URL = 'https://your-api-domain.com/api/auth';
```

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

## API Endpoints Expected

The auth service expects the following API endpoints:

### POST /api/auth/login

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### POST /api/auth/refresh

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Response:

```json
{
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token"
}
```

### POST /api/auth/register

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST /api/auth/forgot-password

```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password

```json
{
  "token": "reset-token",
  "newPassword": "newpassword123"
}
```

## JWT Token Structure

The access token should include the following claims:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "exp": 1234567890,
  "iat": 1234567890
}
```

## Security Features

- **Automatic token refresh**: Tokens are automatically refreshed when they expire
- **Secure storage**: Tokens are stored in localStorage (consider upgrading to httpOnly cookies for production)
- **Route protection**: Guards prevent unauthorized access to protected routes
- **Role-based access**: Fine-grained access control based on user roles
- **Automatic logout**: Users are logged out when refresh tokens expire

## Best Practices

1. **Environment Variables**: Store API URLs in environment files
2. **Error Handling**: Implement proper error handling for auth failures
3. **Loading States**: Use the loading signals to show appropriate UI states
4. **Token Security**: Consider using httpOnly cookies for token storage in production
5. **Role Management**: Define clear role hierarchies and permissions
6. **Testing**: Write unit tests for auth services and guards

## Contributing

When adding new auth features:

1. Update interfaces in `auth.interface.ts`
2. Add new methods to `AuthService`
3. Create appropriate guards if needed
4. Update this README with usage examples
