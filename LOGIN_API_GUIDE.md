# Panduan Implementasi Login API Integration

## Deskripsi
Panduan lengkap untuk mengintegrasikan Login Component dengan Backend REST API menggunakan Auth Service. Tutorial ini mencakup implementasi login authentication, error handling, user session management, dan automatic redirection.

## Tujuan Pembelajaran
Setelah mengikuti panduan ini, Anda akan dapat:
- ✅ Mengintegrasikan Login Component dengan Backend API
- ✅ Menggunakan Auth Service untuk login authentication
- ✅ Implement show/hide password toggle
- ✅ Menampilkan success/error messages dari server
- ✅ Manage user session dengan localStorage
- ✅ Auto-redirect after successful login
- ✅ Handle authentication errors properly

---

## Prerequisites

### 1. Auth Service Sudah Dibuat

**Pastikan file sudah ada:**
- `src/app/services/auth.service.ts`

**Verify Auth Service:**
```typescript
// Check methods yang dibutuhkan:
- register(data: RegisterRequest): Observable<AuthResponse>
- login(data: LoginRequest): Observable<AuthResponse>  ✅ UNTUK LOGIN
- saveUserData(userData: any): void  ✅ UNTUK LOGIN
- getUserData(): any
- isLoggedIn(): boolean
- logout(): void
```

### 2. Backend API Sudah Berjalan

**Start Backend Server:**
```bash
cd griya-mdp-backend
npm start
```

**Expected Output:**
```
> griya-mdp-backend@0.0.0 start
> node ./bin/www

Connected To MongoDB
```

### 3. User Sudah Terdaftar

**Register user terlebih dahulu:**
- Buka: `http://localhost:4200/register`
- Daftar dengan email & password
- Atau gunakan data yang sudah ada di database

---

## Langkah 1: Update Login Component TypeScript

### 1.1 Import Dependencies

File: `src/app/login/login.ts`

**Tambahkan imports:**
```typescript
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';  // ✅ Tambah Router
import { AuthService } from '../services/auth.service';  // ✅ Import AuthService
```

**Penjelasan:**
- `Router` - Untuk navigate ke home page setelah login berhasil
- `AuthService` - Service untuk API calls dan localStorage management

### 1.2 Update Component Class

**Ganti seluruh class:**

```typescript
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formData = this.loginForm.value;

      // Kirim data ke backend API melalui AuthService
      this.authService.login(formData)
        .subscribe({
          next: (response) => {
            console.log('Login successful', response);
            this.isLoading = false;
            this.successMessage = response.message || 'Login berhasil!';
            
            // Simpan user data ke localStorage
            if (response.data) {
              this.authService.saveUserData(response.data);
            }
            
            // Redirect ke home page setelah 1 detik
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          },
          error: (error) => {
            console.error('Login failed', error);
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Email atau password salah';
            
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

**Penjelasan Detail:**

**1. Properties:**
```typescript
showPassword = false;     // Toggle visibility password
isLoading = false;        // Loading state saat API call
successMessage = '';      // Pesan sukses dari server
errorMessage = '';        // Pesan error dari server
```

**2. Constructor:**
```typescript
constructor(
  private fb: FormBuilder,
  private authService: AuthService,  // ✅ Inject AuthService
  private router: Router              // ✅ Inject Router
)
```

**3. submitLogin() Method:**

**a. Validation Check:**
```typescript
if (this.loginForm.valid) {
  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';
```

**b. Call AuthService:**
```typescript
this.authService.login(formData)
  .subscribe({
    next: (response) => { /* Success handler */ },
    error: (error) => { /* Error handler */ }
  });
```

**c. Success Handler:**
```typescript
next: (response) => {
  console.log('Login successful', response);
  this.isLoading = false;
  this.successMessage = response.message || 'Login berhasil!';
  
  // Simpan user data ke localStorage
  if (response.data) {
    this.authService.saveUserData(response.data);
  }
  
  // Redirect ke home page setelah 1 detik
  setTimeout(() => {
    this.router.navigate(['/']);
  }, 1000);
}
```

**Flow Success:**
1. Set `isLoading = false`
2. Display success message
3. Save user data to localStorage (untuk persistent session)
4. Wait 1 detik (biar user lihat success message)
5. Navigate to home page (`/`)

**d. Error Handler:**
```typescript
error: (error) => {
  console.error('Login failed', error);
  this.isLoading = false;
  this.errorMessage = error.error?.message || 'Email atau password salah';
  
  // Auto hide error message after 5 seconds
  setTimeout(() => {
    this.errorMessage = '';
  }, 5000);
}
```

**Flow Error:**
1. Log error ke console
2. Set `isLoading = false`
3. Extract error message dari backend response
4. Fallback message jika backend tidak return message
5. Auto-clear error setelah 5 detik

---

## Langkah 2: Update Login Component HTML

### 2.1 Tambah Success/Error Alerts

File: `src/app/login/login.html`

**Tambahkan di dalam `<div class="card-body">`, SEBELUM `<form>`:**

```html
<!-- Login Form Card -->
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

    <form [formGroup]="loginForm" (ngSubmit)="submitLogin()">
      <!-- Form fields -->
    </form>
  </div>
</div>
```

**Penjelasan:**
- `*ngIf="successMessage"` - Alert muncul jika ada success message
- `*ngIf="errorMessage"` - Alert muncul jika ada error message
- `alert-dismissible` - User bisa close alert manual
- `(click)="successMessage = ''"` - Clear message saat close button diklik
- Bootstrap Icons: `bi-check-circle-fill` (success), `bi-exclamation-triangle-fill` (error)

### 2.2 Update Password Field dengan Show/Hide Toggle

**Ganti Password Field dengan:**

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
      [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
      placeholder="Masukkan password Anda"
      required>
    <button 
      class="btn btn-outline-secondary" 
      type="button"
      (click)="showPassword = !showPassword">
      <i [ngClass]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
    </button>
  </div>
  <div class="invalid-feedback d-block" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
    <div *ngIf="loginForm.get('password')?.errors?.['required']">
      Password harus diisi
    </div>
    <div *ngIf="loginForm.get('password')?.errors?.['minlength']">
      Password minimal 6 karakter
    </div>
  </div>
</div>
```

**Penjelasan:**
- `<div class="input-group">` - Wrapper untuk group input + button
- `[type]="showPassword ? 'text' : 'password'"` - Dynamic type berdasarkan state
- `(click)="showPassword = !showPassword"` - Toggle state
- `bi-eye` - Icon mata terbuka (show password)
- `bi-eye-slash` - Icon mata tertutup (hide password)
- `d-block` - Force invalid-feedback display (karena input-group)

**UX Improvement:**
- User bisa lihat password yang diketik
- Helpful untuk verify password sebelum submit
- Standard feature di modern login forms

### 2.3 Update Submit Button dengan Loading State

**Ganti Submit Button dengan:**

```html
<!-- Submit Button -->
<div class="d-grid gap-2 mb-3">
  <button 
    type="submit" 
    class="btn btn-primary btn-lg py-3"
    [disabled]="loginForm.invalid || isLoading">
    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <i *ngIf="!isLoading" class="bi bi-box-arrow-in-right me-2"></i>
    {{ isLoading ? 'Memproses...' : 'Login' }}
  </button>
</div>
```

**Penjelasan:**
- `[disabled]="loginForm.invalid || isLoading"` - Disabled jika form invalid ATAU loading
- `<span class="spinner-border">` - Bootstrap loading spinner
- `*ngIf="isLoading"` - Show spinner saat loading
- `*ngIf="!isLoading"` - Show icon saat tidak loading
- `{{ isLoading ? 'Memproses...' : 'Login' }}` - Dynamic button text

**Button States:**
1. **Initial**: Enabled, text "Login", icon arrow
2. **Invalid**: Disabled, gray color
3. **Loading**: Disabled, spinner, text "Memproses..."
4. **Error**: Back to initial state

---

## Langkah 3: Testing Integration

### 3.1 Start Development Servers

**Terminal 1 - Backend:**
```bash
cd griya-mdp-backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd griya-mdp
ng serve
```

### 3.2 Test Case: Successful Login

**1. Buka Login Page:**
```
http://localhost:4200/login
```

**2. Input Valid Credentials:**
- Email: `test@example.com` (yang sudah di-register)
- Password: `password123` (password saat register)

**3. Klik "Login"**

**Expected Behavior:**
1. ✅ Button show loading spinner
2. ✅ Button text berubah "Memproses..."
3. ✅ Button disabled
4. ✅ Request POST ke `http://localhost:3000/api/auth/login`
5. ✅ Success alert muncul: "Login berhasil!"
6. ✅ Console log: "Login successful { ... }"
7. ✅ User data saved to localStorage
8. ✅ After 1 second, redirect to home page (`/`)

**Check Browser Console:**
```javascript
Login successful {
  success: true,
  message: "Login berhasil",
  data: {
    id: "673a...",
    name: "Test User",
    email: "test@example.com"
  }
}
```

**Check localStorage:**
```javascript
// Open Browser DevTools → Application → Local Storage
// Key: "user"
// Value: {"id":"673a...","name":"Test User","email":"test@example.com"}
```

### 3.3 Test Case: Invalid Credentials

**Input:**
- Email: `test@example.com`
- Password: `wrongpassword`

**Klik "Login"**

**Expected Behavior:**
1. ✅ Button show loading spinner
2. ✅ Request POST ke backend
3. ✅ Backend return 401 Unauthorized
4. ✅ Error alert muncul: "Email atau password salah"
5. ✅ Console error: "Login failed { ... }"
6. ✅ Alert hilang otomatis setelah 5 detik
7. ✅ Form tidak di-reset
8. ✅ User tetap di login page

**Backend Response (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

### 3.4 Test Case: Email Not Registered

**Input:**
- Email: `notexist@example.com`
- Password: `password123`

**Expected:**
- ✅ Same behavior as invalid credentials
- ✅ Error message: "Email atau password salah"

**Security Note:**
Backend tidak membedakan "email not found" vs "wrong password" untuk mencegah user enumeration attack.

### 3.5 Test Case: Form Validation

**1. Empty Email:**
- Email: (kosong)
- Blur dari field
- ✅ Error: "Email harus diisi"
- ✅ Button disabled

**2. Invalid Email Format:**
- Email: "invalidemail"
- Blur
- ✅ Error: "Format email tidak valid"
- ✅ Button disabled

**3. Short Password:**
- Password: "12345" (5 karakter)
- Blur
- ✅ Error: "Password minimal 6 karakter"
- ✅ Button disabled

---

## Langkah 4: Verify User Session

### 4.1 Check localStorage Data

**After successful login, open Browser DevTools:**

**Chrome/Edge:**
- Press `F12`
- Go to **Application** tab
- Left sidebar → **Local Storage** → `http://localhost:4200`
- Check key: `user`

**Value should be:**
```json
{
  "id": "673a1234567890abcdef1234",
  "name": "Test User",
  "email": "test@example.com"
}
```
---

## Next Steps

### 1. Implement Logout

**Add to Component:**
```typescript
logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}
```

**Template:**
```html
<button (click)="logout()">
  <i class="bi bi-box-arrow-right me-2"></i>Logout
</button>
```

### 2. Create Auth Guard

**File: `auth.guard.ts`**
```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
```

**Use in Routes:**
```typescript
// app.routes.ts
{
  path: 'profile',
  component: Profile,
  canActivate: [authGuard]  // ✅ Protect route
}
```

---

## Resources

- [Angular Router Navigation](https://angular.dev/guide/routing)
- [Angular HttpClient Guide](https://angular.dev/guide/http)
- [RxJS Observable](https://rxjs.dev/guide/observable)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JWT Authentication](https://jwt.io/introduction)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Login API Integration Complete! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*  

