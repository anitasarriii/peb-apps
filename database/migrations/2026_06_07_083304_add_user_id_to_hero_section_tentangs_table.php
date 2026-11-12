<?php

use Illuminate\Database\Migrations\Migration;

/**
 * Migrasi ini sudah tidak diperlukan karena kolom user_id
 * telah dipindahkan langsung ke migrasi create tabel (2026_06_07_124100).
 * File ini dipertahankan agar tidak merusak riwayat migrasi yang sudah berjalan.
 */
return new class extends Migration
{
    public function up(): void
    {
        // No-op: user_id sudah ada pada migrasi create tabel awal.
        // Untuk database lama, kolom sudah ditambahkan secara manual/terpisah.
    }

    public function down(): void
    {
        // No-op
    }
};
