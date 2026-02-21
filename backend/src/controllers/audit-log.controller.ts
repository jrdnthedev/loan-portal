import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: Number(limit),
        orderBy: { timestamp: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);

    res.json({
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export const createAuditLog = async (req: AuthRequest, res: Response) => {
  try {
    const { action, userId, metadata } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const auditLog = await prisma.auditLog.create({
      data: {
        action,
        userId: userId || req.user?.id,
        metadata: metadata || null,
      },
    });

    res.status(201).json(auditLog);
  } catch (error) {
    console.error('Create audit log error:', error);
    res.status(500).json({ error: 'Failed to create audit log' });
  }
};
