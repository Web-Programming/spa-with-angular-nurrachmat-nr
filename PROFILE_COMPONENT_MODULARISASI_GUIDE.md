# Modularisasi Profile Component (Angular + Bootstrap 5)

Dokumen ini memandu Anda memecah `Profile Component` menjadi komponen-komponen kecil yang reusable, mudah dipelihara, dan siap diintegrasikan dengan backend. Target hasil:

- Profile header dipisah menjadi komponen sendiri
- Kartu Statistik, Tentang (About), dan Sosial Media dipisah menjadi komponen sendiri
- Item pada tab: Properti Saya, Favorit, dan Riwayat dipisah menjadi komponen item
- Parent `Profile` mengatur data dan meneruskan via `@Input()` / event `@Output()`

---

## 1) Struktur Folder yang Disarankan

```
src/app/profile/
├─ components/
│  ├─ profile-header/
│  │  ├─ profile-header.ts
│  │  ├─ profile-header.html
│  │  └─ profile-header.css
│  ├─ stats-card/
│  │  ├─ stats-card.ts
│  │  ├─ stats-card.html
│  │  └─ stats-card.css
│  ├─ about-card/
│  │  ├─ about-card.ts
│  │  ├─ about-card.html
│  │  └─ about-card.css
│  ├─ social-card/
│  │  ├─ social-card.ts
│  │  ├─ social-card.html
│  │  └─ social-card.css
│  ├─ property-item/
│  │  ├─ property-item.ts
│  │  ├─ property-item.html
│  │  └─ property-item.css
│  ├─ favorite-item/
│  │  ├─ favorite-item.ts
│  │  ├─ favorite-item.html
│  │  └─ favorite-item.css
│  └─ history-item/
│     ├─ history-item.ts
│     ├─ history-item.html
│     └─ history-item.css
├─ profile.ts
├─ profile.html
└─ profile.css
```

Catatan: Proyek ini menggunakan Standalone Components (bukan NgModule). Semua komponen baru memiliki `standalone: true` dan diimpor langsung oleh parent.

---

## 2) Model Data (Interfaces)

Buat file `src/app/profile/profile.models.ts` untuk type-safety:

```ts
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  isPremium: boolean;
  isVerified: boolean;
  memberSince: string;
  bio?: string;
  job?: string;
  birthdate?: string;
  status?: string;
}

export interface StatsSummary {
  properties: number;
  favorites: number;
  rating: number;
  memberSince: string;
}

export interface PropertyItem {
  id: number;
  title: string;
  location: string;
  price: number; // per bulan
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // m2
  status: 'Active' | 'Pending' | 'Inactive';
}

export interface FavoriteItem {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rating: number;
}

export interface HistoryItem {
  icon: string;      // e.g. 'bi-check-circle-fill'
  iconColor: 'success' | 'primary' | 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  time: string;      // e.g. '2 hari yang lalu'
  badge?: string;    // e.g. 'Rp 5.000.000'
  badgeColor?: 'success' | 'primary' | 'info' | 'warning' | 'danger';
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}
```

Tambahkan file ini ke `imports`/`types` sesuai kebutuhan di komponen.

---

## 3) Generate Komponen (Standalone)

Gunakan Angular CLI untuk membuat komponen (opsional), atau buat file secara manual.

Contoh (Windows cmd):

```bat
rem Jalankan dari folder project (griya-mdp)
cd griya-mdp

rem Komponen header profil
ng g c profile/components/profile-header --skip-tests

rem Komponen kartu sidebar
ng g c profile/components/stats-card --skip-tests
ng g c profile/components/about-card --skip-tests
ng g c profile/components/social-card --skip-tests

rem Komponen item pada tabs
ng g c profile/components/property-item --skip-tests
ng g c profile/components/favorite-item --skip-tests
ng g c profile/components/history-item --skip-tests
```
gunakan `--skip-tests` agat tidak dibuatkan file *.spec.ts.
gunakan `--flat` untuk menaruh file langsung pada folder komponen tanpa subfolder tambahan.

---

## 4) Kontrak Komponen (Inputs/Outputs)

### 4.1 ProfileHeaderComponent
File: `components/profile-header/profile-header.ts`

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../profile.models';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-header.html',
  styleUrls: ['./profile-header.css']
})
export class ProfileHeaderComponent {
  @Input() user!: UserProfile;
  @Output() edit = new EventEmitter<void>();
  @Output() settings = new EventEmitter<void>();
}
```

HTML: ambil markup header yang ada di `profile.html` dan pindahkan ke `profile-header.html`, lalu binding dengan `{{user.*}}`.

---

### 4.2 StatsCardComponent
File: `components/stats-card/stats-card.ts`

```ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsSummary } from '../../profile.models';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrls: ['./stats-card.css']
})
export class StatsCardComponent {
  @Input() stats!: StatsSummary;
}
```

### 4.3 AboutCardComponent
File: `components/about-card/about-card.ts`

```ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../profile.models';

@Component({
  selector: 'app-about-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-card.html',
  styleUrls: ['./about-card.css']
})
export class AboutCardComponent {
  @Input() user!: UserProfile;
}
```

### 4.4 SocialCardComponent
File: `components/social-card/social-card.ts`

```ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLinks } from '../../profile.models';

@Component({
  selector: 'app-social-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-card.html',
  styleUrls: ['./social-card.css']
})
export class SocialCardComponent {
  @Input() links: SocialLinks = {};
}
```

---

### 4.5 PropertyItemComponent (Tab: Properti Saya)
File: `components/property-item/property-item.ts`

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyItem } from '../../profile.models';

@Component({
  selector: 'app-property-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-item.html',
  styleUrls: ['./property-item.css']
})
export class PropertyItemComponent {
  @Input() item!: PropertyItem;
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.item.id);
  }

  onRemove() {
    this.remove.emit(this.item.id);
  }
}
```

Di template, gunakan `item.*` untuk binding; tombol Edit/Hapus emit `item.id`.

---

### 4.6 FavoriteItemComponent (Tab: Favorit)
File: `components/favorite-item/favorite-item.ts`

```ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteItem } from '../../profile.models';

@Component({
  selector: 'app-favorite-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-item.html',
  styleUrls: ['./favorite-item.css']
})
export class FavoriteItemComponent {
  @Input() item!: FavoriteItem;
}
```

---

### 4.7 HistoryItemComponent (Tab: Riwayat)
File: `components/history-item/history-item.ts`

```ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryItem } from '../../profile.models';

@Component({
  selector: 'app-history-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-item.html',
  styleUrls: ['./history-item.css']
})
export class HistoryItemComponent {
  @Input() item!: HistoryItem;
}
```

---

## 5) Integrasi di Parent `profile.ts` / `profile.html`

### 5.1 Import komponen anak di parent
File: `src/app/profile/profile.ts`

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './components/profile-header/profile-header';
import { StatsCardComponent } from './components/stats-card/stats-card';
import { AboutCardComponent } from './components/about-card/about-card';
import { SocialCardComponent } from './components/social-card/social-card';
import { PropertyItemComponent } from './components/property-item/property-item';
import { FavoriteItemComponent } from './components/favorite-item/favorite-item';
import { HistoryItemComponent } from './components/history-item/history-item';
import { UserProfile, StatsSummary, PropertyItem, FavoriteItem, HistoryItem, SocialLinks } from './profile.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    StatsCardComponent,
    AboutCardComponent,
    SocialCardComponent,
    PropertyItemComponent,
    FavoriteItemComponent,
    HistoryItemComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile { /* ...existing logic... */ }
```

### 5.2 Gantikan markup di `profile.html`

- Bagian header:

```html
<app-profile-header
  [user]="user"
  (edit)="onEditProfile()"
  (settings)="onSettings()"
></app-profile-header>
```

- Sidebar kiri:

```html
<app-stats-card [stats]="stats"></app-stats-card>

<app-about-card [user]="user"></app-about-card>

<app-social-card [links]="socialLinks"></app-social-card>
```

- Tab "Properti Saya":

```html
<div class="row g-4">
    @for (property of properties; track $index) {
        <div class="col-md-6">
            <app-property-item 
                [item]="property" 
                (edit)="onEditProperty($event)" 
                (remove)="onDeleteProperty($event)">
            </app-property-item>
        </div>
    }
  <!-- Card tambah properti tetap di parent atau buat komponen AddCard terpisah -->
</div>
```

- Tab "Favorit":

```html
<div class="row g-4">
    @for (favorite of favorites; track $index) {
        <div class="col-md-6">
            <app-favorite-item [item]="favorite"></app-favorite-item>
        </div>
    }
</div>
```

- Tab "Riwayat":

```html
<div class="timeline">
    @for (item of history; track $index; let last = $last) {
        <app-history-item 
            [item]="item"
            [class.border-bottom-0]="last"
            [class.border-bottom]="!last"
            [class.mb-4]="!last"
            [class.pb-4]="!last">
        </app-history-item>
    }
</div>
```

---

## 6) Service & Data Flow

- Abstraksikan HTTP call pada `ProfileService` (sudah dicontohkan di panduan utama)
- Parent `Profile` bertugas memuat data dan menyatukan state
- Child components TIDAK melakukan HTTP call; hanya menampilkan data dari `@Input()` dan mengirim event ke parent

Skema sederhana:

```
Backend API → ProfileService → Profile (parent) → [@Input()] → Child Components
                                         ↑                    ↓ @Output()
                                       (event handlers / actions)
```

---

## 7) Kualitas Kode

- Gunakan `ChangeDetectionStrategy.OnPush` pada komponen item (opsional) untuk performa
- Tambahkan test minimal: render komponen dengan dummy input, periksa DOM
- Gunakan `aria-*` dan roles untuk aksesibilitas (tab, tombol, ikon)

---

## 8) Checklist Refactor Selesai

- [ ] Semua markup header dipindah ke `app-profile-header`
- [ ] Sidebar dipisah: `app-stats-card`, `app-about-card`, `app-social-card`
- [ ] Item pada tab dipisah: `app-property-item`, `app-favorite-item`, `app-history-item`
- [ ] Parent hanya merender child components dan mengelola data
- [ ] Tidak ada duplikasi style/markup yang tidak perlu
- [ ] Semua komponen menerima data via `@Input()` dan (bila perlu) mengirim event via `@Output()`

---

## 9) Troubleshooting Singkat

- Komponen tidak dikenali: pastikan komponen sudah ditambahkan ke `imports` di `@Component` parent
- Data tidak tampil: cek binding `@Input()` dan nama properti sesuai interface
- Event tidak tertangkap: pastikan `(edit)` / `(remove)` sudah di-handle di parent
- Konflik style: pindahkan style spesifik ke file CSS komponen terkait

---

Selamat melakukan refactor! Setelah modularisasi, codebase menjadi lebih bersih, scalable, dan mudah diuji. 🚀

**Happy Coding! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*