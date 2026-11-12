<?php

namespace App\Http\Controllers;

use App\Models\BeritaSection;
use App\Models\HeroSectionBerita;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeritaAcaraController extends Controller
{
    public function index(): Response
    {
        $heroSection = HeroSectionBerita::first();
        $beritaSection = BeritaSection::first();
        $seoMeta = SeoMeta::where('page_type', 'berita')->first();

        return Inertia::render('berita-acara', [
            'heroSection' => $heroSection,
            'beritaSection' => $beritaSection,
            'seoMeta' => $seoMeta,
        ]);
    }

    public function detail(Request $request): Response
    {
        $id = $request->query('id');
        $beritaSection = BeritaSection::first();
        $heroSection = HeroSectionBerita::first();

        $item = null;
        if ($beritaSection && $beritaSection->items) {
            $itemsCollect = collect($beritaSection->items);
            if ($id) {
                $item = $itemsCollect->firstWhere('id', $id);
            }
        }

        if (! $item && $beritaSection && ! empty($beritaSection->items)) {
            $item = $beritaSection->items[0];
        }

        return Inertia::render('berita-acara/detail', [
            'berita' => $item,
            'heroSection' => $heroSection,
            'beritaSection' => $beritaSection,
        ]);
    }
}
