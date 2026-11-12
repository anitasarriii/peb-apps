<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Model CTA Section global.
 *
 * Sebelumnya bernama CtaSectionBeranda dan terikat pada halaman beranda.
 * Setelah refactor, CTA bersifat independen/global sehingga nama model dan
 * tabel diperbarui menjadi lebih generik.
 */
#[Fillable(['text', 'button_label', 'button_href', 'bg_source', 'background_src', 'bg_file_name'])]
class CtaSection extends Model
{
    protected $table = 'cta_sections';
}
