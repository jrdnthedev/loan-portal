import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDetails } from './loan-details';
import { Loan } from '../../../loan-application/models/loan';

describe('LoanDetails', () => {
  let component: LoanDetails;
  let fixture: ComponentFixture<LoanDetails>;

  const mockLoan: Loan = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDetails);
    component = fixture.componentInstance;
    component.loan = mockLoan;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loan input', () => {
    expect(component.loan).toBe(mockLoan);
  });
});
