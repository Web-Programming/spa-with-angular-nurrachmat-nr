# Panduan Backend API Authentication

## Implementasi Register API

### 1. **User Model** (`app_server/models/user.js`)
Model database untuk user dengan schema:
- `name` - Nama lengkap (required, min 2 karakter)
- `email` - Email unik (required, format email valid)
- `password` - Password terenkripsi (required, min 6 karakter)
- `createdAt` - Timestamp pembuatan
- `updatedAt` - Timestamp update

**Fitur Security:**
- ✅ Password di-hash dengan bcryptjs (salt rounds: 10)
- ✅ Email disimpan lowercase untuk konsistensi
- ✅ Method `comparePassword()` untuk validasi login
- ✅ Password tidak pernah di-return ke client

### 2. **Auth Controller** (`app_server/controllers/authcontroller.js`)

#### **Endpoint: POST /api/auth/register**
Registrasi user baru dengan validasi lengkap.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Validasi:**
- ✅ Semua field harus diisi
- ✅ Nama minimal 2 karakter
- ✅ Email format valid
- ✅ Password minimal 6 karakter
- ✅ Password & confirmPassword harus sama
- ✅ Email tidak boleh duplikat

**Response Success (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login",
  "data": {
    "id": "673a1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-25T10:30:00.000Z"
  }
}
```

**Response Error (400/409/500):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

#### **Endpoint: POST /api/auth/login**
Login user dengan email & password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "id": "673a1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

#### **Endpoint: GET /api/auth/profile/:id**
Get user profile by ID.

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "673a1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-25T10:30:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  }
}
```

### 3. **Auth Routes** (`app_server/routes/auth.js`)
Routes untuk authentication:
- `POST /api/auth/register` → Register
- `POST /api/auth/login` → Login
- `GET /api/auth/profile/:id` → Get Profile

### 4. **Frontend Integration** (`griya-mdp/src/app/register/`)

#### **Register Component Updates:**

**TypeScript (`register.ts`):**
- ✅ Import `HttpClient` untuk API calls
- ✅ Import `AbstractControl, ValidationErrors` untuk custom validator
- ✅ Tambah `confirmPassword` field
- ✅ Custom validator `passwordMatchValidator()` untuk cek password match
- ✅ Loading state (`isLoading`)
- ✅ Success/error messages
- ✅ HTTP POST ke `http://localhost:3000/api/auth/register`
- ✅ Auto-clear messages setelah 5 detik
- ✅ Form reset setelah sukses

**Template HTML (`register.html`):**
- ✅ Success alert dengan icon & dismiss button
- ✅ Error alert dengan icon & dismiss button
- ✅ Confirm Password field dengan show/hide toggle
- ✅ Password match validation error message
- ✅ Loading spinner di button saat submit
- ✅ Button text berubah "Memproses..." saat loading
- ✅ Input group untuk show/hide password icons

---

## Instalasi Backend

### 1. Install Dependencies

**Menggunakan CMD (Recommended):**
```cmd
cd griya-mdp-backend
npm install
```

**Package yang dibutuhkan:**
- `bcryptjs` - Password hashing
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `morgan` - HTTP request logger
- `cookie-parser` - Parse cookies

### 2. Setup MongoDB Connection

File `app_server/models/db.js` sudah dikonfigurasi dengan MongoDB Atlas:
```javascript
let dbURI = "mongodb+srv://paw2:si@paw2.iendmj6.mongodb.net/PAWII-SI?retryWrites=true&w=majority&appName=paw2";
```

**Catatan:** Ganti dengan connection string MongoDB Anda sendiri untuk production.

### 3. Jalankan Backend Server

```cmd
cd griya-mdp-backend
npm start
```

Atau dengan auto-reload (development):
```cmd
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

---

## Testing API dengan Postman

### 1. Test Register Endpoint

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login",
  "data": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "..."
  }
}
```

### 2. Test Login Endpoint

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Test Get Profile

**Method:** `GET`  
**URL:** `http://localhost:3000/api/auth/profile/{user_id}`

---


## Fitur Security yang Sudah Diimplementasikan

### 1. Password Hashing
```javascript
// Di user.js model
userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### 2. Password Comparison
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### 3. Password Never Returned
```javascript
// Di authcontroller.js
res.status(201).json({
  data: {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    // PASSWORD TIDAK PERNAH DI-RETURN!
  }
});
```

### 4. Email Case-Insensitive
```javascript
email: {
  lowercase: true,  // Otomatis lowercase
  unique: true      // Email unik
}
```

### 5. CORS Configuration
```javascript
// Di app.js
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

---

## Error Handling

### Backend Error Responses

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 200 | OK | Login berhasil |
| 201 | Created | Registrasi berhasil |
| 400 | Bad Request | Validasi gagal |
| 401 | Unauthorized | Email/password salah |
| 409 | Conflict | Email sudah terdaftar |
| 500 | Server Error | Database error |

---

## Database Schema

### Users Collection

```javascript
{
  "_id": ObjectId("673a1234567890abcdef1234"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$XYZ...", // Hashed password
  "createdAt": ISODate("2025-11-25T10:30:00Z"),
  "updatedAt": ISODate("2025-11-25T10:30:00Z"),
  "__v": 0
}
```

---

## Troubleshooting

### Problem 1: Cannot POST /api/auth/register

**Solusi:**
```cmd
# Pastikan backend server sudah jalan
cd griya-mdp-backend
npm start
```

### Problem 2: CORS Error

**Solusi:**
Pastikan CORS header sudah di-set di `app.js`:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### Problem 3: MongoServerError: E11000 duplicate key

**Solusi:**
Email sudah terdaftar. Gunakan email berbeda atau hapus user dari database.

### Problem 4: npm install bcryptjs gagal

**Solusi (PowerShell):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install bcryptjs
```

**Solusi (CMD):**
```cmd
npm install bcryptjs
```

### Problem 5: Password tidak match tapi form valid

**Cek TypeScript:**
```typescript
// Pastikan validator ada di FormGroup config
this.registerForm = this.fb.group({
  // ... fields
}, { validators: this.passwordMatchValidator });
```

---

## Next Steps

### 2. Add JWT Token Authentication
Install jsonwebtoken:
```cmd
npm install jsonwebtoken
```

Generate token di controller:
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user._id },
  'your-secret-key',
  { expiresIn: '7d' }
);
```

### 3. Create Auth Service
Buat service untuk centralize auth logic:
```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  
  constructor(private http: HttpClient) {}
  
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  
  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}
```

### 4. Add Route Guards
Protect routes yang memerlukan authentication:
```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  }
  return false;
};
```

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register user baru | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile/:id` | Get user profile | ⚠️ Recommended |

---

## Environment Variables (Future)

Buat file `.env` di backend:
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

Install dotenv:
```cmd
npm install dotenv
```

Load di app.js:
```javascript
require('dotenv').config();
```

---

**Implementasi Backend API Authentication Complete! 🚀**

*Dibuat untuk mata kuliah Pemrograman Aplikasi Web II*