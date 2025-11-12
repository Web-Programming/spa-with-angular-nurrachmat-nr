# Panduan Detail Page Component (Angular + Bootstrap 5)

## 📖 Deskripsi

Dokumen ini adalah panduan lengkap untuk mengimplementasikan halaman detail properti pada aplikasi **Griya MDP** menggunakan Angular dan Bootstrap 5. Panduan ini menggunakan pendekatan **data lokal** (shared data file) sebagai single source of truth, sehingga mudah dipahami untuk tahap pembelajaran dan dapat dengan mudah dimigrasi ke integrasi API di masa mendatang.

### 🎯 Apa yang Akan Anda Pelajari?

- ✅ Membuat komponen detail page yang interaktif dan responsif
- ✅ Mengimplementasikan shared data file untuk menghindari duplikasi kode
- ✅ Menggunakan Angular routing dengan dynamic parameter (`:id`)
- ✅ Menampilkan data properti secara detail dengan Bootstrap 5
- ✅ Menangani loading state dan error handling
- ✅ Navigasi antar halaman menggunakan RouterLink
- ✅ Styling modern dengan CSS dan Bootstrap utilities

### 🌟 Keunggulan Pendekatan Ini

1. **Single Source of Truth** - Data properti disimpan di satu file (`housing-data.ts`) yang digunakan oleh semua komponen
2. **DRY Principle** - Menghindari duplikasi data dan kode
3. **Mudah Maintenance** - Update data cukup di satu tempat saja
4. **Siap Migrasi** - Struktur kode sudah siap untuk integrasi dengan API/backend
5. **Best Practice** - Mengikuti Angular style guide dan modern development patterns

### 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah:
- Memiliki basic knowledge tentang Angular dan TypeScript
- Memahami konsep routing di Angular
- Familiar dengan Bootstrap 5
- Sudah membuat Home Component dan Lokasi Perumahan Component
- Sudah membuat Housing model (`housing.model.ts`)

---

## 📑 Daftar Isi

1. [Persiapan](#1-persiapan)
2. [Implementasi Berbagi Data Lokal](#2-implementasi-berbagi-data-lokal)
3. [Membuat Detail Component](#3-membuat-detail-component)
4. [Konfigurasi Routing](#4-konfigurasi-routing)
5. [Update Lokasi Perumahan Component](#5-update-lokasi-perumahan-component)
6. [Implementasi Template Detail](#6-implementasi-template-detail)
7. [Styling](#7-styling)
8. [Testing](#-testing)
9. [Troubleshooting](#-troubleshooting)

---

## 🚀 Implementasi Pengembangan Lanjutan

### 1. Persiapan

#### 📌 Langkah 1.1: Pahami Konsep Data Lokal

Dalam implementasi ini, kita akan:
- ✅ Menggunakan **shared data file** (`housing-data.ts`) yang sama dengan Home Component
- ✅ Mencari data berdasarkan ID dari route parameter
- ✅ Tidak perlu HTTP request ke backend
- ✅ Lebih cepat dan cocok untuk prototyping
- ✅ **Single source of truth** - data disimpan di satu tempat

**Alur Kerja:**
```
User klik "Lihat Detail" 
  → Navigate ke /property/1
  → Ambil ID dari URL (1)
  → Import HOUSING_DATA dari src/app/data/housing-data.ts
  → Cari data dengan ID tersebut di array
  → Tampilkan detail
```

---

### 2. Implementasi Berbagi Data Lokal

#### 📌 Langkah 2.1: Buat Folder Data

Pertama, kita perlu membuat folder `data` di dalam folder `src/app/` untuk menyimpan shared data.

**Buat folder:**
```
src/app/data/
```

#### 📌 Langkah 2.2: Buat File housing-data.ts

**File:** `src/app/data/housing-data.ts`

```typescript
import { Housing } from '../lokasi-perumahan/housing.model';

/**
 * Data properti/perumahan untuk aplikasi Griya MDP
 * 
 * Single source of truth untuk semua data properti.
 * Digunakan oleh:
 * - Home Component (untuk listing)
 * - Detail Component (untuk detail page)
 */
export const HOUSING_DATA: Housing[] = [
  {
    id: 1,
    title: 'Griya Asri Residence',
    location: 'Jakarta Selatan',
    price: 850000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
    rating: 4.5,
    status: 'Available',
    type: 'rumah',
    description: 'Hunian modern dengan desain minimalis di kawasan Jakarta Selatan yang strategis.',
    postedDays: 2
  },
  {
    id: 2,
    title: 'Taman Indah Village',
    location: 'Tangerang',
    price: 650000000,
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    rating: 4.8,
    status: 'Available',
    type: 'rumah',
    description: 'Rumah nyaman dengan lingkungan asri dan fasilitas lengkap.',
    postedDays: 5
  },
  {
    id: 3,
    title: 'Villa Sejahtera',
    location: 'Bogor',
    price: 1200000000,
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    rating: 4.9,
    status: 'Available',
    type: 'villa',
    description: 'Villa mewah dengan pemandangan pegunungan yang indah.',
    postedDays: 1
  },
  {
    id: 4,
    title: 'Skyline Apartment',
    location: 'Jakarta Pusat',
    price: 750000000,
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    rating: 4.6,
    status: 'Pending',
    type: 'apartemen',
    description: 'Apartemen modern di pusat kota dengan akses ke berbagai fasilitas.',
    postedDays: 3
  },
  {
    id: 5,
    title: 'Green Valley Residence',
    location: 'Depok',
    price: 550000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 100,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    rating: 4.4,
    status: 'Available',
    type: 'rumah',
    description: 'Perumahan cluster dengan konsep hijau dan lingkungan yang asri.',
    postedDays: 7
  },
  {
    id: 6,
    title: 'Royal Tower Apartment',
    location: 'Jakarta Barat',
    price: 950000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&h=400&fit=crop',
    rating: 4.7,
    status: 'Available',
    type: 'apartemen',
    description: 'Apartemen premium dengan fasilitas lengkap dan lokasi strategis.',
    postedDays: 4
  },
  {
    id: 7,
    title: 'Sunrise Garden',
    location: 'Bekasi',
    price: 450000000,
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop',
    rating: 4.3,
    status: 'Available',
    type: 'rumah',
    description: 'Rumah minimalis dengan taman yang asri dan nyaman.',
    postedDays: 6
  },
  {
    id: 8,
    title: 'Mountain View Villa',
    location: 'Puncak',
    price: 1500000000,
    bedrooms: 5,
    bathrooms: 4,
    area: 250,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    rating: 5.0,
    status: 'Available',
    type: 'villa',
    description: 'Villa mewah dengan pemandangan gunung yang spektakuler.',
    postedDays: 2
  },
  {
    id: 9,
    title: 'City Center Apartment',
    location: 'Jakarta Pusat',
    price: 850000000,
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    rating: 4.7,
    status: 'Available',
    type: 'apartemen',
    description: 'Apartemen modern dengan akses mudah ke berbagai fasilitas kota.',
    postedDays: 1
  }
];
```

#### 📌 Langkah 2.3: Keuntungan Shared Data File

**Keuntungan:**
- ✅ **DRY Principle** - Tidak ada duplikasi data
- ✅ **Single Source of Truth** - Update di satu tempat saja
- ✅ **Mudah Maintenance** - Tambah/edit data lebih mudah
- ✅ **Konsistensi Data** - Data sama di semua component
- ✅ **Siap Migrasi** - Mudah diganti dengan service/API nantinya

#### 📌 Langkah 2.4: Update Home Component

Sekarang update Home Component untuk menggunakan shared data.

**File:** `src/app/home/home.ts`

Tambahkan import dan update property:

```typescript
import { HOUSING_DATA } from '../data/housing-data';  // ← Tambahkan import ini

export class Home {
  housingList: Housing[] = HOUSING_DATA;  // ← Ganti array hardcoded dengan ini
  // ... kode lainnya
}
```

**Hapus:** Semua data hardcoded yang ada di `housingList` sebelumnya.

---

### 3. Membuat Detail Component

#### 📌 Langkah 3.1: Generate Component dengan Angular CLI

Jalankan command berikut di terminal untuk membuat Detail Component:

```bash
ng generate component detail 
```

Atau versi singkatnya:

```bash
ng g c detail
```

**Output yang dihasilkan:**
```
src/app/detail/detail.css (0 bytes)
src/app/detail/detail.html (21 bytes)
src/app/detail/detail.spec.ts (606 bytes)
src/app/detail/detail.ts (241 bytes)
```

**Penjelasan:**
- `ng generate component` - Command untuk membuat component baru
- `detail` - Nama component
- `--standalone` - Membuat standalone component (tidak perlu NgModule)

**Catatan:** 
- Angular CLI akan otomatis membuat folder `detail/` di dalam `src/app/`
- File akan diberi nama `detail.*` secara default

---

#### 📌 Langkah 3.2: Implementasi Component Logic (detail.ts)

**File:** `src/app/detail/detail.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Housing } from '../lokasi-perumahan/housing.model';
import { HOUSING_DATA } from '../data/housing-data';  // ← Import shared data

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {
  housing: Housing | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  propertyId: number = 0;

  // Gunakan data dari shared file
  private housingData: Housing[] = HOUSING_DATA;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ambil ID dari route parameter
    this.route.params.subscribe(params => {
      this.propertyId = +params['id']; // + untuk convert string ke number
      this.loadPropertyDetail();
    });
  }

  loadPropertyDetail(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Simulasi delay loading (seperti API call)
    setTimeout(() => {
      // Cari data berdasarkan ID
      const foundHousing = this.housingData.find(h => h.id === this.propertyId);
      
      if (foundHousing) {
        this.housing = foundHousing;
        this.isLoading = false;
        console.log('Detail properti berhasil dimuat:', foundHousing);
      } else {
        this.errorMessage = 'Properti tidak ditemukan.';
        this.isLoading = false;
        console.error('Properti dengan ID', this.propertyId, 'tidak ditemukan');
      }
    }, 500); // Delay 500ms untuk UX yang lebih baik
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // Format harga ke Rupiah
  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Get badge class berdasarkan status
  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'available':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'sold':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  // Get type badge class
  getTypeClass(type: string): string {
    switch(type?.toLowerCase()) {
      case 'rumah':
        return 'bg-primary';
      case 'apartemen':
        return 'bg-info';
      case 'villa':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}
```

**Penjelasan Kode:**

1. **Import HOUSING_DATA:**
   - Import dari `../data/housing-data.ts` (shared data file)
   - **Single source of truth** - data hanya ada di satu tempat
   - Mudah untuk maintenance dan update

2. **housingData Property:**
   - Menggunakan data dari `HOUSING_DATA` constant
   - Sama dengan yang digunakan di Home Component
   - Menghindari duplikasi kode

3. **ngOnInit():**
   - Subscribe ke `route.params` untuk get ID
   - `+params['id']` - Convert string ke number

4. **loadPropertyDetail():**
   - Gunakan `Array.find()` untuk mencari data
   - `setTimeout()` untuk simulasi loading (UX lebih baik)
   - Set `isLoading` dan `errorMessage` sesuai hasil

5. **Helper Methods:**
   - `formatPrice()` - Format Rupiah
   - `getStatusClass()` - Dynamic badge color
   - `goBack()` - Navigate ke home

---

### 4. Konfigurasi Routing

#### 📌 Langkah 4.1: Tambahkan Route untuk Detail Page

**File:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { Home as HomeComponent } from './home/home';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { Register } from './register/register';
import { Contact } from './contact/contact';
import { Detail } from './detail/detail';  // ← Import Detail Component

export const routes: Routes = [
    {
        path : "",
        component : HomeComponent,
        title : 'Home Page'
    },
    {
        path : "profile",
        component : Profile,
    },
    {
        path : "login",
        component : Login,
    },
    {
        path : "register",
        component : Register,
    },
    {
        path : "contact",
        component : Contact,
    },
    {
        path: "property/:id",           // ← Route dengan parameter
        component: Detail,
        title: 'Detail Property - Griya MDP'
    },
    {
        path: "**",                      // ← Wildcard untuk 404
        redirectTo: "",
        pathMatch: 'full'
    }
];
```

**Penjelasan:**
- `property/:id` - Dynamic route parameter
- `:id` - Bisa diakses via `ActivatedRoute`
- `**` - Catch-all route (harus di paling bawah)

---

### 5. Update Lokasi Perumahan Component

#### 📌 Langkah 5.1: Pastikan RouterLink Di-import

**File:** `src/app/lokasi-perumahan/lokasi-perumahan.ts`

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';  // ← Pastikan ada
import { Housing } from './housing.model';

@Component({
  selector: 'app-lokasi-perumahan',
  standalone: true,
  imports: [CommonModule, RouterLink],  // ← RouterLink di imports
  templateUrl: './lokasi-perumahan.html',
  styleUrl: './lokasi-perumahan.css'
})
export class LokasiPerumahan {
  @Input() housing!: Housing;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }
}
```

---

#### 📌 Langkah 5.2: Tambahkan Tombol "Lihat Detail"

**File:** `src/app/lokasi-perumahan/lokasi-perumahan.html`

Tambahkan tombol di bagian bawah card (sebelum closing `</div>` dari `card-body`):

```html
<!-- Button Lihat Detail - Tambahkan ini -->
<div class="mt-auto">
  <a [routerLink]="['/property', housing.id]" 
     class="btn btn-primary w-100">
    <i class="bi bi-eye me-2"></i>Lihat Detail
  </a>
</div>
```

**Penjelasan:**
- `[routerLink]="['/property', housing.id]"` - Dynamic route
- Jika `housing.id = 1`, akan navigate ke `/property/1`
- `mt-auto` - Push button ke bawah
- `w-100` - Full width button

---

### 6. Implementasi Template Detail

#### 📌 Langkah 6.1: Buat Template Lengkap

**File:** `src/app/detail/detail.html`

```html
<!-- Loading State -->
<div class="container py-5" *ngIf="isLoading">
  <div class="text-center">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="text-muted mt-3">Memuat detail properti...</p>
  </div>
</div>

<!-- Error State -->
<div class="container py-5" *ngIf="!isLoading && errorMessage">
  <div class="alert alert-danger" role="alert">
    <i class="bi bi-exclamation-triangle-fill me-2"></i>
    {{ errorMessage }}
  </div>
  <button class="btn btn-primary" (click)="goBack()">
    <i class="bi bi-arrow-left me-2"></i>Kembali ke Home
  </button>
</div>

<!-- Detail Content -->
<div class="container py-5" *ngIf="!isLoading && housing">
  <!-- Breadcrumb -->
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <a routerLink="/" class="text-decoration-none">Home</a>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        {{ housing.title }}
      </li>
    </ol>
  </nav>

  <!-- Back Button -->
  <button class="btn btn-outline-secondary mb-4" (click)="goBack()">
    <i class="bi bi-arrow-left me-2"></i>Kembali
  </button>

  <div class="row g-4">
    <!-- Left Column - Image & Description -->
    <div class="col-lg-8">
      <!-- Main Image -->
      <div class="card shadow-sm mb-4">
        <img [src]="housing.image" 
             [alt]="housing.title" 
             class="card-img-top property-detail-image">
      </div>

      <!-- Description Section -->
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">
            <i class="bi bi-file-text text-primary me-2"></i>Deskripsi
          </h3>
          <p class="card-text">{{ housing.description }}</p>
        </div>
      </div>
    </div>

    <!-- Right Column - Details -->
    <div class="col-lg-4">
      <!-- Property Info Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <!-- Title -->
          <h2 class="card-title mb-3">{{ housing.title }}</h2>

          <!-- Badges -->
          <div class="mb-3">
            <span class="badge me-2" [ngClass]="getStatusClass(housing.status)">
              {{ housing.status }}
            </span>
            <span class="badge" [ngClass]="getTypeClass(housing.type || '')">
              {{ housing.type | titlecase }}
            </span>
          </div>

          <!-- Price -->
          <div class="mb-4">
            <h3 class="text-primary mb-0">{{ formatPrice(housing.price) }}</h3>
          </div>

          <!-- Location -->
          <div class="mb-3">
            <h5 class="mb-2">
              <i class="bi bi-geo-alt-fill text-danger me-2"></i>Lokasi
            </h5>
            <p class="text-muted mb-0">{{ housing.location }}</p>
          </div>

          <hr>

          <!-- Specifications -->
          <h5 class="mb-3">
            <i class="bi bi-house-fill text-primary me-2"></i>Spesifikasi
          </h5>
          
          <div class="row g-3 mb-4">
            <!-- Bedrooms -->
            <div class="col-6">
              <div class="d-flex align-items-center">
                <div class="icon-box bg-primary bg-opacity-10 text-primary rounded p-2 me-2">
                  <i class="bi bi-door-closed fs-5"></i>
                </div>
                <div>
                  <div class="fw-bold">{{ housing.bedrooms }}</div>
                  <small class="text-muted">Kamar Tidur</small>
                </div>
              </div>
            </div>

            <!-- Bathrooms -->
            <div class="col-6">
              <div class="d-flex align-items-center">
                <div class="icon-box bg-info bg-opacity-10 text-info rounded p-2 me-2">
                  <i class="bi bi-droplet fs-5"></i>
                </div>
                <div>
                  <div class="fw-bold">{{ housing.bathrooms }}</div>
                  <small class="text-muted">Kamar Mandi</small>
                </div>
              </div>
            </div>

            <!-- Area -->
            <div class="col-6">
              <div class="d-flex align-items-center">
                <div class="icon-box bg-success bg-opacity-10 text-success rounded p-2 me-2">
                  <i class="bi bi-rulers fs-5"></i>
                </div>
                <div>
                  <div class="fw-bold">{{ housing.area }} m²</div>
                  <small class="text-muted">Luas Tanah</small>
                </div>
              </div>
            </div>

            <!-- Rating -->
            <div class="col-6">
              <div class="d-flex align-items-center">
                <div class="icon-box bg-warning bg-opacity-10 text-warning rounded p-2 me-2">
                  <i class="bi bi-star-fill fs-5"></i>
                </div>
                <div>
                  <div class="fw-bold">{{ housing.rating }}/5</div>
                  <small class="text-muted">Rating</small>
                </div>
              </div>
            </div>
          </div>

          <hr>

          <!-- Posted Date -->
          <div class="mb-3" *ngIf="housing.postedDays">
            <small class="text-muted">
              <i class="bi bi-clock me-1"></i>
              Diposting {{ housing.postedDays }} hari yang lalu
            </small>
          </div>

          <!-- Action Buttons -->
          <div class="d-grid gap-2">
            <button class="btn btn-primary btn-lg">
              <i class="bi bi-telephone-fill me-2"></i>Hubungi Agen
            </button>
            <button class="btn btn-outline-primary">
              <i class="bi bi-calendar-check me-2"></i>Jadwalkan Kunjungan
            </button>
            <button class="btn btn-outline-secondary">
              <i class="bi bi-heart me-2"></i>Simpan ke Favorit
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Card -->
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="bi bi-person-circle text-primary me-2"></i>Hubungi Kami
          </h5>
          <p class="text-muted mb-3">
            Tertarik dengan properti ini? Hubungi kami untuk informasi lebih lanjut.
          </p>
          <div class="d-grid gap-2">
            <a href="tel:+6281234567890" class="btn btn-success">
              <i class="bi bi-whatsapp me-2"></i>WhatsApp
            </a>
            <a href="mailto:info@griyamdp.com" class="btn btn-outline-secondary">
              <i class="bi bi-envelope me-2"></i>Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### 7. Styling

#### 📌 Langkah 7.1: CSS untuk Detail Page

**File:** `src/app/detail/detail.css`

```css
/* Property Detail Image */
.property-detail-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

/* Icon Box */
.icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card Hover Effect */
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

/* Breadcrumb Styling */
.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin-bottom: 1rem;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
  font-size: 1.2rem;
}

/* Button Hover Effects */
.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Responsive Image */
@media (max-width: 768px) {
  .property-detail-image {
    height: 300px;
  }
}

/* Badge Styling */
.badge {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
}
```

---

#### 📌 Langkah 7.2: Update Card Styling (Opsional)

**File:** `src/app/lokasi-perumahan/lokasi-perumahan.css`

Tambahkan jika belum ada:

```css
/* Card Hover Effect */
.hover-shadow {
  transition: all 0.3s ease;
}

.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
}

/* Button Hover */
.btn-primary {
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.02);
}
```

---

## 🧪 Testing

### Test 1: Navigation dari Home ke Detail

**Langkah:**
1. Jalankan aplikasi: `ng serve`
2. Buka browser: `http://localhost:4200`
3. Klik tombol **"Lihat Detail"** pada salah satu card

**Expected Result:**
- ✅ URL berubah menjadi `/property/1` (sesuai ID)
- ✅ Loading spinner muncul sebentar (500ms)
- ✅ Detail properti tampil lengkap
- ✅ Breadcrumb: Home > Nama Properti
- ✅ Semua data sesuai (harga, bedrooms, dll)

---

### Test 2: Direct URL Access

**Langkah:**
1. Ketik langsung di address bar: `http://localhost:4200/property/3`

**Expected Result:**
- ✅ Halaman detail langsung terbuka
- ✅ Data properti ID 3 (Villa Sejahtera) ditampilkan
- ✅ Tidak ada error

---

### Test 3: Invalid Property ID

**Langkah:**
1. Akses URL: `http://localhost:4200/property/999`

**Expected Result:**
- ✅ Loading spinner muncul dulu
- ✅ Error message: "Properti tidak ditemukan"
- ✅ Tombol "Kembali ke Home" tersedia dan berfungsi

---

### Test 4: Back Navigation

**Langkah:**
1. Dari detail page, klik tombol **"Kembali"**

**Expected Result:**
- ✅ Navigate kembali ke home page
- ✅ Data home page masih ada (tidak reload)

---

### Test 5: Breadcrumb Navigation

**Langkah:**
1. Klik **"Home"** di breadcrumb

**Expected Result:**
- ✅ Navigate kembali ke home page

---

### Test 6: Responsive Design

**Langkah:**
1. Resize browser window atau buka di mobile
2. Atau buka DevTools (F12) > Toggle Device Toolbar

**Expected Result:**
- ✅ Layout berubah dari 2 kolom → 1 kolom
- ✅ Image height: 500px (desktop) → 300px (mobile)
- ✅ Semua buttons accessible
- ✅ Text readable, tidak terpotong

---

### Test 7: Multiple Properties

**Langkah:**
1. Klik detail property ID 1
2. Kembali ke home
3. Klik detail property ID 5
4. Compare data

**Expected Result:**
- ✅ Data berbeda untuk setiap property
- ✅ Tidak ada data yang tertinggal dari property sebelumnya

---

## 🐛 Troubleshooting

### Problem 1: "Cannot read property 'title' of null"

**Cause:** Template render sebelum data loaded

**Solution:** Selalu gunakan `*ngIf="housing"` di container

```html
<div class="container py-5" *ngIf="!isLoading && housing">
  <!-- content here -->
</div>
```

---

### Problem 2: RouterLink tidak berfungsi

**Cause:** `RouterLink` tidak di-import

**Solution:** Check imports di component

```typescript
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],  // ← Pastikan ada
})
```

---

### Problem 3: Route 404 Not Found

**Cause:** Route belum terdaftar atau typo

**Solution:** 
1. Check `app.routes.ts`
2. Pastikan path benar: `property/:id`
3. Pastikan Detail component di-import

---

### Problem 4: ID selalu 0 atau undefined

**Cause:** Lupa convert string ke number

**Solution:** Gunakan `+` operator

```typescript
this.propertyId = +params['id']; // Convert to number
```

---

### Problem 5: Data tidak muncul/kosong

**Cause:** ID tidak match dengan data

**Solution:**
1. Check console log
2. Pastikan `housingData` array ada data
3. Pastikan `id` di data match dengan route parameter

```typescript
console.log('Looking for ID:', this.propertyId);
console.log('Found:', foundHousing);
```

---

### Problem 6: Styling tidak muncul

**Cause:** CSS file tidak ke-load

**Solution:**
1. Check `styleUrl` di component decorator
2. Pastikan path benar: `./detail.css`
3. Clear browser cache (Ctrl + Shift + R)

---

## 📝 Checklist Implementasi

- [ ] **Persiapan**
  - [ ] Folder `data` dibuat di `src/app/`
  - [ ] File `housing-data.ts` dibuat
  - [ ] Folder `detail` dibuat
  - [ ] 4 files created (ts, html, css, spec.ts)

- [ ] **Shared Data File (housing-data.ts)**
  - [ ] Import Housing model
  - [ ] Export HOUSING_DATA constant
  - [ ] Array berisi 9 properti lengkap
  - [ ] Setiap properti punya id unik (1-9)

- [ ] **Component Logic (detail.ts)**
  - [ ] Import modules (CommonModule, RouterLink, ActivatedRoute, Router)
  - [ ] Import HOUSING_DATA from '../data/housing-data'
  - [ ] Property: `private housingData: Housing[] = HOUSING_DATA`
  - [ ] ngOnInit subscribe to route params
  - [ ] loadPropertyDetail method
  - [ ] Helper methods (formatPrice, getStatusClass, getTypeClass, goBack)

- [ ] **Routing (app.routes.ts)**
  - [ ] Import Detail component
  - [ ] Route `/property/:id` added
  - [ ] Wildcard route `**` added

- [ ] **Update Home Component**
  - [ ] Import HOUSING_DATA from '../data/housing-data'
  - [ ] Property: `housingList: Housing[] = HOUSING_DATA`
  - [ ] Remove hardcoded data array

- [ ] **Update Lokasi Perumahan**
  - [ ] RouterLink imported
  - [ ] Button "Lihat Detail" added to template
  - [ ] `[routerLink]="['/property', housing.id]"` configured

- [ ] **Template (detail.html)**
  - [ ] Loading state
  - [ ] Error state
  - [ ] Breadcrumb navigation
  - [ ] Two column layout (col-lg-8 dan col-lg-4)
  - [ ] Property image
  - [ ] Description card
  - [ ] Info card dengan badges
  - [ ] Specifications grid (4 items)
  - [ ] Action buttons (3 buttons)
  - [ ] Contact card

- [ ] **Styling (detail.css)**
  - [ ] property-detail-image class
  - [ ] icon-box class
  - [ ] Breadcrumb styling
  - [ ] Button hover effects
  - [ ] Responsive (@media)

- [ ] **Testing**
  - [ ] Navigation dari home works
  - [ ] Direct URL access works
  - [ ] Invalid ID handled properly
  - [ ] Back button works
  - [ ] Breadcrumb works
  - [ ] Responsive design OK
  - [ ] Multiple properties tested

---

### Fitur Tambahan yang Bisa Diimplementasikan:

1. **Image Gallery/Carousel** - Multiple images per property
2. **Similar Properties** - Tampilkan properti serupa
3. **Social Sharing** - Share ke social media
4. **Favorite/Bookmark** - Simpan properti favorit (localStorage)
5. **Contact Form** - Form hubungi agen langsung dari detail
6. **Virtual Tour** - 360° view atau video tour
7. **Map Integration** - Google Maps untuk lokasi
8. **Price Calculator** - Kalkulator cicilan/KPR

---

## �📚 Referensi

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Angular Documentation](https://angular.dev/)
- [Angular Routing](https://angular.dev/guide/routing)
- [Angular Component Interaction](https://angular.dev/guide/components/inputs)
- [Angular Pipes](https://angular.dev/guide/pipes)
- [Unsplash - Free Images](https://unsplash.com/)
- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

---

## 📁 Struktur File Akhir

```
src/app/
├── data/
│   ├── housing-data.ts          ← Shared data constant
│   └── README.md                ← Dokumentasi data
├── detail/
│   ├── detail.ts                ← Component logic
│   ├── detail.html              ← Template
│   ├── detail.css               ← Styling
│   └── detail.spec.ts           ← Unit tests
├── home/
│   ├── home.ts                  ← Uses HOUSING_DATA
│   └── ...
├── lokasi-perumahan/
│   ├── lokasi-perumahan.ts      ← Card component
│   ├── lokasi-perumahan.html    ← RouterLink added
│   ├── housing.model.ts         ← Housing interface
│   └── ...
├── services/
│   └── housing.service.ts       ← Optional service
├── app.routes.ts                ← Route config
└── ...
```

---

Selamat mencoba! 🚀