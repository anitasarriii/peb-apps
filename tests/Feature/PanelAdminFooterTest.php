<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->role = Role::factory()->create(['name' => 'super_admin']);
    $this->user = User::factory()->create(['role_id' => $this->role->id]);
});

it('can update footer', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.footer.update'), [
        'logo_source_type' => 'url',
        'logo_src' => 'https://example.com/logo.png',
        'logo_file_name' => '',
        'description' => 'Energi baru untuk Batam.',
        'socials' => [
            ['id' => '1', 'platform' => 'Facebook', 'href' => 'https://facebook.com/peb'],
        ],
        'explore_links' => [
            ['id' => '1', 'label' => 'Kontak', 'href' => '/kontak'],
        ],
        'address' => 'Batam, Indonesia',
        'phone' => '021-123456',
        'email' => 'contact@peb.co.id',
        'subscribe_heading' => 'Berlangganan',
        'subscribe_description' => 'Berlangganan berita terbaru.',
        'subscribe_button_label' => 'Kirim',
        'copyright_text' => 'Copyright 2026 PT PEB',
        'privacy_href' => '/privacy',
        'tos_href' => '/tos',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('footers', [
        'description' => 'Energi baru untuk Batam.',
        'address' => 'Batam, Indonesia',
        'phone' => '021-123456',
        'email' => 'contact@peb.co.id',
        'copyright_text' => 'Copyright 2026 PT PEB',
    ]);
});
