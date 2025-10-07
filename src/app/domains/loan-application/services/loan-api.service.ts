import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan';
import { Applicant } from '../models/applicant';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoanApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Loan endpoints
  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans`);
  }

  getLoan(id: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/loans/${id}`);
  }

  createLoan(loan: Partial<Loan>): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/loans`, loan);
  }

  updateLoan(id: string, loan: Partial<Loan>): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/loans/${id}`, loan);
  }

  deleteLoan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/loans/${id}`);
  }

  // Submit loan application (custom endpoint)
  submitLoanApplication(loanData: Partial<Loan>): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/loans/submit`, loanData);
  }

  // Applicant endpoints
  getApplicants(): Observable<Applicant[]> {
    return this.http.get<Applicant[]>(`${this.apiUrl}/applicants`);
  }

  getApplicant(id: string): Observable<Applicant> {
    return this.http.get<Applicant>(`${this.apiUrl}/applicants/${id}`);
  }

  createApplicant(applicant: Partial<Applicant>): Observable<Applicant> {
    return this.http.post<Applicant>(`${this.apiUrl}/applicants`, applicant);
  }

  updateApplicant(id: string, applicant: Partial<Applicant>): Observable<Applicant> {
    return this.http.put<Applicant>(`${this.apiUrl}/applicants/${id}`, applicant);
  }

  // Loan types
  getLoanTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/loan-types`);
  }

  // Search and filter
  searchLoans(params: any): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans`, { params });
  }

  getLoansByStatus(status: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans?status=${status}`);
  }

  getLoansByApplicant(applicantId: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans?applicant.id=${applicantId}`);
  }
}
