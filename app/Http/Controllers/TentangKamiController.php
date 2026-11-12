<?php

namespace App\Http\Controllers;

use App\Models\HeroSectionTentang;
use App\Models\PartnerSectionTentang;
use App\Models\ProfilSectionTentang;
use App\Models\QuoteSectionTentang;
use App\Models\SeoMeta;
use App\Models\TimSectionTentang;
use App\Models\VisiMisiSectionTentang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TentangKamiController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Multi-tenant Hero Tentang Kami ────────────────────────────────────
        // Ambil semua record hero dari semua tenant (admin user).
        // • Teks utama (title, subtitle, badge_label) diambil dari milik super_admin.
        //   Jika belum ada, fallback ke record pertama yang ditemukan.
        // • Carousel slide digabung dari seluruh tenant menjadi satu daftar.
        $allHeroRecords = HeroSectionTentang::with('user.role')->get();

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

        // Ambil konfigurasi SEO halaman tentang-kami jika ada
        $seoMeta = SeoMeta::where('page_type', 'tentang-kami')->first();

        // Ambil data profil perusahaan
        $profilSection = ProfilSectionTentang::first();

        // Ambil data tim perusahaan
        $timSection = TimSectionTentang::first();

        // Ambil data visi misi perusahaan
        $visiMisiSection = VisiMisiSectionTentang::first();

        // Ambil data quote perusahaan
        $quoteSection = QuoteSectionTentang::first();

        // Ambil data partner perusahaan
        $partnerSection = PartnerSectionTentang::first();

        return Inertia::render('tentang-kami', [
            'heroSection' => $heroSection,
            'seoMeta' => $seoMeta,
            'profilSection' => $profilSection,
            'timSection' => $timSection,
            'visiMisiSection' => $visiMisiSection,
            'quoteSection' => $quoteSection,
            'partnerSection' => $partnerSection,
        ]);
    }
}
