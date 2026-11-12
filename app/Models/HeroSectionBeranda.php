<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'title', 'subtitle', 'cta_label', 'cta_href', 'secondary_cta_label', 'secondary_cta_href', 'carousel_items'])]
class HeroSectionBeranda extends Model
{
    protected $table = 'hero_section_berandas';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'carousel_items' => 'array',
        ];
    }

    /**
     * Get the user that owns the hero section.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
