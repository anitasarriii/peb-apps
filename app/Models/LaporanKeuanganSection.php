<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanKeuanganSection extends Model
{
    protected $table = 'laporan_keuangan_sections';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['section_title', 'section_desc', 'items'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'items' => 'array',
        ];
    }
}
