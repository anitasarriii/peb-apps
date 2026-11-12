<?php

// database/migrations/2026_06_07_074553_create_visi_misi_section_tentangs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visi_misi_section_tentangs', function (Blueprint $table) {
            $table->id();

            // Visi
            $table->string('visi_label')->default('VISI PERUSAHAAN');
            $table->text('visi_text');

            // Statistik pendukung (disimpan sebagai JSON — 2 item)
            $table->json('stats')->nullable();

            // Misi
            $table->string('misi_title')->default('Misi Kami');
            $table->string('misi_subtitle')->nullable();

            // Daftar item misi (disimpan sebagai JSON)
            $table->json('misi_items')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visi_misi_section_tentangs');
    }
};
