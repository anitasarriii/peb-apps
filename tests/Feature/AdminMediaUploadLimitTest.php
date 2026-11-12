<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin heroes enforce the 500 MB media boundary', function (string $page, string $type, string $extension, int $size, bool $accepted): void {
    Storage::fake('public');
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->post(route("panel-admin.{$page}.hero-section.update"), [
        'title' => 'Profil Perusahaan',
        'subtitle' => 'Energi bagi negeri',
        'carousel_items' => [[
            'id' => 'slide-upload',
            'type' => $type,
            'sourceType' => 'upload',
            'url' => '',
            'file' => UploadedFile::fake()->create('slide.'.$extension, $size),
        ]],
    ]);

    if ($accepted) {
        $response->assertRedirect()->assertSessionHasNoErrors();
        expect(Storage::disk('public')->allFiles())->toHaveCount(1);
    } else {
        $response->assertSessionHasErrors('carousel_items.0.file');
        if ($page === 'servis') {
            $response->assertSessionHasErrors([
                'carousel_items.0.file' => $type === 'video'
                    ? 'Ukuran berkas video tidak boleh melebihi 500 MB.'
                    : 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
            ]);
        }
        expect(Storage::disk('public')->allFiles())->toBe([]);
    }
})->with(['tentang', 'servis', 'portfolio', 'pengadaan', 'laporan', 'kebijakan', 'galeri', 'berita'])
    ->with([
        'image at limit' => ['image', 'jpg', 512000, true],
        'video at limit' => ['video', 'mp4', 512000, true],
        'image above limit' => ['image', 'jpg', 512001, false],
        'video above limit' => ['video', 'mp4', 512001, false],
    ]);
