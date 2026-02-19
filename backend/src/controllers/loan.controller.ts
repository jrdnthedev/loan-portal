import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllLoans = async (req: AuthRequest, res: Response) => {
  try {
    const { status, type, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        include: {
          applicant: true,
          coSigner: true,
          vehicleInfo: true,
          loanType: true,
        },
        skip,
        take: Number(limit),
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.loan.count({ where }),
    ]);

    res.json({
      data: loans,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};

export const getLoanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loan.findUnique({
      where: { id },
      include: {
        applicant: true,
        coSigner: true,
        vehicleInfo: true,
        loanType: true,
      },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan);
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ error: 'Failed to fetch loan' });
  }
};

export const createLoan = async (req: AuthRequest, res: Response) => {
  try {
    const { type, amount, termMonths, applicant, coSigner, vehicleInfo, downPayment } = req.body;

    // Create or find applicant
    const applicantData = await prisma.applicant.create({
      data: {
        fullName: applicant.fullName,
        dateOfBirth: applicant.dateOfBirth,
        ssn: applicant.ssn,
        income: applicant.income,
        employmentStatus: applicant.employmentStatus,
        creditScore: applicant.creditScore || null,
      },
    });

    // Create co-signer if provided
    let coSignerData = null;
    if (coSigner) {
      coSignerData = await prisma.applicant.create({
        data: {
          fullName: coSigner.fullName,
          dateOfBirth: coSigner.dateOfBirth,
          ssn: coSigner.ssn,
          income: coSigner.income,
          employmentStatus: coSigner.employmentStatus,
          creditScore: coSigner.creditScore || null,
        },
      });
    }

    // Create loan
    const loan = await prisma.loan.create({
      data: {
        type,
        requestedAmount: amount.requested || amount,
        currency: amount.currency || 'USD',
        termMonths: Number(termMonths),
        status: 'pending',
        downPayment: downPayment || null,
        applicantId: applicantData.id,
        coSignerId: coSignerData?.id,
        ...(vehicleInfo && {
          vehicleInfo: {
            create: {
              make: vehicleInfo.make,
              model: vehicleInfo.model,
              year: Number(vehicleInfo.year),
              vin: vehicleInfo.vin,
              mileage: Number(vehicleInfo.mileage),
              value: Number(vehicleInfo.value),
            },
          },
        }),
      },
      include: {
        applicant: true,
        coSigner: true,
        vehicleInfo: true,
        loanType: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `CREATE: Loan ${loan.id}`,
        userId: req.user?.id,
        metadata: { loanId: loan.id },
      },
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Failed to create loan' });
  }
};

export const updateLoan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, approvedAmount } = req.body;

    const loan = await prisma.loan.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(approvedAmount && { approvedAmount }),
        ...(status && { reviewedAt: new Date() }),
      },
      include: {
        applicant: true,
        coSigner: true,
        vehicleInfo: true,
        loanType: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `UPDATE: Loan ${loan.id} - Status: ${status}`,
        userId: req.user?.id,
        metadata: { loanId: loan.id, status, approvedAmount },
      },
    });

    res.json(loan);
  } catch (error) {
    console.error('Update loan error:', error);
    res.status(500).json({ error: 'Failed to update loan' });
  }
};

export const deleteLoan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.loan.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `DELETE: Loan ${id}`,
        userId: req.user?.id,
        metadata: { loanId: id },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Failed to delete loan' });
  }
};
