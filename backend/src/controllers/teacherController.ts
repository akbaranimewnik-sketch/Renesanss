import { Response } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';

export const getTeacherProfileAndStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        user: true,
        groups: {
          include: {
            students: true,
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({ message: 'O\'qituvchi profili topilmadi.' });
    }

    const groupIds = teacher.groups.map(g => g.id);
    const totalStudents = teacher.groups.reduce((acc, g) => acc + g.students.length, 0);

    // Calculate average attendance for this teacher's groups
    const attendances = await prisma.attendance.findMany({
      where: { groupId: { in: groupIds } },
    });

    const totalAttendanceCount = attendances.length;
    const presentAttendanceCount = attendances.filter(
      a => a.status === 'KELDI' || a.status === 'KECHIKDI'
    ).length;

    const averageAttendance = totalAttendanceCount > 0
      ? Math.round((presentAttendanceCount / totalAttendanceCount) * 100)
      : 0;

    // Calculate average grade
    const grades = await prisma.grade.findMany({
      where: { teacherId: teacher.id },
    });

    const averageGrade = grades.length > 0
      ? Math.round((grades.reduce((sum, g) => sum + g.score, 0) / grades.length) * 10) / 10
      : 0;

    return res.json({
      teacher,
      stats: {
        totalGroups: teacher.groups.length,
        totalStudents,
        averageAttendance,
        averageGrade,
        totalGradesGiven: grades.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'qituvchi statistikasini yuklashda xatolik.', error: error.message });
  }
};

// Get only assigned groups for this teacher
export const getMyGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teacher = await prisma.teacher.findUnique({ where: { userId } });

    if (!teacher) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }

    const groups = await prisma.group.findMany({
      where: { teacherId: teacher.id },
      include: {
        students: {
          orderBy: { fullName: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return res.json(groups);
  } catch (error: any) {
    return res.status(500).json({ message: 'Guruhlarni yuklashda xatolik.', error: error.message });
  }
};

// Get attendance for a specific group and date
export const getGroupAttendanceByDate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId, date } = req.query;

    if (!groupId || !date) {
      return res.status(400).json({ message: 'groupId va date parametrlarini ko\'rsating.' });
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        groupId: Number(groupId),
        date: String(date),
      },
      include: { student: true },
    });

    return res.json(attendances);
  } catch (error: any) {
    return res.status(500).json({ message: 'Davomatni yuklashda xatolik.', error: error.message });
  }
};

// Save attendance for multiple students in a group on a date
export const saveGroupAttendance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teacher = await prisma.teacher.findUnique({ where: { userId } });

    if (!teacher) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }

    const { groupId, date, records } = req.body;
    // records: Array of { studentId: number, status: 'KELDI' | 'KELMADI' | 'KECHIKDI' | 'SABABLI' }

    if (!groupId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Ma\'lumotlar to\'liq emas.' });
    }

    // Verify group belongs to teacher
    const group = await prisma.group.findFirst({
      where: { id: Number(groupId), teacherId: teacher.id },
    });

    if (!group) {
      return res.status(403).json({ message: 'Ushbu guruh sizga biriktirilmagan.' });
    }

    const savedRecords = await prisma.$transaction(
      records.map((r: { studentId: number; status: string }) =>
        prisma.attendance.upsert({
          where: {
            studentId_groupId_date: {
              studentId: Number(r.studentId),
              groupId: Number(groupId),
              date: String(date),
            },
          },
          update: {
            status: r.status,
            markedByTeacherId: teacher.id,
          },
          create: {
            studentId: Number(r.studentId),
            groupId: Number(groupId),
            date: String(date),
            status: r.status,
            markedByTeacherId: teacher.id,
          },
        })
      )
    );

    return res.json({
      message: 'Davomat muvaffaqiyatli saqlandi.',
      savedRecords,
    });
  } catch (error: any) {
    console.error('saveGroupAttendance xatosi:', error);
    return res.status(500).json({ message: 'Davomatni saqlashda xatolik.', error: error.message });
  }
};

// Save a grade for a student
export const saveStudentGrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teacher = await prisma.teacher.findUnique({ where: { userId } });

    if (!teacher) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }

    const { studentId, score, comment, date } = req.body;

    if (!studentId || score === undefined || !date) {
      return res.status(400).json({ message: 'studentId, score va date kiritilishi shart.' });
    }

    const grade = await prisma.grade.create({
      data: {
        studentId: Number(studentId),
        teacherId: teacher.id,
        score: Number(score),
        comment: comment || '',
        date: String(date),
      },
      include: {
        student: { include: { group: true } },
      },
    });

    return res.status(201).json({
      message: 'Baho muvaffaqiyatli saqlandi.',
      grade,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Bahoni saqlashda xatolik.', error: error.message });
  }
};

// Get grades given by this teacher
export const getTeacherGrades = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teacher = await prisma.teacher.findUnique({ where: { userId } });

    if (!teacher) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }

    const { groupId, date } = req.query;
    const where: any = { teacherId: teacher.id };

    if (date) where.date = String(date);
    if (groupId) {
      where.student = { groupId: Number(groupId) };
    }

    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: { include: { group: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return res.json(grades);
  } catch (error: any) {
    return res.status(500).json({ message: 'Baholarni yuklashda xatolik.', error: error.message });
  }
};
