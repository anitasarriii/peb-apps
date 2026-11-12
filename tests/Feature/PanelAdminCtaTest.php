<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->role = Role::factory()->create(['name' => 'super_admin']);
    $this->user = User::factory()->create(['role_id' => $this->role->id]);
});

it('can update CTA section', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.cta-section.update'), [
        'text' => 'Teks CTA Baru',
        'button_label' => 'Hubungi Kami Sekarang',
        'button_href' => '/contact-us',
        'bg_source' => 'url',
        'background_src' => 'https://example.com/image.jpg',
        'bg_file_name' => '',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('cta_sections', [
        'text' => 'Teks CTA Baru',
        'button_label' => 'Hubungi Kami Sekarang',
        'button_href' => '/contact-us',
        'bg_source' => 'url',
    ]);
});
