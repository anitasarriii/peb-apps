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
        Schema::create('headers', function (Blueprint $table) {
            $table->id();
            $table->string('logo_kiri_src')->default('/assets/logo/danantara-logo.svg');
            $table->string('logo_kiri_source_type')->default('url'); // 'url' or 'upload'
            $table->string('logo_kiri_file_name')->nullable();
            $table->string('logo_kanan_src')->default('/assets/logo/logo.png');
            $table->string('logo_kanan_source_type')->default('url'); // 'url' or 'upload'
            $table->string('logo_kanan_file_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('headers');
    }
};
