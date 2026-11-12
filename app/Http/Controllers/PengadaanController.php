<?php

namespace App\Http\Controllers;

use App\Models\DaftarPengadaan;
use App\Models\HeroSectionPengadaan;
use App\Models\SeoMeta;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PengadaanController extends Controller
{
    public function index(Request $request): Response
    {
        // ── Multi-tenant Hero Pengadaan ────────────────────────────────────────
        // Ambil semua record hero pengadaan dari semua tenant (admin user).
        // • Teks utama (title, subtitle) diambil dari milik super_admin.
        //   Jika belum ada, fallback ke record pertama yang ditemukan.
        // • Carousel slide hanya diambil dari master hero (super_admin atau record pertama).
        $allHeroRecords = HeroSectionPengadaan::with('user.role')->get();

        // Cari master hero: milik super_admin, atau fallback ke record pertama
        $masterHero = $allHeroRecords
            ->first(fn ($r) => $r->user?->role?->name === 'super_admin')
            ?? $allHeroRecords->first();

        // Bangun object hero yang akan dikirim ke frontend
        // Gunakan carousel_items hanya dari master hero (jangan merge dari tenant lain)
        $heroSection = $masterHero
            ? $masterHero->toArray()
            : null;

        // Ambil data Daftar Pengadaan global
        $daftarPengadaan = DaftarPengadaan::first();
        if ($daftarPengadaan && is_array($daftarPengadaan->items)) {
            $daftarPengadaan->items = collect($daftarPengadaan->items)
                ->filter(fn ($item) => ($item['status'] ?? null) === 'TERBUKA' || ($item['isArchived'] ?? false) === true)
                ->values()
                ->all();
        }

        // Ambil konfigurasi SEO halaman pengadaan jika ada
        $seoMeta = SeoMeta::where('page_type', 'pengadaan')->first();

        return Inertia::render('pengadaan', [
            'heroSection' => $heroSection,
            'daftarPengadaan' => $daftarPengadaan,
            'seoMeta' => $seoMeta,
        ]);
    }

    public function detail(Request $request): Response
    {
        $query = $request->validate([
            'nama' => ['sometimes', 'nullable', 'string'],
            'id' => ['sometimes', 'nullable', 'string'],
        ]);
        $nama = trim($query['nama'] ?? '');
        $id = $query['id'] ?? '';
        $daftarPengadaan = DaftarPengadaan::first();

        $item = null;
        if ($daftarPengadaan && $daftarPengadaan->items) {
            $itemsCollect = collect($daftarPengadaan->items);

            if ($id !== '') {
                $item = $itemsCollect->first(fn (array $candidate): bool => (string) ($candidate['id'] ?? '') === $id);
            } elseif ($nama !== '') {
                // Cari berdasarkan nama asli (case-insensitive) atau slug
                $item = $itemsCollect->first(function ($item) use ($nama) {
                    $itemTitle = trim($item['title'] ?? '');

                    return strtolower($itemTitle) === strtolower(trim($nama))
                        || Str::slug($itemTitle) === Str::slug($nama);
                });
            }

        }

        abort_if($item === null, 404);

        return Inertia::render('pengadaan/detail', [
            'item' => $item,
            'daftarPengadaan' => $daftarPengadaan,
        ]);
    }
}
