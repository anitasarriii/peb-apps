<?php

namespace App\Http\Controllers;

use App\Models\HeroSectionLaporan;
use App\Models\LaporanKeuanganSection;
use App\Models\LaporanTahunanSection;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Multi-tenant Hero Laporan ──────────────────────────────────────────
        // Ambil semua record hero laporan dari semua tenant (admin user).
        // • Teks utama (title, subtitle, badge_label) diambil dari milik super_admin.
        //   Jika belum ada, fallback ke record pertama yang ditemukan.
        // • Carousel slide digabung dari seluruh tenant menjadi satu daftar.
        $allHeroRecords = HeroSectionLaporan::with('user.role')->get();

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

        // Ambil konfigurasi SEO halaman laporan jika ada
        $seoMeta = SeoMeta::where('page_type', 'laporan')->first();

        $laporanKeuanganSection = LaporanKeuanganSection::first();
        $laporanTahunanSection = LaporanTahunanSection::first();

        return Inertia::render('laporan', [
            'heroSection' => $heroSection,
            'laporanKeuanganSection' => $laporanKeuanganSection,
            'laporanTahunanSection' => $laporanTahunanSection,
            'seoMeta' => $seoMeta,
        ]);
    }

    public function detail(Request $request): Response
    {
        $id = $request->query('id');
        $type = $request->query('type', 'keuangan');

        $laporanKeuanganSection = LaporanKeuanganSection::first();
        $laporanTahunanSection = LaporanTahunanSection::first();

        $item = null;
        if ($type === 'annual') {
            if ($laporanTahunanSection && $laporanTahunanSection->annual_reports) {
                $itemsCollect = collect($laporanTahunanSection->annual_reports);
                if ($id) {
                    $item = $itemsCollect->firstWhere('id', $id);
                }
            }
            if (! $item && $laporanTahunanSection && ! empty($laporanTahunanSection->annual_reports)) {
                $item = $laporanTahunanSection->annual_reports[0];
            }
        } elseif ($type === 'keberlanjutan') {
            if ($laporanTahunanSection && $laporanTahunanSection->keberlanjutan_items) {
                $itemsCollect = collect($laporanTahunanSection->keberlanjutan_items);
                if ($id) {
                    $item = $itemsCollect->firstWhere('id', $id);
                }
            }
            if (! $item && $laporanTahunanSection && ! empty($laporanTahunanSection->keberlanjutan_items)) {
                $item = $laporanTahunanSection->keberlanjutan_items[0];
            }
        } else {
            if ($laporanKeuanganSection && $laporanKeuanganSection->items) {
                $itemsCollect = collect($laporanKeuanganSection->items);
                if ($id) {
                    $item = $itemsCollect->firstWhere('id', $id);
                }
            }
            if (! $item && $laporanKeuanganSection && ! empty($laporanKeuanganSection->items)) {
                $item = $laporanKeuanganSection->items[0];
            }
        }

        $allHeroRecords = HeroSectionLaporan::with('user.role')->get();

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

        return Inertia::render('laporan/detail', [
            'item' => $item,
            'type' => $type,
            'laporanKeuanganSection' => $laporanKeuanganSection,
            'laporanTahunanSection' => $laporanTahunanSection,
            'heroSection' => $heroSection,
        ]);
    }
}
