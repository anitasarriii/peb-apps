<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabel ini menyimpan judul section dan daftar kartu kebijakan PEB
     * dalam satu record singleton (firstOrCreate / updateOrCreate tanpa user_id).
     */
    public function up(): void
    {
        Schema::create('kebijakan_peb_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Kebijakan PEB');

            // JSON: array of { id, title, subtitle, description, signedBy, role, date }
            $table->json('cards');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kebijakan_peb_sections');
    }
};
