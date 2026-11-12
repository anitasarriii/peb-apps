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
        Schema::create('portfolio_section_berandas', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Portfolio Proyek');
            $table->text('description')->nullable();
            $table->string('cta_label')->default("Let's work together");
            $table->json('projects')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_section_berandas');
    }
};
