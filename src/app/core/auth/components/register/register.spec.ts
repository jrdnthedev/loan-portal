import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/auth.interface';
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: { register: ReturnType<typeof vi.fn>; isLoading: ReturnType<typeof vi.fn> };
  let router: Router;

  const mockRegisterResponse: LoginResponse = {
    user: {
      id: '1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'loan-officer',
      phone: '555-1234',
    },
    token: 'mock-token',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  describe('Component Initialization', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Register],
        providers: [provideRouter([])],
      });

      fixture = TestBed.createComponent(Register);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form on ngOnInit', () => {
      expect(component.registerForm).toBeDefined();
      expect(component.registerForm.get('firstName')).toBeDefined();
      expect(component.registerForm.get('lastName')).toBeDefined();
      expect(component.registerForm.get('email')).toBeDefined();
      expect(component.registerForm.get('password')).toBeDefined();
      expect(component.registerForm.get('confirmPassword')).toBeDefined();
    });

    it('should have empty registerError on init', () => {
      expect(component.registerError).toBe('');
    });
  });

  describe('Component Cleanup', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Register],
        providers: [provideRouter([])],
      });

      fixture = TestBed.createComponent(Register);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should reset form on ngOnDestroy', () => {
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.ngOnDestroy();

      expect(component.registerForm.get('firstName')?.value).toBeNull();
      expect(component.registerForm.get('lastName')?.value).toBeNull();
      expect(component.registerForm.get('email')?.value).toBeNull();
      expect(component.registerForm.get('password')?.value).toBeNull();
      expect(component.registerForm.get('confirmPassword')?.value).toBeNull();
    });

    it('should clear registerError on ngOnDestroy', () => {
      component.registerError = 'Some error message';

      component.ngOnDestroy();

      expect(component.registerError).toBe('');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Register],
        providers: [provideRouter([])],
      });

      fixture = TestBed.createComponent(Register);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize form with empty values', () => {
      expect(component.registerForm.get('firstName')?.value).toBe('');
      expect(component.registerForm.get('lastName')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    });

    it('should invalidate form when fields are empty', () => {
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should validate required fields', () => {
      const firstName = component.registerForm.get('firstName');
      const lastName = component.registerForm.get('lastName');
      const email = component.registerForm.get('email');
      const password = component.registerForm.get('password');
      const confirmPassword = component.registerForm.get('confirmPassword');

      firstName?.setValue('');
      lastName?.setValue('');
      email?.setValue('');
      password?.setValue('');
      confirmPassword?.setValue('');

      expect(firstName?.hasError('required')).toBeTruthy();
      expect(lastName?.hasError('required')).toBeTruthy();
      expect(email?.hasError('required')).toBeTruthy();
      expect(password?.hasError('required')).toBeTruthy();
      expect(confirmPassword?.hasError('required')).toBeTruthy();
    });

    it('should validate minimum length for firstName and lastName', () => {
      const firstName = component.registerForm.get('firstName');
      const lastName = component.registerForm.get('lastName');

      firstName?.setValue('A');
      lastName?.setValue('B');

      expect(firstName?.hasError('minlength')).toBeTruthy();
      expect(lastName?.hasError('minlength')).toBeTruthy();
    });

    it('should accept firstName and lastName with 2+ characters', () => {
      const firstName = component.registerForm.get('firstName');
      const lastName = component.registerForm.get('lastName');

      firstName?.setValue('Jo');
      lastName?.setValue('Do');

      expect(firstName?.hasError('minlength')).toBeFalsy();
      expect(lastName?.hasError('minlength')).toBeFalsy();
    });

    it('should validate email format', () => {
      const email = component.registerForm.get('email');

      email?.setValue('invalid-email');
      expect(email?.hasError('email')).toBeTruthy();

      email?.setValue('valid@email.com');
      expect(email?.hasError('email')).toBeFalsy();
    });

    it('should validate various email formats', () => {
      const email = component.registerForm.get('email');

      email?.setValue('test@test.com');
      expect(email?.hasError('email')).toBeFalsy();

      email?.setValue('test.name@example.co.uk');
      expect(email?.hasError('email')).toBeFalsy();

      email?.setValue('test');
      expect(email?.hasError('email')).toBeTruthy();

      email?.setValue('@example.com');
      expect(email?.hasError('email')).toBeTruthy();
    });

    it('should validate password minimum length', () => {
      const password = component.registerForm.get('password');

      password?.setValue('short');
      expect(password?.hasError('minlength')).toBeTruthy();

      password?.setValue('longpassword');
      expect(password?.hasError('minlength')).toBeFalsy();
    });

    it('should accept password with exactly 8 characters', () => {
      const password = component.registerForm.get('password');

      password?.setValue('pass1234');
      expect(password?.hasError('minlength')).toBeFalsy();
    });

    it('should validate password match', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'different123',
      });

      expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();

      component.registerForm.patchValue({
        confirmPassword: 'password123',
      });

      expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
    });

    it('should not show password mismatch when passwords are empty', () => {
      component.registerForm.patchValue({
        password: '',
        confirmPassword: '',
      });

      expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
    });

    it('should validate form is valid with correct data', () => {
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.registerForm.valid).toBeTruthy();
    });
  });

  describe('getFieldError', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Register],
        providers: [provideRouter([])],
      });

      fixture = TestBed.createComponent(Register);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should return required error message', () => {
      const control = component.registerForm.get('firstName');
      control?.markAsTouched();
      control?.setValue('');

      expect(component.getFieldError('firstName')).toBe('This field is required');
    });

    it('should return email error message', () => {
      const control = component.registerForm.get('email');
      control?.markAsTouched();
      control?.setValue('invalid-email');

      expect(component.getFieldError('email')).toBe('Please enter a valid email address');
    });

    it('should return minlength error message', () => {
      const control = component.registerForm.get('firstName');
      control?.markAsTouched();
      control?.setValue('A');

      expect(component.getFieldError('firstName')).toBe('Minimum length is 2');
    });

    it('should return password mismatch error', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'different',
      });
      const control = component.registerForm.get('confirmPassword');
      control?.markAsTouched();

      expect(component.getFieldError('confirmPassword')).toBe('Passwords do not match');
    });

    it('should return empty string when field is not touched', () => {
      component.registerForm.get('firstName')?.setValue('');

      expect(component.getFieldError('firstName')).toBe('');
    });

    it('should return empty string when field is valid', () => {
      const control = component.registerForm.get('firstName');
      control?.markAsTouched();
      control?.setValue('John');

      expect(component.getFieldError('firstName')).toBe('');
    });

    it('should not show password mismatch on password field', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'different',
      });
      const control = component.registerForm.get('password');
      control?.markAsTouched();

      expect(component.getFieldError('password')).toBe('');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      authServiceSpy = {
        register: vi.fn(),
        isLoading: vi.fn().mockReturnValue(false),
      };

      TestBed.configureTestingModule({
        imports: [Register],
        providers: [{ provide: AuthService, useValue: authServiceSpy }, provideRouter([])],
      });

      fixture = TestBed.createComponent(Register);
      component = fixture.componentInstance;
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should not submit when form is invalid', () => {
      component.registerForm.patchValue({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      component.onSubmit();

      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.registerForm.patchValue({
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(component.registerForm.get('firstName')?.touched).toBeTruthy();
      expect(component.registerForm.get('lastName')?.touched).toBeTruthy();
      expect(component.registerForm.get('email')?.touched).toBeTruthy();
      expect(component.registerForm.get('password')?.touched).toBeTruthy();
      expect(component.registerForm.get('confirmPassword')?.touched).toBeTruthy();
    });

    it('should submit when form is valid', () => {
      authServiceSpy.register.mockReturnValue(of(mockRegisterResponse));

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(authServiceSpy.register).toHaveBeenCalled();
    });

    it('should exclude confirmPassword from registration data', () => {
      authServiceSpy.register.mockReturnValue(of(mockRegisterResponse));

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      const submitData = authServiceSpy.register.mock.calls[0][0];
      expect(submitData).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(submitData.confirmPassword).toBeUndefined();
    });

    it('should clear error message on submit', () => {
      authServiceSpy.register.mockReturnValue(of(mockRegisterResponse));
      component.registerError = 'Previous error';

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(component.registerError).toBe('');
    });

    it('should navigate to shell on successful registration', () => {
      authServiceSpy.register.mockReturnValue(of(mockRegisterResponse));
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith(['/shell']);
    });

    it('should emit registerSuccess on successful registration', () => {
      authServiceSpy.register.mockReturnValue(of(mockRegisterResponse));
      let emitted = false;

      component.registerSuccess.subscribe(() => {
        emitted = true;
      });

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(emitted).toBe(true);
    });

    it('should display error message on registration failure with message', () => {
      const errorResponse = {
        error: { message: 'Email already exists' },
      };
      authServiceSpy.register.mockReturnValue(throwError(() => errorResponse));

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(component.registerError).toBe('Email already exists');
    });

    it('should display default error message on registration failure without message', () => {
      authServiceSpy.register.mockReturnValue(throwError(() => ({})));

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(component.registerError).toBe('Registration failed. Please try again.');
    });

    it('should not navigate on registration failure', () => {
      authServiceSpy.register.mockReturnValue(throwError(() => ({ error: { message: 'Error' } })));
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not emit registerSuccess on registration failure', () => {
      authServiceSpy.register.mockReturnValue(throwError(() => ({ error: { message: 'Error' } })));
      let emitted = false;

      component.registerSuccess.subscribe(() => {
        emitted = true;
      });

      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(emitted).toBe(false);
    });
  });

  describe('isLoading', () => {
    beforeEach(() => {
      authServiceSpy = {
        register: vi.fn(),
        isLoading: vi.fn(),
      };

      TestBed.configureTestingModule({
        imports: [Register],
        providers: [{ provide: AuthService, useValue: authServiceSpy }, provideRouter([])],
      });

      fixture = TestBed.createComponent(Register);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should return loading state from authService', () => {
      authServiceSpy.isLoading.mockReturnValue(true);
      expect(component.isLoading).toBeTruthy();

      authServiceSpy.isLoading.mockReturnValue(false);
      expect(component.isLoading).toBeFalsy();
    });
  });
});
