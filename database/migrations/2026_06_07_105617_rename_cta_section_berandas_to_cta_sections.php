<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rename tabel dari `cta_section_berandas` (nama lama, terikat beranda)
     * ke `cta_sections` (nama universal, karena CTA kini bersifat global/independen).
     */
    public function up(): void
    {
        Schema::rename('cta_section_berandas', 'cta_sections');
    }

    /**
     * Kembalikan rename jika rollback.
     */
    public function down(): void
    {
        Schema::rename('cta_sections', 'cta_section_berandas');
    }
};
