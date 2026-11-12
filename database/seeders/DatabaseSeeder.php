<?php

namespace Database\Seeders;

use App\Models\BeritaSection;
use App\Models\DaftarPengadaan;
use App\Models\Header;
use App\Models\HeroSectionBeranda;
use App\Models\HeroSectionBerita;
use App\Models\HeroSectionLaporan;
use App\Models\HeroSectionPengadaan;
use App\Models\LaporanKeuanganSection;
use App\Models\LaporanTahunanSection;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $superAdminRole = Role::where('name', 'super_admin')->first();

        $admin = User::firstOrCreate(
            ['email' => 'admin@peb.co.id'],
            [
                'name' => 'Admin User',
                'email_verified_at' => now(),
                'role_id' => Role::where('name', 'admin')->first()?->id,
                'status' => 'Aktif',
                'password' => bcrypt('password'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@peb.co.id'],
            [
                'name' => 'Test User',
                'email_verified_at' => now(),
                'role_id' => Role::where('name', 'user')->first()?->id,
                'status' => 'Aktif',
                'password' => bcrypt('password'),
            ]
        );

        HeroSectionBeranda::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'title' => 'Energi Untuk Negeri',
                'subtitle' => 'Mengalirkan keandalan, menghidupkan harapan. Wujud nyata komitmen kami untuk kemajuan Batam dan Indonesia.',
                'cta_label' => 'Jelajahi Inovasi Kami',
                'cta_href' => '#inovasi',
                'secondary_cta_label' => 'Kontak Kami',
                'secondary_cta_href' => '#kontak',
                'carousel_items' => [
                    [
                        'id' => 'slide-1',
                        'type' => 'video',
                        'sourceType' => 'url',
                        'url' => '/assets/beranda/hero/hero-video.mp4',
                    ],
                    [
                        'id' => 'slide-2',
                        'type' => 'image',
                        'sourceType' => 'url',
                        'url' => 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop',
                    ],
                ],
            ]
        );

        HeroSectionLaporan::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'title' => 'Laporan & Publikasi',
                'subtitle' => 'Dokumentasi pertanggungjawaban publik, laporan tahunan, laporan keuangan audit, serta komitmen transparansi tata kelola PT Pelayanan Energi Batam.',
                'carousel_items' => [
                    [
                        'id' => 'slide-1',
                        'type' => 'image',
                        'sourceType' => 'url',
                        'url' => '/assets/tentang-kami/hero/hero.png',
                    ],
                ],
            ]
        );

        LaporanKeuanganSection::firstOrCreate(
            ['id' => 1],
            [
                'section_title' => 'Laporan Keuangan',
                'section_desc' => 'Ikhtisar performa finansial per kuartal dan tahunan.',
                'items' => [
                    [
                        'id' => '1',
                        'title' => 'Laporan Keuangan Konsolidasian 2023',
                        'subtitle' => 'Laporan audit akhir tahun yang mencakup seluruh entitas bisnis energi Batam.',
                        'date' => '15 Mar 2024',
                        'badge' => 'Q4 2023',
                        'imageSrc' => '/assets/pengadaan/items/item1.png',
                        'imageSourceType' => 'url',
                        'poinUtamaList' => [
                            [
                                'id' => '1',
                                'text' => 'Neraca Keuangan Audited menggambarkan pertumbuhan aset bersih perusahaan sebesar 12.4% YoY.',
                            ],
                            [
                                'id' => '2',
                                'text' => 'Laporan Laba Rugi menunjukkan peningkatan efisiensi biaya transmisi gas dan penguatan laba operasional.',
                            ],
                            [
                                'id' => '3',
                                'text' => 'Kajian Arus Kas terperinci mengenai alokasi investasi proyek energi surya strategis di Sekupang.',
                            ],
                            [
                                'id' => '4',
                                'text' => 'Opini Auditor Independen dengan hasil Wajar Tanpa Pengecualian (WTP) atas laporan konsolidasi.',
                            ],
                        ],
                        'dokumenList' => [
                            [
                                'id' => 'd1',
                                'name' => 'Dokumen Laporan Keuangan Audited 2024',
                                'fileSize' => '2.4 MB',
                                'sourceType' => 'url',
                                'fileUrl' => '#',
                            ],
                        ],
                    ],
                    [
                        'id' => '2',
                        'title' => 'Laporan Kinerja Kuartal III - 2023',
                        'subtitle' => 'Analisis pertumbuhan operasional dan efisiensi energi periode Juli-September.',
                        'date' => '20 Nov 2023',
                        'badge' => 'Q3 2023',
                        'imageSrc' => '/assets/pengadaan/items/item5.png',
                        'imageSourceType' => 'url',
                        'poinUtamaList' => [],
                        'dokumenList' => [],
                    ],
                    [
                        'id' => '3',
                        'title' => 'Laporan Kinerja Kuartal II - 2023',
                        'subtitle' => 'Data komprehensif mengenai realisasi anggaran dan pendapatan semester pertama.',
                        'date' => '15 Aug 2023',
                        'badge' => 'Q2 2023',
                        'imageSrc' => '/assets/pengadaan/items/item3.png',
                        'imageSourceType' => 'url',
                        'poinUtamaList' => [],
                        'dokumenList' => [],
                    ],
                    [
                        'id' => '4',
                        'title' => 'Laporan Kinerja Kuartal I - 2023',
                        'subtitle' => 'Rangkuman inisiatif awal tahun dan target operasional 2023.',
                        'date' => '10 May 2023',
                        'badge' => 'Q1 2023',
                        'imageSrc' => '/assets/pengadaan/items/item6.png',
                        'imageSourceType' => 'url',
                        'poinUtamaList' => [],
                        'dokumenList' => [],
                    ],
                ],
            ]
        );

        LaporanTahunanSection::firstOrCreate(
            ['id' => 1],
            [
                'section_title' => 'Laporan Tahunan',
                'section_desc' => 'Dokumentasi perjalanan tahunan kami dalam membangun energi berkelanjutan.',
                'annual_reports' => [
                    [
                        'id' => '1',
                        'title' => 'Annual Report 2023: Powering Digital Batam',
                        'subtitle' => 'Tinjauan mendalam tentang transformasi infrastruktur energi untuk mendukung pertumbuhan pusat data dan industri teknologi di Kepulauan Riau.',
                        'badge' => 'BEST IN ENERGY SECTOR',
                        'imageSrc' => '/assets/pengadaan/items/item2.png',
                        'imageSourceType' => 'url',
                        'fileUrl' => '#',
                        'fileSourceType' => 'url',
                        'fileName' => '',
                        'fileSize' => '24.5 MB',
                    ],
                    [
                        'id' => '2',
                        'title' => 'Annual Report 2022: Resilient Energy',
                        'subtitle' => 'Bagaimana kami beradaptasi dan tetap tangguh dalam menyediakan energi yang handal di tengah tantangan ekonomi global pasca-pandemi.',
                        'badge' => 'LEGACY & INNOVATION',
                        'imageSrc' => '/assets/pengadaan/items/item4.png',
                        'imageSourceType' => 'url',
                        'fileUrl' => '#',
                        'fileSourceType' => 'url',
                        'fileName' => '',
                        'fileSize' => '18.2 MB',
                    ],
                ],
                'keberlanjutan_items' => [
                    [
                        'id' => '1',
                        'title' => 'Sustainability Report 2023',
                        'subtitle' => 'Green Energy Initiatives',
                        'fileUrl' => '#',
                        'fileSourceType' => 'url',
                        'fileName' => '',
                        'fileSize' => '0 MB',
                    ],
                    [
                        'id' => '2',
                        'title' => 'Tata Kelola Perusahaan (GCG)',
                        'subtitle' => 'Pedoman Etika & Integritas',
                        'fileUrl' => '#',
                        'fileSourceType' => 'url',
                        'fileName' => '',
                        'fileSize' => '0 MB',
                    ],
                    [
                        'id' => '3',
                        'title' => 'Laporan CSR 2023',
                        'subtitle' => 'Pemberdayaan Masyarakat Lokal',
                        'fileUrl' => '#',
                        'fileSourceType' => 'url',
                        'fileName' => '',
                        'fileSize' => '0 MB',
                    ],
                ],
            ]
        );

        HeroSectionPengadaan::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'title' => 'Pengadaan',
                'subtitle' => 'Eksplorasi dokumentasi visual komprehensif dari fasilitas, teknologi modern, serta keterlibatan aktif tim ahli kami dalam menyokong pasokan energi Batam.',
                'carousel_items' => [
                    [
                        'id' => 'slide-1',
                        'type' => 'image',
                        'sourceType' => 'url',
                        'url' => '/assets/tentang-kami/hero/hero.png',
                    ],
                ],
            ]
        );

        $defaultCategories = [
            'Jasa',
            'Pemeliharaan',
            'IT & Software',
            'Keamanan',
            'Kendaraan',
            'Konsultansi',
        ];

        $defaultItems = [
            [
                'id' => '1',
                'title' => 'Pengadaan Jasa Pemeliharaan Rutin Pembangkit Listrik Tenaga Gas',
                'status' => 'TERBUKA',
                'startDate' => '12 Okt 2023',
                'endDate' => '25 Okt 2023',
                'location' => 'PLTG Panaran, Batam',
                'category' => 'Jasa',
                'imageSrc' => '/assets/pengadaan/items/item1.png',
                'deskripsi' => 'PT Pelayanan Energi Batam (PEB) mengundang perusahaan-perusahaan yang berpengalaman dan memiliki kualifikasi teknis yang memadai untuk berpartisipasi dalam proses tender ini.',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Memiliki Surat Izin Usaha Perdagangan (SIUP) yang masih berlaku sesuai dengan bidang pekerjaan yang ditenderkan.'],
                    ['id' => '2', 'text' => 'Berpengalaman dalam mengerjakan proyek sejenis dalam 5 tahun terakhir.'],
                    ['id' => '3', 'text' => 'Memiliki laporan keuangan audit 2 tahun terakhir yang menunjukkan performa finansial positif.'],
                ],
                'dokumenList' => [
                    [
                        'id' => '1',
                        'name' => 'Dokumen Rencana Kerja & Syarat (RKS)',
                        'fileSize' => '12.4 MB',
                        'sourceType' => 'url',
                        'fileUrl' => '/assets/pengadaan/rks.pdf',
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1301,104.0529',
                'mapsEmbedUrl' => '',
                'mapsLabel' => 'PLTG Panaran, Batam',
            ],
            [
                'id' => '2',
                'title' => 'Revitalisasi Sistem Perpipaan Air Pendingin Unit 1 & 2',
                'status' => 'TERBUKA',
                'startDate' => '15 Okt 2023',
                'endDate' => '30 Okt 2023',
                'location' => 'Batu Ampar, Batam',
                'category' => 'Pemeliharaan',
                'imageSrc' => '/assets/pengadaan/items/item2.png',
                'deskripsi' => 'Proyek revitalisasi sistem perpipaan air pendingin unit 1 & 2 untuk mengoptimalkan kinerja pembangkit listrik.',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Memiliki Surat Izin Usaha Perdagangan (SIUP) yang masih berlaku.'],
                    ['id' => '2', 'text' => 'Berpengalaman dalam pekerjaan perpipaan industri gas/pembangkit dalam 3 tahun terakhir.'],
                ],
                'dokumenList' => [
                    [
                        'id' => '1',
                        'name' => 'Dokumen Teknis Revitalisasi Perpipaan',
                        'fileSize' => '8.2 MB',
                        'sourceType' => 'url',
                        'fileUrl' => '/assets/pengadaan/perpipaan.pdf',
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1561,104.0042',
                'mapsEmbedUrl' => '',
                'mapsLabel' => 'Batu Ampar, Batam',
            ],
            [
                'id' => '3',
                'title' => 'Pengadaan Perangkat Keras & Lisensi Software Monitoring',
                'status' => 'SELEKSI',
                'startDate' => '18 Okt 2023',
                'endDate' => '05 Nov 2023',
                'location' => 'Kantor Pusat, Batam Center',
                'category' => 'IT & Software',
                'imageSrc' => '/assets/pengadaan/items/item3.png',
                'deskripsi' => 'Pengadaan perangkat keras server dan lisensi perangkat lunak monitoring untuk pusat komando operasi terpadu.',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Kemitraan resmi dengan manufaktur perangkat keras / prinsipal software terkait.'],
                    ['id' => '2', 'text' => 'Sertifikasi keahlian engineer (minimal tingkat profesional).'],
                ],
                'dokumenList' => [
                    [
                        'id' => '1',
                        'name' => 'Kerangka Acuan Kerja (KAK) IT',
                        'fileSize' => '5.5 MB',
                        'sourceType' => 'url',
                        'fileUrl' => '/assets/pengadaan/kak-it.pdf',
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1278,104.0519',
                'mapsEmbedUrl' => '',
                'mapsLabel' => 'Kantor Pusat, Batam Center',
            ],
            [
                'id' => '4',
                'title' => 'Jasa Keamanan dan Pengamanan Aset Vital Perusahaan Tahun 2024',
                'status' => 'TERBUKA',
                'startDate' => '20 Okt 2023',
                'endDate' => '10 Nov 2023',
                'location' => 'Seluruh Area Operasional',
                'category' => 'Keamanan',
                'imageSrc' => '/assets/pengadaan/items/item4.png',
                'deskripsi' => 'PT Pelayanan Energi Batam mengundang badan usaha jasa pengamanan (BUJP) resmi untuk menyediakan personil dan manajemen pengamanan aset.',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Izin operasional dari MABES POLRI yang masih berlaku.'],
                    ['id' => '2', 'text' => 'Keanggotaan aktif dalam asosiasi jasa pengamanan resmi.'],
                ],
                'dokumenList' => [
                    [
                        'id' => '1',
                        'name' => 'Spesifikasi Teknis Pengamanan',
                        'fileSize' => '4.1 MB',
                        'sourceType' => 'url',
                        'fileUrl' => '/assets/pengadaan/spesifikasi-pengamanan.pdf',
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1301,104.0529',
                'mapsEmbedUrl' => '',
                'mapsLabel' => 'Seluruh Area Operasional, Batam',
            ],
            [
                'id' => '5',
                'title' => 'Pengadaan Armada Kendaraan Operasional Lapangan 4x4',
                'status' => 'TERBUKA',
                'startDate' => '22 Okt 2023',
                'endDate' => '12 Nov 2023',
                'location' => 'Batam Center',
                'category' => 'Kendaraan',
                'imageSrc' => '/assets/pengadaan/items/item5.png',
                'deskripsi' => 'Pengadaan armada kendaraan operasional spesifikasi double cabin 4x4 guna menunjang tugas lapangan teknisi PEB.',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Dealer resmi atau distributor otomotif berlisensi.'],
                    ['id' => '2', 'text' => 'Jaminan ketersediaan suku cadang dan layanan purna jual di Batam.'],
                ],
                'dokumenList' => [
                    [
                        'id' => '1',
                        'name' => 'Spesifikasi Armada 4x4',
                        'fileSize' => '3.8 MB',
                        'sourceType' => 'url',
                        'fileUrl' => '/assets/pengadaan/spesifikasi-armada.pdf',
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1278,104.0519',
                'mapsEmbedUrl' => '',
                'mapsLabel' => 'Batam Center',
            ],
            [
                'id' => '6',
                'title' => 'Konsultasi Detail Engineering Design (DED) Gardu Induk',
                'status' => 'TUTUP',
                'startDate' => '01 Sep 2023',
                'endDate' => '20 Sep 2023',
                'location' => 'Sekupang, Batam',
                'category' => 'Konsultansi',
                'imageSrc' => '/assets/pengadaan/items/item6.png',
                'deskripsi' => 'Jasa konsultansi penyusunan Detail Engineering Design (DED) untuk peningkatan kapasitas gardu induk Sekupang.',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Sertifikat Badan Usaha (SBU) bidang jasa perencanaan rekayasa kelistrikan.'],
                    ['id' => '2', 'text' => 'Tim ahli bersertifikat keahlian (SKA) madya/utama kelistrikan.'],
                ],
                'dokumenList' => [
                    [
                        'id' => '1',
                        'name' => 'Kerangka Acuan Kerja (KAK) DED Gardu Induk',
                        'fileSize' => '6.9 MB',
                        'sourceType' => 'url',
                        'fileUrl' => '/assets/pengadaan/kak-ded-gi.pdf',
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1158,103.9531',
                'mapsEmbedUrl' => '',
                'mapsLabel' => 'Sekupang, Batam',
            ],
        ];

        DaftarPengadaan::firstOrCreate(
            ['id' => 1],
            [
                'section_title' => 'Daftar Pengadaan Terbaru',
                'categories' => $defaultCategories,
                'items' => $defaultItems,
            ]
        );

        HeroSectionBerita::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'title' => 'Berita & Acara',
                'subtitle' => 'Ikuti perkembangan terbaru, proyek strategis, dan pencapaian PT Pelayanan Energi Batam secara berkala.',
                'carousel_items' => [
                    [
                        'id' => 'slide-1',
                        'type' => 'image',
                        'sourceType' => 'url',
                        'url' => 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop',
                    ],
                ],
            ]
        );

        BeritaSection::firstOrCreate(
            ['id' => 1],
            [
                'section_title' => 'Berita & Acara',
                'section_desc' => 'Update terbaru mengenai proyek, kerjasama, dan inovasi kami.',
                'items' => [
                    [
                        'id' => '1',
                        'title' => 'Ekspansi Jaringan Listrik Baru di Kawasan Industri Kabil',
                        'subtitle' => 'PT Pelayanan Energi Batam mengumumkan penyelesaian proyek infrastruktur krusial untuk mendukung kebutuhan...',
                        'date' => '28 April 2024',
                        'imageSrc' => 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
                        'gallery' => [],
                    ],
                    [
                        'id' => '2',
                        'title' => 'Implementasi Panel Surya Tahap I di Kantor Pusat',
                        'subtitle' => 'Sebagai bagian dari komitmen Net Zero Emission 2060, kami mulai mengintegrasikan energi terbarukan pada...',
                        'date' => '15 April 2024',
                        'imageSrc' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
                        'gallery' => [],
                    ],
                    [
                        'id' => '3',
                        'title' => 'Peluncuran Sistem Monitoring Energi Digital Terbaru',
                        'subtitle' => 'Sistem baru ini memungkinkan pelanggan industri memantau konsumsi energi secara real-time dengan...',
                        'date' => '02 April 2024',
                        'imageSrc' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
                        'gallery' => [],
                    ],
                ],
            ]
        );

        Header::firstOrCreate(
            ['id' => 1],
            [
                'logo_kiri_src' => '/assets/logo/danantara-logo.svg',
                'logo_kiri_source_type' => 'url',
                'logo_kanan_src' => '/assets/logo/logo.png',
                'logo_kanan_source_type' => 'url',
            ]
        );
        $this->call([
            LegacyDataSeeder::class,
        ]);
    }
}
