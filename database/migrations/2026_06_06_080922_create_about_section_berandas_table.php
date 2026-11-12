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
        Schema::create('about_section_berandas', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle');
            $table->text('slogan_text')->nullable();
            $table->string('media_type')->default('image');
            $table->string('media_source_type')->default('url');
            $table->string('media_url')->nullable();
            $table->string('media_file_name')->nullable();
            $table->json('efisiensi')->nullable();
            $table->json('inovatif')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_section_berandas');
    }
};
