<?php

test('halaman galeri dapat diakses dan merender dengan sukses', function () {
    $response = $this->get(route('galeri'));

    $response->assertOk();
});
