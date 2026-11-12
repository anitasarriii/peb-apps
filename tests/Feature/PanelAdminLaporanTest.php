<?php

use App\Models\HeroSectionLaporan;
use App\Models\LaporanKeuanganSection;
use App\Models\LaporanTahunanSection;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('halaman laporan dapat diakses tanpa login (publik)', function () {
    $response = $this->get(route('laporan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('laporan'));
});

it('mengembalikan heroSection null jika belum ada data di database', function () {
    $response = $this->get(route('laporan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('laporan')
        ->where('heroSection', null),
    );
});

it('mengembalikan heroSection jika data sudah dikonfigurasi di database', function () {
    HeroSectionLaporan::create([
        'user_id' => null,
        'title' => 'Laporan Energi Profesional',
        'subtitle' => 'Solusi energi terbaik untuk industri dan komunitas.',
        'carousel_items' => [
            ['id' => 'slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/img/laporan.jpg'],
        ],
    ]);

    $response = $this->get(route('laporan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('laporan')
        ->where('heroSection.title', 'Laporan Energi Profesional')
        ->has('heroSection.carousel_items', 1),
    );
});

it('dapat memperbarui hero laporan dari panel admin', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->post(route('panel-admin.laporan.hero-section.update'), [
        'title' => 'Laporan Keuangan & Kinerja',
        'subtitle' => 'Deskripsi laporan...',
        'carousel_items' => [
            [
                'id' => 'slide-1',
                'type' => 'image',
                'sourceType' => 'url',
                'url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('hero_section_laporans', [
        'title' => 'Laporan Keuangan & Kinerja',
    ]);
});

it('dapat mengunggah file gambar untuk hero laporan', function () {
    Storage::fake('public');

    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $file = UploadedFile::fake()->create('hero.jpg', 100, 'image/jpeg');

    $response = $this->actingAs($user)->post(route('panel-admin.laporan.hero-section.update'), [
        'title' => 'Laporan Dengan Gambar',
        'subtitle' => 'Deskripsi...',
        'carousel_items' => [
            [
                'id' => 'slide-1',
                'type' => 'image',
                'sourceType' => 'upload',
                'url' => '',
                'file' => $file,
            ],
        ],
    ]);

    $response->assertRedirect();

    $hero = HeroSectionLaporan::first();
    expect($hero->carousel_items[0]['url'])->toStartWith('/storage/hero-laporan-carousel/');

    // Pastikan berkas benar-benar disimpan di storage
    $storedPath = str_replace('/storage/', '', $hero->carousel_items[0]['url']);
    Storage::disk('public')->assertExists($storedPath);
});

it('dapat memperbarui laporan keuangan dari panel admin', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->post(route('panel-admin.laporan.keuangan-section.update'), [
        'section_title' => 'Laporan Keuangan Korporasi',
        'section_desc' => 'Deskripsi laporan...',
        'items' => [
            [
                'id' => '1',
                'title' => 'Laporan Tahunan 2024',
                'subtitle' => 'Sub judul...',
                'date' => '15 Mar 2024',
                'badge' => '2024',
                'imageSrc' => '/assets/img.png',
                'imageSourceType' => 'url',
                'poinUtamaList' => [
                    ['id' => 'p1', 'text' => 'Poin 1'],
                ],
                'dokumenList' => [
                    [
                        'id' => 'd1',
                        'name' => 'Dokumen 1',
                        'fileSize' => '1.5 MB',
                        'sourceType' => 'url',
                        'fileUrl' => 'https://example.com/doc.pdf',
                    ],
                ],
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('laporan_keuangan_sections', [
        'section_title' => 'Laporan Keuangan Korporasi',
        'section_desc' => 'Deskripsi laporan...',
    ]);
});

it('dapat mengunggah file cover dan dokumen untuk laporan keuangan', function () {
    Storage::fake('public');

    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $imageFile = UploadedFile::fake()->create('cover.jpg', 100, 'image/jpeg');
    $pdfFile = UploadedFile::fake()->create('dokumen.pdf', 500, 'application/pdf');

    $response = $this->actingAs($user)->post(route('panel-admin.laporan.keuangan-section.update'), [
        'section_title' => 'Laporan Keuangan Unggahan',
        'section_desc' => 'Deskripsi...',
        'items' => [
            [
                'id' => '1',
                'title' => 'Laporan Tahunan 2024',
                'subtitle' => 'Sub judul...',
                'date' => '15 Mar 2024',
                'badge' => '2024',
                'imageSrc' => '',
                'imageSourceType' => 'upload',
                'file' => $imageFile,
                'poinUtamaList' => [],
                'dokumenList' => [
                    [
                        'id' => 'd1',
                        'name' => 'Dokumen PDF Unggahan',
                        'fileSize' => '',
                        'sourceType' => 'upload',
                        'fileUrl' => '',
                        'file' => $pdfFile,
                    ],
                ],
            ],
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('laporan_keuangan_sections', [
        'section_title' => 'Laporan Keuangan Unggahan',
    ]);

    $section = LaporanKeuanganSection::first();
    $items = $section->items;

    expect($items[0]['imageSrc'])->toStartWith('/storage/laporan-keuangan-images/');
    expect($items[0]['dokumenList'][0]['fileUrl'])->toStartWith('/storage/laporan-keuangan-dokumen/');

    // Pastikan berkas-berkas benar-benar disimpan di storage
    $storedImgPath = str_replace('/storage/', '', $items[0]['imageSrc']);
    $storedPdfPath = str_replace('/storage/', '', $items[0]['dokumenList'][0]['fileUrl']);
    Storage::disk('public')->assertExists($storedImgPath);
    Storage::disk('public')->assertExists($storedPdfPath);
});

it('dapat memperbarui laporan tahunan dari panel admin', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->post(route('panel-admin.laporan.tahunan-section.update'), [
        'section_title' => 'Laporan Tahunan Baru',
        'section_desc' => 'Deskripsi laporan tahunan...',
        'annual_reports' => [
            [
                'id' => '1',
                'title' => 'Annual Report 2024',
                'subtitle' => 'Sub judul...',
                'badge' => '2024',
                'imageSrc' => '/assets/img.png',
                'fileUrl' => 'https://example.com/ar2024.pdf',
                'fileSize' => '2.5 MB',
                'imageSourceType' => 'url',
                'fileSourceType' => 'url',
            ],
        ],
        'keberlanjutan_items' => [
            [
                'id' => '1',
                'title' => 'Sustainability Report 2024',
                'subtitle' => 'Sub judul...',
                'fileUrl' => 'https://example.com/sr2024.pdf',
                'fileSize' => '1.8 MB',
                'fileSourceType' => 'url',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('laporan_tahunan_sections', [
        'section_title' => 'Laporan Tahunan Baru',
        'section_desc' => 'Deskripsi laporan tahunan...',
    ]);
});

it('dapat mengunggah file cover dan dokumen untuk laporan tahunan', function () {
    Storage::fake('public');

    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $imageFile = UploadedFile::fake()->create('cover.jpg', 100, 'image/jpeg');
    $docFile = UploadedFile::fake()->create('dokumen.pdf', 500, 'application/pdf');
    $kebDocFile = UploadedFile::fake()->create('keb_dokumen.pdf', 300, 'application/pdf');

    $response = $this->actingAs($user)->post(route('panel-admin.laporan.tahunan-section.update'), [
        'section_title' => 'Laporan Tahunan Unggahan',
        'section_desc' => 'Deskripsi...',
        'annual_reports' => [
            [
                'id' => '1',
                'title' => 'Annual Report 2024',
                'subtitle' => 'Sub judul...',
                'badge' => '2024',
                'imageSrc' => '',
                'fileUrl' => '',
                'fileSize' => '',
                'imageSourceType' => 'upload',
                'fileSourceType' => 'upload',
                'imageFile' => $imageFile,
                'docFile' => $docFile,
            ],
        ],
        'keberlanjutan_items' => [
            [
                'id' => '1',
                'title' => 'Sustainability Report 2024',
                'subtitle' => 'Sub judul...',
                'fileUrl' => '',
                'fileSize' => '',
                'fileSourceType' => 'upload',
                'docFile' => $kebDocFile,
            ],
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('laporan_tahunan_sections', [
        'section_title' => 'Laporan Tahunan Unggahan',
    ]);

    $section = LaporanTahunanSection::first();
    $annual = $section->annual_reports;
    $keb = $section->keberlanjutan_items;

    expect($annual[0]['imageSrc'])->toStartWith('/storage/laporan-tahunan-covers/');
    expect($annual[0]['fileUrl'])->toStartWith('/storage/laporan-tahunan-dokumen/');
    expect($keb[0]['fileUrl'])->toStartWith('/storage/laporan-tahunan-dokumen/');

    // Pastikan berkas-berkas benar-benar disimpan di storage
    $storedImgPath = str_replace('/storage/', '', $annual[0]['imageSrc']);
    $storedPdfPath = str_replace('/storage/', '', $annual[0]['fileUrl']);
    $storedKebPdfPath = str_replace('/storage/', '', $keb[0]['fileUrl']);
    Storage::disk('public')->assertExists($storedImgPath);
    Storage::disk('public')->assertExists($storedPdfPath);
    Storage::disk('public')->assertExists($storedKebPdfPath);
});
