import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Ma\'lumotlar bazasini tozalash va qayta to\'ldirish (Seeding) boshlandi ---');

  // Clear existing data
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.student.deleteMany();
  await prisma.group.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  console.log('Mavjud ma\'lumotlar tozalandi.');

  // Common password hashes
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const managerPasswordHash = await bcrypt.hash('manager123', 10);
  const teacherPasswordHash = await bcrypt.hash('teacher123', 10);

  // 1. Admin yaratish
  const adminUser = await prisma.user.create({
    data: {
      fullName: 'Alisher Qodirov (Admin)',
      login: 'admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin yaratildi: ${adminUser.login} (parol: admin123)`);

  // 2. Menejer yaratish
  const managerUser = await prisma.user.create({
    data: {
      fullName: 'Madina Rahimova (Menejer)',
      login: 'manager',
      passwordHash: managerPasswordHash,
      role: 'MANAGER',
    },
  });
  console.log(`Menejer yaratildi: ${managerUser.login} (parol: manager123)`);

  // 3. 3 ta O'qituvchi yaratish
  const teachersData = [
    {
      fullName: 'Rustam Ikromov',
      login: 'rustam_math',
      phone: '+998 90 123 45 67',
      subject: 'Matematika',
    },
    {
      fullName: 'Aziza Karimova',
      login: 'aziza_eng',
      phone: '+998 91 234 56 78',
      subject: 'Ingliz tili (IELTS)',
    },
    {
      fullName: 'Nodirbek Saidov',
      login: 'nodir_it',
      phone: '+998 93 345 67 89',
      subject: 'Web Dasturlash (Frontend)',
    },
  ];

  const createdTeachers = [];
  for (const t of teachersData) {
    const user = await prisma.user.create({
      data: {
        fullName: t.fullName,
        login: t.login,
        passwordHash: teacherPasswordHash,
        role: 'TEACHER',
        teacherProfile: {
          create: {
            phone: t.phone,
            subject: t.subject,
          },
        },
      },
      include: { teacherProfile: true },
    });
    createdTeachers.push(user.teacherProfile!);
    console.log(`O'qituvchi yaratildi: ${t.login} (parol: teacher123)`);
  }

  // 4. 5 ta Guruh yaratish
  const groupsData = [
    {
      name: 'Matematika - Asosiy guruh',
      teacherId: createdTeachers[0].id,
      schedule: 'Dush-Chor-Jum 09:00 - 11:00',
    },
    {
      name: 'Matematika - Abituriyent 2025',
      teacherId: createdTeachers[0].id,
      schedule: 'Sesh-Pay-Shan 14:00 - 16:00',
    },
    {
      name: 'IELTS Standard - B2/C1',
      teacherId: createdTeachers[1].id,
      schedule: 'Dush-Chor-Jum 11:00 - 13:00',
    },
    {
      name: 'General English - Beginners',
      teacherId: createdTeachers[1].id,
      schedule: 'Sesh-Pay-Shan 10:00 - 12:00',
    },
    {
      name: 'Frontend Bootcamp - React & TS',
      teacherId: createdTeachers[2].id,
      schedule: 'Dush-Chor-Jum 15:00 - 17:00',
    },
  ];

  const createdGroups = [];
  for (const g of groupsData) {
    const group = await prisma.group.create({
      data: g,
    });
    createdGroups.push(group);
  }
  console.log(`5 ta guruh yaratildi.`);

  // 5. 40 ta O'quvchi yaratish (har bir guruhga 8 tadan)
  const studentNames = [
    // Guruh 1 (Matematika asosiy)
    "Jasur Bekmurodov", "Shahnoza To'rayeva", "Otabek G'aniyev", "Dildora Qosimova",
    "Bobur Samadov", "Kamola Yunusova", "Sanjar Mirzayev", "Feruza Ergasheva",
    // Guruh 2 (Matematika abituriyent)
    "Ulug'bek Mahmudov", "Zilola Rasulova", "Davron Xoliqov", "Nargiza Usmonova",
    "Sardor Bozorov", "Mohira Ahmedova", "Javohir Olimov", "Gulnoza Zokirova",
    // Guruh 3 (IELTS)
    "Temur Sobirov", "Madinabonu Yusupova", "Farrux Islomov", "Rayhona Nurmatova",
    "Sherzod Shokirov", "Sevara Saidova", "Mirjalol Rahimov", "Nigora Alimova",
    // Guruh 4 (General English)
    "Humoyun Karimov", "Shaxzoda Rustamova", "Bekzod Davlatov", "Laylo Hamroyeva",
    "Akbar Valiyev", "Munisa Yoqubova", "Muzaffar Jo'rayev", "Shahrizoda Normurodova",
    // Guruh 5 (Frontend Bootcamp)
    "Diyorbek Boltayev", "Zuxra Umarova", "Shohruh Mirzo", "Sabina Abdullayeva",
    "Asadbek Xolmatov", "Dilnoza Rahmatillayeva", "Biloliddin Qodirov", "Gulasal Tojiyev"
  ];

  const createdStudents = [];
  for (let i = 0; i < studentNames.length; i++) {
    const groupIndex = Math.floor(i / 8);
    const assignedGroup = createdGroups[groupIndex];
    const birthYear = 2004 + (i % 6);
    const birthMonth = String((i % 12) + 1).padStart(2, '0');
    const birthDay = String((i % 28) + 1).padStart(2, '0');

    const student = await prisma.student.create({
      data: {
        fullName: studentNames[i],
        phone: `+998 90 ${100 + i} ${20 + i} ${30 + i}`,
        parentPhone: `+998 93 ${200 + i} ${30 + i} ${40 + i}`,
        birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
        groupId: assignedGroup.id,
      },
    });
    createdStudents.push(student);
  }
  console.log(`40 ta o'quvchi yaratildi va guruhlarga biriktirildi.`);

  // 6. 1 oylik Davomat ma'lumotlari (oxirgi 30 kun)
  console.log('1 oylik namunaviy davomat yozilmoqda...');
  const attendanceStatuses = ['KELDI', 'KELDI', 'KELDI', 'KELDI', 'KELDI', 'KELDI', 'KECHIKDI', 'SABABLI', 'KELMADI'];
  const today = new Date();

  // Oxirgi 15 ta dars kuni (har 2 kunda bir)
  const attendanceDates: string[] = [];
  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const d = new Date();
    d.setDate(today.getDate() - dayOffset);
    const dayOfWeek = d.getDay(); // 0 is Sunday
    if (dayOfWeek !== 0) { // Yakshanbadan tashqari
      attendanceDates.push(d.toISOString().split('T')[0]);
    }
  }

  // O'quvchilar uchun davomat generatsiya qilish
  for (const group of createdGroups) {
    const groupStudents = createdStudents.filter(s => s.groupId === group.id);
    for (const dateStr of attendanceDates.slice(-12)) { // oxirgi 12 dars
      for (const student of groupStudents) {
        const randStatus = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
        await prisma.attendance.create({
          data: {
            studentId: student.id,
            groupId: group.id,
            date: dateStr,
            status: randStatus,
            markedByTeacherId: group.teacherId,
          },
        });
      }
    }
  }
  console.log('Davomat ma\'lumotlari muvaffaqiyatli kiritildi.');

  // 7. Namunaviy Baholar (oxirgi 1 oy)
  console.log('Baholar kiritilmoqda...');
  const gradeComments = [
    'Darsda juda faol qatnashdi',
    'Uyga vazifani a\'lo bajargan',
    'Yangi mavzuni mustaqil tushuntirib berdi',
    'Test sinovidan yuqori natija ko\'rsatdi',
    'Savol-javoblarda yetakchilik qildi',
    'Vazifalarni vaqtida topshirdi',
    'Yaxshi harakat qildi, yana ozroq takrorlash kerak',
  ];

  for (const group of createdGroups) {
    const groupStudents = createdStudents.filter(s => s.groupId === group.id);
    // Har bir o'quvchiga 4-6 ta baho
    for (const student of groupStudents) {
      const gradesCount = 4 + Math.floor(Math.random() * 3);
      for (let g = 0; g < gradesCount; g++) {
        const dateIndex = Math.floor(Math.random() * attendanceDates.length);
        const score = 70 + Math.floor(Math.random() * 30); // 70 dan 100 gacha
        const comment = gradeComments[Math.floor(Math.random() * gradeComments.length)];

        await prisma.grade.create({
          data: {
            studentId: student.id,
            teacherId: group.teacherId!,
            score,
            comment,
            date: attendanceDates[dateIndex],
          },
        });
      }
    }
  }
  console.log('Baholar muvaffaqiyatli kiritildi.');

  // 8. 1 oylik Moliya (Kirim va Chiqim)
  console.log('Moliya kirim-chiqimlari kiritilmoqda...');
  // O'quvchilar to'lovi (Kirim)
  for (let i = 0; i < createdStudents.length; i++) {
    const student = createdStudents[i];
    const amount = 550000 + (i % 4) * 50000; // 550,000 - 700,000 UZS
    const payDate = attendanceDates[i % attendanceDates.length];

    await prisma.transaction.create({
      data: {
        type: 'INCOME',
        category: 'O\'quvchi to\'lovi',
        amount,
        date: payDate,
        note: `${student.fullName} oylik kursi uchun to'lov`,
      },
    });
  }

  // Chiqimlar (Xarajatlar)
  const expenseTemplates = [
    { category: 'O\'qituvchi maoshi', amount: 5500000, note: 'Rustam Ikromov (Matematika) oylik maoshi', dayOffset: 5 },
    { category: 'O\'qituvchi maoshi', amount: 5200000, note: 'Aziza Karimova (IELTS) oylik maoshi', dayOffset: 5 },
    { category: 'O\'qituvchi maoshi', amount: 6000000, note: 'Nodirbek Saidov (Frontend) oylik maoshi', dayOffset: 5 },
    { category: 'Bino ijarasi', amount: 8000000, note: 'O\'quv markaz binosi oylik ijarasi', dayOffset: 25 },
    { category: 'Kommunal va Internet', amount: 1400000, note: 'Elektr, suv va yuqori tezlikdagi internet to\'lovi', dayOffset: 15 },
    { category: 'Kantselyariya va qog\'oz', amount: 750000, note: 'Dars materiallari va printer qog\'ozlari xaridi', dayOffset: 12 },
    { category: 'Marketing va Target', amount: 2500000, note: 'Instagram va Telegram target reklamalari', dayOffset: 20 },
    { category: 'Choy-kofe va tozalik', amount: 450000, note: 'O\'qituvchilar va mehmonlar xonasi uchun xaridlar', dayOffset: 8 },
  ];

  for (const exp of expenseTemplates) {
    const expDate = new Date();
    expDate.setDate(today.getDate() - exp.dayOffset);
    const dateStr = expDate.toISOString().split('T')[0];

    await prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        category: exp.category,
        amount: exp.amount,
        date: dateStr,
        note: exp.note,
      },
    });
  }

  console.log('Moliya ma\'lumotlari kiritildi.');
  console.log('=== SEEDING TO\'LIQ VA MUVAFFAQIYATLI YAKUNLANDI! ===');
}

main()
  .catch((e) => {
    console.error('Seed xatosi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
