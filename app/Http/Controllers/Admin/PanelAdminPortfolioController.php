<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DaftarPortfolioSection;
use App\Models\HeroSectionPortfolio;
use App\Models\Notification;
use Illuminate\Http\Request;

class PanelAdminPortfolioController extends Controller
{
    /**
     * Simpan / perbarui hero section halaman Portfolio.
     *
     * Logika multi-tenant:
     * - Admin biasa hanya bisa menyimpan datanya sendiri.
     * - Super Admin dapat menyimpan atas nama admin lain via field user_id.
     */
    public function updateHero(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'carousel_items' => 'required|array',
            'user_id' => 'nullable|integer|exists:users,id',
        ], [
            'title.required' => 'Judul utama wajib diisi.',
            'title.max' => 'Judul utama tidak boleh melebihi 255 karakter.',
            'subtitle.required' => 'Sub-judul / deskripsi wajib diisi.',
            'carousel_items.required' => 'Slide media latar belakang wajib diisi.',
            'carousel_items.array' => 'Format data slide media latar belakang tidak valid.',
        ]);

        $currentUser = $request->user();

        // Super Admin dapat menyimpan atas nama user lain
        $targetUserId = $currentUser->id;
        if (
            isset($validated['user_id'])
            && $currentUser->role
            && $currentUser->role->name === 'super_admin'
        ) {
            $targetUserId = $validated['user_id'];
        }

        $carouselItems = $validated['carousel_items'];

        // Proses file upload per slide (jika sourceType == 'upload')
        foreach ($carouselItems as $index => &$item) {
            if (
                ($item['sourceType'] ?? '') === 'upload'
                && $request->hasFile("carousel_items.{$index}.file")
            ) {
                $file = $request->file("carousel_items.{$index}.file");
                $type = $item['type'] ?? 'image';

                if ($type === 'video') {
                    $request->validate([
                        "carousel_items.{$index}.file" => 'required|extensions:mp4,webm,ogg,mov|max:512000',
                    ], [
                        "carousel_items.{$index}.file.required" => 'File video wajib diunggah.',
                        "carousel_items.{$index}.file.extensions" => 'Format berkas video harus berupa mp4, webm, ogg, atau mov.',
                        "carousel_items.{$index}.file.max" => 'Ukuran berkas video tidak boleh melebihi 500 MB.',
                    ]);
                } else {
                    $request->validate([
                        "carousel_items.{$index}.file" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
                    ], [
                        "carousel_items.{$index}.file.required" => 'File gambar wajib diunggah.',
                        "carousel_items.{$index}.file.extensions" => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                        "carousel_items.{$index}.file.max" => 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
                    ]);
                }

                $path = $file->store('hero-portfolio-carousel', 'public');
                $item['url'] = '/storage/'.$path;
            }

            // Sanitasi & hapus field sementara agar tidak tersimpan ke DB
            unset($item['file'], $item['previewUrl']);

            $item['id'] = strip_tags($item['id'] ?? '');
            $item['type'] = strip_tags($item['type'] ?? 'image');
            $item['sourceType'] = strip_tags($item['sourceType'] ?? 'url');
            $item['url'] = strip_tags($item['url'] ?? '');
            if (isset($item['fileName'])) {
                $item['fileName'] = strip_tags($item['fileName']);
            }
            if (isset($item['positionX'])) {
                $item['positionX'] = (float) $item['positionX'];
            }
            if (isset($item['positionY'])) {
                $item['positionY'] = (float) $item['positionY'];
            }
            if (isset($item['scale'])) {
                $item['scale'] = (float) $item['scale'];
            }
        }
        unset($item); // putuskan referensi foreach

        HeroSectionPortfolio::updateOrCreate(
            ['user_id' => $targetUserId],
            [
                'title' => strip_tags($validated['title']),
                'subtitle' => strip_tags($validated['subtitle']),
                'carousel_items' => $carouselItems,
            ]
        );

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui konten Hero Halaman Portofolio."
        );

        return redirect()->back()->with('success', 'Hero Portfolio updated successfully.');
    }

    /**
     * Simpan / perbarui daftar proyek portfolio.
     */
    public function updateDaftarPortfolio(Request $request)
    {
        $request->validate([
            'section_title' => 'required|string|max:255',
            'categories' => 'required|array',
            'items' => 'present|array',
        ], [
            'section_title.required' => 'Judul section wajib diisi.',
            'categories.required' => 'Daftar kategori wajib diisi.',
            'items.required' => 'Daftar proyek wajib diisi.',
        ]);

        $currentUser = $request->user();
        $items = $request->input('items', []);

        // Proses file upload per item (jika imageSourceType == 'upload')
        foreach ($items as $index => &$item) {
            if (
                ($item['imageSourceType'] ?? '') === 'upload'
                && $request->hasFile("items.{$index}.file")
            ) {
                $request->validate([
                    "items.{$index}.file" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
                ], [
                    "items.{$index}.file.extensions" => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                    "items.{$index}.file.max" => 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
                ]);

                $path = $request->file("items.{$index}.file")->store('daftar-portfolio-items', 'public');
                $item['imageSrc'] = '/storage/'.$path;
            }

            // Sanitasi & hapus field sementara
            unset($item['file'], $item['imagePreviewUrl'], $item['uploadingImage']);

            $item['id'] = strip_tags($item['id'] ?? '');
            $item['title'] = strip_tags($item['title'] ?? '');
            $item['category'] = strip_tags($item['category'] ?? '');
            $item['badge'] = strip_tags($item['badge'] ?? '');
            $item['date'] = strip_tags($item['date'] ?? '');
            $item['description'] = strip_tags($item['description'] ?? '');
            $item['imageSrc'] = strip_tags($item['imageSrc'] ?? '');
            $item['client'] = strip_tags($item['client'] ?? '');
            $item['location'] = strip_tags($item['location'] ?? '');
            $item['efficiency'] = strip_tags($item['efficiency'] ?? '');
            if (isset($item['imageFileName'])) {
                $item['imageFileName'] = strip_tags($item['imageFileName']);
            }
            if (isset($item['imageSourceType'])) {
                $item['imageSourceType'] = strip_tags($item['imageSourceType']);
            }
        }
        unset($item);

        DaftarPortfolioSection::updateOrCreate(
            ['id' => 1],
            [
                'section_title' => strip_tags($request->input('section_title')),
                'categories' => $request->input('categories'),
                'items' => $items,
            ]
        );

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui Daftar Portfolio."
        );

        return redirect()->back()->with('success', 'Daftar Portfolio updated successfully.');
    }
}
