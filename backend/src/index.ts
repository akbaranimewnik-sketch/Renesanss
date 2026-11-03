import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import managerRoutes from './routes/managerRoutes';
import teacherRoutes from './routes/teacherRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Renesens API ishlayapti' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/teacher', teacherRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Kutilmagan xatolik:', err);
  res.status(500).json({ message: 'Serverda ichki xatolik yuz berdi.', error: err.message });
});

// Faqat lokal ishlaganda serverni ishga tushiramiz (Vercel'da kerak emas)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Renesans Backend] Server http://localhost:${PORT} portida ishga tushdi.`);
  });
}

export default app;
