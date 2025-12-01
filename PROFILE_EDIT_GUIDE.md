# Panduan Implementasi Edit Profile

## Deskripsi
Panduan lengkap untuk mengimplementasikan fitur Edit Profile yang memungkinkan user mengupdate informasi pribadi mereka. Tutorial ini mencakup backend API, frontend service, dan form component.

## Tujuan Pembelajaran
Setelah mengikuti panduan ini, Anda akan dapat:
- ✅ Membuat endpoint backend untuk update profile
- ✅ Update User Model dengan field tambahan (phone, location, bio, dll)
- ✅ Mengintegrasikan update profile dengan AuthService
- ✅ Membuat form edit profile dengan validasi
- ✅ Testing update profile end-to-end

---

## Prerequisites

### 1. Backend Server Running
Pastikan backend server (`griya-mdp-backend-jwt`) sudah berjalan:

```bash
cd griya-mdp-backend-jwt
npm start
```

### 2. User Sudah Login
User harus sudah login untuk dapat mengedit profile (gunakan AuthGuard).

### 3. Existing Services
- ✅ AuthService sudah ada di `src/app/services/auth.service.ts`
- ✅ User Model sudah ada di `app_server/models/user.js`

---

## Langkah 1: Update User Model (Backend)

### File: `app_server/models/user.js`

Tambahkan field baru untuk profile:

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama harus diisi"],
    minlength: [2, "Nama minimal 2 karakter"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\\.\\w{2,3})+$/, "Format email tidak valid"]
  },
  password: {
    type: String,
    required: [true, "Password harus diisi"],
    minlength: [6, "Password minimal 6 karakter"]
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  bio: {
    type: String,
    required: false,
    trim: true
  },
  job: {
    type: String,
    required: false,
    trim: true
  },
  birthdate: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false,
    enum: ['Single', 'Married', 'Divorced', ''],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ... existing methods (hash password, comparePassword, dll) ...
```

---

## Langkah 2: Buat Update Profile Endpoint (Backend)

### File: `app_server/controllers/authcontroller.js`

Tambahkan method `updateProfile`:

```javascript
// Update User Profile (Protected dengan JWT)
const updateProfile = async (req, res) => {
  try {
    // Ambil userId dari JWT token (req.user diset oleh verifyToken middleware)
    const userId = req.user.id;
    const { name, email, phone, location, bio, job, birthdate, status } = req.body;

    // Cari user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    // Validasi email jika diubah
    if (email && email !== user.email) {
      const emailRegex = /^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Format email tidak valid"
        });
      }

      // Cek apakah email sudah digunakan user lain
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email sudah digunakan oleh user lain"
        });
      }
    }

    // Update data user
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (job !== undefined) user.job = job;
    if (birthdate !== undefined) user.birthdate = birthdate;
    if (status !== undefined) user.status = status;
    
    user.updatedAt = Date.now();

    // Simpan perubahan
    await user.save();

    // Response sukses (tanpa password)
    res.status(200).json({
      success: true,
      message: "Profil berhasil diupdate",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        job: user.job,
        birthdate: user.birthdate,
        status: user.status,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message
    });
  }
};

// Export dengan method baru
module.exports = {
  register,
  login,
  getProfile,
  updateProfile  // 👈 Tambahkan ini
};
```

**Perubahan Penting:**
- ✅ Menggunakan `req.user.id` dari JWT token (diset oleh verifyToken middleware)
- ✅ Tidak lagi mengambil userId dari `req.params.id`
- ✅ Lebih aman karena user hanya bisa update profile sendiri

---

## Langkah 3: Update Routes (Backend)

### File: `app_server/routes/auth.js`

Tambahkan verifyToken middleware dan ubah route:

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/auth/register - Register user baru
router.post("/register", authController.register);

// POST /api/auth/login - Login user
router.post("/login", authController.login);

// GET /api/auth/profile - Get user profile (protected)
router.get("/profile", verifyToken, authController.getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put("/profile", verifyToken, authController.updateProfile);

module.exports = router;
```

**Perubahan Penting:**
- ✅ Route berubah dari `/profile/:id` menjadi `/profile`
- ✅ Menambahkan `verifyToken` middleware untuk proteksi
- ✅ UserId otomatis diambil dari JWT token (tidak perlu kirim di URL)

---

## Langkah 4: Update Auth Service (Frontend)

### File: `src/app/services/auth.service.ts`

Tambahkan method `updateProfile`:

```typescript
/**
 * Update user profile
 * @param userId - ID user
 * @param data - Data profile yang akan diupdate
 * @returns Observable dengan response dari backend
 */
updateProfile(userId: string, data: any): Observable<AuthResponse> {
  return this.http.put<AuthResponse>(`${this.apiUrl}/profile/${userId}`, data);
}
```

---

## Langkah 5: Buat Edit Profile Component

### Generate Component

```bash
cd griya-mdp
ng generate component profile-edit
```

### File: `src/app/profile-edit/profile-edit.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css'
})
export class ProfileEdit implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userData: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      bio: [''],
      job: [''],
      birthdate: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Get user data dari localStorage
    this.userData = this.authService.getUserData();
    
    if (!this.userData || !this.userData.id) {
      alert('Anda harus login terlebih dahulu');
      this.router.navigate(['/login']);
      return;
    }

    // Load profile dari backend
    this.authService.getProfile(this.userData.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileForm.patchValue(response.data);
        }
      },
      error: (error) => {
        console.error('Load profile error:', error);
        this.errorMessage = 'Gagal memuat data profil';
      }
    });
  }

  submitForm() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.profileForm.value;

      this.authService.updateProfile(this.userData.id, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Profil berhasil diupdate';
          
          // Update localStorage dengan data baru
          const updatedUser = { ...this.userData, ...response.data };
          this.authService.saveUserData(updatedUser);
          
          // Redirect ke profile setelah 2 detik
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Gagal mengupdate profil';
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
```

### File: `src/app/profile-edit/profile-edit.html`

```html
<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">
            <i class="bi bi-person-circle me-2"></i>Edit Profil
          </h4>
        </div>
        <div class="card-body">
          
          <!-- Success Alert -->
          @if (successMessage) {
            <div class="alert alert-success alert-dismissible fade show">
              <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
              <button type="button" class="btn-close" (click)="successMessage = ''"></button>
            </div>
          }

          <!-- Error Alert -->
          @if (errorMessage) {
            <div class="alert alert-danger alert-dismissible fade show">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
              <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
            </div>
          }

          <form [formGroup]="profileForm" (ngSubmit)="submitForm()">
            
            <h5 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informasi Dasar</h5>
            
            <!-- Name -->
            <div class="mb-3">
              <label class="form-label">Nama Lengkap *</label>
              <input type="text" class="form-control" formControlName="name" 
                     placeholder="John Doe">
              @if (profileForm.get('name')?.invalid && profileForm.get('name')?.touched) {
                <div class="text-danger small mt-1">Nama minimal 2 karakter</div>
              }
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label class="form-label">Email *</label>
              <input type="email" class="form-control" formControlName="email" 
                     placeholder="john@example.com">
              @if (profileForm.get('email')?.invalid && profileForm.get('email')?.touched) {
                <div class="text-danger small mt-1">Email tidak valid</div>
              }
            </div>

            <!-- Phone -->
            <div class="mb-3">
              <label class="form-label">Nomor Telepon</label>
              <input type="tel" class="form-control" formControlName="phone" 
                     placeholder="+62 812-3456-7890">
            </div>

            <!-- Location -->
            <div class="mb-3">
              <label class="form-label">Lokasi</label>
              <input type="text" class="form-control" formControlName="location" 
                     placeholder="Jakarta, Indonesia">
            </div>

            <hr class="my-4">
            <h5 class="mb-3"><i class="bi bi-briefcase me-2"></i>Informasi Profesional</h5>

            <!-- Job -->
            <div class="mb-3">
              <label class="form-label">Pekerjaan</label>
              <input type="text" class="form-control" formControlName="job" 
                     placeholder="Software Developer">
            </div>

            <!-- Bio -->
            <div class="mb-3">
              <label class="form-label">Bio</label>
              <textarea class="form-control" formControlName="bio" rows="4"
                        placeholder="Ceritakan tentang diri Anda..."></textarea>
            </div>

            <hr class="my-4">
            <h5 class="mb-3"><i class="bi bi-person me-2"></i>Informasi Pribadi</h5>

            <div class="row">
              <!-- Birthdate -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Tanggal Lahir</label>
                <input type="date" class="form-control" formControlName="birthdate">
              </div>

              <!-- Status -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" formControlName="status">
                  <option value="">Pilih Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-between mt-4">
              <button type="button" class="btn btn-secondary" (click)="cancel()">
                <i class="bi bi-x-circle me-2"></i>Batal
              </button>
              <button type="submit" class="btn btn-primary" 
                      [disabled]="profileForm.invalid || isLoading">
                @if (isLoading) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                }
                <i class="bi bi-save me-2"></i>Simpan Perubahan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Langkah 6: Update Routes

### File: `src/app/app.routes.ts`

Tambahkan route untuk edit profile:

```typescript
import { ProfileEdit } from './profile-edit/profile-edit';

export const routes: Routes = [
    // ... existing routes ...
    {
        path: "profile/edit",
        component: ProfileEdit,
        canActivate: [authGuard]
    },
    // ... existing routes ...
];
```

---

## Langkah 7: Update Profile Component

### Update File: `src/app/profile/profile.ts`

Implementasikan method `onEditProfile` dan `loadUserProfile` untuk load data dari API:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HousingService } from '../services/housing.service';
// ... other imports ...

export class Profile {
  // ... existing code ...

  constructor(
    private router: Router,
    private authService: AuthService,
    private housingService: HousingService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadMyProperties();
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const userData = response.data as any;
          this.user = {
            name: userData.name || 'User',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&size=150&background=667eea&color=fff&bold=true`,
            isPremium: false,
            isVerified: true,
            memberSince: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : 'Baru',
            bio: userData.bio || '',
            job: userData.job || '',
            birthdate: userData.birthdate || '',
            status: userData.status || ''
          };
        }
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  onEditProfile() {
    this.router.navigate(['/profile/edit']);
  }

  // ... existing code ...
}
```

**Perubahan Penting:**
- ✅ Import AuthService untuk load profile dari API
- ✅ Inject authService di constructor
- ✅ Panggil loadUserProfile() di ngOnInit
- ✅ Load data user dari API menggunakan JWT token
- ✅ Generate avatar dari nama user dengan ui-avatars.com
- ✅ Format tanggal memberSince dengan locale Indonesia
- ✅ Gunakan fallback values untuk field kosong

---

## Testing

### 1. Test Load Profile Data
1. Login ke aplikasi
2. Buka halaman Profile (`/profile`)
3. **Pastikan data user ter-load dari API (bukan hardcoded)**
   - Nama, email, phone sesuai dengan data di database
   - Avatar auto-generate dari nama
   - MemberSince format: "Jan 2024" (bulan & tahun)
4. Klik tombol "Edit Profile"
5. Pastikan form terisi dengan data user yang sedang login

### 2. Test Update Profile
1. Ubah beberapa field (name, email, phone, dll)
2. Klik "Simpan Perubahan"
3. Cek apakah data berhasil diupdate
4. Redirect ke halaman profile
5. **Pastikan perubahan tampil di halaman profile (data reload dari API)**

### 3. Test Validasi
- Coba kosongkan field name (required)
- Coba input email dengan format salah
- Pastikan button "Simpan" disabled saat form invalid

### 4. Test Email Conflict
- Login dengan user A
- Edit profile, ganti email menjadi email user B yang sudah terdaftar
- Pastikan muncul error "Email sudah digunakan oleh user lain"

### 5. Test JWT Protection
- Logout dari aplikasi
- Coba akses `/profile` atau `/profile/edit` langsung via URL
- Pastikan redirect ke login page (authGuard bekerja)
- Coba panggil API `GET /api/auth/profile` tanpa token
- Pastikan return error 401 Unauthorized

---

## Troubleshooting

### Data tidak ter-update
- Cek Network tab, pastikan request PUT berhasil (200 OK)
- Cek MongoDB Atlas, pastikan data tersimpan
- Cek console browser untuk error messages

### Profile tidak ter-load saat buka halaman
- Buka DevTools Network tab
- Pastikan request `GET /api/auth/profile` berhasil (200 OK)
- Cek response body, pastikan ada data user
- Verify JWT token ada di localStorage (`localStorage.getItem('token')`)
- Cek console untuk error dari loadUserProfile()

### Avatar tidak muncul
- Verify nama user tidak kosong
- Cek URL avatar di DevTools (inspect element)
- Format URL: `https://ui-avatars.com/api/?name=Nama+User&size=150&background=667eea&color=fff&bold=true`
- Pastikan `encodeURIComponent()` digunakan untuk nama

### Email validation error
- Pastikan format email benar
- Cek regex di backend sesuai dengan frontend

### Redirect tidak jalan
- Pastikan Router sudah diimport
- Cek console untuk error
- Verify route path sudah benar

### Form tidak terisi saat load Edit Profile
- Cek `getProfile()` API call berhasil
- Verify JWT token valid
- Cek `patchValue()` di ProfileEdit component
- Pastikan field names di form match dengan API response

---

## Enhancement Ideas

### 1. Upload Avatar
Tambahkan fitur upload gambar profil:
- Backend: Multer untuk handle file upload
- Frontend: Input file dan preview image
- Storage: Simpan di cloud (Cloudinary/AWS S3)

### 2. Change Password
Buat form terpisah untuk ubah password:
- Validasi old password
- Confirm new password
- Update password dengan bcrypt

### 3. Delete Account
Tambahkan opsi hapus akun:
- Konfirmasi dengan password
- Soft delete (flag is_deleted)
- Cleanup related data

---

**Implementasi Edit Profile Complete! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*
