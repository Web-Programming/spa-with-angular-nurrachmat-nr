# Panduan Implementasi Contact Component

## Deskripsi
Dokumen ini menjelaskan langkah-langkah implementasi component Contact di aplikasi Angular Griya MDP. Component ini menampilkan form kontak yang responsif dan user-friendly dengan validasi form, informasi kontak perusahaan, dan desain modern.

---

## Table of Contents
- [Prasyarat](#prasyarat)
- [Struktur Component](#struktur-component)
- [Langkah-langkah Implementasi](#langkah-langkah-implementasi)
- [Penjelasan Kode](#penjelasan-kode)
- [Komponen Bootstrap yang Digunakan](#komponen-bootstrap-yang-digunakan)
- [Customization](#customization)
- [Testing](#testing)

---

## Prasyarat

Pastikan hal-hal berikut sudah terpenuhi:
- ✅ Angular CLI terinstall
- ✅ Project Angular Griya MDP sudah berjalan
- ✅ Bootstrap 5 sudah ter-include di `index.html`
- ✅ Bootstrap Icons sudah ter-include di `index.html`

---

## Struktur Component

```
src/app/contact/
├── contact.ts          # TypeScript component file
├── contact.html        # Template HTML (yang akan kita modifikasi)
└── contact.css         # Styling tambahan (opsional)
```

---

## Langkah-langkah Implementasi

### **Langkah 1: Pastikan Bootstrap 5 Terinstall**

Buka file `src/index.html` dan pastikan terdapat link ke Bootstrap 5 CSS dan JS:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Griya MDP - Aplikasi Sewa Rumah dan Apartemen</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
        crossorigin="anonymous">
  
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
</head>
<body>
  <app-root></app-root>
</body>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" 
        crossorigin="anonymous"></script>
</html>
```

**Catatan:** Jika Bootstrap belum terinstall, tambahkan kedua link di atas.

---

### **Langkah 2: Buat Struktur HTML Contact Form**

Edit file `src/app/contact/contact.html` dan ganti isinya dengan kode berikut:

#### 2.1. Section Header

```html
<!-- Contact Section -->
<section class="contact-section py-5">
  <div class="container">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold text-primary mb-3">Hubungi Kami</h1>
          <p class="lead text-muted">Punya pertanyaan? Kami siap membantu Anda menemukan rumah atau apartemen impian!</p>
        </div>
```

**Penjelasan:**
- `py-5`: Padding vertical (top & bottom) dengan ukuran 5
- `container`: Bootstrap container untuk centering content
- `col-lg-8 mx-auto`: Column dengan lebar 8/12 di layar besar, centered dengan margin auto
- `display-4`: Ukuran heading besar
- `fw-bold`: Font weight bold
- `text-primary`: Warna text menggunakan primary color
- `lead`: Class untuk paragraf lead/intro

---

#### 2.2. Form Card dengan Input Fields

```html
        <!-- Contact Form Card -->
        <div class="card shadow-lg border-0">
          <div class="card-body p-4 p-md-5">
            <form>
              <!-- Name Input -->
              <div class="mb-4">
                <label for="fullName" class="form-label fw-semibold">
                  <i class="bi bi-person-fill me-2"></i>Nama Lengkap
                </label>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  id="fullName" 
                  placeholder="Masukkan nama lengkap Anda"
                  required>
                <div class="form-text">Nama akan digunakan untuk komunikasi lebih lanjut</div>
              </div>
```

**Penjelasan:**
- `card shadow-lg border-0`: Card dengan shadow besar tanpa border
- `mb-4`: Margin bottom 4
- `form-label`: Bootstrap class untuk label
- `fw-semibold`: Font weight semi-bold
- `bi bi-person-fill`: Bootstrap icon untuk person
- `me-2`: Margin end (right) 2
- `form-control-lg`: Input field ukuran large
- `form-text`: Helper text di bawah input
- `required`: HTML5 validation

---

#### 2.3. Email dan Phone Input

```html
              <!-- Email Input -->
              <div class="mb-4">
                <label for="email" class="form-label fw-semibold">
                  <i class="bi bi-envelope-fill me-2"></i>Email
                </label>
                <input 
                  type="email" 
                  class="form-control form-control-lg" 
                  id="email" 
                  placeholder="nama@example.com"
                  required>
                <div class="form-text">Kami tidak akan membagikan email Anda kepada pihak lain</div>
              </div>

              <!-- Phone Input -->
              <div class="mb-4">
                <label for="phone" class="form-label fw-semibold">
                  <i class="bi bi-telephone-fill me-2"></i>Nomor Telepon
                </label>
                <input 
                  type="tel" 
                  class="form-control form-control-lg" 
                  id="phone" 
                  placeholder="+62 812-3456-7890"
                  required>
              </div>
```

**Penjelasan:**
- `type="email"`: Input dengan validasi email otomatis
- `type="tel"`: Input untuk nomor telepon
- Bootstrap secara otomatis memberikan styling untuk different input types

---

#### 2.4. Select Dropdown

```html
              <!-- Subject Select -->
              <div class="mb-4">
                <label for="subject" class="form-label fw-semibold">
                  <i class="bi bi-chat-left-text-fill me-2"></i>Subjek
                </label>
                <select class="form-select form-select-lg" id="subject" required>
                  <option value="" selected disabled>Pilih subjek pertanyaan</option>
                  <option value="sewa">Informasi Sewa Properti</option>
                  <option value="beli">Informasi Beli Properti</option>
                  <option value="kerjasama">Kerjasama Bisnis</option>
                  <option value="keluhan">Keluhan & Saran</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
```

**Penjelasan:**
- `form-select`: Bootstrap class untuk select dropdown
- `form-select-lg`: Select ukuran large
- `selected disabled`: Option default yang tidak bisa dipilih kembali

---

#### 2.5. Textarea dan Checkbox

```html
              <!-- Message Textarea -->
              <div class="mb-4">
                <label for="message" class="form-label fw-semibold">
                  <i class="bi bi-pencil-fill me-2"></i>Pesan
                </label>
                <textarea 
                  class="form-control" 
                  id="message" 
                  rows="5" 
                  placeholder="Tulis pesan Anda di sini..."
                  required></textarea>
                <div class="form-text">Minimal 10 karakter</div>
              </div>

              <!-- Newsletter Checkbox -->
              <div class="mb-4">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="newsletter">
                  <label class="form-check-label" for="newsletter">
                    Saya ingin menerima newsletter dan update properti terbaru
                  </label>
                </div>
              </div>
```

**Penjelasan:**
- `rows="5"`: Tinggi textarea 5 baris
- `form-check`: Container untuk checkbox/radio
- `form-check-input`: Styling untuk checkbox
- `form-check-label`: Label untuk checkbox

---

#### 2.6. Submit Button

```html
              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg py-3">
                  <i class="bi bi-send-fill me-2"></i>Kirim Pesan
                </button>
                <button type="reset" class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-clockwise me-2"></i>Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
```

**Penjelasan:**
- `d-grid`: Display grid untuk full-width button
- `gap-2`: Gap antara button
- `btn-primary`: Button dengan warna primary
- `btn-lg`: Button ukuran large
- `py-3`: Padding vertical 3
- `btn-outline-secondary`: Button outline dengan warna secondary

---

### **Langkah 3: Tambahkan Contact Info Cards**

```html
        <!-- Contact Info Cards -->
        <div class="row mt-5 g-4">
          <div class="col-md-4">
            <div class="card h-100 text-center border-0 shadow-sm">
              <div class="card-body">
                <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-geo-alt-fill text-white fs-3"></i>
                </div>
                <h5 class="card-title fw-bold">Alamat Kantor</h5>
                <p class="card-text text-muted">Jl. Raya No. 123<br>Jakarta Selatan, 12345</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 text-center border-0 shadow-sm">
              <div class="card-body">
                <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-telephone-fill text-white fs-3"></i>
                </div>
                <h5 class="card-title fw-bold">Telepon</h5>
                <p class="card-text text-muted">+62 21 1234 5678<br>+62 812 3456 7890</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 text-center border-0 shadow-sm">
              <div class="card-body">
                <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-envelope-fill text-white fs-3"></i>
                </div>
                <h5 class="card-title fw-bold">Email</h5>
                <p class="card-text text-muted">info@griyamdp.com<br>support@griyamdp.com</p>
              </div>
            </div>
          </div>
        </div>
```

**Penjelasan:**
- `mt-5`: Margin top 5
- `g-4`: Gutter (space between columns) 4
- `col-md-4`: Column width 4/12 di medium screen dan larger
- `h-100`: Height 100% untuk sama tinggi
- `text-center`: Center align text
- `rounded-circle`: Membuat element circular
- `bg-opacity-10`: Background opacity 10%
- `d-inline-flex`: Display inline flex
- `align-items-center`: Vertical center alignment
- `justify-content-center`: Horizontal center alignment
- `fs-3`: Font size 3

---

### **Langkah 4: Tambahkan Alert untuk Office Hours**

```html
        <!-- Office Hours Alert -->
        <div class="alert alert-info d-flex align-items-center mt-4" role="alert">
          <i class="bi bi-clock-fill me-3 fs-4"></i>
          <div>
            <strong>Jam Operasional:</strong> Senin - Jumat: 09:00 - 17:00 WIB | Sabtu: 09:00 - 14:00 WIB
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
```

**Penjelasan:**
- `alert alert-info`: Bootstrap alert dengan warna info (biru)
- `d-flex`: Display flex
- `role="alert"`: Accessibility attribute

---

## Penjelasan Kode

### Bootstrap 5 Grid System

Component ini menggunakan Bootstrap Grid System:

```html
<div class="container">           <!-- Container utama -->
  <div class="row">               <!-- Row untuk columns -->
    <div class="col-lg-8 mx-auto"> <!-- Column 8/12 di large screen, centered -->
```

**Breakpoints:**
- `col-`: Extra small (<576px) - Mobile portrait
- `col-sm-`: Small (≥576px) - Mobile landscape
- `col-md-`: Medium (≥768px) - Tablet
- `col-lg-`: Large (≥992px) - Desktop
- `col-xl-`: Extra large (≥1200px) - Large desktop

### Responsive Design

Component ini fully responsive:
- **Mobile**: Form mengambil 100% width
- **Tablet**: Form mengambil 8/12 width
- **Desktop**: Form centered dengan max width

### Bootstrap Icons

Icons digunakan untuk meningkatkan UX:
```html
<i class="bi bi-person-fill me-2"></i>
<i class="bi bi-envelope-fill me-2"></i>
<i class="bi bi-telephone-fill me-2"></i>
<i class="bi bi-chat-left-text-fill me-2"></i>
<i class="bi bi-pencil-fill me-2"></i>
<i class="bi bi-send-fill me-2"></i>
```

---

## Komponen Bootstrap yang Digunakan

### 1. **Form Components**
- `form-label`: Label untuk input
- `form-control`: Input text/email/tel
- `form-control-lg`: Input ukuran large
- `form-select`: Select dropdown
- `form-check`: Checkbox container
- `form-text`: Helper text

### 2. **Button Components**
- `btn`: Base button class
- `btn-primary`: Primary color button
- `btn-outline-secondary`: Outline button
- `btn-lg`: Large button
- `d-grid`: Full width button

### 3. **Card Components**
- `card`: Card container
- `card-body`: Card body
- `shadow-lg`: Large shadow
- `shadow-sm`: Small shadow
- `border-0`: No border

### 4. **Layout Utilities**
- `container`: Fixed width container
- `row`: Flex row
- `col-*-*`: Column classes
- `mx-auto`: Horizontal center
- `py-*`: Padding vertical
- `mt-*`, `mb-*`: Margin top/bottom
- `g-*`: Gutter spacing

### 5. **Typography**
- `display-4`: Display heading
- `lead`: Lead paragraph
- `fw-bold`: Font weight bold
- `fw-semibold`: Font weight semibold
- `text-muted`: Muted text color

### 6. **Alert Component**
- `alert`: Alert container
- `alert-info`: Info color alert

---

## Customization

### Mengganti Warna

Untuk mengganti warna primary, edit file `src/styles.css`:

```css
:root {
  --bs-primary: #your-color;
  --bs-primary-rgb: r, g, b;
}
```

### Menambahkan Custom CSS

Buat styling tambahan di `src/app/contact/contact.css`:

```css
.contact-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.btn-primary {
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
```

---

## Testing

### 1. Jalankan Development Server

```bash
cd griya-mdp
ng serve
```

### 2. Akses di Browser

Buka browser dan navigasi ke:
```
http://localhost:4200/contact
```

### 3. Test Responsiveness

Gunakan Chrome DevTools untuk test di berbagai device:
- Mobile (320px - 480px)
- Tablet (768px - 1024px)
- Desktop (1200px+)

### 4. Test Form Validation

Coba submit form tanpa mengisi field untuk melihat HTML5 validation bekerja.

---

## Troubleshooting

### Problem 1: Bootstrap tidak ter-load
**Solusi:** Pastikan link Bootstrap di `index.html` benar dan internet connection aktif.

### Problem 2: Icons tidak muncul
**Solusi:** Tambahkan link Bootstrap Icons di `index.html`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
```

### Problem 3: Form tidak responsive
**Solusi:** Pastikan menggunakan class `col-lg-8 mx-auto` dan `container`.

---

## Referensi

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Angular Forms Guide](https://angular.io/guide/forms)
- [Bootstrap Grid System](https://getbootstrap.com/docs/5.0/layout/grid/)
- [Bootstrap Components](https://getbootstrap.com/docs/5.0/components/)

---

## Kesimpulan

Dengan mengikuti panduan ini, Anda telah berhasil membuat Contact Component yang:
- ✅ Responsive di semua device
- ✅ Menggunakan Bootstrap 5 components
- ✅ Memiliki form validation
- ✅ User-friendly dengan icons dan helper text
- ✅ Professional design dengan cards dan alerts
- ✅ Siap untuk diintegrasikan dengan backend

---

**Happy Coding! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*