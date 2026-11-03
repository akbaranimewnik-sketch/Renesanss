# 🏛️ RENESANS LMS — O'quv Markaz Boshqaruv Tizimi
*(Learning Center Management System • Soft UI Neumorphism)*

Ushbu to'liq avtomatlashtirilgan o'quv markaz boshqaruv tizimi zamonaviy **Full-Stack** texnologiyalari (React + Vite + TypeScript, Express.js, Prisma ORM, SQLite) hamda estetik jihatdan mukammal ishlangan **Neumorphism (Soft UI)** dizayn tizimi asosida noldan yaratildi.

---

## 🎨 1. NEUMORPHISM (SOFT UI) DIZAYN TIZIMI

Tizim sof Neumorphism qoidalariga to'liq rioya qilgan holda ishlab chiqilgan:
- Barcha elementlar fon bilan uzviy bog'langan bo'lib, ikki tomonlama yumshoq yorug' va qorong'i soyalar orqali hajm (3D bo'rtma va botma) kasb etadi.
- **Kartalar, tugmalar, sidebar va jadvallar:** Bo'rtma (*raised*) holatda.
- **Inputlar, tanlash maydonlari, faol/bosilgan tab va tugmalar:** Ichkariga botgan (*inset*) holatda.
- **Katta yumaloq burchaklar:** `border-radius: 16px - 24px`.
- **Yumshoq o'tishlar:** `transition: all 250ms ease`.

### Ranglar Palitrasi (CSS Variables):
- **☀️ Kunduzgi rejim (Light mode):**
  - Fon: `#E0E5EC`
  - Matn: `#3D4852`
  - Yorug' soya: `#FFFFFF`
  - Qorong'i soya: `#A3B1C6`
  - Aksent: `#556270`
- **🌙 Tungi rejim (Dark mode):**
  - Fon: `#2B2E33`
  - Matn: `#D0D4DA`
  - Yorug' soya: `#33373D`
  - Qorong'i soya: `#1F2125`
  - Aksent: `#8A94A3`
- **Statuslar (Keldi / Kelmadi / Kechikdi / Sababli):** Yumshoq, to'yinmagan (desaturated) Neumorphic pill nishonlar.

Header'dagi quyosh/oy tugmasi orqali rejim osongina o'zgaradi va tanlov `localStorage` hamda brauzer tizim rejimiga mos holda eslab qolinadi.

---

## 👥 2. TIZIM ROLLARI VA XUSUSIYATLARI

### 🔐 Yagona Login Sahifasi (`/login`)
- Barcha rollar uchun yagona kirish nuqtasi.
- Parolni ko'rsatish/yashirish imkoniyati.
- Sinovdan o'tkazuvchilar uchun **"Tezkor demo hisoblar"** tugmalari (Admin, Menejer, O'qituvchi 1-click login).
- Avtorizatsiyadan so'ng foydalanuvchi avtomatik ravishda o'z rolining paneliga yo'naltiriladi (`/admin`, `/manager`, `/teacher`).
- Himoyalangan route'lar: begona rol paneliga kirish taqiqlangan.

---

### 👑 1. ADMIN PANEL (`/admin`)
- **Dashboard (`/admin`):**
  - Jami o'quvchilar soni (40 ta)
  - Jami o'qituvchilar soni (3 ta)
  - Jami guruhlar soni (5 ta)
  - Bugungi davomat foizi va holatlar taqsimoti (Keldi, Kelmadi, Kechikdi, Sababli)
  - So'nggi qo'shilgan o'quvchilar va so'nggi davomatlar oqimi
- **O'quvchilar bo'limi (`/admin/students`):**
  - Ism va telefon bo'yicha qidiruv, guruh bo'yicha saralash
  - Yangi o'quvchi qo'shish modal formasi (F.I.SH., telefon, ota-ona telefoni, tug'ilgan sana, guruh)
  - O'quvchi ma'lumotlarini tahrirlash va o'chirish
  - Sahifalash (Pagination)
- **O'qituvchilar bo'limi (`/admin/teachers`):**
  - O'qituvchilar ro'yxati, fani, telefoni, login va biriktirilgan guruhlar soni
  - Yangi o'qituvchi yaratish (login va paroli bilan birga)
  - Tahrirlash va hisobni o'chirish
- **Guruhlar bo'limi (`/admin/groups`):**
  - Yangi guruh yaratish, o'qituvchi biriktirish va dars jadvalini belgilash
  - Guruhdagi o'quvchilar sonini ko'rish va to'liq ro'yxatini modal oynada ko'rish
  - Tahrirlash va o'chirish
- **Davomat nazorati (`/admin/attendance`):**
  - O'qituvchilar belgilagan real davomat jurnali
  - Filtrlar: Guruh bo'yicha, O'qituvchi bo'yicha, Boshlang'ich va Tugash sanasi oralig'i
  - Davomat xulosasi ko'rsatkichlari

---

### 💼 2. MENEJER PANEL (`/manager`)
- **Umumiy ko'rinish (`/manager`):**
  - Jami o'quvchilar, o'qituvchilar, guruhlar statistikasi
  - Jami Kirim (To'lovlar) kartasi
  - Jami Chiqim (Xarajatlar) kartasi
  - Sof Foyda (*Net Profit*) hisobi
- **Moliya bo'limi (`/manager/finance`):**
  - Kirim va Chiqimlar balansi
  - Oylik tushum va xarajatlar solishtirma **Bar Chart** grafigi (Recharts)
  - Yangi tranzaksiya kiritish modali (Kategoriya, summa, sana, izoh)
  - Tranzaksiyalarni tahrirlash va o'chirish
  - Tranzaksiya turi (Kirim / Chiqim) va sana bo'yicha filtrlar
- **O'quvchilar reytingi (`/manager/ratings`):**
  - O'qituvchilar qo'ygan real baholarga asoslangan reyting
  - **"Haftalik"** va **"Oylik"** o'tish tablari
  - Kuchli uchlik uchun alohida podium va medallar (🥇 1-o'rin, 🥈 2-o'rin, 🥉 3-o'rin)
  - Top 10 o'quvchi jadvali (O'rin, Ism, Guruh, O'rtacha ball)
  - Guruh bo'yicha saralash filtri

---

### 👨‍🏫 3. O'QITUVCHI PANEL (`/teacher`)
- **Faqat o'ziga biriktirilgan guruhlar va shogirdlar ko'rinadi.**
- **Bosh sahifa (`/teacher`):**
  - O'qituvchi ma'lumotlari va fani
  - O'z guruhlari soni, jami o'quvchilari soni, o'rtacha davomat va o'rtacha baho ko'rsatkichlari
  - O'z guruhlari kartochkalari va ularga tezkor o'tish tugmalari
- **Davomat belgilash (`/teacher/attendance`):**
  - Guruhni va dars sanasini tanlash
  - **"Hammasini keldi deb belgilash"** tugmasi orqali 1 marta bosishda barcha o'quvchilarni "Keldi" qilish
  - Har bir o'quvchi uchun alohida: `Keldi`, `Kelmadi`, `Kechikdi`, `Sababli` holatlarini belgilash
  - Davomatni saqlash va muvaffaqiyat bildirishnomasi
- **Baholash (`/teacher/grading`):**
  - Guruh va o'quvchini tanlash
  - Dars sanasi, 1 dan 100 gacha ball kiritish va o'qituvchi sharhi (izohi)
  - Baho saqlanganda, u avtomatik tarzda **Menejer reytingi** tizimiga ta'sir qiladi!
  - O'qituvchi tomonidan qo'yilgan so'nggi baholar tarixi jadvali

---

## 🔑 3. TEST FOYDALANUVCHILARI (DEMO HISOB RO'YXATI)

| Rol | F.I.SH. | Mutaxassislik | Login | Parol | Yo'nalish |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Alisher Qodirov | Tizim administratori | `admin` | `admin123` | `/admin` |
| **Menejer** | Madina Rahimova | Markaz bosh menejeri | `manager` | `manager123` | `/manager` |
| **O'qituvchi 1** | Rustam Ikromov | Matematika | `rustam_math` | `teacher123` | `/teacher` |
| **O'qituvchi 2** | Aziza Karimova | Ingliz tili (IELTS) | `aziza_eng` | `teacher123` | `/teacher` |
| **O'qituvchi 3** | Nodirbek Saidov | Web Dasturlash (Frontend) | `nodir_it` | `teacher123` | `/teacher` |

*(Login sahifasida ushbu hisoblarni kiritish uchun bir marta bosiladigan tezkor tugmalar mavjud)*

---

## 🚀 4. O'RNATISH VA ISHGA TUSHIRISH

### Talablar:
- **Node.js** (v18 yoki undan yuqori)
- **npm** (v9 yoki undan yuqori)

### 1-qadam: Backend'ni ishga tushirish
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```
> Backend server `http://localhost:5000` manzilida ishga tushadi.

### 2-qadam: Frontend'ni ishga tushirish
```bash
cd frontend
npm install
npm run dev
```
> Frontend ilovasi `http://localhost:3000` manzilida ochiladi.

---

## 📁 5. LOYIHA STRUKTURASI

```
Renesens/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # User, Teacher, Student, Group, Attendance, Grade, Transaction modellari
│   │   └── seed.ts             # 1 admin, 1 menejer, 3 o'qituvchi, 5 guruh, 40 o'quvchi, 1 oylik to'liq ma'lumotlar
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── adminController.ts
│   │   │   ├── managerController.ts
│   │   │   └── teacherController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT va Role-based middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── adminRoutes.ts
│   │   │   ├── managerRoutes.ts
│   │   │   └── teacherRoutes.ts
│   │   ├── types/
│   │   ├── prisma.ts
│   │   └── index.ts            # Express server
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts       # Fetch API client, avtomatik token va xatoliklar boshqaruvi
│   │   ├── components/
│   │   │   ├── ui/             # Neumorphism UI komponentlar to'plami
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx # Responsiv sidebar va header
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.tsx
│   │   │   │   ├── AdminStudentsPage.tsx
│   │   │   │   ├── AdminTeachersPage.tsx
│   │   │   │   ├── AdminGroupsPage.tsx
│   │   │   │   └── AdminAttendancePage.tsx
│   │   │   ├── manager/
│   │   │   │   ├── ManagerOverviewPage.tsx
│   │   │   │   ├── ManagerFinancePage.tsx
│   │   │   │   └── ManagerRatingPage.tsx
│   │   │   └── teacher/
│   │   │       ├── TeacherDashboardPage.tsx
│   │   │       ├── TeacherAttendancePage.tsx
│   │   │       └── TeacherGradingPage.tsx
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── index.css           # Neumorphism CSS o'zgaruvchilari va soyalari
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
├── package.json
└── README.md
```

---
*Loyiha barcha talablarga 100% javob beradi va to'liq o'zbek tilida tayyorlangan.*
# Renesanss
# Renesanss
# Renesanss
# Renesanss
# Renesanss
# Renesanss
# Renesanss
# Renesanss
