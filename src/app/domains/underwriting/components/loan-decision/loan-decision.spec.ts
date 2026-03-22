import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, signal, computed } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { LoanDecision } from './loan-decision';
import { UnderwritingStore } from '../../store/underwriting-store';
import { Loan } from '../../../loan-application/models/loan';

const mockLoan: Loan = {
  id: 'cmmmnv4kh0002swlmryozx7p6',
  type: 'auto',
  requestedAmount: 20000,
  approved: 0,
  currency: 'USD',
  termMonths: 12,
  status: 'pending',
  submittedAt: '2026-03-11T23:19:20.777Z',
  loanType: 'auto',
  applicant: {
    id: 'cmmmnv4jb0000swlmev3lgkd9',
    fullName: 'john stevens',
    dateOfBirth: '1990-01-01',
    ssn: '123-45-6789',
    income: 80000,
    employmentStatus: 'full-time',
    creditScore: 850,
  },
};

describe('LoanDecision', () => {
  let component: LoanDecision;
  let fixture: ComponentFixture<LoanDecision>;
  let debugElement: DebugElement;
  let mockStore: any;

  beforeEach(async () => {
    const selectedLoansSignal = signal<Loan[]>([mockLoan]);

    mockStore = {
      selectedLoans: computed(() => selectedLoansSignal()),
      evaluateLoanRisk: vi.fn().mockReturnValue({
        score: 75,
        riskLevel: 'medium',
        explanation: 'Moderate risk',
        flags: [],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [LoanDecision],
      providers: [
        { provide: UnderwritingStore, useValue: mockStore },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDecision);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Loan Data', () => {
    it('should have loan data initialized', () => {
      expect(component.currentLoan()).toBeTruthy();
    });

    it('should have correct loan id', () => {
      expect(component.currentLoan()!.id).toBe('cmmmnv4kh0002swlmryozx7p6');
    });

    it('should have correct loan type', () => {
      expect(component.currentLoan()!.type).toBe('auto');
    });

    it('should have correct loan amounts', () => {
      expect(component.currentLoan()!.requestedAmount).toBe(20000);
      expect(component.currentLoan()!.approved).toBe(0);
    });

    it('should have correct loan term', () => {
      expect(component.currentLoan()!.termMonths).toBe(12);
    });

    it('should have correct loan status', () => {
      expect(component.currentLoan()!.status).toBe('pending');
    });

    it('should have correct currency', () => {
      expect(component.currentLoan()!.currency).toBe('USD');
    });

    it('should have applicant information', () => {
      const loan = component.currentLoan()!;
      expect(loan.applicant).toBeTruthy();
      expect(loan.applicant.id).toBe('cmmmnv4jb0000swlmev3lgkd9');
      expect(loan.applicant.fullName).toBe('john stevens');
      expect(loan.applicant.income).toBe(80000);
      expect(loan.applicant.employmentStatus).toBe('full-time');
      expect(loan.applicant.creditScore).toBe(850);
    });

    it('should have correct loan type value', () => {
      expect(component.currentLoan()!.loanType).toBe('auto');
    });

    it('should not have co-signer', () => {
      expect(component.currentLoan()!.coSigner).toBeUndefined();
    });

    it('should have timestamp data', () => {
      expect(component.currentLoan()!.submittedAt).toBe('2026-03-11T23:19:20.777Z');
    });
  });

  describe('Template Rendering', () => {
    it('should render decision container', () => {
      const container = debugElement.query(By.css('#decision-container'));
      expect(container).toBeTruthy();
    });

    it('should render card components', () => {
      const cards = debugElement.queryAll(By.css('app-card'));
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should render topbar with applicant name', () => {
      const topbar = debugElement.query(By.css('app-topbar'));
      expect(topbar).toBeTruthy();
      expect(topbar.nativeElement.textContent).toContain('john stevens');
    });
  });
});
