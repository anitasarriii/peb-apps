<?php

test('halaman kebijakan korporat dapat diakses dan merender dengan sukses', function () {
    $response = $this->get(route('kebijakan'));

    $response->assertOk();
});
