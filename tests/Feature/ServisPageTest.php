<?php

// tests/Feature/ServisPageTest.php

use App\Models\DaftarServisSection;
use App\Models\HeroSectionServis;
use App\Models\Role;
use App\Models\SeoMeta;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ─── Akses publik halaman servis ──────────────────────────────────────────────

it('halaman servis dapat diakses tanpa login (publik)', function () {
    $response = $this->get(route('servis'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('servis'));
});

it('halaman detail servis dapat diakses tanpa login (publik)', function () {
    $response = $this->get(route('servis.detail'));

    $response->assertOk();
});

// ─── Props heroSection ────────────────────────────────────────────────────────

it('mengembalikan heroSection null jika belum ada data di database', function () {
    $response = $this->get(route('servis'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('servis')
        ->where('heroSection', null),
    );
});

it('mengembalikan heroSection jika data sudah dikonfigurasi di database', function () {
    HeroSectionServis::create([
        'user_id' => null,
        'title' => 'Layanan Energi Profesional',
        'subtitle' => 'Solusi energi terbaik untuk industri dan komunitas.',
        'carousel_items' => [
            ['id' => 'slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/img/servis.jpg'],
        ],
    ]);

    $response = $this->get(route('servis'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('servis')
        ->where('heroSection.title', 'Layanan Energi Profesional')
        ->has('heroSection.carousel_items', 1),
    );
});

// ─── Props seoMeta ────────────────────────────────────────────────────────────

it('mengembalikan seoMeta null jika belum dikonfigurasi', function () {
    $response = $this->get(route('servis'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('servis')
        ->where('seoMeta', null),
    );
});

it('mengembalikan seoMeta jika halaman servis sudah memiliki konfigurasi SEO', function () {
    SeoMeta::create([
        'page_type' => 'servis',
        'meta_title' => 'Layanan Servis | PT Pelayanan Energi Batam',
        'meta_description' => 'Jelajahi layanan servis lengkap PEB.',
        'meta_keywords' => 'servis, energi, batam',
        'author' => 'PT Pelayanan Energi Batam',
        'robots_index' => 'index',
        'robots_follow' => 'follow',
        'og_title' => 'Layanan Servis - PEB',
        'og_description' => 'Solusi layanan energi PEB.',
        'og_image' => '/img/og-servis.png',
        'image_source_type' => 'url',
        'image_file_name' => '',
    ]);

    $response = $this->get(route('servis'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('servis')
        ->where('seoMeta.meta_title', 'Layanan Servis | PT Pelayanan Energi Batam')
        ->where('seoMeta.page_type', 'servis'),
    );
});

// ─── Props daftarServisSection ──────────────────────────────────────────────────

it('mengembalikan daftarServisSection jika data sudah dikonfigurasi di database', function () {
    DaftarServisSection::create([
        'title' => 'Layanan Utama Kami',
        'services' => [
            ['id' => '1', 'title' => 'Enjiniring Khusus', 'description' => 'Deskripsi enjiniring khusus.', 'imageSrc' => '/assets/beranda/portfolio/project-1.png'],
        ],
    ]);

    $response = $this->get(route('servis'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('servis')
        ->where('daftarServisSection.title', 'Layanan Utama Kami')
        ->has('daftarServisSection.services', 1),
    );
});

// ─── Update daftarServisSection via Admin ────────────────────────────────────────

it('dapat memperbarui daftar servis section dari panel admin', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->post(route('panel-admin.servis.daftar-section.update'), [
        'title' => 'Layanan Kustom Baru',
        'services' => [
            [
                'id' => '1',
                'title' => 'Servis Enjiniring Kustom',
                'description' => 'Deskripsi servis kustom.',
                'imageSrc' => '/assets/beranda/portfolio/project-1.png',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('daftar_servis_sections', [
        'title' => 'Layanan Kustom Baru',
    ]);
});
