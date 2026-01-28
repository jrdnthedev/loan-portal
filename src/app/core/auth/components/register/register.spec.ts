import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/auth.interface';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

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

    it('should validate email format', () => {
      const email = component.registerForm.get('email');

      email?.setValue('invalid-email');
      expect(email?.hasError('email')).toBeTruthy();

      email?.setValue('valid@email.com');
      expect(email?.hasError('email')).toBeFalsy();
    });

    it('should validate password minimum length', () => {
      const password = component.registerForm.get('password');

      password?.setValue('short');
      expect(password?.hasError('minlength')).toBeTruthy();

      password?.setValue('longpassword');
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

  // describe('onSubmit', () => {
  //   let authServiceSpy: { register: ReturnType<typeof vi.fn>; isLoading: ReturnType<typeof vi.fn> };
  //   let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  //   beforeEach(() => {
  //     authServiceSpy = {
  //       register: vi.fn(),
  //       isLoading: vi.fn().mockReturnValue(false),
  //     };
  //     routerSpy = {
  //       navigate: vi.fn(),
  //     };

  //     TestBed.configureTestingModule({
  //       imports: [Register],
  //       providers: [
  //         { provide: AuthService, useValue: authServiceSpy },
  //         { provide: Router, useValue: routerSpy },
  //         { provide: ActivatedRoute, useValue: {} },
  //       ],
  //     });

  //     fixture = TestBed.createComponent(Register);
  //     component = fixture.componentInstance;
  //     component.ngOnInit(); // Explicitly call ngOnInit
  //     fixture.detectChanges();
  //   });

  //   it('should call authService.register with valid form data', (done) => {
  //     const registerData = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john@example.com',
  //       password: 'password123',
  //     };

  //     component.registerForm.patchValue({
  //       ...registerData,
  //       confirmPassword: 'password123',
  //     });

  //     const mockResponse: LoginResponse = {
  //       user: {
  //         id: '1',
  //         email: 'john@example.com',
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         role: 'loan-officer',
  //         phone: '',
  //       },
  //       token: 'mock-token',
  //       accessToken: 'mock-access-token',
  //       refreshToken: 'mock-refresh-token',
  //     };
  //     authServiceSpy.register.mockReturnValue(of(mockResponse));

  //     component.onSubmit();

  //     // Wait for async operations
  //     setTimeout(() => {
  //       expect(authServiceSpy.register).toHaveBeenCalledWith(registerData);
  //       done();
  //     }, 0);
  //   });

  //   it('should navigate to /welcome on successful registration', (done) => {
  //     component.registerForm.patchValue({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john@example.com',
  //       password: 'password123',
  //       confirmPassword: 'password123',
  //     });

  //     const mockResponse: LoginResponse = {
  //       user: {
  //         id: '1',
  //         email: 'john@example.com',
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         role: 'loan-officer',
  //         phone: '',
  //       },
  //       token: 'mock-token',
  //       accessToken: 'mock-access-token',
  //       refreshToken: 'mock-refresh-token',
  //     };
  //     authServiceSpy.register.mockReturnValue(of(mockResponse));

  //     component.onSubmit();

  //     setTimeout(() => {
  //       expect(routerSpy.navigate).toHaveBeenCalledWith(['/welcome']);
  //       done();
  //     }, 0);
  //   });

  //   it('should emit registerSuccess on successful registration', (done) => {
  //     let emitted = false;
  //     component.registerSuccess.subscribe(() => {
  //       emitted = true;
  //     });

  //     component.registerForm.patchValue({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john@example.com',
  //       password: 'password123',
  //       confirmPassword: 'password123',
  //     });

  //     const mockResponse: LoginResponse = {
  //       user: {
  //         id: '1',
  //         email: 'john@example.com',
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         role: 'loan-officer',
  //         phone: '',
  //       },
  //       token: 'mock-token',
  //       accessToken: 'mock-access-token',
  //       refreshToken: 'mock-refresh-token',
  //     };
  //     authServiceSpy.register.mockReturnValue(of(mockResponse));

  //     component.onSubmit();

  //     setTimeout(() => {
  //       expect(emitted).toBeTruthy();
  //       done();
  //     }, 0);
  //   });

  //   it('should set registerError on registration failure', (done) => {
  //     component.registerForm.patchValue({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john@example.com',
  //       password: 'password123',
  //       confirmPassword: 'password123',
  //     });

  //     const errorResponse = { error: { message: 'Email already exists' } };
  //     authServiceSpy.register.mockReturnValue(throwError(() => errorResponse));

  //     component.onSubmit();

  //     setTimeout(() => {
  //       expect(component.registerError).toBe('Email already exists');
  //       done();
  //     }, 0);
  //   });

  //   it('should set default error message when error has no message', (done) => {
  //     component.registerForm.patchValue({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john@example.com',
  //       password: 'password123',
  //       confirmPassword: 'password123',
  //     });

  //     authServiceSpy.register.mockReturnValue(throwError(() => ({})));

  //     component.onSubmit();

  //     setTimeout(() => {
  //       expect(component.registerError).toBe('Registration failed. Please try again.');
  //       done();
  //     }, 0);
  //   });

  //   it('should mark all fields as touched when form is invalid', () => {
  //     component.registerForm.patchValue({
  //       firstName: '',
  //       lastName: '',
  //       email: '',
  //       password: '',
  //       confirmPassword: '',
  //     });

  //     component.onSubmit();

  //     expect(component.registerForm.get('firstName')?.touched).toBeTruthy();
  //     expect(component.registerForm.get('lastName')?.touched).toBeTruthy();
  //     expect(component.registerForm.get('email')?.touched).toBeTruthy();
  //     expect(component.registerForm.get('password')?.touched).toBeTruthy();
  //     expect(component.registerForm.get('confirmPassword')?.touched).toBeTruthy();
  //   });

  //   it('should not call authService.register when form is invalid', () => {
  //     component.registerForm.patchValue({
  //       firstName: '',
  //       lastName: '',
  //       email: 'invalid',
  //       password: 'short',
  //       confirmPassword: '',
  //     });

  //     component.onSubmit();

  //     expect(authServiceSpy.register).not.toHaveBeenCalled();
  //   });

  //   it('should clear registerError on successful submit', (done) => {
  //     component.registerError = 'Previous error';

  //     component.registerForm.patchValue({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john@example.com',
  //       password: 'password123',
  //       confirmPassword: 'password123',
  //     });

  //     const mockResponse: LoginResponse = {
  //       user: {
  //         id: '1',
  //         email: 'john@example.com',
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         role: 'loan-officer',
  //         phone: '',
  //       },
  //       token: 'mock-token',
  //       accessToken: 'mock-access-token',
  //       refreshToken: 'mock-refresh-token',
  //     };
  //     authServiceSpy.register.mockReturnValue(of(mockResponse));

  //     component.onSubmit();

  //     setTimeout(() => {
  //       expect(component.registerError).toBe('');
  //       done();
  //     }, 0);
  //   });
  // });

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
  });

  describe('isLoading', () => {
    let authServiceSpy: { register: ReturnType<typeof vi.fn>; isLoading: ReturnType<typeof vi.fn> };

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
