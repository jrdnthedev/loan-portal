import { TestBed } from '@angular/core/testing';
import { LoanEligibilityService } from './loan-eligibility-service';
import { Loan } from '../models/loan';
import { LoanType } from '../models/loan-type';
import { EmploymentStatus } from '../models/employment-status';
import { EligibilityResult } from '../models/eligibility-result';

describe('LoanEligibilityService', () => {
  let service: LoanEligibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanEligibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return eligible for valid loan application', () => {
    const validLoan: Loan = {
      id: 'loan-001',
      type: 'personal' as LoanType,
      amount: { requested: 25000 },
      termMonths: 36,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: 'full-time' as EmploymentStatus,
        creditScore: 720,
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    const result: EligibilityResult = service.checkEligibility(validLoan);

    expect(result.isEligible).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('should return ineligible for low income', () => {
    const lowIncomeLoan: Loan = {
      id: 'loan-002',
      type: 'personal' as LoanType,
      amount: { requested: 15000 },
      termMonths: 24,
      applicant: {
        id: 'applicant-002',
        fullName: 'Jane Doe',
        dateOfBirth: '1990-05-10',
        ssn: '***-**-5678',
        income: 20000, // Below 25000 threshold
        employmentStatus: 'part-time' as EmploymentStatus,
        creditScore: 650,
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    const result: EligibilityResult = service.checkEligibility(lowIncomeLoan);

    expect(result.isEligible).toBe(false);
    expect(result.reasons).toContain('Income below minimum threshold');
  });

  it('should return ineligible for unemployed applicant', () => {
    const unemployedLoan: Loan = {
      id: 'loan-003',
      type: 'personal' as LoanType,
      amount: { requested: 15000 },
      termMonths: 24,
      applicant: {
        id: 'applicant-003',
        fullName: 'Bob Smith',
        dateOfBirth: '1988-08-15',
        ssn: '***-**-9999',
        income: 50000,
        employmentStatus: 'unemployed' as EmploymentStatus,
        creditScore: 700,
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    const result: EligibilityResult = service.checkEligibility(unemployedLoan);

    expect(result.isEligible).toBe(false);
    expect(result.reasons).toContain('Applicant must be employed');
  });

  it('should return ineligible for loan amount exceeding limit', () => {
    const highAmountLoan: Loan = {
      id: 'loan-004',
      type: 'personal' as LoanType,
      amount: { requested: 150000 }, // Exceeds 100000 limit
      termMonths: 60,
      applicant: {
        id: 'applicant-004',
        fullName: 'Alice Johnson',
        dateOfBirth: '1985-12-20',
        ssn: '***-**-1111',
        income: 100000,
        employmentStatus: 'full-time' as EmploymentStatus,
        creditScore: 800,
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    const result: EligibilityResult = service.checkEligibility(highAmountLoan);

    expect(result.isEligible).toBe(false);
    expect(result.reasons).toContain('Loan amount exceeds limit');
  });

  it('should return multiple reasons for multiple eligibility failures', () => {
    const ineligibleLoan: Loan = {
      id: 'loan-005',
      type: 'personal' as LoanType,
      amount: { requested: 120000 }, // Exceeds limit
      termMonths: 60,
      applicant: {
        id: 'applicant-005',
        fullName: 'Charlie Brown',
        dateOfBirth: '1992-03-05',
        ssn: '***-**-2222',
        income: 20000, // Below threshold
        employmentStatus: 'unemployed' as EmploymentStatus, // Unemployed
        creditScore: 600,
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    const result: EligibilityResult = service.checkEligibility(ineligibleLoan);

    expect(result.isEligible).toBe(false);
    expect(result.reasons).toHaveSize(3);
    expect(result.reasons).toContain('Income below minimum threshold');
    expect(result.reasons).toContain('Applicant must be employed');
    expect(result.reasons).toContain('Loan amount exceeds limit');
  });

  it('should handle edge case - exactly at income threshold', () => {
    const edgeIncomeLoan: Loan = {
      id: 'loan-006',
      type: 'personal' as LoanType,
      amount: { requested: 30000 },
      termMonths: 36,
      applicant: {
        id: 'applicant-006',
        fullName: 'Dave Wilson',
        dateOfBirth: '1987-11-12',
        ssn: '***-**-3333',
        income: 25000, // Exactly at threshold
        employmentStatus: 'full-time' as EmploymentStatus,
        creditScore: 680,
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    const result: EligibilityResult = service.checkEligibility(edgeIncomeLoan);

    expect(result.isEligible).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('should handle edge case - exactly at loan amount limit', () => {
    const edgeAmountLoan: Loan = {
      id: 'loan-007',
      type: 'personal' as LoanType,
      amount: { requested: 100000 }, // Exactly at limit
      termMonths: 60,
      applicant: {
        id: 'applicant-007',
        fullName: 'Eve Davis',
        dateOfBirth: '1983-04-25',
        ssn: '***-**-4444',
        income: 80000,
        employmentStatus: 'self-employed' as EmploymentStatus,
        creditScore: 750,
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    const result: EligibilityResult = service.checkEligibility(edgeAmountLoan);

    expect(result.isEligible).toBe(true);
    expect(result.reasons).toEqual([]);
  });
});
