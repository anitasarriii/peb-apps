<?php

namespace App\Http\Controllers;

use App\Models\GaleriFotoSection;
use App\Models\HeroSectionGaleri;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GaleriController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Multi-tenant Hero Galeri ─────────────────────────────────────────────
        // Ambil semua record hero galeri dari semua tenant (admin user).
        // • Teks utama (title, subtitle, badge_label) diambil dari milik super_admin.
        //   Jika belum ada, fallback ke record pertama yang ditemukan.
        // • Carousel slide digabung dari seluruh tenant menjadi satu daftar.
        $allHeroRecords = HeroSectionGaleri::with('user.role')->get();

        // Cari master hero: milik super_admin, atau fallback ke record pertama
        $masterHero = $allHeroRecords
            ->first(fn ($r) => $r->user?->role?->name === 'super_admin')
            ?? $allHeroRecords->first();

        // Gabungkan semua carousel_items dari setiap tenant menjadi satu flat array
        $mergedCarouselItems = $allHeroRecords
            ->flatMap(fn ($r) => collect($r->carousel_items ?? []))
            ->values()
            ->all();

        // Bangun object hero gabungan yang akan dikirim ke frontend
        $heroSection = $masterHero
            ? array_merge($masterHero->toArray(), ['carousel_items' => $mergedCarouselItems])
            : null;

        $seoMeta = SeoMeta::where('page_type', 'galeri')->first();

        // Ambil data galeri foto dari DB (singleton record)
        $galeriFotoSection = GaleriFotoSection::first();

        return Inertia::render('galeri', [
            'heroSection' => $heroSection,
            'seoMeta' => $seoMeta,
            'galeriFotoSection' => $galeriFotoSection,
        ]);
    }
}
