<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoMeta extends Model
{
    protected $table = 'seo_metas';

    protected $fillable = [
        'page_type',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'author',
        'robots_index',
        'robots_follow',
        'og_title',
        'og_description',
        'og_image',
        'image_source_type',
        'image_file_name',
    ];
}
