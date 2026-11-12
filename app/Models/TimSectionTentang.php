<?php

// app/Models/TimSectionTentang.php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title',
    'subtitle',
    'members',
])]
class TimSectionTentang extends Model
{
    protected $table = 'tim_section_tentangs';

    /**
     * JSON casting — kolom members akan otomatis encode/decode array PHP.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'members' => 'array',
    ];
}
