<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeroSectionServisDetail extends Model
{
    use HasFactory;

    protected $table = 'hero_section_servis_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['user_id', 'title', 'subtitle', 'badge_label', 'carousel_items'];

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
     * Get the user that owns this hero section.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

