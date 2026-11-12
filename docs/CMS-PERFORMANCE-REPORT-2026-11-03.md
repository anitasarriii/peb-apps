# Laporan Optimasi Performa CMS PEB App

Tanggal: 3 November 2026 (WIB). Lingkup: source lokal, tanpa deployment, tanpa perubahan credential/role/permission akun impor, tanpa seeder, migrasi destruktif, atau penghapusan media.

## Metode pengukuran dan batas hasil

- Baseline ditulis sebelum perubahan source aplikasi, menggunakan feature HTTP kernel Laravel, PHP 8.3, SQLite :memory:, factory akun terisolasi, lima pengulangan setelah warm-up per alur konten. Ini bukan latency browser maupun benchmark MariaDB produksi.
- POST, query DB POST, GET setelah redirect, query DB GET, dan ukuran respons dicatat terpisah. Angka tabel adalah rata-rata lima sampel, bukan target/SLA. Dataset kecil tanpa transfer media besar.
- GET sesudah optimasi memakai partial props sesuai klien baru; baseline GET memakai full props.
- Baseline Master Data diambil setelah perbaikan middleware bersama, sebelum optimasi partial search Master Data. Angka tersebut tidak menggambarkan kondisi awal seluruh aplikasi.
- HTTP localhost riil juga diperiksa read-only tiga kali untuk delapan halaman publik; data ada di cms-http-after.json. Tidak ada baseline HTTP riil sebelum perubahan; tidak dibuat klaim peningkatan dari angka HTTP tersebut.
- Waktu transfer berkas 500 MB, decode media di perangkat pengguna, dan UAT browser login lengkap belum diukur. Pengujian file memakai UploadedFile fake, Storage fake, dan pengujian handler. Batas 500 MB dipertahankan.
- DONE di bawah berarti akar masalah yang ditemukan telah diperbaiki dan diverifikasi pada lingkup pengujian lokal ini; bukan sertifikasi performa production atau UAT menyeluruh.

## Status 15 task

| No | Modul | Root cause | Before | After | Perbaikan | Status |
|---|---|---|---|---|---|---|
| 01 | General CMS | Query shared data dijalankan walau respons POST hanya redirect | 8 query/POST konten umum | 2 query/POST konten umum | Lazy shared props, loadMissing role, partial props | DONE |
| 02 | Loading / feedback | Host toast berganda; state tidak selalu selesai pada cancel/network error; submit tidak digate | Beberapa host, timer preview 1,2?1,5 detik | Satu host, guard mutasi dan finish/progress event | Hook useCmsSave, RequestFeedback, host toast tunggal | DONE |
| 03 | Beranda | Preview tertunda; base64 statistik; shared queries; log payload partner | 4.66 | 3.49 ms | Preview langsung, object URL, tanpa log payload penuh, POST hero 9?3 query | DONE |
| 04 | Beranda ? publik | Loader menunggu timer tetap; data perlu dibaca dari sumber yang sama | Timer loader 1200 ms + transisi | Selesai setelah hydration; public-read assertions lolos | Tanpa clear-cache manual; shared content dibaca ulang; portofolio satu sumber | DONE |
| 05 | Servis | Progres preview simulasi; shared queries | 3.84 ms | 3.01 ms | File menempel sinkron, progres hanya saat transfer, partial prop daftar | DONE |
| 06 | Kebijakan | Shared queries; preview hero simulasi | 5.24 ms | 3.61 ms | Lazy props, feedback lifecycle, preview langsung | DONE |
| 07 | SEO Kebijakan | Shared queries; optional field dapat error; OG tersimpan belum dirender publik | 5.58 ms | 3.74 ms | Null-safe optional fields; render metadata yang sudah ada; tes SEO | DONE |
| 08 | Galeri | File baru ditempel setelah interval; GET form kemudian GET tabel | 5.06 ms | 2.58 ms | File langsung; server redirect langsung ke list; partial props | DONE |
| 09 | Laporan | Preview/dokumen ditahan timer; GET tambahan koleksi; shared queries | 4.26 / 4.75 ms | 2.88 / 3.06 ms | Preview langsung; satu redirect GET; kategori pendamping tetap terjaga | DONE |
| 10 | Pengadaan | Preview gambar/dokumen tertunda; respons berlebih | 4.54 ms | 3.23 ms | Hilangkan timer preview; partial data; ID dan arsip dipertahankan | DONE |
| 11 | Portofolio | Preview bertimer; GET koleksi ganda; kebutuhan sinkron sumber bersama | 4.66 ms | 2.81 ms | Object URL langsung; redirect ke tabel; assert publik Beranda dan Portfolio | DONE |
| 12 | Footer | Shared data dibaca eager pada POST dan halaman admin lain | 5.54 ms | 5.03 ms | Lazy shared footer; hanya dibaca admin pada tab Footer; tes dua halaman publik | DONE |
| 13 | CTA | Shared data eager dan respons admin berlebih | 4.44 ms | 3.52 ms | Lazy shared data; partial prop CTA; lifecycle save | DONE |
| 14 | Master Data | Pencarian memuat ulang role/permission/static props; respons pencarian lama dapat datang terlambat | GET User 5.00; Role 4.00 query | GET User 3.00; Role 2.00 query | Partial search, closure static props, pembatalan search lama, cleanup debounce | DONE |
| 15 | Pengaturan Sistem | Tidak ada request; sukses palsu dari timer 1500 ms | 1500 ms simulasi, tidak tersimpan | 5.75 ms POST nyata | Endpoint tervalidasi; penyimpanan preferensi per akun secara atomic; readback server | DONE |

## Detail pengukuran backend konten

| Modul | POST before ? after (ms) | DB POST before ? after (ms) | Query POST before ? after | GET before ? after (ms) | Byte respons before ? after |
|---|---|---|---|---|---|
| Beranda Hero | 4.66 ? 3.49 ms | 0.34 ? 0.14 ms | 9.00 ? 3.00 | 5.77 ? 5.22 ms | 2173.00 ? 1547.00 |
| Beranda About | 4.35 ? 3.69 ms | 0.27 ? 0.12 ms | 8.00 ? 2.00 | 4.53 ? 4.68 ms | 2242.00 ? 1589.00 |
| Servis | 3.84 ? 3.01 ms | 0.25 ? 0.12 ms | 8.00 ? 2.00 | 4.56 ? 4.28 ms | 2151.00 ? 1519.00 |
| Kebijakan | 5.24 ? 3.61 ms | 0.33 ? 0.11 ms | 8.00 ? 2.00 | 5.41 ? 4.43 ms | 2174.00 ? 1530.00 |
| SEO Kebijakan | 5.58 ? 3.74 ms | 0.40 ? 0.14 ms | 8.00 ? 2.00 | 5.59 ? 4.45 ms | 2241.00 ? 1221.00 |
| Galeri | 5.06 ? 2.58 ms | 0.38 ? 0.09 ms | 8.00 ? 2.00 | 6.22 ? 4.20 ms | 2150.00 ? 1547.00 |
| Laporan Keuangan | 4.26 ? 2.88 ms | 0.29 ? 0.12 ms | 8.00 ? 2.00 | 4.65 ? 4.90 ms | 2118.00 ? 1535.00 |
| Laporan Tahunan | 4.75 ? 3.06 ms | 0.34 ? 0.12 ms | 8.00 ? 2.00 | 5.04 ? 4.85 ms | 2289.00 ? 1542.00 |
| Pengadaan | 4.54 ? 3.23 ms | 0.31 ? 0.14 ms | 9.00 ? 3.00 | 4.84 ? 5.47 ms | 2269.00 ? 1675.00 |
| Portofolio | 4.66 ? 2.81 ms | 0.31 ? 0.10 ms | 8.00 ? 2.00 | 5.34 ? 5.22 ms | 2234.00 ? 1544.00 |
| CTA | 4.44 ? 3.52 ms | 0.32 ? 0.12 ms | 8.00 ? 2.00 | 4.84 ? 4.79 ms | 2032.00 ? 1457.00 |
| Footer | 5.54 ? 5.03 ms | 0.34 ? 0.15 ms | 8.00 ? 2.00 | 4.63 ? 4.79 ms | 2412.00 ? 1755.00 |

Beberapa GET tidak lebih cepat dalam lima sampel ini; hasil tidak disembunyikan. Jumlah query dan ukuran respons berkurang, tetapi variasi runtime lokal tetap berpengaruh. Tidak ditemukan bukti query lambat yang membenarkan index baru. Tidak ditambahkan cache konten atau global cache flush.

## Hasil per batch

### Batch 1 ? Core Performance

- Shared middleware tidak lagi mengambil CTA/footer/header/notifikasi saat POST redirect. Role tidak dimuat berulang.
- Konten admin tidak ditahan animasi masuk 1200 ms ditambah delay komponen. Tampilan publik tidak menunggu loader berbasis timer tetap.
- Satu mutasi aktif, progres transfer nyata, status finish/cancel/network-error, serta satu host toast.
- Logging seluruh payload partner dihapus. Statistik memakai object URL, bukan encoding base64.
- Bukti: CmsSaveConsistencyTest dan benchmark hero/about; field publik dibaca kembali sesudah commit.

### Batch 2 ? Servis, Kebijakan, SEO, Galeri

- Preview file siap sebelum handler selesai; timer/interval upload simulasi dihapus.
- Galeri tetap memakai tabel/form yang sudah disetujui.
- Metadata SEO yang sudah tersedia (author, robots, OG) ditampilkan oleh halaman Kebijakan. Field opsional ditangani tanpa undefined-key error.
- Bukti: feature tests modul dan cms-lifecycle.test.mjs; validasi gagal tetap pada form, tanpa baris database baru.

### Batch 3 ? Laporan, Pengadaan, Portofolio

- Pengiriman JSON otomatis saat tidak ada File; multipart otomatis ketika ada File. Kontrak endpoint dipertahankan.
- Simpan koleksi menuju tabel melalui redirect server, bukan GET form ditambah GET daftar.
- Laporan tahunan dan keberlanjutan tidak menghapus koleksi pendamping. Routing pengadaan berbasis ID, arsip, dan judul sama tetap dipertahankan.
- Portofolio tetap satu sumber untuk Beranda dan halaman Portofolio.
- Bukti: tes koleksi kosong, upload boundary, laporan, pengadaan, portofolio, dan public readback.

### Batch 4 ? Footer, CTA, Master Data, Pengaturan

- Footer/CTA dibaca fresh oleh website publik, tanpa invalidasi cache manual.
- Search Master Data hanya mengambil prop yang dibutuhkan dan membatalkan request search terdahulu.
- Preferensi Pengaturan disimpan di storage private per akun melalui penulisan atomic; tidak menambah tabel/migrasi. Kesalahan storage menghasilkan respons gagal, bukan toast sukses.
- Pengaturan keamanan/runtime disimpan sebagai preferensi, tidak mengaktifkan 2FA, IP whitelist, backup, maintenance, atau debug server. Ini diberi keterangan di UI agar tidak dianggap telah mengubah konfigurasi layanan. Auth/authorization yang ada dipertahankan.

## Pengujian dan bukti

- 113 feature tests terkait: lulus, 890 assertion; database SQLite terisolasi.
- 13 lifecycle/media/SEO tests Node: lulus.
- 17 table/form rendering tests Node: lulus.
- Pengukuran settings memverifikasi isi file yang benar-benar tersimpan, readback GET, isolasi antar akun, serta kegagalan tulis.
- Tes master data memastikan password akun test tidak berubah pada update biasa. Tidak mengubah akun impor.
- TypeScript: lulus. ESLint pada dua file helper baru: lulus. Build Vite: lulus (4179 modul; 59,65 detik), dengan warning ukuran chunk yang sudah ada.

## File utama yang diubah

Backend:
- app/Http/Middleware/HandleInertiaRequests.php
- app/Http/Controllers/Admin/PanelAdminController.php
- app/Http/Controllers/Admin/PanelAdminBerandaController.php
- app/Http/Controllers/Admin/SeoMetaController.php
- app/Http/Controllers/Admin/CmsPreferencesController.php
- app/Http/Requests/Admin/CmsPreferencesRequest.php
- routes/web.php

Frontend bersama:
- resources/js/hooks/use-cms-save.ts
- resources/js/components/panel-admin/request-feedback.tsx
- resources/js/components/panel-admin/admin-toast.tsx
- resources/js/components/panel-admin/collection-manager.tsx
- resources/js/layouts/admin-panel-layout.tsx
- resources/js/pages/panel-admin.tsx
- resources/js/components/global/anime-reveal.tsx
- resources/js/components/global/page-loader.tsx
- resources/js/app.tsx
- resources/js/pages/kebijakan.tsx
- resources/js/pages/panel-admin/master-data/data-user/index.tsx
- resources/js/components/panel-admin/pengaturan/index.tsx

Form konten yang memakai lifecycle bersama:
- resources/js/components/panel-admin/beranda/about/index.tsx
- resources/js/components/panel-admin/beranda/hero/index.tsx
- resources/js/components/panel-admin/beranda/layanan/index.tsx
- resources/js/components/panel-admin/beranda/partner/index.tsx
- resources/js/components/panel-admin/beranda/portfolio/index.tsx
- resources/js/components/panel-admin/beranda/statistik/index.tsx
- resources/js/components/panel-admin/berita/hero.tsx
- resources/js/components/panel-admin/cta/index.tsx
- resources/js/components/panel-admin/footer/index.tsx
- resources/js/components/panel-admin/galeri/galeri-foto/index.tsx
- resources/js/components/panel-admin/galeri/hero/index.tsx
- resources/js/components/panel-admin/header/index.tsx
- resources/js/components/panel-admin/kebijakan/hero/index.tsx
- resources/js/components/panel-admin/kebijakan/kebijakan-peb/index.tsx
- resources/js/components/panel-admin/laporan/berita-pengumuman/index.tsx
- resources/js/components/panel-admin/laporan/hero/index.tsx
- resources/js/components/panel-admin/laporan/laporan-keuangan/index.tsx
- resources/js/components/panel-admin/laporan/laporan-tahunan/index.tsx
- resources/js/components/panel-admin/pengadaan/daftar-pengadaan/index.tsx
- resources/js/components/panel-admin/pengadaan/hero/index.tsx
- resources/js/components/panel-admin/pengaturan/index.tsx
- resources/js/components/panel-admin/portfolio/daftar-portfolio/index.tsx
- resources/js/components/panel-admin/portfolio/hero/index.tsx
- resources/js/components/panel-admin/seo/index.tsx
- resources/js/components/panel-admin/servis/daftar-servis/index.tsx
- resources/js/components/panel-admin/servis/hero/index.tsx
- resources/js/components/panel-admin/tentang/hero/index.tsx
- resources/js/components/panel-admin/tentang/partner/index.tsx
- resources/js/components/panel-admin/tentang/profil/index.tsx
- resources/js/components/panel-admin/tentang/quote/index.tsx
- resources/js/components/panel-admin/tentang/tim/index.tsx
- resources/js/components/panel-admin/tentang/visi-misi/index.tsx

Preview/file editor terkait: galeri/galeri-foto/photo-editor.tsx; servis/daftar-servis/service-card-editor.tsx; beranda/portfolio/project-card-editor.tsx; preview media pada hero dan form laporan/pengadaan.

## Data mentah

- cms-performance-before.json
- cms-performance-batch1.json
- cms-performance-after.json
- cms-master-before.json
- cms-master-after.json
- cms-preferences-after.json
- cms-http-after.json

## Dokumentasi acuan

- https://inertiajs.com/docs/v3/data-props/shared-data
- https://inertiajs.com/docs/v3/data-props/partial-reloads
- https://laravel.com/framework/docs/13.x/filesystem
