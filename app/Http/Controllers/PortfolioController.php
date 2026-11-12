<?php

namespace App\Http\Controllers;

use App\Models\DaftarPortfolioSection;
use App\Models\HeroSectionPortfolio;
use App\Models\PortfolioSectionBeranda;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(): Response
    {
        // ── Hero Section (multi-tenant, digabung) ─────────────────────────────
        $allHeroRecords = HeroSectionPortfolio::with('user.role')->get();

        $masterHero = $allHeroRecords
            ->first(fn ($r) => $r->user?->role?->name === 'super_admin')
            ?? $allHeroRecords->first();

        $mergedCarouselItems = $allHeroRecords
            ->flatMap(fn ($r) => collect($r->carousel_items ?? []))
            ->values()
            ->all();

        $heroSection = $masterHero
            ? array_merge($masterHero->toArray(), ['carousel_items' => $mergedCarouselItems])
            : null;

        // ── Daftar Portfolio (single record) ─────────────────────────────────
        $daftarPortfolioSection = DaftarPortfolioSection::firstOrCreate(
            ['id' => 1],
            [
                'section_title' => 'Portfolio PEB',
                'categories' => ['gas', 'solar', 'operations', 'power'],
                'items' => [
                    ['id' => '1', 'title' => 'Batam-Pemping Pipeline Expansion', 'category' => 'gas', 'badge' => 'GAS INFRASTRUCTURE', 'date' => '2023', 'description' => 'Peningkatan kapasitas distribusi gas bumi untuk memenuhi kebutuhan industri strategis.', 'imageSrc' => '/assets/beranda/portfolio/project-1.png', 'client' => 'PT Pelayanan Energi Batam', 'location' => 'Jalur Pemping - Batam', 'efficiency' => 'Efisiensi Aliran 99.8%', 'imageSourceType' => 'url'],
                    ['id' => '2', 'title' => 'Sekupang Solar Farm Phase II', 'category' => 'solar', 'badge' => 'SOLAR ENERGY', 'date' => '2024', 'description' => 'Pengembangan energi surya terintegrasi dengan kapasitas 10MWp.', 'imageSrc' => '/assets/beranda/portfolio/2.png', 'client' => 'Batam Green Initiative', 'location' => 'Kawasan Sekupang, Batam', 'efficiency' => 'Reduksi Karbon 12,000 Ton/Thn', 'imageSourceType' => 'url'],
                    ['id' => '3', 'title' => 'Integrated Monitoring System', 'category' => 'operations', 'badge' => 'OPERATIONS', 'date' => 'Ongoing', 'description' => 'Implementasi pusat monitoring digital berbasis SCADA terpusat.', 'imageSrc' => '/assets/beranda/portfolio/project-3.png', 'client' => 'PT Pelayanan Energi Batam', 'location' => 'Control Center, Batam Center', 'efficiency' => 'Uptime Sistem SCADA 99.99%', 'imageSourceType' => 'url'],
                    ['id' => '4', 'title' => 'Panbil Gas-Fired Station', 'category' => 'power', 'badge' => 'POWER PLANT', 'date' => '2022', 'description' => 'Optimalisasi pembangkit listrik tenaga gas bumi yang bersih dan efisien.', 'imageSrc' => '/assets/pengadaan/items/item4.png', 'client' => 'Kawasan Industri Panbil', 'location' => 'Panbil Industrial Estate, Batam', 'efficiency' => 'Kapasitas Output 50 MW', 'imageSourceType' => 'url'],
                ],
            ]
        );

        $seoMeta = SeoMeta::where('page_type', 'portfolio')->first();

        return Inertia::render('portfolio', [
            'heroSection' => $heroSection,
            'daftarPortfolioSection' => $daftarPortfolioSection,
            'seoMeta' => $seoMeta,
        ]);
    }
}
