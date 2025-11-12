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

## 🚀 Implementasi Pengembangan

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

   getEmptyStars(): number[] {
    const fullStars = Math.floor(this.housing.rating);
    const hasHalf = this.hasHalfStar() ? 1 : 0;
    const emptyStars = 5 - fullStars - hasHalf;
    return Array(emptyStars).fill(0);
  }

   // Format harga ke Rupiah
  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }
}
```

**Child (lokasi-perumahan.html):**
```html
<h5 class="card-title">{{ housing.name }}</h5>
<h4 class="text-primary fw-bold mb-0">{{ formatPrice(housing.price) }}</h4>
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
- ✅ Currency function for Indonesian Rupiah formatting
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

## Implementasi Lanjutan
- [v] Shared Data File
- [v] Detail Page Component

## 📝 Checklist Implementasi

- [x] Implementasi @Input() untuk data dinamis
- [x] Dynamic data binding dengan currency pipe
- [x] Filter dan search functionality
- [x] Dynamic star rating display
- [x] Conditional badge styling berdasarkan status
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