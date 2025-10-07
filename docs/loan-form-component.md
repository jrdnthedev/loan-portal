# Reusable Loan Form Component

The `LoanForm` component is a comprehensive, reusable form that dynamically adapts based on the loan type. It supports three types of loans: Personal, Mortgage, and Auto loans.

## Features

- **Dynamic Form Fields**: Form fields change based on the selected loan type
- **Comprehensive Validation**: Built-in validation for all field types
- **Type-Safe**: Uses TypeScript interfaces for type safety
- **Responsive Design**: Mobile-friendly responsive layout
- **Reusable**: Can be used anywhere in the application
- **Event-Driven**: Emits events for form submission and draft saving

## Usage

### Basic Usage

```typescript
import { LoanForm } from './components/loan-form/loan-form';
import { LoanType } from './models/loan-type';

@Component({
  selector: 'app-example',
  imports: [LoanForm],
  template: `
    <app-loan-form
      [loanType]="LoanType.Personal"
      (formSubmitted)="onSubmit($event)"
      (formSaved)="onSave($event)"
    >
    </app-loan-form>
  `,
})
export class ExampleComponent {
  LoanType = LoanType;

  onSubmit(loan: Loan) {
    // Handle form submission
    console.log('Submitted:', loan);
  }

  onSave(draft: Partial<Loan>) {
    // Handle draft saving
    console.log('Draft saved:', draft);
  }
}
```

### With Initial Data

```typescript
<app-loan-form
  [loanType]="LoanType.Mortgage"
  [initialData]="existingLoanData"
  (formSubmitted)="onSubmit($event)"
  (formSaved)="onSave($event)">
</app-loan-form>
```

## Input Properties

| Property      | Type            | Required | Description                                 |
| ------------- | --------------- | -------- | ------------------------------------------- |
| `loanType`    | `LoanType`      | Yes      | The type of loan (Personal, Mortgage, Auto) |
| `initialData` | `Partial<Loan>` | No       | Pre-populate form with existing data        |

## Output Events

| Event           | Type            | Description                                 |
| --------------- | --------------- | ------------------------------------------- |
| `formSubmitted` | `Loan`          | Emitted when form is successfully submitted |
| `formSaved`     | `Partial<Loan>` | Emitted when draft is saved                 |

## Loan Type Configurations

### Personal Loan

- **Amount Range**: $1,000 - $50,000
- **Term Range**: 1 - 84 months
- **Additional Fields**: Purpose
- **Fields**: Amount, Term, Applicant Info, Purpose

### Mortgage Loan

- **Amount Range**: $50,000 - $1,000,000
- **Term Range**: 1 - 360 months
- **Additional Fields**: Property Address, Co-signer, Down Payment
- **Fields**: Amount, Term, Applicant Info, Co-signer, Property Address, Down Payment

### Auto Loan

- **Amount Range**: $5,000 - $100,000
- **Term Range**: 1 - 84 months
- **Additional Fields**: Vehicle Information, Down Payment
- **Fields**: Amount, Term, Applicant Info, Vehicle Info, Down Payment

## Form Validation

The form includes comprehensive validation:

- **Required Fields**: All mandatory fields are validated
- **Amount Limits**: Min/max validation based on loan type
- **Format Validation**: SSN format, VIN format, ZIP code format
- **Range Validation**: Credit scores (300-850), years, etc.
- **Real-time Feedback**: Visual feedback with error messages

## Styling

The component uses modern CSS with:

- Responsive grid layout
- Clean, professional styling
- Error state indicators
- Focus states for accessibility
- Mobile-optimized design

## Models and Interfaces

The component uses the following TypeScript interfaces:

- `Loan`: Main loan interface
- `Applicant`: Applicant information
- `LoanAmount`: Loan amount details
- `PropertyAddress`: Property information (Mortgage)
- `VehicleInfo`: Vehicle information (Auto)
- `LoanTypeConfiguration`: Configuration for each loan type

## Example Implementation

See `LoanFormDemo` component for a complete example that demonstrates:

- Loan type selection
- Form submission handling
- Draft saving
- Success/error feedback
- Responsive design

## Customization

To customize the form:

1. **Add New Loan Types**: Extend the `LoanType` enum and add configuration
2. **Modify Validation**: Update validators in the component
3. **Add Fields**: Extend the configuration object and add form controls
4. **Style Changes**: Modify the SCSS file for custom styling

## Dependencies

- Angular Reactive Forms
- Angular Common Module
- Custom Button component
- Loan domain models
