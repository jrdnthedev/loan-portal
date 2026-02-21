import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { vi } from 'vitest';
import { Dashboard } from './dashboard';
import { LoanApplicationStore } from '../../../domains/loan-application/store/loan-application.store';
import { AdminStore } from '../../../domains/admin/store/admin.store';
import { Loan } from '../../../domains/loan-application/models/loan';
import { User } from '../../../domains/admin/models/user';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let mockLoanStore: any;
  let mockAdminStore: any;

  const mockLoans: Loan[] = [
    {
      id: 'loan-001',
      type: 'personal',
      requestedAmount: 25000,
      termMonths: 36,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: 'full-time',
      },
      status: 'pending',
      submittedAt: '2024-10-01T10:30:00Z',
    },
    {
      id: 'loan-002',
      type: 'auto',
      requestedAmount: 30000,
      termMonths: 48,
      applicant: {
        id: 'applicant-002',
        fullName: 'Jane Smith',
        dateOfBirth: '1990-03-22',
        ssn: '***-**-5678',
        income: 65000,
        employmentStatus: 'full-time',
      },
      status: 'pending',
      submittedAt: '2024-10-02T14:20:00Z',
    },
    {
      id: 'loan-003',
      type: 'mortgage',
      requestedAmount: 250000,
      termMonths: 360,
      applicant: {
        id: 'applicant-003',
        fullName: 'Bob Johnson',
        dateOfBirth: '1988-07-10',
        ssn: '***-**-9012',
        income: 95000,
        employmentStatus: 'full-time',
      },
      status: 'pending',
      submittedAt: '2024-10-03T09:15:00Z',
    },
  ];

  const mockUsers: User[] = [
    {
      id: 'user-001',
      firstName: 'officer1',
      email: 'officer1@example.com',
      lastName: 'Alice Officer',
      role: 'loan-officer',
      phone: '',
    },
    {
      id: 'user-002',
      firstName: 'officer2',
      email: 'officer2@example.com',
      lastName: 'Bob Officer',
      role: 'loan-officer',
      phone: '',
    },
  ];

  beforeEach(async () => {
    // Create mock for LoanApplicationStore
    mockLoanStore = {
      isLoading: signal(false),
      getFilteredLoans: vi.fn().mockReturnValue(mockLoans),
    };

    // Create mock for AdminStore
    mockAdminStore = {
      isLoading: signal(false),
      filteredUsers: signal(mockUsers),
      filterUsersByType: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: LoanApplicationStore, useValue: mockLoanStore },
        { provide: AdminStore, useValue: mockAdminStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    // Don't call detectChanges() here - let individual tests control when to render
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject required stores', () => {
    expect(component['loanStore']).toBe(mockLoanStore);
    expect(component['adminStore']).toBe(mockAdminStore);
  });

  it('should expose isLoadingLoans from loan store', () => {
    expect(component.isLoadingLoans).toBe(mockLoanStore.isLoading);
  });

  it('should expose isLoadingUsers from admin store', () => {
    expect(component.isLoadingUsers).toBe(mockAdminStore.isLoading);
  });

  it('should expose filteredUsers from admin store', () => {
    expect(component.filteredUsers).toBe(mockAdminStore.filteredUsers);
  });

  describe('recentLoans computed signal', () => {
    it('should call getFilteredLoans with correct parameters', () => {
      const recentLoansValue = component.recentLoans();

      expect(mockLoanStore.getFilteredLoans).toHaveBeenCalledWith({
        status: 'pending',
        limit: 3,
        sortBy: 'date',
        sortOrder: 'desc',
      });
    });

    it('should return the last 3 pending loans', () => {
      const recentLoansValue = component.recentLoans();

      expect(recentLoansValue).toEqual(mockLoans);
      expect(recentLoansValue.length).toBeLessThanOrEqual(3);
    });

    it('should update when getFilteredLoans returns different data', () => {
      const newMockLoans = [mockLoans[0]];
      mockLoanStore.getFilteredLoans.mockReturnValue(newMockLoans);

      const recentLoansValue = component.recentLoans();

      expect(recentLoansValue).toEqual(newMockLoans);
      expect(recentLoansValue.length).toBe(1);
    });
  });

  describe('ngOnInit', () => {
    it('should filter users by loan-officer type', () => {
      component.ngOnInit();

      expect(mockAdminStore.filterUsersByType).toHaveBeenCalledWith('loan-officer');
    });

    it('should call filterUsersByType exactly once', () => {
      component.ngOnInit();

      expect(mockAdminStore.filterUsersByType).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading states', () => {
    it('should reflect loan store loading state', () => {
      mockLoanStore.isLoading.set(true);

      expect(component.isLoadingLoans()).toBe(true);

      mockLoanStore.isLoading.set(false);

      expect(component.isLoadingLoans()).toBe(false);
    });

    it('should reflect admin store loading state', () => {
      mockAdminStore.isLoading.set(true);

      expect(component.isLoadingUsers()).toBe(true);

      mockAdminStore.isLoading.set(false);

      expect(component.isLoadingUsers()).toBe(false);
    });

    it('should handle both stores loading simultaneously', () => {
      mockLoanStore.isLoading.set(true);
      mockAdminStore.isLoading.set(true);

      expect(component.isLoadingLoans()).toBe(true);
      expect(component.isLoadingUsers()).toBe(true);
    });
  });

  describe('integration', () => {
    it('should initialize and filter users on component creation', () => {
      fixture.detectChanges();
      component.ngOnInit();

      expect(mockAdminStore.filterUsersByType).toHaveBeenCalledWith('loan-officer');
      expect(component.filteredUsers()).toEqual(mockUsers);
    });

    it('should handle empty loan list', () => {
      mockLoanStore.getFilteredLoans.mockReturnValue([]);

      const recentLoansValue = component.recentLoans();

      expect(recentLoansValue).toEqual([]);
      expect(recentLoansValue.length).toBe(0);
    });

    it('should handle empty user list', () => {
      mockAdminStore.filteredUsers.set([]);

      expect(component.filteredUsers()).toEqual([]);
    });
  });
});
