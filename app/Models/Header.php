<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Header extends Model
{
    use HasFactory;

    protected $table = 'headers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'logo_kiri_src',
        'logo_kiri_source_type',
        'logo_kiri_file_name',
        'logo_kanan_src',
        'logo_kanan_source_type',
        'logo_kanan_file_name',
    ];
}
