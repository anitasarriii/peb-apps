<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('halaman kontak dapat diakses dan merender dengan sukses', function () {
    $response = $this->get(route('kontak'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('kontak'));
});

test('pengguna dapat mengirim pesan melalui formulir kontak', function () {
    $messageData = [
        'name' => 'John Doe',
        'email' => 'johndoe@example.com',
        'subject' => 'Kerja Sama Bisnis',
        'message' => 'Halo, saya tertarik dengan layanan Anda.',
    ];

    $response = $this->post(route('kontak.store'), $messageData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Pastikan data tersimpan di database
    $this->assertDatabaseHas('contact_messages', $messageData);

    // Pastikan notifikasi tercatat di sistem
    $this->assertDatabaseHas('notifications', [
        'type' => 'info',
        'title' => 'Pesan Kontak Baru',
    ]);
});

test('pengiriman pesan kontak divalidasi dengan benar', function () {
    $response = $this->post(route('kontak.store'), [
        'name' => '',
        'email' => 'bukan-email',
        'subject' => '',
        'message' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    $this->assertDatabaseCount('contact_messages', 0);
});
