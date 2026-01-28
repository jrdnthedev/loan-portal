import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, EMPTY } from 'rxjs';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { vi } from 'vitest';
import { signal } from '@angular/core';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: any;
  let router: any;

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
      isLoading: signal(false),
    };

    router = {
      navigate: vi.fn(),
      events: EMPTY,
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have email and password validators', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    expect(emailControl?.hasError('required')).toBe(true);
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBe(true);

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBe(false);
  });

  it('should return correct error message for required field', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.markAsTouched();
    expect(component.getFieldError('email')).toBe('This field is required');
  });

  it('should return correct error message for invalid email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid');
    emailControl?.markAsTouched();
    expect(component.getFieldError('email')).toBe('Please enter a valid email address');
  });

  it('should return correct error message for minlength', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    passwordControl?.markAsTouched();
    expect(component.getFieldError('password')).toBe('Minimum length is 6');
  });

  it('should return empty string when field is not touched', () => {
    expect(component.getFieldError('email')).toBe('');
  });

  it('should mark all fields as touched when form is invalid on submit', () => {
    component.onSubmit();
    expect(component.loginForm.get('email')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('should call authService.login on valid form submit', () => {
    authService.login.mockReturnValue(of({}));
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should navigate to /shell on successful login', () => {
    authService.login.mockReturnValue(of({}));
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/shell']);
  });

  it('should emit loginSuccess on successful login', (done) => {
    authService.login.mockReturnValue(of({}));

    component.loginSuccess.subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();
  });

  it('should set loginError on failed login', () => {
    authService.login.mockReturnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } })),
    );

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    component.onSubmit();

    expect(component.loginError).toBe('Invalid credentials');
  });

  it('should set default error message when no error message provided', () => {
    authService.login.mockReturnValue(throwError(() => ({ error: {} })));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.loginError).toBe('Login failed. Please try again.');
  });

  it('should clear loginError on successful submit attempt', () => {
    component.loginError = 'Previous error';
    authService.login.mockReturnValue(of({}));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.loginError).toBe('');
  });

  it('should return loading state from authService', () => {
    authService.isLoading.set(true);
    expect(component.isLoading).toBe(true);

    authService.isLoading.set(false);
    expect(component.isLoading).toBe(false);
  });
});
