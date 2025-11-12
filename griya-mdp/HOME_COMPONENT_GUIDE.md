# Panduan Desain Component Home (Angular + Bootstrap 5)

Dokumen ini menjelaskan implementasi halaman Home untuk aplikasi **Griya MDP** menggunakan Angular dan Bootstrap 5. Halaman ini menampilkan daftar perumahan dengan fitur filtering dinamis, komunikasi parent-child component melalui `@Input()`, dan integrasi Bootstrap 5 untuk desain responsif. Komponen utama yang digunakan adalah `lokasi-perumahan` sebagai reusable card component.

**Fitur yang sudah diimplementasikan:**
- ✅ Dynamic data binding dengan TypeScript interface
- ✅ Filter properti berdasarkan tipe (rumah, apartemen, villa)
- ✅ Currency formatting untuk harga dalam Rupiah
- ✅ Dynamic star rating display
- ✅ Responsive grid layout (Bootstrap 5)
- ✅ Conditional styling untuk status properti

---

## 🚀 Implementasi Pengembangan Lanjutan

### 1. Dynamic Data dengan @Input() ✅ IMPLEMENTED

**Parent (home.ts):**
```typescript
import { Component, OnInit } from '@angular/core';
import { Housing } from '../lokasi-perumahan/lokasi-perumahan';

export class Home implements OnInit {
  housingList: Housing[] = [
    { 
      id: 1, 
      name: 'Griya Asri Residence', 
      price: 850000000,
      type: 'rumah',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      // ... other properties
    },
    // ... more housing data
  ];
  
  filteredList: Housing[] = [];
  
  ngOnInit() {
    this.filteredList = [...this.housingList];
  }
}
```

**Parent (home.html):**
```html
<div class="col-md-6 col-lg-4" *ngFor="let house of filteredList">
  <app-lokasi-perumahan [housing]="house"></app-lokasi-perumahan>
</div>
```

**Child (lokasi-perumahan.ts):**
```typescript
import { Component, Input } from '@angular/core';

export interface Housing {
  id: number;
  name: string;
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

export class LokasiPerumahan {
  @Input() housing: Housing = { /* default values */ };
  
  getStars(): number[] {
    return Array(Math.floor(this.housing.rating)).fill(0);
  }
  
  hasHalfStar(): boolean {
    return this.housing.rating % 1 >= 0.5;
  }
}
```

**Child (lokasi-perumahan.html):**
```html
<h5 class="card-title">{{ housing.name }}</h5>
<h4 class="text-primary">{{ housing.price | currency:'IDR':'symbol':'1.0-0' }}</h4>
<span class="badge" [ngClass]="{'bg-success': housing.status === 'Available'}">
  {{ housing.status }}
</span>

<!-- Dynamic star rating -->
<i class="bi bi-star-fill" *ngFor="let star of getStars()"></i>
<i class="bi bi-star-half" *ngIf="hasHalfStar()"></i>
```

**Key Features Implemented:**
- ✅ TypeScript interface for type safety
- ✅ @Input() decorator for parent-to-child data flow
- ✅ Currency pipe for Indonesian Rupiah formatting
- ✅ ngClass for conditional styling
- ✅ Dynamic star rating calculation
- ✅ *ngFor for iterating arrays
- ✅ Default values in @Input()

---

### 2. Filter & Search Functionality ✅ IMPLEMENTED

**TypeScript (home.ts):**
```typescript
export class Home implements OnInit {
  housingList: Housing[] = [...];
  filteredList: Housing[] = [];
  selectedFilter: string = 'all';
  
  ngOnInit() {
    this.filteredList = [...this.housingList];
  }
  
  filterByType(type: string) {
    this.selectedFilter = type;
    if (type === 'all') {
      this.filteredList = [...this.housingList];
    } else {
      this.filteredList = this.housingList.filter(h => h.type === type);
    }
  }
  
  isFilterActive(type: string): boolean {
    return this.selectedFilter === type;
  }
}
```

**Template (home.html):**
```html
<!-- Filter Buttons with Event Binding -->
<button class="btn btn-outline-primary" 
        [class.active]="isFilterActive('all')"
        (click)="filterByType('all')">
  <i class="bi bi-grid-3x3-gap me-2"></i>Semua
</button>
<button class="btn btn-outline-primary"
        [class.active]="isFilterActive('rumah')"
        (click)="filterByType('rumah')">
  <i class="bi bi-house me-2"></i>Rumah
</button>

<!-- Display Filtered Results -->
<div class="col-md-6 col-lg-4" *ngFor="let house of filteredList">
  <app-lokasi-perumahan [housing]="house"></app-lokasi-perumahan>
</div>

<!-- No Results Message -->
<div *ngIf="filteredList.length === 0">
  <h5 class="text-muted">Tidak ada properti ditemukan</h5>
</div>

<!-- Results Counter -->
<p>Menampilkan {{ filteredList.length }} dari {{ housingList.length }} properti</p>
```

**Features:**
- ✅ Real-time filtering by property type
- ✅ Active button state tracking
- ✅ Empty state handling
- ✅ Results counter
- ✅ Smooth UI updates with Angular change detection

---

### 3. Backend Integration (Future Implementation)

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private apiUrl = 'http://localhost:3000/api/housing';
  
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

**Usage in Component:**
```typescript
import { HousingService } from './services/housing.service';

export class Home implements OnInit {
  constructor(private housingService: HousingService) {}
  
  ngOnInit() {
    this.housingService.getAllHousing().subscribe({
      next: (data) => {
        this.housingList = data;
        this.filteredList = data;
      },
      error: (err) => console.error('Error loading housing data:', err)
    });
  }
}
```

---

### 4. Pagination Implementation (Future)

```typescript
export class Home {
  currentPage = 1;
  itemsPerPage = 6;
  
  get paginatedList(): Housing[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(start, start + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredList.length / this.itemsPerPage);
  }
  
  loadMore() {
    this.currentPage++;
  }
  
  goToPage(page: number) {
    this.currentPage = page;
  }
}
```

**Template:**
```html
<div class="col-md-6 col-lg-4" *ngFor="let house of paginatedList">
  <app-lokasi-perumahan [housing]="house"></app-lokasi-perumahan>
</div>

<!-- Pagination Controls -->
<nav>
  <ul class="pagination justify-content-center">
    <li class="page-item" *ngFor="let page of [].constructor(totalPages); let i = index">
      <button class="page-link" 
              [class.active]="currentPage === i + 1"
              (click)="goToPage(i + 1)">
        {{ i + 1 }}
      </button>
    </li>
  </ul>
</nav>
```

---

### 5. Search Functionality (Future)

```typescript
export class Home {
  searchQuery: string = '';
  
  searchHousing() {
    const query = this.searchQuery.toLowerCase();
    this.filteredList = this.housingList.filter(house => 
      house.name.toLowerCase().includes(query) ||
      house.location.toLowerCase().includes(query) ||
      house.description?.toLowerCase().includes(query)
    );
  }
}
```

**Template:**
```html
<div class="input-group mb-4">
  <input type="text" 
         class="form-control" 
         placeholder="Cari berdasarkan nama, lokasi, atau deskripsi..."
         [(ngModel)]="searchQuery"
         (input)="searchHousing()">
  <button class="btn btn-primary">
    <i class="bi bi-search"></i>
  </button>
</div>
```

---

## 📝 Checklist Implementasi

- [x] Implementasi @Input() untuk data dinamis
- [x] Dynamic data binding dengan currency pipe
- [x] Filter dan search functionality
- [x] Dynamic star rating display
- [x] Conditional badge styling berdasarkan status
- [ ] Integrasi dengan backend API
- [ ] Pagination atau infinite scroll
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

## 🎉 Summary of Implementation

### ✅ Completed Features

1. **Component Architecture**
   - Parent-child component communication via `@Input()`
   - TypeScript interface (`Housing`) for type safety
   - Reusable `lokasi-perumahan` component

2. **UI/UX**
   - Hero section with responsive design
   - Feature cards with icons
   - Dynamic property cards grid (3 columns desktop, 2 tablet, 1 mobile)
   - CTA section with routing

3. **Data Management**
   - 6 sample housing properties with complete data
   - Dynamic filtering by property type (all, rumah, apartemen, villa)
   - Active filter button state tracking
   - Results counter and empty state handling

4. **Angular Features**
   - `*ngFor` directive for list rendering
   - `*ngIf` directive for conditional display
   - `[ngClass]` for dynamic CSS classes
   - Currency pipe for price formatting
   - Event binding `(click)` for user interactions
   - Property binding `[class.active]` for state

5. **Visual Enhancements**
   - Dynamic star rating display
   - Conditional badge colors based on status
   - Bootstrap Icons throughout
   - Smooth hover effects and transitions

### 🚀 Ready for Enhancement

The application is now ready for:
- Backend API integration
- Pagination or infinite scroll
- Advanced search functionality
- User favorites and wishlist
- Property detail pages
- User authentication

---

Selamat mencoba! 🚀