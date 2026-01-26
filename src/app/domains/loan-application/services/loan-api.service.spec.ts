import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoanApiService } from './loan-api.service';
import { Loan } from '../models/loan';

describe('LoanApiService', () => {
  let service: LoanApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LoanApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch loans', () => {
    const mockLoans: Loan[] = [
      {
        id: 'loan-001',
        type: 'personal',
        amount: { requested: 25000, approved: 22000 },
        termMonths: 36,
        applicant: {
          id: 'applicant-001',
          fullName: 'John Doe',
          dateOfBirth: '1985-06-15',
          ssn: '***-**-1234',
          income: 75000,
          employmentStatus: 'full-time',
          creditScore: 720,
        },
        status: 'approved',
        submittedAt: '2024-10-01T10:30:00Z',
      },
    ];

    service.getLoans().subscribe((loans) => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne('http://localhost:3001/loans');
    expect(req.request.method).toBe('GET');
    req.flush(mockLoans);
  });

  it('should fetch a single loan', () => {
    const mockLoan: Loan = {
      id: 'loan-001',
      type: 'personal',
      amount: { requested: 25000, approved: 22000 },
      termMonths: 36,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: 'full-time',
        creditScore: 720,
      },
      status: 'approved',
      submittedAt: '2024-10-01T10:30:00Z',
    };

    service.getLoan('loan-001').subscribe((loan) => {
      expect(loan).toEqual(mockLoan);
    });

    const req = httpMock.expectOne('http://localhost:3001/loans/loan-001');
    expect(req.request.method).toBe('GET');
    req.flush(mockLoan);
  });

  it('should create a loan', () => {
    const newLoanData: Partial<Loan> = {
      type: 'personal',
      amount: { requested: 15000 },
      termMonths: 24,
    };

    const mockResponse: Loan = {
      id: 'loan-new',
      type: 'personal',
      amount: { requested: 15000 },
      termMonths: 24,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: 'full-time',
      },
      status: 'pending',
    };

    service.createLoan(newLoanData).subscribe((loan) => {
      expect(loan).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3001/loans');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLoanData);
    req.flush(mockResponse);
  });

  it('should submit loan application', () => {
    const loanData: Partial<Loan> = {
      type: 'auto',
      amount: { requested: 30000 },
      termMonths: 60,
    };

    const mockResponse: Loan = {
      id: 'loan-submitted',
      type: 'auto',
      amount: { requested: 30000 },
      termMonths: 60,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: 'full-time',
      },
      status: 'pending',
      submittedAt: '2024-10-06T12:00:00Z',
    };

    service.submitLoanApplication(loanData).subscribe((loan) => {
      expect(loan).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3001/loans');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
