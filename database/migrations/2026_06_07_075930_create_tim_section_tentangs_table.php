<?php

// database/migrations/2026_06_07_075930_create_tim_section_tentangs_table.php

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
        Schema::create('tim_section_tentangs', function (Blueprint $table) {
            $table->id();

            // Konten section
            $table->string('title')->default('Tim Kepemimpinan');
            $table->text('subtitle')->nullable();

            // Daftar anggota tim (JSON)
            $table->json('members')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tim_section_tentangs');
    }
};
