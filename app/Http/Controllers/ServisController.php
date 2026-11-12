<?php

// app/Http/Controllers/ServisController.php

namespace App\Http\Controllers;

use App\Models\DaftarServisSection;
use App\Models\HeroSectionServis;
use App\Models\HeroSectionServisDetail;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServisController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Multi-tenant Hero Servis ──────────────────────────────────────────
        // Ambil semua record hero servis dari semua tenant (admin user).
        // • Teks utama (title, subtitle, badge_label) diambil dari milik super_admin.
        //   Jika belum ada, fallback ke record pertama yang ditemukan.
        // • Carousel slide digabung dari seluruh tenant menjadi satu daftar.
        $allHeroRecords = HeroSectionServis::with('user.role')->get();

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

        // Ambil konfigurasi SEO halaman servis jika ada
        $seoMeta = SeoMeta::where('page_type', 'servis')->first();

        // Ambil data daftar servis
        $daftarServisSection = DaftarServisSection::first();

        return Inertia::render('servis', [
            'heroSection' => $heroSection,
            'seoMeta' => $seoMeta,
            'daftarServisSection' => $daftarServisSection,
        ]);
    }

    public function detail(Request $request): Response
    {
        $allHeroRecords = HeroSectionServisDetail::with('user.role')->get();

        $masterHero = $allHeroRecords
            ->first(fn ($r) => $r->user?->role?->name === 'super_admin')
            ?? $allHeroRecords->first();

        $heroSection = $masterHero ? $masterHero->toArray() : null;

        $seoMeta = SeoMeta::where('page_type', 'servis')->first();
        $daftarServisSection = DaftarServisSection::first();

        return Inertia::render('servis/detail', [
            'heroSection' => $heroSection,
            'seoMeta' => $seoMeta,
            'daftarServisSection' => $daftarServisSection,
        ]);
    }
}
