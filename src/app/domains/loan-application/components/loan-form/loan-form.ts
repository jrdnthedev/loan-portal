import { Component, OnInit, input, output, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanType } from '../../models/loan-type';
import { Loan } from '../../models/loan';
import { LoanTypeConfiguration } from '../../models/loan-form.interface';
import { Button } from '../../../../shared/components/button/button';
import { Card } from '../../../../shared/components/card/card';

@Component({
  selector: 'app-loan-form',
  imports: [ReactiveFormsModule, CommonModule, Button, Card],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.scss',
})
export class LoanForm implements OnInit {
  loanType = input<LoanType>('personal');
  initialData = input<Partial<Loan>>();
  maxTerm = signal('');
  formSubmitted = output<Loan>();
  formSaved = output<Partial<Loan>>();

  loanForm!: FormGroup;

  // Loan type specific configurations
  loanTypeConfig: Record<LoanType, LoanTypeConfiguration> = {
    ['personal']: {
      minAmount: 1000,
      maxAmount: 50000,
      maxTermMonths: 84,
      fields: ['amount', 'termMonths', 'applicant', 'purpose'],
    },
    ['mortgage']: {
      minAmount: 50000,
      maxAmount: 1000000,
      maxTermMonths: 360,
      fields: ['amount', 'termMonths', 'applicant', 'coSigner', 'propertyAddress', 'downPayment'],
    },
    ['auto']: {
      minAmount: 5000,
      maxAmount: 100000,
      maxTermMonths: 84,
      fields: ['amount', 'termMonths', 'applicant', 'vehicleInfo', 'downPayment'],
    },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    const data = this.initialData();
    if (data) {
      this.populateForm(data);
    }
    const maxTermMonths = this.config().maxTermMonths;
    if (maxTermMonths >= 360) {
      this.maxTerm.set('30 years');
    } else if (maxTermMonths >= 240) {
      this.maxTerm.set('20 years');
    } else if (maxTermMonths >= 180) {
      this.maxTerm.set('15 years');
    } else if (maxTermMonths >= 120) {
      this.maxTerm.set('10 years');
    } else if (maxTermMonths >= 84) {
      this.maxTerm.set('7 years');
    } else if (maxTermMonths >= 72) {
      this.maxTerm.set('6 years');
    }
  }

  private initializeForm() {
    const config = this.loanTypeConfig[this.loanType()];

    this.loanForm = this.fb.group({
      type: [this.loanType(), Validators.required],
      amount: this.fb.group({
        requested: [
          '',
          [Validators.required, Validators.min(config.minAmount), Validators.max(config.maxAmount)],
        ],
        currency: ['USD'],
      }),
      termMonths: [
        '',
        [Validators.required, Validators.min(1), Validators.max(config.maxTermMonths)],
      ],
      applicant: this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        dateOfBirth: ['', Validators.required],
        ssn: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]],
        income: ['', [Validators.required, Validators.min(0)]],
        employmentStatus: ['', Validators.required],
        creditScore: ['', [Validators.min(300), Validators.max(850)]],
      }),
    });

    // Add conditional fields based on loan type
    this.addConditionalFields();
  }

  private addConditionalFields() {
    const config = this.loanTypeConfig[this.loanType()];

    if (config.fields.includes('purpose')) {
      this.loanForm.addControl('purpose', this.fb.control('', Validators.required));
    }

    if (config.fields.includes('coSigner')) {
      this.loanForm.addControl(
        'coSigner',
        this.fb.group({
          fullName: [''],
          dateOfBirth: [''],
          ssn: [''],
          income: ['', Validators.min(0)],
          employmentStatus: [''],
          creditScore: ['', [Validators.min(300), Validators.max(850)]],
        }),
      );
    }

    if (config.fields.includes('propertyAddress')) {
      this.loanForm.addControl(
        'propertyAddress',
        this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
          propertyValue: ['', [Validators.required, Validators.min(0)]],
        }),
      );
    }

    if (config.fields.includes('vehicleInfo')) {
      this.loanForm.addControl(
        'vehicleInfo',
        this.fb.group({
          make: ['', Validators.required],
          model: ['', Validators.required],
          year: [
            '',
            [
              Validators.required,
              Validators.min(1900),
              Validators.max(new Date().getFullYear() + 1),
            ],
          ],
          vin: ['', [Validators.required, Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/)]],
          mileage: ['', [Validators.required, Validators.min(0)]],
          value: ['', [Validators.required, Validators.min(0)]],
        }),
      );
    }

    if (config.fields.includes('downPayment')) {
      this.loanForm.addControl(
        'downPayment',
        this.fb.control('', [Validators.required, Validators.min(0)]),
      );
    }
  }

  private populateForm(data: Partial<Loan>) {
    this.loanForm.patchValue(data);
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const formData = this.loanForm.value;
      const data = this.initialData();
      const loan: Loan = {
        id: data?.id || this.generateId(),
        ...formData,
        status: data?.status || 'draft',
        submittedAt: new Date().toISOString(),
      };
      this.formSubmitted.emit(loan);
    } else {
      this.markFormGroupTouched(this.loanForm);
    }
  }

  onSaveDraft() {
    const formData = this.loanForm.value;
    this.formSaved.emit(formData);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Helper methods for template
  hasField(fieldName: string): boolean {
    return this.loanTypeConfig[this.loanType()].fields.includes(fieldName);
  }

  getFieldError(fieldPath: string): string | null {
    const control = this.loanForm.get(fieldPath);
    if (control?.errors && control.touched) {
      const errors = control.errors;
      if (errors['required']) return 'This field is required';
      if (errors['min']) return `Minimum value is ${errors['min'].min}`;
      if (errors['max']) return `Maximum value is ${errors['max'].max}`;
      if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
      if (errors['pattern']) return 'Invalid format';
      return 'Invalid value';
    }
    return null;
  }

  config = computed(() => this.loanTypeConfig[this.loanType()]);

  currentYear = computed(() => new Date().getFullYear());
}
