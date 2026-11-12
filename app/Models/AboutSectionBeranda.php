<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'subtitle', 'slogan_text', 'media_type', 'media_source_type', 'media_url', 'media_file_name', 'efisiensi', 'inovatif'])]
class AboutSectionBeranda extends Model
{
    protected $table = 'about_section_berandas';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'efisiensi' => 'array',
            'inovatif' => 'array',
        ];
    }
}
