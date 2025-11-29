# Panduan Implementasi Authorization dengan JWT dan Route Guard

## Deskripsi
Panduan ini menjelaskan cara mengamankan aplikasi Angular menggunakan JSON Web Token (JWT). Kita akan mengimplementasikan mekanisme login yang menyimpan token, mengirimkan token tersebut pada setiap request ke backend, dan membatasi akses ke halaman tertentu menggunakan Route Guards.

## Tujuan Pembelajaran
Setelah mengikuti panduan ini, Anda akan dapat:
- ✅ Mengupdate Backend untuk menghasilkan JWT saat login
- ✅ Menyimpan dan mengelola JWT di Frontend (localStorage)
- ✅ Membuat HTTP Interceptor untuk menyisipkan token pada header Authorization
- ✅ Membuat Route Guard untuk memproteksi halaman (CanActivate)
- ✅ Menangani skenario Logout dan Token Expired

---

## Prerequisites

### 1. Install Library di Backend
Kita membutuhkan library `jsonwebtoken` di backend untuk membuat dan memverifikasi token.

**Terminal (Backend):**
```bash
cd griya-mdp-backend
npm install jsonwebtoken
```

---

## Langkah 1: Update Backend untuk Generate Token

Buka file `griya-mdp-backend/app_server/controllers/authcontroller.js`.
Kita perlu mengimport `jsonwebtoken` dan membuat token saat user berhasil register atau login.

**Update `authcontroller.js`:**

```javascript
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken"); // 1. Import jwt

// ... existing code ...

// Login User
const login = async (req, res) => {
  try {
    // ... existing validation & user check ...

    // Validasi password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });
    }

    // 2. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "kunci_rahasia_griya_mdp", // Gunakan env variable di production
      { expiresIn: "1h" } // Token kadaluarsa dalam 1 jam
    );

    // Response sukses dengan token
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: token // 3. Kirim token ke frontend
      }
    });

  } catch (error) {
    // ... existing error handling ...
  }
};

// ... existing code ...
```

*Catatan: Lakukan hal yang sama untuk method `register` jika Anda ingin user langsung login setelah registrasi.*

---

## Langkah 2: Update Auth Service di Frontend

Update `AuthService` untuk menangani penyimpanan token di `localStorage`.

**File:** `src/app/services/auth.service.ts`

1. Update interface `AuthResponse` (jika perlu, tapi `data` biasanya `any` atau object).
2. Update method `saveUserData` untuk menyimpan token.
3. Tambahkan method `getToken`.

```typescript
// ... existing imports ...

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ... existing code ...

  /**
   * Save user data & token ke localStorage
   */
  saveUserData(userData: any): void {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  }

  /**
   * Get JWT Token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  
  // ... existing code ...
}
```

---

## Langkah 3: Membuat Auth Interceptor

Interceptor berfungsi untuk "menangkap" setiap HTTP request keluar dan menambahkan header `Authorization`.

**Buat file baru:** `src/app/interceptors/auth.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // 1. Clone request dan tambahkan header jika token ada
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Lanjutkan request dan handle error 401 (Unauthorized)
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token expired atau invalid
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
```

**Registrasi Interceptor di `app.config.ts`:**

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideHttpClient(withInterceptors([authInterceptor])), // 👈 Tambahkan ini
    // ...
  ]
};
```

---

## Langkah 4: Membuat Auth Guard

Guard berfungsi untuk melindungi route agar tidak bisa diakses tanpa login.

**Buat file baru:** `src/app/guards/auth.guard.ts`

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Izinkan akses
  }

  // Redirect ke login jika belum login
  return router.createUrlTree(['/login']);
};
```

---

## Langkah 5: Terapkan Guard pada Routes

Update konfigurasi routing untuk menggunakan guard pada halaman yang perlu diproteksi (misal: Profile).

**File:** `src/app/app.routes.ts`

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // ...
    {
        path : "profile",
        component : Profile,
        canActivate: [authGuard] // 👈 Tambahkan ini
    },
    // ...
];
```

---

## Langkah 6: Update Navbar (Logout & Conditional Menu)

Kita perlu mengupdate navbar agar menu Login/Register hilang saat user sudah login, dan menampilkan menu Logout.

**Update Component Logic (`src/app/app.ts`):**

Inject `AuthService` dan `Router`, lalu tambahkan method `logout`.

```typescript
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule], // Pastikan CommonModule ada
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('griya-mdp');

  // Inject AuthService dan Router
  constructor(public authService: AuthService, private router: Router) {}

  // Method logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
```

**Update Template (`src/app/app.html`):**

Gunakan control flow `@if` untuk mengecek status login.

```html
<!-- ... existing navbar code ... -->
<ul class="navbar-nav me-auto mb-2 mb-lg-0">
  <li class="nav-item">
    <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" routerLink="/profile" routerLinkActive="active">Profile</a>
  </li>
  
  <!-- Conditional Rendering -->
  @if (!authService.isLoggedIn()) {
    <li class="nav-item">
      <a class="nav-link" routerLink="/login" routerLinkActive="active">Login</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" routerLink="/register" routerLinkActive="active">Register</a>
    </li>
  } @else {
    <li class="nav-item">
      <a class="nav-link" style="cursor: pointer;" (click)="logout()">Logout</a>
    </li>
  }

  <li class="nav-item">
    <a class="nav-link" routerLink="/contact" routerLinkActive="active">Contact</a>
  </li>
</ul>
<!-- ... existing code ... -->
```

---

## Langkah 7: Proteksi Route CRUD Property dengan JWT

### Backend: Membuat Middleware JWT

Untuk mengamankan endpoint Create, Update, dan Delete property, kita perlu membuat middleware yang memverifikasi JWT token.

**Buat file baru:** `app_server/middleware/authMiddleware.js`

```javascript
const jwt = require("jsonwebtoken");

// Secret key harus sama dengan yang digunakan di authcontroller.js
const SECRET_KEY = "kunci_rahasia_griya_mdp";

/**
 * Middleware untuk verifikasi JWT Bearer Token
 * Token harus dikirim di header: Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  try {
    // Ambil token dari Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu."
      });
    }

    // Format: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Format token tidak valid. Gunakan: Bearer <token>"
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Simpan data user ke req.user untuk digunakan di controller
    req.user = decoded;
    
    // Lanjutkan ke controller
    next();

  } catch (error) {
    console.error("Token Verification Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token sudah expired. Silakan login kembali."
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi token."
    });
  }
};

module.exports = { verifyToken };
```

### Update Routes Housing

**File:** `app_server/routes/housing.js`

Tambahkan middleware `verifyToken` pada route yang perlu diproteksi:

```javascript
const express = require("express");
const router = express.Router();
const housingController = require("../controllers/housingcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

// Get all housing (Public - tidak perlu login)
router.get("/", housingController.Index);

// Get housing by ID (Public - tidak perlu login)
router.get("/:id", housingController.GetById);

// Create new housing (Protected - requires JWT)
//router.post("/", verifyToken, housingController.Create);

// Update housing (Protected - requires JWT)
//router.put("/:id", verifyToken, housingController.Update);

// Delete housing (Protected - requires JWT)
//router.delete("/:id", verifyToken, housingController.Delete);

module.exports = router;
```

### Testing Proteksi Route

1. **Test tanpa token:**
   - Coba panggil API POST/PUT/DELETE tanpa header Authorization
   - Seharusnya dapat response: `401 Unauthorized - Token tidak ditemukan`

2. **Test dengan token invalid:**
   - Gunakan token random/salah
   - Seharusnya dapat response: `401 Unauthorized - Token tidak valid`

3. **Test dengan token expired:**
   - Tunggu lebih dari 1 jam atau ubah `expiresIn` jadi `1s`
   - Seharusnya dapat response: `401 Unauthorized - Token sudah expired`

4. **Test dengan token valid:**
   - Login terlebih dahulu, ambil token
   - Gunakan token di header: `Authorization: Bearer <token>`
   - Seharusnya operasi Create/Update/Delete berhasil

**Catatan:** Frontend sudah otomatis mengirim token via Auth Interceptor yang dibuat di Langkah 3, jadi tidak perlu modifikasi lagi di frontend.

---

## Testing

1. **Test Login:** Login ulang, cek Application > Local Storage di browser. Pastikan ada key `token`.
2. **Test Protected Route:** Coba akses `/profile`.
   - Jika sudah login: Harusnya bisa masuk.
   - Jika belum login (hapus token di local storage): Harusnya redirect ke `/login`.
3. **Test API Request:** Lihat Network tab saat akses halaman yang memanggil API. Cek Request Headers, pastikan ada `Authorization: Bearer ...`.

---

## Troubleshooting

- **Error 401 terus menerus:** Pastikan token yang dikirim formatnya benar (`Bearer <token>`) dan secret key di backend cocok.
- **Interceptor tidak jalan:** Pastikan `withInterceptors([authInterceptor])` sudah ditambahkan di `app.config.ts`.
- **Circular Dependency:** Gunakan `inject()` di dalam function interceptor/guard (Angular 15+ style) untuk menghindari masalah dependency injection.

---

**Implementasi Authorization dengan JWT dan Route Guard Complete! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*
