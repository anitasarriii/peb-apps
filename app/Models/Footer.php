<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model Footer global untuk konfigurasi bagian footer halaman web.
 */
class Footer extends Model
{
    protected $fillable = [
        'logo_src',
        'logo_source_type',
        'logo_file_name',
        'description',
        'socials',
        'explore_links',
        'address',
        'phone',
        'email',
        'subscribe_heading',
        'subscribe_description',
        'subscribe_button_label',
        'copyright_text',
        'privacy_href',
        'tos_href',
    ];

    protected $casts = [
        'socials' => 'array',
        'explore_links' => 'array',
    ];
}
