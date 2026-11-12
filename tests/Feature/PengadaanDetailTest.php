<?php

use App\Models\DaftarPengadaan;

beforeEach(function (): void {
    DaftarPengadaan::create([
        'section_title' => 'Pengadaan',
        'categories' => ['Jasa'],
        'items' => [
            ['id' => 'first', 'title' => 'Pemeliharaan Pembangkit', 'status' => 'TERBUKA'],
            [
                'id' => 'second', 'title' => 'Pemeliharaan Pembangkit', 'status' => 'TERBUKA',
                'deskripsi' => 'Ruang lingkup kedua',
                'syaratList' => [['id' => 'syarat', 'text' => 'Sertifikat usaha']],
                'dokumenList' => [['id' => 'doc', 'name' => 'RKS', 'fileUrl' => '/storage/rks.pdf']],
                'mapsKoordinat' => '1.13,104.05',
            ],
            ['id' => 'archive', 'title' => 'Pengumuman Lama', 'status' => 'TUTUP', 'isArchived' => true],
        ],
    ]);
});

test('detail selects the exact id even when titles are identical', function (): void {
    $this->get(route('pengadaan.detail', ['id' => 'second', 'nama' => 'Pengumuman Lama']))
        ->assertOk()->assertInertia(fn ($page) => $page
        ->component('pengadaan/detail')
        ->where('item.id', 'second')
        ->where('item.deskripsi', 'Ruang lingkup kedua')
        ->where('item.syaratList.0.text', 'Sertifikat usaha')
        ->where('item.dokumenList.0.fileUrl', '/storage/rks.pdf')
        ->where('item.mapsKoordinat', '1.13,104.05'));
});

test('legacy title and slug links still open the matching procurement', function (string $name): void {
    $this->get(route('pengadaan.detail', ['nama' => $name]))
        ->assertOk()->assertInertia(fn ($page) => $page->where('item.id', 'archive'));
})->with(['Pengumuman Lama', 'pengumuman-lama', 'PENGUMUMAN LAMA']);

test('missing procurement never falls back to the first item', function (array $query): void {
    $this->get(route('pengadaan.detail', $query))->assertNotFound();
})->with([
    'no selector' => [[]],
    'unknown id' => [['id' => 'unknown']],
    'unknown name' => [['nama' => 'Tidak Ada']],
    'invalid id with existing name' => [['id' => 'unknown', 'nama' => 'Pengumuman Lama']],
]);

test('empty procurement data returns not found', function (): void {
    DaftarPengadaan::query()->delete();
    $this->get(route('pengadaan.detail', ['id' => 'first']))->assertNotFound();
});
