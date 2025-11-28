# Panduan Implementasi Register API Integration

## Deskripsi
Panduan lengkap untuk mengintegrasikan Register Component dengan Backend REST API. Tutorial ini mencakup pembuatan Auth Service, implementasi API calls, error handling, dan testing.

## Tujuan Pembelajaran
Setelah mengikuti panduan ini, Anda akan dapat:
- ✅ Membuat reusable Auth Service untuk API calls
- ✅ Mengintegrasikan Register Component dengan Backend API
- ✅ Implementasi custom password match validator
- ✅ Menampilkan success/error messages dari server
- ✅ Handle loading state saat API request
- ✅ Testing API integration dengan real backend

---

## Prerequisites

### 1. Backend API Harus Sudah Berjalan

**Cek Backend:**
```bash
cd griya-mdp-backend
npm install
npm start
```

**Expected Output:**
```
> griya-mdp-backend@0.0.0 start
> node ./bin/www

Connected To MongoDB
```

**Test API Endpoint:**
Buka browser: `http://localhost:3000/api/auth/register` (akan error 404 GET, tapi artinya server jalan)

### 2. Dependencies Frontend

**Pastikan HttpClient sudah terkonfigurasi:**

File: `src/app/app.config.ts`
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // ✅ HARUS ADA
    // ... providers lain
  ]
};
```

---

## Langkah 1: Membuat Auth Service

### 1.1 Generate Service

```bash
cd griya-mdp
ng generate service services/auth
```

Atau manual buat file: `src/app/services/auth.service.ts`

### 1.2 Implementasi Auth Service

File: `src/app/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface untuk response
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  };
}

// Interface untuk register request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface untuk login request
export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Register user baru
   * @param data - Data registrasi (name, email, password, confirmPassword)
   * @returns Observable dengan response dari backend
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  /**
   * Login user
   * @param data - Data login (email, password)
   * @returns Observable dengan response dari backend
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  /**
   * Get user profile by ID
   * @param userId - ID user
   * @returns Observable dengan data user
   */
  getProfile(userId: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/profile/${userId}`);
  }

  /**
   * Save user data ke localStorage
   * @param userData - Data user yang akan disimpan
   */
  saveUserData(userData: any): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  /**
   * Get user data dari localStorage
   * @returns User data atau null
   */
  getUserData(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Cek apakah user sudah login
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return this.getUserData() !== null;
  }

  /**
   * Logout user (hapus data dari localStorage)
   */
  logout(): void {
    localStorage.removeItem('user');
  }
}
```

**Penjelasan:**

- **`@Injectable({ providedIn: 'root' })`** - Service global, bisa digunakan di mana saja
- **Interfaces** - Type safety untuk request & response
- **`private apiUrl`** - Centralized API endpoint URL
- **`HttpClient`** - Inject untuk HTTP requests
- **Methods:**
  - `register()` - POST ke `/api/auth/register`
  - `login()` - POST ke `/api/auth/login`
  - `getProfile()` - GET user profile
  - `saveUserData()` - Save ke localStorage
  - `getUserData()` - Get dari localStorage
  - `isLoggedIn()` - Check login status
  - `logout()` - Clear localStorage

---

## Langkah 2: Update Register Component TypeScript

### 2.1 Import Dependencies

File: `src/app/register/register.ts`

```typescript
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  FormBuilder, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ✅ Import Service
```

**Perubahan:**
- ✅ Hapus import `HttpClient`
- ✅ Tambah import `AbstractControl, ValidationErrors` untuk custom validator
- ✅ Tambah import `AuthService`

### 2.2 Update Component Class

```typescript
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator }); // ✅ Tambah custom validator
  }

  // Custom validator untuk password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  submitRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formData = this.registerForm.value;

      // Kirim data ke backend API melalui AuthService
      this.authService.register(formData)
        .subscribe({
          next: (response) => {
            console.log('Registration successful', response);
            this.isLoading = false;
            this.successMessage = response.message || 'Registrasi berhasil! Silakan login';
            this.registerForm.reset();
            
            // Auto hide success message after 5 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          error: (error) => {
            console.error('Registration failed', error);
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Registrasi gagal. Silakan coba lagi';
            
            // Auto hide error message after 5 seconds
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          }
        });
    } else {
      console.log('Form is not valid');
      this.errorMessage = 'Mohon lengkapi semua field dengan benar';
    }
  }
}
```

**Penjelasan:**

1. **Constructor:**
   - Inject `AuthService` (bukan `HttpClient`)
   - Tambah `confirmPassword` field
   - Set custom validator di level FormGroup: `{ validators: this.passwordMatchValidator }`

2. **Properties:**
   - `showPassword` - Toggle visibility password
   - `showConfirmPassword` - Toggle visibility confirm password
   - `isLoading` - Loading state saat API call
   - `successMessage` - Pesan sukses dari server
   - `errorMessage` - Pesan error dari server

3. **passwordMatchValidator():**
   - Custom validator di level FormGroup
   - Return `{ mismatch: true }` jika password tidak match
   - Return `null` jika valid

4. **submitRegister():**
   - Call `authService.register(formData)`
   - Subscribe dengan `next` dan `error` handlers
   - Set loading state
   - Display success/error messages
   - Reset form setelah sukses
   - Auto-clear messages setelah 5 detik

---

## Langkah 3: Update Register Component HTML

### 3.1 Tambah Success/Error Alerts

File: `src/app/register/register.html`

Tambahkan **di dalam card-body, sebelum form:**

```html
<!-- Register Form Card -->
<div class="card shadow-lg border-0">
  <div class="card-body p-4 p-md-5">
    <!-- Success Alert -->
    <div class="alert alert-success alert-dismissible fade show" role="alert" *ngIf="successMessage">
      <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" (click)="successMessage = ''" aria-label="Close"></button>
    </div>

    <!-- Error Alert -->
    <div class="alert alert-danger alert-dismissible fade show" role="alert" *ngIf="errorMessage">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
      <button type="button" class="btn-close" (click)="errorMessage = ''" aria-label="Close"></button>
    </div>

    <form [formGroup]="registerForm" (ngSubmit)="submitRegister()">
      <!-- Form fields di sini -->
    </form>
  </div>
</div>
```

**Penjelasan:**
- `*ngIf="successMessage"` - Alert muncul jika ada pesan sukses
- `*ngIf="errorMessage"` - Alert muncul jika ada pesan error
- `alert-dismissible` - Alert bisa ditutup manual
- `(click)="successMessage = ''"` - Clear message saat close button diklik
- Bootstrap Icons untuk visual feedback

### 3.2 Update Password Field dengan Show/Hide Toggle

Ganti **Password Field** dengan:

```html
<!-- Password Field -->
<div class="mb-4">
  <label for="password" class="form-label fw-semibold">
    <i class="bi bi-lock-fill me-2"></i>Password
  </label>
  <div class="input-group">
    <input 
      [type]="showPassword ? 'text' : 'password'" 
      class="form-control form-control-lg" 
      id="password" 
      formControlName="password"
      [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
      placeholder="Minimal 6 karakter"
      required>
    <button 
      class="btn btn-outline-secondary" 
      type="button"
      (click)="showPassword = !showPassword">
      <i [ngClass]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
    </button>
  </div>
  <div class="invalid-feedback d-block" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
    <div *ngIf="registerForm.get('password')?.errors?.['required']">
      Password harus diisi
    </div>
    <div *ngIf="registerForm.get('password')?.errors?.['minlength']">
      Password minimal 6 karakter
    </div>
  </div>
  <div class="form-text" *ngIf="!registerForm.get('password')?.touched || registerForm.get('password')?.valid">
    Gunakan kombinasi huruf, angka, dan simbol untuk keamanan maksimal
  </div>
</div>
```

**Penjelasan:**
- `<div class="input-group">` - Group input dengan button
- `[type]="showPassword ? 'text' : 'password'"` - Toggle type input
- `(click)="showPassword = !showPassword"` - Toggle state
- `bi-eye` / `bi-eye-slash` - Icon mata untuk show/hide
- `d-block` - Force invalid-feedback to display block (karena input-group)

### 3.3 Tambah Confirm Password Field

Tambahkan **setelah Password Field:**

```html
<!-- Confirm Password Field -->
<div class="mb-4">
  <label for="confirmPassword" class="form-label fw-semibold">
    <i class="bi bi-lock-fill me-2"></i>Konfirmasi Password
  </label>
  <div class="input-group">
    <input 
      [type]="showConfirmPassword ? 'text' : 'password'" 
      class="form-control form-control-lg" 
      id="confirmPassword" 
      formControlName="confirmPassword"
      [class.is-invalid]="(registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) || (registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched)"
      placeholder="Ketik ulang password"
      required>
    <button 
      class="btn btn-outline-secondary" 
      type="button"
      (click)="showConfirmPassword = !showConfirmPassword">
      <i [ngClass]="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
    </button>
  </div>
  <div class="invalid-feedback d-block" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
    <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">
      Konfirmasi password harus diisi
    </div>
  </div>
  <div class="invalid-feedback d-block" *ngIf="registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched">
    Password dan Konfirmasi Password tidak cocok
  </div>
  <div class="form-text" *ngIf="(!registerForm.get('confirmPassword')?.touched || registerForm.get('confirmPassword')?.valid) && !registerForm.errors?.['mismatch']">
    Pastikan konfirmasi password sama dengan password
  </div>
</div>
```

**Penjelasan:**
- `registerForm.errors?.['mismatch']` - Error dari custom validator di FormGroup level
- `registerForm.get('confirmPassword')?.touched` - Cek apakah field sudah disentuh
- Dua kondisi invalid: field error OR mismatch error
- Show/hide toggle sama seperti password field

### 3.4 Update Submit Button dengan Loading State

Ganti **Submit Button** dengan:

```html
<!-- Submit Button -->
<div class="d-grid gap-2 mb-3">
  <button 
    type="submit" 
    class="btn btn-primary btn-lg py-3"
    [disabled]="registerForm.invalid || isLoading">
    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <i *ngIf="!isLoading" class="bi bi-person-plus-fill me-2"></i>
    {{ isLoading ? 'Memproses...' : 'Daftar Sekarang' }}
  </button>
</div>
```

**Penjelasan:**
- `[disabled]="registerForm.invalid || isLoading"` - Button disabled jika form invalid ATAU loading
- `<span class="spinner-border">` - Loading spinner Bootstrap
- `*ngIf="isLoading"` - Tampilkan spinner saat loading
- `*ngIf="!isLoading"` - Tampilkan icon saat tidak loading
- `{{ isLoading ? 'Memproses...' : 'Daftar Sekarang' }}` - Text dinamis

---

## Langkah 4: Testing Integration

### 4.1 Start Backend Server
### 4.2 Start Angular Development Server
### 4.3 Test di Browser

**1. Buka Register Page:**
```
http://localhost:4200/register
```

**2. Test Validations:**

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Empty name | "" | ❌ "Nama harus diisi" |
| Short name | "A" | ❌ "Nama minimal 2 karakter" |
| Invalid email | "test" | ❌ "Format email tidak valid" |
| Short password | "12345" | ❌ "Password minimal 6 karakter" |
| Password mismatch | password: "123456", confirm: "123457" | ❌ "Password dan Konfirmasi Password tidak cocok" |
| Valid form | All valid | ✅ Form dapat disubmit |

**3. Test API Integration:**

**Input Valid Data:**
- Nama: "Test User"
- Email: "test@example.com"
- Password: "password123"
- Konfirmasi Password: "password123"

**Klik "Daftar Sekarang"**

**Expected Behavior:**
1. ✅ Button show loading spinner
2. ✅ Button text berubah "Memproses..."
3. ✅ Button disabled
4. ✅ Request POST ke `http://localhost:3000/api/auth/register`
5. ✅ Success alert muncul: "Registrasi berhasil! Silakan login"
6. ✅ Form di-reset
7. ✅ Alert hilang otomatis setelah 5 detik

**Check Browser Console:**
```javascript
Registration successful {
  success: true,
  message: "Registrasi berhasil! Silakan login",
  data: {
    id: "673a...",
    name: "Test User",
    email: "test@example.com",
    createdAt: "2025-11-25T..."
  }
}
```

**4. Test Error Scenarios:**

**Duplicate Email:**
- Register dengan email yang sama 2x
- ✅ Error alert: "Email sudah terdaftar"

**Server Offline:**
- Stop backend server (Ctrl+C)
- Submit form
- ✅ Error alert: "Registrasi gagal. Silakan coba lagi"

**Network Error:**
- Block port 3000 di firewall
- ✅ Error alert muncul

### 4.4 Test dengan Postman (Optional)

**Method:** POST  
**URL:** `http://localhost:3000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Postman Test",
  "email": "postman@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login",
  "data": {
    "id": "673a1234567890abcdef1234",
    "name": "Postman Test",
    "email": "postman@example.com",
    "createdAt": "2025-11-25T10:30:00.000Z"
  }
}
```

---

## Langkah 5: Verify Database

### 5.1 Check MongoDB Compas

**Expected Document:**
```javascript
{
  "_id": ObjectId("673a1234567890abcdef1234"),
  "name": "Test User",
  "email": "test@example.com",
  "password": "$2a$10$XYZ...", // Hashed password
  "createdAt": ISODate("2025-11-25T10:30:00Z"),
  "updatedAt": ISODate("2025-11-25T10:30:00Z"),
  "__v": 0
}
```

**Verify:**
- ✅ Password ter-hash (bukan plain text)
- ✅ Email lowercase
- ✅ Timestamp createdAt dan updatedAt ada

---

## Troubleshooting

### Problem 1: CORS Error

**Error di Console:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/register' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solusi:**

Backend `app.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

Install cors package:
```bash
cd griya-mdp-backend
npm install cors
```

### Problem 2: HttpClient Provider Missing

**Error:**
```
NullInjectorError: No provider for HttpClient!
```

**Solusi:**

File `app.config.ts`:
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // ✅ Tambahkan ini
  ]
};
```

### Problem 3: AuthService Not Found

**Error:**
```
Cannot find module './services/auth.service'
```

**Solusi:**
- Pastikan file `auth.service.ts` ada di `src/app/services/`
- Check import path: `import { AuthService } from '../services/auth.service';`
- Restart Angular dev server

### Problem 4: Password Mismatch Validator Tidak Bekerja

**Cek:**

1. Validator di FormGroup config:
```typescript
this.registerForm = this.fb.group({
  // ... fields
}, { validators: this.passwordMatchValidator }); // ✅ Harus ada
```

2. Check di HTML:
```html
*ngIf="registerForm.errors?.['mismatch']" // ✅ errors di FormGroup level
```

### Problem 5: Form Tidak Reset Setelah Submit

**Solusi:**

```typescript
next: (response) => {
  this.registerForm.reset(); // ✅ Tambahkan ini
  this.successMessage = response.message;
}
```

### Problem 6: Backend Connection Refused

**Error:**
```
HttpErrorResponse {error: {…}, status: 0, statusText: "Unknown Error"}
```

**Solusi:**
- Start backend server: `npm start`
- Check port 3000: `http://localhost:3000`
- Check MongoDB connection di backend console

---

## Best Practices

### 1. Environment Configuration

**Create environment files:**

`src/environments/environment.ts` (development):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

`src/environments/environment.prod.ts` (production):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.griyamdp.com/api'
};
```

**Update Service:**
```typescript
import { environment } from '../../environments/environment';

export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
}
```
---

## Resources

- [Angular HttpClient Guide](https://angular.dev/guide/http)
- [RxJS Observable](https://rxjs.dev/guide/observable)
- [Angular Forms Validation](https://angular.dev/guide/forms/form-validation)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [Bcrypt.js Documentation](https://github.com/dcodeIO/bcrypt.js)

---

**Integration Complete! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*  