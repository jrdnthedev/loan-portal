# Accessibility Testing with axe-core

This guide explains how to use axe-core for automated accessibility testing in this Angular project.

## Installation

First, install the required dependencies:

```bash
npm install --save-dev axe-core vitest-axe
```

## Configuration

The project is already configured for accessibility testing:

1. **Test Setup** (`src/test-setup.ts`): Extends Vitest with axe matchers
2. **Component Tests**: Import `axe` from `vitest-axe` and use it in your tests

## Basic Usage

### Simple Accessibility Test

```typescript
import { axe } from 'vitest-axe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
  });

  it('should have no accessibility violations', async () => {
    fixture.detectChanges();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
```

### Testing Specific WCAG Standards

```typescript
it('should meet WCAG 2.1 Level AA standards', async () => {
  fixture.detectChanges();

  const results = await axe(fixture.nativeElement, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  });

  expect(results).toHaveNoViolations();
});
```

### Testing Specific Rules

```typescript
it('should have proper color contrast', async () => {
  fixture.detectChanges();

  const results = await axe(fixture.nativeElement, {
    runOnly: {
      type: 'rule',
      values: ['color-contrast'],
    },
  });

  expect(results).toHaveNoViolations();
});
```

### Disabling Specific Rules

Sometimes you may need to disable specific rules (use sparingly and document why):

```typescript
it('should pass accessibility checks (excluding specific rules)', async () => {
  fixture.detectChanges();

  const results = await axe(fixture.nativeElement, {
    rules: {
      'color-contrast': { enabled: false }, // Explain why this is disabled
    },
  });

  expect(results).toHaveNoViolations();
});
```

## Common Accessibility Rules

axe-core checks for many accessibility issues, including:

- **color-contrast**: Ensures sufficient color contrast ratios
- **label**: Form elements must have labels
- **button-name**: Buttons must have accessible names
- **image-alt**: Images must have alt text
- **heading-order**: Heading levels should be sequential
- **list**: Lists must be properly structured
- **table-fake-caption**: Data tables should have captions
- **aria-\*\*\***: Various ARIA attribute validations

## Best Practices

1. **Add to All Component Tests**: Every component with UI should have at least one basic accessibility test
2. **Test Different States**: Test accessibility across different component states (loading, error, empty, populated)
3. **Test Interactive Elements**: Pay special attention to forms, buttons, modals, and other interactive elements
4. **Test with Real Data**: Use realistic data in your tests to catch issues like missing labels or poor contrast
5. **Don't Rely Solely on Automated Tests**: axe-core catches many issues, but manual testing and screen reader testing are still important

## Example: Comprehensive Component Test

```typescript
describe('FormComponent Accessibility', () => {
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
  });

  it('should have no violations in empty state', async () => {
    fixture.detectChanges();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with validation errors', async () => {
    const component = fixture.componentInstance;
    // Trigger validation errors
    component.form.markAllAsTouched();
    fixture.detectChanges();

    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations when disabled', async () => {
    const component = fixture.componentInstance;
    component.form.disable();
    fixture.detectChanges();

    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
```

## Running Tests

Run all tests including accessibility checks:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## Resources

- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [vitest-axe Documentation](https://github.com/chaance/vitest-axe)
- [Angular Accessibility Guide](https://angular.io/guide/accessibility)

## See Also

- [table.spec.ts](../src/app/shared/components/table/table.spec.ts) - Example of accessibility testing in practice
