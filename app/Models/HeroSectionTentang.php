<?php

// app/Models/HeroSectionTentang.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeroSectionTentang extends Model
{
    protected $table = 'hero_section_tentangs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['user_id', 'title', 'subtitle', 'carousel_items'];

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
     * Get the user (situs) that owns this hero section.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
