<?php

test('halaman berita acara dapat diakses dan merender dengan sukses', function () {
    $response = $this->get(route('berita-acara'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('berita-acara')
        ->has('beritaSection')
    );
});

test('halaman detail berita acara dapat diakses dan merender dengan sukses', function () {
    $response = $this->get(route('berita-acara.detail'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('berita-acara/detail')
    );
});

test('berita qurban dan penyembelihan tidak tampil pada halaman berita acara', function () {
    $response = $this->get(route('berita-acara'));

    $response->assertOk();
    $response->assertDontSee('Penyembelihan dan Distribusi Hewan Qurban');
    $response->assertDontSee('news-1.jpeg');
});
