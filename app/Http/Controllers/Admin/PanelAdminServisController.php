<?php

// app/Http/Controllers/Admin/PanelAdminServisController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DaftarServisSection;
use App\Models\HeroSectionServis;
use App\Models\HeroSectionServisDetail;
use App\Models\Notification;
use Illuminate\Http\Request;

class PanelAdminServisController extends Controller
{
    /**
     * Simpan / perbarui hero section halaman Servis.
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

                $path = $file->store('hero-servis-carousel', 'public');
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

        HeroSectionServis::updateOrCreate(
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
            "{$currentUser->name} memperbarui konten Hero Halaman Servis."
        );

        return redirect()->back()->with('success', 'Hero Servis updated successfully.');
    }

    /**
     * Simpan / perbarui hero section halaman Detail Servis.
     */
    public function updateHeroDetail(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'badge_label' => 'nullable|string|max:255',
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

        $targetUserId = $currentUser->id;
        if (
            isset($validated['user_id'])
            && $currentUser->role
            && $currentUser->role->name === 'super_admin'
        ) {
            $targetUserId = $validated['user_id'];
        }

        $carouselItems = $validated['carousel_items'];

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

                $path = $file->store('hero-servis-detail-carousel', 'public');
                $item['url'] = '/storage/'.$path;
            }

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
        unset($item);

        HeroSectionServisDetail::updateOrCreate(
            ['user_id' => $targetUserId],
            [
                'title' => strip_tags($validated['title']),
                'subtitle' => strip_tags($validated['subtitle']),
                'badge_label' => strip_tags($validated['badge_label'] ?? 'Servis'),
                'carousel_items' => $carouselItems,
            ]
        );

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui konten Hero Detail Halaman Servis."
        );

        return redirect()->back()->with('success', 'Hero Detail Servis updated successfully.');
    }

    /**
     * Simpan / perbarui daftar servis halaman Servis.
     */
    public function updateDaftar(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'services' => 'required|array',
            'services.*.id' => 'required|string',
            'services.*.title' => 'required|string|max:255',
            'services.*.description' => 'required|string',
            'services.*.imageSrc' => 'nullable|string',
            'services.*.imageSourceType' => 'nullable|string',
            'services.*.imageFileName' => 'nullable|string',
            'services.*.imageFile' => 'nullable|file',
        ], [
            'title.required' => 'Judul section wajib diisi.',
            'title.max' => 'Judul section tidak boleh melebihi 255 karakter.',
            'services.required' => 'Daftar servis wajib diisi.',
            'services.array' => 'Format daftar servis tidak valid.',
        ]);

        $currentUser = $request->user();
        $daftarServis = DaftarServisSection::firstOrNew();

        $services = $validated['services'] ?? [];
        foreach ($services as $index => &$service) {
            if (($service['imageSourceType'] ?? 'url') === 'upload' && $request->hasFile("services.{$index}.imageFile")) {
                $file = $request->file("services.{$index}.imageFile");
                
                $request->validate([
                    "services.{$index}.imageFile" => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:512000',
                ], [
                    "services.{$index}.imageFile.required" => 'File gambar wajib diunggah.',
                    "services.{$index}.imageFile.image" => 'File harus berupa gambar.',
                    "services.{$index}.imageFile.mimes" => 'Format gambar harus jpeg, png, jpg, gif, atau webp.',
                    "services.{$index}.imageFile.max" => 'Ukuran gambar maksimal 500 MB.',
                ]);

                $path = $file->store('servis-daftar', 'public');
                $service['imageSrc'] = '/storage/' . $path;
            }

            $service['id'] = strip_tags($service['id'] ?? '');
            $service['title'] = strip_tags($service['title'] ?? '');
            $service['description'] = strip_tags($service['description'] ?? '');
            $service['imageSrc'] = strip_tags($service['imageSrc'] ?? '');

            unset($service['imageFile'], $service['imagePreviewUrl']);

            if (isset($service['imageSourceType'])) {
                $service['imageSourceType'] = strip_tags($service['imageSourceType']);
            }
            if (isset($service['imageFileName'])) {
                $service['imageFileName'] = strip_tags($service['imageFileName']);
            }
        }
        unset($service);

        $daftarServis->fill([
            'title' => strip_tags($validated['title']),
            'services' => $services,
        ]);

        $daftarServis->save();

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui konten Daftar Servis Halaman Servis."
        );

        return redirect()->back()->with('success', 'Daftar Servis updated successfully.');
    }
}
