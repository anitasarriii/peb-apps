<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeritaSection extends Model
{
    protected $table = 'berita_sections';

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
