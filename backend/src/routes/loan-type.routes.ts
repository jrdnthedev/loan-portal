import { Router } from 'express';
import { getAllLoanTypes, getLoanTypeById } from '../controllers/loan-type.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Loan types can be accessed without authentication for public info
router.get('/', getAllLoanTypes);
router.get('/:id', getLoanTypeById);

export default router;
