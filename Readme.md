# 🏠 Griya MDP - Roadmap Implementasi

Dokumentasi ini merangkum roadmap lengkap implementasi aplikasi **Griya MDP** (Real Estate Website) menggunakan Angular 20+ dan Bootstrap 5.

---

## 📚 Daftar Isi

1. [Tentang Proyek](#-tentang-proyek)
2. [Roadmap Implementasi Home Component](#-roadmap-implementasi-home-component)
3. [Roadmap Implementasi Profile Component](#-roadmap-implementasi-profile-component)
4. [Roadmap Implementasi Contact Component](#-roadmap-implementasi-contact-component)
5. [Roadmap Implementasi Register Component](#-roadmap-implementasi-register-component)
6. [Roadmap Implementasi Login Component](#-roadmap-implementasi-login-component)
7. [Branch Structure](#-branch-structure)
8. [Cara Mengakses Repository](#-cara-mengakses-repository)


---

## 🎯 Tentang Proyek

**Griya MDP** adalah aplikasi Single Page Application (SPA) untuk platform real estate yang menampilkan:
- Listing dan detail properti (rumah, apartemen, villa)
- Fitur pencarian dan filter
- Responsive design untuk semua device

**Tujuan Pembelajaran:**
- Memahami konsep SPA dengan Angular
- Implementasi component-based architecture
- Menggunakan Bootstrap 5 untuk UI/UX
- Routing dan navigation
- Data management (local dan API)
- Best practices Angular development

---

## 🗺️ Roadmap Implementasi Home Component

### Phase 1: Implementasi Dasar (Branch: [home-component-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/home-component-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `HOME_COMPONENT_GUIDE.md`
- **Isi:** Tutorial lengkap implementasi dasar

---

### Phase 2: Implementasi Data List dan Dinamic Data Binding (Branch: [home-component-next-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/home-component-next-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `HOME_COMPONENT_GUIDE.md`
- **Isi:** 
  - Tutorial step-by-step implementasi dynamic data
  - TypeScript interface definition
  - Data structure examples
  - Filter implementation guide
  - Code examples lengkap

---

### Phase 3: Data Management & Detail Page (Branch: [home-component-detail-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/home-component-detail-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `HOME_COMPONENT_DETAIL_PAGE_GUIDE.md`
- **Isi:** 
  - Tutorial step-by-step
  - Test scenarios
  - Troubleshooting guide
  - Code examples lengkap

---

---

### Phase 3: Integration With API (Branch: [home-component-detail-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/home-component-next-api-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `HOME_COMPONENT_API_GUIDE.md`
- **Isi:** 
  - Tutorial step-by-step
  - Test scenarios
  - Troubleshooting guide
  - Code examples lengkap

---

## 🗺️ Roadmap Implementasi Profile Component

### Phase 1: Implementasi Dasar (Branch: [profile-component-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/profile-component-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `PROFILE_COMPONENT_GUIDE.md`
- **Isi:** Tutorial lengkap implementasi dasar

---

### Phase 2: Implementasi Data Profile dan Dinamic Data Binding (Branch: [profile-component-next-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/profile-component-next-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `PROFILE_COMPONENT_GUIDE.md`
- **Isi:** 
   - Tutorial step-by-step implementasi dynamic data
   - TypeScript interface definition
   - Data structure examples
   - Filter implementation guide
   - Code examples lengkap

---

## 🗺️ Roadmap Implementasi Contact Component

### Phase 1: Implementasi Dasar (Branch: [contact-component-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/contact-component-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `CONTACT_COMPONENT_GUIDE.md`
- **Isi:** Tutorial lengkap implementasi dasar

---

## 🗺️ Roadmap Implementasi Register Component

### Phase 1: Implementasi Dasar (Branch: [register-component-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/register-component-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `REGISTER_COMPONENT_GUIDE.md`
- **Isi:** Tutorial lengkap implementasi dasar

---

## 🗺️ Roadmap Implementasi Login Component

### Phase 1: Implementasi Dasar (Branch: [login-component-impl](https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr/tree/login-component-impl)) 🚀

#### 📖 Dokumentasi:
- **File:** `LOGIN_COMPONENT_GUIDE.md`
- **Isi:** Tutorial lengkap implementasi dasar

---


## 🌲 Branch Structure

```
main (📍 SAAT INI)
│
├── home-component-impl (🚀)
│   └── 📄 HOME_COMPONENT_GUIDE.md
│
├── home-component-next-impl (🚀)
│   └── 📄 HOME_COMPONENT_GUIDE.md
|
├── home-component-detail-impl (🚀)
│   └── 📄 HOME_COMPONENT_DETAIL_PAGE_GUIDE.md  
| 
├── home-component-next-api-impl (🚀)
│   └── 📄 HOME_COMPONENT_API_GUIDE.md    
```

---

## 📖 Cara Mengakses Repository

### Step 1: Clone Repository

```bash
git clone https://github.com/Web-Programming/spa-with-angular-nurrachmat-nr.git
cd spa-with-angular-nurrachmat-nr
```

### Step 2: Install Dependencies

```bash
cd griya-mdp
npm install
```

### Step 3: Ikuti Phase 1 (Basic Implementation)

```bash
# Pastikan Anda di branch home-component-detail-impl
git checkout home-component-impl

# Baca dokumentasi
HOME_COMPONENT_GUIDE.md

# Jalankan aplikasi
npm start
```

**Buka browser:** `http://localhost:4200`

### Step 4: Lanjut ke Phase 2 (Dinamic data)

```bash
# Pindah ke branch selanjutnya
git checkout home-component-next-impl

# Baca dokumentasi lanjutan
HOME_COMPONENT_GUIDE.md

# Jalankan aplikasi
npm start
```

### Step 5: Lanjut ke Phase 3 (Detail Page)

```bash
# Pindah ke branch selanjutnya
git checkout home-component-detail-impl

# Baca dokumentasi lanjutan
HOME_COMPONENT_DETAIL_PAGE_GUIDE.md

# Jalankan aplikasi
npm start
```
