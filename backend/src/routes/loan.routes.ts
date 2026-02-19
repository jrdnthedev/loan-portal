import { Router } from 'express';
import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
} from '../controllers/loan.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All loan routes require authentication
router.use(authenticate);

router.get('/', getAllLoans);
router.get('/:id', getLoanById);
router.post('/', createLoan);
router.post('/submit', createLoan); // Alias for compatibility with old API
router.put('/:id', authorize('loan-officer', 'admin'), updateLoan);
router.patch('/:id', authorize('loan-officer', 'admin'), updateLoan);
router.delete('/:id', authorize('admin'), deleteLoan);

export default router;
