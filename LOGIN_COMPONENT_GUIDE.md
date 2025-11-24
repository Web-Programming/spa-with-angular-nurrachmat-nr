# Panduan Implementasi Login Component

## Deskripsi
Login Component adalah halaman autentikasi untuk pengguna yang sudah terdaftar di aplikasi Griya MDP. Component ini menggunakan **Reactive Forms** untuk mengelola form login dengan validasi real-time, user experience yang optimal, dan desain yang konsisten dengan Register Component.

## Tujuan Pembelajaran
Setelah mengikuti panduan ini, Anda akan dapat:
- ✅ Membuat form login dengan Reactive Forms
- ✅ Menerapkan validasi form (required, email, minLength)
- ✅ Mengimplementasikan Remember Me checkbox
- ✅ Menambahkan Social Login UI (Google & Facebook)
- ✅ Membuat tampilan yang konsisten dengan component lain
- ✅ Menangani form submission untuk autentikasi

---

## Langkah 1: Persiapan Component

### 1.1 Import Module yang Diperlukan
File: `src/app/login/login.ts`

```typescript
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
```

**Penjelasan:**
- `CommonModule` - Untuk directive seperti *ngIf
- `ReactiveFormsModule` - Untuk menggunakan Reactive Forms
- `FormGroup` - Tipe data untuk mengelola grup form control
- `Validators` - Built-in validators Angular (required, email, minLength)
- `FormBuilder` - Service untuk membuat form dengan syntax yang lebih ringkas
- `RouterLink` - Untuk navigasi ke halaman register

### 1.2 Konfigurasi Component Decorator

```typescript
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Class logic
}
```

**Penjelasan:**
- `standalone: true` (default) - Component berdiri sendiri tanpa NgModule
- `imports` - Daftar module/directive yang digunakan dalam component ini
- Sama dengan Register Component untuk konsistensi

---

## Langkah 2: Membuat Form dengan FormBuilder

### 2.1 Deklarasi Form Property

```typescript
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Form initialization
  }
}
```

**Penjelasan:**
- `loginForm` bertipe `FormGroup` untuk mengelola seluruh form
- `fb: FormBuilder` di-inject melalui constructor untuk membuat form
- Naming convention: `loginForm` untuk membedakan dari `registerForm`

### 2.2 Inisialisasi Form di Constructor

```typescript
constructor(private fb: FormBuilder) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}
```

**Penjelasan:**
- `fb.group()` - Membuat FormGroup dengan object configuration
- Format: `controlName: [initialValue, [validators]]`
- **email field**: Wajib diisi, harus format email yang valid (sebagai username)
- **password field**: Wajib diisi, minimal 6 karakter
- Login form lebih simple dari register (hanya 2 fields)

**Perbedaan dengan Register:**
- Register: 3 fields (name, email, password)
- Login: 2 fields (email sebagai username, password)
- Login tidak perlu validasi nama karena fokus pada autentikasi

---

## Langkah 3: Implementasi Form Submission

### 3.1 Method submitLogin()

```typescript
submitLogin(): void {
  if (this.loginForm.valid) {
    const formData = this.loginForm.value;
    console.log('Login submitted', formData);
    
    // TODO: Kirim data ke backend API untuk autentikasi
    // this.authService.login(formData).subscribe(...)
  } else {
    console.log('Form is not valid');
  }
}
```

**Penjelasan:**
- Cek validasi dengan `this.loginForm.valid`
- Ambil data form dengan `this.loginForm.value`
- Saat ini hanya log ke console (untuk development)
- Nantinya akan terintegrasi dengan backend API untuk autentikasi
- Backend akan verify email & password, kemudian return JWT token

**Flow Autentikasi (Future Implementation):**
1. User input email & password
2. Submit ke backend API `/api/login`
3. Backend verify credentials
4. Jika valid: return JWT token + user data
5. Simpan token di localStorage/sessionStorage
6. Redirect ke dashboard/home
7. Jika invalid: tampilkan error message

---

## Langkah 4: Membuat Template HTML

### 4.1 Struktur Section, Container dan Card

File: `src/app/login/login.html`

```html
<!-- Login Section -->
<section class="login-section py-5">
  <div class="container">
    <div class="row">
      <div class="col-lg-5 mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold text-primary mb-3">Login</h1>
          <p class="lead text-muted">Selamat datang kembali! Silakan login ke akun Anda</p>
        </div>

        <!-- Login Form Card -->
        <div class="card shadow-lg border-0">
          <div class="card-body p-4 p-md-5">
            <!-- Form akan berada di sini -->
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Penjelasan:**
- `<section class="login-section py-5">` - Semantic HTML dengan padding vertical
- `col-lg-5 mx-auto` - Kolom lebih kecil (5/12) dari register (6/12) karena form lebih simple
- `display-4 fw-bold text-primary` - Heading konsisten dengan register
- `lead text-muted` - Subtitle yang welcoming untuk returning users
- `shadow-lg border-0` - Card styling sama dengan register
- `p-4 p-md-5` - Padding responsive

**Design Decision:**
- Login form lebih narrow (col-lg-5) karena hanya 2 fields
- Register form lebih wide (col-lg-6) karena 3 fields + benefits cards

### 4.2 Form Element dengan formGroup

```html
<form [formGroup]="loginForm" (ngSubmit)="submitLogin()">
  <!-- Form fields -->
</form>
```

**Penjelasan:**
- `[formGroup]="loginForm"` - Binding ke FormGroup di TypeScript
- `(ngSubmit)="submitLogin()"` - Event handler saat form di-submit
- Sama dengan register untuk konsistensi

### 4.3 Email Field (Username)

```html
<div class="mb-4">
  <label for="email" class="form-label fw-semibold">
    <i class="bi bi-envelope-fill me-2"></i>Email
  </label>
  <input 
    type="email" 
    class="form-control form-control-lg" 
    id="email" 
    formControlName="email"
    [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
    placeholder="nama@example.com"
    required>
  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
    <div *ngIf="loginForm.get('email')?.errors?.['required']">
      Email harus diisi
    </div>
    <div *ngIf="loginForm.get('email')?.errors?.['email']">
      Format email tidak valid
    </div>
  </div>
  <div class="form-text" *ngIf="!loginForm.get('email')?.touched || loginForm.get('email')?.valid">
    Gunakan email yang terdaftar
  </div>
</div>
```

**Penjelasan:**
- `<i class="bi bi-envelope-fill">` - Icon envelope untuk visual consistency
- `formControlName="email"` - Email digunakan sebagai username
- `form-control-lg` - Input besar untuk UX yang baik
- `invalid-feedback` - Pesan error untuk required & email format
- `form-text` - Helper text: "Gunakan email yang terdaftar"
- Styling dan validasi sama dengan register untuk konsistensi

**Mengapa Email sebagai Username?**
- ✅ Unique identifier (tidak ada duplikasi)
- ✅ Mudah diingat user
- ✅ Standar industry practice
- ✅ Bisa untuk reset password via email

### 4.4 Password Field

```html
<div class="mb-4">
  <label for="password" class="form-label fw-semibold">
    <i class="bi bi-lock-fill me-2"></i>Password
  </label>
  <input 
    type="password" 
    class="form-control form-control-lg" 
    id="password" 
    formControlName="password"
    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
    placeholder="Masukkan password Anda"
    required>
  <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
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
- `<i class="bi bi-lock-fill">` - Icon lock untuk security visual
- `type="password"` - Input tersembunyi (dots)
- `minlength` validator - Konsisten dengan register (minimal 6)
- Tidak ada `form-text` helper karena user sudah tahu passwordnya
- Fokus pada error handling untuk login yang gagal

### 4.5 Remember Me & Forgot Password

```html
<div class="d-flex justify-content-between align-items-center mb-4">
  <div class="form-check">
    <input class="form-check-input" type="checkbox" id="rememberMe">
    <label class="form-check-label" for="rememberMe">
      Ingat saya
    </label>
  </div>
  <a href="#" class="text-primary text-decoration-none small">
    Lupa password?
  </a>
</div>
```

**Penjelasan:**
- `d-flex justify-content-between` - Flexbox untuk align Remember Me (kiri) dan Forgot Password (kanan)
- **Remember Me checkbox**: 
  - Untuk keep user logged in (persistent session)
  - Implementation: Simpan token di localStorage vs sessionStorage
- **Forgot Password link**:
  - Navigate ke halaman reset password
  - Send email dengan reset link
  - `small` class untuk ukuran text lebih kecil
- Kedua fitur ini adalah standard UX untuk login form


### 4.6 Submit Button

```html
<div class="d-grid gap-2 mb-3">
  <button 
    type="submit" 
    class="btn btn-primary btn-lg py-3"
    [disabled]="loginForm.invalid">
    <i class="bi bi-box-arrow-in-right me-2"></i>Login
  </button>
</div>
```

**Penjelasan:**
- `d-grid` - Display grid untuk button full width
- `py-3` - Padding vertical untuk button lebih besar
- `<i class="bi bi-box-arrow-in-right">` - Icon arrow masuk untuk visual "login"
- `[disabled]="loginForm.invalid"` - Button disabled jika form tidak valid
- Text: "Login" (simple & clear)


### 4.7 Divider untuk Social Login

```html
<div class="position-relative my-4">
  <hr class="text-muted">
  <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
    atau
  </span>
</div>
```

**Penjelasan:**
- `position-relative` - Parent untuk absolute positioning
- `<hr>` - Horizontal line sebagai divider
- `position-absolute top-50 start-50 translate-middle` - Center text di tengah line
- `bg-white px-3` - Background putih dengan padding horizontal untuk menutupi line
- Text "atau" - Separator antara traditional login dan social login
- Visual yang clean dan modern


**Benefits of Social Login:**
- ✅ Faster registration/login
- ✅ No password to remember
- ✅ Trusted third-party authentication
- ✅ Higher conversion rate

### 4.9 Register Link

```html
<div class="text-center">
  <p class="mb-0 text-muted">Belum punya akun? 
    <a routerLink="/register" class="text-primary text-decoration-none fw-semibold">
      Daftar sekarang
    </a>
  </p>
</div>
```

**Penjelasan:**
- `text-center` - Centered text
- `text-muted` - Gray color untuk pertanyaan
- `text-primary fw-semibold` - Blue & bold untuk link (emphasis)
- `routerLink="/register"` - Navigate ke register page tanpa reload
- Reciprocal link: Login ↔ Register
- UX: Easy switch untuk new users

## Langkah 5: Alur Kerja Validasi

### 5.1 Kapan Validasi Terjadi?

```typescript
// Validasi terjadi otomatis ketika:
1. User mengetik di input field (valueChanges)
2. User blur/keluar dari input field (touched)
3. User mencoba submit form
```

**Real-time Validation:**
- Angular monitors form state continuously
- Validation runs on every keystroke (for instant feedback)
- Visual feedback immediate (red border, error message)

### 5.2 State Management Form

```typescript
// Form memiliki beberapa state:
- pristine / dirty  : Apakah form sudah diubah
- touched / untouched : Apakah user sudah berinteraksi
- valid / invalid   : Apakah semua validasi lolos
```

**State Usage:**
- `pristine`: Form belum diubah sama sekali
- `dirty`: User sudah mengetik sesuatu
- `touched`: User sudah click/focus pada field
- `untouched`: Field belum pernah di-focus
- `valid`: Semua validators pass
- `invalid`: Ada validator yang fail

### 5.3 Conditional Error Display

```html
<!-- Error hanya muncul jika: -->
*ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"

<!-- Artinya: -->
- Field invalid (tidak memenuhi validasi)
- DAN field sudah touched (user sudah berinteraksi)
```

**Mengapa perlu touched?**
- Agar error tidak muncul saat pertama kali halaman dibuka
- Error baru muncul setelah user mulai mengisi form
- Better UX: Tidak menakuti user dengan error messages di awal
- Progressive disclosure: Show errors only when relevant

---

## Langkah 6: Testing Component

### 6.1 Test Case Manual

1. **Test Email Required Validation:**
   - Biarkan email kosong
   - Klik field lalu klik di luar (blur)
   - ✅ Harus muncul: "Email harus diisi"

2. **Test Email Format Validation:**
   - Ketik "test" (tanpa @domain.com)
   - Blur dari field
   - ✅ Harus muncul: "Format email tidak valid"

3. **Test Valid Email:**
   - Ketik "user@example.com"
   - ✅ Error hilang, helper text muncul: "Gunakan email yang terdaftar"

4. **Test Password Required:**
   - Biarkan password kosong
   - Blur dari field
   - ✅ Harus muncul: "Password harus diisi"

5. **Test Password MinLength:**
   - Ketik "12345" (5 karakter)
   - Blur dari field
   - ✅ Harus muncul: "Password minimal 6 karakter"

6. **Test Submit Button State:**
   - Saat form invalid: Button disabled (abu-abu, not clickable)
   - Saat form valid: Button enabled (biru, clickable)

7. **Test Form Submission:**
   - Isi email: test@example.com
   - Isi password: password123
   - Klik tombol Login
   - ✅ Buka Console: Harus ada log data form

8. **Test Remember Me Checkbox:**
   - Click checkbox
   - ✅ Checkbox ter-check
   - Click lagi
   - ✅ Checkbox unchecked

9. **Test Navigation Links:**
   - Click "Daftar sekarang"
   - ✅ Navigate ke /register
   - Click "Lupa password?"
   - ✅ Navigate atau show modal (tergantung implementasi)

### 6.2 Expected Output Console

```javascript
// Saat submit form yang valid:
{
  email: "test@example.com",
  password: "password123"
}
```

**Note:** Password di-log hanya untuk development. Di production, jangan pernah log password!

---

## Pengembangan Selanjutnya

### 1. Integrasi dengan Backend API

```typescript
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

constructor(
  private fb: FormBuilder, 
  private http: HttpClient,
  private router: Router
) {}

submitLogin(): void {
  if (this.loginForm.valid) {
    const credentials = this.loginForm.value;
    
    this.http.post('http://localhost:3000/api/login', credentials)
      .subscribe({
        next: (response: any) => {
          // Simpan token
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Redirect ke dashboard
          this.router.navigate(['/home']);
        },
        error: (error) => {
          // Tampilkan error message
          console.error('Login failed', error);
          this.errorMessage = 'Email atau password salah';
        }
      });
  }
}
```

### 2. Remember Me Implementation

```typescript
// Add property
rememberMe: boolean = false;

// In template
<input 
  class="form-check-input" 
  type="checkbox" 
  id="rememberMe"
  [(ngModel)]="rememberMe">

// In submitLogin
if (this.rememberMe) {
  localStorage.setItem('token', token); // Persistent
} else {
  sessionStorage.setItem('token', token); // Session only
}
```

### 3. Show/Hide Password Toggle

```typescript
// Add property
showPassword: boolean = false;

// In template
<div class="input-group">
  <input 
    [type]="showPassword ? 'text' : 'password'" 
    class="form-control form-control-lg"
    formControlName="password">
  <button 
    class="btn btn-outline-secondary" 
    type="button"
    (click)="showPassword = !showPassword">
    <i [class]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
  </button>
</div>
```

### 4. Error Messages dari Backend

```typescript
// Add property
errorMessage: string = '';

// In submitLogin error handler
error: (error) => {
  if (error.status === 401) {
    this.errorMessage = 'Email atau password salah';
  } else if (error.status === 403) {
    this.errorMessage = 'Akun Anda telah diblokir';
  } else {
    this.errorMessage = 'Terjadi kesalahan. Silakan coba lagi';
  }
}

// In template
<div class="alert alert-danger" *ngIf="errorMessage">
  <i class="bi bi-exclamation-triangle-fill me-2"></i>
  {{ errorMessage }}
</div>
```

### 5. Loading State saat Login

```typescript
// Add property
isLoading: boolean = false;

// In submitLogin
submitLogin(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    
    this.http.post(...)
      .subscribe({
        next: () => {
          this.isLoading = false;
          // ...
        },
        error: () => {
          this.isLoading = false;
          // ...
        }
      });
  }
}

// In template
<button 
  type="submit" 
  [disabled]="loginForm.invalid || isLoading">
  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
  {{ isLoading ? 'Memproses...' : 'Login' }}
</button>
```

### 6. Forgot Password Modal

```typescript
// Add property
showForgotPasswordModal: boolean = false;
forgotPasswordEmail: string = '';

// Method
openForgotPassword() {
  this.showForgotPasswordModal = true;
}

sendResetPasswordEmail() {
  this.http.post('/api/forgot-password', { email: this.forgotPasswordEmail })
    .subscribe({
      next: () => {
        alert('Email reset password telah dikirim');
        this.showForgotPasswordModal = false;
      }
    });
}

// In template - add modal
<div class="modal" *ngIf="showForgotPasswordModal">
  <!-- Modal content untuk input email -->
</div>
```

---

## Troubleshooting

### Problem 1: Button selalu disabled
**Solusi:**
- Cek semua validasi di TypeScript
- Isi email dengan format valid: `user@example.com`
- Isi password minimal 6 karakter
- Periksa console untuk error

### Problem 2: Form tidak submit
**Solusi:**
- Pastikan `ReactiveFormsModule` sudah di-import
- Cek `[formGroup]="loginForm"` sudah di-bind
- Pastikan method `submitLogin()` ada di class
- Verify `(ngSubmit)` event binding

### Problem 3: Email validation tidak bekerja
**Solusi:**
- Pastikan `Validators.email` ada di form definition
- Test dengan format: `name@domain.com`
- Cek typo di `formControlName="email"`

### Problem 4: Remember Me tidak berfungsi
**Solusi:**
- Implement `[(ngModel)]` binding atau FormControl
- Install `@angular/forms` jika belum
- Add `FormsModule` ke imports (untuk ngModel)

### Problem 5: Social login buttons tidak responsive
**Solusi:**
- Install social login library
- Configure OAuth credentials di Google/Facebook Console
- Setup redirect URIs
- Implement callback handlers

---

## Referensi

- [Angular Reactive Forms Documentation](https://angular.dev/guide/forms/reactive-forms)
- [Angular Form Validation](https://angular.dev/guide/forms/form-validation)
- [Bootstrap Forms](https://getbootstrap.com/docs/5.3/forms/overview/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Password Hashing Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

**Happy Coding! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*
