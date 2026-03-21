import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { axe } from 'vitest-axe';
import { FormInput } from './form-input';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [FormInput, FormsModule],
  template: `
    <app-form-input
      [label]="label"
      [type]="type"
      [placeholder]="placeholder"
      [required]="required"
      [errorMessage]="errorMessage"
      [disabled]="disabled"
      [(ngModel)]="value"
    >
    </app-form-input>
  `,
})
class TestHostComponent {
  label = 'Test Label';
  type = 'text';
  placeholder = 'Test placeholder';
  required = false;
  errorMessage = '';
  disabled = false;
  value = '';
}

@Component({
  selector: 'app-reactive-form-host',
  standalone: true,
  imports: [FormInput, ReactiveFormsModule],
  template: `<app-form-input [formControl]="formControl" label="Reactive Field"></app-form-input>`,
})
class ReactiveFormHostComponent {
  formControl = new FormControl('initial value');
}

describe('FormInput', () => {
  let component: FormInput;
  let fixture: ComponentFixture<FormInput>;
  let debugElement: DebugElement;

  describe('Component Creation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      // Don't call detectChanges here to avoid ExpressionChangedAfterItHasBeenCheckedError
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.label).toBe('');
      expect(component.type).toBe('text');
      expect(component.placeholder).toBe('');
      expect(component.required).toBe(false);
      expect(component.errorMessage).toBe('');
      expect(component.disabled).toBe(false);
      expect(component.value).toBe('');
    });

    it('should generate unique input ID', () => {
      const component1 = new FormInput();
      const component2 = new FormInput();

      expect(component1.inputId).toBeDefined();
      expect(component2.inputId).toBeDefined();
      expect(component1.inputId).not.toBe(component2.inputId);
      expect(component1.inputId).toMatch(/^input-[a-z0-9]{7}$/);
    });

    it('should render input element', () => {
      fixture.detectChanges();
      const inputElement = debugElement.query(By.css('input'));
      expect(inputElement).toBeTruthy();
      expect(inputElement.nativeElement.tagName.toLowerCase()).toBe('input');
    });

    it('should render form-input-group wrapper', () => {
      fixture.detectChanges();
      const wrapperElement = debugElement.query(By.css('.form-input-group'));
      expect(wrapperElement).toBeTruthy();
    });
  });

  describe('Input Properties - Label', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should display label when provided', () => {
      component.label = 'Test Label';
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.textContent.trim()).toContain('Test Label');
    });

    it('should not display label when not provided', () => {
      component.label = '';
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement).toBeFalsy();
    });

    it('should display label with required asterisk when required is true', () => {
      component.label = 'Required Field';
      component.required = true;
      fixture.detectChanges();

      const asterisk = debugElement.query(By.css('.required-asterisk'));
      expect(asterisk).toBeTruthy();
      expect(asterisk.nativeElement.textContent).toBe('*');
    });

    it('should not display required asterisk when required is false', () => {
      component.label = 'Optional Field';
      component.required = false;
      fixture.detectChanges();

      const asterisk = debugElement.query(By.css('.required-asterisk'));
      expect(asterisk).toBeFalsy();
    });

    it('should link label to input with correct ID', () => {
      component.label = 'Test Label';
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label')).nativeElement;
      const inputElement = debugElement.query(By.css('input')).nativeElement;

      expect(labelElement.getAttribute('for')).toBe(component.inputId);
      expect(inputElement.id).toBe(component.inputId);
    });
  });

  describe('Input Properties - Type and Attributes', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should set input type to text by default', () => {
      fixture.detectChanges();
      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('text');
    });

    it('should set input type to email', () => {
      component.type = 'email';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('email');
    });

    it('should set input type to password', () => {
      component.type = 'password';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('password');
    });

    it('should set input type to number', () => {
      component.type = 'number';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('number');
    });

    it('should set input type to tel', () => {
      component.type = 'tel';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('tel');
    });

    it('should set input placeholder', () => {
      component.placeholder = 'Enter your email';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.placeholder).toBe('Enter your email');
    });

    it('should render without placeholder when not provided', () => {
      component.placeholder = '';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.placeholder).toBe('');
    });
  });

  describe('Input Properties - Disabled State', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should disable input when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(true);
    });

    it('should enable input when disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(false);
    });
  });

  describe('Input Properties - Error Handling', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should display error message when provided', () => {
      component.errorMessage = 'This field is required';
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent.trim()).toBe('This field is required');
    });

    it('should not display error message when not provided', () => {
      component.errorMessage = '';
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeFalsy();
    });

    it('should add error class to input when error message exists', () => {
      component.errorMessage = 'Error';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.classList.contains('error')).toBe(true);
    });

    it('should not add error class when error message is empty', () => {
      component.errorMessage = '';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.classList.contains('error')).toBe(false);
    });

    it('should display multiple error messages', () => {
      component.errorMessage = 'Email is invalid and required';
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('.error-message'));
      expect(errorElement.nativeElement.textContent).toContain('Email is invalid');
      expect(errorElement.nativeElement.textContent).toContain('required');
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      // Don't call detectChanges here to avoid NG0100 in tests that set values
    });

    it('should implement writeValue', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null value in writeValue', () => {
      component.writeValue(null as any);
      expect(component.value).toBe('');
    });

    it('should handle undefined value in writeValue', () => {
      component.writeValue(undefined as any);
      expect(component.value).toBe('');
    });

    it('should register onChange callback', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onInput({ target: { value: 'test' } } as unknown as Event);

      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);

      component.onBlur();

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should set disabled state to true', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });

    it('should set disabled state to false', () => {
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });

    it('should reflect value changes in DOM', () => {
      component.value = 'test value';
      fixture.detectChanges();

      const inputElement = debugElement.query(By.css('input')).nativeElement;
      expect(inputElement.value).toBe('test value');
    });
  });

  describe('User Interactions', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should update value and call onChange on input event', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      const inputElement = debugElement.query(By.css('input')).nativeElement;
      inputElement.value = 'new value';
      inputElement.dispatchEvent(new Event('input'));

      expect(component.value).toBe('new value');
      expect(mockOnChange).toHaveBeenCalledWith('new value');
    });

    it('should call onTouched on blur event', () => {
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);

      const inputElement = debugElement.query(By.css('input')).nativeElement;
      inputElement.dispatchEvent(new Event('blur'));

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should handle onInput method correctly', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      const mockEvent = {
        target: { value: 'input value' },
      } as unknown as Event;

      component.onInput(mockEvent);

      expect(component.value).toBe('input value');
      expect(mockOnChange).toHaveBeenCalledWith('input value');
    });

    it('should handle onBlur method correctly', () => {
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);

      component.onBlur();

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should handle empty input value', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      const mockEvent = {
        target: { value: '' },
      } as unknown as Event;

      component.onInput(mockEvent);

      expect(component.value).toBe('');
      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('should handle special characters in input', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      const mockEvent = {
        target: { value: 'test@example.com' },
      } as unknown as Event;

      component.onInput(mockEvent);

      expect(component.value).toBe('test@example.com');
      expect(mockOnChange).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should handle very long label text', () => {
      component.label =
        'This is a very long label that should still render properly without breaking the layout';
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.textContent).toContain('very long label');
    });

    it('should handle very long error messages', () => {
      component.errorMessage =
        'This is a very long error message that provides detailed information about what went wrong with this field';
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('.error-message'));
      expect(errorElement.nativeElement.textContent.length).toBeGreaterThan(50);
    });

    it('should handle special characters in label', () => {
      component.label = 'Email & Phone #';
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.textContent).toContain('Email & Phone #');
    });

    it('should handle emoji in values', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      const mockEvent = {
        target: { value: '✓ Completed' },
      } as unknown as Event;

      component.onInput(mockEvent);

      expect(component.value).toBe('✓ Completed');
    });

    it('should maintain state when toggling disabled', () => {
      component.value = 'persistent value';
      component.disabled = true;
      fixture.detectChanges();

      expect(component.value).toBe('persistent value');
    });
  });

  describe('Template-Driven Forms Integration', () => {
    it('should work with ngModel', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.componentInstance.value = 'initial';
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      hostFixture.detectChanges(); // Apply async changes to DOM

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.value).toBe('initial');
    });

    it('should update ngModel on input change', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      input.value = 'updated value';
      input.dispatchEvent(new Event('input'));

      await hostFixture.whenStable();
      expect(hostFixture.componentInstance.value).toBe('updated value');
    });

    it('should display label from host component', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.componentInstance.label = 'Custom Label';
      hostFixture.detectChanges();

      const label = hostFixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.textContent).toContain('Custom Label');
    });

    it('should apply disabled state from host component', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      hostFixture.componentInstance.disabled = true;
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(true);
    });
  });

  describe('Reactive Forms Integration', () => {
    it('should work with FormControl', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.value).toBe('initial value');
    });

    it('should update FormControl value on input change', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      input.value = 'new value';
      input.dispatchEvent(new Event('input'));

      expect(hostFixture.componentInstance.formControl.value).toBe('new value');
    });

    it('should reflect FormControl value changes', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.componentInstance.formControl.setValue('programmatic value');
      hostFixture.detectChanges();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.value).toBe('programmatic value');
    });

    it('should disable input when FormControl is disabled', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();

      hostFixture.componentInstance.formControl.disable();
      hostFixture.detectChanges();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(true);
    });

    it('should enable input when FormControl is enabled', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();

      hostFixture.componentInstance.formControl.disable();
      hostFixture.detectChanges();

      hostFixture.componentInstance.formControl.enable();
      hostFixture.detectChanges();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(false);
    });
  });

  describe('Use Cases', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should work as an email input field', () => {
      component.label = 'Email Address';
      component.type = 'email';
      component.placeholder = 'Enter your email';
      component.required = true;
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      const label = debugElement.query(By.css('label')).nativeElement;

      expect(input.type).toBe('email');
      expect(label.textContent).toContain('Email Address');
      expect(input.placeholder).toBe('Enter your email');
    });

    it('should work as a password input field', () => {
      component.label = 'Password';
      component.type = 'password';
      component.placeholder = 'Enter password';
      component.required = true;
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('password');
    });

    it('should display validation error for required field', () => {
      component.label = 'Required Field';
      component.required = true;
      component.errorMessage = 'This field is required';
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('.error-message'));
      const input = debugElement.query(By.css('input')).nativeElement;

      expect(errorElement).toBeTruthy();
      expect(input.classList.contains('error')).toBe(true);
    });

    it('should work as a phone number field', () => {
      component.label = 'Phone Number';
      component.type = 'tel';
      component.placeholder = '(123) 456-7890';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('tel');
      expect(input.placeholder).toBe('(123) 456-7890');
    });
  });

  describe('Accessibility Tests', () => {
    it('should have no accessibility violations with label and input', async () => {
      component.label = 'Full Name';
      component.placeholder = 'Enter your name';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with required field', async () => {
      component.label = 'Email';
      component.required = true;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with error message', async () => {
      component.label = 'Username';
      component.errorMessage = 'Username is required';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with disabled input', async () => {
      component.label = 'Disabled Field';
      component.disabled = true;
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with password input', async () => {
      component.label = 'Password';
      component.type = 'password';
      component.placeholder = 'Enter password';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with email input', async () => {
      component.label = 'Email Address';
      component.type = 'email';
      component.placeholder = 'you@example.com';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with number input', async () => {
      component.label = 'Age';
      component.type = 'number';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      component.label = 'Accessible Input';
      component.placeholder = 'Type here';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: { region: { enabled: false } },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have proper semantic structure', async () => {
      component.label = 'Semantic Input';
      fixture.detectChanges();

      const results = await axe(fixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['best-practice'],
        },
        rules: { region: { enabled: false } },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have proper label association', () => {
      component.label = 'Associated Label';
      fixture.detectChanges();

      const label = debugElement.query(By.css('label')).nativeElement;
      const input = debugElement.query(By.css('input')).nativeElement;

      expect(label.getAttribute('for')).toBe(input.id);
      expect(input.id).toBeTruthy();
    });

    it('should work with template-driven forms accessibility', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.componentInstance.label = 'Accessible Form Field';
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should work with reactive forms accessibility', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const results = await axe(hostFixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Integration Tests', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should work as a standalone component', () => {
      fixture.detectChanges();

      expect(component).toBeTruthy();
      const inputEl = debugElement.query(By.css('input'));
      expect(inputEl).toBeTruthy();
    });

    it('should maintain state across multiple change detections', () => {
      component.label = 'Persistent Label';
      component.value = 'Persistent Value';
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      const label = debugElement.query(By.css('label'));
      const input = debugElement.query(By.css('input')).nativeElement;

      expect(label.nativeElement.textContent).toContain('Persistent Label');
      expect(input.value).toBe('Persistent Value');
    });

    it('should handle complete form workflow', () => {
      const mockOnChange = vi.fn();
      const mockOnTouched = vi.fn();

      component.registerOnChange(mockOnChange);
      component.registerOnTouched(mockOnTouched);

      component.label = 'Full Name';
      component.placeholder = 'Enter name';
      component.required = true;
      fixture.detectChanges();

      // Simulate user typing
      const input = debugElement.query(By.css('input')).nativeElement;
      input.value = 'John Doe';
      input.dispatchEvent(new Event('input'));

      expect(component.value).toBe('John Doe');
      expect(mockOnChange).toHaveBeenCalledWith('John Doe');

      // Simulate blur
      input.dispatchEvent(new Event('blur'));
      expect(mockOnTouched).toHaveBeenCalled();
    });
  });
});
