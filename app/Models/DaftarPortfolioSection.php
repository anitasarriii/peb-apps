<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaftarPortfolioSection extends Model
{
    protected $table = 'daftar_portfolio_sections';

    protected $fillable = ['section_title', 'categories', 'items'];

    protected function casts(): array
    {
        return [
            'categories' => 'array',
            'items' => 'array',
        ];
    }
}
