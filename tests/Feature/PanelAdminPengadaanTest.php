<?php

use App\Models\HeroSectionPengadaan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('halaman pengadaan dapat diakses tanpa login (publik)', function () {
    $response = $this->get(route('pengadaan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('pengadaan'));
});

it('mengembalikan heroSection null jika belum ada data di database', function () {
    $response = $this->get(route('pengadaan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('pengadaan')
        ->where('heroSection', null),
    );
});

it('mengembalikan heroSection jika data sudah dikonfigurasi di database', function () {
    HeroSectionPengadaan::create([
        'user_id' => null,
        'title' => 'Pengadaan Energi Profesional',
        'subtitle' => 'Solusi pengadaan energi terbaik untuk industri.',
        'carousel_items' => [
            ['id' => 'slide-1', 'type' => 'image', 'sourceType' => 'url', 'url' => '/img/pengadaan.jpg'],
        ],
    ]);

    $response = $this->get(route('pengadaan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('pengadaan')
        ->where('heroSection.title', 'Pengadaan Energi Profesional')
        ->has('heroSection.carousel_items', 1),
    );
});

it('dapat memperbarui hero pengadaan dari panel admin', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->post(route('panel-admin.pengadaan.hero-section.update'), [
        'title' => 'Pengadaan & Tender PEB',
        'subtitle' => 'Deskripsi pengadaan...',
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
    $this->assertDatabaseHas('hero_section_pengadaans', [
        'title' => 'Pengadaan & Tender PEB',
    ]);
});

it('dapat mengunggah file gambar untuk hero pengadaan', function () {
    Storage::fake('public');

    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $file = UploadedFile::fake()->create('hero.jpg', 100, 'image/jpeg');

    $response = $this->actingAs($user)->post(route('panel-admin.pengadaan.hero-section.update'), [
        'title' => 'Pengadaan Dengan Gambar',
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

    $hero = HeroSectionPengadaan::first();
    expect($hero->carousel_items[0]['url'])->toStartWith('/storage/hero-pengadaan-carousel/');

    // Pastikan berkas benar-benar disimpan di storage
    $storedPath = str_replace('/storage/', '', $hero->carousel_items[0]['url']);
    Storage::disk('public')->assertExists($storedPath);
});
