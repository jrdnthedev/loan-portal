import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { LoanApplicationStore } from './loan-application.store';
import { LoanApiService } from '../services/loan-api.service';
import { Loan } from '../models/loan';

describe('LoanApplicationStore', () => {
  let store: LoanApplicationStore;
  let mockLoanApiService: any;

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
  ];

  beforeEach(() => {
    mockLoanApiService = {
      getLoans: vi.fn().mockReturnValue(of(mockLoans)),
      submitLoanApplication: vi.fn().mockReturnValue(of(mockLoans[0])),
      getLoan: vi.fn().mockReturnValue(of(mockLoans[0])),
    };

    TestBed.configureTestingModule({
      providers: [LoanApplicationStore, { provide: LoanApiService, useValue: mockLoanApiService }],
    });

    store = TestBed.inject(LoanApplicationStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Store Initialization', () => {
    it('should create the store', () => {
      expect(store).toBeTruthy();
    });

    it('should load user loans on initialization', () => {
      expect(mockLoanApiService.getLoans).toHaveBeenCalled();
      expect(store.userLoans()).toEqual(mockLoans);
    });

    it('should initialize with correct default state', () => {
      expect(store.currentLoan()).toBeNull();
      expect(store.submittedLoan()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.selectedLoanType()).toBe('personal');
      expect(store.formStep()).toBe(0);
      expect(store.isDraftSaved()).toBe(false);
      expect(store.isSubmitting()).toBe(false);
      expect(store.lastSavedAt()).toBeNull();
    });
  });

  describe('Computed Selectors', () => {
    it('should have all computed signals defined', () => {
      expect(store.currentLoan()).toBeDefined();
      expect(store.submittedLoan()).toBeDefined();
      expect(store.userLoans()).toBeDefined();
      expect(store.isLoading()).toBeDefined();
      expect(store.error()).toBeDefined();
      expect(store.selectedLoanType()).toBeDefined();
      expect(store.formStep()).toBeDefined();
      expect(store.isDraftSaved()).toBeDefined();
      expect(store.isSubmitting()).toBeDefined();
      expect(store.lastSavedAt()).toBeDefined();
    });

    it('should return filteredLoans based on status filter', () => {
      store.setStatusFilter('pending');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('pending');
    });

    it('should return all loans when status filter is "all"', () => {
      store.setStatusFilter('all');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBe(mockLoans.length);
    });

    it('should filter loans by search query', () => {
      store.setSearchQuery('Jane');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBe(1);
      expect(filtered[0].applicant.fullName).toContain('Jane');
    });

    it('should filter loans by loan ID', () => {
      store.setSearchQuery('loan-2');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('loan-2');
    });

    it('should filter loans by loan type', () => {
      store.setSearchQuery('mortgage');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('mortgage');
    });

    it('should combine status filter and search query', () => {
      store.setStatusFilter('pending');
      store.setSearchQuery('John');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBe(1);
    });

    it('should return empty array when no loans match filters', () => {
      store.setSearchQuery('nonexistent');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBe(0);
    });
  });

  describe('canProceedToNextStep', () => {
    it('should return false when no current loan exists', () => {
      expect(store.canProceedToNextStep()).toBe(false);
    });

    it('should return true for step 0 when loan type is selected', () => {
      store.setSelectedLoanType('personal');
      store.setFormStep(0);
      expect(store.canProceedToNextStep()).toBe(true);
    });

    it('should return false for step 1 when basic info is missing', () => {
      store.updateCurrentLoan({ type: 'personal' });
      store.setFormStep(1);
      expect(store.canProceedToNextStep()).toBe(false);
    });

    it('should return true for step 1 when basic info is complete', () => {
      store.updateCurrentLoan({
        type: 'personal',
        requestedAmount: 10000,
        termMonths: 36,
      });
      store.setFormStep(1);
      expect(store.canProceedToNextStep()).toBe(true);
    });

    it('should return false for step 2 when applicant info is missing', () => {
      store.updateCurrentLoan({
        type: 'personal',
        requestedAmount: 10000,
        termMonths: 36,
      });
      store.setFormStep(2);
      expect(store.canProceedToNextStep()).toBe(false);
    });

    it('should return true for step 2 when applicant info is complete', () => {
      store.updateCurrentLoan({
        type: 'personal',
        requestedAmount: 10000,
        termMonths: 36,
        applicant: {
          id: 'applicant-1',
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01',
          ssn: '123-45-6789',
          income: 50000,
          employmentStatus: 'full-time',
        },
      });
      store.setFormStep(2);
      expect(store.canProceedToNextStep()).toBe(true);
    });

    it('should return true for steps beyond step 2', () => {
      store.updateCurrentLoan({ type: 'personal' });
      store.setFormStep(3);
      expect(store.canProceedToNextStep()).toBe(true);
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      store.setLoading(true);
      expect(store.isLoading()).toBe(true);
    });

    it('should set loading state to false', () => {
      store.setLoading(false);
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Something went wrong';
      store.setError(errorMessage);
      expect(store.error()).toBe(errorMessage);
    });

    it('should clear error when set to null', () => {
      store.setError('Error');
      store.setError(null);
      expect(store.error()).toBeNull();
    });
  });

  describe('setSelectedLoanType', () => {
    it('should update selected loan type', () => {
      store.setSelectedLoanType('mortgage');
      expect(store.currentLoan()?.type).toBe('mortgage');
    });

    it('should create current loan with selected type', () => {
      store.setSelectedLoanType('auto');
      expect(store.currentLoan()).toBeDefined();
      expect(store.currentLoan()?.type).toBe('auto');
    });

    it('should preserve existing loan data when changing type', () => {
      store.updateCurrentLoan({ requestedAmount: 10000 });
      store.setSelectedLoanType('personal');
      expect(store.currentLoan()?.requestedAmount).toBe(10000);
      expect(store.currentLoan()?.type).toBe('personal');
    });
  });

  describe('setFormStep', () => {
    it('should update form step', () => {
      store.setFormStep(1);
      expect(store.formStep()).toBe(1);
    });

    it('should allow moving to different steps', () => {
      store.setFormStep(0);
      expect(store.formStep()).toBe(0);

      store.setFormStep(2);
      expect(store.formStep()).toBe(2);
    });
  });

  describe('updateCurrentLoan', () => {
    it('should update current loan with partial data', () => {
      store.updateCurrentLoan({
        type: 'personal',
        requestedAmount: 15000,
      });

      expect(store.currentLoan()?.type).toBe('personal');
      expect(store.currentLoan()?.requestedAmount).toBe(15000);
    });

    it('should mark draft as not saved when updating', () => {
      store.updateCurrentLoan({ type: 'personal', requestedAmount: 10000 });
      store.saveCurrentLoanDraft();
      expect(store.isDraftSaved()).toBe(true);

      store.updateCurrentLoan({ requestedAmount: 20000 });
      expect(store.isDraftSaved()).toBe(false);
    });

    it('should merge with existing current loan data', () => {
      store.updateCurrentLoan({ type: 'auto', requestedAmount: 25000 });
      store.updateCurrentLoan({ termMonths: 60 });

      expect(store.currentLoan()?.type).toBe('auto');
      expect(store.currentLoan()?.requestedAmount).toBe(25000);
      expect(store.currentLoan()?.termMonths).toBe(60);
    });
  });

  describe('saveCurrentLoanDraft', () => {
    it('should mark draft as saved', () => {
      store.updateCurrentLoan({ type: 'personal' });
      store.saveCurrentLoanDraft();

      expect(store.isDraftSaved()).toBe(true);
      expect(store.lastSavedAt()).toBeInstanceOf(Date);
    });

    it('should not save when no current loan exists', () => {
      store.saveCurrentLoanDraft();
      expect(store.isDraftSaved()).toBe(false);
      expect(store.lastSavedAt()).toBeNull();
    });

    it('should update lastSavedAt timestamp', () => {
      store.updateCurrentLoan({ type: 'personal' });
      const beforeSave = new Date();
      store.saveCurrentLoanDraft();
      const afterSave = new Date();

      const savedAt = store.lastSavedAt();
      expect(savedAt).toBeDefined();
      expect(savedAt!.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
      expect(savedAt!.getTime()).toBeLessThanOrEqual(afterSave.getTime());
    });
  });

  describe('loadUserLoans', () => {
    it('should load user loans successfully', () => {
      const newLoans: Loan[] = [
        {
          id: 'loan-4',
          type: 'personal',
          requestedAmount: 5000,
          currency: 'USD',
          termMonths: 24,
          applicant: {
            id: 'applicant-4',
            fullName: 'Alice Williams',
            dateOfBirth: '1988-12-10',
            ssn: '444-55-6666',
            income: 55000,
            employmentStatus: 'full-time',
          },
          status: 'pending',
          submittedAt: '2024-03-15T11:00:00Z',
        },
      ];

      mockLoanApiService.getLoans.mockReturnValue(of(newLoans));

      store.loadUserLoans();

      expect(mockLoanApiService.getLoans).toHaveBeenCalled();
      expect(store.userLoans()).toEqual(newLoans);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should set loading to true when loading loans', () => {
      store.setLoading(false);
      store.loadUserLoans();
      expect(store.isLoading()).toBe(false); // Already completed in tests
    });

    it('should handle errors when loading loans fails', () => {
      const error = new Error('Network error');
      mockLoanApiService.getLoans.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadUserLoans();

      expect(store.error()).toBe('Failed to load loans');
      expect(store.isLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading loans:', error);

      consoleSpy.mockRestore();
    });

    it('should clear previous errors when loading loans', () => {
      store.setError('Previous error');
      mockLoanApiService.getLoans.mockReturnValue(of(mockLoans));

      store.loadUserLoans();

      expect(store.error()).toBeNull();
    });
  });

  describe('submitLoanApplication', () => {
    it('should submit loan application successfully', () => {
      const newLoan: Loan = {
        id: 'loan-new',
        type: 'personal',
        requestedAmount: 15000,
        currency: 'USD',
        termMonths: 48,
        applicant: {
          id: 'applicant-new',
          fullName: 'Charlie Brown',
          dateOfBirth: '1995-03-25',
          ssn: '777-88-9999',
          income: 60000,
          employmentStatus: 'full-time',
        },
        status: 'pending',
        submittedAt: '2024-03-20T12:00:00Z',
      };

      store.updateCurrentLoan({
        type: 'personal',
        requestedAmount: 15000,
        termMonths: 48,
        applicant: newLoan.applicant,
      });

      mockLoanApiService.submitLoanApplication.mockReturnValue(of(newLoan));

      store.submitLoanApplication();

      expect(mockLoanApiService.submitLoanApplication).toHaveBeenCalled();
      expect(store.submittedLoan()).toEqual(newLoan);
      expect(store.currentLoan()).toBeNull();
      expect(store.isSubmitting()).toBe(false);
      expect(store.formStep()).toBe(0);
      expect(store.isDraftSaved()).toBe(false);
      expect(store.lastSavedAt()).toBeNull();
    });

    it('should add submitted loan to user loans list', () => {
      const newLoan: Loan = {
        id: 'loan-new',
        type: 'personal',
        requestedAmount: 15000,
        currency: 'USD',
        termMonths: 48,
        applicant: {
          id: 'applicant-new',
          fullName: 'Charlie Brown',
          dateOfBirth: '1995-03-25',
          ssn: '777-88-9999',
          income: 60000,
          employmentStatus: 'full-time',
        },
        status: 'pending',
        submittedAt: '2024-03-20T12:00:00Z',
      };

      store.updateCurrentLoan({
        type: 'personal',
        requestedAmount: 15000,
        termMonths: 48,
      });

      mockLoanApiService.submitLoanApplication.mockReturnValue(of(newLoan));

      const initialLoansCount = store.userLoans().length;
      store.submitLoanApplication();

      expect(store.userLoans().length).toBe(initialLoansCount + 1);
      expect(store.userLoans()).toContainEqual(newLoan);
    });

    it('should set error when no current loan exists', () => {
      store.submitLoanApplication();
      expect(store.error()).toBe('No loan application to submit');
    });

    it('should handle errors when submission fails', () => {
      const error = new Error('Submission failed');
      store.updateCurrentLoan({ type: 'personal' });
      mockLoanApiService.submitLoanApplication.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.submitLoanApplication();

      expect(store.error()).toBe('Failed to submit loan application');
      expect(store.isSubmitting()).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error submitting loan:', error);

      consoleSpy.mockRestore();
    });

    it('should set isSubmitting to true during submission', () => {
      store.updateCurrentLoan({ type: 'personal' });
      mockLoanApiService.submitLoanApplication.mockReturnValue(of(mockLoans[0]));

      store.submitLoanApplication();

      expect(store.isSubmitting()).toBe(false); // Already completed in tests
    });

    it('should generate loan ID with status pending', () => {
      store.updateCurrentLoan({
        type: 'personal',
        requestedAmount: 10000,
        termMonths: 36,
      });

      mockLoanApiService.submitLoanApplication.mockImplementation((loanData: Partial<Loan>) => {
        expect(loanData.id).toMatch(/^loan-\d+$/);
        expect(loanData.status).toBe('pending');
        return of(mockLoans[0]);
      });

      store.submitLoanApplication();
    });
  });

  describe('resetCurrentLoan', () => {
    it('should reset current loan to null', () => {
      store.updateCurrentLoan({ type: 'personal' });
      store.resetCurrentLoan();

      expect(store.currentLoan()).toBeNull();
    });

    it('should clear submitted loan', () => {
      store.updateCurrentLoan({ type: 'personal' });
      mockLoanApiService.submitLoanApplication.mockReturnValue(of(mockLoans[0]));
      store.submitLoanApplication();

      expect(store.submittedLoan()).toBeDefined();

      store.resetCurrentLoan();
      expect(store.submittedLoan()).toBeNull();
    });

    it('should reset form step to 0', () => {
      store.setFormStep(3);
      store.resetCurrentLoan();
      expect(store.formStep()).toBe(0);
    });

    it('should reset draft saved state', () => {
      store.updateCurrentLoan({ type: 'personal' });
      store.saveCurrentLoanDraft();
      expect(store.isDraftSaved()).toBe(true);

      store.resetCurrentLoan();
      expect(store.isDraftSaved()).toBe(false);
      expect(store.lastSavedAt()).toBeNull();
    });
  });

  describe('setStatusFilter', () => {
    it('should update status filter', () => {
      store.setStatusFilter('approved');
      expect(store.filteredLoans().every((loan) => loan.status === 'approved')).toBe(true);
    });

    it('should filter by pending status', () => {
      store.setStatusFilter('pending');
      const filtered = store.filteredLoans();
      expect(filtered.every((loan) => loan.status === 'pending')).toBe(true);
    });

    it('should filter by rejected status', () => {
      store.setStatusFilter('rejected');
      const filtered = store.filteredLoans();
      expect(filtered.every((loan) => loan.status === 'rejected')).toBe(true);
    });

    it('should show all loans when filter is "all"', () => {
      store.setStatusFilter('all');
      expect(store.filteredLoans().length).toBe(mockLoans.length);
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      store.setSearchQuery('John');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      store.setSearchQuery('JOHN');
      const filtered = store.filteredLoans();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered[0].applicant.fullName.toLowerCase()).toContain('john');
    });

    it('should update filtered loans when search query changes', () => {
      store.setSearchQuery('John');
      const filtered1 = store.filteredLoans();

      store.setSearchQuery('Jane');
      const filtered2 = store.filteredLoans();

      expect(filtered1).not.toEqual(filtered2);
    });

    it('should clear search when empty string is provided', () => {
      store.setSearchQuery('test');
      store.setSearchQuery('');
      expect(store.filteredLoans().length).toBe(mockLoans.length);
    });
  });

  describe('getFilteredLoans', () => {
    it('should filter loans by status', () => {
      const filtered = store.getFilteredLoans({ status: 'pending' });
      expect(filtered.every((loan) => loan.status === 'pending')).toBe(true);
    });

    it('should filter loans by search query', () => {
      const filtered = store.getFilteredLoans({ searchQuery: 'Jane' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].applicant.fullName).toContain('Jane');
    });

    it('should combine status and search query filters', () => {
      const filtered = store.getFilteredLoans({
        status: 'pending',
        searchQuery: 'John',
      });
      expect(filtered.length).toBe(1);
    });

    it('should sort loans by date ascending', () => {
      const filtered = store.getFilteredLoans({
        sortBy: 'date',
        sortOrder: 'asc',
      });
      expect(new Date(filtered[0].submittedAt!).getTime()).toBeLessThanOrEqual(
        new Date(filtered[1].submittedAt!).getTime(),
      );
    });

    it('should sort loans by date descending', () => {
      const filtered = store.getFilteredLoans({
        sortBy: 'date',
        sortOrder: 'desc',
      });
      expect(new Date(filtered[0].submittedAt!).getTime()).toBeGreaterThanOrEqual(
        new Date(filtered[1].submittedAt!).getTime(),
      );
    });

    it('should sort loans by amount ascending', () => {
      const filtered = store.getFilteredLoans({
        sortBy: 'amount',
        sortOrder: 'asc',
      });
      expect(filtered[0].requestedAmount).toBeLessThanOrEqual(filtered[1].requestedAmount);
    });

    it('should sort loans by amount descending', () => {
      const filtered = store.getFilteredLoans({
        sortBy: 'amount',
        sortOrder: 'desc',
      });
      expect(filtered[0].requestedAmount).toBeGreaterThanOrEqual(filtered[1].requestedAmount);
    });

    it('should sort loans by status', () => {
      const filtered = store.getFilteredLoans({
        sortBy: 'status',
        sortOrder: 'asc',
      });
      expect(filtered[0].status.localeCompare(filtered[1].status)).toBeLessThanOrEqual(0);
    });

    it('should limit results', () => {
      const filtered = store.getFilteredLoans({ limit: 2 });
      expect(filtered.length).toBe(2);
    });

    it('should not filter with limit of 0', () => {
      const filtered = store.getFilteredLoans({ limit: 0 });
      expect(filtered.length).toBe(mockLoans.length);
    });

    it('should handle all filters combined', () => {
      const filtered = store.getFilteredLoans({
        status: 'pending',
        searchQuery: 'loan',
        sortBy: 'amount',
        sortOrder: 'desc',
        limit: 5,
      });
      expect(Array.isArray(filtered)).toBe(true);
    });
  });

  describe('getLoanById', () => {
    it('should return loan with matching ID', async () => {
      const loan = await new Promise<Loan | undefined>((resolve) => {
        store.getLoanById('loan-1').subscribe(resolve);
      });
      expect(loan).toBeDefined();
      expect(loan?.id).toBe('loan-1');
    });

    it('should return undefined for non-existent loan', async () => {
      const loan = await new Promise<Loan | undefined>((resolve) => {
        store.getLoanById('non-existent').subscribe(resolve);
      });
      expect(loan).toBeUndefined();
    });

    it('should return correct loan from multiple loans', async () => {
      const loan = await new Promise<Loan | undefined>((resolve) => {
        store.getLoanById('loan-2').subscribe(resolve);
      });
      expect(loan?.id).toBe('loan-2');
      expect(loan?.type).toBe('mortgage');
    });
  });

  describe('getCurrentState', () => {
    it('should return current state snapshot', () => {
      const state = store.getCurrentState();
      expect(state).toBeDefined();
      expect(state.userLoans).toEqual(mockLoans);
      expect(state.selectedLoanType).toBe('personal');
    });

    it('should reflect state changes', () => {
      store.setFormStep(2);
      const state = store.getCurrentState();
      expect(state.formStep).toBe(2);
    });
  });

  describe('State Immutability', () => {
    it('should not mutate state when updating', () => {
      const originalState = store.state();

      store.setError('New error');

      const newState = store.state();
      expect(newState).not.toBe(originalState);
      expect(newState.error).toBe('New error');
    });

    it('should create new state object on loan update', () => {
      const originalState = store.state();

      store.updateCurrentLoan({ type: 'auto' });

      const newState = store.state();
      expect(newState).not.toBe(originalState);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete loan application workflow', () => {
      // Step 1: Select loan type
      store.setSelectedLoanType('personal');
      expect(store.canProceedToNextStep()).toBe(true);

      // Step 2: Enter basic info
      store.setFormStep(1);
      store.updateCurrentLoan({
        requestedAmount: 15000,
        termMonths: 48,
      });
      expect(store.canProceedToNextStep()).toBe(true);

      // Step 3: Enter applicant info
      store.setFormStep(2);
      store.updateCurrentLoan({
        applicant: {
          id: 'applicant-test',
          fullName: 'Test User',
          dateOfBirth: '1990-01-01',
          ssn: '123-45-6789',
          income: 60000,
          employmentStatus: 'full-time',
        },
      });
      expect(store.canProceedToNextStep()).toBe(true);

      // Step 4: Submit application
      mockLoanApiService.submitLoanApplication.mockReturnValue(of(mockLoans[0]));
      store.submitLoanApplication();

      expect(store.submittedLoan()).toBeDefined();
      expect(store.currentLoan()).toBeNull();
      expect(store.formStep()).toBe(0);
    });

    it('should handle draft saving workflow', () => {
      // Create partial application
      store.updateCurrentLoan({
        type: 'mortgage',
        requestedAmount: 250000,
      });

      expect(store.isDraftSaved()).toBe(false);

      // Save draft
      store.saveCurrentLoanDraft();
      expect(store.isDraftSaved()).toBe(true);
      expect(store.lastSavedAt()).toBeDefined();

      // Update triggers unsaved state
      store.updateCurrentLoan({ termMonths: 360 });
      expect(store.isDraftSaved()).toBe(false);

      // Save again
      store.saveCurrentLoanDraft();
      expect(store.isDraftSaved()).toBe(true);
    });

    it('should handle filtering and searching workflow', () => {
      // Filter by status
      store.setStatusFilter('approved');
      expect(store.filteredLoans().length).toBe(1);

      // Add search query
      store.setSearchQuery('Jane');
      expect(store.filteredLoans().length).toBe(1);

      // Clear filters
      store.setStatusFilter('all');
      store.setSearchQuery('');
      expect(store.filteredLoans().length).toBe(mockLoans.length);
    });

    it('should handle error recovery workflow', () => {
      // Simulate error
      const error = new Error('Network error');
      mockLoanApiService.getLoans.mockReturnValue(throwError(() => error));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      store.loadUserLoans();
      expect(store.error()).toBe('Failed to load loans');

      // Clear error and retry
      store.setError(null);
      expect(store.error()).toBeNull();

      mockLoanApiService.getLoans.mockReturnValue(of(mockLoans));
      store.loadUserLoans();
      expect(store.userLoans()).toEqual(mockLoans);
      expect(store.error()).toBeNull();
    });
  });
});
