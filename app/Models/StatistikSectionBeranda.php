<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['background_src', 'bg_source', 'bg_file_name', 'stats'])]
class StatistikSectionBeranda extends Model
{
    protected $table = 'statistik_section_berandas';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stats' => 'array',
        ];
    }
}
