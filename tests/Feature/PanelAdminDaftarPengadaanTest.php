<?php

use App\Models\DaftarPengadaan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('menyimpan pengadaan dari form sederhana tanpa informasi tambahan', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($user)->post(route('panel-admin.pengadaan.daftar-section.update'), [
        'section_title' => 'Daftar Pengadaan',
        'categories' => ['Jasa'],
        'items' => [[
            'id' => 'simple-1',
            'title' => 'Pemeliharaan pembangkit',
            'category' => 'Jasa',
            'status' => 'TERBUKA',
            'startDate' => '2026-11-02',
            'endDate' => '2026-11-30',
            'location' => 'Batam',
            'deskripsi' => 'Ruang lingkup pekerjaan pemeliharaan.',
            'imageSrc' => '',
            'syaratList' => [],
            'dokumenList' => [],
            'mapsKoordinat' => '',
        ]],
    ])->assertRedirect()->assertSessionHasNoErrors();

    $item = DaftarPengadaan::firstOrFail()->items[0];

    expect($item['title'])->toBe('Pemeliharaan pembangkit')
        ->and($item['startDate'])->toBe('2026-11-02')
        ->and($item['syaratList'])->toBe([])
        ->and($item['dokumenList'])->toBe([]);
});

it('menyimpan pengadaan baru bersama arsip tanpa menghilangkan metadata arsip', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $archive = [
        'id' => 'archive-1',
        'title' => 'Pengumuman lama',
        'status' => 'TUTUP',
        'isArchived' => '1',
        'date' => '2024-01-01',
        'gallery' => ['/images/archive.jpg'],
        'deskripsi' => 'Isi asli pengumuman',
    ];

    $this->actingAs($user)->post(route('panel-admin.pengadaan.daftar-section.update'), [
        'section_title' => 'Daftar Pengadaan',
        'categories' => ['Jasa', 'Arsip Pengadaan'],
        'items' => [
            $archive,
            ['id' => 'new-1', 'title' => 'Pengadaan baru', 'status' => 'TERBUKA', 'category' => 'Jasa'],
        ],
    ])->assertRedirect()->assertSessionHasNoErrors();

    $items = DaftarPengadaan::firstOrFail()->items;

    expect($items)->toHaveCount(2)
        ->and($items[0]['isArchived'])->toBeTrue()
        ->and($items[0]['gallery'])->toBe($archive['gallery'])
        ->and($items[0]['date'])->toBe($archive['date'])
        ->and($items[1]['title'])->toBe('Pengadaan baru');
});

it('halaman pengadaan publik dapat diakses tanpa login', function () {
    $response = $this->get(route('pengadaan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('pengadaan'));
});

it('mengembalikan daftarPengadaan null jika belum di-seed', function () {
    // Kosongkan tabel untuk simulasi awal
    DaftarPengadaan::truncate();

    $response = $this->get(route('pengadaan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('pengadaan')
        ->where('daftarPengadaan', null),
    );
});

it('mengembalikan daftarPengadaan jika data sudah di-seed atau disimpan', function () {
    DaftarPengadaan::create([
        'section_title' => 'Pengadaan Terkini',
        'categories' => ['Jasa', 'Keamanan'],
        'items' => [
            [
                'id' => '1',
                'title' => 'Tender Jasa Pengamanan',
                'status' => 'TERBUKA',
                'startDate' => '01 Jan 2026',
                'endDate' => '10 Jan 2026',
                'location' => 'Batam',
                'category' => 'Keamanan',
                'imageSrc' => '/img/cover.jpg',
            ],
        ],
    ]);

    $response = $this->get(route('pengadaan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('pengadaan')
        ->where('daftarPengadaan.section_title', 'Pengadaan Terkini')
        ->has('daftarPengadaan.categories', 2)
        ->has('daftarPengadaan.items', 1),
    );
});

it('admin dapat memperbarui daftar pengadaan global', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->post(route('panel-admin.pengadaan.daftar-section.update'), [
        'section_title' => 'Tender Terbaru PEB',
        'categories' => ['IT', 'Konstruksi'],
        'items' => [
            [
                'id' => 'item-100',
                'title' => 'Pengadaan Server SCADA',
                'status' => 'TERBUKA',
                'startDate' => '12 Jun 2026',
                'endDate' => '20 Jun 2026',
                'location' => 'Batam Center',
                'category' => 'IT',
                'imageSrc' => 'https://example.com/scada.jpg',
                'deskripsi' => 'Pengadaan server handal untuk monitoring SCADA.',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Memiliki sertifikasi IT global'],
                ],
                'dokumenList' => [
                    [
                        'id' => 'doc-1',
                        'name' => 'Dokumen RKS SCADA',
                        'fileSize' => '10 MB',
                        'sourceType' => 'url',
                        'fileUrl' => 'https://example.com/rks.pdf',
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1301,104.0529',
                'mapsEmbedUrl' => '',
                'mapsLabel' => 'PLTG Panaran',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('daftar_pengadaans', [
        'section_title' => 'Tender Terbaru PEB',
    ]);

    $daftar = DaftarPengadaan::first();
    expect($daftar->categories)->toEqual(['IT', 'Konstruksi']);
    expect($daftar->items[0]['title'])->toEqual('Pengadaan Server SCADA');
    expect($daftar->items[0]['deskripsi'])->toEqual('Pengadaan server handal untuk monitoring SCADA.');
    expect($daftar->items[0]['syaratList'][0]['text'])->toEqual('Memiliki sertifikasi IT global');
    expect($daftar->items[0]['dokumenList'][0]['name'])->toEqual('Dokumen RKS SCADA');
});

it('admin dapat mengunggah file gambar cover pengadaan', function () {
    Storage::fake('public');

    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $file = UploadedFile::fake()->create('cover.png', 200, 'image/png');

    $response = $this->actingAs($user)->post(route('panel-admin.pengadaan.daftar-section.update'), [
        'section_title' => 'Tender Dengan Cover',
        'categories' => ['Konstruksi'],
        'items' => [
            [
                'id' => '1',
                'title' => 'Tender Konstruksi Jalan',
                'status' => 'SELEKSI',
                'startDate' => '01 Jan 2026',
                'endDate' => '10 Jan 2026',
                'location' => 'Batam',
                'category' => 'Konstruksi',
                'imageSourceType' => 'upload',
                'imageSrc' => '',
                'file' => $file,
            ],
        ],
    ]);

    $response->assertRedirect();

    $daftar = DaftarPengadaan::first();
    expect($daftar->items[0]['imageSrc'])->toStartWith('/storage/daftar-pengadaan-images/');

    // Verifikasi berkas disimpan di storage disk
    $storedPath = str_replace('/storage/', '', $daftar->items[0]['imageSrc']);
    Storage::disk('public')->assertExists($storedPath);
});

it('admin dapat mengunggah file dokumen pengadaan', function () {
    Storage::fake('public');

    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $file = UploadedFile::fake()->create('dokumen-rks.pdf', 500, 'application/pdf');

    $response = $this->actingAs($user)->post(route('panel-admin.pengadaan.daftar-section.update'), [
        'section_title' => 'Tender Dengan Dokumen',
        'categories' => ['IT'],
        'items' => [
            [
                'id' => '1',
                'title' => 'Tender IT',
                'status' => 'TERBUKA',
                'startDate' => '01 Jan 2026',
                'endDate' => '10 Jan 2026',
                'location' => 'Batam',
                'category' => 'IT',
                'imageSrc' => 'https://example.com/cover.jpg',
                'deskripsi' => 'Deskripsi Tender IT',
                'syaratList' => [
                    ['id' => '1', 'text' => 'Syarat 1'],
                ],
                'dokumenList' => [
                    [
                        'id' => 'doc-1',
                        'name' => 'Dokumen RKS',
                        'fileSize' => '0.5 MB',
                        'sourceType' => 'upload',
                        'fileUrl' => '',
                        'file' => $file,
                    ],
                ],
                'mapsMode' => 'koordinat',
                'mapsKoordinat' => '1.1,104.0',
                'mapsLabel' => 'PLTG Panaran',
            ],
        ],
    ]);

    $response->assertRedirect();

    $daftar = DaftarPengadaan::first();
    $doc = $daftar->items[0]['dokumenList'][0];
    expect($doc['fileUrl'])->toStartWith('/storage/daftar-pengadaan-dokumen/');

    $storedPath = str_replace('/storage/', '', $doc['fileUrl']);
    Storage::disk('public')->assertExists($storedPath);
});

it('halaman detail pengadaan dapat diakses dengan nama parameter', function () {
    $daftar = DaftarPengadaan::create([
        'section_title' => 'Pengadaan Terkini',
        'categories' => ['IT'],
        'items' => [
            [
                'id' => 'item-special',
                'title' => 'Tender Spesial IT',
                'status' => 'TERBUKA',
                'startDate' => '01 Jan 2026',
                'endDate' => '10 Jan 2026',
                'location' => 'Batam',
                'category' => 'IT',
                'imageSrc' => '/img/cover.jpg',
            ],
        ],
    ]);

    $response = $this->get(route('pengadaan.detail', ['nama' => 'Tender Spesial IT']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('pengadaan/detail')
        ->where('item.id', 'item-special')
        ->where('item.title', 'Tender Spesial IT')
    );
});
