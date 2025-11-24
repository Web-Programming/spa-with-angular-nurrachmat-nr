# Panduan Implementasi Register Component

## Deskripsi
Register Component adalah halaman pendaftaran akun pengguna baru untuk aplikasi Griya MDP. Component ini menggunakan **Reactive Forms** untuk mengelola form input dengan validasi real-time dan user experience yang baik.

## Tujuan Pembelajaran
Setelah mengikuti panduan ini, Anda akan dapat:
- ✅ Membuat form registrasi dengan Reactive Forms
- ✅ Menerapkan validasi form (required, minLength, email)
- ✅ Menampilkan pesan error yang dinamis
- ✅ Menggunakan FormBuilder untuk membuat form
- ✅ Mengimplementasikan visual feedback pada form
- ✅ Menangani form submission

---

## Langkah 1: Persiapan Component

### 1.1 Import Module yang Diperlukan
File: `src/app/register/register.ts`

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
- `RouterLink` - Untuk navigasi ke halaman login

### 1.2 Konfigurasi Component Decorator

```typescript
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Class logic
}
```

**Penjelasan:**
- `standalone: true` (default) - Component berdiri sendiri tanpa NgModule
- `imports` - Daftar module/directive yang digunakan dalam component ini

---

## Langkah 2: Membuat Form dengan FormBuilder

### 2.1 Deklarasi Form Property

```typescript
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Form initialization
  }
}
```

**Penjelasan:**
- `registerForm` bertipe `FormGroup` untuk mengelola seluruh form
- `fb: FormBuilder` di-inject melalui constructor untuk membuat form

### 2.2 Inisialisasi Form di Constructor

```typescript
constructor(private fb: FormBuilder) {
  this.registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}
```

**Penjelasan:**
- `fb.group()` - Membuat FormGroup dengan object configuration
- Format: `controlName: [initialValue, [validators]]`
- **name field**: Wajib diisi, minimal 2 karakter
- **email field**: Wajib diisi, harus format email yang valid
- **password field**: Wajib diisi, minimal 6 karakter

---

## Langkah 3: Implementasi Form Submission

### 3.1 Method submitRegister()

```typescript
submitRegister(): void {
  if (this.registerForm.valid) {
    const formData = this.registerForm.value;
    console.log('Form submitted', formData);
    
    // TODO: Kirim data ke backend API
    // this.authService.register(formData).subscribe(...)
  } else {
    console.log('Form is not valid');
  }
}
```

**Penjelasan:**
- Cek validasi dengan `this.registerForm.valid`
- Ambil data form dengan `this.registerForm.value`
- Saat ini hanya log ke console (untuk development)
- Nantinya akan terintegrasi dengan backend API

---

## Langkah 4: Membuat Template HTML

### 4.1 Struktur Section, Container dan Card

File: `src/app/register/register.html`

```html
<!-- Register Section -->
<section class="register-section py-5">
  <div class="container">
    <div class="row">
      <div class="col-lg-6 mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold text-primary mb-3">Daftar Akun</h1>
          <p class="lead text-muted">Bergabunglah dengan Griya MDP dan temukan properti impian Anda!</p>
        </div>

        <!-- Register Form Card -->
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
- `<section class="register-section py-5">` - Semantic HTML dengan padding vertical
- `container` - Container Bootstrap untuk layout responsive
- `col-lg-6 mx-auto` - Kolom 50% lebar di layar large, centered horizontal
- `text-center mb-5` - Header di tengah dengan margin bottom
- `display-4 fw-bold text-primary` - Heading besar, bold, warna primary
- `lead text-muted` - Subtitle dengan text muted
- `shadow-lg border-0` - Shadow besar tanpa border
- `p-4 p-md-5` - Padding 4 unit (default), 5 unit di medium screen ke atas

### 4.2 Form Element dengan formGroup

```html
<form [formGroup]="registerForm" (ngSubmit)="submitRegister()">
  <!-- Form fields -->
</form>
```

**Penjelasan:**
- `[formGroup]="registerForm"` - Binding ke FormGroup di TypeScript
- `(ngSubmit)="submitRegister()"` - Event handler saat form di-submit

### 4.3 Name Field dengan Validasi

```html
<div class="mb-4">
  <label for="name" class="form-label fw-semibold">
    <i class="bi bi-person-fill me-2"></i>Nama Lengkap
  </label>
  <input 
    type="text" 
    class="form-control form-control-lg" 
    id="name" 
    formControlName="name"
    [class.is-invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
    placeholder="Masukkan nama lengkap Anda"
    required>
  <div class="invalid-feedback" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
    <div *ngIf="registerForm.get('name')?.errors?.['required']">
      Nama harus diisi
    </div>
    <div *ngIf="registerForm.get('name')?.errors?.['minlength']">
      Nama minimal 2 karakter
    </div>
  </div>
  <div class="form-text" *ngIf="!registerForm.get('name')?.touched || registerForm.get('name')?.valid">
    Nama akan digunakan sebagai identitas akun Anda
  </div>
</div>
```

**Penjelasan:**
- `mb-4` - Margin bottom lebih besar untuk spacing yang lebih baik
- `fw-semibold` - Label dengan font weight semi-bold
- `<i class="bi bi-person-fill me-2">` - Bootstrap Icon untuk visual yang lebih menarik
- `form-control-lg` - Input dengan ukuran besar (lebih mudah digunakan)
- `formControlName="name"` - Menghubungkan input ke form control 'name'
- `[class.is-invalid]` - Menambahkan class 'is-invalid' jika field invalid dan sudah disentuh
- `invalid-feedback` - Pesan error Bootstrap yang muncul saat invalid
- `form-text` - Helper text yang muncul saat field belum disentuh atau valid
- Conditional display: Error muncul saat invalid, helper text muncul saat valid

### 4.4 Email Field dengan Email Validator

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
    [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
    placeholder="nama@example.com"
    required>
  <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
    <div *ngIf="registerForm.get('email')?.errors?.['required']">
      Email harus diisi
    </div>
    <div *ngIf="registerForm.get('email')?.errors?.['email']">
      Format email tidak valid
    </div>
  </div>
  <div class="form-text" *ngIf="!registerForm.get('email')?.touched || registerForm.get('email')?.valid">
    Kami tidak akan membagikan email Anda kepada pihak lain
  </div>
</div>
```

**Penjelasan:**
- `<i class="bi bi-envelope-fill">` - Icon envelope untuk field email
- `type="email"` - HTML5 email input (tambahan dari validator Angular)
- `form-control-lg` - Input size besar untuk UX yang lebih baik
- `errors?.['email']` - Error khusus untuk format email tidak valid
- `form-text` - Helper text tentang privacy yang muncul saat field valid
- Validator `Validators.email` memvalidasi format: `user@domain.com`

### 4.5 Password Field

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
    [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
    placeholder="Minimal 6 karakter"
    required>
  <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
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
- `<i class="bi bi-lock-fill">` - Icon lock untuk field password
- `type="password"` - Input tersembunyi (ditampilkan sebagai dots)
- `form-control-lg` - Input besar untuk kemudahan input
- `minlength` error - Muncul jika password kurang dari 6 karakter
- `form-text` - Tips keamanan password untuk user
- Security: Minimal 6 karakter adalah standard keamanan dasar

### 4.6 Terms & Conditions Checkbox

```html
<div class="mb-4">
  <div class="form-check">
    <input class="form-check-input" type="checkbox" id="terms">
    <label class="form-check-label" for="terms">
      Saya menyetujui <a href="#" class="text-decoration-none">Syarat & Ketentuan</a> 
      serta <a href="#" class="text-decoration-none">Kebijakan Privasi</a>
    </label>
  </div>
</div>
```

**Penjelasan:**
- `form-check` - Wrapper untuk checkbox Bootstrap
- `form-check-input` - Styling checkbox Bootstrap
- `form-check-label` - Label yang clickable untuk checkbox
- Link ke Syarat & Ketentuan dan Kebijakan Privasi
- Best practice: User harus agree sebelum registrasi

### 4.7 Submit Button dengan Disabled State

```html
<div class="d-grid gap-2 mb-3">
  <button 
    type="submit" 
    class="btn btn-primary btn-lg py-3"
    [disabled]="registerForm.invalid">
    <i class="bi bi-person-plus-fill me-2"></i>Daftar Sekarang
  </button>
</div>
```

**Penjelasan:**
- `d-grid` - Display grid untuk button full width
- `py-3` - Padding vertical untuk button lebih besar
- `<i class="bi bi-person-plus-fill">` - Icon person plus untuk visual
- `[disabled]="registerForm.invalid"` - Button disabled jika form tidak valid
- `btn-lg` - Button dengan ukuran besar
- User tidak bisa submit form yang invalid

### 4.8 Link ke Login Page

```html
<div class="text-center">
  <p class="mb-0 text-muted">Sudah punya akun? 
    <a routerLink="/login" class="text-primary text-decoration-none fw-semibold">
      Login di sini
    </a>
  </p>
</div>
```

**Penjelasan:**
- `text-muted` - Text abu-abu untuk pertanyaan
- `text-primary` - Link dengan warna primary
- `fw-semibold` - Link lebih bold untuk emphasis
- `routerLink="/login"` - Navigasi ke halaman login tanpa reload
- `text-decoration-none` - Menghilangkan underline pada link
- Memberikan opsi bagi user yang sudah punya akun

### 4.9 Benefits Info Cards

```html
<!-- Benefits Info -->
<div class="row mt-5 g-4">
  <div class="col-md-4">
    <div class="card h-100 text-center border-0 shadow-sm">
      <div class="card-body">
        <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
             style="width: 60px; height: 60px;">
          <i class="bi bi-shield-check text-white fs-3"></i>
        </div>
        <h6 class="card-title fw-bold">Aman & Terpercaya</h6>
        <p class="card-text text-muted small">Data Anda dilindungi dengan enkripsi tingkat tinggi</p>
      </div>
    </div>
  </div>

  <div class="col-md-4">
    <div class="card h-100 text-center border-0 shadow-sm">
      <div class="card-body">
        <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
             style="width: 60px; height: 60px;">
          <i class="bi bi-bell-fill text-white fs-3"></i>
        </div>
        <h6 class="card-title fw-bold">Update Terbaru</h6>
        <p class="card-text text-muted small">Dapatkan notifikasi properti baru sesuai kebutuhan</p>
      </div>
    </div>
  </div>

  <div class="col-md-4">
    <div class="card h-100 text-center border-0 shadow-sm">
      <div class="card-body">
        <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
             style="width: 60px; height: 60px;">
          <i class="bi bi-heart-fill text-white fs-3"></i>
        </div>
        <h6 class="card-title fw-bold">Simpan Favorit</h6>
        <p class="card-text text-muted small">Bookmark properti favorit untuk akses mudah</p>
      </div>
    </div>
  </div>
</div>
```

**Penjelasan:**
- `row mt-5 g-4` - Row dengan margin top dan gap antar kolom
- `col-md-4` - 3 kolom equal width (4/12 = 33.33%)
- `h-100` - Height 100% untuk card yang sama tinggi
- `text-center` - Konten di tengah
- `border-0 shadow-sm` - Tanpa border dengan shadow ringan
- `rounded-circle` - Icon dalam lingkaran
- `bg-primary/success/info bg-opacity-10` - Background transparan dengan warna berbeda
- `d-inline-flex align-items-center justify-content-center` - Flexbox untuk center icon
- **3 Benefits:**
  1. **Aman & Terpercaya** - Shield icon (security)
  2. **Update Terbaru** - Bell icon (notifications)
  3. **Simpan Favorit** - Heart icon (favorites)
- Meningkatkan conversion rate dengan menampilkan value proposition

---

## Langkah 5: Alur Kerja Validasi

### 5.1 Kapan Validasi Terjadi?

```typescript
// Validasi terjadi otomatis ketika:
1. User mengetik di input field (valueChanges)
2. User blur/keluar dari input field (touched)
3. User mencoba submit form
```

### 5.2 State Management Form

```typescript
// Form memiliki beberapa state:
- pristine / dirty  : Apakah form sudah diubah
- touched / untouched : Apakah user sudah berinteraksi
- valid / invalid   : Apakah semua validasi lolos
```

### 5.3 Conditional Error Display

```html
<!-- Error hanya muncul jika: -->
*ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"

<!-- Artinya: -->
- Field invalid (tidak memenuhi validasi)
- DAN field sudah touched (user sudah berinteraksi)
```

**Mengapa perlu touched?**
- Agar error tidak muncul saat pertama kali halaman dibuka
- Error baru muncul setelah user mulai mengisi form
- Better user experience (tidak membingungkan)

---

## Langkah 6: Testing Component

### 6.1 Test Case Manual

1. **Test Required Validation:**
   - Biarkan field kosong
   - Klik field lalu klik di luar (blur)
   - ✅ Harus muncul: "Nama harus diisi"

2. **Test MinLength Validation:**
   - Ketik 1 karakter di field Name
   - Blur dari field
   - ✅ Harus muncul: "Nama minimal 2 karakter"

3. **Test Email Format:**
   - Ketik "test" (tanpa @)
   - Blur dari field
   - ✅ Harus muncul: "Format email tidak valid"

4. **Test Password MinLength:**
   - Ketik "12345" (5 karakter)
   - Blur dari field
   - ✅ Harus muncul: "Password minimal 6 karakter"

5. **Test Submit Button:**
   - Saat form invalid: Button disabled (abu-abu)
   - Saat form valid: Button enabled (biru)

6. **Test Form Submission:**
   - Isi semua field dengan benar
   - Klik tombol Daftar
   - ✅ Buka Console: Harus ada log data form

### 6.2 Expected Output Console

```javascript
// Saat submit form yang valid:
{
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
}
```

---

## Konsep Penting

### 1. Reactive Forms vs Template-Driven Forms

**Reactive Forms (yang kita pakai):**
- ✅ Lebih scalable untuk form kompleks
- ✅ Mudah untuk testing
- ✅ Type-safe dengan TypeScript
- ✅ Validasi di TypeScript
- ✅ Lebih explisit dan predictable

**Template-Driven Forms:**
- ✅ Lebih simple untuk form sederhana
- ✅ Validasi di template HTML
- ✅ Less code di TypeScript

### 2. FormBuilder vs Manual FormGroup

**Dengan FormBuilder (yang kita pakai):**
```typescript
this.registerForm = this.fb.group({
  name: ['', [Validators.required]]
});
```

**Tanpa FormBuilder:**
```typescript
this.registerForm = new FormGroup({
  name: new FormControl('', [Validators.required])
});
```

FormBuilder lebih ringkas dan mudah dibaca.

### 3. Built-in Validators Angular

```typescript
Validators.required         // Field harus diisi
Validators.minLength(n)     // Minimal n karakter
Validators.maxLength(n)     // Maksimal n karakter
Validators.email            // Format email valid
Validators.min(n)           // Nilai minimal n
Validators.max(n)           // Nilai maksimal n
Validators.pattern(regex)   // Match dengan regex pattern
```

---

## Fitur yang Sudah Diimplementasikan

✅ **Form dengan 3 Fields:**
- Name (required, minLength: 2)
- Email (required, email format)
- Password (required, minLength: 6)

✅ **Real-time Validation:**
- Error muncul saat field touched & invalid
- Pesan error spesifik untuk setiap jenis error
- Helper text muncul saat field valid

✅ **Visual Feedback:**
- Border merah pada field invalid
- Pesan error di bawah field
- Helper text dengan tips untuk user
- Submit button disabled saat form invalid
- Bootstrap Icons untuk setiap label

✅ **User Experience:**
- Modern UI dengan section layout
- Header dengan display heading dan subtitle
- Large form controls untuk kemudahan input
- Placeholder text yang jelas
- Label dengan icon untuk visual appeal
- Link ke halaman login dengan styling
- Terms & Conditions checkbox
- Responsive layout dengan Bootstrap

✅ **Benefits Section:**
- 3 cards yang menampilkan value proposition
- Icon dalam lingkaran dengan background transparan
- Aman & Terpercaya (security)
- Update Terbaru (notifications)
- Simpan Favorit (bookmarks)

✅ **Form Handling:**
- Submit handler yang cek validasi
- Data tersimpan dalam object
- Ready untuk integrasi API

✅ **Design Consistency:**
- Selaras dengan Contact page
- Shadow-lg card dengan border-0
- Spacing konsisten (mb-4, py-5)
- Typography hierarchy yang jelas

---

## Pengembangan Selanjutnya

### 1. Confirm Password Field
Tambahkan field konfirmasi password dengan custom validator:

```typescript
// Di constructor:
this.registerForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  confirmPassword: ['', [Validators.required]]
}, { validators: this.passwordMatchValidator });

// Custom validator:
passwordMatchValidator(g: FormGroup) {
  return g.get('password')?.value === g.get('confirmPassword')?.value
    ? null : { mismatch: true };
}
```

### 2. Integrasi dengan Backend API
Gunakan HttpClient untuk kirim data ke server:

```typescript
import { HttpClient } from '@angular/common/http';

constructor(private fb: FormBuilder, private http: HttpClient) {}

submitRegister(): void {
  if (this.registerForm.valid) {
    const formData = this.registerForm.value;
    this.http.post('http://localhost:3000/api/register', formData)
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Redirect ke login atau dashboard
        },
        error: (error) => {
          console.error('Registration failed', error);
          // Tampilkan error message
        }
      });
  }
}
```

### 3. Show/Hide Password
Tambahkan toggle untuk melihat password:

```html
<div class="input-group">
    <input 
        [type]="showPassword ? 'text' : 'password'" 
        id="password" 
        class="form-control form-control-lg"
        placeholder="Minimal 6 karakter"
        formControlName="password"
        [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
        placeholder="Minimal 6 karakter">
    <button 
        class="btn btn-outline-secondary" 
        type="button"
        (click)="showPassword = !showPassword">
        <i [ngClass]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
    </button>
</div>
```

### 4. Loading State saat Submit
Tampilkan loading indicator saat proses registrasi:

```typescript
isLoading = false;

submitRegister(): void {
  if (this.registerForm.valid) {
    this.isLoading = true;
    // API call...
  }
}
```

```html
<button 
  type="submit" 
  [disabled]="registerForm.invalid || isLoading">
  <span *ngIf="isLoading" class="spinner-border spinner-border-sm"></span>
  {{ isLoading ? 'Memproses...' : 'Daftar' }}
</button>
```

### 5. Success/Error Messages
Tampilkan alert setelah registrasi:

```html
<div class="alert alert-success" *ngIf="successMessage">
  {{ successMessage }}
</div>
<div class="alert alert-danger" *ngIf="errorMessage">
  {{ errorMessage }}
</div>
```

---

## Troubleshooting

### Problem 1: Error tidak muncul
**Solusi:**
- Pastikan `CommonModule` sudah di-import
- Cek kondisi `*ngIf` sudah benar (invalid && touched)
- Periksa nama formControlName sama dengan di TypeScript

### Problem 2: Form tidak bisa di-submit
**Solusi:**
- Pastikan `ReactiveFormsModule` sudah di-import
- Cek `[formGroup]="registerForm"` sudah di-bind
- Pastikan method `submitRegister()` ada di class

### Problem 3: Button selalu disabled
**Solusi:**
- Cek validasi di TypeScript sudah benar
- Isi semua field sesuai requirement
- Periksa console untuk error JavaScript

### Problem 4: RouterLink tidak bekerja
**Solusi:**
- Import `RouterLink` di component
- Tambahkan ke array `imports`
- Pastikan route `/login` sudah terdaftar di `app.routes.ts`

---

## Referensi

- [Angular Reactive Forms Documentation](https://angular.dev/guide/forms/reactive-forms)
- [Angular Form Validation](https://angular.dev/guide/forms/form-validation)
- [Bootstrap Forms](https://getbootstrap.com/docs/5.3/forms/overview/)
- [FormBuilder API](https://angular.dev/api/forms/FormBuilder)
- [Validators API](https://angular.dev/api/forms/Validators)

---

**Happy Coding! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*
