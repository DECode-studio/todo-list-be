# 📝 To-Do App - Manajemen Tugas dengan Kutipan Motivasi Harian

Aplikasi manajemen tugas (To-Do App) sederhana namun powerful yang membantu pengguna mengatur tugas harian mereka, dilengkapi dengan kutipan motivasi harian dari API pihak ketiga untuk menjaga semangat tetap menyala! 🚀

---

## 🛠️ Instruksi Setup Project

### Prasyarat
- Node.js (versi 16+)
- npm atau yarn
- Git

### Langkah-langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/DECode-studio/todo-list-be.git
   cd todo-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # atau jika menggunakan yarn
   yarn install
   ```

3. **Buat File Environment**
   Buat file `.env` di root project dan isi dengan konfigurasi berikut:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret_key_here
   QUOTE_API_URL=https://api.quotable.io/random
   ```

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Akses Aplikasi**
   Buka browser dan kunjungi:
   ```
   http://localhost:3000
   ```

6. **Registrasi & Login**
   - Daftar akun baru melalui halaman registrasi.
   - Login untuk mengakses dashboard.
   - Hanya pengguna yang login yang dapat mengakses fitur manajemen tugas.

---

## 🗂️ Struktur Proyek

```
todo-app/
├── public/                 # File statis (favicon, gambar, dll)
├── src/
│   ├── controllers/        # Logika bisnis aplikasi (auth, task, quote)
│   ├── models/             # Model data (User, Task)
│   ├── routes/             # Definisi endpoint API
│   ├── middleware/         # Middleware (auth, error handling)
│   ├── utils/              # Fungsi utilitas (JWT, API client)
│   ├── views/              # Template tampilan (jika menggunakan templating engine)
│   ├── app.js              # Entry point aplikasi
│   └── server.js           # Konfigurasi server Express
├── .env                    # Konfigurasi environment
├── package.json            # Dependensi dan script
└── README.md               # Dokumentasi ini
```

---

## 🚀 Teknologi yang Digunakan

### Backend
- **Node.js** — Runtime JavaScript
- **Express.js** — Web framework untuk menangani routing dan middleware
- **JWT (JSON Web Token)** — Untuk autentikasi dan proteksi route
- **bcryptjs** — Untuk hashing password pengguna
- **Axios** — Untuk mengambil kutipan motivasi dari API eksternal

### Database (Opsional / Bisa disesuaikan)
- **MongoDB + Mongoose** — Untuk menyimpan data user dan task *(bisa diganti dengan SQLite/PostgreSQL sesuai kebutuhan)*

### API Pihak Ketiga
- **Quotable API** — Menyediakan kutipan motivasi acak setiap hari  
  🔗 https://api.quotable.io/random

### Frontend (Opsional / Bisa dikembangkan terpisah)
- **EJS / Handlebars** — Untuk server-side rendering *(atau bisa diganti dengan React/Vue jika SPA)*
- **Bootstrap / Tailwind CSS** — Untuk styling tampilan

### Tools Tambahan
- **Nodemon** — Auto-restart server saat ada perubahan kode
- **Dotenv** — Untuk mengelola variabel environment
- **Cors** — Untuk mengizinkan akses lintas domain (jika diperlukan)

---

## ✨ Fitur Utama

### 1. Autentikasi Pengguna
- ✅ Registrasi akun baru
- ✅ Login & Logout
- 🔒 Proteksi route — hanya pengguna terautentikasi yang bisa akses dashboard

### 2. Manajemen Tugas (CRUD)
- ➕ Tambah tugas baru
- 📋 Lihat daftar tugas
- ✏️ Edit tugas
- ❌ Hapus tugas
- ✅ Ubah status tugas (selesai / belum selesai)
- 🎯 Filter tugas berdasarkan status

### 3. Integrasi API Pihak Ketiga
- 💬 Menampilkan kutipan motivasi harian dari [Quotable API](https://api.quotable.io/random)
- 🔄 Kutipan diambil ulang setiap kali halaman dashboard dimuat

### 4. Dashboard
- 👤 Menampilkan informasi pengguna yang sedang login
- 📋 Daftar tugas dengan status dan aksi
- 💬 Kutipan motivasi harian
- 🎨 Tampilan bersih dan responsif

---

## 📌 Catatan Tambahan

- Aplikasi ini bisa dikembangkan lebih lanjut dengan menambahkan notifikasi, reminder, atau sinkronisasi kalender.
- Untuk produksi, pastikan untuk:
  - Mengganti `JWT_SECRET` dengan string acak yang kuat
  - Mengamankan API key jika diperlukan
  - Menambahkan validasi input dan sanitasi data

---

## 🤝 Kontribusi

Ingin berkontribusi? Silakan buat *pull request* atau laporkan *issue* di repository ini.

---

## 📄 Lisensi

MIT License — Silakan gunakan, modifikasi, dan distribusikan sesuka hati.

---

Dibuat dengan ❤️ untuk membantu kamu tetap produktif dan termotivasi setiap hari!  
Happy Coding! 💻✨