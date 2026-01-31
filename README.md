# Loan Portal 🏦

A modern, secure loan application management system built with Angular 20. This application provides a comprehensive platform for managing loan applications, applicants, and loan officers with role-based access control and authentication.

## ✨ Features

- 🔐 **JWT-based Authentication** - Secure user authentication with automatic token refresh
- 🛡️ **Role-based Access Control** - Different access levels for admins, loan officers, and applicants
- 📋 **Loan Application Management** - Complete workflow for loan applications
- 👥 **User Management** - Handle multiple user types and roles
- 🎯 **Signal-based State Management** - Modern Angular reactive patterns
- 📱 **Responsive Design** - Works seamlessly across devices
- 🔒 **Security First** - Protected routes and secure API communication
- ⚡ **Server-Side Rendering** - Enhanced performance with Angular SSR

## 🏗️ Architecture

The application follows a domain-driven design with the following structure:

```
src/app/
├── core/                 # Core functionality and services
│   └── auth/            # Authentication system
├── domains/             # Business domain modules
│   └── loan-application/ # Loan management domain
├── layout/              # Layout components
└── shared/              # Shared components and utilities
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 20.x

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd loan-portal
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200/`

## 🛠️ Development

### Development Server

To start a local development server:

```bash
ng serve
```

The application will automatically reload when you modify source files.

### Code Generation

Generate new components using Angular CLI:

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

For a complete list of available schematics:

```bash
ng generate --help
```

### Building

Build the project for production:

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory with production optimizations.

### Server-Side Rendering

Build and serve with SSR:

```bash
ng build
npm run serve:ssr:loan-portal
```

## 🧪 Testing

### Unit Tests

Run unit tests with Karma:

```bash
ng test
```

### End-to-End Tests

E2E testing framework can be configured based on your needs:

```bash
ng e2e
```

## 🔐 Authentication System

The application includes a comprehensive authentication system with:

- JWT token management
- Automatic token refresh
- Route guards (Auth, Role, Guest)
- HTTP interceptors
- Signal-based reactive state

For detailed authentication documentation, see [docs/auth.md](docs/auth.md).

## 👥 User Roles

- **Admin**: Full system access and user management
- **Loan Officer**: Loan application review and management
- **Applicant**: Submit and track loan applications

## 🏦 Loan Management

The loan domain includes:

- **Loan Types**: Personal, Mortgage, Auto loans
- **Application Status**: Draft, Submitted, Approved, Rejected
- **Applicant Management**: Personal and employment information
- **Co-signer Support**: Additional applicant support

### Loan Models

```typescript
interface Loan {
  id: string;
  type: LoanType;
  amount: LoanAmount;
  termMonths: number;
  applicant: Applicant;
  coSigner?: Applicant;
  status: LoanStatus;
  submittedAt?: string;
}
```

## � Shared Components

### Button Component

The application includes a reusable button component with a comprehensive variant system for different action types. Located at `src/app/shared/components/button/`.

#### Usage

```typescript
import { Button } from './shared/components/button/button';

@Component({
  selector: 'app-example',
  imports: [Button],
  template: `
    <app-button
      variant="primary"
      buttonText="Submit Application"
      type="submit"
      (clicked)="onSubmit()"
    />

    <app-button variant="danger" buttonText="Delete" (clicked)="onDelete()" />

    <app-button variant="ghost" buttonText="Cancel" (clicked)="onCancel()" />
  `,
})
export class ExampleComponent {
  onSubmit(): void {
    // Handle form submission
  }

  onDelete(): void {
    // Handle delete action
  }

  onCancel(): void {
    // Handle cancel action
  }
}
```

#### Button Variants

The button component supports 8 different variants, each with distinct visual styling to convey specific action types:

| Variant     | Color           | Use Case                | Example Actions           |
| ----------- | --------------- | ----------------------- | ------------------------- |
| `primary`   | Blue            | Main actions            | Submit, Create, Confirm   |
| `secondary` | Slate Gray      | Less emphasized actions | Cancel, Back, Close       |
| `success`   | Green           | Positive actions        | Save, Approve, Accept     |
| `danger`    | Red             | Destructive actions     | Delete, Remove, Reject    |
| `warning`   | Orange          | Cautionary actions      | Reset, Archive, Discard   |
| `info`      | Cyan            | Informational actions   | Learn More, Help, Details |
| `ghost`     | Transparent     | Minimal style           | Close, Dismiss, Skip      |
| `link`      | Text Link Style | Navigation              | View Details, Go to Page  |

#### Component Inputs

- `buttonText: string` - The text displayed on the button (default: 'New Button')
- `type: 'button' | 'submit' | 'reset'` - HTML button type (default: 'button')
- `variant: ButtonVariant` - Visual variant (default: 'primary')

#### Component Outputs

- `clicked: EventEmitter<void>` - Emits when button is clicked (throttled to prevent double-clicks)

#### Button Type

The `ButtonVariant` type is exported and can be used throughout your application:

```typescript
import { ButtonVariant } from './shared/components/button/button';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'ghost'
  | 'link';
```

#### Features

- **Throttled Clicks**: Built-in 2-second throttle to prevent accidental double-submissions
- **Hover Effects**: Smooth elevation changes on hover for better user feedback
- **Disabled State**: Automatic styling for disabled buttons
- **Accessibility**: Proper semantic HTML button element with type attribute

### Pagination Component

The application includes a reusable pagination component located at `src/app/shared/components/pagination/`. This component provides paginated data display with navigation controls.

#### Usage

```typescript
import { Pagination } from './shared/components/pagination/pagination';

@Component({
  selector: 'app-example',
  imports: [Pagination],
  template: `
    <app-pagination
      [totalItems]="totalItems"
      [itemsPerPage]="itemsPerPage"
      [currentPage]="currentPage"
      (pageChange)="onPageChange($event)"
    >
      <!-- Optional content can be projected here -->
    </app-pagination>
  `,
})
export class ExampleComponent {
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 100;

  onPageChange(page: number): void {
    this.currentPage = page;
    // Implement your data loading logic here
    // e.g., this.loadData(page);
  }
}
```

#### Required Functions in Parent Component

When implementing pagination, your parent component must include:

1. **Page Change Handler**: A function to handle page changes

   ```typescript
   onPageChange(page: number): void {
     this.currentPage = page;
     // Load new data based on the page
     this.loadData(page);
   }
   ```

2. **Data Pagination Logic**: Methods to slice or request paginated data

   ```typescript
   get paginatedData() {
     const start = (this.currentPage - 1) * this.itemsPerPage;
     const end = start + this.itemsPerPage;
     return this.allData.slice(start, end);
   }
   ```

3. **Total Items Calculation**: A getter or property for total item count
   ```typescript
   get totalItems(): number {
     return this.allData.length;
   }
   ```

#### Component Inputs

- `totalItems: number` - Total number of items to paginate (required)
- `itemsPerPage: number` - Number of items per page (default: 10)
- `currentPage: number` - Current active page (default: 1)

#### Component Outputs

- `pageChange: EventEmitter<number>` - Emits the new page number when pagination changes

## �🔧 Configuration

### Environment Setup

Update environment files for different deployment targets:

- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

### Authentication Configuration

Update the API URL in the auth service:

```typescript
// src/app/core/auth/services/auth.service.ts
private readonly API_URL = 'https://your-api-domain.com/api/auth';
```

## 📝 Code Quality

The project includes:

- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit code formatting
- **Commitlint** - Conventional commit messages

### Formatting

Code is automatically formatted on commit. To manually format:

```bash
npx prettier --write .
```

### Commit Message Structure

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. All commit messages are validated using commitlint.

#### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

#### Examples

```bash
# Feature commits
git commit -m "feat(auth): add JWT token refresh mechanism"
git commit -m "feat(loan): implement loan application form validation"

# Bug fix commits
git commit -m "fix(auth): resolve token expiration handling"
git commit -m "fix(ui): correct button alignment on mobile devices"

# Documentation commits
git commit -m "docs: update README with deployment instructions"
git commit -m "docs(auth): add authentication flow diagrams"

# Refactoring commits
git commit -m "refactor(services): extract common HTTP error handling"
git commit -m "refactor(components): simplify loan status display logic"
```

#### Scope Guidelines

Common scopes used in this project:

- **auth**: Authentication and authorization
- **loan**: Loan application domain
- **ui**: User interface components
- **api**: API integration
- **core**: Core functionality
- **shared**: Shared components and utilities
- **config**: Configuration changes
- **deps**: Dependency updates

#### Rules

- Use lowercase for type and scope
- Subject should be lowercase and not end with a period
- Subject should be 50 characters or less
- Use imperative mood ("add" not "added" or "adds")
- Body and footer are optional but recommended for complex changes

## 🚀 Deployment

### Production Build

```bash
ng build --configuration production
```

### Docker Support

Create a Dockerfile for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 4000
CMD ["npm", "run", "serve:ssr:loan-portal"]
```

## 📚 Documentation

- [Authentication System](docs/auth.md) - Detailed auth documentation
- [Angular CLI Reference](https://angular.dev/tools/cli) - Official CLI documentation
- [Angular Documentation](https://angular.dev) - Framework documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🛠️ Built With

- [Angular 20](https://angular.dev) - The web framework
- [Angular SSR](https://angular.dev/guide/ssr) - Server-side rendering
- [RxJS](https://rxjs.dev) - Reactive programming
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
