<?php

// tests/Feature/TentangKamiPageTest.php

use App\Models\HeroSectionTentang;
use App\Models\PartnerSectionTentang;
use App\Models\ProfilSectionTentang;
use App\Models\QuoteSectionTentang;
use App\Models\Role;
use App\Models\TimSectionTentang;
use App\Models\User;
use App\Models\VisiMisiSectionTentang;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ─── Uji akses publik halaman Tentang Kami ────────────────────────────────────
it('dapat diakses tanpa login (publik)', function () {
    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('tentang-kami'));
});

it('mengembalikan props heroSection null jika belum ada data di database', function () {
    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('heroSection', null)
    );
});

it('mengembalikan props heroSection dari record pertama jika hanya ada satu tenant', function () {
    $user = User::factory()->create();

    HeroSectionTentang::create([
        'user_id' => $user->id,
        'title' => 'Hero Tenant Tunggal',
        'subtitle' => 'Deskripsi tenant tunggal.',
        'carousel_items' => [
            ['id' => 'slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/hero.png'],
        ],
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('heroSection.title', 'Hero Tenant Tunggal')
        ->has('heroSection.carousel_items', 1)
    );
});

it('menggabungkan carousel items dari semua tenant menjadi satu daftar (multi-tenant merge)', function () {
    // Siapkan dua tenant dengan masing-masing 2 slide
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    HeroSectionTentang::create([
        'user_id' => $userA->id,
        'title' => 'Hero Tenant A',
        'subtitle' => 'Deskripsi A.',
        'carousel_items' => [
            ['id' => 'a-slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/a1.png'],
            ['id' => 'a-slide-2', 'type' => 'image', 'sourceType' => 'url', 'url' => '/a2.png'],
        ],
    ]);

    HeroSectionTentang::create([
        'user_id' => $userB->id,
        'title' => 'Hero Tenant B',
        'subtitle' => 'Deskripsi B.',
        'carousel_items' => [
            ['id' => 'b-slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/b1.png'],
        ],
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    // Total slide harus 3 (2 dari A + 1 dari B)
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->has('heroSection.carousel_items', 3)
    );
});

it('menggunakan title dan badge milik super_admin sebagai master saat ada banyak tenant', function () {
    // Buat role super_admin
    $superAdminRole = Role::create(['name' => 'super_admin', 'description' => 'Super Admin']);
    $regularRole = Role::create(['name' => 'admin', 'description' => 'Admin']);

    $superAdmin = User::factory()->create(['role_id' => $superAdminRole->id]);
    $regularAdmin = User::factory()->create(['role_id' => $regularRole->id]);

    HeroSectionTentang::create([
        'user_id' => $superAdmin->id,
        'title' => 'Judul Master (Super Admin)',
        'subtitle' => 'Subjudul master.',
        'carousel_items' => [
            ['id' => 'sa-slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/sa.png'],
        ],
    ]);

    HeroSectionTentang::create([
        'user_id' => $regularAdmin->id,
        'title' => 'Judul Regular Admin',
        'subtitle' => 'Subjudul regular.',
        'carousel_items' => [
            ['id' => 'reg-slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/reg.png'],
        ],
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        // Title & badge harus dari super_admin (master)
        ->where('heroSection.title', 'Judul Master (Super Admin)')
        // Slide gabungan dari kedua tenant
        ->has('heroSection.carousel_items', 2)
    );
});

it('mengembalikan props seoMeta null jika belum dikonfigurasi', function () {
    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('seoMeta', null)
    );
});

it('mengembalikan properti profilSection jika dikonfigurasi di database', function () {
    ProfilSectionTentang::create([
        'title' => 'Judul Profil Perusahaan',
        'description' => 'Deskripsi profil perusahaan lengkap.',
        'image_src' => '/assets/about.png',
        'image_source_type' => 'url',
        'experience_years' => '10+',
        'experience_label' => 'Tahun pengalaman',
        'maps_label' => 'Lokasi Kami',
        'maps_value' => 'Batam, Indonesia',
        'maps_mode' => 'koordinat',
        'maps_koordinat' => '1.1301,104.0529',
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('profilSection.title', 'Judul Profil Perusahaan')
        ->where('profilSection.experience_years', '10+')
    );
});

it('mengembalikan properti timSection jika dikonfigurasi di database', function () {
    TimSectionTentang::create([
        'title' => 'Judul Tim Kepemimpinan',
        'subtitle' => 'Subjudul tim kepemimpinan.',
        'members' => [
            ['name' => 'Budi Santoso', 'role' => 'Direktur Utama', 'image' => '/assets/budi.png'],
        ],
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('timSection.title', 'Judul Tim Kepemimpinan')
        ->where('timSection.members.0.name', 'Budi Santoso')
    );
});

it('mengembalikan properti visiMisiSection jika dikonfigurasi di database', function () {
    VisiMisiSectionTentang::create([
        'visi_label' => 'Visi Kami',
        'visi_text' => 'Deskripsi Visi.',
        'stats' => [
            ['value' => '100%', 'label' => 'Kerja Keras', 'highlighted' => true],
        ],
        'misi_title' => 'Misi Kami',
        'misi_subtitle' => 'Sub Misi.',
        'misi_items' => [
            ['number' => 1, 'title' => 'Misi Ke-1', 'description' => 'Misi detail.'],
        ],
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('visiMisiSection.visi_label', 'Visi Kami')
        ->where('visiMisiSection.stats.0.value', '100%')
    );
});

it('mengembalikan properti quoteSection jika dikonfigurasi di database', function () {
    QuoteSectionTentang::create([
        'quote_text' => 'Quote Perusahaan',
        'description' => 'Sub Deskripsi Quote.',
        'button_label' => 'Aksi',
        'button_href' => '/aksi',
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('quoteSection.quote_text', 'Quote Perusahaan')
    );
});

it('mengembalikan properti partnerSection jika dikonfigurasi di database', function () {
    PartnerSectionTentang::create([
        'title' => 'Judul Partner',
        'partners' => [
            ['id' => '1', 'name' => 'Partner A', 'logoSrc' => '', 'logoSource' => 'none'],
            ['id' => '2', 'name' => 'Partner B', 'logoSrc' => '', 'logoSource' => 'none'],
        ],
    ]);

    $response = $this->get(route('tentang-kami'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tentang-kami')
        ->where('partnerSection.title', 'Judul Partner')
        ->where('partnerSection.partners.0.name', 'Partner A')
    );
});
