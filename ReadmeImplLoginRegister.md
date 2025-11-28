# Panduan Implementasi Griya MDP - Single Page Application

## Deskripsi Project
**Griya MDP** adalah aplikasi Single Page Application (SPA) berbasis Angular untuk platform properti (real estate). Aplikasi ini menyediakan fitur pencarian, detail properti, kontak, registrasi, dan login dengan desain modern menggunakan Bootstrap 5.

## Instalasi dan Setup

### 1. Prerequisites
Pastikan sudah terinstall:
- Node.js (v20+)
- npm (v10+)
- Angular CLI (v18+)

### 2. Install Dependencies
```bash
cd griya-mdp
npm install
```

### 3. Jalankan Development Server
```bash
ng serve
```

Akses aplikasi di: `http://localhost:4200`

---

## Panduan Implementasi Components

### 📝 **1. Implementasi Register Component**

**Tujuan:** Membuat halaman registrasi user baru dengan validasi form yang lengkap.

**Fitur:**
- Form dengan 3 fields: Nama, Email, Password
- Validasi real-time (required, minLength, email format)
- Visual feedback (error messages, helper text)
- Terms & Conditions checkbox
- Benefits info cards
- Link navigasi ke Login page

**📚 Dokumentasi Lengkap:** [REGISTER_COMPONENT_GUIDE.md](./REGISTER_COMPONENT_GUIDE.md)

**Waktu estimasi:** 20 menit

---

### 🔐 **2. Implementasi Login Component**

**Tujuan:** Membuat halaman autentikasi untuk existing users.

**Fitur:**
- Form dengan 2 fields: Email (sebagai username), Password
- Validasi real-time (required, email, minLength)
- Remember Me checkbox
- Forgot Password link
- Social Login UI (Google & Facebook)
- Security info alert
- Link navigasi ke Register page

**📚 Dokumentasi Lengkap:** [LOGIN_COMPONENT_GUIDE.md](./LOGIN_COMPONENT_GUIDE.md)

**Waktu estimasi:** 10 menit

---

### 📧 **3. Implementasi Contact Component**

**Tujuan:** Membuat halaman kontak dengan form untuk menghubungi perusahaan.

**📚 Dokumentasi Lengkap:** [CONTACT_COMPONENT_IMPLEMENTATION_GUIDE.md](./CONTACT_COMPONENT_IMPLEMENTATION_GUIDE.md)

**Waktu estimasi:** 10 menit

---
# **TUGAS MANDIRI**

## 📧 **Implementasi Contact Component**

**Fitur:**
- Validasi real-time dengan error messages

**Note:**
Component Contact saat ini menggunakan template-driven approach (tanpa Reactive Forms). Anda perlu **mengubahnya** menjadi Reactive Forms sesuai instruksi berikut

**Langkah-langkah:**
1. **Setup Component:**
   - Import `CommonModule`, `ReactiveFormsModule`, `FormBuilder`, `Validators`
   - Tambahkan ke array `imports` di decorator

2. **Buat FormGroup:**
   ```typescript
   contactForm: FormGroup;
   
   constructor(private fb: FormBuilder) {
     this.contactForm = this.fb.group({
       fullName: ['', [Validators.required, Validators.minLength(2)]],
       email: ['', [Validators.required, Validators.email]],
       phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]+$/)]],
       subject: ['', [Validators.required]],
       message: ['', [Validators.required, Validators.minLength(10)]],
       newsletter: [false]
     });
   }
   ```

3. **Update Template HTML:**
   - Bind form dengan `[formGroup]="contactForm"`
   - Setiap input dengan `formControlName="fieldName"`
   - Tambahkan `[class.is-invalid]` untuk visual feedback
   - Implementasi error messages dengan `*ngIf`
   - Submit button dengan `(ngSubmit)="submitContact()"`
   - Button disabled dengan `[disabled]="contactForm.invalid"`

4. **Implementasi Submit Handler:**
   ```typescript
   submitContact(): void {
     if (this.contactForm.valid) {
       const formData = this.contactForm.value;
       console.log('Contact form submitted', formData);
       // TODO: Kirim ke backend API
     }
   }
   ```

5. **Validasi yang harus diimplementasikan:**
   - Nama: required, minimal 2 karakter
   - Email: required, format email valid
   - Phone: required, hanya angka/+/-/spasi
   - Subject: required, pilih dari dropdown
   - Message: required, minimal 10 karakter
   - Newsletter: optional checkbox

6. **Error Messages:**
   - "Field harus diisi" untuk required
   - "Minimal X karakter" untuk minLength
   - "Format email tidak valid" untuk email
   - "Format nomor telepon tidak valid" untuk pattern

7. **Testing:**
   - Test semua validasi (required, minLength, email, pattern)
   - Test error messages muncul saat touched & invalid
   - Test submit button disabled saat form invalid
   - Test form submission dengan data valid
   - Test reset button untuk clear form

**Contoh Potongan Form Contact:**
```html
<form [formGroup]="contactForm" (ngSubmit)="submitContact()">
  <div class="mb-4">
    <label for="fullName" class="form-label fw-semibold">
      <i class="bi bi-person-fill me-2"></i>Nama Lengkap
    </label>
    <input 
      type="text" 
      class="form-control form-control-lg" 
      id="fullName" 
      formControlName="fullName"
      [class.is-invalid]="contactForm.get('fullName')?.invalid && contactForm.get('fullName')?.touched">
    <div class="invalid-feedback" *ngIf="contactForm.get('fullName')?.invalid && contactForm.get('fullName')?.touched">
      <div *ngIf="contactForm.get('fullName')?.errors?.['required']">
        Nama lengkap harus diisi
      </div>
      <div *ngIf="contactForm.get('fullName')?.errors?.['minlength']">
        Nama minimal 2 karakter
      </div>
    </div>
  </div>
  <!-- Repeat untuk fields lainnya -->
</form>
```

**📋 Checklist Implementasi:**
- [ ] Import `ReactiveFormsModule`, `FormBuilder`, `Validators`
- [ ] Tambahkan imports ke component decorator
- [ ] Buat `FormGroup` dengan `FormBuilder` di constructor
- [ ] Definisikan semua 6 form controls (fullName, email, phone, subject, message, newsletter)
- [ ] Implementasi validasi untuk setiap field
- [ ] Update template dengan `[formGroup]` binding
- [ ] Tambahkan `formControlName` ke setiap input
- [ ] Implementasi conditional error messages dengan `*ngIf`
- [ ] Tambahkan `[class.is-invalid]` untuk visual feedback
- [ ] Implementasi `submitContact()` method
- [ ] Test semua validasi manual
- [ ] Verify console log saat submit

**Waktu estimasi:** 45 menit

---

### 👤 **4. Implementasi Profile Component (Basic & Modularitas)**

**Tujuan:** Membuat halaman profil pengguna di Griya MDP.

**📚 Dokumentasi Lengkap:** 
- [PROFILE_COMPONENT_BASIC_GUIDE](./PROFILE_COMPONENT_BASIC_GUIDE.md) - Basic
- [PROFILE_COMPONENT_MODULARISASI](./PROFILE_COMPONENT_MODULARISASI_GUIDE.md) - Modularisasi

**Waktu estimasi:** 1 jam
---

## Resources & References

### Official Documentation
- [Angular Documentation](https://angular.dev)
- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3)
- [Bootstrap Icons](https://icons.getbootstrap.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Component Guides
- [Register Component Guide](./REGISTER_COMPONENT_GUIDE.md) - Panduan lengkap implementasi Register
- [Login Component Guide](./LOGIN_COMPONENT_GUIDE.md) - Panduan lengkap implementasi Login
- [Contact Component Guide](./CONTACT_COMPONENT_IMPLEMENTATION_GUIDE.md) - Panduan lengkap implementasi Contact
- [Profile Component Guide - Basic](./PROFILE_COMPONENT_BASIC_GUIDE.md) - Panduan lengkap implementasi Halaman Profile (Basic)
- [Profile Component Guide - Modularity](./PROFILE_COMPONENT_MODULARISASI_GUIDE.md) - Panduan lengkap implementasi Halaman Profile (Modularitas)

### Tutorials & Examples
- [Angular Forms Tutorial](https://angular.dev/guide/forms)
- [Form Validation Examples](https://angular.dev/guide/forms/form-validation)
- [Bootstrap Form Examples](https://getbootstrap.com/docs/5.3/forms/overview/)

---

**Happy Coding! 🚀**
