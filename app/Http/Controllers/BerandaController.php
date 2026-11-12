<?php

namespace App\Http\Controllers;

use App\Models\AboutSectionBeranda;
use App\Models\BeritaSection;
use App\Models\DaftarPortfolioSection;
use App\Models\HeroSectionBeranda;
use App\Models\LayananSectionBeranda;
use App\Models\PartnerSectionBeranda;
use App\Models\PortfolioSectionBeranda;
use App\Models\SeoMeta;
use App\Models\StatistikSectionBeranda;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BerandaController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Hero Beranda ──────────────────────────────────────────────────────
        // Ambil record hero dari database (utamakan super_admin atau record pertama).
        $allHeroRecords = HeroSectionBeranda::with('user.role')->get();

        $masterHero = $allHeroRecords
            ->first(fn ($r) => $r->user?->role?->name === 'super_admin')
            ?? $allHeroRecords->first();

        $heroSection = $masterHero ? $masterHero->toArray() : null;

        $aboutSection = AboutSectionBeranda::first();
        $layananSection = LayananSectionBeranda::first();
        $statistikSection = StatistikSectionBeranda::first();
        $partnerSection = PartnerSectionBeranda::first();
        $portfolioSection = PortfolioSectionBeranda::first();
        $beritaSection = BeritaSection::first();

        $seoMeta = SeoMeta::where('page_type', 'beranda')->first();

        return Inertia::render('beranda', [
            'heroSection' => $heroSection,
            'aboutSection' => $aboutSection,
            'layananSection' => $layananSection,
            'statistikSection' => $statistikSection,
            'partnerSection' => $partnerSection,
            'portfolioSection' => $portfolioSection,
            'daftarPortfolioSection' => DaftarPortfolioSection::first(),
            'beritaSection' => $beritaSection,
            'seoMeta' => $seoMeta,
        ]);
    }
}
