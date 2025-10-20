import { EmploymentStatus } from './employment-status';

export interface Applicant {
  id: string;
  fullName: string;
  dateOfBirth: string;
  ssn: string;
  income: number;
  employmentStatus: EmploymentStatus;
  creditScore?: number;
}
