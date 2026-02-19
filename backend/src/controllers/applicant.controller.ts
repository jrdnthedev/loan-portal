import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllApplicants = async (req: AuthRequest, res: Response) => {
  try {
    const applicants = await prisma.applicant.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(applicants);
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};

export const getApplicantById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: {
        loansAsApplicant: true,
        loansAsCoSigner: true,
      },
    });

    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.json(applicant);
  } catch (error) {
    console.error('Get applicant error:', error);
    res.status(500).json({ error: 'Failed to fetch applicant' });
  }
};
