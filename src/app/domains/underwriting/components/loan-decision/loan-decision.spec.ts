import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { LoanDecision } from './loan-decision';

describe('LoanDecision', () => {
  let component: LoanDecision;
  let fixture: ComponentFixture<LoanDecision>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDecision],
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
      expect(component.loan).toBeTruthy();
    });

    it('should have correct loan id', () => {
      expect(component.loan.id).toBe('cmmmnv4kh0002swlmryozx7p6');
    });

    it('should have correct loan type', () => {
      expect(component.loan.type).toBe('auto');
    });

    it('should have correct loan amounts', () => {
      expect(component.loan.requestedAmount).toBe(20000);
      expect(component.loan.approvedAmount).toBe(0);
      expect(component.loan.downPayment).toBe(5000);
    });

    it('should have correct loan term', () => {
      expect(component.loan.termMonths).toBe(12);
    });

    it('should have correct loan status', () => {
      expect(component.loan.status).toBe('pending');
    });

    it('should have correct currency', () => {
      expect(component.loan.currency).toBe('USD');
    });

    it('should have applicant information', () => {
      expect(component.loan.applicant).toBeTruthy();
      expect(component.loan.applicant.id).toBe('cmmmnv4jb0000swlmev3lgkd9');
      expect(component.loan.applicant.fullName).toBe('john stevens');
      expect(component.loan.applicant.income).toBe(80000);
      expect(component.loan.applicant.employmentStatus).toBe('full-time');
      expect(component.loan.applicant.creditScore).toBe(850);
    });

    it('should have vehicle information for auto loan', () => {
      expect(component.loan.vehicleInfo).toBeTruthy();
      expect(component.loan.vehicleInfo.make).toBe('Lexus');
      expect(component.loan.vehicleInfo.model).toBe('ES300');
      expect(component.loan.vehicleInfo.year).toBe(2003);
      expect(component.loan.vehicleInfo.vin).toBe('12345678987654321');
      expect(component.loan.vehicleInfo.value).toBe(100000);
    });

    it('should have loan type information', () => {
      expect(component.loan.loanType).toBeTruthy();
      expect(component.loan.loanType.id).toBe('auto');
      expect(component.loan.loanType.name).toBe('Auto Loan');
      expect(component.loan.loanType.minAmount).toBe(5000);
      expect(component.loan.loanType.maxAmount).toBe(100000);
      expect(component.loan.loanType.interestRate).toBe(4.5);
    });

    it('should not have co-signer', () => {
      expect(component.loan.coSigner).toBeUndefined();
      expect(component.loan.coSignerId).toBe('');
    });

    it('should have timestamp data', () => {
      expect(component.loan.submittedAt).toBe('2026-03-11T23:19:20.777Z');
      expect(component.loan.createdAt).toBe('2026-03-11T23:19:20.777Z');
      expect(component.loan.updatedAt).toBe('2026-03-11T23:19:20.777Z');
    });
  });

  describe('Template Rendering', () => {
    it('should render decision container', () => {
      const container = debugElement.query(By.css('#decision-container'));
      expect(container).toBeTruthy();
    });

    it('should render LoanDetails component', () => {
      const loanDetailsComponents = debugElement.queryAll(By.css('app-loan-details'));
      expect(loanDetailsComponents.length).toBeGreaterThan(0);
    });

    it('should pass loan data to first LoanDetails component', () => {
      const loanDetailsComponents = debugElement.queryAll(By.css('app-loan-details'));
      expect(loanDetailsComponents.length).toBeGreaterThan(0);

      const firstComponent = loanDetailsComponents[0].componentInstance;
      expect(firstComponent.loan).toBe(component.loan);
    });
  });
});
