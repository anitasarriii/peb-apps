<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('contact_messages', 'is_read')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->boolean('is_read')->default(false)->after('message');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('contact_messages', 'is_read')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->dropColumn('is_read');
            });
        }
    }
};

