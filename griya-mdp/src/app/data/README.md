# Housing Data

Folder ini berisi data lokal untuk aplikasi Griya MDP.

## File

### `housing-data.ts`

File ini berisi konstanta `HOUSING_DATA` yang merupakan array dari objek `Housing`.

**Kegunaan:**
- Menyimpan data properti/perumahan secara terpusat
- Menghindari duplikasi data di berbagai component
- Memudahkan maintenance (update data di satu tempat saja)
- Dapat dengan mudah diganti dengan data dari API nantinya

**Digunakan di:**
- `src/app/home/home.ts` - Untuk menampilkan list properti
- `src/app/detail/detail.ts` - Untuk menampilkan detail properti

## Struktur Data

Setiap properti memiliki struktur sesuai dengan interface `Housing`:

```typescript
{
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

## Cara Penggunaan

```typescript
import { HOUSING_DATA } from '../data/housing-data';

// Gunakan langsung
const allHousing = HOUSING_DATA;

// Filter berdasarkan type
const rumah = HOUSING_DATA.filter(h => h.type === 'rumah');

// Cari berdasarkan ID
const property = HOUSING_DATA.find(h => h.id === 1);
```

## Migrasi ke Backend API

Ketika backend API sudah tersedia, cukup ganti import dari file ini ke service:

**Sebelum (Data Lokal):**
```typescript
import { HOUSING_DATA } from '../data/housing-data';
const housingList = HOUSING_DATA;
```

**Sesudah (Backend API):**
```typescript
import { HousingService } from '../services/housing.service';

constructor(private housingService: HousingService) {}

ngOnInit() {
  this.housingService.getAllHousing().subscribe(data => {
    this.housingList = data;
  });
}
```

## Total Data

Saat ini tersedia **9 properti** dengan rincian:
- 3 Rumah
- 3 Apartemen  
- 2 Villa
- 1 Pending status
- 8 Available status
