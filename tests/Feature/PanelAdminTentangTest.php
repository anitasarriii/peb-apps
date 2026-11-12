<?php

// tests/Feature/PanelAdminTentangTest.php

use App\Models\HeroSectionTentang;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->role = Role::factory()->create(['name' => 'super_admin']);
    $this->user = User::factory()->create(['role_id' => $this->role->id]);
});

it('can update hero section in tentang kami', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.tentang.hero-section.update'), [
        'title' => 'Judul Tentang Kami Baru',
        'subtitle' => 'Deskripsi Halaman Tentang Kami Baru',
        'user_id' => $this->user->id,
        'carousel_items' => [
            [
                'id' => 'slide-1',
                'type' => 'image',
                'sourceType' => 'url',
                'url' => 'https://example.com/image.jpg',
            ],
            [
                'id' => 'slide-2',
                'type' => 'image',
                'sourceType' => 'url',
                'url' => 'https://example.com/image2.jpg',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('hero_section_tentangs', [
        'user_id' => $this->user->id,
        'title' => 'Judul Tentang Kami Baru',
        'subtitle' => 'Deskripsi Halaman Tentang Kami Baru',
    ]);
});

it('hero section tentang kami is isolated per user', function () {
    $otherRole = Role::factory()->create(['name' => 'admin']);
    $otherUser = User::factory()->create(['role_id' => $otherRole->id]);

    // User 1 simpan datanya
    $this->actingAs($this->user)->post(route('panel-admin.tentang.hero-section.update'), [
        'title' => 'Hero User 1',
        'subtitle' => 'Sub user 1',
        'user_id' => $this->user->id,
        'carousel_items' => [['id' => 'slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => 'https://example.com/1.jpg']],
    ]);

    // User 2 simpan datanya
    $this->actingAs($otherUser)->post(route('panel-admin.tentang.hero-section.update'), [
        'title' => 'Hero User 2',
        'subtitle' => 'Sub user 2',
        'user_id' => $otherUser->id,
        'carousel_items' => [['id' => 'slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => 'https://example.com/2.jpg']],
    ]);

    // Verifikasi kedua data tersimpan dan terisolasi
    $this->assertDatabaseHas('hero_section_tentangs', ['user_id' => $this->user->id, 'title' => 'Hero User 1']);
    $this->assertDatabaseHas('hero_section_tentangs', ['user_id' => $otherUser->id, 'title' => 'Hero User 2']);
    $this->assertEquals(2, HeroSectionTentang::count());
});

it('can update profil section in tentang kami', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.tentang.profil-section.update'), [
        'title' => 'PT Pelayanan Energi Batam',
        'description' => 'Ini deskripsi profil perusahaan terbaru yang sangat handal.',
        'image_src' => 'https://example.com/about.jpg',
        'image_source_type' => 'url',
        'experience_years' => '10+',
        'experience_label' => 'Tahun Beroperasi',
        'maps_label' => 'Kantor Pusat',
        'maps_value' => 'Batam, Kepri',
        'maps_mode' => 'koordinat',
        'maps_koordinat' => '1.123,104.456',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('profil_section_tentangs', [
        'title' => 'PT Pelayanan Energi Batam',
        'description' => 'Ini deskripsi profil perusahaan terbaru yang sangat handal.',
        'maps_label' => 'Kantor Pusat',
        'maps_value' => 'Batam, Kepri',
        'maps_mode' => 'koordinat',
        'maps_koordinat' => '1.123,104.456',
    ]);
});

it('can update visi misi section in tentang kami', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.tentang.visi-misi-section.update'), [
        'visi_label' => 'VISI PERUSAHAAN',
        'visi_text' => 'Menjadi penyedia solusi energi terdepan dan terpercaya.',
        'stats' => [
            ['value' => '95%', 'label' => 'Efisiensi Operasional', 'highlighted' => false],
            ['value' => '85%', 'label' => 'Energi Bersih Tersalurkan', 'highlighted' => true],
        ],
        'misi_title' => 'Misi Kami',
        'misi_subtitle' => 'Langkah strategis menuju masa depan energi berkelanjutan.',
        'misi_items' => [
            ['number' => 1, 'title' => 'Keandalan Pasokan', 'description' => 'Menjamin ketersediaan energi berkualitas tinggi.'],
            ['number' => 2, 'title' => 'Inovasi Teknologi', 'description' => 'Mengembangkan infrastruktur cerdas dan ramah lingkungan.'],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('visi_misi_section_tentangs', [
        'visi_label' => 'VISI PERUSAHAAN',
        'visi_text' => 'Menjadi penyedia solusi energi terdepan dan terpercaya.',
        'misi_title' => 'Misi Kami',
        'misi_subtitle' => 'Langkah strategis menuju masa depan energi berkelanjutan.',
    ]);
});

it('can update tim section in tentang kami', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.tentang.tim-section.update'), [
        'title' => 'Tim Kepemimpinan Baru',
        'subtitle' => 'Dibalik keberhasilan PEB terbaru, ada para profesional hebat.',
        'members' => [
            [
                'id' => 'member-1',
                'name' => 'Budi Santoso',
                'role' => 'Direktur Utama',
                'image' => 'https://example.com/budi.jpg',
                'imageSourceType' => 'url',
            ],
            [
                'id' => 'member-2',
                'name' => 'Siti Aminah',
                'role' => 'Direktur Operasional',
                'image' => 'https://example.com/siti.jpg',
                'imageSourceType' => 'url',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tim_section_tentangs', [
        'title' => 'Tim Kepemimpinan Baru',
        'subtitle' => 'Dibalik keberhasilan PEB terbaru, ada para profesional hebat.',
    ]);
});

it('can update quote section in tentang kami', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.tentang.quote-section.update'), [
        'quote_text' => 'Teks Kutipan Kreatif',
        'description' => 'Ini deskripsi penjelasan komitmen dari tim kami.',
        'button_label' => 'Hubungi Kami Sekarang',
        'button_href' => '/kontak',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('quote_section_tentangs', [
        'quote_text' => 'Teks Kutipan Kreatif',
        'description' => 'Ini deskripsi penjelasan komitmen dari tim kami.',
        'button_label' => 'Hubungi Kami Sekarang',
        'button_href' => '/kontak',
    ]);
});

it('can update partner section in tentang kami', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.tentang.partner-section.update'), [
        'title' => 'Mitra Kolaborator PEB',
        'partners' => [
            [
                'id' => '1',
                'name' => 'PLN Batam Baru',
                'logoSrc' => 'https://example.com/logo.png',
                'logoSource' => 'url',
            ],
            [
                'id' => '2',
                'name' => 'Pertamina Baru',
                'logoSrc' => '',
                'logoSource' => 'none',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('partner_section_tentangs', [
        'title' => 'Mitra Kolaborator PEB',
    ]);
});
