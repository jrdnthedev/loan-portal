import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllLoanTypes = async (req: AuthRequest, res: Response) => {
  try {
    const loanTypes = await prisma.loanType.findMany();
    res.json(loanTypes);
  } catch (error) {
    console.error('Get loan types error:', error);
    res.status(500).json({ error: 'Failed to fetch loan types' });
  }
};

export const getLoanTypeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const loanType = await prisma.loanType.findUnique({
      where: { id },
    });

    if (!loanType) {
      return res.status(404).json({ error: 'Loan type not found' });
    }

    res.json(loanType);
  } catch (error) {
    console.error('Get loan type error:', error);
    res.status(500).json({ error: 'Failed to fetch loan type' });
  }
};
