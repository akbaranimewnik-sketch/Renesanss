import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [studentsCount, teachersCount, groupsCount, todayAttendances] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.group.count(),
      prisma.attendance.findMany({
        where: { date: today },
      }),
    ]);

    const totalToday = todayAttendances.length;
    const presentToday = todayAttendances.filter(a => a.status === 'KELDI' || a.status === 'KECHIKDI').length;
    const attendancePercentage = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

    const statusCounts = {
      keldi: todayAttendances.filter(a => a.status === 'KELDI').length,
      kelmadi: todayAttendances.filter(a => a.status === 'KELMADI').length,
      kechikdi: todayAttendances.filter(a => a.status === 'KECHIKDI').length,
      sababli: todayAttendances.filter(a => a.status === 'SABABLI').length,
    };

    // Recent 5 students
    const recentStudents = await prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { group: true },
    });

    // Recent 5 attendances
    const recentAttendances = await prisma.attendance.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: true,
        group: true,
        markedByTeacher: { include: { user: true } },
      },
    });

    return res.json({
      studentsCount,
      teachersCount,
      groupsCount,
      attendancePercentage,
      statusCounts,
      recentStudents,
      recentAttendances,
    });
  } catch (error: any) {
    console.error('getDashboardStats xatosi:', error);
    return res.status(500).json({ message: 'Statistikani yuklashda xatolik yuz berdi.', error: error.message });
  }
};

// ==================== STUDENTS ====================
export const getStudents = async (req: Request, res: Response) => {
  try {
    const { search, groupId } = req.query;

    const where: any = {};
    if (groupId) {
      where.groupId = Number(groupId);
    }
    if (search) {
      const q = String(search).trim();
      where.OR = [
        { fullName: { contains: q } },
        { phone: { contains: q } },
        { parentPhone: { contains: q } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        group: {
          include: {
            teacher: { include: { user: true } }
          }
        }
      },
      orderBy: { fullName: 'asc' },
    });

    return res.json(students);
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'quvchilarni yuklashda xatolik.', error: error.message });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, parentPhone, birthDate, groupId } = req.body;

    if (!fullName || !phone || !parentPhone || !birthDate) {
      return res.status(400).json({ message: 'Barcha majburiy maydonlarni to\'ldiring.' });
    }

    const student = await prisma.student.create({
      data: {
        fullName,
        phone,
        parentPhone,
        birthDate,
        groupId: groupId ? Number(groupId) : null,
      },
      include: { group: true },
    });

    return res.status(201).json(student);
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'quvchi qo\'shishda xatolik.', error: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { fullName, phone, parentPhone, birthDate, groupId } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        fullName,
        phone,
        parentPhone,
        birthDate,
        groupId: groupId ? Number(groupId) : null,
      },
      include: { group: true },
    });

    return res.json(student);
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'quvchini yangilashda xatolik.', error: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.student.delete({ where: { id } });
    return res.json({ message: 'O\'quvchi muvaffaqiyatli o\'chirildi.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'quvchini o\'chirishda xatolik.', error: error.message });
  }
};

// ==================== TEACHERS ====================
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: { select: { id: true, fullName: true, login: true, role: true } },
        groups: true,
      },
      orderBy: { user: { fullName: 'asc' } },
    });

    return res.json(teachers);
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'qituvchilarni yuklashda xatolik.', error: error.message });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, subject, login, password } = req.body;

    if (!fullName || !phone || !subject || !login || !password) {
      return res.status(400).json({ message: 'Barcha maydonlarni to\'ldiring.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { login: login.trim() } });
    if (existingUser) {
      return res.status(400).json({ message: 'Ushbu login band. Boshqa login tanlang.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        login: login.trim(),
        passwordHash,
        role: 'TEACHER',
        teacherProfile: {
          create: {
            phone,
            subject,
          },
        },
      },
      include: { teacherProfile: true },
    });

    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'qituvchi yaratishda xatolik.', error: error.message });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); // teacher.id
    const { fullName, phone, subject, password } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }

    const userUpdateData: any = {};
    if (fullName) userUpdateData.fullName = fullName;
    if (password) userUpdateData.passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: teacher.userId },
      data: userUpdateData,
    });

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        phone,
        subject,
      },
      include: {
        user: { select: { id: true, fullName: true, login: true, role: true } },
        groups: true,
      },
    });

    return res.json(updatedTeacher);
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'qituvchini yangilashda xatolik.', error: error.message });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return res.status(404).json({ message: 'O\'qituvchi topilmadi.' });
    }

    // Deleting User cascades to Teacher
    await prisma.user.delete({ where: { id: teacher.userId } });

    return res.json({ message: 'O\'qituvchi muvaffaqiyatli o\'chirildi.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'O\'qituvchini o\'chirishda xatolik.', error: error.message });
  }
};

// ==================== GROUPS ====================
export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        teacher: { include: { user: true } },
        students: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.json(groups);
  } catch (error: any) {
    return res.status(500).json({ message: 'Guruhlarni yuklashda xatolik.', error: error.message });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, teacherId, schedule } = req.body;

    if (!name || !schedule) {
      return res.status(400).json({ message: 'Guruh nomi va dars jadvali kiritilishi shart.' });
    }

    const group = await prisma.group.create({
      data: {
        name,
        teacherId: teacherId ? Number(teacherId) : null,
        schedule,
      },
      include: {
        teacher: { include: { user: true } },
        students: true,
      },
    });

    return res.status(201).json(group);
  } catch (error: any) {
    return res.status(500).json({ message: 'Guruh yaratishda xatolik.', error: error.message });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, teacherId, schedule } = req.body;

    const group = await prisma.group.update({
      where: { id },
      data: {
        name,
        teacherId: teacherId !== undefined ? (teacherId ? Number(teacherId) : null) : undefined,
        schedule,
      },
      include: {
        teacher: { include: { user: true } },
        students: true,
      },
    });

    return res.json(group);
  } catch (error: any) {
    return res.status(500).json({ message: 'Guruhni yangilashda xatolik.', error: error.message });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.group.delete({ where: { id } });
    return res.json({ message: 'Guruh muvaffaqiyatli o\'chirildi.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Guruhni o\'chirishda xatolik.', error: error.message });
  }
};

// ==================== ATTENDANCE VIEW ====================
export const getAdminAttendances = async (req: Request, res: Response) => {
  try {
    const { groupId, teacherId, startDate, endDate, date } = req.query;

    const where: any = {};
    if (groupId) where.groupId = Number(groupId);
    if (teacherId) where.markedByTeacherId = Number(teacherId);

    if (date) {
      where.date = String(date);
    } else if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = String(startDate);
      if (endDate) where.date.lte = String(endDate);
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        student: true,
        group: true,
        markedByTeacher: { include: { user: true } },
      },
      orderBy: [{ date: 'desc' }, { student: { fullName: 'asc' } }],
    });

    return res.json(attendances);
  } catch (error: any) {
    return res.status(500).json({ message: 'Davomatni yuklashda xatolik.', error: error.message });
  }
};
