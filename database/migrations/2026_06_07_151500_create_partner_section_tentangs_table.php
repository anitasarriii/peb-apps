<?php

// database/migrations/2026_06_07_151500_create_partner_section_tentangs_table.php

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
        Schema::create('partner_section_tentangs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->json('partners');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_section_tentangs');
    }
};
