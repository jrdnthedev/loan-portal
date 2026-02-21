import { Component, inject, OnInit, OnDestroy, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { Button } from '../../../../shared/components/button/button';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login',
  imports: [FormInput, Button, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm!: FormGroup;
  loginError = '';
  loginSuccess = output<void>();

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    // Reset form when component is destroyed (modal closed)
    this.loginForm?.reset();
    this.loginError = '';
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors && control.touched) {
      const errors = control.errors;
      if (errors['required']) return 'This field is required';
      if (errors['email']) return 'Please enter a valid email address';
      if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
      return 'Invalid value';
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = this.loginForm.value;
      this.loginError = '';

      this.authService.login(loginData).subscribe({
        next: () => {
          // Get returnUrl from current URL's query params if it exists
          const urlTree = this.router.parseUrl(this.router.url);
          const returnUrl = urlTree.queryParams['returnUrl'] || '/shell';
          this.loginSuccess.emit();
          // Navigate to returnUrl and clear query params
          this.router.navigate([returnUrl], { queryParams: {} });
        },
        error: (error) => {
          this.loginError = error.error?.message || 'Login failed. Please try again.';
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  get isLoading(): boolean {
    return this.authService.isLoading();
  }
}
