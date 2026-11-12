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
        Schema::create('seo_metas', function (Blueprint $table) {
            $table->id();
            $table->string('page_type')->unique();
            $table->string('meta_title');
            $table->text('meta_description');
            $table->string('meta_keywords')->nullable();
            $table->string('author')->nullable();
            $table->string('robots_index')->default('index');
            $table->string('robots_follow')->default('follow');
            $table->string('og_title');
            $table->text('og_description');
            $table->string('og_image', 2048)->nullable();
            $table->string('image_source_type')->default('url');
            $table->string('image_file_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_metas');
    }
};
