<?php

// database/migrations/2026_06_07_140600_create_profil_section_tentangs_table.php

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
        Schema::create('profil_section_tentangs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('image_src');
            $table->string('image_source_type')->default('url');
            $table->string('image_file_name')->nullable();
            $table->string('experience_years');
            $table->string('experience_label');
            $table->string('maps_label');
            $table->string('maps_value');
            $table->string('maps_mode')->default('koordinat');
            $table->string('maps_koordinat')->nullable();
            $table->text('maps_embed_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_section_tentangs');
    }
};
