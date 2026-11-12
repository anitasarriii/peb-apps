<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeroSectionLaporan extends Model
{
    use HasFactory;

    protected $table = 'hero_section_laporans';

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
     * Get the user (tenant) yang memiliki hero section laporan ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
