<?php

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
        Schema::create('laporan_tahunan_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_title');
            $table->string('section_desc');
            $table->json('annual_reports');
            $table->json('keberlanjutan_items');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_tahunan_sections');
    }
};
