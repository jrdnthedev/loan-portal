import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import {
  mockLoan,
  mockApplicant,
  mockLoanType,
  mockRequest,
  mockResponse,
  mockAuthRequest,
} from '../../helpers/mock-data';

// Mock the prisma module
vi.mock('../../../lib/prisma', () => ({
  default: {
    loan: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    applicant: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
} from '../../../controllers/loan.controller';
import prisma from '../../../lib/prisma';

// Get reference to the mocked prisma
const prismaMock = prisma as any;

describe('Loan Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllLoans', () => {
    it('should return paginated loans with default pagination', async () => {
      const req = {
        ...mockRequest({ query: {} }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;
      const loans = [mockLoan(), mockLoan()];

      prismaMock.loan.findMany.mockResolvedValue(loans);
      prismaMock.loan.count.mockResolvedValue(2);

      await getAllLoans(req, res);

      expect(prismaMock.loan.findMany).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: { submittedAt: 'desc' },
      });
      expect(res.json).toHaveBeenCalledWith({
        data: loans,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should filter loans by status', async () => {
      const req = {
        ...mockRequest({ query: { status: 'approved' } }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;
      const loans = [mockLoan({ status: 'approved' })];

      prismaMock.loan.findMany.mockResolvedValue(loans);
      prismaMock.loan.count.mockResolvedValue(1);

      await getAllLoans(req, res);

      expect(prismaMock.loan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'approved' },
        }),
      );
    });

    it('should filter loans by type', async () => {
      const req = {
        ...mockRequest({ query: { type: 'auto' } }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;
      const loans = [mockLoan({ type: 'auto' })];

      prismaMock.loan.findMany.mockResolvedValue(loans);
      prismaMock.loan.count.mockResolvedValue(1);

      await getAllLoans(req, res);

      expect(prismaMock.loan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'auto' },
        }),
      );
    });

    it('should handle custom pagination', async () => {
      const req = {
        ...mockRequest({ query: { page: '2', limit: '5' } }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;
      const loans = [mockLoan()];

      prismaMock.loan.findMany.mockResolvedValue(loans);
      prismaMock.loan.count.mockResolvedValue(10);

      await getAllLoans(req, res);

      expect(prismaMock.loan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
      expect(res.json).toHaveBeenCalledWith({
        data: loans,
        pagination: {
          total: 10,
          page: 2,
          limit: 5,
          totalPages: 2,
        },
      });
    });

    it('should return 500 on error', async () => {
      const req = {
        ...mockRequest({ query: {} }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;

      prismaMock.loan.findMany.mockRejectedValue(new Error('Database error'));

      await getAllLoans(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch loans' });
    });
  });

  describe('getLoanById', () => {
    it('should return loan by id', async () => {
      const loanId = 'loan-123';
      const req = {
        ...mockRequest({ params: { id: loanId } }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;
      const loan = mockLoan({ id: loanId });

      prismaMock.loan.findUnique.mockResolvedValue(loan);

      await getLoanById(req, res);

      expect(prismaMock.loan.findUnique).toHaveBeenCalledWith({
        where: { id: loanId },
        include: expect.any(Object),
      });
      expect(res.json).toHaveBeenCalledWith(loan);
    });

    it('should return 404 if loan not found', async () => {
      const req = {
        ...mockRequest({ params: { id: 'nonexistent-id' } }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;

      prismaMock.loan.findUnique.mockResolvedValue(null);

      await getLoanById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Loan not found' });
    });

    it('should return 500 on error', async () => {
      const req = {
        ...mockRequest({ params: { id: 'loan-123' } }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;

      prismaMock.loan.findUnique.mockRejectedValue(new Error('Database error'));

      await getLoanById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch loan' });
    });
  });

  describe('createLoan', () => {
    it('should create a loan with applicant', async () => {
      const applicantData = {
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        ssn: '123456789',
        income: 50000,
        employmentStatus: 'employed',
        creditScore: 720,
      };

      const req = {
        ...mockRequest({
          body: {
            type: 'personal',
            amount: { requested: 10000, currency: 'USD' },
            termMonths: 36,
            applicant: applicantData,
          },
        }),
        ...mockAuthRequest({ id: 'user-123' }),
      } as AuthRequest;
      const res = mockResponse() as Response;

      const createdApplicant = mockApplicant();
      const createdLoan = mockLoan({ applicantId: createdApplicant.id });

      prismaMock.applicant.create.mockResolvedValue(createdApplicant);
      prismaMock.loan.create.mockResolvedValue(createdLoan);
      prismaMock.auditLog.create.mockResolvedValue({} as any);

      await createLoan(req, res);

      expect(prismaMock.applicant.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          fullName: applicantData.fullName,
          income: applicantData.income,
        }),
      });
      expect(prismaMock.loan.create).toHaveBeenCalled();
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: expect.stringContaining('CREATE'),
          userId: 'user-123',
        }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdLoan);
    });

    it('should create loan with co-signer', async () => {
      const applicantData = {
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        ssn: '123456789',
        income: 50000,
        employmentStatus: 'employed',
      };

      const coSignerData = {
        fullName: 'Jane Doe',
        dateOfBirth: '1992-05-15',
        ssn: '987654321',
        income: 60000,
        employmentStatus: 'employed',
      };

      const req = {
        ...mockRequest({
          body: {
            type: 'auto',
            amount: 25000,
            termMonths: 60,
            applicant: applicantData,
            coSigner: coSignerData,
          },
        }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;

      const createdApplicant = mockApplicant();
      const createdCoSigner = mockApplicant();
      const createdLoan = mockLoan({
        applicantId: createdApplicant.id,
        coSignerId: createdCoSigner.id,
      });

      prismaMock.applicant.create
        .mockResolvedValueOnce(createdApplicant)
        .mockResolvedValueOnce(createdCoSigner);
      prismaMock.loan.create.mockResolvedValue(createdLoan);
      prismaMock.auditLog.create.mockResolvedValue({} as any);

      await createLoan(req, res);

      expect(prismaMock.applicant.create).toHaveBeenCalledTimes(2);
      expect(prismaMock.loan.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            coSignerId: createdCoSigner.id,
          }),
        }),
      );
    });

    it('should return 500 on error', async () => {
      const req = {
        ...mockRequest({
          body: {
            type: 'personal',
            amount: 10000,
            termMonths: 36,
            applicant: {},
          },
        }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;

      prismaMock.applicant.create.mockRejectedValue(new Error('Database error'));

      await createLoan(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create loan' });
    });
  });

  describe('updateLoan', () => {
    it('should update loan status', async () => {
      const loanId = 'loan-123';
      const req = {
        ...mockRequest({
          params: { id: loanId },
          body: { status: 'approved', approvedAmount: 10000 },
        }),
        ...mockAuthRequest({ id: 'user-123' }),
      } as AuthRequest;
      const res = mockResponse() as Response;
      const updatedLoan = mockLoan({ id: loanId, status: 'approved' });

      prismaMock.loan.update.mockResolvedValue(updatedLoan);
      prismaMock.auditLog.create.mockResolvedValue({} as any);

      await updateLoan(req, res);

      expect(prismaMock.loan.update).toHaveBeenCalledWith({
        where: { id: loanId },
        data: expect.objectContaining({
          status: 'approved',
          approvedAmount: 10000,
          reviewedAt: expect.any(Date),
        }),
        include: expect.any(Object),
      });
      expect(prismaMock.auditLog.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(updatedLoan);
    });

    it('should return 500 on error', async () => {
      const req = {
        ...mockRequest({
          params: { id: 'loan-123' },
          body: { status: 'approved' },
        }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;

      prismaMock.loan.update.mockRejectedValue(new Error('Database error'));

      await updateLoan(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update loan' });
    });
  });

  describe('deleteLoan', () => {
    it('should delete a loan', async () => {
      const loanId = 'loan-123';
      const req = {
        ...mockRequest({ params: { id: loanId } }),
        ...mockAuthRequest({ id: 'user-123' }),
      } as AuthRequest;
      const res = mockResponse() as Response;

      prismaMock.loan.delete.mockResolvedValue({} as any);
      prismaMock.auditLog.create.mockResolvedValue({} as any);

      await deleteLoan(req, res);

      expect(prismaMock.loan.delete).toHaveBeenCalledWith({
        where: { id: loanId },
      });
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: expect.stringContaining('DELETE'),
          userId: 'user-123',
        }),
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const req = {
        ...mockRequest({ params: { id: 'loan-123' } }),
        ...mockAuthRequest(),
      } as AuthRequest;
      const res = mockResponse() as Response;

      prismaMock.loan.delete.mockRejectedValue(new Error('Database error'));

      await deleteLoan(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete loan' });
    });
  });
});
