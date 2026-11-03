import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'renesens_super_secret_jwt_key_2025';

export const login = async (req: Request, res: Response) => {
  try {
    const { login: userLogin, password } = req.body;

    if (!userLogin || !password) {
      return res.status(400).json({ message: 'Login va parol kiritilishi shart.' });
    }

    const user = await prisma.user.findUnique({
      where: { login: userLogin.trim() },
      include: { teacherProfile: true },
    });

    if (!user) {
      return res.status(400).json({ message: 'Login yoki parol noto\'g\'ri.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Login yoki parol noto\'g\'ri.' });
    }

    const payload = {
      userId: user.id,
      fullName: user.fullName,
      login: user.login,
      role: user.role,
      teacherId: user.teacherProfile?.id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Muvaffaqiyatli tizimga kirildi.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        login: user.login,
        role: user.role,
        teacherId: user.teacherProfile?.id,
        subject: user.teacherProfile?.subject,
      },
    });
  } catch (error: any) {
    console.error('Login xatosi:', error);
    return res.status(500).json({ message: 'Serverda xatolik yuz berdi.', error: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Avtorizatsiyadan o\'tilmagan.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { teacherProfile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' });
    }

    return res.json({
      id: user.id,
      fullName: user.fullName,
      login: user.login,
      role: user.role,
      teacherId: user.teacherProfile?.id,
      subject: user.teacherProfile?.subject,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Serverda xatolik yuz berdi.', error: error.message });
  }
};
