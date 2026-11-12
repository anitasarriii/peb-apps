<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('admin can delete the last entry without restoring sample data', function (string $routeName, string $table, array $payload, string $field): void {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $this->actingAs($user)->post(route($routeName), $payload)
        ->assertRedirect()->assertSessionHasNoErrors();

    expect(json_decode(DB::table($table)->value($field), true))->toBe([]);
})->with([
    'gallery' => ['panel-admin.galeri.galeri-foto.update', 'galeri_foto_sections', ['section_title' => 'Galeri', 'categories' => ['Umum'], 'items' => []], 'items'],
    'finance' => ['panel-admin.laporan.keuangan-section.update', 'laporan_keuangan_sections', ['section_title' => 'Keuangan', 'section_desc' => 'Laporan', 'items' => []], 'items'],
    'news' => ['panel-admin.berita.daftar-section.update', 'berita_sections', ['section_title' => 'Berita', 'section_desc' => 'Informasi', 'items' => []], 'items'],
    'portfolio' => ['panel-admin.portfolio.daftar-section.update', 'daftar_portfolio_sections', ['section_title' => 'Portofolio', 'categories' => ['Umum'], 'items' => []], 'items'],
    'annual' => ['panel-admin.laporan.tahunan-section.update', 'laporan_tahunan_sections', ['section_title' => 'Tahunan', 'section_desc' => 'Laporan', 'annual_reports' => [], 'keberlanjutan_items' => []], 'annual_reports'],
    'sustainability' => ['panel-admin.laporan.tahunan-section.update', 'laporan_tahunan_sections', ['section_title' => 'Tahunan', 'section_desc' => 'Laporan', 'annual_reports' => [], 'keberlanjutan_items' => []], 'keberlanjutan_items'],
]);

test('annual form accepts an omitted empty companion collection in multipart requests', function (): void {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $this->actingAs($user)->post(route('panel-admin.laporan.tahunan-section.update'), [
        'section_title' => 'Tahunan', 'section_desc' => 'Laporan',
        'annual_reports' => [['id' => 'new', 'title' => 'Tahunan baru', 'subtitle' => '', 'badge' => '2026', 'imageSrc' => '', 'fileUrl' => '', 'fileSize' => '']],
    ])->assertRedirect()->assertSessionHasNoErrors();

    expect(json_decode(DB::table('laporan_tahunan_sections')->value('annual_reports'), true)[0]['id'])->toBe('new')
        ->and(json_decode(DB::table('laporan_tahunan_sections')->value('keberlanjutan_items'), true))->toBe([]);
});
