import { Router } from 'express';
import {
  getDashboardStats,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getAdminAttendances,
} from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Protect all admin routes for ADMIN role (Managers can also read groups/teachers if needed)
router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Students
router.get('/students', getStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Teachers
router.get('/teachers', getTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Groups
router.get('/groups', getGroups);
router.post('/groups', createGroup);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

// Attendance View
router.get('/attendance', getAdminAttendances);

export default router;
