import { Router } from 'express';
import { getAllApplicants, getApplicantById } from '../controllers/applicant.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All applicant routes require authentication
router.use(authenticate);

router.get('/', getAllApplicants);
router.get('/:id', getApplicantById);

export default router;
