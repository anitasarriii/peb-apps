# Implementasi Admin Pengadaan — 3 November 2026

Implementasi dilakukan pada source localhost WEB COMPRO PEB dan database `peb_compro_local`. Tidak ada deployment. Akun existing dan kredensialnya tidak diubah. Tidak dibuat akun Pengadaan contoh.

| No | Komponen | Implementasi | Hasil verifikasi | Status |
|---|---|---|---|---|
| 1 | Existing Role Audit | Fortify session authentication; User belongsTo Role; permission JSON pada roles; tabel permissions sebagai katalog; CRUD Pengadaan berupa penyimpanan array JSON existing | Struktur lokal diperiksa melalui Laravel Boost dan source | Selesai |
| 2 | Role Admin Pengadaan | Identifier `admin_pengadaan`, label Admin Pengadaan; seeder khusus additive dan idempotent | Role lokal ID 4, permission hanya `manage_procurement: true` | Selesai |
| 3 | Permission Laravel | Menggunakan `User::hasPermission`; role ini tidak dapat memakai permission modul lain, termasuk jika flag tambahan keliru diberikan | Pengujian flag manage_users/manage_roles/edit_content/wildcard tetap ditolak | Selesai |
| 4 | Route Protection | Middleware memeriksa akses sebelum model binding dan sebelum controller memuat props; daftar route diizinkan dibatasi | 36 tab terlarang dan 47 kombinasi route/method CMS ditolak 403, termasuk request JSON | Selesai |
| 5 | Sidebar Admin | Hanya Pengadaan → Daftar Pengadaan, identitas akun dan logout; pencarian header dibatasi; kontrol notifikasi umum disembunyikan | Rendering komponen aktual untuk Admin Pengadaan dan Super Admin lulus | Selesai |
| 6 | CRUD Pengadaan | Menggunakan tabel/form existing; tambah, edit, gambar sampul/utama, dokumen, pencarian/filter/pagination; penghapusan item terakhir diizinkan setelah konfirmasi | Simulasi request tambah-edit-hapus, persistensi media dan tabel kosong lulus | Selesai |
| 7 | Publikasi Langsung | Penyimpanan memakai data global existing; tidak ada approval; checkbox arsip tersedia | Data TERBUKA langsung muncul pada halaman publik; edit/arsip tercermin; detail ID terhapus menjadi 404 | Selesai |
| 8 | User Role Assignment | Super Admin dapat memberikan role dari Data User; permission role bawaan dikunci ke Pengadaan; identifier dan penghapusan role dilindungi | Assignment, pembatasan permission, larangan rename/delete role lulus | Selesai |
| 9 | Audit Trail | Memakai tabel/model Notification existing; log per ID Pengadaan; penyimpanan konten dan log per item dalam transaksi database | Aktor, waktu, aksi dibuat/diperbarui/dihapus, status sebelum/sesudah dan flag arsip tercatat | Selesai |
| 10 | Functional Testing | Pest dengan SQLite in-memory dan fake storage; pengujian komponen React; TypeScript; Vite build | Rincian di bawah | Selesai |

## Role dan permission

- Role: `admin_pengadaan` / **Admin Pengadaan**.
- Permission existing: `manage_procurement`.
- Permission tersebut mencakup view, create, update, delete, upload, publish, dan archive pada endpoint koleksi Pengadaan existing.
- Tidak dibuat wildcard, permission publikasi global, paket authorization baru, panel kedua, maupun workflow approval.
- Super Admin tetap mendapat akses existing. Perilaku role legacy lain dipertahankan.

## Route yang diizinkan untuk Admin Pengadaan

| Method | Route | Perilaku |
|---|---|---|
| POST | `/login` | Login Fortify existing; setelah berhasil menuju Daftar Pengadaan, mengabaikan intended URL modul lain |
| GET/POST | `/two-factor-challenge` | Alur 2FA existing jika akun mengaktifkannya; setelah berhasil menuju Daftar Pengadaan |
| GET | `/panel-admin` | Redirect ke tab Daftar Pengadaan |
| GET | `/panel-admin?tab=Daftar%20Pengadaan` | Memuat data Pengadaan, tanpa props User/Role/modul lain; form/table existing berada pada tab ini |
| POST | `/panel-admin/pengadaan/daftar-section` | Simpan, tambah, edit, upload, publikasi, arsip dan penghapusan melalui koleksi existing |
| POST | `/logout` | Logout existing |

Halaman website publik tetap dapat dibaca seperti pengunjung biasa. Akses publik tersebut tidak memberi hak mengelola modul CMS lainnya.

## Route yang dibatasi

Semua tab CMS selain Daftar Pengadaan mengembalikan 403, termasuk Dashboard, Beranda, Tentang Kami, Servis, Kebijakan, Berita, Galeri, Laporan, Portofolio, Header/Footer/CTA, Statistik/Partner, Master Data, Data User, Data Role, Profil, Pengaturan, Hero Pengadaan dan SEO Pengadaan.

Semua endpoint administratif lain di bawah `/panel-admin/*` ditolak, termasuk resource User/Role beserta seluruh verb GET/POST/PUT/PATCH/DELETE yang terdaftar, endpoint preferences, hero, SEO dan semua penyimpanan modul lain. `/dashboard` serta `/settings/*` juga ditolak. Request JSON ke endpoint yang sama menjalani pemeriksaan yang sama; proyek saat ini tidak memiliki API CRUD Pengadaan terpisah yang perlu dibangun.

Route API yang melewati middleware web juga tercakup pembatasan prefix `/api/*`. URL API yang tidak terdaftar tetap mengikuti perilaku routing Laravel (404); tidak ada data administratif yang diberikan.

## Audit trail

Menggunakan `notifications`, tanpa schema baru. Setiap perubahan item menyimpan judul `Pengadaan Dibuat`, `Pengadaan Diperbarui`, atau `Pengadaan Dihapus`. Kolom `message` berisi JSON dengan:

`module`, `action`, `item_id`, `title`, `actor_id`, `actor_name`, `status_before`, `status_after`, `archived_before`, `archived_after`.

Kolom existing `created_at` mencatat waktu aktivitas. Log terbaru per ID menunjukkan editor terakhir; log pembuatan menunjukkan pembuat. Penghapusan menyimpan identitas item dan status sebelumnya. Log menggunakan retensi sistem notifikasi existing, bukan ledger audit immutable atau halaman audit baru. Admin Pengadaan tidak dapat menghapus notifikasi melalui endpoint settings.

## Database dan aktivasi lokal

- Tidak ada perubahan schema atau migration.
- Seeder yang dijalankan hanya `AdminPengadaanRoleSeeder`; tidak menjalankan DatabaseSeeder penuh atau reset database.
- Role baru ID 4 ditambahkan; tiga role existing dipertahankan.
- Seeder tidak membuat/mengubah pengguna.
- Registrasi publik Fortify dinonaktifkan. GET/POST `/register` teruji 404.
- Untuk memakai fitur: Super Admin membuka **Data User**, mengedit/membuat akun tim Pengadaan, memilih **Admin Pengadaan**, lalu menyimpan. Tim masuk menggunakan kredensial akun yang diberikan administrator.

## File backend

- `app/Http/Middleware/RestrictProcurementAdmin.php` — pembatasan role khusus.
- `bootstrap/app.php` — registrasi dan prioritas middleware sebelum route binding.
- `app/Models/User.php` — batas permission role Pengadaan.
- `app/Http/Responses/ProcurementLoginResponse.php` — redirect login biasa/2FA.
- `app/Providers/FortifyServiceProvider.php` — binding respons login.
- `config/fortify.php` — menonaktifkan registrasi publik.
- `app/Http/Middleware/HandleInertiaRequests.php` — filter notifikasi role Pengadaan.
- `app/Http/Controllers/Admin/PanelAdminPengadaanController.php` — ID unik, simpan koleksi kosong, transaksi dan audit.
- `app/Actions/RecordProcurementActivity.php` — pencatatan perubahan per item.
- `app/Http/Controllers/Admin/MasterData/RoleController.php` — pembatasan permission dan perlindungan role bawaan.
- `database/seeders/AdminPengadaanRoleSeeder.php` — seeder khusus role.
- `database/seeders/RolesAndPermissionsSeeder.php` — menyertakan seeder role baru untuk instalasi berikutnya.

## File frontend

- `resources/js/components/panel-admin/admin-sidebar.tsx` — menu dan tindakan akun sesuai role.
- `resources/js/components/panel-admin/admin-header.tsx` — pencarian dan tindakan header sesuai role.
- `resources/js/components/panel-admin/pengadaan/daftar-pengadaan/index.tsx` — mengizinkan hapus item terakhir.
- `resources/js/components/panel-admin/pengadaan/daftar-pengadaan/components/ProcurementTable.tsx` — tombol hapus item terakhir.
- `resources/js/components/panel-admin/pengadaan/daftar-pengadaan/components/ActiveItemEditor.tsx` — kontrol arsip.
- `resources/js/pages/panel-admin/master-data/data-role/components/permission-list.tsx` — permission role Pengadaan tidak dapat diperluas dari UI.
- `resources/js/pages/auth/login.tsx` — menghapus tautan registrasi publik.
- `resources/js/pages/auth/register.tsx` — menyesuaikan template legacy setelah route registrasi dihapus; route server tidak tersedia.
- `resources/js/pages/welcome.tsx` — menghapus tautan registrasi dari template legacy.
- Route/action TypeScript Wayfinder digenerasi ulang dengan `--with-form`.

## Hasil pengujian

- `tests/Feature/AdminPengadaanAccessTest.php`: login/logout, login dengan 2FA, seeder idempotent, tidak ada kebocoran props/partial reload, 36 tab terlarang, 47 kombinasi route/method CMS terlarang, konfigurasi sistem terlarang, revoke permission, publikasi langsung, upload, persistensi media, perubahan status, arsip, penghapusan, audit, assignment oleh Super Admin dan perlindungan role.
- Suite gabungan `AdminPengadaanAccessTest`, `PanelAdminDaftarPengadaanTest`, `CmsMediaChecklistTest`, `PengadaanDetailTest`, `CmsPerformanceTest`, `CmsSaveConsistencyTest`, dan `Auth`: **108 lulus, 2 dilewati**. Dua yang dilewati adalah test registrasi lama karena fitur registrasi dinonaktifkan; test baru memastikan endpoint registrasi tidak tersedia.
- Test tambahan login 2FA Admin Pengadaan: **1 lulus**.
- Test assignment dan perlindungan rename/delete setelah penambahan pemeriksaan: **1 lulus**.
- Suite akses/auth/role tambahan sebelumnya: **75 lulus, 2 dilewati**; sebagian test tumpang tindih dengan suite gabungan, tidak dijumlahkan.
- `tests/procurement-admin-ui.test.mjs`: **4 lulus** (sidebar role baru, navigasi Super Admin, hapus item terakhir/tabel kosong, kontrol arsip).
- TypeScript `tsc --noEmit`: lulus setelah regenerasi Wayfinder.
- Laravel Pint: lulus.
- Vite build: berhasil. Peringatan ukuran chunk existing masih muncul; optimasi bundel bukan scope pekerjaan ini.

## Batas verifikasi

Pengujian perubahan data memakai database SQLite in-memory dan storage palsu, terpisah dari konten lokal existing. Database lokal hanya menerima role baru melalui seeder khusus. Tidak dilakukan pengujian manual dengan akun tim asli atau perubahan kredensial existing. Seluruh persyaratan inti role dan pembatasan backend telah diverifikasi; administrator masih perlu memberikan role kepada akun tim yang akan digunakan.
