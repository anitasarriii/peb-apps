<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->role = Role::factory()->create(['name' => 'super_admin']);
    $this->user = User::factory()->create(['role_id' => $this->role->id]);
});

it('can update SEO meta data for a page', function () {
    $response = $this->actingAs($this->user)->post(route('panel-admin.seo-meta.update', ['page_type' => 'beranda']), [
        'meta_title' => 'Judul SEO Baru',
        'meta_description' => 'Deskripsi SEO Baru',
        'meta_keywords' => 'keyword1, keyword2',
        'author' => 'PT Pelayanan Energi Batam',
        'robots_index' => 'index',
        'robots_follow' => 'follow',
        'og_title' => 'Judul OG Baru',
        'og_description' => 'Deskripsi OG Baru',
        'image_source_type' => 'url',
        'og_image' => 'https://example.com/og.jpg',
        'image_file_name' => '',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('seo_metas', [
        'page_type' => 'beranda',
        'meta_title' => 'Judul SEO Baru',
        'meta_description' => 'Deskripsi SEO Baru',
        'og_title' => 'Judul OG Baru',
    ]);
});
