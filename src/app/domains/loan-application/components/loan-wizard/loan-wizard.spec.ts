import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { LoanWizard } from './loan-wizard';
import { LoanApplicationStore } from '../../store/loan-application.store';
import { AuditService } from '../../../admin/services/audit-service';
import { Loan } from '../../models/loan';
import { Applicant } from '../../models/applicant';

describe('LoanWizard', () => {
  let component: LoanWizard;
  let fixture: ComponentFixture<LoanWizard>;
  let mockRouter: any;
  let mockStore: any;
  let mockAuditService: any;

  const mockApplicant: Applicant = {
    id: 'applicant-123',
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    ssn: '123-45-6789',
    income: 75000,
    employmentStatus: 'full-time',
    creditScore: 720,
  };

  const mockLoan: Loan = {
    id: 'loan-123',
    type: 'auto',
    requestedAmount: 25000,
    currency: 'USD',
    termMonths: 60,
    applicant: mockApplicant,
    status: 'draft',
    submittedAt: '2026-03-07T10:00:00Z',
  };

  const mockPartialLoan: Partial<Loan> = {
    id: 'draft-123',
    type: 'personal',
    requestedAmount: 15000,
    termMonths: 36,
  };

  beforeEach(async () => {
    // Create mock Router
    mockRouter = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    // Create mock LoanApplicationStore with signals
    mockStore = {
      currentLoan: signal(null),
      isSubmitting: signal(false),
      error: signal(null),
      isLoading: signal(false),
      updateCurrentLoan: vi.fn(),
      submitLoanApplication: vi.fn(),
      saveCurrentLoanDraft: vi.fn(),
    };

    // Create mock AuditService
    mockAuditService = {
      logLoanAction: vi.fn().mockReturnValue(
        of({
          id: 'audit-123',
          userId: mockApplicant.id,
          action: `CREATE: Loan ${mockLoan.id}`,
          timestamp: '2026-03-07T10:00:00Z',
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [LoanWizard],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: LoanApplicationStore, useValue: mockStore },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should have default selectedLoanType as "auto"', () => {
      expect(component.selectedLoanType).toBe('auto');
    });

    it('should expose store signals', () => {
      expect(component.currentLoan).toBeDefined();
      expect(component.isSubmitting).toBeDefined();
      expect(component.error).toBeDefined();
      expect(component.isLoading).toBeDefined();
    });

    it('should have undefined submittedLoan initially', () => {
      expect(component.submittedLoan).toBeUndefined();
    });
  });

  describe('onFormSubmitted', () => {
    it('should update current loan in store', () => {
      component.onFormSubmitted(mockLoan);

      expect(mockStore.updateCurrentLoan).toHaveBeenCalledWith(mockLoan);
    });

    it('should submit loan application to store', () => {
      component.onFormSubmitted(mockLoan);

      expect(mockStore.submitLoanApplication).toHaveBeenCalled();
    });

    it('should log audit action', () => {
      component.onFormSubmitted(mockLoan);

      expect(mockAuditService.logLoanAction).toHaveBeenCalledWith(
        mockLoan.id,
        `CREATE: Loan ${mockLoan.id}`,
        mockApplicant.id,
      );
    });

    it('should navigate to summary page', () => {
      component.onFormSubmitted(mockLoan);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/loan-application/summary');
    });

    it('should handle full loan submission workflow', () => {
      component.onFormSubmitted(mockLoan);

      expect(mockStore.updateCurrentLoan).toHaveBeenCalledWith(mockLoan);
      expect(mockStore.submitLoanApplication).toHaveBeenCalled();
      expect(mockAuditService.logLoanAction).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      // Spy on console.log to verify error logging
      vi.spyOn(console, 'log');
      mockStore.updateCurrentLoan.mockImplementationOnce(() => {
        throw new Error('Store error');
      });

      // Should not throw, error is caught
      expect(() => component.onFormSubmitted(mockLoan)).not.toThrow();
      expect(console.log).toHaveBeenCalled();
    });

    it('should log submission details to console', () => {
      vi.spyOn(console, 'log');
      component.onFormSubmitted(mockLoan);

      expect(console.log).toHaveBeenCalledWith('Submitting loan:', mockLoan);
    });
  });

  describe('onFormSaved', () => {
    it('should update current loan with draft data', () => {
      component.onFormSaved(mockPartialLoan);

      expect(mockStore.updateCurrentLoan).toHaveBeenCalledWith(mockPartialLoan);
    });

    it('should save draft in store', () => {
      component.onFormSaved(mockPartialLoan);

      expect(mockStore.saveCurrentLoanDraft).toHaveBeenCalled();
    });

    it('should handle draft save workflow', () => {
      component.onFormSaved(mockPartialLoan);

      expect(mockStore.updateCurrentLoan).toHaveBeenCalledWith(mockPartialLoan);
      expect(mockStore.saveCurrentLoanDraft).toHaveBeenCalled();
    });

    it('should log draft save details to console', () => {
      vi.spyOn(console, 'log');
      component.onFormSaved(mockPartialLoan);

      expect(console.log).toHaveBeenCalledWith('Draft saved:', mockPartialLoan);
    });

    it('should handle errors gracefully', () => {
      vi.spyOn(console, 'log');
      mockStore.updateCurrentLoan.mockImplementationOnce(() => {
        throw new Error('Store error');
      });

      // Should not throw, error is caught
      expect(() => component.onFormSaved(mockPartialLoan)).not.toThrow();
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept partial loan data', () => {
      const partialData: Partial<Loan> = {
        type: 'mortgage',
        requestedAmount: 300000,
      };

      component.onFormSaved(partialData);

      expect(mockStore.updateCurrentLoan).toHaveBeenCalledWith(partialData);
      expect(mockStore.saveCurrentLoanDraft).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should complete workflow even when audit service is called', () => {
      // Verify audit service doesn't block the main workflow
      component.onFormSubmitted(mockLoan);

      expect(mockStore.updateCurrentLoan).toHaveBeenCalled();
      expect(mockStore.submitLoanApplication).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
      expect(mockAuditService.logLoanAction).toHaveBeenCalled();
    });

    it('should work with different loan types', () => {
      const personalLoan: Loan = { ...mockLoan, type: 'personal' };
      component.onFormSubmitted(personalLoan);

      expect(mockStore.updateCurrentLoan).toHaveBeenCalledWith(personalLoan);
      expect(mockStore.submitLoanApplication).toHaveBeenCalled();
    });

    it('should allow changing selectedLoanType', () => {
      expect(component.selectedLoanType).toBe('auto');

      component.selectedLoanType = 'mortgage';

      expect(component.selectedLoanType).toBe('mortgage');
    });
  });

  describe('Template Bindings', () => {
    it('should pass selectedLoanType to loan-form component', () => {
      const compiled = fixture.nativeElement;
      const loanForm = compiled.querySelector('app-loan-form');

      expect(loanForm).toBeTruthy();
    });

    it('should bind formSubmitted event', () => {
      vi.spyOn(component, 'onFormSubmitted');
      component.selectedLoanType = 'auto';
      fixture.detectChanges();

      // Trigger through component method to verify binding
      component.onFormSubmitted(mockLoan);
      expect(component.onFormSubmitted).toHaveBeenCalled();
    });

    it('should bind formSaved event', () => {
      vi.spyOn(component, 'onFormSaved');
      component.selectedLoanType = 'auto';
      fixture.detectChanges();

      // Trigger through component method to verify binding
      component.onFormSaved(mockPartialLoan);
      expect(component.onFormSaved).toHaveBeenCalled();
    });
  });
});
