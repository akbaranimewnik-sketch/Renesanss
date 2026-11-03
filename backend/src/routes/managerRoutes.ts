import { Router } from 'express';
import {
  getManagerOverview,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyFinanceChart,
  getStudentRatings,
} from '../controllers/managerController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { getGroups } from '../controllers/adminController';

const router = Router();

// Protect for MANAGER and ADMIN
router.use(authenticateToken);
router.use(requireRole(['MANAGER', 'ADMIN']));

// Overview statistics
router.get('/overview', getManagerOverview);

// Finance
router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.get('/chart', getMonthlyFinanceChart);

// Rating
router.get('/ratings', getStudentRatings);
router.get('/groups', getGroups);

export default router;
