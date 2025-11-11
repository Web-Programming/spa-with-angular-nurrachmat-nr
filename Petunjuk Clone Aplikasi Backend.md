# Backend Only Clone Guide (Branch `backend-only`)

Repository ini memiliki branch khusus bernama `backend-only` yang hanya berisi project Node.js Express (folder `griya-mdp-backend`). Ikuti panduan berikut untuk melakukan clone dan menjalankan backend.

## Prasyarat
Pastikan sudah terinstall:
- **Git** - Download dari [git-scm.com](https://git-scm.com/downloads)
- **Node.js LTS** - Download dari [nodejs.org](https://nodejs.org/)
- **Akun GitHub** - Daftar di [github.com](https://github.com/)

Verifikasi instalasi:
```bash
git --version
node --version
npm --version
```

---

## Langkah 1: Clone Repository dari Branch `backend-only`

Gunakan perintah berikut untuk clone langsung branch backend:

```bash
git clone --branch backend-only --single-branch https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr.git
```

**Catatan:** Jika Git versi lama tidak mendukung `--single-branch`, gunakan:
```bash
git clone https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr.git
cd spa-with-angular-nurrachmat-nr
git checkout backend-only
```

Setelah clone berhasil, Anda akan melihat struktur:
```
spa-with-angular-nurrachmat-nr/
└── griya-mdp-backend/
    ├── app.js
    ├── package.json
    ├── bin/
    ├── app_server/
    └── ...
```

---

## Langkah 2: Pindahkan Folder `griya-mdp-backend` ke Repository Pribadi Anda

**Catatan:** Pastikan Anda sudah memiliki repository pribadi untuk tugas ini dan sudah di-clone ke komputer lokal Anda.

### Copy Folder Backend ke Repository Anda

#### Opsi A: Menggunakan Windows Command Prompt (CMD)
```bat
cd spa-with-angular-[github-username-anda]
xcopy /E /I /H /Y ..\spa-with-angular-nurrachmat-nr\griya-mdp-backend griya-mdp-backend
```

#### Opsi B: Menggunakan PowerShell
```powershell
cd spa-with-angular-[github-username-anda]
Copy-Item ..\spa-with-angular-nurrachmat-nr\griya-mdp-backend -Destination .\griya-mdp-backend -Recurse -Force
```

#### Opsi C: Menggunakan Git Bash / Linux / Mac
```bash
cd spa-with-angular-[github-username-anda]
cp -r ../spa-with-angular-nurrachmat-nr/griya-mdp-backend ./griya-mdp-backend
```

#### Opsi D: Copy Manual (Paling Mudah untuk Pemula)
1. Buka Windows Explorer
2. Navigasi ke folder `spa-with-angular-nurrachmat-nr`
3. **Copy** folder `griya-mdp-backend` (Ctrl+C)
4. Navigasi ke folder `spa-with-angular-[github-username-anda]`
5. **Paste** folder di sini (Ctrl+V)

Setelah copy, struktur repository Anda akan menjadi:
```
spa-with-angular-[github-username-anda]/
├── griya-mdp/                    # (folder frontend Angular, jika sudah ada)
└── griya-mdp-backend/           # ← folder backend yang baru dicopy
    ├── app.js
    ├── package.json
    ├── bin/
    ├── app_server/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── views/
    ├── public/
    └── datahousing.json
```

### 2.1. Commit dan Push ke Repository Pribadi

```bash
# Masuk ke repository Anda
cd spa-with-angular-[github-username-anda]

# Tambahkan file ke staging area
git add griya-mdp-backend

# Commit dengan pesan yang jelas
git commit -m "feat: add griya-mdp-backend project"

# Push ke GitHub
git push origin main
```

**Jika branch default adalah `master` (bukan `main`):**
```bash
git push origin master
```

**Jika belum ada branch sama sekali (repository baru):**
```bash
git branch -M main
git push -u origin main
```

---

## Langkah 3: Konfigurasi Database dan Menjalankan Project

Setelah berhasil memindahkan folder, **baca dan ikuti instruksi lengkap** pada file:
```
griya-mdp-backend/README.md
```

### Quick Start (Ringkasan)

1. **Masuk ke folder backend:**
   ```bash
   cd griya-mdp-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi MongoDB:**
   - Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Buat cluster gratis
   - Dapatkan connection string
   - Edit file `app_server/models/db.js` dan ganti `dbURI` dengan connection string Anda:
     ```javascript
     let dbURI = "mongodb+srv://username:password@cluster.mongodb.net/PAWII-SI?retryWrites=true&w=majority";
     ```

4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

5. **Test API:**
   Buka browser: `http://localhost:3000/housing`

---

## Troubleshooting

### Clone gagal karena koneksi
**Solusi:** Pastikan koneksi internet stabil, atau coba gunakan GitHub Desktop

### xcopy/copy command tidak dikenali
**Solusi:** Gunakan opsi copy manual via Windows Explorer

### Git push ditolak (rejected)
**Solusi:** 
```bash
git pull origin main --rebase
git push origin main
```

### Port 3000 sudah digunakan
**Solusi:** Ubah port di file `bin/www` atau matikan aplikasi yang menggunakan port 3000

### Module not found setelah npm install
**Solusi:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Checklist Keberhasilan ✅

Pastikan semua langkah berikut berhasil:

- [ ] Repository pribadi sudah dibuat di GitHub
- [ ] Folder `griya-mdp-backend` berhasil dicopy ke repository pribadi
- [ ] File `package.json` ada di dalam `griya-mdp-backend/`
- [ ] Perubahan sudah di-commit dan push ke GitHub
- [ ] `npm install` berjalan tanpa error
- [ ] File `db.js` sudah dikonfigurasi dengan MongoDB URI pribadi
- [ ] Aplikasi berjalan dengan `npm run dev`
- [ ] Endpoint `http://localhost:3000/housing` menampilkan data

---

## Bantuan Lebih Lanjut

- Dokumentasi lengkap: Lihat `griya-mdp-backend/README.md`
- Jika ada pertanyaan: Hubungi dosen atau asisten praktikum
- GitHub Issues: Buat issue di repository untuk diskusi

---

**Selamat mengerjakan! 🚀**
