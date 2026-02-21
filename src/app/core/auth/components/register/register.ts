import { Component, inject, OnInit, OnDestroy, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { Button } from '../../../../shared/components/button/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormInput, Button, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm!: FormGroup;
  registerError = '';
  registerSuccess = output<void>();
  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    // Reset form when component is destroyed (modal closed)
    this.registerForm?.reset();
    this.registerError = '';
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  getFieldError(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.errors && control.touched) {
      const errors = control.errors;
      if (errors['required']) return 'This field is required';
      if (errors['email']) return 'Please enter a valid email address';
      if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
      return 'Invalid value';
    }

    // Check for password mismatch on confirmPassword field
    if (
      fieldName === 'confirmPassword' &&
      this.registerForm?.errors?.['passwordMismatch'] &&
      control?.touched
    ) {
      return 'Passwords do not match';
    }

    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      this.registerError = '';

      this.authService.register(registerData).subscribe({
        next: () => {
          this.registerSuccess.emit();
          this.router.navigate(['/shell']);
        },
        error: (error) => {
          this.registerError = error.error?.message || 'Registration failed. Please try again.';
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  get isLoading(): boolean {
    return this.authService.isLoading();
  }
}
