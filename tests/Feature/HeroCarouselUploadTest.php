<?php

use App\Models\HeroSectionBeranda;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('uploaded carousel media stays available when saved again without selecting the file again', function (): void {
    Storage::fake('public');
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $payload = [
        'title' => 'Energi Bagi Negeri',
        'subtitle' => 'Solusi energi',
        'cta_label' => 'Selengkapnya',
        'cta_href' => '/tentang-kami',
        'secondary_cta_label' => null,
        'secondary_cta_href' => null,
        'carousel_items' => [[
            'id' => 'slide-upload',
            'type' => 'video',
            'sourceType' => 'upload',
            'url' => 'blob:local-preview',
            'previewUrl' => 'blob:local-preview',
            'file' => UploadedFile::fake()->create('company-profile.mp4', 1024),
        ]],
    ];

    $this->actingAs($user)->post(route('panel-admin.beranda.hero-section.update'), $payload)
        ->assertRedirect()->assertSessionHasNoErrors();

    $saved = HeroSectionBeranda::firstOrFail()->carousel_items[0];

    expect($saved['sourceType'])->toBe('upload')
        ->and($saved['fileName'])->toBe('company-profile.mp4')
        ->and($saved)->not->toHaveKeys(['file', 'previewUrl']);

    $payload['carousel_items'] = [$saved];
    $payload['title'] = 'Judul diperbarui';
    $this->post(route('panel-admin.beranda.hero-section.update'), $payload)
        ->assertRedirect()->assertSessionHasNoErrors();

    expect(HeroSectionBeranda::firstOrFail()->carousel_items[0]['url'])->toBe($saved['url']);
    Storage::disk('public')->assertExists(substr($saved['url'], strlen('/storage/')));
});

test('upload mode requires a selected file instead of silently saving the old url', function (): void {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($user)->post(route('panel-admin.beranda.hero-section.update'), [
        'title' => 'Energi Bagi Negeri',
        'subtitle' => 'Solusi energi',
        'cta_label' => 'Selengkapnya',
        'cta_href' => '/tentang-kami',
        'secondary_cta_label' => null,
        'secondary_cta_href' => null,
        'carousel_items' => [[
            'id' => 'slide-1',
            'type' => 'video',
            'sourceType' => 'upload',
            'url' => '/assets/beranda/hero/hero-video.mp4',
        ]],
    ])->assertSessionHasErrors('carousel_items.0.file');

    expect(HeroSectionBeranda::count())->toBe(0);
});

test('carousel accepts uploads at the increased size limit', function (string $type, string $extension, int $size): void {
    Storage::fake('public');
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($user)->post(route('panel-admin.beranda.hero-section.update'), [
        'title' => 'Energi Bagi Negeri',
        'subtitle' => 'Solusi energi',
        'cta_label' => 'Selengkapnya',
        'cta_href' => '/tentang-kami',
        'secondary_cta_label' => null,
        'secondary_cta_href' => null,
        'carousel_items' => [[
            'id' => 'slide-1',
            'type' => $type,
            'sourceType' => 'upload',
            'url' => '',
            'file' => UploadedFile::fake()->create('slide.'.$extension, $size),
        ]],
    ])->assertRedirect()->assertSessionHasNoErrors();

    $slide = HeroSectionBeranda::firstOrFail()->carousel_items[0];

    expect($slide['type'])->toBe($type)
        ->and($slide['url'])->toStartWith('/storage/hero-carousel/');
    Storage::disk('public')->assertExists(substr($slide['url'], strlen('/storage/')));
})->with([
    'image 500 MB' => ['image', 'jpg', 512000],
    'video 500 MB' => ['video', 'mp4', 512000],
]);

test('carousel rejects uploads exceeding the size limit', function (string $type, string $extension, int $size): void {
    Storage::fake('public');
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($user)->post(route('panel-admin.beranda.hero-section.update'), [
        'title' => 'Energi Bagi Negeri',
        'subtitle' => 'Solusi energi',
        'cta_label' => 'Selengkapnya',
        'cta_href' => '/tentang-kami',
        'secondary_cta_label' => null,
        'secondary_cta_href' => null,
        'carousel_items' => [[
            'id' => 'slide-1',
            'type' => $type,
            'sourceType' => 'upload',
            'url' => '',
            'file' => UploadedFile::fake()->create('slide.'.$extension, $size),
        ]],
    ])->assertSessionHasErrors('carousel_items.0.file');

    expect(HeroSectionBeranda::count())->toBe(0)
        ->and(Storage::disk('public')->allFiles())->toBe([]);
})->with([
    'image over 500 MB' => ['image', 'jpg', 512001],
    'video over 500 MB' => ['video', 'mp4', 512001],
]);
