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
        Schema::create('footers', function (Blueprint $table) {
            $table->id();
            $table->string('logo_src', 2048)->nullable();
            $table->string('logo_source_type', 50)->default('url');
            $table->string('logo_file_name', 255)->nullable();
            $table->text('description')->nullable();
            $table->json('socials')->nullable();
            $table->json('explore_links')->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 100)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('subscribe_heading', 255)->nullable();
            $table->text('subscribe_description')->nullable();
            $table->string('subscribe_button_label', 255)->nullable();
            $table->string('copyright_text', 255)->nullable();
            $table->string('privacy_href', 2048)->nullable();
            $table->string('tos_href', 2048)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footers');
    }
};
