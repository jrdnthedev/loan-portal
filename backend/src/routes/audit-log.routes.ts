import { Router } from 'express';
import { getAllAuditLogs } from '../controllers/audit-log.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only admins and loan officers can view audit logs
router.use(authenticate);
router.use(authorize('admin', 'loan-officer'));

router.get('/', getAllAuditLogs);

export default router;
