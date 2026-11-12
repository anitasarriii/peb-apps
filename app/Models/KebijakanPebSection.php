<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KebijakanPebSection extends Model
{
    use HasFactory;

    protected $table = 'kebijakan_peb_sections';

    /**
     * @var array<int, string>
     */
    protected $fillable = ['title', 'cards'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cards' => 'array',
        ];
    }
}
