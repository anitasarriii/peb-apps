<?php

use App\Models\DaftarPengadaan;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\ProcurementArchivesSeeder;

test('archive restoration preserves current items and is idempotent with shared public and admin records', function (): void {
    $current = ['id' => 'existing', 'title' => 'Data existing', 'status' => 'TERBUKA', 'imageSrc' => '/existing.jpg'];
    DaftarPengadaan::create(['id' => 1, 'section_title' => 'Judul existing', 'categories' => ['Jasa'], 'items' => [$current]]);
    $this->seed(ProcurementArchivesSeeder::class);
    $saved = DaftarPengadaan::firstOrFail();
    $archives = collect($saved->items)->where('isArchived', true)->values();
    $count = count($saved->items);
    expect($archives->count())->toBeGreaterThan(0)->and($saved->items[0])->toBe($current)->and($saved->section_title)->toBe('Judul existing');
    $this->seed(ProcurementArchivesSeeder::class);
    expect(count($saved->fresh()->items))->toBe($count);
    $this->get(route('pengadaan'))->assertInertia(fn ($page) => $page->has('daftarPengadaan.items', $count));
    foreach (['super_admin', 'admin_pengadaan'] as $name) {
        $user = User::factory()->create(['role_id' => Role::factory()->create(['name' => $name, 'permissions' => ['manage_procurement' => true]])->id]);
        $this->actingAs($user)->get(route('panel-admin.index', ['tab' => 'Daftar Pengadaan']))->assertInertia(fn ($page) => $page->has('daftarPengadaan.items', $count));
    }
    $this->get(route('pengadaan.detail', ['id' => $archives[0]['id']]))->assertOk();
});
