import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoanApiService } from './loan-api.service';
import { Loan } from '../models/loan';
import { LoanType } from '../models/loan-type';
import { LoanStatus } from '../models/loan-status';
import { EmploymentStatus } from '../models/employment-status.enum';

describe('LoanApiService', () => {
  let service: LoanApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanApiService],
    });
    service = TestBed.inject(LoanApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch loans', () => {
    const mockLoans: Loan[] = [
      {
        id: 'loan-001',
        type: LoanType.Personal,
        amount: { requested: 25000, approved: 22000 },
        termMonths: 36,
        applicant: {
          id: 'applicant-001',
          fullName: 'John Doe',
          dateOfBirth: '1985-06-15',
          ssn: '***-**-1234',
          income: 75000,
          employmentStatus: EmploymentStatus.FullTime,
          creditScore: 720,
        },
        status: LoanStatus.Approved,
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
      type: LoanType.Personal,
      amount: { requested: 25000, approved: 22000 },
      termMonths: 36,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: EmploymentStatus.FullTime,
        creditScore: 720,
      },
      status: LoanStatus.Approved,
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
      type: LoanType.Personal,
      amount: { requested: 15000 },
      termMonths: 24,
    };

    const mockResponse: Loan = {
      id: 'loan-new',
      type: LoanType.Personal,
      amount: { requested: 15000 },
      termMonths: 24,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: EmploymentStatus.FullTime,
      },
      status: LoanStatus.Pending,
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
      type: LoanType.Auto,
      amount: { requested: 30000 },
      termMonths: 60,
    };

    const mockResponse: Loan = {
      id: 'loan-submitted',
      type: LoanType.Auto,
      amount: { requested: 30000 },
      termMonths: 60,
      applicant: {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: EmploymentStatus.FullTime,
      },
      status: LoanStatus.Pending,
      submittedAt: '2024-10-06T12:00:00Z',
    };

    service.submitLoanApplication(loanData).subscribe((loan) => {
      expect(loan).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3001/loans/submit');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
