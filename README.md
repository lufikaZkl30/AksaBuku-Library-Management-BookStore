# Projek Aksa Buku
Projek untuk UTS mata kuliah Back End, yang merupakan website peminjaman dan pembelian buku, dengan fokus pada penyediaan buku-buku beragam.

Kelas: TI - D
Semester: 4

- 535220178 - Aulia Dwi
- 535220187 – Jessica Ho
- 535220223 – Lufika Ayu
- 535220226 – Parveen Uzma

## Fitur Dikembangkan:
- Auto update hot products
- Fitur sort, search, dan filter buku
- Sistem keranjang belanja (Cart System)
- CRUD pada Admin page (User, Book, & Newsletter Management)
- Sign up, Login, dan Edit Profile (Autentikasi aman dengan Bcrypt)
- Peminjaman buku dengan E-reader / PDF Viewer terintegrasi
- Sistem pengiriman email otomatis (Nodemailer) pada form Contact Us
- Sistem Berlangganan Email (Newsletter)

## Demo Youtube
- [Demo Web](https://youtu.be/NXzSvJvCZNw)

- [Video Presentasi](https://youtu.be/FFrZ-iFIgV4)


## Panduan Instalasi dan Menjalankan Website (Lokal):
1. **Buka terminal** dan arahkan ke folder project ini.
2. **Install dependencies (modul yang dibutuhkan)**:
   ```bash
   npm install
   ```
3. **Setup Environment Variables**:
   - Buat file baru bernama `.env` di folder utama.
   - Buka file `.env.example`, copy isinya, lalu *paste* ke dalam file `.env` yang baru dibuat.
   - Sesuaikan nilai-nilai di dalam `.env` jika diperlukan (seperti `MONGO_URI` atau sandi email).
4. **Jalankan aplikasi**:
   ```bash
   npm start
   ```
5. Buka web di browser Anda pada alamat: `http://localhost:8080`

## Panduan Setup Database (Lokal):
Panduan ini jika Anda menjalankan database di komputer lokal, bukan menggunakan MongoDB Atlas (Cloud).
1. Pastikan Anda sudah menginstal MongoDB dan **MongoDB Compass**.
2. Gunakan koneksi database lokal: `mongodb://localhost:27017`
3. Buka MongoDB Compass dan buat database baru dengan nama **`aksabuku`**.
4. Di dalam database tersebut, buat sebuah collection dengan nama **`books`**.
5. Import file [Database Buku (CSV)](public/DatabaseBuku.csv) ke dalam collection `books` tersebut agar data buku langsung tersedia.
