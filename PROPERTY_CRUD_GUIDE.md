# Panduan Implementasi CRUD Property (Housing)

## Deskripsi
Panduan lengkap untuk mengimplementasikan fitur CRUD (Create, Read, Update, Delete) pada Property/Housing. Tutorial ini mencakup implementasi backend API dan integrasi dengan frontend Angular.

## Tujuan Pembelajaran
Setelah mengikuti panduan ini, Anda akan dapat:
- ✅ Membuat endpoint backend untuk Create, Update, Delete property
- ✅ Mengintegrasikan CRUD operations dengan HousingService
- ✅ Implementasi form tambah/edit property
- ✅ Handle delete confirmation dan update UI
- ✅ Testing CRUD operations end-to-end

---

## Prerequisites

### 1. Backend Server Running
Pastikan backend server (`griya-mdp-backend-jwt`) sudah berjalan:

```bash
cd griya-mdp-backend-jwt
npm start
```

### 2. Database Connection
Pastikan MongoDB Atlas sudah terkoneksi (cek console: `Connected To MongoDB`)

### 3. Existing Services
- ✅ HousingService sudah ada di `src/app/services/housing.service.ts`
- ✅ Housing Model sudah ada di `app_server/models/housing.js`

---

## Langkah 1: Update Backend Controller (CRUD Methods)

### File: `app_server/controllers/housingcontroller.js`

Tambahkan method Create, Update, dan Delete:

```javascript
// Create new housing
const Create = async (req, res) => {
    try {
        const { title, location, price, bedrooms, bathrooms, area, image, rating, status, type, description } = req.body;
        
        // Validasi field required
        if (!title || !location || !price || !bedrooms || !bathrooms || !area || !image || !status) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib harus diisi"
            });
        }

        // Generate ID otomatis (ambil ID tertinggi + 1)
        const lastHousing = await Housing.findOne().sort({ id: -1 });
        const newId = lastHousing ? lastHousing.id + 1 : 1;

        // Get userId from JWT token (set by verifyToken middleware)
        const userId = req.user ? req.user.id : null;

        // Buat housing baru
        const newHousing = new Housing({
            id: newId,
            userId: userId,
            title: title.trim(),
            location: location.trim(),
            price: Number(price),
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            area: Number(area),
            image: image.trim(),
            rating: rating ? Number(rating) : 0,
            status: status,
            type: type || 'rumah',
            description: description || '',
            postedDays: 0
        });

        // Simpan ke database
        await newHousing.save();

        res.status(201).json({
            success: true,
            message: "Properti berhasil ditambahkan",
            data: newHousing
        });

    } catch (error) {
        console.error("Create Housing Error:", error);
        
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

// Update housing
const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Cari dan update housing
        const housing = await Housing.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!housing) {
            return res.status(404).json({
                success: false,
                message: "Properti tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Properti berhasil diupdate",
            data: housing
        });

    } catch (error) {
        console.error("Update Housing Error:", error);
        
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid housing ID format"
            });
        }

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

// Delete housing
const Delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Cari dan hapus housing
        const housing = await Housing.findByIdAndDelete(id);

        if (!housing) {
            return res.status(404).json({
                success: false,
                message: "Properti tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Properti berhasil dihapus",
            data: housing
        });

    } catch (error) {
        console.error("Delete Housing Error:", error);
        
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid housing ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

// Get My Housing (properties owned by current user)
const GetMyHousing = async (req, res) => {
    try {
        // Get userId from JWT token (set by verifyToken middleware)
        const userId = req.user.id;
        console.log("GetMyHousing - User ID:", userId);

        // Find all housing owned by this user
        const myHousing = await Housing.find({ userId: userId });

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data properti",
            data: myHousing
        });

    } catch (error) {
        console.error("Get My Housing Error:", error);
        
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

module.exports = { Index, GetById, Create, Update, Delete, GetMyHousing };
```

---

## Langkah 2: Update Housing Model

### File: `app_server/models/housing.js`

Tambahkan field `userId` untuk tracking kepemilikan properti:

```javascript
const housingSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    // ... field lainnya ...
});
```

---

## Langkah 3: Update Routes

### File: `app_server/routes/housing.js`

Tambahkan routes untuk CRUD dan My Housing:

```javascript
const express = require("express");
const router = express.Router();
const housingController = require("../controllers/housingcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

// Get my housing (Protected - requires JWT)
router.get("/my", verifyToken, housingController.GetMyHousing);

// Get all housing (with optional type filter via query parameter)
router.get("/", housingController.Index);

// Get housing by ID
router.get("/:id", housingController.GetById);

// Create new housing (Protected - requires JWT)
router.post("/", verifyToken, housingController.Create);

// Update housing (Protected - requires JWT)
router.put("/:id", verifyToken, housingController.Update);

// Delete housing (Protected - requires JWT)
router.delete("/:id", verifyToken, housingController.Delete);

module.exports = router;
```

**Catatan Penting:**
- Route `/my` harus di atas route `/:id` untuk menghindari konflik routing
- Semua route CRUD (Create, Update, Delete) dan My Housing dilindungi dengan `verifyToken`
- Route public (Get all, Get by ID) tidak memerlukan JWT

---

## Langkah 5: Update Frontend Housing Service

### File: `src/app/services/housing.service.ts`

Tambahkan methods untuk CRUD dan Get My Housing:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Housing } from '../lokasi-perumahan/housing.model';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private apiUrl = 'http://localhost:3000/housing';
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get all housing
   */
  getAllHousing(): Observable<Housing[]> {
    return this.http.get<Housing[]>(this.apiUrl);
  }
  
  /**
   * Get housing by ID
   */
  getHousingById(id: number): Observable<Housing> {
    return this.http.get<Housing>(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Filter housing by type
   */
  filterHousingByType(type: string): Observable<Housing[]> {
    return this.http.get<Housing[]>(`${this.apiUrl}?type=${type}`);
  }

  /**
   * Create new housing
   */
  createHousing(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /**
   * Update housing
   */
  updateHousing(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete housing
   */
  deleteHousing(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get my housing (properties owned by current user)
   * Requires JWT token in Authorization header
   */
  getMyHousing(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my`);
  }
}
```

**Catatan:** Method `getMyHousing()` otomatis mengirim JWT token karena sudah ada Auth Interceptor yang menambahkan header `Authorization: Bearer <token>` pada setiap request.

---

## Langkah 6: Update Profile Component

### File: `src/app/profile/profile.ts`

Implementasikan `ngOnInit()` dan `loadMyProperties()` untuk mengambil data dari API:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// ... imports lainnya ...
import { HousingService } from '../services/housing.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    // ... imports lainnya ...
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(
    private housingService: HousingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMyProperties();
  }

  loadMyProperties() {
    this.housingService.getMyHousing().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.properties = response.data.map((housing: any) => ({
            id: housing.id,
            title: housing.title,
            location: housing.location,
            price: housing.price,
            image: housing.image,
            bedrooms: housing.bedrooms,
            bathrooms: housing.bathrooms,
            area: housing.area,
            status: housing.status
          }));
          this.stats.properties = this.properties.length;
        }
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  // ... properties dan methods lainnya ...

  onDeleteProperty(propertyId: number) {
    if (confirm('Yakin ingin menghapus properti ini?')) {
      this.housingService.deleteHousing(propertyId).subscribe({
        next: (response) => {
          console.log('Property deleted:', response);
          // Reload properties after delete
          this.loadMyProperties();
        },
        error: (error) => {
          console.error('Error deleting property:', error);
          alert('Gagal menghapus properti: ' + (error.error?.message || 'Terjadi kesalahan'));
        }
      });
    }
  }
}
```

**Penjelasan:**
- `ngOnInit()` dipanggil saat component diinisialisasi
- `loadMyProperties()` memanggil API `/housing/my` untuk mengambil properti milik user
- Data dari API (MongoDB `_id`) di-mapping ke format yang digunakan component
- `onDeleteProperty()` memanggil API delete, lalu refresh data dengan `loadMyProperties()`
- `stats.properties` otomatis update sesuai jumlah properti

---

## Langkah 7: Implementasi Create/Update (Form Property)

### Buat Component baru untuk Form Property
   * Update housing
   */
  updateHousing(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete housing
   */
  deleteHousing(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

---

## Langkah 4: Implementasi Create/Update (Form Property)

### Buat Component baru untuk Form Property

**Generate component:**
```bash
cd griya-mdp
ng generate component property-form
```

### File: `src/app/property-form/property-form.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HousingService } from '../services/housing.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm implements OnInit {
  propertyForm: FormGroup;
  isEditMode = false;
  propertyId: number = 0;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private housingService: HousingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      bedrooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      area: ['', [Validators.required, Validators.min(1)]],
      image: ['', Validators.required],
      status: ['Available', Validators.required],
      type: ['rumah', Validators.required],
      description: [''],
      rating: [0, [Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit() {
    // Cek apakah edit mode
    this.route.params.subscribe(params => {
        this.propertyId = +params['id']; // + untuk convert string ke number
        if (this.propertyId) {
            this.isEditMode = true;
            this.loadPropertyData();
        }
    });
    
  }

  loadPropertyData() {
    if (!this.propertyId) return;

    this.housingService.getHousingById(this.propertyId).subscribe({
      next: (housing) => {
        this.propertyForm.patchValue(housing);
      },
      error: (error) => {
        console.error('Load error:', error);
        this.errorMessage = 'Gagal memuat data properti';
      }
    });
  }

  submitForm() {
    if (this.propertyForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.propertyForm.value;

      if (this.isEditMode && this.propertyId) {
        // Update
        this.housingService.updateHousing(this.propertyId, formData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message || 'Properti berhasil diupdate';
            setTimeout(() => this.router.navigate(['/profile']), 2000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Gagal update properti';
          }
        });
      } else {
        // Create
        this.housingService.createHousing(formData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response.message || 'Properti berhasil ditambahkan';
            this.propertyForm.reset();
            setTimeout(() => this.router.navigate(['/profile']), 2000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Gagal menambahkan properti';
          }
        });
      }
    }
  }
}
```

### File: `src/app/property-form/property-form.html`

```html
<!-- Property Form Section -->
<section class="property-form-section py-5">
  <div class="container">
    <div class="row">
      <div class="col-lg-10 mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold text-primary mb-3">
            <i class="bi bi-house-add me-3"></i>
            {{ isEditMode ? 'Edit Properti' : 'Tambah Properti Baru' }}
          </h1>
          <p class="lead text-muted">
            {{ isEditMode ? 'Perbarui informasi properti Anda' : 'Daftarkan properti Anda dan mulai mendapatkan penyewa' }}
          </p>
        </div>

        <!-- Property Form Card -->
        <div class="card shadow-lg border-0">
          <div class="card-body p-4 p-md-5">
            
            <!-- Success Alert -->
            @if (successMessage) {
              <div class="alert alert-success d-flex align-items-center" role="alert">
                <i class="bi bi-check-circle-fill me-3 fs-4"></i>
                <div>{{ successMessage }}</div>
              </div>
            }

            <!-- Error Alert -->
            @if (errorMessage) {
              <div class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                <div>{{ errorMessage }}</div>
              </div>
            }

            <form [formGroup]="propertyForm" (ngSubmit)="submitForm()">
              <!-- Title -->
              <div class="mb-4">
                <label for="title" class="form-label fw-semibold">
                  <i class="bi bi-house-fill me-2"></i>Judul Properti *
                </label>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  id="title"
                  formControlName="title"
                  [class.is-invalid]="propertyForm.get('title')?.invalid && propertyForm.get('title')?.touched"
                  placeholder="Contoh: Rumah Minimalis Modern">
                <div class="invalid-feedback" *ngIf="propertyForm.get('title')?.invalid && propertyForm.get('title')?.touched">
                  Judul minimal 3 karakter
                </div>
                <div class="form-text" *ngIf="!propertyForm.get('title')?.touched || propertyForm.get('title')?.valid">
                  Gunakan judul yang menarik dan deskriptif
                </div>
              </div>

              <!-- Location -->
              <div class="mb-4">
                <label for="location" class="form-label fw-semibold">
                  <i class="bi bi-geo-alt-fill me-2"></i>Lokasi *
                </label>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  id="location"
                  formControlName="location"
                  [class.is-invalid]="propertyForm.get('location')?.invalid && propertyForm.get('location')?.touched"
                  placeholder="Contoh: Jakarta Selatan">
                <div class="invalid-feedback" *ngIf="propertyForm.get('location')?.invalid && propertyForm.get('location')?.touched">
                  Lokasi harus diisi
                </div>
              </div>

              <!-- Price -->
              <div class="mb-4">
                <label for="price" class="form-label fw-semibold">
                  <i class="bi bi-currency-dollar me-2"></i>Harga Sewa per Bulan (Rp) *
                </label>
                <input 
                  type="number" 
                  class="form-control form-control-lg" 
                  id="price"
                  formControlName="price"
                  [class.is-invalid]="propertyForm.get('price')?.invalid && propertyForm.get('price')?.touched"
                  placeholder="5000000">
                <div class="invalid-feedback" *ngIf="propertyForm.get('price')?.invalid && propertyForm.get('price')?.touched">
                  Harga harus diisi dan lebih dari 0
                </div>
                <div class="form-text" *ngIf="!propertyForm.get('price')?.touched || propertyForm.get('price')?.valid">
                  Masukkan harga dalam Rupiah tanpa titik atau koma
                </div>
              </div>

              <!-- Property Details Row -->
              <div class="row mb-4">
                <!-- Bedrooms -->
                <div class="col-md-4 mb-3 mb-md-0">
                  <label for="bedrooms" class="form-label fw-semibold">
                    <i class="bi bi-door-closed-fill me-2"></i>Kamar Tidur *
                  </label>
                  <input 
                    type="number" 
                    class="form-control form-control-lg" 
                    id="bedrooms"
                    formControlName="bedrooms"
                    [class.is-invalid]="propertyForm.get('bedrooms')?.invalid && propertyForm.get('bedrooms')?.touched"
                    min="1">
                  <div class="invalid-feedback" *ngIf="propertyForm.get('bedrooms')?.invalid && propertyForm.get('bedrooms')?.touched">
                    Minimal 1 kamar tidur
                  </div>
                </div>

                <!-- Bathrooms -->
                <div class="col-md-4 mb-3 mb-md-0">
                  <label for="bathrooms" class="form-label fw-semibold">
                    <i class="bi bi-droplet-fill me-2"></i>Kamar Mandi *
                  </label>
                  <input 
                    type="number" 
                    class="form-control form-control-lg" 
                    id="bathrooms"
                    formControlName="bathrooms"
                    [class.is-invalid]="propertyForm.get('bathrooms')?.invalid && propertyForm.get('bathrooms')?.touched"
                    min="1">
                  <div class="invalid-feedback" *ngIf="propertyForm.get('bathrooms')?.invalid && propertyForm.get('bathrooms')?.touched">
                    Minimal 1 kamar mandi
                  </div>
                </div>

                <!-- Area -->
                <div class="col-md-4">
                  <label for="area" class="form-label fw-semibold">
                    <i class="bi bi-rulers me-2"></i>Luas (m²) *
                  </label>
                  <input 
                    type="number" 
                    class="form-control form-control-lg" 
                    id="area"
                    formControlName="area"
                    [class.is-invalid]="propertyForm.get('area')?.invalid && propertyForm.get('area')?.touched"
                    min="1">
                  <div class="invalid-feedback" *ngIf="propertyForm.get('area')?.invalid && propertyForm.get('area')?.touched">
                    Luas harus lebih dari 0
                  </div>
                </div>
              </div>

              <!-- Image URL -->
              <div class="mb-4">
                <label for="image" class="form-label fw-semibold">
                  <i class="bi bi-image-fill me-2"></i>URL Gambar *
                </label>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  id="image"
                  formControlName="image"
                  [class.is-invalid]="propertyForm.get('image')?.invalid && propertyForm.get('image')?.touched"
                  placeholder="https://example.com/image.jpg">
                <div class="invalid-feedback" *ngIf="propertyForm.get('image')?.invalid && propertyForm.get('image')?.touched">
                  URL gambar harus diisi
                </div>
                <div class="form-text" *ngIf="!propertyForm.get('image')?.touched || propertyForm.get('image')?.valid">
                  Gunakan URL gambar dari Unsplash, Pexels, atau sumber lainnya
                </div>
              </div>

              <!-- Property Type & Status Row -->
              <div class="row mb-4">
                <!-- Type -->
                <div class="col-md-4 mb-3 mb-md-0">
                  <label for="type" class="form-label fw-semibold">
                    <i class="bi bi-building me-2"></i>Tipe Properti *
                  </label>
                  <select 
                    class="form-select form-select-lg" 
                    id="type"
                    formControlName="type"
                    [class.is-invalid]="propertyForm.get('type')?.invalid && propertyForm.get('type')?.touched">
                    <option value="rumah">Rumah</option>
                    <option value="apartemen">Apartemen</option>
                    <option value="villa">Villa</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="propertyForm.get('type')?.invalid && propertyForm.get('type')?.touched">
                    Tipe properti harus dipilih
                  </div>
                </div>

                <!-- Status -->
                <div class="col-md-4 mb-3 mb-md-0">
                  <label for="status" class="form-label fw-semibold">
                    <i class="bi bi-flag-fill me-2"></i>Status *
                  </label>
                  <select 
                    class="form-select form-select-lg" 
                    id="status"
                    formControlName="status"
                    [class.is-invalid]="propertyForm.get('status')?.invalid && propertyForm.get('status')?.touched">
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="propertyForm.get('status')?.invalid && propertyForm.get('status')?.touched">
                    Status harus dipilih
                  </div>
                </div>

                <!-- Rating -->
                <div class="col-md-4">
                  <label for="rating" class="form-label fw-semibold">
                    <i class="bi bi-star-fill me-2"></i>Rating (0-5)
                  </label>
                  <input 
                    type="number" 
                    class="form-control form-control-lg" 
                    id="rating"
                    formControlName="rating"
                    [class.is-invalid]="propertyForm.get('rating')?.invalid && propertyForm.get('rating')?.touched"
                    min="0" max="5" step="0.1"
                    placeholder="4.5">
                  <div class="invalid-feedback" *ngIf="propertyForm.get('rating')?.invalid && propertyForm.get('rating')?.touched">
                    Rating harus antara 0-5
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-4">
                <label for="description" class="form-label fw-semibold">
                  <i class="bi bi-pencil-fill me-2"></i>Deskripsi Properti
                </label>
                <textarea 
                  class="form-control" 
                  id="description"
                  rows="5"
                  formControlName="description"
                  [class.is-invalid]="propertyForm.get('description')?.invalid && propertyForm.get('description')?.touched"
                  placeholder="Deskripsikan properti Anda secara detail, termasuk fasilitas, lingkungan sekitar, dan keunggulan lainnya..."></textarea>
                <div class="form-text" *ngIf="!propertyForm.get('description')?.touched || propertyForm.get('description')?.valid">
                  Deskripsi yang detail akan menarik lebih banyak calon penyewa
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg py-3"
                  [disabled]="propertyForm.invalid || isLoading">
                  @if (isLoading) {
                    <span class="spinner-border spinner-border-sm me-2"></span>
                  }
                  @if (!isLoading) {
                    <i class="bi bi-save-fill me-2"></i>
                  }
                  {{ isEditMode ? 'Update Properti' : 'Simpan Properti' }}
                </button>
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  (click)="goBack()">
                  <i class="bi bi-arrow-left me-2"></i>Kembali ke Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Information Alert -->
        <div class="alert alert-info d-flex align-items-center mt-4" role="alert">
          <i class="bi bi-info-circle-fill me-3 fs-4"></i>
          <div>
            <strong>Tips:</strong> Pastikan semua informasi yang Anda masukkan akurat dan lengkap. Properti dengan informasi lengkap dan gambar berkualitas cenderung mendapat lebih banyak peminat.
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Langkah 5: Update Routes

### File: `src/app/app.routes.ts`

Tambahkan route untuk form property:

```typescript
import { PropertyForm } from './property-form/property-form';

export const routes: Routes = [
    // ... existing routes ...
    {
        path: "property/add",
        component: PropertyForm,
        canActivate: [authGuard]
    },
    {
        path: "property/edit/:id",
        component: PropertyForm,
        canActivate: [authGuard]
    },
    // ... existing routes ...
];
```

---

## Langkah 6: Update Profile Template (Link ke Form)

### Update File: `src/app/profile/profile.html`

Update button "Tambah Properti" dan method onEditProperty:

```html
<!-- Add New Property Card -->
<div class="col-md-6">
  <div class="card h-100 shadow-sm border-2 border-dashed" style="border-color: #ddd;">
    <div class="card-body d-flex flex-column justify-content-center align-items-center text-center py-5">
      <i class="bi bi-plus-circle display-1 text-primary mb-3"></i>
      <h5 class="mb-2">Tambah Properti Baru</h5>
      <p class="text-muted mb-3">Daftarkan properti Anda dan mulai mendapatkan penyewa</p>
      <a routerLink="/property/add" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Tambah Properti
      </a>
    </div>
  </div>
</div>
```

### Update method onEditProperty di `profile.ts`:

```typescript
onEditProperty(propertyId: number) {
  this.router.navigate(['/property/edit', propertyId]);
}
```

Jangan lupa import Router:
```typescript
import { Router, RouterLink } from '@angular/router';
import { HousingService } from '../services/housing.service';

constructor(
  private housingService: HousingService,
  private router: Router
) {}
```

---

## Testing

### 1. Test Load My Properties
1. Login ke aplikasi
2. Buka halaman Profile
3. Pastikan hanya properti milik user yang login yang tampil
4. Cek console jika ada error
5. Verify jumlah properti di stats card sesuai dengan data

### 2. Test Create Property
1. Login ke aplikasi
2. Buka halaman Profile
3. Klik tombol "Tambah Properti"
4. Isi semua field required
5. Klik "Simpan Properti"
6. Pastikan properti baru muncul di halaman Profile
7. Verify `userId` tersimpan di database (cek MongoDB Atlas)

### 3. Test Update Property
1. Di halaman Profile, klik tombol Edit pada salah satu properti
2. Ubah beberapa field
3. Klik "Update Properti"
4. Cek apakah perubahan tersimpan dan tampil di Profile

### 4. Test Delete Property
1. Di halaman Profile, klik tombol Delete pada salah satu properti
2. Konfirmasi dialog delete
3. Pastikan properti hilang dari list
4. Verify stats.properties berkurang
5. Cek database untuk memastikan data terhapus

### 4. Test Validation
- Coba submit form tanpa mengisi field required
- Coba input harga/jumlah kamar dengan nilai negatif
- Coba input rating di luar range 0-5

### 5. Test Authorization
- Coba akses `/property/add` tanpa login (seharusnya redirect ke `/login`)
- Coba akses `/property/edit/:id` tanpa login
- Coba panggil API `/housing/my` tanpa JWT token (seharusnya 401 Unauthorized)

---

## Troubleshooting

### Property tidak muncul setelah create
- Cek Network tab, pastikan response 201 Created
- Cek MongoDB Atlas, pastikan data tersimpan dengan `userId`
- Reload halaman profile atau panggil `loadMyProperties()` lagi

### Error "Cannot read property 'id' of undefined"
- Pastikan middleware `verifyToken` berfungsi dengan benar
- Cek apakah JWT token dikirim di header Authorization
- Verify token tidak expired (max 1 jam)

### Hanya muncul properti tanpa userId
- Properti lama (sebelum update) tidak memiliki `userId`
- Buat properti baru setelah implementasi untuk testing
- Atau update manual di MongoDB: tambahkan field `userId` ke dokumen lama

### Route /my bentrok dengan /:id
- Pastikan route `/my` ditulis DI ATAS route `/:id` di `housing.js`
- Restart backend server setelah update routes
---

**Implementasi CRUD Property Complete! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*
