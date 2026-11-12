<?php

namespace App\Http\Controllers;

use App\Models\HeroSectionKebijakan;
use App\Models\KebijakanPebSection;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KebijakanController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Multi-tenant Hero Kebijakan ─────────────────────────────────────────
        // Ambil semua record hero kebijakan dari semua tenant (admin user).
        // • Teks utama (title, subtitle, badge_label) diambil dari milik super_admin.
        //   Jika belum ada, fallback ke record pertama yang ditemukan.
        // • Carousel slide digabung dari seluruh tenant menjadi satu daftar.
        $allHeroRecords = HeroSectionKebijakan::with('user.role')->get();

        // Cari master hero: milik super_admin, atau fallback ke record pertama
        $masterHero = $allHeroRecords
            ->first(fn($r) => $r->user?->role?->name === 'super_admin')
            ?? $allHeroRecords->first();

        // Gabungkan semua carousel_items dari setiap tenant menjadi satu flat array
        $mergedCarouselItems = $allHeroRecords
            ->flatMap(fn($r) => collect($r->carousel_items ?? []))
            ->values()
            ->all();

        // Bangun object hero gabungan yang akan dikirim ke frontend
        $heroSection = $masterHero
            ? array_merge($masterHero->toArray(), ['carousel_items' => $mergedCarouselItems])
            : null;

        $seoMeta = SeoMeta::where('page_type', 'kebijakan')->first();

        $kebijakanPebSection = KebijakanPebSection::first();

        return Inertia::render('kebijakan', [
            'heroSection' => $heroSection,
            'seoMeta' => $seoMeta,
            'kebijakanPebSection' => $kebijakanPebSection,
        ]);
    }
}
