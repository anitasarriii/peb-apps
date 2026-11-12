<?php

// app/Models/PartnerSectionTentang.php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'partners'])]
class PartnerSectionTentang extends Model
{
    protected $table = 'partner_section_tentangs';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'partners' => 'array',
        ];
    }
}
