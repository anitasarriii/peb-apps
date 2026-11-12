<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'description', 'cta_label', 'projects'])]
class PortfolioSectionBeranda extends Model
{
    protected $table = 'portfolio_section_berandas';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'projects' => 'array',
        ];
    }
}
