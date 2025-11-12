# Panduan Desain Component Home (Angular + Bootstrap 5)

Dokumen ini menjelaskan langkah-langkah mendesain halaman Home untuk aplikasi **Griya MDP** menggunakan Angular dan Bootstrap 5. Halaman ini menampilkan daftar perumahan dengan komponen `lokasi-perumahan`.

---

## � Daftar Isi

1. [Backend API Integration](#1-backend-api-integration)
2. [Pagination Implementation](#2-pagination-implementation)
3. [Search Functionality](#3-search-functionality)
4. [Checklist Implementasi](#-checklist-implementasi)
5. [Referensi](#-referensi)

---

## �🚀 Implementasi Pengembangan Lanjutan

### 1. Backend API Integration

#### 📌 Langkah 1.1: Buat Housing Model (Jika Belum Ada)

**File:** `src/app/lokasi-perumahan/housing.model.ts`

```typescript
export interface Housing {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  rating: number;
  status: string;
  type?: string;
  description?: string;
  postedDays?: number;
}
```

**Penjelasan:**
- Interface ini mendefinisikan struktur data perumahan
- `?` berarti property optional

---

#### 📌 Langkah 1.2: Buat Housing Service

**Cara 1: Menggunakan Angular CLI (Recommended)**

Jalankan command berikut di terminal:

```bash
ng generate service services/housing
```

atau versi singkatnya:

```bash
ng g s services/housing
```

Command ini akan:
- ✅ Membuat file `src/app/services/housing.service.ts`
- ✅ Membuat file `src/app/services/housing.service.spec.ts` (untuk testing)
- ✅ Otomatis menambahkan decorator `@Injectable({ providedIn: 'root' })`

**Cara 2: Membuat Manual**

**File:** `src/app/services/housing.service.ts`

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
  
  getAllHousing(): Observable<Housing[]> {
    return this.http.get<Housing[]>(this.apiUrl);
  }
  
  getHousingById(id: number): Observable<Housing> {
    return this.http.get<Housing>(`${this.apiUrl}/${id}`);
  }
  
  filterHousingByType(type: string): Observable<Housing[]> {
    return this.http.get<Housing[]>(`${this.apiUrl}?type=${type}`);
  }
}
```

**Penjelasan:**
- `ng generate service` - Command untuk membuat service baru
- `services/housing` - Path dan nama service (folder akan dibuat otomatis)
- `@Injectable({ providedIn: 'root' })` - Service tersedia di seluruh app
- `HttpClient` - Untuk HTTP requests
- `Observable<Housing[]>` - Return type asynchronous
- `apiUrl` - Endpoint backend (sesuaikan dengan backend Anda)

**💡 Tips:**
- Gunakan Angular CLI untuk konsistensi dan menghindari typo
- Pastikan backend berjalan di `http://localhost:3000`
- Endpoint harus return array of Housing objects
- Folder `services` akan dibuat otomatis jika belum ada

---

#### 📌 Langkah 1.3: Konfigurasi HttpClient

**File:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()  // ← Tambahkan ini
  ]
};
```

**Penjelasan:**
- `provideHttpClient()` - Enable HttpClient di seluruh aplikasi
- Wajib ditambahkan agar HttpClient bisa digunakan

---

#### 📌 Langkah 1.4: Update Home Component

**File:** `src/app/home/home.ts`

**Import yang diperlukan:**
```typescript
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';  // ← Untuk search
import { LokasiPerumahan } from '../lokasi-perumahan/lokasi-perumahan';
import { Housing } from '../lokasi-perumahan/housing.model';
import { HousingService } from '../services/housing.service';  // ← Import service
import { CommonModule } from '@angular/common';
```

**Component Decorator:**
```typescript
@Component({
  selector: 'app-home',
  imports: [LokasiPerumahan, CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
```

**Properties:**
```typescript
export class Home implements OnInit {
  // Data arrays
  housingList: Housing[] = [];        // Data dari backend
  filteredList: Housing[] = [];       // Data setelah filter/search
  
  // State management
  isLoading: boolean = false;         // Loading state
  errorMessage: string = '';          // Error message
  selectedFilter: string = 'all';     // Filter aktif
  
  // Search
  searchQuery: string = '';           // Query pencarian
  
  // Pagination
  currentPage: number = 1;            // Halaman saat ini
  itemsPerPage: number = 6;           // Items per halaman
  
  // Fallback data (jika backend tidak tersedia)
  private fallbackData: Housing[] = [
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
      description: 'Hunian modern dengan desain minimalis.',
      postedDays: 2
    },
    // ... tambahkan data lainnya
  ];
  
  constructor(private housingService: HousingService) {}
  
  ngOnInit() {
    this.loadHousingData();
  }
  
  loadHousingData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.housingService.getAllHousing().subscribe({
      next: (data) => {
        this.housingList = data;
        this.filteredList = data;
        this.isLoading = false;
        console.log('Data berhasil dimuat dari backend:', data);
      },
      error: (err) => {
        console.error('Error loading housing data:', err);
        // Gunakan data fallback
        this.housingList = this.fallbackData;
        this.filteredList = this.fallbackData;
        this.isLoading = false;
        this.errorMessage = 'Menggunakan data demo (backend tidak tersedia)';
      }
    });
  }
}
```

**Penjelasan:**
- `housingList` - Semua data dari backend
- `filteredList` - Data setelah filter/search
- `isLoading` - Untuk menampilkan spinner
- `errorMessage` - Pesan error/info
- `fallbackData` - Data cadangan jika backend mati
- `subscribe()` - Listen to Observable
- `next` - Callback saat sukses
- `error` - Callback saat error

---

#### 📌 Langkah 1.5: Update Template dengan Loading State

**File:** `src/app/home/home.html`

**Tambahkan error alert:**
```html
<!-- Error/Info Message -->
<div class="alert alert-info alert-dismissible fade show" role="alert" *ngIf="errorMessage">
  <i class="bi bi-info-circle me-2"></i>{{ errorMessage }}
  <button type="button" class="btn-close" (click)="errorMessage = ''" aria-label="Close"></button>
</div>
```

**Tambahkan loading spinner:**
```html
<!-- Loading Spinner -->
<div class="row" *ngIf="isLoading">
  <div class="col-12 text-center py-5">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="text-muted mt-3">Memuat data properti...</p>
  </div>
</div>
```

**Update data display:**
```html
<!-- Housing Cards Grid -->
<div class="row g-4 mb-4" *ngIf="!isLoading">
  <div class="col-md-6 col-lg-4" *ngFor="let house of filteredList">
    <app-lokasi-perumahan [housing]="house"></app-lokasi-perumahan>
  </div>
</div>
```

---

### 2. Pagination Implementation

#### 📌 Langkah 2.1: Tambahkan Computed Properties

**File:** `src/app/home/home.ts`

```typescript
// Computed property untuk data yang ditampilkan (paginated)
get paginatedList(): Housing[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredList.slice(start, start + this.itemsPerPage);
}

// Total halaman
get totalPages(): number {
  return Math.ceil(this.filteredList.length / this.itemsPerPage);
}

// Array untuk loop pagination buttons
get totalPagesArray(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

// Index awal item di halaman ini
get startIndex(): number {
  return (this.currentPage - 1) * this.itemsPerPage + 1;
}

// Index akhir item di halaman ini
get endIndex(): number {
  return Math.min(this.currentPage * this.itemsPerPage, this.filteredList.length);
}
```

**Penjelasan:**
- `paginatedList` - Hanya 6 items yang ditampilkan per halaman
- `totalPages` - Jumlah total halaman (misal: 9 items = 2 halaman)
- `slice()` - Memotong array sesuai range
- `Math.ceil()` - Pembulatan ke atas (9 items / 6 = 1.5 → 2 pages)

---

#### 📌 Langkah 2.2: Tambahkan Navigation Methods

```typescript
// Pindah ke halaman tertentu
goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    // Smooth scroll ke section
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// Halaman berikutnya
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.goToPage(this.currentPage + 1);
  }
}

// Halaman sebelumnya
previousPage() {
  if (this.currentPage > 1) {
    this.goToPage(this.currentPage - 1);
  }
}
```

**Penjelasan:**
- Validasi `page >= 1 && page <= totalPages` - Cegah navigate ke halaman invalid
- `scrollIntoView()` - Scroll otomatis ke section properties
- `behavior: 'smooth'` - Animasi scroll yang halus

---

#### 📌 Langkah 2.3: Update Template - Ganti filteredList dengan paginatedList

**File:** `src/app/home/home.html`

```html
<!-- Housing Cards Grid (PENTING: Gunakan paginatedList) -->
<div class="row g-4 mb-4" *ngIf="!isLoading">
  <div class="col-md-6 col-lg-4" *ngFor="let house of paginatedList">
    <app-lokasi-perumahan [housing]="house"></app-lokasi-perumahan>
  </div>
</div>
```

---

#### 📌 Langkah 2.4: Tambahkan Pagination Controls

**Tambahkan sebelum closing tag `</div></section>` di Properties Section:**

```html
<!-- Pagination Info & Controls -->
<div class="row" *ngIf="filteredList.length > 0 && !isLoading">
  <div class="col-12">
    <!-- Pagination Info -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <p class="text-muted mb-0">
        Menampilkan {{ startIndex }} - {{ endIndex }} dari {{ filteredList.length }} properti
      </p>
      <p class="text-muted mb-0">
        Halaman {{ currentPage }} dari {{ totalPages }}
      </p>
    </div>

    <!-- Pagination Controls -->
    <nav aria-label="Property pagination" *ngIf="totalPages > 1">
      <ul class="pagination justify-content-center">
        <!-- Previous Button -->
        <li class="page-item" [class.disabled]="currentPage === 1">
          <button class="page-link" (click)="previousPage()" [disabled]="currentPage === 1">
            <i class="bi bi-chevron-left"></i> Previous
          </button>
        </li>

        <!-- First Page -->
        <li class="page-item" *ngIf="currentPage > 2">
          <button class="page-link" (click)="goToPage(1)">1</button>
        </li>

        <!-- Ellipsis -->
        <li class="page-item disabled" *ngIf="currentPage > 3">
          <span class="page-link">...</span>
        </li>

        <!-- Page Numbers (current and adjacent) -->
        <li class="page-item" 
            *ngFor="let page of totalPagesArray"
            [class.active]="currentPage === page"
            [hidden]="page < currentPage - 1 || page > currentPage + 1">
          <button class="page-link" (click)="goToPage(page)">{{ page }}</button>
        </li>

        <!-- Ellipsis -->
        <li class="page-item disabled" *ngIf="currentPage < totalPages - 2">
          <span class="page-link">...</span>
        </li>

        <!-- Last Page -->
        <li class="page-item" *ngIf="currentPage < totalPages - 1">
          <button class="page-link" (click)="goToPage(totalPages)">{{ totalPages }}</button>
        </li>

        <!-- Next Button -->
        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <button class="page-link" (click)="nextPage()" [disabled]="currentPage === totalPages">
            Next <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>
```

**Penjelasan:**
- `*ngIf="totalPages > 1"` - Hanya tampil jika lebih dari 1 halaman
- `[class.disabled]` - Disabled state untuk first/last page
- `[class.active]` - Highlight halaman aktif
- `[hidden]` - Smart display (hanya tampilkan current ± 1)
- Ellipsis (`...`) - Untuk banyak halaman

**Visualisasi Pagination:**
```
[Previous] [1] [...] [3] [4] [5] [...] [10] [Next]
                      ^active^
```

---

### 3. Search Functionality

#### 📌 Langkah 3.1: Tambahkan Search Methods

**File:** `src/app/home/home.ts`

```typescript
// Method yang dipanggil saat user mengetik
searchHousing() {
  this.currentPage = 1; // Reset ke halaman pertama
  this.applySearch();
}

// Logic search sebenarnya
private applySearch() {
  const query = this.searchQuery.toLowerCase().trim();
  
  // Jika search kosong, kembalikan ke filter saat ini
  if (!query) {
    this.filterByType(this.selectedFilter);
    return;
  }

  // Base list berdasarkan filter
  let baseList = this.selectedFilter === 'all' 
    ? this.housingList 
    : this.housingList.filter(h => h.type === this.selectedFilter);

  // Apply search pada base list
  this.filteredList = baseList.filter(house => 
    house.title.toLowerCase().includes(query) ||
    house.location.toLowerCase().includes(query) ||
    house.description?.toLowerCase().includes(query) ||
    house.status.toLowerCase().includes(query)
  );
}

// Clear search
clearSearch() {
  this.searchQuery = '';
  this.filterByType(this.selectedFilter);
}
```

**Penjelasan:**
- `toLowerCase()` - Case-insensitive search
- `trim()` - Hapus spasi di awal/akhir
- `includes()` - Check apakah string mengandung query
- Search pada 4 field: title, location, description, status
- Reset pagination ke halaman 1 saat search

---

#### 📌 Langkah 3.2: Update filterByType Method

**Implementasikan filter dengan Backend API:**

```typescript
filterByType(type: string) {
  this.selectedFilter = type;
  this.currentPage = 1; // Reset ke halaman pertama
  this.isLoading = true;
  this.errorMessage = '';
  
  if (type === 'all') {
    // Load semua data dari backend
    this.housingService.getAllHousing().subscribe({
      next: (data) => {
        this.housingList = data;
        this.filteredList = data;
        this.isLoading = false;
        
        // Terapkan search jika ada query
        if (this.searchQuery) {
          this.applySearch();
        }
      },
      error: (err) => {
        console.error('Error loading all housing data:', err);
        // Fallback ke filter lokal
        this.filteredList = [...this.housingList];
        this.isLoading = false;
        
        // Terapkan search jika ada query
        if (this.searchQuery) {
          this.applySearch();
        }
      }
    });
  } else {
    // Filter berdasarkan type dari backend
    this.housingService.filterHousingByType(type).subscribe({
      next: (data) => {
        this.filteredList = data;
        this.isLoading = false;
        
        // Terapkan search jika ada query
        if (this.searchQuery) {
          this.applySearch();
        }
      },
      error: (err) => {
        console.error('Error filtering housing by type:', err);
        // Fallback ke filter lokal
        this.filteredList = this.housingList.filter(h => h.type === type);
        this.isLoading = false;
        
        // Terapkan search jika ada query
        if (this.searchQuery) {
          this.applySearch();
        }
      }
    });
  }
}
```

**Penjelasan:**
- **Backend First Approach**: Selalu coba ambil data dari backend terlebih dahulu
- **Fallback Mechanism**: Jika backend error, gunakan filter lokal
- **Loading State**: Tampilkan spinner saat fetching data
- **Error Handling**: Graceful degradation dengan fallback
- **Search Integration**: Tetap terapkan search query setelah filter
- **Type 'all'**: Panggil `getAllHousing()` untuk refresh semua data
- **Type specific**: Panggil `filterHousingByType(type)` untuk filter di backend

**💡 Keuntungan Backend Filtering:**
- ✅ Mengurangi beban client (tidak perlu load semua data)
- ✅ Lebih cepat untuk dataset besar
- ✅ Server-side filtering lebih efisien
- ✅ Dapat dikombinasikan dengan pagination di backend

---

#### 📌 Langkah 3.3: Tambahkan Search Bar di Template

**File:** `src/app/home/home.html`

**Tambahkan sebelum Filter Buttons:**

```html
<!-- Search Bar -->
<div class="row justify-content-center mb-4">
  <div class="col-lg-8">
    <div class="input-group input-group-lg shadow-sm">
      <span class="input-group-text bg-white border-end-0">
        <i class="bi bi-search text-muted"></i>
      </span>
      <input type="text" 
             class="form-control border-start-0 ps-0" 
             placeholder="Cari berdasarkan nama, lokasi, atau deskripsi..."
             [(ngModel)]="searchQuery"
             (input)="searchHousing()"
             [disabled]="isLoading">
      <button class="btn btn-outline-secondary" 
              type="button" 
              *ngIf="searchQuery"
              (click)="clearSearch()"
              [disabled]="isLoading">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <small class="text-muted" *ngIf="searchQuery && filteredList.length > 0">
      Ditemukan {{ filteredList.length }} properti
    </small>
  </div>
</div>
```

**Penjelasan:**
- `[(ngModel)]="searchQuery"` - Two-way binding
- `(input)="searchHousing()"` - Trigger saat user mengetik
- `*ngIf="searchQuery"` - X button hanya muncul jika ada input
- `[disabled]="isLoading"` - Disabled saat loading
- Counter hasil pencarian

---

#### 📌 Langkah 3.4: Update No Results Message

```html
<!-- No Results Message -->
<div class="row" *ngIf="filteredList.length === 0 && !isLoading">
  <div class="col-12 text-center py-5">
    <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
    <h5 class="text-muted">Tidak ada properti ditemukan</h5>
    <p class="text-muted" *ngIf="searchQuery">
      Tidak ada hasil untuk "<strong>{{ searchQuery }}</strong>". Coba kata kunci lain.
    </p>
    <p class="text-muted" *ngIf="!searchQuery">
      Coba filter lainnya untuk melihat properti yang tersedia
    </p>
    <button class="btn btn-primary" (click)="clearSearch()" *ngIf="searchQuery">
      <i class="bi bi-arrow-clockwise me-2"></i>Reset Pencarian
    </button>
  </div>
</div>
```

---

## 🧪 Testing

### Test 1: Backend Integration
```bash
# Terminal 1 - Start Backend
cd griya-mdp-backend
npm run dev

# Terminal 2 - Start Frontend
cd griya-mdp
ng serve
```

Akses `http://localhost:4200`
- ✅ Data loads from backend
- ✅ No error message

### Test 2: Backend Not Available
```bash
# Jangan jalankan backend, hanya frontend
ng serve
```

- ✅ Shows alert: "Menggunakan data demo"
- ✅ Fallback data displayed
- ✅ All features still work

### Test 3: Search
1. Type "jakarta" → See Jakarta properties
2. Type "apartemen" → See apartments
3. Click X → Clear search

### Test 4: Pagination
1. Should have 9 items (2 pages with 6 items/page)
2. Click "Next" → Page 2 (3 items)
3. Click "Previous" → Back to page 1

### Test 5: Combined
1. Filter: "Rumah"
2. Search: "jakarta"
3. Navigate pagination
4. All should work together!

---

## 🐛 Troubleshooting

### Problem: "NullInjectorError: No provider for HttpClient"
**Solution:** Add `provideHttpClient()` to `app.config.ts`

### Problem: "Can't bind to 'ngModel'"
**Solution:** Import `FormsModule` in component imports

### Problem: Backend CORS error
**Solution:** Enable CORS in backend:
```javascript
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
```

### Problem: Pagination not resetting
**Solution:** Add `this.currentPage = 1` in filter and search methods

---

## 📝 Checklist Implementasi
- [x] Integrasi dengan backend API
  - [x] HousingService created (`src/app/services/housing.service.ts`)
  - [x] HttpClient configured
  - [x] Error handling dengan fallback data
  - [x] Loading state dengan spinner
- [x] Pagination
  - [x] Pagination logic implemented
  - [x] Navigation controls (Previous/Next)
  - [x] Page numbers with smart display
  - [x] Smooth scroll to section
  - [x] Info display (showing x-y of z items)
- [x] Fitur pencarian
  - [x] Real-time search
  - [x] Search by title, location, description, status
  - [x] Clear search button
  - [x] Results counter
  - [x] Integration dengan filter & pagination
- [ ] Implementasi favorite functionality
- [ ] Detail page untuk setiap properti

---

## 📚 Referensi

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Angular Documentation](https://angular.dev/)
- [Unsplash - Free Images](https://unsplash.com/)
- [Angular Pipes](https://angular.dev/guide/pipes)
- [Angular Component Interaction](https://angular.dev/guide/components/inputs)

---

Selamat mencoba! 🚀