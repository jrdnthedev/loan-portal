import { vi } from 'vitest';
import { faker } from '@faker-js/faker';
import type { User, Loan, Applicant, LoanType } from '@prisma/client';

export const mockUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const mockApplicant = (overrides?: Partial<Applicant>): Applicant => ({
  id: faker.string.uuid(),
  fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
  dateOfBirth: faker.date.past({ years: 30 }).toISOString(),
  ssn: faker.string.numeric(9),
  income: faker.number.int({ min: 30000, max: 150000 }),
  employmentStatus: 'employed',
  creditScore: faker.number.int({ min: 600, max: 850 }),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const mockLoanType = (overrides?: Partial<LoanType>): LoanType => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(['Personal', 'Auto', 'Mortgage', 'Business']),
  description: faker.lorem.sentence(),
  minAmount: 1000,
  maxAmount: 50000,
  minTerm: 12,
  maxTerm: 60,
  interestRate: 5.5,
  ...overrides,
});

export const mockLoan = (overrides?: Partial<Loan>): Loan => ({
  id: faker.string.uuid(),
  type: 'personal',
  termMonths: faker.number.int({ min: 12, max: 60 }),
  requestedAmount: faker.number.int({ min: 5000, max: 50000 }),
  approvedAmount: null,
  currency: 'USD',
  status: 'pending',
  downPayment: null,
  submittedAt: new Date(),
  reviewedAt: null,
  applicantId: faker.string.uuid(),
  coSignerId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const mockAuthRequest = (user?: Partial<User>) => ({
  user: {
    id: user?.id || faker.string.uuid(),
    email: user?.email || faker.internet.email(),
    role: user?.role || 'customer',
  },
});

export const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

export const mockRequest = (overrides?: any) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides,
});
