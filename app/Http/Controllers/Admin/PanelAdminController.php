<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutSectionBeranda;
use App\Models\BeritaSection;
use App\Models\ContactMessage;
use App\Models\CtaSection;
use App\Models\DaftarPengadaan;
use App\Models\DaftarPortfolioSection;
use App\Models\DaftarServisSection;
use App\Models\GaleriFotoSection;
use App\Models\HeroSectionBeranda;
use App\Models\HeroSectionBerita;
use App\Models\HeroSectionGaleri;
use App\Models\HeroSectionKebijakan;
use App\Models\HeroSectionKontak;
use App\Models\HeroSectionLaporan;
use App\Models\HeroSectionPengadaan;
use App\Models\HeroSectionPortfolio;
use App\Models\HeroSectionServis;
use App\Models\HeroSectionServisDetail;
use App\Models\HeroSectionTentang;
use App\Models\KebijakanPebSection;
use App\Models\LaporanKeuanganSection;
use App\Models\LaporanTahunanSection;
use App\Models\LayananSectionBeranda;
use App\Models\PartnerSectionBeranda;
use App\Models\PartnerSectionTentang;
use App\Models\Permission;
use App\Models\PortfolioSectionBeranda;
use App\Models\ProfilSectionTentang;
use App\Models\QuoteSectionTentang;
use App\Models\Role;
use App\Models\SeoMeta;
use App\Models\StatistikSectionBeranda;
use App\Models\TimSectionTentang;
use App\Models\User;
use App\Models\VisiMisiSectionTentang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanelAdminController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'Dashboard');
        $currentUser = $request->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        $props = [
            'filters' => $request->only('search'),
        ];

        if ($tab === 'Pengaturan') {
            $props['cmsPreferences'] = CmsPreferencesController::forUser($currentUser);
        }

        if ($tab === 'Hero Tentang Kami') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroTentang'] = HeroSectionTentang::where('user_id', $targetUserId)->first();
            $props['heroUserId'] = (int) $targetUserId;

            // Jika belum ada record untuk user ini, biarkan frontend menggunakan nilai default
            // Data akan dibuat saat pertama kali disimpan via updateHero

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Servis') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroServis'] = HeroSectionServis::where('user_id', $targetUserId)->first();
            $props['heroServisUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Detail Servis') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroServisDetail'] = HeroSectionServisDetail::where('user_id', $targetUserId)->first();
            $props['heroServisDetailUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Kebijakan') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroKebijakan'] = HeroSectionKebijakan::where('user_id', $targetUserId)->first();
            $props['heroKebijakanUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Galeri') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroGaleri'] = HeroSectionGaleri::where('user_id', $targetUserId)->first();
            $props['heroGaleriUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Laporan') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroLaporan'] = HeroSectionLaporan::where('user_id', $targetUserId)->first();
            $props['heroUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Section Berita') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroBerita'] = HeroSectionBerita::where('user_id', $targetUserId)->first();
            $props['heroUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Pengadaan') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroPengadaan'] = HeroSectionPengadaan::where('user_id', $targetUserId)->first();
            $props['heroUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Daftar Pengadaan') {
            $props['daftarPengadaan'] = DaftarPengadaan::first();
        }

        if ($tab === 'Daftar Servis') {
            $props['daftarServisSection'] = DaftarServisSection::firstOrCreate([], [
                'title' => 'Daftar Servis',
                'services' => [
                    [
                        'id' => '1',
                        'title' => 'Enjiniring',
                        'description' => 'PEB sendiri berfokus pada pembangkitan listrik untuk komunitas dan industri. PEB menggunakan metode yang berkaitan dengan kerangka teori dari bidang teknik elektro dan teknik mesin.',
                        'imageSrc' => '/assets/beranda/portfolio/project-1.png',
                    ],
                    [
                        'id' => '2',
                        'title' => 'Pengadaan',
                        'description' => 'PEB memanfaatkan pengetahuan dan ahli khusus untuk memastikan bahwa setiap fasilitas yang ada memiliki mesin, komponen, dan dapat beroperasi dengan aman.',
                        'imageSrc' => '/assets/beranda/portfolio/2.png',
                    ],
                    [
                        'id' => '3',
                        'title' => 'Konstruksi',
                        'description' => 'Berpengalaman dalam konstruksi perpipaan & pipa saluran, pembangkit listrik dengan teknologi mutakhir dan inovasi berkelanjutan serta memastikan fasilitas yang ada mampu mencapai target.',
                        'imageSrc' => '/assets/beranda/portfolio/project-3.png',
                    ],
                    [
                        'id' => '4',
                        'title' => 'Instalasi',
                        'description' => 'Kami bekerja sama dengan anda untuk membangun semua fasilitas dan instalasi terbaik, baik di area perkotaan yang padat maupun di daerah terpencil, untuk pipa gas atau pembangkit.',
                        'imageSrc' => '/assets/pengadaan/items/item2.png',
                    ],
                    [
                        'id' => '5',
                        'title' => 'Operasional',
                        'description' => 'PEB telah memastikan bahwa seluruh kontrol terkait pipeline atau power plant yang beroperasi akan selalu di monitoring selama 365 hari dalam 24 jam, setiap tahun nya.',
                        'imageSrc' => '/assets/pengadaan/items/item5.png',
                    ],
                    [
                        'id' => '6',
                        'title' => 'Pemeliharaan',
                        'description' => 'Kami akan memastikan bahwa pipeline gas dan power plan akan selalu berjalan dengan baik regularly, memastikan keandalan nya, memastikan jangka umur nya, biaya operasi yang lebih murah.',
                        'imageSrc' => '/assets/pengadaan/items/item1.png',
                    ],
                ],
            ]);
        }

        if ($tab === 'Kebijakan PEB') {
            $props['kebijakanPebSection'] = KebijakanPebSection::firstOrCreate([], [
                'title' => 'Kebijakan PEB',
                'cards' => [
                    [
                        'id' => 'tata-kelola',
                        'title' => 'Tata Kelola Perusahaan',
                        'subtitle' => 'Good Corporate Governance',
                        'description' => 'Komitmen ini kami buat dengan penuh kesadaran dan rasa tanggung jawab karena kami yakin bahwa pengelolaan perusahaan sesuai dengan prinsip-prinsip standar yang tinggi untuk Good Corporate Governance dan best practice akan memberikan kemaslahatan bagi semua pihak serta mewujudkan kehidupan dengan kualitas yang lebih baik.',
                        'signedBy' => 'PT Pelayanan Energi Batam',
                        'role' => 'Direksi',
                        'date' => 'Batam, 12 Oktober 2017',
                    ],
                    [
                        'id' => 'manajemen-risiko',
                        'title' => 'Manajemen Risiko',
                        'subtitle' => 'Risk Management Policy',
                        'description' => 'PT Pelayanan Energi Batam (PT PEB) berkomitmen untuk melakukan pengelolaan atas risiko-risiko yang akan dihadapi dalam setiap proses bisnis perusahaan dalam rangka mencapai sasaran dan memenuhi kepatuhan terhadap Good Corporate Governance (GCG) yang dicanangkan oleh Pemerintah Republik Indonesia.',
                        'signedBy' => 'ROSA DARMAN',
                        'role' => 'Direktur',
                        'date' => 'Batam, 01 Oktober 2024',
                    ],
                    [
                        'id' => 'sistem-manajemen',
                        'title' => 'Sistim Manajemen Terpadu',
                        'subtitle' => 'Integrated Management System Policy',
                        'description' => 'PT Pelayanan Energi Batam (PT PEB) sebagai Badan Hukum Pemilik Izin Manufaktur/Fabrikasi Penunjang Industri Minyak & Gas dan Manajemen Gas Transportasi Industri Lainnya. Berkomitmen untuk memenuhi kebutuhan dan melebihi Ekspektasi pelanggan, persyaratan perundangan melalui peningkatan berkelanjutan dan efisiensi biaya.',
                        'signedBy' => 'PT Pelayanan Energi Batam',
                        'role' => 'Direksi',
                        'date' => 'Batam, 12 Oktober 2017',
                    ],
                ],
            ]);
        }

        if ($tab === 'Profil Perusahaan') {
            $props['profilSection'] = ProfilSectionTentang::firstOrCreate([], [
                'title' => "PT Pelayanan\nEnergi Batam",
                'description' => 'Sebagai bagian dari PLN Group, PT Pelayanan Energi Batam (PEB) berdedikasi menghadirkan infrastruktur energi kelas dunia sejak 2014. Dari fondasi kuat dalam layanan EPCI gas, kami kini bertransformasi menjadi penyedia solusi energi terintegrasi, mencakup Operasi & Pemeliharaan (O&M) Pembangkit hingga pengembangan Energi Terbarukan (Tenaga Surya). Kami siap menjawab tantangan masa depan dengan layanan yang andal, inovatif, dan berorientasi pada keberlanjutan.',
                'image_src' => '/assets/tentang-kami/about/about.png',
                'image_source_type' => 'url',
                'image_file_name' => '',
                'experience_years' => '25+',
                'experience_label' => 'Tahun pengalaman dalam industri energi',
                'maps_label' => 'Lokasi Kami',
                'maps_value' => 'Batam, Kepulauan Riau',
                'maps_mode' => 'koordinat',
                'maps_koordinat' => '1.1301,104.0529',
                'maps_embed_url' => '',
            ]);
        }

        if ($tab === 'Visi & Misi') {
            $props['visiMisiSection'] = VisiMisiSectionTentang::firstOrCreate([], [
                'visi_label' => 'VISI PERUSAHAAN',
                'visi_text' => 'Menjadi Penyedia Solusi Energi Terdepan dan Terpercaya di Kawasan Regional.',
                'stats' => [
                    ['value' => '95%', 'label' => 'Efisiensi Operasional untuk mitra industri', 'highlighted' => false],
                    ['value' => '85%', 'label' => 'Energi Bersih dan Andal tersalurkan setiap tahun', 'highlighted' => true],
                ],
                'misi_title' => 'Misi Kami',
                'misi_subtitle' => 'Langkah strategis untuk mewujudkan masa depan energi yang berkelanjutan.',
                'misi_items' => [
                    ['number' => 1, 'title' => 'Keandalan Pasokan', 'description' => 'Menjamin ketersediaan energi listrik yang berkualitas tinggi dan berkelanjutan.'],
                    ['number' => 2, 'title' => 'Inovasi Teknologi', 'description' => 'Mengembangkan infrastruktur cerdas dan ramah lingkungan.'],
                    ['number' => 3, 'title' => 'Nilai Tambah Stakeholder', 'description' => 'Memberikan kontribusi positif bagi ekonomi dan masyarakat.'],
                ],
            ]);
        }

        if ($tab === 'Tim Kami') {
            $props['timSection'] = TimSectionTentang::firstOrCreate([], [
                'title' => 'Tim Kepemimpinan',
                'subtitle' => 'Dibalik keberhasilan PEB, terdapat para profesional berdedikasi tinggi dengan pengalaman luas di industri energi.',
                'members' => [
                    ['id' => 'member-1', 'name' => 'Rudi Hermawan', 'role' => 'Komisaris Utama', 'image' => 'https://i.pravatar.cc/400?u=rudi_h', 'imageSourceType' => 'url'],
                    ['id' => 'member-2', 'name' => 'Slamet Riyadi', 'role' => 'Komisaris', 'image' => 'https://i.pravatar.cc/400?u=slamet', 'imageSourceType' => 'url'],
                    ['id' => 'member-3', 'name' => 'Budi Santoso', 'role' => 'Direktur Utama', 'image' => 'https://i.pravatar.cc/400?u=budi', 'imageSourceType' => 'url'],
                    ['id' => 'member-4', 'name' => 'Siti Aminah', 'role' => 'Direktur Operasional', 'image' => 'https://i.pravatar.cc/400?u=siti', 'imageSourceType' => 'url'],
                    ['id' => 'member-5', 'name' => 'Hendra Wijaya', 'role' => 'Direktur Keuangan', 'image' => 'https://i.pravatar.cc/400?u=hendra', 'imageSourceType' => 'url'],
                    ['id' => 'member-6', 'name' => 'Maya Putri', 'role' => 'Direktur Teknik', 'image' => 'https://i.pravatar.cc/400?u=maya', 'imageSourceType' => 'url'],
                ],
            ]);
        }

        if ($tab === 'Quote Tentang') {
            $props['quoteSection'] = QuoteSectionTentang::firstOrCreate([], [
                'quote_text' => 'Energi Bagi Negeri.',
                'description' => 'Komitmen kami adalah menjadi denyut nadi yang tak pernah berhenti untuk kemajuan Batam dan Indonesia.',
                'button_label' => 'Lihat Portofolio Kami',
                'button_href' => '#portofolio',
            ]);
        }

        if ($tab === 'Partner Tentang') {
            $props['partnerSection'] = PartnerSectionTentang::firstOrCreate([], [
                'title' => 'Partner & Kolaborator Kami',
                'partners' => [
                    ['id' => '1', 'name' => 'PLN Batam', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '2', 'name' => 'Pertamina', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '3', 'name' => 'Siemens', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '4', 'name' => 'Schneider', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '5', 'name' => 'GE Energy', 'logoSrc' => '', 'logoSource' => 'none'],
                ],
            ]);
        }

        if ($tab === 'Hero Beranda') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroSection'] = HeroSectionBeranda::where('user_id', $targetUserId)->first();
            $props['heroUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

            }
        }

        if ($tab === 'Tentang Kami') {
            $props['aboutSection'] = AboutSectionBeranda::firstOrCreate([], [
                'title' => 'PT Pelayanan Energi Batam',
                'subtitle' => 'Energi Bagi Negeri',
                'slogan_text' => 'ENERGI BAGI NEGERI (ENERGY FOR THE COUNTRY) merupakan slogan dalam menyampaikan gagasan positif tentang Visi dan Misi PT Pelayanan Energi Batam. Tonton video ini untuk menjelajahi nilai berkelanjutan dari Produk & Inovasi PEB.',
                'media_type' => 'image',
                'media_source_type' => 'url',
                'media_url' => '/assets/beranda/about/about.png',
                'media_file_name' => '',
                'efisiensi' => [
                    'label' => 'EFISIENSI',
                    'value' => '95%',
                    'description' => 'Menjamin tingkat keandalan pasokan energi yang tinggi serta efisiensi operasional yang maksimal untuk mendukung kebutuhan mitra industri dan kelistrikan batam.',
                ],
                'inovatif' => [
                    'label' => 'INOVATIF',
                    'value' => '85%',
                    'description' => 'Terus berinovasi dalam pengembangan produk dan layanan energi berkelanjutan demi menciptakan nilai tambah bagi kemajuan negeri.',
                ],
            ]);
        }

        if ($tab === 'Layanan') {
            $props['layananSection'] = LayananSectionBeranda::firstOrCreate([], [
                'title' => 'Layanan Terbaik Akan Selalu Kami Berikan',
                'services' => [
                    [
                        'id' => '1',
                        'icon' => 'Wrench',
                        'title' => 'Enjiniring',
                        'description' => 'PEB sendiri berfokus pada pembangkitan listrik untuk komunitas dan industri. PEB menggunakan metode yang berkaitan dengan kerangka teori dari bidang teknik elektro dan teknik mesin.',
                    ],
                    [
                        'id' => '2',
                        'icon' => 'BookText',
                        'title' => 'Pengadaan',
                        'description' => 'PEB memanfaatkan pengetahuan dan ahli khusus untuk memastikan bahwa setiap fasilitas yang ada memiliki mesin, komponen, dan dapat beroperasi dengan aman.',
                    ],
                    [
                        'id' => '3',
                        'icon' => 'Bolt',
                        'title' => 'Konstruksi',
                        'description' => 'Berpengalaman dalam konstruksi perpipaan & pipa saluran, pembangkit listrik dengan teknologi mutakhir dan inovasi berkelanjutan serta memastikan bahwa fasilitas yang ada mampu mencapai tingkat efisiensi tertinggi.',
                    ],
                    [
                        'id' => '4',
                        'icon' => 'Server',
                        'title' => 'Instalasi',
                        'description' => 'Kami bekerja sama dengan anda untuk membangun semua fasilitas dan intalasi terbaik, baik di area perkotaan yang padat maupun di daerah terpencil, untuk pipa gas atau pembangkit listrik.',
                    ],
                    [
                        'id' => '5',
                        'icon' => 'Zap',
                        'title' => 'Operasional',
                        'description' => 'PEB telah memastikan bahwa seluruh kontrol terkait pipeline atau power plant yang beroperasi akan selalu di monitoring selama 365 hari dalam 24 jam setiap tahun nya.',
                    ],
                    [
                        'id' => '6',
                        'icon' => 'RefreshCw',
                        'title' => 'Pemeliharaan',
                        'description' => 'Kami akan memastikan bahwa pipeline gas dan power plan akan selalu berjalan dengan baik regularly, memastikan keandalan nya, memastikan jangka umur nya, biaya operasi yang lebih murah dan memastikan peningkatkan keamanan operasional.',
                    ],
                ],
            ]);
        }

        if ($tab === 'Portofolio') {
            $props['portfolioSection'] = PortfolioSectionBeranda::firstOrCreate([], [
                'title' => 'Portfolio Proyek',
                'description' => 'Komitmen kami dalam menghadirkan solusi energi berkelanjutan tercermin dalam rekam jejak proyek strategis di seluruh Indonesia.',
                'cta_label' => "Let's work together",
                'projects' => [
                    [
                        'id' => '1',
                        'title' => 'PEMBANGKIT LISTRIK TENAGA GAS BATAM',
                        'category' => 'OPERASIONAL & PEMELIHARAAN',
                        'year' => '2024',
                        'image' => '/assets/beranda/portfolio/project-1.png',
                        'imageSource' => 'url',
                    ],
                    [
                        'id' => '2',
                        'title' => 'SOLAR HYBRID SYSTEM TANJUNG UNCANG',
                        'category' => 'ENERGI TERBARUKAN',
                        'year' => '2025',
                        'image' => '/assets/beranda/portfolio/project-2.png',
                        'imageSource' => 'url',
                    ],
                    [
                        'id' => '3',
                        'title' => 'TRANSMISI 150KV ANTAR PULAU',
                        'category' => 'INFRASTRUKTUR JARINGAN',
                        'year' => '2026',
                        'image' => '/assets/beranda/portfolio/project-3.png',
                        'imageSource' => 'url',
                    ],
                    [
                        'id' => '4',
                        'title' => 'PROYEK PENGEMBANGAN PLTS CIRATA',
                        'category' => 'ENERGI TERBARUKAN',
                        'year' => '2024',
                        'image' => '/assets/beranda/portfolio/project-1.png',
                        'imageSource' => 'url',
                    ],
                    [
                        'id' => '5',
                        'title' => 'MAINTENANCE TURBIN GAS PLTGU',
                        'category' => 'OPERASIONAL & PEMELIHARAAN',
                        'year' => '2025',
                        'image' => '/assets/beranda/portfolio/project-2.png',
                        'imageSource' => 'url',
                    ],
                ],
            ]);
        }

        if ($tab === 'Statistik') {
            $props['statistikSection'] = StatistikSectionBeranda::firstOrCreate([], [
                'background_src' => '/assets/beranda/team/team.jpg',
                'bg_source' => 'url',
                'bg_file_name' => '',
                'stats' => [
                    ['id' => '1', 'icon' => 'Users', 'value' => '682', 'label' => 'Karyawan'],
                    ['id' => '2', 'icon' => 'MapPin', 'value' => '68', 'label' => 'Lokasi Sites'],
                    ['id' => '3', 'icon' => 'Briefcase', 'value' => '42', 'label' => 'Proyek'],
                    ['id' => '4', 'icon' => 'Hammer', 'value' => '17', 'label' => 'Izin Usaha'],
                ],
            ]);
        }

        if ($tab === 'Partner') {
            $props['partnerSection'] = PartnerSectionBeranda::firstOrCreate([], [
                'title' => 'Partner Kami & Kollaborators',
                'partners' => [
                    ['id' => '1', 'name' => 'PLN Batam', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '2', 'name' => 'Pertamina', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '3', 'name' => 'Siemens', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '4', 'name' => 'Schneider', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '5', 'name' => 'GE Energy', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '6', 'name' => 'ABB', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '7', 'name' => 'Wartsila', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '8', 'name' => 'Vestas', 'logoSrc' => '', 'logoSource' => 'none'],
                    ['id' => '9', 'name' => 'Ka Ge Ih', 'logoSrc' => '', 'logoSource' => 'none'],
                ],
            ]);
        }

        if ($tab === 'Galeri Foto') {
            $props['galeriFotoSection'] = GaleriFotoSection::firstOrCreate([], [
                'section_title' => 'Galeri Kegiatan & Fasilitas',
                'categories' => [
                    'Enjiniring',
                    'Pengadaan',
                    'Konstruksi',
                    'Instalasi',
                    'Operasional',
                    'Pemeliharaan',
                ],
                'items' => [
                    [
                        'id' => '1',
                        'title' => 'Perencanaan & Desain Rekayasa Pembangkit',
                        'category' => 'Enjiniring',
                        'location' => 'Batam Center, Kepulauan Riau',
                        'imageSrc' => '/assets/pengadaan/items/item1.png',
                    ],
                    [
                        'id' => '2',
                        'title' => 'Diskusi Cetak Biru & Rencana Pengadaan Strategis',
                        'category' => 'Pengadaan',
                        'location' => 'Kantor Pusat PEB, Batam Center',
                        'imageSrc' => '/assets/beranda/portfolio/2.png',
                    ],
                    [
                        'id' => '3',
                        'title' => 'Konstruksi Struktural Sipil Gardu Hubung',
                        'category' => 'Konstruksi',
                        'location' => 'Kawasan Industri Tanjung Uncang',
                        'imageSrc' => '/assets/beranda/portfolio/project-3.png',
                    ],
                    [
                        'id' => '4',
                        'title' => 'Instalasi Jaringan Pipa Gas Tekanan Tinggi',
                        'category' => 'Instalasi',
                        'location' => 'Kawasan Industri Kabil, Batam',
                        'imageSrc' => '/assets/pengadaan/items/item2.png',
                    ],
                    [
                        'id' => '5',
                        'title' => 'Monitoring Real-Time Ruang Pusat SCADA & IoT',
                        'category' => 'Operasional',
                        'location' => 'Batam Energy Control Center',
                        'imageSrc' => '/assets/pengadaan/items/item5.png',
                    ],
                    [
                        'id' => '6',
                        'title' => 'Pemeriksaan Mekanikal & Kalibrasi Kompresor Gas',
                        'category' => 'Pemeliharaan',
                        'location' => 'Pusat Pembangkit Listrik Panaran',
                        'imageSrc' => '/assets/beranda/portfolio/project-1.png',
                    ],
                ],
            ]);
        }

        if ($tab === 'Hero Portfolio') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroPortfolio'] = HeroSectionPortfolio::where('user_id', $targetUserId)->first();
            $props['heroPortfolioUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if ($tab === 'Hero Hubungi Kami') {
            $targetUserId = $currentUser->id;
            if ($isSuperAdmin) {
                $targetUserId = $request->query('user_id', $currentUser->id);
            }

            $props['heroKontak'] = HeroSectionKontak::where('user_id', $targetUserId)->first();
            $props['heroUserId'] = (int) $targetUserId;

            if ($isSuperAdmin) {
                $search = $request->query('user_search');

                $activeUser = User::find($targetUserId, ['id', 'name', 'email']);

                $adminUsersQuery = User::whereHas('role', function ($q) {
                    $q->whereIn('name', ['super_admin', 'admin']);
                });

                if ($search) {
                    $adminUsersQuery->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }

                $listUsers = $adminUsersQuery->limit(20)->get(['id', 'name', 'email']);

                $shouldPrepend = ! $search || (
                    $activeUser && (
                        stripos($activeUser->name, $search) !== false ||
                        stripos($activeUser->email, $search) !== false
                    )
                );

                if ($activeUser && $shouldPrepend && ! $listUsers->contains('id', $activeUser->id)) {
                    $listUsers->prepend($activeUser);
                }

                $props['adminUsers'] = $listUsers;
            }
        }

        if (in_array($tab, ['Daftar Portfolio', 'Portofolio'], true)) {
            $props['daftarPortfolioSection'] = DaftarPortfolioSection::firstOrCreate(['id' => 1], [
                'section_title' => 'Portfolio PEB',
                'categories' => ['gas', 'solar', 'operations', 'power'],
                'items' => [
                    ['id' => '1', 'title' => 'Batam-Pemping Pipeline Expansion', 'category' => 'gas', 'badge' => 'GAS INFRASTRUCTURE', 'date' => '2023', 'description' => 'Peningkatan kapasitas distribusi gas bumi untuk memenuhi kebutuhan industri strategis di seluruh wilayah Batam melalui jalur transmisi bawah laut terintegrasi.', 'imageSrc' => '/assets/beranda/portfolio/project-1.png', 'client' => 'PT Pelayanan Energi Batam', 'location' => 'Jalur Pemping - Batam', 'efficiency' => 'Efisiensi Aliran 99.8%', 'imageSourceType' => 'url'],
                    ['id' => '2', 'title' => 'Sekupang Solar Farm Phase II', 'category' => 'solar', 'badge' => 'SOLAR ENERGY', 'date' => '2024', 'description' => 'Pengembangan energi surya terintegrasi dengan kapasitas 10MWp untuk menyuplai kelistrikan ramah lingkungan di kawasan perumahan dan perkantoran Sekupang.', 'imageSrc' => '/assets/beranda/portfolio/2.png', 'client' => 'Batam Green Initiative', 'location' => 'Kawasan Sekupang, Batam', 'efficiency' => 'Reduksi Karbon 12,000 Ton/Thn', 'imageSourceType' => 'url'],
                    ['id' => '3', 'title' => 'Integrated Monitoring System', 'category' => 'operations', 'badge' => 'OPERATIONS', 'date' => 'Ongoing', 'description' => 'Implementasi pusat monitoring digital berbasis SCADA terpusat untuk memantau stabilitas distribusi gas dan beban energi listrik secara langsung 24/7.', 'imageSrc' => '/assets/beranda/portfolio/project-3.png', 'client' => 'PT Pelayanan Energi Batam', 'location' => 'Control Center, Batam Center', 'efficiency' => 'Uptime Sistem SCADA 99.99%', 'imageSourceType' => 'url'],
                    ['id' => '4', 'title' => 'Panbil Gas-Fired Station', 'category' => 'power', 'badge' => 'POWER PLANT', 'date' => '2022', 'description' => 'Optimalisasi pembangkit listrik tenaga gas bumi yang bersih dan efisien guna menunjang pertumbuhan konsumsi listrik industri manufaktur berat.', 'imageSrc' => '/assets/pengadaan/items/item4.png', 'client' => 'Kawasan Industri Panbil', 'location' => 'Panbil Industrial Estate, Batam', 'efficiency' => 'Kapasitas Output 50 MW', 'imageSourceType' => 'url'],
                ],
            ]);
        }

        if ($tab === 'Call to Action') {
            $props['ctaSection'] = CtaSection::firstOrCreate([], [
                'text' => 'Anda membutuhkan layanan dari kami?',
                'button_label' => 'Hubungi Kami',
                'button_href' => '#hubungi',
                'bg_source' => 'url',
                'background_src' => '/assets/beranda/cta/cta.jpg',
                'bg_file_name' => '',
            ]);
        }

        if ($tab === 'Daftar Berita') {
            $props['beritaSection'] = BeritaSection::first();
        }

        if ($tab === 'Kontak Masuk') {
            $props['contactMessages'] = ContactMessage::latest()->get();
        }

        $props['unreadMessagesCount'] = ContactMessage::where('is_read', false)->count();

        if (str_starts_with($tab, 'SEO ')) {
            $pageType = match ($tab) {
                'SEO Beranda' => 'beranda',
                'SEO Tentang Kami' => 'tentang',
                'SEO Servis' => 'servis',
                'SEO Kebijakan' => 'kebijakan',
                'SEO Galeri' => 'galeri',
                'SEO Laporan' => 'laporan',
                'SEO Pengadaan' => 'pengadaan',
                'SEO Portfolio' => 'portfolio',
                'SEO Berita' => 'berita',
                'SEO Hubungi Kami' => 'kontak',
                default => null,
            };

            if ($pageType) {
                $props['seoData'] = SeoMeta::firstOrCreate(['page_type' => $pageType], [
                    'meta_title' => $this->getDefaultMetaTitle($pageType),
                    'meta_description' => $this->getDefaultMetaDescription($pageType),
                    'meta_keywords' => 'energi batam, peb, pelayanan energi batam, energi terbarukan, gas batam, pln group',
                    'author' => 'PT Pelayanan Energi Batam',
                    'robots_index' => 'index',
                    'robots_follow' => 'follow',
                    'og_title' => $this->getDefaultOgTitle($pageType),
                    'og_description' => $this->getDefaultOgDescription($pageType),
                    'og_image' => '/assets/beranda/about/about.png',
                    'image_source_type' => 'url',
                    'image_file_name' => '',
                ]);
            }
        }

        if ($tab === 'Data Role') {
            $props['roles'] = fn () => Role::when(! $isSuperAdmin, function ($query) {
                $query->where('name', 'user');
            })->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })->paginate(10)->withQueryString();

            $props['permissions'] = fn () => Permission::all();
        }

        if ($tab === 'Data User') {
            $props['users'] = User::with('role')
                ->when(! $isSuperAdmin, function ($query) {
                    $query->where(function ($q) {
                        $q->whereHas('role', function ($subQ) {
                            $subQ->whereIn('name', ['admin', 'admin_pengadaan', 'user']);
                        })->orWhereDoesntHave('role');
                    });
                })
                ->when($request->search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                })->paginate(10)->withQueryString();

            $props['allRoles'] = fn () => Role::when(! $isSuperAdmin, function ($query) {
                $query->whereIn('name', ['admin', 'admin_pengadaan', 'user']);
            })->get();
        }

        if ($tab === 'Laporan Keuangan') {
            $props['laporanKeuanganSection'] = LaporanKeuanganSection::first();
        }

        if ($tab === 'Laporan Tahunan') {
            $props['laporanTahunanSection'] = LaporanTahunanSection::first();
        }

        return Inertia::render('panel-admin', $props);
    }

    private function getDefaultMetaTitle(string $pageType): string
    {
        return match ($pageType) {
            'beranda' => 'PT Pelayanan Energi Batam | Penyedia Solusi Energi Terintegrasi',
            'tentang' => 'Tentang Kami | PT Pelayanan Energi Batam',
            'servis' => 'Layanan Servis | PT Pelayanan Energi Batam',
            'kebijakan' => 'Kebijakan Korporat | PT Pelayanan Energi Batam',
            'galeri' => 'Galeri Dokumentasi | PT Pelayanan Energi Batam',
            'laporan' => 'Laporan & Publikasi | PT Pelayanan Energi Batam',
            'pengadaan' => 'Pengadaan & Tender | PT Pelayanan Energi Batam',
            'portfolio' => 'Portofolio Proyek | PT Pelayanan Energi Batam',
            'berita' => 'Berita & Acara | PT Pelayanan Energi Batam',
            default => '',
        };
    }

    private function getDefaultMetaDescription(string $pageType): string
    {
        return match ($pageType) {
            'beranda' => 'PT Pelayanan Energi Batam (PEB) berkomitmen menyediakan energi yang andal, inovatif, dan berkelanjutan. Temukan informasi produk, inovasi, dan layanan kami.',
            'tentang' => 'Kenali lebih dekat PT Pelayanan Energi Batam, visi misi kami untuk memberikan layanan energi kelas dunia, serta profil tim kepemimpinan kami.',
            'servis' => 'Jelajahi layanan servis lengkap PT Pelayanan Energi Batam: Enjiniring, Pengadaan, Konstruksi, Instalasi, Operasional, dan Pemeliharaan.',
            'kebijakan' => 'PT Pelayanan Energi Batam berkomitmen menjalankan tata kelola perusahaan yang bersih, aman, berintegritas, dan selaras dengan standar internasional.',
            'galeri' => 'Eksplorasi dokumentasi visual komprehensif dari fasilitas, teknologi modern, serta keterlibatan aktif tim ahli PT Pelayanan Energi Batam.',
            'laporan' => 'Dokumentasi pertanggungjawaban publik, laporan tahunan, laporan keuangan audit, serta komitmen transparansi tata kelola PT Pelayanan Energi Batam.',
            'pengadaan' => 'Informasi tender dan pengadaan barang/jasa PT Pelayanan Energi Batam. Temukan peluang kerjasama dan daftar pengadaan terbuka.',
            'portfolio' => 'Rekam jejak proyek infrastruktur energi kritis, enjiniring kelas dunia, dan pengadaan strategis PT Pelayanan Energi Batam di Batam.',
            'berita' => 'Ikuti perkembangan terbaru, proyek strategis, dan pencapaian PT Pelayanan Energi Batam secara berkala.',
            default => '',
        };
    }

    private function getDefaultOgTitle(string $pageType): string
    {
        return match ($pageType) {
            'beranda' => 'PT Pelayanan Energi Batam | Energi Bagi Negeri',
            'tentang' => 'Tentang Kami - PT Pelayanan Energi Batam',
            'servis' => 'Layanan Servis - PT Pelayanan Energi Batam',
            'kebijakan' => 'Kebijakan Korporat - PT Pelayanan Energi Batam',
            'galeri' => 'Galeri Dokumentasi - PT Pelayanan Energi Batam',
            'laporan' => 'Laporan & Publikasi - PT Pelayanan Energi Batam',
            'pengadaan' => 'Pengadaan & Tender - PT Pelayanan Energi Batam',
            'portfolio' => 'Portofolio Proyek - PT Pelayanan Energi Batam',
            'berita' => 'Berita & Acara - PT Pelayanan Energi Batam',
            default => '',
        };
    }

    private function getDefaultOgDescription(string $pageType): string
    {
        return match ($pageType) {
            'beranda' => 'Penyedia infrastruktur dan solusi energi terintegrasi terpercaya di Batam.',
            'tentang' => 'Transformasi berkelanjutan PT Pelayanan Energi Batam menuju penyedia energi hijau.',
            'servis' => 'Solusi servis energi profesional dengan tim ahli berpengalaman di bidang enjiniring, konstruksi, dan operasional.',
            'kebijakan' => 'Komitmen tata kelola perusahaan yang transparan, berintegritas, dan sesuai standar ISO internasional.',
            'galeri' => 'Dokumentasi visual fasilitas dan kegiatan operasional PT Pelayanan Energi Batam di Batam.',
            'laporan' => 'Laporan keuangan, laporan tahunan, dan publikasi resmi PT Pelayanan Energi Batam untuk transparansi publik.',
            'pengadaan' => 'Daftar tender dan pengadaan terbuka PT Pelayanan Energi Batam. Bergabunglah sebagai mitra pengadaan kami.',
            'portfolio' => 'Jelajahi portofolio proyek energi PT Pelayanan Energi Batam: gas infrastructure, solar energy, power plant, dan operations.',
            'berita' => 'Informasi dan berita terbaru dari PT Pelayanan Energi Batam.',
            default => '',
        };
    }
}
