import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { vi } from 'vitest';

import { ReviewQueue } from './review-queue';
import { UnderwritingStore } from '../../store/underwriting-store';
import { Loan } from '../../../loan-application/models/loan';

describe('ReviewQueue', () => {
  let component: ReviewQueue;
  let fixture: ComponentFixture<ReviewQueue>;
  let mockStore: any;

  const mockLoans: Loan[] = [
    {
      id: '1',
      type: 'personal',
      requestedAmount: 10000,
      termMonths: 12,
      applicant: {
        id: '1',
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        ssn: '123-45-6789',
        income: 50000,
        employmentStatus: 'full-time',
        creditScore: 720,
      },
      status: 'pending',
      submittedAt: '2026-03-01',
    },
    {
      id: '2',
      type: 'mortgage',
      requestedAmount: 200000,
      termMonths: 360,
      applicant: {
        id: '2',
        fullName: 'Jane Smith',
        dateOfBirth: '1985-05-15',
        ssn: '234-56-7890',
        income: 80000,
        employmentStatus: 'full-time',
        creditScore: 750,
      },
      status: 'pending',
      submittedAt: '2026-03-02',
    },
    {
      id: '3',
      type: 'auto',
      requestedAmount: 25000,
      termMonths: 60,
      applicant: {
        id: '3',
        fullName: 'Bob Johnson',
        dateOfBirth: '1988-08-20',
        ssn: '345-67-8901',
        income: 60000,
        employmentStatus: 'self-employed',
        creditScore: 680,
      },
      status: 'approved',
      submittedAt: '2026-03-03',
    },
    {
      id: '4',
      type: 'personal',
      requestedAmount: 5000,
      termMonths: 24,
      applicant: {
        id: '4',
        fullName: 'Alice Williams',
        dateOfBirth: '1992-03-10',
        ssn: '456-78-9012',
        income: 45000,
        employmentStatus: 'part-time',
        creditScore: 700,
      },
      status: 'pending',
      submittedAt: '2026-03-04',
    },
    {
      id: '5',
      type: 'personal',
      requestedAmount: 15000,
      termMonths: 36,
      applicant: {
        id: '5',
        fullName: 'Charlie Brown',
        dateOfBirth: '1980-12-25',
        ssn: '567-89-0123',
        income: 35000,
        employmentStatus: 'unemployed',
        creditScore: 620,
      },
      status: 'rejected',
      submittedAt: '2026-03-05',
    },
  ];

  beforeEach(async () => {
    // Create mock store with signals and computed properties
    const queueSignal = signal(mockLoans);
    const statusFrequencyComputed = computed(() => {
      const loans = queueSignal();
      const frequency: Record<string, number> = {};
      loans.forEach((loan) => {
        const status = loan.status;
        frequency[status] = (frequency[status] || 0) + 1;
      });
      return frequency;
    });

    mockStore = {
      queue: computed(() => queueSignal()),
      submittedLoanCount: computed(() => queueSignal().length),
      getStatusFrequency: statusFrequencyComputed,
      _updateQueue: (loans: Loan[]) => queueSignal.set(loans),
    };

    await TestBed.configureTestingModule({
      imports: [ReviewQueue],
      providers: [
        {
          provide: UnderwritingStore,
          useValue: mockStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewQueue);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Store Integration', () => {
    it('should inject UnderwritingStore', () => {
      expect(component['store']).toBe(mockStore);
    });

    it('should expose loan queue from store', () => {
      expect(component.loanQueue()).toEqual(mockLoans);
    });

    it('should expose submitted loan count from store', () => {
      expect(component.submittedLoanCount()).toBe(5);
    });

    it('should expose status frequency from store', () => {
      const frequency = component.typeFrequency();
      expect(frequency).toEqual({
        pending: 3,
        approved: 1,
        rejected: 1,
      });
    });
  });

  describe('Type Counts Computed', () => {
    it('should transform frequency object into array', () => {
      const typeCounts = component.typeCounts();
      expect(typeCounts).toEqual([
        { type: 'pending', count: 3 },
        { type: 'approved', count: 1 },
        { type: 'rejected', count: 1 },
      ]);
    });

    it('should update when loan queue changes', () => {
      const newLoans: Loan[] = [
        {
          id: '6',
          type: 'auto',
          requestedAmount: 30000,
          termMonths: 48,
          applicant: {
            id: '6',
            fullName: 'David Lee',
            dateOfBirth: '1995-06-30',
            ssn: '678-90-1234',
            income: 70000,
            employmentStatus: 'full-time',
            creditScore: 740,
          },
          status: 'approved',
          submittedAt: '2026-03-06',
        },
        {
          id: '7',
          type: 'mortgage',
          requestedAmount: 300000,
          termMonths: 360,
          applicant: {
            id: '7',
            fullName: 'Eva Garcia',
            dateOfBirth: '1987-09-15',
            ssn: '789-01-2345',
            income: 95000,
            employmentStatus: 'full-time',
            creditScore: 780,
          },
          status: 'approved',
          submittedAt: '2026-03-07',
        },
      ];

      mockStore._updateQueue(newLoans);
      fixture.detectChanges();

      const typeCounts = component.typeCounts();
      expect(typeCounts).toEqual([{ type: 'approved', count: 2 }]);
    });

    it('should handle empty loan queue', () => {
      mockStore._updateQueue([]);
      fixture.detectChanges();

      const typeCounts = component.typeCounts();
      expect(typeCounts).toEqual([]);
    });
  });

  describe('Pagination', () => {
    it('should initialize with page 1', () => {
      expect(component.currentPage()).toBe(1);
    });

    it('should have correct items per page', () => {
      expect(component.itemsPerPage).toBe(4);
    });

    it('should paginate data correctly - first page', () => {
      component.currentPage.set(1);
      const paginatedData = component.paginatedData();
      expect(paginatedData.length).toBe(4);
      expect(paginatedData[0].id).toBe('1');
      expect(paginatedData[3].id).toBe('4');
    });

    it('should paginate data correctly - second page', () => {
      component.currentPage.set(2);
      const paginatedData = component.paginatedData();
      expect(paginatedData.length).toBe(1);
      expect(paginatedData[0].id).toBe('5');
    });

    it('should handle page change', () => {
      component.onPageChange(2);
      expect(component.currentPage()).toBe(2);

      const paginatedData = component.paginatedData();
      expect(paginatedData.length).toBe(1);
      expect(paginatedData[0].id).toBe('5');
    });

    it('should update pagination when queue changes', () => {
      const newLoans = mockLoans.slice(0, 2);
      mockStore._updateQueue(newLoans);
      fixture.detectChanges();

      component.currentPage.set(1);
      const paginatedData = component.paginatedData();
      expect(paginatedData.length).toBe(2);
    });
  });

  describe('Columns Configuration', () => {
    it('should define all required columns', () => {
      expect(component.columns.length).toBe(7);
    });

    it('should have correct column keys', () => {
      const keys = component.columns.map((col) => col.key);
      expect(keys).toEqual([
        'applicantId',
        'applicant.fulllName',
        'requestedAmount',
        'risk',
        'status',
        'submittedAt',
        'assigned',
      ]);
    });

    it('should have correct column labels', () => {
      const labels = component.columns.map((col) => col.label);
      expect(labels).toEqual([
        'App ID',
        'Applicant',
        'Amount',
        'Risk',
        'Status',
        'Submitted',
        'Assigned',
      ]);
    });
  });

  describe('Console Logging Effect', () => {
    it('should log type frequency on initialization', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      // Create a new component instance to trigger the effect
      const newFixture = TestBed.createComponent(ReviewQueue);
      newFixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
