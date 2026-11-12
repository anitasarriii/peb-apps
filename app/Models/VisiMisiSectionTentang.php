<?php

// app/Models/VisiMisiSectionTentang.php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'visi_label',
    'visi_text',
    'stats',
    'misi_title',
    'misi_subtitle',
    'misi_items',
])]
class VisiMisiSectionTentang extends Model
{
    protected $table = 'visi_misi_section_tentangs';

    /**
     * Casting kolom JSON ke array PHP secara otomatis.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stats' => 'array',
        'misi_items' => 'array',
    ];
}
