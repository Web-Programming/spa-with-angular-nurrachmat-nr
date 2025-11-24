# Panduan Implementasi Profile Component dengan Bootstrap 5

## Deskripsi
Dokumen ini menjelaskan langkah-langkah implementasi component Profile menggunakan Bootstrap 5 di aplikasi Angular Griya MDP. Component ini menampilkan profil user yang lengkap dengan informasi pribadi, statistik, daftar properti, favorit, dan riwayat aktivitas.

---

## Table of Contents
- [Prasyarat](#prasyarat)
- [Struktur Component](#struktur-component)
- [Preview Fitur](#preview-fitur)
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
src/app/profile/
├── profile.ts          # TypeScript component file
├── profile.html        # Template HTML (yang akan kita modifikasi)
└── profile.css         # Styling tambahan (opsional)
```

---

## Preview Fitur

Profile Component memiliki fitur-fitur berikut:

### 1. **Profile Header**
- Profile picture (circular avatar)
- Informasi user (nama, email, telepon, lokasi)
- Badges (Premium Member, Verified)
- Action buttons (Edit Profile, Settings)

### 2. **Left Sidebar**
- **Statistik Card**: Properti disewa, Favorit, Rating, Member sejak
- **About Card**: Bio, pekerjaan, tanggal lahir, status
- **Social Media Card**: Links ke Facebook, Twitter, Instagram, LinkedIn

### 3. **Main Content (Tabs)**
- **Tab Properti Saya**: Daftar properti yang dimiliki user
- **Tab Favorit**: Properti yang difavoritkan
- **Tab Riwayat**: Timeline aktivitas user

---

## Langkah-langkah Implementasi

### **Langkah 1: Pastikan Bootstrap 5 dan Icons Terinstall**

Buka file `src/index.html` dan pastikan terdapat:

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

<!-- Bootstrap 5 JS Bundle (untuk Tab functionality) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" 
        crossorigin="anonymous"></script>
</html>
```

**PENTING:** Bootstrap JS diperlukan untuk fungsi Tabs!

---

### **Langkah 2: Buat Profile Header**

#### 2.1. Section Container

```html
<!-- Profile Section -->
<section class="profile-section bg-light py-5">
  <div class="container">
```

**Penjelasan:**
- `bg-light`: Background abu-abu terang
- `py-5`: Padding vertical (top & bottom) ukuran 5

---

#### 2.2. User Information

```html
            <div class="col-lg-6 mt-3 mt-lg-0">
              <h2 class="mb-1 fw-bold">John Doe</h2>
              <p class="text-muted mb-2">
                <i class="bi bi-envelope-fill me-2"></i>john.doe@email.com
              </p>
              <p class="text-muted mb-2">
                <i class="bi bi-telephone-fill me-2"></i>+62 812-3456-7890
              </p>
              <p class="text-muted mb-0">
                <i class="bi bi-geo-alt-fill me-2"></i>Jakarta, Indonesia
              </p>
              <div class="mt-2">
                <span class="badge bg-primary me-2">Premium Member</span>
                <span class="badge bg-success">Verified</span>
              </div>
            </div>
```

**Penjelasan:**
- `text-muted`: Text dengan warna abu-abu
- `bi bi-*`: Bootstrap icons
- `me-2`: Margin end (right) 2
- `badge`: Bootstrap badge component
- `bg-primary`, `bg-success`: Background colors

---

#### 2.3. Action Buttons

```html
            <div class="col-lg-3 text-center text-lg-end mt-3 mt-lg-0">
              <button class="btn btn-primary mb-2 w-100 w-lg-auto">
                <i class="bi bi-pencil-fill me-2"></i>Edit Profile
              </button>
              <button class="btn btn-outline-secondary w-100 w-lg-auto">
                <i class="bi bi-gear-fill me-2"></i>Settings
              </button>
            </div>
```

**Penjelasan:**
- `text-lg-end`: Text align right di large screen
- `w-100`: Width 100% (mobile)
- `w-lg-auto`: Width auto di large screen
- `btn-outline-secondary`: Outline button

---

### **Langkah 3: Buat Left Sidebar**

#### 3.1. Stats Card

```html
    <div class="row g-4">
      <!-- Left Sidebar -->
      <div class="col-lg-4">
        
        <!-- Stats Card -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-bar-chart-fill text-primary me-2"></i>Statistik
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
              <div>
                <i class="bi bi-house-fill text-primary fs-4 me-2"></i>
                <span class="text-muted">Properti Disewa</span>
              </div>
              <h4 class="mb-0 fw-bold text-primary">3</h4>
            </div>
            <!-- ... stats lainnya ... -->
          </div>
        </div>
```

**Penjelasan:**
- `g-4`: Gutter (spacing) 4 antara columns
- `card-header`: Header card dengan background white
- `d-flex`: Display flex
- `justify-content-between`: Space between items
- `align-items-center`: Vertical center
- `border-bottom`: Border di bawah
- `fs-4`: Font size 4

---

#### 3.2. About Card

```html
        <!-- About Card -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-person-fill text-primary me-2"></i>Tentang
            </h5>
          </div>
          <div class="card-body">
            <p class="text-muted mb-3">
              Seorang profesional yang mencari properti berkualitas untuk investasi...
            </p>
            <div class="mb-2">
              <i class="bi bi-briefcase-fill text-primary me-2"></i>
              <strong>Pekerjaan:</strong> Software Developer
            </div>
            <!-- ... info lainnya ... -->
          </div>
        </div>
```

**Penjelasan:**
- Struktur sama dengan Stats Card
- Berisi informasi bio dan detail personal

---

#### 3.3. Social Media Card

```html
        <!-- Social Links Card -->
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-share-fill text-primary me-2"></i>Sosial Media
            </h5>
          </div>
          <div class="card-body">
            <a href="#" class="btn btn-outline-primary w-100 mb-2">
              <i class="bi bi-facebook me-2"></i>Facebook
            </a>
            <a href="#" class="btn btn-outline-info w-100 mb-2">
              <i class="bi bi-twitter me-2"></i>Twitter
            </a>
            <!-- ... social links lainnya ... -->
          </div>
        </div>
```

**Penjelasan:**
- `btn-outline-*`: Outline buttons dengan berbagai warna
- `w-100`: Full width buttons
- Link ke social media platforms

---

### **Langkah 4: Buat Tab Navigation**

```html
      <!-- Right Content -->
      <div class="col-lg-8">
        
        <!-- Tabs Navigation -->
        <ul class="nav nav-tabs nav-fill mb-4" id="profileTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="properties-tab" data-bs-toggle="tab" 
                    data-bs-target="#properties" type="button" role="tab">
              <i class="bi bi-house-fill me-2"></i>Properti Saya
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="favorites-tab" data-bs-toggle="tab" 
                    data-bs-target="#favorites" type="button" role="tab">
              <i class="bi bi-heart-fill me-2"></i>Favorit
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="history-tab" data-bs-toggle="tab" 
                    data-bs-target="#history" type="button" role="tab">
              <i class="bi bi-clock-history me-2"></i>Riwayat
            </button>
          </li>
        </ul>
```

**Penjelasan:**
- `nav nav-tabs`: Bootstrap tabs navigation
- `nav-fill`: Tabs mengisi full width
- `data-bs-toggle="tab"`: Bootstrap attribute untuk tab functionality
- `data-bs-target="#properties"`: Target tab content
- `active`: Tab yang active saat load
- `role="tablist"`, `role="tab"`: Accessibility attributes

**PENTING:** Bootstrap JS Bundle harus loaded untuk tabs bekerja!

---

### **Langkah 5: Buat Tab Content - Properties**

```html
        <!-- Tab Content -->
        <div class="tab-content" id="profileTabsContent">
          
          <!-- Properties Tab -->
          <div class="tab-pane fade show active" id="properties" role="tabpanel">
            <div class="row g-4">
              
              <!-- Property Card 1 -->
              <div class="col-md-6">
                <div class="card h-100 shadow-sm border-0">
                  <div class="position-relative">
                    <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop" 
                         class="card-img-top" alt="Property">
                    <span class="position-absolute top-0 end-0 m-3 badge bg-success">Active</span>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title fw-bold">Modern Apartment</h5>
                    <p class="text-muted mb-2">
                      <i class="bi bi-geo-alt-fill me-1"></i>Jakarta Selatan
                    </p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="text-primary fw-bold fs-5">Rp 5.000.000/bulan</span>
                    </div>
                    <div class="d-flex gap-3 mb-3">
                      <small><i class="bi bi-house me-1"></i>2 Kamar</small>
                      <small><i class="bi bi-droplet me-1"></i>1 Kamar Mandi</small>
                      <small><i class="bi bi-rulers me-1"></i>45m²</small>
                    </div>
                    <div class="d-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary flex-fill">
                        <i class="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button class="btn btn-sm btn-outline-danger flex-fill">
                        <i class="bi bi-trash me-1"></i>Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
```

**Penjelasan:**
- `tab-pane fade show active`: Tab content yang active
- `h-100`: Height 100% untuk equal height cards
- `position-relative`: Parent untuk absolute positioning
- `position-absolute top-0 end-0`: Badge di pojok kanan atas
- `card-img-top`: Gambar di atas card
- `gap-3`: Gap antara flex items
- `btn-sm`: Small button
- `flex-fill`: Fill available space equally

---

#### 5.1. Add New Property Card

```html
              <!-- Add New Property Card -->
              <div class="col-md-6">
                <div class="card h-100 shadow-sm border-2 border-dashed" style="border-color: #ddd;">
                  <div class="card-body d-flex flex-column justify-content-center align-items-center text-center py-5">
                    <i class="bi bi-plus-circle display-1 text-primary mb-3"></i>
                    <h5 class="mb-2">Tambah Properti Baru</h5>
                    <p class="text-muted mb-3">Daftarkan properti Anda dan mulai mendapatkan penyewa</p>
                    <button class="btn btn-primary">
                      <i class="bi bi-plus-lg me-2"></i>Tambah Properti
                    </button>
                  </div>
                </div>
              </div>
```

**Penjelasan:**
- `border-2 border-dashed`: Dashed border untuk styling
- `flex-column`: Flex direction vertical
- `justify-content-center`: Vertical center
- `align-items-center`: Horizontal center
- `display-1`: Extra large icon
- CTA card untuk add new property

---

### **Langkah 6: Buat Tab Content - Favorites**

```html
          <!-- Favorites Tab -->
          <div class="tab-pane fade" id="favorites" role="tabpanel">
            <div class="row g-4">
              
              <!-- Favorite Item 1 -->
              <div class="col-md-6">
                <div class="card h-100 shadow-sm border-0">
                  <div class="position-relative">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop" 
                         class="card-img-top" alt="Property">
                    <button class="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle">
                      <i class="bi bi-heart-fill text-danger"></i>
                    </button>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title fw-bold">Beautiful Villa</h5>
                    <!-- ... content ... -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="text-primary fw-bold fs-5">Rp 20.000.000/bulan</span>
                      <div class="text-warning">
                        <i class="bi bi-star-fill"></i>
                        <span class="ms-1 text-dark fw-bold">4.9</span>
                      </div>
                    </div>
                    <button class="btn btn-primary w-100">
                      <i class="bi bi-eye me-2"></i>Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
```

**Penjelasan:**
- `tab-pane fade`: Hidden tab (akan show saat clicked)
- `rounded-circle`: Circular button untuk favorite
- Rating dengan star icon
- Full width CTA button

---

### **Langkah 7: Buat Tab Content - History Timeline**

```html
          <!-- History Tab -->
          <div class="tab-pane fade" id="history" role="tabpanel">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                
                <!-- History Timeline -->
                <div class="timeline">
                  
                  <!-- History Item 1 -->
                  <div class="d-flex mb-4 pb-4 border-bottom">
                    <div class="flex-shrink-0 me-3">
                      <div class="bg-success bg-opacity-10 rounded-circle p-3">
                        <i class="bi bi-check-circle-fill text-success fs-4"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 class="mb-1 fw-bold">Pembayaran Berhasil</h6>
                          <p class="text-muted mb-1">Modern Apartment - November 2024</p>
                        </div>
                        <small class="text-muted">2 hari yang lalu</small>
                      </div>
                      <span class="badge bg-success">Rp 5.000.000</span>
                    </div>
                  </div>
```

**Penjelasan:**
- `flex-shrink-0`: Icon tidak shrink
- `flex-grow-1`: Content grow untuk fill space
- `bg-opacity-10`: Background dengan opacity 10%
- `rounded-circle p-3`: Circular icon container
- `align-items-start`: Align to top
- Timeline-style layout untuk history items

---

## Penjelasan Kode

### Bootstrap 5 Tab Component

Tabs menggunakan Bootstrap JavaScript:

```html
<!-- Tab Navigation -->
<button data-bs-toggle="tab" data-bs-target="#properties">

<!-- Tab Content -->
<div class="tab-pane fade show active" id="properties">
```

**Attributes penting:**
- `data-bs-toggle="tab"`: Enable tab functionality
- `data-bs-target`: Target tab content ID
- `tab-pane fade`: Tab content dengan fade animation
- `show active`: Tab yang ditampilkan saat load

### Responsive Grid Layout

```html
<div class="row g-4">
  <div class="col-lg-4">  <!-- Sidebar -->
  <div class="col-lg-8">  <!-- Main content -->
</div>
```

**Breakpoints:**
- Mobile (< 992px): Sidebar dan content stack vertical
- Desktop (≥ 992px): Sidebar 33% width, content 67% width

### Position Utilities

```html
<div class="position-relative">
  <img class="card-img-top">
  <span class="position-absolute top-0 end-0 m-3">Badge</span>
</div>
```

Untuk overlay elements di atas gambar.

---

## Komponen Bootstrap yang Digunakan

### 1. **Card Components**
- `card`: Container utama
- `card-header`: Header dengan background
- `card-body`: Content area
- `card-img-top`: Image di atas card
- `card-title`: Title dalam card
- `shadow-sm`: Small shadow

### 2. **Tab Components**
- `nav nav-tabs`: Tab navigation
- `nav-fill`: Full width tabs
- `tab-pane`: Tab content
- `fade show active`: Active tab dengan animation

### 3. **Badge Components**
- `badge`: Badge container
- `bg-*`: Background colors (primary, success, warning, etc.)

### 4. **Button Components**
- `btn btn-primary`: Primary button
- `btn-outline-*`: Outline variants
- `btn-sm`: Small button
- `rounded-circle`: Circular button

### 5. **Layout Utilities**
- `container`: Fixed width container
- `row`: Flex row
- `col-*`: Column classes
- `g-4`: Gutter spacing
- `d-flex`: Display flex
- `flex-fill`: Fill available space
- `gap-*`: Gap between flex items

### 6. **Spacing Utilities**
- `m-*`, `mt-*`, `mb-*`: Margin
- `p-*`, `px-*`, `py-*`: Padding

### 7. **Position Utilities**
- `position-relative`: Relative positioning
- `position-absolute`: Absolute positioning
- `top-0`, `end-0`: Position values

### 8. **Background Utilities**
- `bg-light`: Light background
- `bg-white`: White background
- `bg-opacity-*`: Background opacity

---

## Customization

### Mengganti Avatar

Gunakan service avatar atau upload custom:

```html
<!-- Option 1: UI Avatars (dynamic) -->
<img src="https://ui-avatars.com/api/?name=John+Doe&size=150&background=667eea&color=fff&bold=true">

<!-- Option 2: Custom upload -->
<img src="/assets/images/profile/john-doe.jpg">

<!-- Option 3: Gravatar -->
<img src="https://www.gravatar.com/avatar/hash?s=150&d=mp">
```

### Mengganti Cover Photo

```html
<div class="profile-cover" 
     style="height: 200px; background: url('/assets/images/cover.jpg') center/cover;">
</div>
```

### Custom CSS untuk Hover Effects

Buat di `src/app/profile/profile.css`:

```css
/* Card hover effect */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
}

/* Button animations */
.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

/* Profile picture border animation */
.rounded-circle {
  transition: border-color 0.3s ease;
}

.rounded-circle:hover {
  border-color: #667eea !important;
}

/* Tab active indicator */
.nav-tabs .nav-link.active {
  border-bottom: 3px solid #667eea;
}

/* Timeline connector line (optional) */
.timeline .d-flex::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 50px;
  bottom: -30px;
  width: 2px;
  background: #e9ecef;
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

```
http://localhost:4200/profile
```

### 3. Test Responsiveness

Test di berbagai screen sizes:
- Mobile portrait (320px - 480px)
- Mobile landscape (480px - 768px)
- Tablet (768px - 992px)
- Desktop (992px+)

### 4. Test Tab Functionality

Klik setiap tab untuk memastikan:
- Tab switching bekerja
- Content berubah sesuai tab
- Animation smooth
- No console errors

### 5. Test Interactions

- Hover pada cards (should have hover effect jika CSS added)
- Click buttons (should have ripple/scale effect)
- Responsive layout changes

---

## Troubleshooting

### Problem 1: Tabs tidak berfungsi
**Penyebab:** Bootstrap JS tidak loaded

**Solusi:** Pastikan Bootstrap Bundle JS ada di `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
```

### Problem 2: Icons tidak muncul
**Penyebab:** Bootstrap Icons tidak loaded

**Solusi:** Tambahkan di `index.html`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
```

### Problem 3: Images tidak load
**Penyebab:** URL gambar salah atau internet issue

**Solusi:** 
- Gunakan placeholder images dari Unsplash/Lorem Picsum
- Atau gunakan local images di `assets/images/`

### Problem 4: Layout broken di mobile
**Penyebab:** Missing responsive classes

**Solusi:** Pastikan menggunakan:
- `col-lg-*` untuk desktop layout
- `text-center text-lg-start` untuk responsive text alignment
- `w-100 w-lg-auto` untuk responsive button width

### Problem 5: Cards tidak sama tinggi
**Penyebab:** Missing `h-100` class

**Solusi:** Tambahkan `h-100` ke card:
```html
<div class="card h-100">
```

---

## Next Steps

Langkah lanjutan fokus pada PEMISAHAN (refactoring) `Profile Component` menjadi komponen yang lebih kecil, reusable, mudah dites, dan siap dihubungkan ke backend. Ringkasannya:

1. Pisahkan bagian besar menjadi komponen anak (child components)
2. Gunakan Input/Output untuk komunikasi data & event
3. Buat model/interface TypeScript untuk data (User, Property, HistoryItem)
4. Abstraksikan akses API ke dalam service terpisah
5. Tambahkan state management sederhana (optional) bila diperlukan
6. Tambahkan unit test dasar untuk setiap komponen baru

Dokumentasi lengkap modularisasi ada di file terpisah: `PROFILE_COMPONENT_NEXT_STEPS.md`.

Di bawah ini tetap disediakan versi singkat untuk logika awal sebelum modularisasi penuh.

### A. Tambahkan TypeScript Logic Awal (Monolit Sederhana)

Edit `src/app/profile/profile.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=150&background=667eea&color=fff&bold=true',
    isPremium: true,
    isVerified: true,
    memberSince: 'Jan 2024',
    bio: 'Seorang profesional yang mencari properti berkualitas...',
    job: 'Software Developer',
    birthdate: '15 Januari 1990',
    status: 'Married'
  };

  stats = {
    properties: 3,
    favorites: 12,
    rating: 4.8
  };

  socialLinks = {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  };

  properties = [
    {
      id: 1,
      title: 'Modern Apartment',
      location: 'Jakarta Selatan',
      price: 5000000,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      bedrooms: 2,
      bathrooms: 1,
      area: 45,
      status: 'Active'
    },
    // ... more properties
  ];

  favorites = [
    {
      id: 101,
      title: 'Beautiful Villa',
      location: 'Bali, Indonesia',
      price: 20000000,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop',
      bedrooms: 5,
      bathrooms: 4,
      area: 200,
      rating: 4.9
    }
    // ... favorite properties
  ];

  history = [
    {
      icon: 'bi-check-circle-fill',
      iconColor: 'success',
      title: 'Pembayaran Berhasil',
      description: 'Modern Apartment - November 2024',
      time: '2 hari yang lalu',
      badge: 'Rp 5.000.000',
      badgeColor: 'success'
    },
    // ... more history items
  ];

  onEditProfile() {
    console.log('Edit profile clicked');
    // Navigate to edit profile page
  }

  onSettings() {
    console.log('Settings clicked');
    // Navigate to settings page
  }

  onEditProperty(propertyId: number) {
    console.log('Edit property:', propertyId);
    // Navigate to edit property page
  }

  onDeleteProperty(propertyId: number) {
    if (confirm('Yakin ingin menghapus properti ini?')) {
      this.properties = this.properties.filter(p => p.id !== propertyId);
      console.log('Property deleted:', propertyId);
    }
  }
}
```

### B. Bind Data ke Template (Sementara)

Update `profile.html` untuk menggunakan data dari TypeScript:

```html
<h2 class="mb-1 fw-bold">{{ user.name }}</h2>
<p class="text-muted mb-2">
  <i class="bi bi-envelope-fill me-2"></i>{{ user.email }}
</p>

<!-- Stats -->
<h4 class="mb-0 fw-bold text-primary">{{ stats.properties }}</h4>

<!-- Loop properties -->
<div class="col-md-6" *ngFor="let property of properties">
  <div class="card h-100 shadow-sm border-0">
    <img [src]="property.image" class="card-img-top" [alt]="property.title">
    <div class="card-body">
      <h5 class="card-title fw-bold">{{ property.title }}</h5>
      <p class="text-muted mb-2">
        <i class="bi bi-geo-alt-fill me-1"></i>{{ property.location }}
      </p>
      <span class="text-primary fw-bold fs-5">
        Rp {{ property.price | number }}/bulan
      </span>
      <!-- ... -->
    </div>
  </div>
</div>
```

---

## Referensi

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [Bootstrap Tabs](https://getbootstrap.com/docs/5.0/components/navs-tabs/)
- [Bootstrap Cards](https://getbootstrap.com/docs/5.0/components/card/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Angular Components](https://angular.io/guide/component-overview)
- [Unsplash API](https://unsplash.com/developers) - untuk images
- [UI Avatars](https://ui-avatars.com/) - untuk dynamic avatars

---

## Kesimpulan

Dengan mengikuti panduan ini, Anda telah berhasil membuat Profile Component yang:
- ✅ Fully responsive di semua device
- ✅ Modern design dengan Bootstrap 5
- ✅ Interactive tabs untuk organize content
- ✅ Profile header yang rapi dan informatif
- ✅ Comprehensive stats dan info cards
- ✅ Property management dengan CRUD actions
- ✅ Timeline-style history
- ✅ Social media integration

---

**Happy Coding! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*