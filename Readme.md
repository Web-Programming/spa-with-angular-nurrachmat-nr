# Panduan Implementasi Authentication API

## Deskripsi Project
Griya MDP adalah aplikasi Single Page Application (SPA) berbasis Angular dengan Express JS + MongoDB sebagai Backend.

Dokumen ini menjelaskan:
1. Panduan implementasi project backend *griya-mdp-backend*
2. Penjelasan Backend API terkait route, controller dan model untuk user
3. Implementasi Register Component dengan Backend API
4. Implementasi Login Component dengan Backend API

---
## 📋 Panduan Implementasi Backend
1. Tambahkan repository `spa-with-angular-nurrachmat-nr` sebagai remote baru di repository project anda 

```bash 
git remote add repo-pakjr https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr
```
2. Fetch data dari remote tersebut
```bash 
git fetch repo-pakjr
```
3. Copy folder project *griya-mdp-backend* dari branch auth-api-impl di remote tersebut
```bash
git checkout repo-pakjr/auth-api-impl -- griya-mdp-backend/
```

## 📋 Dokumentasi Backend API
Untuk memahami struktur backend, endpoints, controller, model dan cara kerja authentication API:
**📚 [BACKEND_API_AUTH_GUIDE.md](./BACKEND_API_AUTH_GUIDE.md)**

---

## Panduan Implementasi Components

### 📝 1. Implementasi Register Component
**Tujuan:** Membuat halaman registrasi user baru dengan validasi form yang lengkap dan integrasi Backend API.

**Fitur:**
- ✅ Implementasi Auth Service untuk API calls
- ✅ Implementasi register method pada component register
- ✅ Validasi password dengan confirm password field
- ✅ Show/hide password toggle
- ✅ Loading state saat proses registrasi
- ✅ Success/error message dari backend
- ✅ Auto-clear messages

**📚 Dokumentasi Lengkap:** [REGISTER_API_GUIDE.md](./REGISTER_API_GUIDE.md)

**⏱️ Waktu Estimasi:** 30 menit

---

### 📝 2. Implementasi Login Component
**Tujuan:** Membuat halaman login dengan integrasi Backend API, session management, dan auto-redirect.

**Fitur:**
- ✅ Implementasi login method dengan Auth Service
- ✅ Show/hide password toggle
- ✅ Loading state saat proses login
- ✅ Success/error message dari backend
- ✅ User session management dengan localStorage
- ✅ Auto-redirect ke home setelah login berhasil
- ✅ Form validation (email & password required)

**📚 Dokumentasi Lengkap:** [LOGIN_API_GUIDE.md](./LOGIN_API_GUIDE.md)

**⏱️ Waktu Estimasi:** 25 menit

---

### 📝 3. Implementasi Authorization dengan JWT dan Route Guard
**Tujuan:** Mengamankan halaman dan endpoint agar hanya user terautentikasi yang dapat mengaksesnya.

**Fokus Implementasi:**
- Menyimpan dan membaca JWT (localStorage)
- Menambahkan AuthInterceptor untuk header Authorization: Bearer <token>
- Membuat AuthGuard (canActivate) untuk blok akses jika belum login atau token kadaluarsa
- Menangani 401/403: auto-redirect ke /login dan clear session
- Menyediakan logout yang menghapus token dan state user

**📚 Dokumentasi Lengkap:** [AUTHORIZATION_GUIDE.md](./AUTHORIZATION_GUIDE.md)

**Waktu Estimasi:** 35 menit
---

## 🚀 Quick Start

### 1. Setup Backend
```bash
cd griya-mdp-backend
npm install
npm start
```

### 2. Setup Frontend
```bash
cd griya-mdp
npm install
ng serve
```

### 3. Test Authentication Flow
1. Buka browser: `http://localhost:4200/register`
2. Daftar user baru
3. Login dengan user yang sudah terdaftar
4. Verify redirect ke home page

---

## 📖 Urutan Pembelajaran

**Recommended Learning Path:**

1. **Backend API** (5 menit)
   - Baca [BACKEND_API_AUTH_GUIDE.md](./BACKEND_API_AUTH_GUIDE.md)
   - Pahami User Model, Auth Controller, dan Routes
   - Test endpoints dengan Postman/REST Client

2. **Register Component** (30 menit)
   - Ikuti [REGISTER_API_GUIDE.md](./REGISTER_API_GUIDE.md)
   - Buat Auth Service
   - Integrasikan Register Component
   - Test registrasi user

3. **Login Component** (25 menit)
   - Ikuti [LOGIN_API_GUIDE.md](./LOGIN_API_GUIDE.md)
   - Integrasikan Login Component
   - Implement session management
   - Test login flow

4. **Authorization** (35 menit)
   - Ikuti [AUTHORIZATION_GUIDE.md](./AUTHORIZATIN_GUIDE.md)

**Total Waktu:** ~1,5 jam

---

## 📚 Resources

- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [HttpClient Guide](https://angular.io/guide/http)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)

---

## 👨‍💻 Support

Jika mengalami kesulitan:
1. Baca troubleshooting di dokumentasi lengkap
2. Check console browser untuk error messages
3. Verify backend logs
4. Test API dengan Postman/Thunder Client

---

**Happy Coding! 🚀**
*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*