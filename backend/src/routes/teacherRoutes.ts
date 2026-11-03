import { Router } from 'express';
import {
  getTeacherProfileAndStats,
  getMyGroups,
  getGroupAttendanceByDate,
  saveGroupAttendance,
  saveStudentGrade,
  getTeacherGrades,
} from '../controllers/teacherController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['TEACHER', 'ADMIN']));

router.get('/profile', getTeacherProfileAndStats);
router.get('/groups', getMyGroups);
router.get('/attendance', getGroupAttendanceByDate);
router.post('/attendance', saveGroupAttendance);
router.get('/grades', getTeacherGrades);
router.post('/grades', saveStudentGrade);

export default router;
