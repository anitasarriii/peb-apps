<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanTahunanSection extends Model
{
    protected $table = 'laporan_tahunan_sections';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'section_title',
        'section_desc',
        'annual_reports',
        'keberlanjutan_items',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'annual_reports' => 'array',
            'keberlanjutan_items' => 'array',
        ];
    }
}
