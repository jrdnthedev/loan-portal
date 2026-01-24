import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FormInput } from './form-input';

@Component({
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
  template: ` <app-form-input [formControl]="formControl"></app-form-input> `,
})
class ReactiveFormHostComponent {
  formControl = new FormControl('initial value');
}

describe('FormInput', () => {
  let component: FormInput;
  let fixture: ComponentFixture<FormInput>;
  let debugElement: DebugElement;

  describe('Standalone Component', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
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
  });

  describe('Input Properties', () => {
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

    it('should display required asterisk when required is true', () => {
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

    it('should set input type', () => {
      component.type = 'email';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('email');
    });

    it('should set input placeholder', () => {
      component.placeholder = 'Enter your email';
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.placeholder).toBe('Enter your email');
    });

    it('should disable input when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBeTruthy();
    });

    it('should enable input when disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();

      const input = debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBeFalsy();
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
      expect(input.classList.contains('error')).toBeTruthy();
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
      fixture.detectChanges();
    });

    it('should implement writeValue', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null value in writeValue', () => {
      component.writeValue(null as any);
      expect(component.value).toBe('');
    });

    it('should register onChange callback', () => {
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);

      component.onInput({ target: { value: 'test' } } as unknown as Event);

      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const mockOnTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockOnTouched);

      component.onBlur();

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTruthy();

      component.setDisabledState(false);
      expect(component.disabled).toBeFalsy();
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
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);

      const inputElement = debugElement.query(By.css('input')).nativeElement;
      inputElement.value = 'new value';
      inputElement.dispatchEvent(new Event('input'));

      expect(component.value).toBe('new value');
      expect(mockOnChange).toHaveBeenCalledWith('new value');
    });

    it('should call onTouched on blur event', () => {
      const mockOnTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockOnTouched);

      const inputElement = debugElement.query(By.css('input')).nativeElement;
      inputElement.dispatchEvent(new Event('blur'));

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should handle onInput method correctly', () => {
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);

      const mockEvent = {
        target: { value: 'input value' },
      } as unknown as Event;

      component.onInput(mockEvent);

      expect(component.value).toBe('input value');
      expect(mockOnChange).toHaveBeenCalledWith('input value');
    });

    it('should handle onBlur method correctly', () => {
      const mockOnTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockOnTouched);

      component.onBlur();

      expect(mockOnTouched).toHaveBeenCalled();
    });
  });

  describe('DOM Integration', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput],
      }).compileComponents();

      fixture = TestBed.createComponent(FormInput);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    it('should link label to input with correct ID', () => {
      component.label = 'Test Label';
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label')).nativeElement;
      const inputElement = debugElement.query(By.css('input')).nativeElement;

      expect(labelElement.getAttribute('for')).toBe(component.inputId);
      expect(inputElement.id).toBe(component.inputId);
    });

    it('should reflect value changes in DOM', () => {
      component.value = 'test value';
      fixture.detectChanges();

      const inputElement = debugElement.query(By.css('input')).nativeElement;
      expect(inputElement.value).toBe('test value');
    });
  });

  describe('With Template-Driven Forms', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput, FormsModule],
        declarations: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should work with ngModel', async () => {
      hostComponent.value = 'initial';
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.value).toBe('initial');

      // Simulate user input
      input.value = 'changed';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(hostComponent.value).toBe('changed');
    });
  });

  describe('With Reactive Forms', () => {
    let hostComponent: ReactiveFormHostComponent;
    let hostFixture: ComponentFixture<ReactiveFormHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormInput, ReactiveFormsModule],
        declarations: [ReactiveFormHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should work with reactive forms', () => {
      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.value).toBe('initial value');

      // Update form control value
      hostComponent.formControl.setValue('updated value');
      hostFixture.detectChanges();
      expect(input.value).toBe('updated value');

      // Simulate user input
      input.value = 'user input';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();

      expect(hostComponent.formControl.value).toBe('user input');
    });

    it('should handle disabled state from form control', () => {
      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;

      hostComponent.formControl.disable();
      hostFixture.detectChanges();

      expect(input.disabled).toBeTruthy();

      hostComponent.formControl.enable();
      hostFixture.detectChanges();

      expect(input.disabled).toBeFalsy();
    });
  });
});
