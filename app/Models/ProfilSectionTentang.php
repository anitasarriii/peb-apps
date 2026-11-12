<?php

// app/Models/ProfilSectionTentang.php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title',
    'description',
    'image_src',
    'image_source_type',
    'image_file_name',
    'experience_years',
    'experience_label',
    'maps_label',
    'maps_value',
    'maps_mode',
    'maps_koordinat',
    'maps_embed_url',
])]
class ProfilSectionTentang extends Model
{
    protected $table = 'profil_section_tentangs';
}
