<?php

// app/Http/Controllers/Admin/PanelAdminGaleriController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GaleriFotoSection;
use App\Models\HeroSectionGaleri;
use App\Models\Notification;
use Illuminate\Http\Request;

class PanelAdminGaleriController extends Controller
{
    /**
     * Simpan / perbarui hero section halaman Galeri.
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

                $path = $file->store('hero-galeri-carousel', 'public');
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

        HeroSectionGaleri::updateOrCreate(
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
            "{$currentUser->name} memperbarui konten Hero Halaman Galeri."
        );

        return redirect()->back()->with('success', 'Hero Galeri updated successfully.');
    }

    /**
     * Simpan / perbarui galeri foto halaman Galeri.
     */
    public function updateGaleriFoto(Request $request)
    {
        $validated = $request->validate([
            'section_title' => 'required|string|max:255',
            'categories' => 'required|array',
            'items' => 'present|array',
        ]);

        $currentUser = $request->user();
        $items = $validated['items'];

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

                $path = $file->store('galeri-foto', 'public');
                $item['imageSrc'] = '/storage/'.$path;
            }

            // Sanitasi & hapus temporary fields
            unset($item['file'], $item['imagePreviewUrl']);

            $item['id'] = strip_tags($item['id'] ?? '');
            $item['title'] = strip_tags($item['title'] ?? '');
            $item['category'] = strip_tags($item['category'] ?? '');
            $item['location'] = strip_tags($item['location'] ?? '');
            $item['imageSrc'] = strip_tags($item['imageSrc'] ?? '');
            $item['imageSourceType'] = strip_tags($item['imageSourceType'] ?? 'url');
            if (isset($item['imageFileName'])) {
                $item['imageFileName'] = strip_tags($item['imageFileName']);
            }
        }
        unset($item);

        GaleriFotoSection::updateOrCreate(
            [],
            [
                'section_title' => strip_tags($validated['section_title']),
                'categories' => $validated['categories'],
                'items' => $items,
            ]
        );

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui konten Galeri Foto Halaman Galeri."
        );

        return redirect()->back()->with('success', 'Galeri Foto updated successfully.');
    }
}
