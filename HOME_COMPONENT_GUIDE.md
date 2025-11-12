# Panduan Desain Component Home (Angular + Bootstrap 5)

Panduan ini menjelaskan desain dan implementasi Home component untuk aplikasi Griya MDP menggunakan Angular dan Bootstrap 5. Mencakup struktur file, langkah pembuatan Hero, Features, Properties (grid responsif dengan komponen reusable `lokasi-perumahan`), dan CTA, serta penggunaan RouterLink, CommonModule, dan Bootstrap Icons, berikut arahan pengembangan lanjutan melalui branch repository terkait.

---

## 📋 Daftar Isi

1. [Tujuan & Fitur](#tujuan--fitur)
2. [Struktur File](#struktur-file)
3. [Langkah-Langkah Implementasi](#langkah-langkah-implementasi)
4. [Detail Section](#detail-section)
5. [Komponen Lokasi Perumahan](#komponen-lokasi-perumahan)
6. [Pengembangan Lanjutan](#pengembangan-lanjutan)

---

## 🎯 Tujuan & Fitur

### Tujuan
- Membuat landing page yang menarik untuk website perumahan
- Menampilkan daftar properti perumahan dengan desain profesional
- Menggunakan Bootstrap 5 untuk responsive design
- Menggunakan komponen reusable (`lokasi-perumahan`)

### Fitur Utama
1. **Hero Section** - Banner utama dengan CTA (Call to Action)
2. **Features Section** - Keunggulan layanan Griya MDP
3. **Properties Section** - Grid layout untuk menampilkan daftar perumahan
4. **CTA Section** - Call to action untuk menghubungi sales

---

## 📁 Struktur File

```
src/app/
├── home/
│   ├── home.ts                 # Component TypeScript
│   ├── home.html               # Component Template
│   ├── home.css                # Component Styles
│   └── home.spec.ts            # Unit Tests
│
└── lokasi-perumahan/
    ├── lokasi-perumahan.ts     # Child Component TypeScript
    ├── lokasi-perumahan.html   # Child Component Template
    ├── lokasi-perumahan.css    # Child Component Styles
    └── lokasi-perumahan.spec.ts
```

---

## 🔧 Langkah-Langkah Implementasi

### Step 1: Persiapan Home Component

File: `src/app/home/home.ts`

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LokasiPerumahan } from '../lokasi-perumahan/lokasi-perumahan';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [LokasiPerumahan, CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Array untuk data perumahan (bisa diisi dari backend nanti)
  housingList = [
    {
      id: 1,
      name: 'Griya Asri Residence',
      location: 'Jakarta Selatan',
      price: 850000000,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      rating: 4.5,
      status: 'Available'
    },
    // ... data lainnya
  ];
}
```

**Penjelasan:**
- Import `RouterLink` untuk navigasi antar halaman
- Import `LokasiPerumahan` sebagai child component
- Import `CommonModule` untuk directive Angular (*ngFor, *ngIf, dll)
- Property `housingList` berisi data perumahan (nantinya bisa dari API/backend)

---

### Step 2: Desain Hero Section

File: `src/app/home/home.html`

```html
<!-- Hero Section -->
<section class="hero-section bg-primary text-white py-5">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6 mb-4 mb-lg-0">
        <h1 class="display-4 fw-bold mb-3">Perumahan Impian Semua Insan</h1>
        <p class="lead mb-4">
          Temukan rumah idaman Anda dengan lokasi strategis, fasilitas lengkap, 
          dan harga terjangkau.
        </p>
        <div class="d-flex gap-3">
          <a href="#properties" class="btn btn-light btn-lg">
            <i class="bi bi-search me-2"></i>Cari Properti
          </a>
        </div>
      </div>
      <div class="col-lg-6">
        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop" 
            alt="Perumahan Modern" class="img-fluid rounded shadow-lg">
      </div>
    </div>
  </div>
</section>
```

**Komponen Bootstrap yang Digunakan:**
- `container`: Container responsive
- `row` + `col-lg-6`: Grid system 2 kolom (50/50)
- `align-items-center`: Vertical alignment
- `display-4`: Typography besar untuk heading
- `btn btn-light btn-lg`: Tombol dengan ukuran besar
- `img-fluid`: Gambar responsive
- `shadow-lg`: Box shadow besar

**Kelas Utility:**
- `py-5`: Padding vertical (top & bottom) 3rem
- `mb-4`: Margin bottom
- `fw-bold`: Font weight bold
- `gap-3`: Gap/jarak antar flex items

---

### Step 3: Features Section

```html
<!-- Features Section -->
<section class="features-section py-5 bg-light">
  <div class="container">
    <div class="row text-center mb-5">
      <div class="col-lg-12">
        <h2 class="fw-bold mb-3">Mengapa Memilih Griya MDP?</h2>
        <p class="text-muted">Kami memberikan yang terbaik untuk hunian impian Anda</p>
      </div>
    </div>
    <div class="row g-4">
      <!-- Feature Card 1 -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 text-center p-4">
          <div class="card-body">
            <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <i class="bi bi-geo-alt-fill text-white fs-1"></i>
            </div>
            <h5 class="card-title fw-bold">Lokasi Strategis</h5>
            <p class="card-text text-muted">
              Dekat dengan pusat kota, sekolah, rumah sakit, dan fasilitas umum lainnya
            </p>
          </div>
        </div>
      </div>
      <!-- Feature Card 2 & 3... -->
    </div>
  </div>
</section>
```

**Komponen Bootstrap:**
- `card border-0 shadow-sm`: Card tanpa border dengan shadow
- `h-100`: Height 100% untuk card yang sama tinggi
- `bg-opacity-10`: Background dengan opacity 10%
- `rounded-circle`: Border radius 50% (membuat bulat)
- `d-inline-flex`: Display inline-flex untuk icon container
- `g-4`: Gutter/jarak antar kolom dalam row

**Bootstrap Icons:**
- `bi-geo-alt-fill`: Icon lokasi
- `bi-shield-check`: Icon keamanan
- `bi-cash-coin`: Icon uang/harga
- `fs-1`: Font size level 1 (besar)

---

### Step 4: Properties Section (Grid Layout)

```html
<!-- Properties Section -->
<section id="properties" class="properties-section py-5">
  <div class="container">
    <div class="row mb-4">
      <div class="col-lg-12 text-center">
        <h2 class="fw-bold mb-3">Pilihan Hunian Terbaik</h2>
        <p class="text-muted mb-4">Jelajahi berbagai pilihan properti berkualitas</p>
        
        <!-- Filter Buttons -->
        <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap">
          <button class="btn btn-outline-primary active">
            <i class="bi bi-grid-3x3-gap me-2"></i>Semua
          </button>
          <button class="btn btn-outline-primary">
            <i class="bi bi-house me-2"></i>Rumah
          </button>
          <button class="btn btn-outline-primary">
            <i class="bi bi-building me-2"></i>Apartemen
          </button>
        </div>
      </div>
    </div>

    <!-- Housing Cards Grid -->
    <div class="row g-4 mb-4">
      <div class="col-md-6 col-lg-4">
        <app-lokasi-perumahan></app-lokasi-perumahan>
      </div>
      <!-- Implementasi selanjutnya :  menampilkan lokasi-perumahan dari list -->
    </div>

    <!-- Load More Button -->
    <div class="row">
      <div class="col-12 text-center">
        <button class="btn btn-primary btn-lg">
          <i class="bi bi-arrow-down-circle me-2"></i>Lihat Lebih Banyak
        </button>
      </div>
    </div>
  </div>
</section>
```

**Grid Responsive:**
- `col-md-6`: 2 kolom pada tablet (medium)
- `col-lg-4`: 3 kolom pada desktop (large)
- Mobile (default): 1 kolom penuh

**Komponen:**
- `flex-wrap`: Membuat flex items bisa wrap ke baris baru
- `justify-content-center`: Center alignment horizontal
- `<app-lokasi-perumahan>`: Custom component selector

---

### Step 5: CTA (Call to Action) Section

```html
<!-- CTA Section -->
<section class="cta-section bg-primary text-white py-5">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-8 mb-3 mb-lg-0 text-center text-lg-start">
        <h3 class="fw-bold mb-2">Siap Menemukan Rumah Impian Anda?</h3>
        <p class="mb-0">Hubungi kami sekarang dan dapatkan penawaran terbaik</p>
      </div>
      <div class="col-lg-4 text-center text-lg-end">
        <a routerLink="/contact" class="btn btn-light btn-lg">
          <i class="bi bi-telephone-fill me-2"></i>Hubungi Kami
        </a>
      </div>
    </div>
  </div>
</section>
```

**Responsive Text Alignment:**
- `text-center text-lg-start`: Center pada mobile, left pada desktop
- `text-center text-lg-end`: Center pada mobile, right pada desktop

---

## 🏠 Komponen Lokasi Perumahan

### Component TypeScript

File: `src/app/lokasi-perumahan/lokasi-perumahan.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lokasi-perumahan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lokasi-perumahan.html',
  styleUrl: './lokasi-perumahan.css'
})
export class LokasiPerumahan {
  // Nanti bisa ditambahkan @Input() untuk menerima data dari parent
}
```

---

### Component Template

File: `src/app/lokasi-perumahan/lokasi-perumahan.html`

```html
<div class="card h-100 shadow-sm border-0 overflow-hidden">
  <!-- Property Image -->
  <div class="position-relative">
    <img src="..." 
         class="card-img-top" 
         alt="Perumahan Modern"
         style="height: 250px; object-fit: cover;">
    
    <!-- Badge Status -->
    <span class="position-absolute top-0 start-0 m-3 badge bg-success">
      <i class="bi bi-check-circle-fill me-1"></i>Available
    </span>
    
    <!-- Favorite Button -->
    <button class="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle shadow-sm">
      <i class="bi bi-heart"></i>
    </button>
  </div>

  <div class="card-body">
    <!-- Property Title & Location -->
    <h5 class="card-title fw-bold mb-2">Griya Asri Residence</h5>
    <p class="text-muted mb-3">
      <i class="bi bi-geo-alt-fill text-primary me-1"></i>
      Jakarta Selatan, Indonesia
    </p>

    <!-- Price -->
    <div class="mb-3">
      <h4 class="text-primary fw-bold mb-0">Rp 850.000.000</h4>
      <small class="text-muted">Harga mulai dari</small>
    </div>

    <!-- Property Features -->
    <div class="d-flex gap-3 mb-3 text-muted">
      <small>
        <i class="bi bi-house-door me-1"></i>3 Kamar
      </small>
      <small>
        <i class="bi bi-droplet me-1"></i>2 K. Mandi
      </small>
      <small>
        <i class="bi bi-rulers me-1"></i>120 m²
      </small>
    </div>

    <!-- Description -->
    <p class="card-text text-muted small mb-3">
      Hunian modern dengan desain minimalis, dilengkapi fasilitas lengkap.
    </p>

    <!-- Action Buttons -->
    <div class="d-grid gap-2">
      <a href="#" class="btn btn-primary">
        <i class="bi bi-eye me-2"></i>Lihat Detail
      </a>
      <a href="#" class="btn btn-outline-primary">
        <i class="bi bi-telephone me-2"></i>Hubungi Sales
      </a>
    </div>
  </div>

  <!-- Card Footer -->
  <div class="card-footer bg-light border-0">
    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        <i class="bi bi-calendar3 me-1"></i>Posted 2 days ago
      </small>
      <div class="text-warning">
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-half"></i>
        <small class="text-muted ms-1">4.5</small>
      </div>
    </div>
  </div>
</div>
```

**Komponen Card:**
- `h-100`: Card full height agar semua card sama tinggi dalam grid
- `overflow-hidden`: Memotong konten yang keluar dari card
- `position-relative` + `position-absolute`: Untuk overlay badge dan button
- `object-fit: cover`: Gambar menutupi area tanpa distorsi

**Button & Badge:**
- `rounded-circle`: Tombol bulat untuk favorite
- `badge bg-success`: Badge hijau untuk status
- `d-grid gap-2`: Button full width dengan gap

**Card Footer:**
- `card-footer bg-light border-0`: Footer dengan background abu-abu
- `justify-content-between`: Space between untuk rating dan tanggal

---

## 🚀 Pengembangan Lanjutan
- [ ] Dynamic data binding dengan TypeScript interface
- [ ] Filter properti berdasarkan tipe (rumah, apartemen, villa)
- [ ] Currency formatting untuk harga dalam Rupiah
- [ ] Dynamic star rating display
- [ ] Responsive grid layout (Bootstrap 5)
- [ ] Conditional styling untuk status properti

**Instruksi Implementasi Pengembangan Lanjutan:**
1. Akses github repository pada branch `home-component-next-impl` atau akses [link repository berikut](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/home-component-next-impl)
2. Ikuti tutorial langkah demi langkah pada file HOME_COMPONENT_GUIDE.md

## 📝 Checklist Implementasi

- [x] Hero section dengan heading dan CTA buttons
- [x] Features section dengan 3 kartu keunggulan
- [x] Properties section dengan grid 3 kolom
- [x] Integrasi component `lokasi-perumahan`
- [x] CTA section di bagian bawah
- [x] Responsive design untuk mobile, tablet, desktop
- [x] Bootstrap Icons untuk visual menarik
- [x] RouterLink untuk navigasi ke halaman Contact

---

## 📚 Referensi

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Angular Documentation](https://angular.dev/)
- [Unsplash - Free Images](https://unsplash.com/)

---
Selamat mencoba! 🚀
