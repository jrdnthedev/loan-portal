import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { LoanForm } from './loan-form';
import { Loan } from '../../models/loan';
import { LoanType } from '../../models/loan-type';

describe('LoanForm', () => {
  let component: LoanForm;
  let fixture: ComponentFixture<LoanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanForm, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanForm);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default loan type of personal', () => {
      fixture.detectChanges();
      expect(component.loanType()).toBe('personal');
    });
  });

  describe('Form Initialization', () => {
    it('should initialize form with personal loan configuration', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      expect(component.loanForm).toBeDefined();
      expect(component.loanForm.get('type')?.value).toBe('personal');
      expect(component.loanForm.get('amount')).toBeDefined();
      expect(component.loanForm.get('termMonths')).toBeDefined();
      expect(component.loanForm.get('applicant')).toBeDefined();
      expect(component.loanForm.get('purpose')).toBeDefined();
    });

    it('should initialize form with mortgage loan configuration', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      expect(component.loanForm.get('type')?.value).toBe('mortgage');
      expect(component.loanForm.get('coSigner')).toBeDefined();
      expect(component.loanForm.get('propertyAddress')).toBeDefined();
      expect(component.loanForm.get('downPayment')).toBeDefined();
      expect(component.loanForm.get('purpose')).toBeNull();
    });

    it('should initialize form with auto loan configuration', () => {
      fixture.componentRef.setInput('loanType', 'auto');
      fixture.detectChanges();

      expect(component.loanForm.get('type')?.value).toBe('auto');
      expect(component.loanForm.get('vehicleInfo')).toBeDefined();
      expect(component.loanForm.get('downPayment')).toBeDefined();
      expect(component.loanForm.get('purpose')).toBeNull();
      expect(component.loanForm.get('coSigner')).toBeNull();
    });

    it('should set correct amount validators for personal loan', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      const amountControl = component.loanForm.get('amount.requested');
      amountControl?.setValue(500);
      expect(amountControl?.hasError('min')).toBe(true);

      amountControl?.setValue(60000);
      expect(amountControl?.hasError('max')).toBe(true);

      amountControl?.setValue(25000);
      expect(amountControl?.valid).toBe(true);
    });

    it('should set correct amount validators for mortgage loan', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      const amountControl = component.loanForm.get('amount.requested');
      amountControl?.setValue(40000);
      expect(amountControl?.hasError('min')).toBe(true);

      amountControl?.setValue(1500000);
      expect(amountControl?.hasError('max')).toBe(true);

      amountControl?.setValue(250000);
      expect(amountControl?.valid).toBe(true);
    });

    it('should set correct term validators for personal loan', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      const termControl = component.loanForm.get('termMonths');
      termControl?.setValue(0);
      expect(termControl?.hasError('min')).toBe(true);

      termControl?.setValue(100);
      expect(termControl?.hasError('max')).toBe(true);

      termControl?.setValue(60);
      expect(termControl?.valid).toBe(true);
    });

    it('should set correct term validators for mortgage loan', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      const termControl = component.loanForm.get('termMonths');
      termControl?.setValue(365);
      expect(termControl?.hasError('max')).toBe(true);

      termControl?.setValue(360);
      expect(termControl?.valid).toBe(true);
    });
  });

  describe('Max Term Display', () => {
    it('should set maxTerm to "30 years" for mortgage loans', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      expect(component.maxTerm()).toBe('30 years');
    });

    it('should set maxTerm to "7 years" for personal loans', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      expect(component.maxTerm()).toBe('7 years');
    });

    it('should set maxTerm to "7 years" for auto loans', () => {
      fixture.componentRef.setInput('loanType', 'auto');
      fixture.detectChanges();

      expect(component.maxTerm()).toBe('7 years');
    });
  });

  describe('Applicant Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should require applicant full name', () => {
      const fullNameControl = component.loanForm.get('applicant.fullName');
      expect(fullNameControl?.hasError('required')).toBe(true);

      fullNameControl?.setValue('');
      expect(fullNameControl?.hasError('required')).toBe(true);

      fullNameControl?.setValue('John Doe');
      expect(fullNameControl?.valid).toBe(true);
    });

    it('should require applicant full name to have minimum length of 2', () => {
      const fullNameControl = component.loanForm.get('applicant.fullName');
      fullNameControl?.setValue('J');
      expect(fullNameControl?.hasError('minlength')).toBe(true);

      fullNameControl?.setValue('Jo');
      expect(fullNameControl?.valid).toBe(true);
    });

    it('should require applicant date of birth', () => {
      const dobControl = component.loanForm.get('applicant.dateOfBirth');
      expect(dobControl?.hasError('required')).toBe(true);

      dobControl?.setValue('1990-01-01');
      expect(dobControl?.valid).toBe(true);
    });

    it('should validate SSN format', () => {
      const ssnControl = component.loanForm.get('applicant.ssn');
      ssnControl?.setValue('123456789');
      expect(ssnControl?.hasError('pattern')).toBe(true);

      ssnControl?.setValue('123-45-6789');
      expect(ssnControl?.valid).toBe(true);
    });

    it('should require applicant income and enforce minimum of 0', () => {
      const incomeControl = component.loanForm.get('applicant.income');
      expect(incomeControl?.hasError('required')).toBe(true);

      incomeControl?.setValue(-1000);
      expect(incomeControl?.hasError('min')).toBe(true);

      incomeControl?.setValue(50000);
      expect(incomeControl?.valid).toBe(true);
    });

    it('should require employment status', () => {
      const employmentControl = component.loanForm.get('applicant.employmentStatus');
      expect(employmentControl?.hasError('required')).toBe(true);

      employmentControl?.setValue('full-time');
      expect(employmentControl?.valid).toBe(true);
    });

    it('should validate credit score range', () => {
      const creditScoreControl = component.loanForm.get('applicant.creditScore');
      creditScoreControl?.setValue(250);
      expect(creditScoreControl?.hasError('min')).toBe(true);

      creditScoreControl?.setValue(900);
      expect(creditScoreControl?.hasError('max')).toBe(true);

      creditScoreControl?.setValue(700);
      expect(creditScoreControl?.valid).toBe(true);
    });
  });

  describe('Conditional Fields', () => {
    it('should include purpose field for personal loans', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      expect(component.hasField('purpose')).toBe(true);
      expect(component.loanForm.get('purpose')).toBeDefined();
    });

    it('should include coSigner field for mortgage loans', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      expect(component.hasField('coSigner')).toBe(true);
      expect(component.loanForm.get('coSigner')).toBeDefined();
    });

    it('should include propertyAddress field for mortgage loans', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      expect(component.hasField('propertyAddress')).toBe(true);
      const propertyAddress = component.loanForm.get('propertyAddress');
      expect(propertyAddress).toBeDefined();
      expect(propertyAddress?.get('street')).toBeDefined();
      expect(propertyAddress?.get('city')).toBeDefined();
      expect(propertyAddress?.get('state')).toBeDefined();
      expect(propertyAddress?.get('zipCode')).toBeDefined();
      expect(propertyAddress?.get('propertyValue')).toBeDefined();
    });

    it('should validate property zipCode format', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      const zipControl = component.loanForm.get('propertyAddress.zipCode');
      zipControl?.setValue('1234');
      expect(zipControl?.hasError('pattern')).toBe(true);

      zipControl?.setValue('12345');
      expect(zipControl?.valid).toBe(true);

      zipControl?.setValue('12345-6789');
      expect(zipControl?.valid).toBe(true);
    });

    it('should include vehicleInfo field for auto loans', () => {
      fixture.componentRef.setInput('loanType', 'auto');
      fixture.detectChanges();

      expect(component.hasField('vehicleInfo')).toBe(true);
      const vehicleInfo = component.loanForm.get('vehicleInfo');
      expect(vehicleInfo).toBeDefined();
      expect(vehicleInfo?.get('make')).toBeDefined();
      expect(vehicleInfo?.get('model')).toBeDefined();
      expect(vehicleInfo?.get('year')).toBeDefined();
      expect(vehicleInfo?.get('vin')).toBeDefined();
      expect(vehicleInfo?.get('mileage')).toBeDefined();
      expect(vehicleInfo?.get('value')).toBeDefined();
    });

    it('should validate vehicle VIN format', () => {
      fixture.componentRef.setInput('loanType', 'auto');
      fixture.detectChanges();

      const vinControl = component.loanForm.get('vehicleInfo.vin');
      vinControl?.setValue('123');
      expect(vinControl?.hasError('pattern')).toBe(true);

      vinControl?.setValue('1HGBH41JXMN109186');
      expect(vinControl?.valid).toBe(true);
    });

    it('should validate vehicle year range', () => {
      fixture.componentRef.setInput('loanType', 'auto');
      fixture.detectChanges();

      const yearControl = component.loanForm.get('vehicleInfo.year');
      yearControl?.setValue(1800);
      expect(yearControl?.hasError('min')).toBe(true);

      yearControl?.setValue(component.currentYear() + 2);
      expect(yearControl?.hasError('max')).toBe(true);

      yearControl?.setValue(2020);
      expect(yearControl?.valid).toBe(true);
    });

    it('should include downPayment field for mortgage loans', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      expect(component.hasField('downPayment')).toBe(true);
      expect(component.loanForm.get('downPayment')).toBeDefined();
    });

    it('should include downPayment field for auto loans', () => {
      fixture.componentRef.setInput('loanType', 'auto');
      fixture.detectChanges();

      expect(component.hasField('downPayment')).toBe(true);
      expect(component.loanForm.get('downPayment')).toBeDefined();
    });
  });

  describe('Form Population with Initial Data', () => {
    it('should populate form with initial data', () => {
      const initialData: Partial<Loan> = {
        id: 'loan-123',
        type: 'personal',
        termMonths: 36,
        status: 'draft',
      };

      fixture.componentRef.setInput('loanType', 'personal');
      fixture.componentRef.setInput('initialData', initialData);
      fixture.detectChanges();

      expect(component.loanForm.get('type')?.value).toBe('personal');
      expect(component.loanForm.get('termMonths')?.value).toBe(36);
    });

    it('should populate applicant data from initial data', () => {
      const initialData: Partial<Loan> = {
        applicant: {
          id: 'applicant-1',
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01',
          ssn: '123-45-6789',
          income: 60000,
          employmentStatus: 'full-time',
          creditScore: 720,
        },
      };

      fixture.componentRef.setInput('initialData', initialData);
      fixture.detectChanges();

      expect(component.loanForm.get('applicant.fullName')?.value).toBe('John Doe');
      expect(component.loanForm.get('applicant.income')?.value).toBe(60000);
      expect(component.loanForm.get('applicant.creditScore')?.value).toBe(720);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should emit formSubmitted event when form is valid', () => {
      const emitSpy = vi.fn();
      component.formSubmitted.subscribe(emitSpy);

      // Fill required fields
      component.loanForm.patchValue({
        amount: { requested: 10000, currency: 'USD' },
        termMonths: 36,
        applicant: {
          id: 'applicant-1',
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01',
          ssn: '123-45-6789',
          income: 50000,
          employmentStatus: 'full-time',
          creditScore: 700,
        },
        purpose: 'Home improvement',
      });

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalled();
      const emittedLoan = emitSpy.mock.calls[0][0] as Loan;
      expect(emittedLoan.id).toBeDefined();
      expect(emittedLoan.status).toBe('draft');
      expect(emittedLoan.submittedAt).toBeDefined();
    });

    it('should not emit formSubmitted when form is invalid', () => {
      const emitSpy = vi.fn();
      component.formSubmitted.subscribe(emitSpy);

      component.onSubmit();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.onSubmit();

      expect(component.loanForm.get('amount.requested')?.touched).toBe(true);
      expect(component.loanForm.get('termMonths')?.touched).toBe(true);
      expect(component.loanForm.get('applicant.fullName')?.touched).toBe(true);
    });

    it('should preserve existing loan id when updating', () => {
      const initialData: Partial<Loan> = {
        id: 'existing-loan-123',
        status: 'pending',
      };

      fixture.componentRef.setInput('initialData', initialData);
      fixture.detectChanges();

      const emitSpy = vi.fn();
      component.formSubmitted.subscribe(emitSpy);

      // Fill required fields
      component.loanForm.patchValue({
        amount: { requested: 10000, currency: 'USD' },
        termMonths: 36,
        applicant: {
          id: 'applicant-1',
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01',
          ssn: '123-45-6789',
          income: 50000,
          employmentStatus: 'full-time',
        },
        purpose: 'Home improvement',
      });

      component.onSubmit();

      const emittedLoan = emitSpy.mock.calls[0][0] as Loan;
      expect(emittedLoan.id).toBe('existing-loan-123');
      expect(emittedLoan.status).toBe('pending');
    });
  });

  describe('Save Draft', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should emit formSaved event with form data', () => {
      const emitSpy = vi.fn();
      component.formSaved.subscribe(emitSpy);

      component.loanForm.patchValue({
        amount: { requested: 15000 },
        termMonths: 48,
      });

      component.onSaveDraft();

      expect(emitSpy).toHaveBeenCalled();
      const savedData = emitSpy.mock.calls[0][0];
      expect(savedData.termMonths).toBe(48);
    });

    it('should save draft even when form is invalid', () => {
      const emitSpy = vi.fn();
      component.formSaved.subscribe(emitSpy);

      component.onSaveDraft();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('Helper Methods', () => {
    it('should return correct field error for required field', () => {
      fixture.detectChanges();
      const control = component.loanForm.get('applicant.fullName');
      control?.markAsTouched();

      const error = component.getFieldError('applicant.fullName');
      expect(error).toBe('This field is required');
    });

    it('should return correct field error for min value', () => {
      fixture.detectChanges();
      const control = component.loanForm.get('amount.requested');
      control?.setValue(100);
      control?.markAsTouched();

      const error = component.getFieldError('amount.requested');
      expect(error).toContain('Minimum value is');
    });

    it('should return correct field error for max value', () => {
      fixture.detectChanges();
      const control = component.loanForm.get('amount.requested');
      control?.setValue(100000);
      control?.markAsTouched();

      const error = component.getFieldError('amount.requested');
      expect(error).toContain('Maximum value is');
    });

    it('should return correct field error for pattern validation', () => {
      fixture.detectChanges();
      const control = component.loanForm.get('applicant.ssn');
      control?.setValue('invalid-ssn');
      control?.markAsTouched();

      const error = component.getFieldError('applicant.ssn');
      expect(error).toBe('Invalid format');
    });

    it('should return null when field has no errors', () => {
      fixture.detectChanges();
      const control = component.loanForm.get('applicant.fullName');
      control?.setValue('John Doe');
      control?.markAsTouched();

      const error = component.getFieldError('applicant.fullName');
      expect(error).toBeNull();
    });

    it('should return null when field is not touched', () => {
      fixture.detectChanges();
      const control = component.loanForm.get('applicant.fullName');

      const error = component.getFieldError('applicant.fullName');
      expect(error).toBeNull();
    });

    it('should check if field exists for loan type', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      expect(component.hasField('purpose')).toBe(true);
      expect(component.hasField('coSigner')).toBe(false);
      expect(component.hasField('vehicleInfo')).toBe(false);
      expect(component.hasField('propertyAddress')).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should compute config based on loan type', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      const config = component.config();
      expect(config.minAmount).toBe(1000);
      expect(config.maxAmount).toBe(50000);
      expect(config.maxTermMonths).toBe(84);
    });

    it('should return current year', () => {
      fixture.detectChanges();
      expect(component.currentYear()).toBe(new Date().getFullYear());
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete personal loan workflow', () => {
      fixture.componentRef.setInput('loanType', 'personal');
      fixture.detectChanges();

      const formSubmittedSpy = vi.fn();
      component.formSubmitted.subscribe(formSubmittedSpy);

      // Fill complete form
      component.loanForm.patchValue({
        amount: { requested: 25000, currency: 'USD' },
        termMonths: 60,
        applicant: {
          id: 'applicant-1',
          fullName: 'Jane Smith',
          dateOfBirth: '1985-05-15',
          ssn: '987-65-4321',
          income: 75000,
          employmentStatus: 'full-time',
          creditScore: 750,
        },
        purpose: 'Debt consolidation',
      });

      expect(component.loanForm.valid).toBe(true);
      component.onSubmit();

      expect(formSubmittedSpy).toHaveBeenCalled();
      const loan = formSubmittedSpy.mock.calls[0][0];
      expect(loan.type).toBe('personal');
    });

    it('should handle complete mortgage loan workflow', () => {
      fixture.componentRef.setInput('loanType', 'mortgage');
      fixture.detectChanges();

      component.loanForm.patchValue({
        amount: { requested: 300000, currency: 'USD' },
        termMonths: 360,
        applicant: {
          id: 'applicant-1',
          fullName: 'Bob Johnson',
          dateOfBirth: '1980-03-20',
          ssn: '555-12-3456',
          income: 120000,
          employmentStatus: 'full-time',
          creditScore: 780,
        },
        downPayment: 60000,
        propertyAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          propertyValue: 350000,
        },
      });

      expect(component.loanForm.valid).toBe(true);
    });

    it('should handle complete auto loan workflow', () => {
      fixture.componentRef.setInput('loanType', 'auto');
      fixture.detectChanges();

      component.loanForm.patchValue({
        amount: { requested: 35000, currency: 'USD' },
        termMonths: 72,
        applicant: {
          id: 'applicant-1',
          fullName: 'Alice Williams',
          dateOfBirth: '1992-08-10',
          ssn: '444-55-6666',
          income: 65000,
          employmentStatus: 'full-time',
          creditScore: 720,
        },
        downPayment: 5000,
        vehicleInfo: {
          make: 'Toyota',
          model: 'Camry',
          year: 2024,
          vin: '4T1BF1FK5CU123456',
          mileage: 0,
          value: 35000,
        },
      });

      expect(component.loanForm.valid).toBe(true);
    });
  });
});
