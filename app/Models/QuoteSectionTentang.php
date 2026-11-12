<?php

// app/Models/QuoteSectionTentang.php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'quote_text',
    'description',
    'button_label',
    'button_href',
])]
class QuoteSectionTentang extends Model
{
    protected $table = 'quote_section_tentangs';
}
