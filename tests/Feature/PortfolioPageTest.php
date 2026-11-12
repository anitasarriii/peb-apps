<?php

test('halaman portofolio proyek dapat diakses dan merender dengan sukses', function () {
    $response = $this->get(route('portfolio'));

    $response->assertOk();
});
