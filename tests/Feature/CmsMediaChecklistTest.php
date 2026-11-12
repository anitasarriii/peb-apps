<?php

use App\Models\DaftarPengadaan;
use App\Models\KebijakanPebSection;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('public');
    $this->actingAs(User::factory()->create(['role_id' => Role::factory()->create(['name' => 'super_admin'])->id]));
});

test('policy card images are uploaded independently of documents and survive a second save', function (): void {
    $payload = ['title' => 'Kebijakan', 'cards' => [[
        'id' => 'policy', 'title' => 'Kebijakan PEB', 'subtitle' => 'Kebijakan', 'description' => 'Isi kebijakan',
        'signedBy' => 'Direksi', 'role' => 'Direktur', 'date' => '2026-11-03',
        'imageFile' => UploadedFile::fake()->image('policy.jpg')->size(512000),
        'file' => UploadedFile::fake()->create('policy.pdf', 10, 'application/pdf'),
    ]]];
    $this->post(route('panel-admin.kebijakan.kebijakan-peb.update'), $payload)->assertRedirect()->assertSessionHasNoErrors();
    $card = KebijakanPebSection::firstOrFail()->cards[0];
    expect($card['imageSrc'])->toStartWith('/storage/kebijakan-images/')
        ->and($card['fileUrl'])->toStartWith('/storage/kebijakan_files/');
    Storage::disk('public')->assertExists(substr($card['imageSrc'], 9));
    $payload['cards'] = [$card];
    $this->post(route('panel-admin.kebijakan.kebijakan-peb.update'), $payload)->assertRedirect()->assertSessionHasNoErrors();
    expect(KebijakanPebSection::firstOrFail()->cards[0]['imageSrc'])->toBe($card['imageSrc']);
    $this->get(route('kebijakan'))->assertInertia(fn ($page) => $page->where('kebijakanPebSection.cards.0.imageSrc', $card['imageSrc']));
});

test('procurement cover and primary image are independent and public detail retains both', function (): void {
    $payload = ['section_title' => 'Pengadaan', 'categories' => ['Jasa'], 'items' => [[
        'id' => 'procurement', 'title' => 'Pengadaan baru', 'status' => 'TERBUKA', 'category' => 'Jasa',
        'imageSourceType' => 'upload', 'imageSrc' => '',
        'file' => UploadedFile::fake()->image('cover.jpg'),
        'bannerFile' => UploadedFile::fake()->image('main.jpg')->size(512000),
        'bannerPreviewUrl' => 'blob:temporary-preview',
    ]]];
    $this->post(route('panel-admin.pengadaan.daftar-section.update'), $payload)->assertRedirect()->assertSessionHasNoErrors();
    $item = DaftarPengadaan::firstOrFail()->items[0];
    expect($item['bannerImage'])->toStartWith('/storage/pengadaan-main-images/')
        ->and($item['imageSrc'])->not->toBe($item['bannerImage'])
        ->and($item)->not->toHaveKeys(['bannerFile', 'bannerPreviewUrl']);
    Storage::disk('public')->assertExists(substr($item['bannerImage'], 9));
    Storage::disk('public')->assertExists(substr($item['imageSrc'], 9));
    $payload['items'] = [$item];
    $this->post(route('panel-admin.pengadaan.daftar-section.update'), $payload)->assertRedirect()->assertSessionHasNoErrors();
    $this->get(route('pengadaan.detail', ['id' => 'procurement']))->assertInertia(fn ($page) => $page
        ->where('item.bannerImage', $item['bannerImage'])->where('item.imageSrc', $item['imageSrc']));
});

test('new image uploads enforce the 500 MB boundary', function (string $module): void {
    $file = UploadedFile::fake()->image('oversized.jpg')->size(512001);
    if ($module === 'policy') {
        $this->post(route('panel-admin.kebijakan.kebijakan-peb.update'), ['title' => 'Kebijakan', 'cards' => [[
            'id' => 'policy', 'title' => 'Kebijakan', 'subtitle' => 'Subjudul', 'description' => 'Isi',
            'signedBy' => 'Direksi', 'role' => 'Direktur', 'date' => '2026', 'imageFile' => $file,
        ]]])->assertSessionHasErrors('cards.0.imageFile');
        expect(KebijakanPebSection::count())->toBe(0);
    } else {
        $this->post(route('panel-admin.pengadaan.daftar-section.update'), ['section_title' => 'Pengadaan', 'categories' => ['Jasa'], 'items' => [[
            'id' => 'procurement', 'title' => 'Pengadaan', 'bannerFile' => $file,
        ]]])->assertSessionHasErrors('items.0.bannerFile');
        expect(DaftarPengadaan::count())->toBe(0);
    }
})->with(['policy', 'procurement']);
