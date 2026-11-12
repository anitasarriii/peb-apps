<?php

use App\Models\BeritaSection;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->role = Role::factory()->create(['name' => 'super_admin']);
    $this->user = User::factory()->create(['role_id' => $this->role->id]);
    Storage::fake('public');
});

it('can update hero section berita', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.berita.hero-section.update'), [
        'title' => 'Judul Hero Baru',
        'subtitle' => 'Deskripsi Hero Baru',
        'carousel_items' => [
            [
                'id' => 'slide-1',
                'type' => 'image',
                'sourceType' => 'url',
                'url' => 'https://example.com/slide1.jpg',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('hero_section_beritas', [
        'title' => 'Judul Hero Baru',
        'subtitle' => 'Deskripsi Hero Baru',
    ]);
});

it('can update daftar berita with gallery', function () {
    $imageFile = UploadedFile::fake()->create('gallery1.jpg', 500, 'image/jpeg');
    $videoFile = UploadedFile::fake()->create('gallery2.mp4', 5000, 'video/mp4');

    $response = $this->actingAs($this->user)->post(route('panel-admin.berita.daftar-section.update'), [
        'section_title' => 'Daftar Berita Utama',
        'section_desc' => 'Deksripsi Berita Utama',
        'items' => [
            [
                'id' => 'berita-1',
                'title' => 'Berita A',
                'subtitle' => 'Subtitle A',
                'date' => '2026-06-24',
                'imageSrc' => 'https://example.com/cover.jpg',
                'imageSourceType' => 'url',
                'gallery' => [
                    [
                        'id' => 'gal-1',
                        'type' => 'image',
                        'sourceType' => 'upload',
                        'file' => $imageFile,
                    ],
                    [
                        'id' => 'gal-2',
                        'type' => 'video',
                        'sourceType' => 'upload',
                        'file' => $videoFile,
                    ],
                ],
            ],
        ],
    ]);

    $response->assertRedirect();

    $section = BeritaSection::first();
    expect($section->section_title)->toBe('Daftar Berita Utama');
    expect($section->items)->toBeArray();
    expect($section->items[0]['title'])->toBe('Berita A');
    expect($section->items[0]['gallery'])->toBeArray();
    expect($section->items[0]['gallery'][0]['url'])->toStartWith('/storage/berita-gallery/');
    expect($section->items[0]['gallery'][1]['url'])->toStartWith('/storage/berita-gallery/');

    // Pastikan berkas benar-benar tersimpan di storage fake
    $path1 = str_replace('/storage/', '', $section->items[0]['gallery'][0]['url']);
    $path2 = str_replace('/storage/', '', $section->items[0]['gallery'][1]['url']);
    Storage::disk('public')->assertExists($path1);
    Storage::disk('public')->assertExists($path2);
});

it('validates gallery image file extension and size', function () {
    // File pdf diupload sebagai file gambar galeri (harus ditolak karena ekstensi)
    $invalidFile = UploadedFile::fake()->create('invalid.pdf', 100, 'application/pdf');

    $response = $this->actingAs($this->user)->post(route('panel-admin.berita.daftar-section.update'), [
        'section_title' => 'Daftar Berita',
        'section_desc' => 'Deskripsi',
        'items' => [
            [
                'id' => 'berita-1',
                'title' => 'Berita A',
                'subtitle' => 'Subtitle A',
                'date' => '2026-06-24',
                'imageSrc' => 'https://example.com/cover.jpg',
                'imageSourceType' => 'url',
                'gallery' => [
                    [
                        'id' => 'gal-1',
                        'type' => 'image',
                        'sourceType' => 'upload',
                        'file' => $invalidFile,
                    ],
                ],
            ],
        ],
    ]);

    $response->assertSessionHasErrors([
        'items.0.gallery.0.file',
    ]);

    // Gambar melebihi batas 500 MB.
    $largeImage = UploadedFile::fake()->create('large.jpg', 512001, 'image/jpeg');

    $response2 = $this->actingAs($this->user)->post(route('panel-admin.berita.daftar-section.update'), [
        'section_title' => 'Daftar Berita',
        'section_desc' => 'Deskripsi',
        'items' => [
            [
                'id' => 'berita-1',
                'title' => 'Berita A',
                'subtitle' => 'Subtitle A',
                'date' => '2026-06-24',
                'imageSrc' => 'https://example.com/cover.jpg',
                'imageSourceType' => 'url',
                'gallery' => [
                    [
                        'id' => 'gal-1',
                        'type' => 'image',
                        'sourceType' => 'upload',
                        'file' => $largeImage,
                    ],
                ],
            ],
        ],
    ]);

    $response2->assertSessionHasErrors([
        'items.0.gallery.0.file',
    ]);
});

it('validates gallery video file extension and size', function () {
    // File txt diupload sebagai video galeri (harus ditolak)
    $invalidFile = UploadedFile::fake()->create('invalid.txt', 100, 'text/plain');

    $response = $this->actingAs($this->user)->post(route('panel-admin.berita.daftar-section.update'), [
        'section_title' => 'Daftar Berita',
        'section_desc' => 'Deskripsi',
        'items' => [
            [
                'id' => 'berita-1',
                'title' => 'Berita A',
                'subtitle' => 'Subtitle A',
                'date' => '2026-06-24',
                'imageSrc' => 'https://example.com/cover.jpg',
                'imageSourceType' => 'url',
                'gallery' => [
                    [
                        'id' => 'gal-1',
                        'type' => 'video',
                        'sourceType' => 'upload',
                        'file' => $invalidFile,
                    ],
                ],
            ],
        ],
    ]);

    $response->assertSessionHasErrors([
        'items.0.gallery.0.file',
    ]);

    // Video melebihi batas 500 MB.
    $largeVideo = UploadedFile::fake()->create('large.mp4', 512001, 'video/mp4');

    $response2 = $this->actingAs($this->user)->post(route('panel-admin.berita.daftar-section.update'), [
        'section_title' => 'Daftar Berita',
        'section_desc' => 'Deskripsi',
        'items' => [
            [
                'id' => 'berita-1',
                'title' => 'Berita A',
                'subtitle' => 'Subtitle A',
                'date' => '2026-06-24',
                'imageSrc' => 'https://example.com/cover.jpg',
                'imageSourceType' => 'url',
                'gallery' => [
                    [
                        'id' => 'gal-1',
                        'type' => 'video',
                        'sourceType' => 'upload',
                        'file' => $largeVideo,
                    ],
                ],
            ],
        ],
    ]);

    $response2->assertSessionHasErrors([
        'items.0.gallery.0.file',
    ]);
});
