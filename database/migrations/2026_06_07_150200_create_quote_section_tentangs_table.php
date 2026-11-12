<?php

// database/migrations/2026_06_07_150200_create_quote_section_tentangs_table.php

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
        Schema::create('quote_section_tentangs', function (Blueprint $table) {
            $table->id();
            $table->string('quote_text');
            $table->text('description');
            $table->string('button_label');
            $table->string('button_href');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_section_tentangs');
    }
};
