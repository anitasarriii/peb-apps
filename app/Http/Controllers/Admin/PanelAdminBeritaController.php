<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BeritaSection;
use App\Models\HeroSectionBerita;
use App\Models\Notification;
use Illuminate\Http\Request;

class PanelAdminBeritaController extends Controller
{
    /**
     * Simpan / perbarui hero section halaman Berita.
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

                $path = $file->store('hero-berita-carousel', 'public');
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

        HeroSectionBerita::updateOrCreate(
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
            "{$currentUser->name} memperbarui konten Hero Halaman Berita."
        );

        return redirect()->back()->with('success', 'Hero Berita updated successfully.');
    }

    /**
     * Simpan / perbarui daftar berita secara global.
     */
    public function updateDaftar(Request $request)
    {
        $validated = $request->validate([
            'section_title' => 'required|string|max:255',
            'section_desc' => 'required|string|max:255',
            'items' => 'present|array',
        ], [
            'section_title.required' => 'Judul section wajib diisi.',
            'section_title.max' => 'Judul section tidak boleh melebihi 255 karakter.',
            'section_desc.required' => 'Deskripsi section wajib diisi.',
            'section_desc.max' => 'Deskripsi section tidak boleh melebihi 255 karakter.',
            'items.required' => 'Item berita wajib diisi.',
            'items.array' => 'Format item berita tidak valid.',
        ]);

        $currentUser = $request->user();
        $items = $validated['items'];

        // Proses unggahan file gambar cover dan galeri per item berita
        foreach ($items as $index => &$item) {
            if (
                ($item['imageSourceType'] ?? '') === 'upload'
                && $request->hasFile("items.{$index}.file")
            ) {
                $file = $request->file("items.{$index}.file");

                $request->validate([
                    "items.{$index}.file" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
                ], [
                    "items.{$index}.file.required" => 'File gambar wajib diunggah.',
                    "items.{$index}.file.extensions" => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                    "items.{$index}.file.max" => 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
                ]);

                $path = $file->store('berita-images', 'public');
                $item['imageSrc'] = '/storage/'.$path;
            }

            // Bersihkan properti preview temporer cover gambar
            unset($item['file'], $item['imagePreviewUrl']);

            // Proses Galeri (jika ada)
            if (isset($item['gallery']) && is_array($item['gallery'])) {
                foreach ($item['gallery'] as $gIndex => &$gItem) {
                    if (
                        ($gItem['sourceType'] ?? '') === 'upload'
                        && $request->hasFile("items.{$index}.gallery.{$gIndex}.file")
                    ) {
                        $gFile = $request->file("items.{$index}.gallery.{$gIndex}.file");
                        $gType = $gItem['type'] ?? 'image';

                        if ($gType === 'video') {
                            $request->validate([
                                "items.{$index}.gallery.{$gIndex}.file" => 'required|extensions:mp4,webm,ogg,mov|max:512000',
                            ], [
                                "items.{$index}.gallery.{$gIndex}.file.required" => 'File video galeri wajib diunggah.',
                                "items.{$index}.gallery.{$gIndex}.file.extensions" => 'Format berkas video galeri harus berupa mp4, webm, ogg, atau mov.',
                                "items.{$index}.gallery.{$gIndex}.file.max" => 'Ukuran berkas video galeri tidak boleh melebihi 500 MB.',
                            ]);
                        } else {
                            $request->validate([
                                "items.{$index}.gallery.{$gIndex}.file" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
                            ], [
                                "items.{$index}.gallery.{$gIndex}.file.required" => 'File gambar galeri wajib diunggah.',
                                "items.{$index}.gallery.{$gIndex}.file.extensions" => 'Format berkas gambar galeri harus berupa jpeg, png, jpg, gif, atau webp.',
                                "items.{$index}.gallery.{$gIndex}.file.max" => 'Ukuran berkas gambar galeri tidak boleh melebihi 500 MB.',
                            ]);
                        }

                        $path = $gFile->store('berita-gallery', 'public');
                        $gItem['url'] = '/storage/'.$path;
                    }

                    // Bersihkan properti file & previewUrl temporer galeri
                    unset($gItem['file'], $gItem['previewUrl']);

                    // Sanitasi data galeri
                    $gItem['id'] = strip_tags($gItem['id'] ?? '');
                    $gItem['type'] = strip_tags($gItem['type'] ?? 'image');
                    $gItem['sourceType'] = strip_tags($gItem['sourceType'] ?? 'url');
                    $gItem['url'] = strip_tags($gItem['url'] ?? '');
                    if (isset($gItem['fileName'])) {
                        $gItem['fileName'] = strip_tags($gItem['fileName']);
                    }
                }
                unset($gItem);
            }

            // Sanitasi field item berita
            $item['id'] = strip_tags($item['id'] ?? '');
            $item['title'] = strip_tags($item['title'] ?? '');
            $item['subtitle'] = strip_tags($item['subtitle'] ?? '', '<b><strong><i><em><u><s><strike><del><ul><ol><li><p><br><div>');
            $item['date'] = strip_tags($item['date'] ?? '');
            if (empty($item['date'])) {
                $item['date'] = date('Y-m-d');
            }
            $item['badge'] = strip_tags($item['badge'] ?? '');
            $item['imageSrc'] = strip_tags($item['imageSrc'] ?? '');
            if (isset($item['imageFileName'])) {
                $item['imageFileName'] = strip_tags($item['imageFileName']);
            }
            if (isset($item['imageSourceType'])) {
                $item['imageSourceType'] = strip_tags($item['imageSourceType']);
            }
        }
        unset($item);

        BeritaSection::updateOrCreate(
            ['id' => 1],
            [
                'section_title' => strip_tags($validated['section_title']),
                'section_desc' => strip_tags($validated['section_desc']),
                'items' => $items,
            ]
        );

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui daftar berita."
        );

        return redirect()->back()->with('success', 'Daftar berita updated successfully.');
    }
}
