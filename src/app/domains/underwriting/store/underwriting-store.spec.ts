import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { UnderwritingStore } from './underwriting-store';
import { LoanApiService } from '../../loan-application/services/loan-api.service';
import { RiskScoring } from '../services/risk-scoring';
import { Loan } from '../../loan-application/models/loan';
import { RiskProfile } from '../models/risk-profile';

describe('UnderwritingStore', () => {
  let store: UnderwritingStore;
  let mockLoanApiService: any;
  let mockRiskScoringService: any;

  const mockLoans: Loan[] = [
    {
      id: 'loan-1',
      type: 'personal',
      requestedAmount: 10000,
      currency: 'USD',
      termMonths: 36,
      applicant: {
        id: 'applicant-1',
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        ssn: '123-45-6789',
        income: 50000,
        employmentStatus: 'full-time',
        creditScore: 720,
      },
      status: 'pending',
      submittedAt: '2024-03-01T10:00:00Z',
    },
    {
      id: 'loan-2',
      type: 'mortgage',
      requestedAmount: 300000,
      currency: 'USD',
      termMonths: 360,
      applicant: {
        id: 'applicant-2',
        fullName: 'Jane Smith',
        dateOfBirth: '1985-05-15',
        ssn: '987-65-4321',
        income: 120000,
        employmentStatus: 'full-time',
        creditScore: 780,
      },
      status: 'approved',
      submittedAt: '2024-02-15T14:30:00Z',
    },
    {
      id: 'loan-3',
      type: 'auto',
      requestedAmount: 25000,
      currency: 'USD',
      termMonths: 60,
      applicant: {
        id: 'applicant-3',
        fullName: 'Bob Johnson',
        dateOfBirth: '1992-08-20',
        ssn: '555-12-3456',
        income: 65000,
        employmentStatus: 'full-time',
        creditScore: 700,
      },
      status: 'rejected',
      submittedAt: '2024-03-10T09:15:00Z',
    },
    {
      id: 'loan-4',
      type: 'personal',
      requestedAmount: 15000,
      currency: 'USD',
      termMonths: 48,
      applicant: {
        id: 'applicant-4',
        fullName: 'Alice Williams',
        dateOfBirth: '1988-12-10',
        ssn: '444-55-6666',
        income: 55000,
        employmentStatus: 'full-time',
        creditScore: 690,
      },
      status: 'pending',
      submittedAt: '2024-03-15T11:00:00Z',
    },
  ];

  const mockRiskProfile: RiskProfile = {
    score: 100,
    flags: [],
    riskLevel: 'low',
    explanation: [],
  };

  beforeEach(() => {
    mockLoanApiService = {
      getLoans: vi.fn().mockReturnValue(of(mockLoans)),
    };

    mockRiskScoringService = {
      evaluate: vi.fn().mockReturnValue(mockRiskProfile),
    };

    TestBed.configureTestingModule({
      providers: [
        UnderwritingStore,
        { provide: LoanApiService, useValue: mockLoanApiService },
        { provide: RiskScoring, useValue: mockRiskScoringService },
      ],
    });

    store = TestBed.inject(UnderwritingStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Store Initialization', () => {
    it('should create the store', () => {
      expect(store).toBeTruthy();
    });

    it('should load submitted loans on initialization', () => {
      expect(mockLoanApiService.getLoans).toHaveBeenCalled();
      expect(store.queue()).toEqual(mockLoans);
    });

    it('should initialize with correct default state', () => {
      expect(store.loading()).toBe(false);
      expect(store.selectedLoanId()).toBeNull();
      expect(store.sortOrder()).toBe('asc');
      expect(store.submittedLoanCount()).toBe(mockLoans.length);
    });
  });

  describe('Computed Selectors', () => {
    it('should have all computed signals defined', () => {
      expect(store.loading()).toBeDefined();
      expect(store.queue()).toBeDefined();
      expect(store.selectedLoanId()).toBeDefined();
      expect(store.sortOrder()).toBeDefined();
      expect(store.submittedLoanCount()).toBeDefined();
    });

    it('should return correct queue of loans', () => {
      expect(store.queue()).toEqual(mockLoans);
      expect(store.queue().length).toBe(4);
    });

    it('should return correct submitted loan count', () => {
      expect(store.submittedLoanCount()).toBe(4);
    });

    it('should return correct sort order', () => {
      expect(store.sortOrder()).toBe('asc');
    });

    it('should return null for selected loan ID initially', () => {
      expect(store.selectedLoanId()).toBeNull();
    });
  });

  describe('queueWithRisk', () => {
    it('should enrich loans with risk profiles', () => {
      const queueWithRisk = store.queueWithRisk();

      expect(queueWithRisk.length).toBe(mockLoans.length);
      expect(queueWithRisk[0]).toHaveProperty('riskProfile');
    });

    it('should call risk scoring service for each loan', () => {
      const queueWithRisk = store.queueWithRisk();

      expect(mockRiskScoringService.evaluate).toHaveBeenCalledTimes(mockLoans.length);
    });

    it('should attach correct risk profile to each loan', () => {
      const queueWithRisk = store.queueWithRisk();

      queueWithRisk.forEach((loan) => {
        expect(loan.riskProfile).toEqual(mockRiskProfile);
      });
    });

    it('should preserve original loan properties', () => {
      const queueWithRisk = store.queueWithRisk();

      expect(queueWithRisk[0].id).toBe(mockLoans[0].id);
      expect(queueWithRisk[0].type).toBe(mockLoans[0].type);
      expect(queueWithRisk[0].applicant).toEqual(mockLoans[0].applicant);
    });

    it('should update when queue changes', () => {
      const newLoans: Loan[] = [mockLoans[0]];
      mockLoanApiService.getLoans.mockReturnValue(of(newLoans));

      store.loadSubmittedLoans();

      const queueWithRisk = store.queueWithRisk();
      expect(queueWithRisk.length).toBe(1);
    });

    it('should handle different risk profiles for different loans', () => {
      const lowRiskProfile: RiskProfile = {
        score: 100,
        flags: [],
        riskLevel: 'low',
        explanation: [],
      };

      const highRiskProfile: RiskProfile = {
        score: 55,
        flags: [
          { type: 'low_income', description: 'Income below $30k' },
          { type: 'poor_credit', description: 'Credit score below 600' },
        ],
        riskLevel: 'high',
        explanation: [
          'Low income reduces repayment confidence',
          'Poor credit history increases default risk',
        ],
      };

      mockRiskScoringService.evaluate
        .mockReturnValueOnce(lowRiskProfile)
        .mockReturnValueOnce(highRiskProfile)
        .mockReturnValueOnce(lowRiskProfile)
        .mockReturnValueOnce(lowRiskProfile);

      const queueWithRisk = store.queueWithRisk();

      expect(queueWithRisk[0].riskProfile).toEqual(lowRiskProfile);
      expect(queueWithRisk[1].riskProfile).toEqual(highRiskProfile);
    });
  });

  describe('loadSubmittedLoans', () => {
    it('should load loans successfully', () => {
      const newLoans: Loan[] = [
        {
          id: 'loan-5',
          type: 'personal',
          requestedAmount: 5000,
          currency: 'USD',
          termMonths: 24,
          applicant: {
            id: 'applicant-5',
            fullName: 'Charlie Brown',
            dateOfBirth: '1995-03-25',
            ssn: '777-88-9999',
            income: 45000,
            employmentStatus: 'full-time',
            creditScore: 680,
          },
          status: 'pending',
          submittedAt: '2024-03-20T12:00:00Z',
        },
      ];

      mockLoanApiService.getLoans.mockReturnValue(of(newLoans));

      store.loadSubmittedLoans();

      expect(mockLoanApiService.getLoans).toHaveBeenCalled();
      expect(store.queue()).toEqual(newLoans);
      expect(store.submittedLoanCount()).toBe(1);
    });

    it('should update submitted loan count when loading loans', () => {
      const newLoans: Loan[] = [mockLoans[0], mockLoans[1]];
      mockLoanApiService.getLoans.mockReturnValue(of(newLoans));

      store.loadSubmittedLoans();

      expect(store.submittedLoanCount()).toBe(2);
    });

    it('should handle empty loan array', () => {
      mockLoanApiService.getLoans.mockReturnValue(of([]));

      store.loadSubmittedLoans();

      expect(store.queue()).toEqual([]);
      expect(store.submittedLoanCount()).toBe(0);
    });

    it('should handle errors gracefully', () => {
      const error = new Error('Network error');
      mockLoanApiService.getLoans.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadSubmittedLoans();

      expect(consoleSpy).toHaveBeenCalledWith('Error loading loans:', error);

      consoleSpy.mockRestore();
    });

    it('should return empty array on error', () => {
      const error = new Error('Network error');
      mockLoanApiService.getLoans.mockReturnValue(throwError(() => error));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const initialQueue = store.queue();
      store.loadSubmittedLoans();

      // Queue should remain unchanged when error occurs
      expect(store.queue()).toEqual(initialQueue);
    });

    it('should be callable multiple times', () => {
      store.loadSubmittedLoans();
      store.loadSubmittedLoans();

      expect(mockLoanApiService.getLoans).toHaveBeenCalledTimes(3); // Including initial call in constructor
    });
  });

  describe('getStatusFrequency', () => {
    it('should calculate status frequency correctly', () => {
      const frequency = store.getStatusFrequency();

      expect(frequency['pending']).toBe(2);
      expect(frequency['approved']).toBe(1);
      expect(frequency['rejected']).toBe(1);
    });

    it('should handle empty queue', () => {
      mockLoanApiService.getLoans.mockReturnValue(of([]));
      store.loadSubmittedLoans();

      const frequency = store.getStatusFrequency();

      expect(Object.keys(frequency).length).toBe(0);
    });

    it('should handle single status', () => {
      const singleStatusLoans: Loan[] = [
        { ...mockLoans[0], status: 'pending' },
        { ...mockLoans[1], status: 'pending' },
        { ...mockLoans[2], status: 'pending' },
      ];

      mockLoanApiService.getLoans.mockReturnValue(of(singleStatusLoans));
      store.loadSubmittedLoans();

      const frequency = store.getStatusFrequency();

      expect(frequency['pending']).toBe(3);
      expect(Object.keys(frequency).length).toBe(1);
    });

    it('should update when queue changes', () => {
      const newLoans: Loan[] = [
        { ...mockLoans[0], status: 'approved' },
        { ...mockLoans[1], status: 'approved' },
      ];

      mockLoanApiService.getLoans.mockReturnValue(of(newLoans));
      store.loadSubmittedLoans();

      const frequency = store.getStatusFrequency();

      expect(frequency['approved']).toBe(2);
      expect(frequency['pending']).toBeUndefined();
    });

    it('should count all loan statuses', () => {
      const allStatusLoans: Loan[] = [
        { ...mockLoans[0], status: 'pending' },
        { ...mockLoans[1], status: 'approved' },
        { ...mockLoans[2], status: 'rejected' },
        { ...mockLoans[3], status: 'draft' },
      ];

      mockLoanApiService.getLoans.mockReturnValue(of(allStatusLoans));
      store.loadSubmittedLoans();

      const frequency = store.getStatusFrequency();

      expect(frequency['pending']).toBe(1);
      expect(frequency['approved']).toBe(1);
      expect(frequency['rejected']).toBe(1);
      expect(frequency['draft']).toBe(1);
    });

    it('should handle multiple loans with same status', () => {
      const multipleLoans: Loan[] = Array(10).fill({ ...mockLoans[0], status: 'pending' });

      mockLoanApiService.getLoans.mockReturnValue(of(multipleLoans));
      store.loadSubmittedLoans();

      const frequency = store.getStatusFrequency();

      expect(frequency['pending']).toBe(10);
    });
  });

  describe('evaluateLoanRisk', () => {
    it('should evaluate risk for a given loan', () => {
      const loan = mockLoans[0];
      const result = store.evaluateLoanRisk(loan);

      expect(mockRiskScoringService.evaluate).toHaveBeenCalledWith(loan);
      expect(result).toEqual(mockRiskProfile);
    });

    it('should return different risk profiles for different loans', () => {
      const lowRiskProfile: RiskProfile = {
        score: 100,
        flags: [],
        riskLevel: 'low',
        explanation: [],
      };

      const highRiskProfile: RiskProfile = {
        score: 55,
        flags: [{ type: 'low_income', description: 'Income below $30k' }],
        riskLevel: 'high',
        explanation: ['Low income reduces repayment confidence'],
      };

      mockRiskScoringService.evaluate
        .mockReturnValueOnce(lowRiskProfile)
        .mockReturnValueOnce(highRiskProfile);

      const result1 = store.evaluateLoanRisk(mockLoans[0]);
      const result2 = store.evaluateLoanRisk(mockLoans[1]);

      expect(result1).toEqual(lowRiskProfile);
      expect(result2).toEqual(highRiskProfile);
    });

    it('should work for any loan type', () => {
      const personalLoan = { ...mockLoans[0], type: 'personal' as const };
      const mortgageLoan = { ...mockLoans[1], type: 'mortgage' as const };
      const autoLoan = { ...mockLoans[2], type: 'auto' as const };

      store.evaluateLoanRisk(personalLoan);
      store.evaluateLoanRisk(mortgageLoan);
      store.evaluateLoanRisk(autoLoan);

      expect(mockRiskScoringService.evaluate).toHaveBeenCalledTimes(3);
    });

    it('should handle loans with missing optional data', () => {
      const loanWithoutCreditScore: Loan = {
        ...mockLoans[0],
        applicant: {
          ...mockLoans[0].applicant,
          creditScore: undefined,
        },
      };

      const result = store.evaluateLoanRisk(loanWithoutCreditScore);

      expect(mockRiskScoringService.evaluate).toHaveBeenCalledWith(loanWithoutCreditScore);
      expect(result).toBeDefined();
    });
  });

  describe('State Immutability', () => {
    it('should not mutate state when updating', () => {
      const originalState = store.state();

      mockLoanApiService.getLoans.mockReturnValue(of([mockLoans[0]]));
      store.loadSubmittedLoans();

      const newState = store.state();
      expect(newState).not.toBe(originalState);
    });

    it('should create new state object on loan load', () => {
      const originalQueue = store.queue();

      mockLoanApiService.getLoans.mockReturnValue(of([mockLoans[0]]));
      store.loadSubmittedLoans();

      const newQueue = store.queue();
      expect(newQueue).not.toBe(originalQueue);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow of loading and evaluating loans', () => {
      // Load loans
      expect(store.queue().length).toBe(4);

      // Get frequency
      const frequency = store.getStatusFrequency();
      expect(frequency['pending']).toBe(2);

      // Get queue with risk
      const queueWithRisk = store.queueWithRisk();
      expect(queueWithRisk.length).toBe(4);
      expect(queueWithRisk[0].riskProfile).toBeDefined();

      // Evaluate individual loan
      const riskProfile = store.evaluateLoanRisk(mockLoans[0]);
      expect(riskProfile).toBeDefined();
    });

    it('should handle reloading loans and updating all computed values', () => {
      // Initial state
      expect(store.submittedLoanCount()).toBe(4);

      // Reload with different data
      const newLoans: Loan[] = [mockLoans[0], mockLoans[1]];
      mockLoanApiService.getLoans.mockReturnValue(of(newLoans));
      store.loadSubmittedLoans();

      // Verify updates
      expect(store.submittedLoanCount()).toBe(2);
      expect(store.queue().length).toBe(2);
      expect(store.queueWithRisk().length).toBe(2);

      const frequency = store.getStatusFrequency();
      expect(Object.keys(frequency).length).toBeGreaterThan(0);
    });

    it('should handle error recovery workflow', () => {
      const initialQueue = store.queue();

      // Simulate error
      const error = new Error('Network error');
      mockLoanApiService.getLoans.mockReturnValue(throwError(() => error));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadSubmittedLoans();

      // Queue should remain unchanged
      expect(store.queue()).toEqual(initialQueue);

      // Retry with success
      mockLoanApiService.getLoans.mockReturnValue(of(mockLoans));
      store.loadSubmittedLoans();

      expect(store.queue()).toEqual(mockLoans);
    });
  });
});
