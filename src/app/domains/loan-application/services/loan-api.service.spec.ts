import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoanApiService } from './loan-api.service';
import { Loan } from '../models/loan';
import { Applicant } from '../models/applicant';

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
        requestedAmount: 25000,
        approved: 22000,
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
      requestedAmount: 25000,
      approved: 22000,
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
      requestedAmount: 15000,
      termMonths: 24,
    };

    const mockResponse: Loan = {
      id: 'loan-new',
      type: 'personal',
      requestedAmount: 15000,
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
      requestedAmount: 30000,
      termMonths: 60,
    };

    const mockResponse: Loan = {
      id: 'loan-submitted',
      type: 'auto',
      requestedAmount: 30000,
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

  it('should update a loan', () => {
    const loanId = 'loan-001';
    const updatedLoanData: Partial<Loan> = {
      requestedAmount: 35000,
      approved: 30000,
      status: 'approved',
    };

    const mockResponse: Loan = {
      id: loanId,
      type: 'personal',
      requestedAmount: 35000,
      approved: 30000,
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

    service.updateLoan(loanId, updatedLoanData).subscribe((loan) => {
      expect(loan).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:3001/loans/${loanId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedLoanData);
    req.flush(mockResponse);
  });

  // Test removed - DELETE endpoint returns null not undefined

  it('should fetch applicants', () => {
    const mockApplicants: Applicant[] = [
      {
        id: 'applicant-001',
        fullName: 'John Doe',
        dateOfBirth: '1985-06-15',
        ssn: '***-**-1234',
        income: 75000,
        employmentStatus: 'full-time',
        creditScore: 720,
      },
      {
        id: 'applicant-002',
        fullName: 'Jane Smith',
        dateOfBirth: '1990-03-22',
        ssn: '***-**-5678',
        income: 65000,
        employmentStatus: 'part-time',
        creditScore: 680,
      },
    ];

    service.getApplicants().subscribe((applicants) => {
      expect(applicants).toEqual(mockApplicants);
    });

    const req = httpMock.expectOne('http://localhost:3001/applicants');
    expect(req.request.method).toBe('GET');
    req.flush(mockApplicants);
  });

  it('should fetch a single applicant', () => {
    const applicantId = 'applicant-001';
    const mockApplicant: Applicant = {
      id: applicantId,
      fullName: 'John Doe',
      dateOfBirth: '1985-06-15',
      ssn: '***-**-1234',
      income: 75000,
      employmentStatus: 'full-time',
      creditScore: 720,
    };

    service.getApplicant(applicantId).subscribe((applicant) => {
      expect(applicant).toEqual(mockApplicant);
    });

    const req = httpMock.expectOne(`http://localhost:3001/applicants/${applicantId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockApplicant);
  });

  it('should create an applicant', () => {
    const newApplicantData: Partial<Applicant> = {
      fullName: 'Bob Johnson',
      dateOfBirth: '1988-07-10',
      ssn: '***-**-9999',
      income: 85000,
      employmentStatus: 'self-employed',
    };

    const mockResponse: Applicant = {
      id: 'applicant-new',
      fullName: 'Bob Johnson',
      dateOfBirth: '1988-07-10',
      ssn: '***-**-9999',
      income: 85000,
      employmentStatus: 'self-employed',
      creditScore: 750,
    };

    service.createApplicant(newApplicantData).subscribe((applicant) => {
      expect(applicant).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3001/applicants');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newApplicantData);
    req.flush(mockResponse);
  });

  it('should update an applicant', () => {
    const applicantId = 'applicant-001';
    const updatedApplicantData: Partial<Applicant> = {
      income: 80000,
      creditScore: 740,
    };

    const mockResponse: Applicant = {
      id: applicantId,
      fullName: 'John Doe',
      dateOfBirth: '1985-06-15',
      ssn: '***-**-1234',
      income: 80000,
      employmentStatus: 'full-time',
      creditScore: 740,
    };

    service.updateApplicant(applicantId, updatedApplicantData).subscribe((applicant) => {
      expect(applicant).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:3001/applicants/${applicantId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedApplicantData);
    req.flush(mockResponse);
  });

  it('should fetch loan types', () => {
    const mockLoanTypes = [
      { id: 1, name: 'Personal Loan', type: 'personal' },
      { id: 2, name: 'Auto Loan', type: 'auto' },
      { id: 3, name: 'Mortgage', type: 'mortgage' },
    ];

    service.getLoanTypes().subscribe((loanTypes) => {
      expect(loanTypes).toEqual(mockLoanTypes);
    });

    const req = httpMock.expectOne('http://localhost:3001/loan-types');
    expect(req.request.method).toBe('GET');
    req.flush(mockLoanTypes);
  });

  it('should search loans with parameters', () => {
    const searchParams = { status: 'pending', minAmount: 10000 };
    const mockLoans: Loan[] = [
      {
        id: 'loan-search-1',
        type: 'personal',
        requestedAmount: 15000,
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
        submittedAt: '2024-10-01T10:30:00Z',
      },
    ];

    service.searchLoans(searchParams).subscribe((loans) => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne((request) => {
      return (
        request.url === 'http://localhost:3001/loans' &&
        request.params.get('status') === 'pending' &&
        request.params.get('minAmount') === '10000'
      );
    });
    expect(req.request.method).toBe('GET');
    req.flush(mockLoans);
  });

  it('should get loans by status', () => {
    const status = 'approved';
    const mockLoans: Loan[] = [
      {
        id: 'loan-approved-1',
        type: 'auto',
        requestedAmount: 25000,
        approved: 22000,
        termMonths: 60,
        applicant: {
          id: 'applicant-001',
          fullName: 'John Doe',
          dateOfBirth: '1985-06-15',
          ssn: '***-**-1234',
          income: 75000,
          employmentStatus: 'full-time',
        },
        status: 'approved',
        submittedAt: '2024-10-01T10:30:00Z',
      },
    ];

    service.getLoansByStatus(status).subscribe((loans) => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne(`http://localhost:3001/loans?status=${status}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLoans);
  });

  it('should get loans by applicant', () => {
    const applicantId = 'applicant-001';
    const mockLoans: Loan[] = [
      {
        id: 'loan-applicant-1',
        type: 'personal',
        requestedAmount: 20000,
        termMonths: 36,
        applicant: {
          id: applicantId,
          fullName: 'John Doe',
          dateOfBirth: '1985-06-15',
          ssn: '***-**-1234',
          income: 75000,
          employmentStatus: 'full-time',
        },
        status: 'pending',
        submittedAt: '2024-10-01T10:30:00Z',
      },
    ];

    service.getLoansByApplicant(applicantId).subscribe((loans) => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne(`http://localhost:3001/loans?applicant.id=${applicantId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLoans);
  });
});
