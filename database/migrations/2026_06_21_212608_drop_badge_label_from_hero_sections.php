<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The tables that contain the badge_label column.
     */
    protected $tables = [
        'hero_section_tentangs',
        'hero_section_servis',
        'hero_section_kebijakans',
        'hero_section_galeris',
        'hero_section_laporans',
        'hero_section_pengadaans',
        'hero_section_portfolios',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->tables as $table) {
            if (Schema::hasColumn($table, 'badge_label')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->dropColumn('badge_label');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hero_sections', function (Blueprint $table) {
            //
        });
    }
};
