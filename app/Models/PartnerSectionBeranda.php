<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'partners'])]
class PartnerSectionBeranda extends Model
{
    protected $table = 'partner_section_berandas';

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
