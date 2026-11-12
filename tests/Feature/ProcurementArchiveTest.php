<?php

use App\Models\BeritaSection;
use App\Models\DaftarPengadaan;
use Inertia\Testing\AssertableInertia as Assert;

test('public procurement includes transferred archives without reopening closed tenders', function () {
    DaftarPengadaan::create([
        'section_title' => 'Pengadaan',
        'categories' => ['Jasa', 'Arsip Pengadaan'],
        'items' => [
            ['id' => 'open', 'title' => 'Tender aktif', 'status' => 'TERBUKA'],
            ['id' => 'closed', 'title' => 'Tender ditutup', 'status' => 'TUTUP'],
            ['id' => 'archive', 'title' => 'Pengumuman lama', 'status' => 'TUTUP', 'isArchived' => true, 'deskripsi' => 'Isi pengumuman asli'],
        ],
    ]);
    BeritaSection::create([
        'section_title' => 'Berita & Acara',
        'section_desc' => 'Berita perusahaan',
        'items' => [['id' => 'news', 'title' => 'Berita perusahaan']],
    ]);

    $this->get(route('pengadaan'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('pengadaan')
        ->has('daftarPengadaan.items', 2)
        ->where('daftarPengadaan.items.0.id', 'open')
        ->where('daftarPengadaan.items.1.id', 'archive')
        ->where('daftarPengadaan.items.1.status', 'TUTUP')
    );

    $this->get(route('pengadaan.detail', ['id' => 'archive']))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('pengadaan/detail')
        ->where('item.id', 'archive')
        ->where('item.deskripsi', 'Isi pengumuman asli')
    );

    $this->get(route('berita-acara'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('berita-acara')
        ->has('beritaSection.items', 1)
        ->where('beritaSection.items.0.id', 'news')
    );
});
