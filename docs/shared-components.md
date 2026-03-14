# Shared Components

This document provides documentation for all reusable components in the `src/app/shared/components/` directory.

## Table of Contents

- [Badge](#badge)
- [Button](#button)
- [Card](#card)
- [Child Nav Layout](#child-nav-layout)
- [Form Input](#form-input)
- [Loading Stencil](#loading-stencil)
- [Modal](#modal)
- [Pagination](#pagination)
- [Table](#table)

---

## Badge

A simple badge component for displaying status labels or tags.

**Selector:** `app-badge`

### Inputs

| Property | Type     | Default | Description                      |
| -------- | -------- | ------- | -------------------------------- |
| `title`  | `string` | `''`    | The text to display in the badge |

### Usage

```html
<app-badge title="Active"></app-badge> <app-badge title="Pending"></app-badge>
```

---

## Button

A customizable button component with multiple variants and built-in throttling to prevent double-clicks.

**Selector:** `app-button`

### Inputs

| Property     | Type                              | Default        | Description                      |
| ------------ | --------------------------------- | -------------- | -------------------------------- |
| `buttonText` | `string`                          | `'New Button'` | The text displayed on the button |
| `type`       | `'button' \| 'submit' \| 'reset'` | `'button'`     | HTML button type                 |
| `variant`    | `ButtonVariant`                   | `'primary'`    | Visual style variant             |

### Outputs

| Event     | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `clicked` | `void` | Emitted when button is clicked (throttled to 2s) |

### Button Variants

- `primary` - Primary action button
- `secondary` - Secondary action button
- `success` - Success/confirmation action
- `danger` - Destructive/delete action
- `warning` - Warning action
- `info` - Informational action
- `ghost` - Minimal styling
- `link` - Link-styled button

### Usage

```html
<app-button buttonText="Save" variant="primary" type="submit" (clicked)="handleSave()">
</app-button>

<app-button buttonText="Delete" variant="danger" (clicked)="handleDelete()"> </app-button>
```

### Features

- **Throttling**: Automatically throttles clicks to prevent double-submissions (2 second window)
- **Type Safety**: Full TypeScript support for variants and types

---

## Card

A container component that provides consistent card styling with content projection.

**Selector:** `app-card`

### Inputs

None - uses content projection

### Usage

```html
<app-card>
  <h2>Card Title</h2>
  <p>Card content goes here...</p>
</app-card>
```

### Features

- Provides consistent padding and styling
- Supports any HTML content via `<ng-content>`

---

## Child Nav Layout

A layout component for parent routes with child navigation. Displays a navigation menu and conditionally shows welcome content or the active child route.

**Selector:** `app-child-nav-layout`

### Inputs

| Property             | Type        | Default | Description                            |
| -------------------- | ----------- | ------- | -------------------------------------- |
| `navItems`           | `NavItem[]` | `[]`    | Array of navigation items              |
| `welcomeTitle`       | `string`    | `''`    | Title displayed on the welcome screen  |
| `welcomeDescription` | `string`    | `''`    | Description text on the welcome screen |

### NavItem Interface

```typescript
interface NavItem {
  label: string; // Display text for the nav link
  route: string; // Child route path
  description?: string; // Optional description shown on welcome screen
}
```

### Usage

```typescript
// Component
export class AdminConsole {
  navItems: NavItem[] = [
    {
      label: 'Audit',
      route: 'audit_log',
      description: 'View system audit logs and activity history',
    },
    {
      label: 'User Management',
      route: 'user_management',
      description: 'Manage user accounts and permissions',
    },
  ];
}
```

```html
<!-- Template -->
<app-child-nav-layout
  [navItems]="navItems"
  welcomeTitle="Admin Console"
  welcomeDescription="Welcome to the admin console. Select an option from the menu to get started:"
>
</app-child-nav-layout>
```

### Features

- **Automatic Route Detection**: Shows welcome screen when at parent route, hides when child route is active
- **Responsive Navigation**: Mobile-friendly navigation menu
- **Description Support**: Optional descriptions displayed on welcome screen
- **Router Integration**: Built-in `<router-outlet>` for child routes

### Use Cases

Perfect for admin panels, dashboards, or any parent route that needs:

- A navigation menu for child routes
- A landing/welcome screen when no child is selected
- Consistent layout across similar sections

---

## Form Input

A form control component that implements `ControlValueAccessor` for seamless Angular Forms integration.

**Selector:** `app-form-input`

### Inputs

| Property       | Type      | Default  | Description                   |
| -------------- | --------- | -------- | ----------------------------- |
| `label`        | `string`  | `''`     | Label text for the input      |
| `type`         | `string`  | `'text'` | HTML input type               |
| `placeholder`  | `string`  | `''`     | Placeholder text              |
| `required`     | `boolean` | `false`  | Whether the field is required |
| `errorMessage` | `string`  | `''`     | Error message to display      |
| `disabled`     | `boolean` | `false`  | Whether the input is disabled |

### Usage

**Reactive Forms:**

```typescript
// Component
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

```html
<!-- Template -->
<form [formGroup]="form">
  <app-form-input
    label="Email Address"
    type="email"
    placeholder="Enter your email"
    formControlName="email"
    [required]="true"
    errorMessage="Please enter a valid email"
  >
  </app-form-input>
</form>
```

**Template-Driven Forms:**

```html
<app-form-input
  label="Username"
  type="text"
  [(ngModel)]="username"
  placeholder="Enter username"
  [required]="true"
>
</app-form-input>
```

### Features

- **Forms Integration**: Implements `ControlValueAccessor` for full Angular Forms support
- **Automatic ID Generation**: Each input gets a unique ID for accessibility
- **Error Display**: Built-in error message display
- **Accessibility**: Proper label/input association

---

## Loading Stencil

A skeleton loading component that displays placeholder content while data is loading.

**Selector:** `app-loading-stencil`

### Inputs

| Property | Type          | Default  | Description                         |
| -------- | ------------- | -------- | ----------------------------------- |
| `type`   | `StencilType` | `'card'` | Type of loading skeleton to display |
| `count`  | `number`      | `1`      | Number of skeleton items to show    |
| `rows`   | `number`      | `3`      | Number of rows (for table type)     |

### Stencil Types

- `card` - Card-style skeleton
- `table` - Table-style skeleton
- `form` - Form-style skeleton
- `list` - List-style skeleton

### Usage

```html
<!-- Single card skeleton -->
<app-loading-stencil type="card"></app-loading-stencil>

<!-- Multiple card skeletons -->
<app-loading-stencil type="card" [count]="3"></app-loading-stencil>

<!-- Table skeleton with custom row count -->
<app-loading-stencil type="table" [rows]="5"></app-loading-stencil>

<!-- Conditional loading -->
@if (loading()) {
<app-loading-stencil type="list" [count]="5"></app-loading-stencil>
} @else {
<!-- Actual content -->
}
```

### Features

- **Multiple Layouts**: Different skeleton types for different content
- **Customizable Count**: Show multiple skeletons for lists
- **Smooth Animation**: CSS-based loading animation

---

## Modal

A modal dialog component with backdrop and keyboard trap for accessibility.

**Selector:** `app-modal`

### Inputs

| Property | Type     | Default | Description            |
| -------- | -------- | ------- | ---------------------- |
| `name`   | `string` | `''`    | Modal identifier/title |

### Outputs

| Event      | Type   | Description                     |
| ---------- | ------ | ------------------------------- |
| `closeBtn` | `void` | Emitted when close is requested |

### Usage

```typescript
// Component
showModal = signal(false);

openModal() {
  this.showModal.set(true);
}

closeModal() {
  this.showModal.set(false);
}
```

```html
<!-- Template -->
<app-button buttonText="Open Modal" (clicked)="openModal()"></app-button>

@if (showModal()) {
<app-modal name="Confirmation" (closeBtn)="closeModal()">
  <h2>Are you sure?</h2>
  <p>This action cannot be undone.</p>
  <app-button buttonText="Confirm" variant="danger" (clicked)="handleConfirm()"></app-button>
  <app-button buttonText="Cancel" variant="secondary" (clicked)="closeModal()"></app-button>
</app-modal>
}
```

### Features

- **Keyboard Trap**: Prevents focus from leaving the modal (accessibility)
- **Backdrop Click**: Can be configured to close on backdrop click
- **Content Projection**: Fully customizable modal content
- **Focus Management**: Uses `KeyTrap` directive for accessibility

---

## Pagination

A pagination component for navigating through large datasets.

**Selector:** `app-pagination`

### Inputs

| Property       | Type     | Default | Description                          |
| -------------- | -------- | ------- | ------------------------------------ |
| `totalItems`   | `number` | `0`     | Total number of items in the dataset |
| `itemsPerPage` | `number` | `10`    | Number of items per page             |
| `currentPage`  | `number` | `1`     | Current active page                  |

### Outputs

| Event        | Type     | Description               |
| ------------ | -------- | ------------------------- |
| `pageChange` | `number` | Emitted when page changes |

### Usage

```typescript
// Component
currentPage = 1;
itemsPerPage = 10;
totalItems = 150;

onPageChange(page: number) {
  this.currentPage = page;
  this.loadData();
}
```

```html
<!-- Template -->
<app-pagination
  [totalItems]="totalItems"
  [itemsPerPage]="itemsPerPage"
  [currentPage]="currentPage"
  (pageChange)="onPageChange($event)"
>
</app-pagination>
```

### Features

- **Auto-calculation**: Automatically calculates total pages
- **Boundary Checking**: Prevents navigation outside valid page range
- **Page Array**: Generates array of page numbers for display

---

## Table

A generic table component with type-safe data handling and configurable columns.

**Selector:** `app-table`

### Inputs

| Property  | Type            | Default | Description                      |
| --------- | --------------- | ------- | -------------------------------- |
| `data`    | `T[]`           | `[]`    | Array of data objects to display |
| `columns` | `TableColumn[]` | `[]`    | Column configuration (optional)  |

### TableColumn Interface

```typescript
interface TableColumn {
  key: string; // Property key in the data object
  label: string; // Display label for the column header
}
```

### Usage

**With Column Configuration:**

```typescript
// Component
interface Loan {
  appId: string;
  applicant: string;
  amount: number;
  status: string;
}

columns: TableColumn[] = [
  { key: 'appId', label: 'App ID' },
  { key: 'applicant', label: 'Applicant' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
];

loanQueue = signal<Loan[]>([
  { appId: 'L001', applicant: 'John Doe', amount: 50000, status: 'Pending' },
  { appId: 'L002', applicant: 'Jane Smith', amount: 75000, status: 'Approved' }
]);
```

```html
<!-- Template -->
<app-table [data]="loanQueue()" [columns]="columns"> </app-table>
```

**Without Column Configuration (Auto-detect):**

```html
<!-- Automatically uses all object keys as columns -->
<app-table [data]="myData"></app-table>
```

### Features

- **Type Safety**: Generic type parameter for full TypeScript support
- **Auto-detection**: Automatically generates columns from data if not provided
- **Responsive**: Mobile-friendly table styling with data labels
- **Type-safe Value Access**: Uses `keyof T` for compile-time safety

### Type Safety

The table component uses TypeScript generics for type safety:

```typescript
getValue(row: T, key: string): T[keyof T] {
  return row[key as keyof T];
}
```

This ensures:

- Return type is the union of all property value types in `T`
- No runtime errors from accessing invalid properties
- Better IntelliSense support

---

## Best Practices

### Component Selection

- **Badge**: Use for status indicators, tags, or count displays
- **Button**: Use for all clickable actions (prefer over native buttons)
- **Card**: Use for content grouping and visual hierarchy
- **Child Nav Layout**: Use for parent routes with multiple child sections
- **Form Input**: Use for all form fields to maintain consistency
- **Loading Stencil**: Show while data is loading to improve perceived performance
- **Modal**: Use for confirmations, forms, or focused content
- **Pagination**: Use for lists/tables with 20+ items
- **Table**: Use for tabular data display with custom column configuration

### Importing Components

All components are standalone and can be imported directly:

```typescript
import { Table } from './shared/components/table/table';
import { Button } from './shared/components/button/button';

@Component({
  imports: [Table, Button],
  // ...
})
```

### Type Safety

When using components with TypeScript:

- Use interfaces for table data
- Define types for button variants
- Leverage type parameters (e.g., `Table<MyDataType>`)

### Accessibility

Components follow accessibility best practices:

- Proper ARIA labels
- Keyboard navigation support (Modal, Button)
- Semantic HTML
- Focus management

---

## Testing Shared Components

When testing components that use shared components:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router'; // If using routing components

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [YourComponent],
    providers: [
      provideRouter([]), // For components using Child Nav Layout
    ],
  }).compileComponents();
});
```

---

## Contributing

When creating new shared components:

1. **Location**: Place in `src/app/shared/components/[component-name]/`
2. **Files**: Create `.ts`, `.html`, and `.scss` files
3. **Standalone**: Make components standalone with proper imports
4. **Documentation**: Update this file with component details
5. **Type Safety**: Use TypeScript types/interfaces
6. **Accessibility**: Follow WCAG guidelines
7. **Testing**: Create `.spec.ts` file with unit tests

### Component Checklist

- [ ] Component is standalone
- [ ] Proper TypeScript types for all inputs/outputs
- [ ] Accessibility features (ARIA, keyboard support)
- [ ] Responsive design (mobile-friendly)
- [ ] Unit tests created
- [ ] Documentation added to this file
- [ ] Example usage provided
