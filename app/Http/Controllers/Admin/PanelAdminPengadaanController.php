<?php

namespace App\Http\Controllers\Admin;

use App\Actions\RecordProcurementActivity;
use App\Http\Controllers\Controller;
use App\Models\DaftarPengadaan;
use App\Models\HeroSectionPengadaan;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PanelAdminPengadaanController extends Controller
{
    /**
     * Simpan / perbarui hero section halaman Pengadaan.
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

                $path = $file->store('hero-pengadaan-carousel', 'public');
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

        HeroSectionPengadaan::updateOrCreate(
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
            "{$currentUser->name} memperbarui konten Hero Halaman Pengadaan."
        );

        return redirect()->back()->with('success', 'Hero Pengadaan updated successfully.');
    }

    /**
     * Simpan / perbarui daftar pengadaan terbaru secara global.
     */
    public function updateDaftar(Request $request)
    {
        $validated = $request->validate([
            'section_title' => 'required|string|max:255',
            'categories' => 'required|array',
            'categories.*' => 'required|string|max:255',
            'items' => 'present|array',
            'items.*.id' => 'required|string|max:255|distinct',
        ], [
            'section_title.required' => 'Judul section wajib diisi.',
            'section_title.max' => 'Judul section tidak boleh melebihi 255 karakter.',
            'categories.required' => 'Kategori wajib diisi.',
            'categories.array' => 'Format kategori tidak valid.',
            'items.required' => 'Item pengadaan wajib diisi.',
            'items.array' => 'Format item pengadaan tidak valid.',
        ]);

        $currentUser = $request->user();
        $items = $request->input('items', []);

        // Ambil data dokumen yang sudah ada di database untuk pemulihan ukuran & url asli
        $existing = DaftarPengadaan::find(1);
        $existingItems = $existing ? $existing->items : [];
        $existingDocs = [];
        if (is_array($existingItems)) {
            foreach ($existingItems as $exItem) {
                if (isset($exItem['dokumenList']) && is_array($exItem['dokumenList'])) {
                    foreach ($exItem['dokumenList'] as $exDoc) {
                        if (isset($exDoc['id'])) {
                            $existingDocs[$exDoc['id']] = $exDoc;
                        }
                    }
                }
            }
        }

        // Proses unggahan file per item pengadaan (jika sourceType == 'upload')
        foreach ($items as $index => &$item) {
            $request->validate([
                "items.{$index}.bannerImage" => ['nullable', 'string', 'max:2048'],
                "items.{$index}.bannerFile" => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:512000'],
            ]);
            if ($request->hasFile("items.{$index}.bannerFile")) {
                $bannerFile = $request->file("items.{$index}.bannerFile");
                $item['bannerImage'] = '/storage/'.$bannerFile->store('pengadaan-main-images', 'public');
                $item['bannerFileName'] = $bannerFile->getClientOriginalName();
            }
            unset($item['bannerFile'], $item['bannerPreviewUrl']);
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

                $path = $file->store('daftar-pengadaan-images', 'public');
                $item['imageSrc'] = '/storage/'.$path;
            }

            // Bersihkan properti preview temporer
            unset($item['file'], $item['imagePreviewUrl']);

            // Proses unggahan file per dokumen unduhan
            if (isset($item['dokumenList']) && is_array($item['dokumenList'])) {
                foreach ($item['dokumenList'] as $docIndex => &$doc) {
                    if (
                        ($doc['sourceType'] ?? '') === 'upload'
                        && $request->hasFile("items.{$index}.dokumenList.{$docIndex}.file")
                    ) {
                        $docFile = $request->file("items.{$index}.dokumenList.{$docIndex}.file");

                        $request->validate([
                            "items.{$index}.dokumenList.{$docIndex}.file" => 'required|extensions:pdf,doc,docx,xls,xlsx,jpeg,png,jpg,webp|max:512000',
                        ], [
                            "items.{$index}.dokumenList.{$docIndex}.file.required" => 'Berkas dokumen wajib diunggah.',
                            "items.{$index}.dokumenList.{$docIndex}.file.extensions" => 'Format berkas dokumen harus berupa pdf, doc, docx, xls, xlsx, jpeg, png, jpg, atau webp.',
                            "items.{$index}.dokumenList.{$docIndex}.file.max" => 'Ukuran berkas dokumen tidak boleh melebihi 20MB.',
                        ]);

                        $docPath = $docFile->store('daftar-pengadaan-dokumen', 'public');
                        $doc['fileUrl'] = '/storage/'.$docPath;

                        // Hitung ukuran file di backend
                        $bytes = $docFile->getSize();
                        $doc['fileSize'] = round($bytes / 1024 / 1024, 1).' MB';
                    } else {
                        // Jika tidak ada file baru yang diunggah, pulihkan data lama dari DB agar terhindar dari spoofing
                        $docId = $doc['id'] ?? '';
                        if (($doc['sourceType'] ?? '') === 'upload' && isset($existingDocs[$docId])) {
                            $doc['fileSize'] = $existingDocs[$docId]['fileSize'] ?? '0 MB';
                            $doc['fileUrl'] = $existingDocs[$docId]['fileUrl'] ?? '';
                        } elseif (($doc['sourceType'] ?? '') === 'url') {
                            $doc['fileSize'] = '-';
                        }
                    }

                    // Bersihkan properti temporer
                    unset($doc['file'], $doc['uploading']);

                    // Sanitasi data dokumen
                    $doc['id'] = strip_tags($doc['id'] ?? '');
                    $doc['name'] = strip_tags($doc['name'] ?? '');
                    $doc['fileSize'] = strip_tags($doc['fileSize'] ?? '');
                    $doc['sourceType'] = strip_tags($doc['sourceType'] ?? 'url');
                    $doc['fileUrl'] = strip_tags($doc['fileUrl'] ?? '');
                    if (isset($doc['fileName'])) {
                        $doc['fileName'] = strip_tags($doc['fileName']);
                    }
                }
                unset($doc);
            }

            // Sanitasi Syarat List
            if (isset($item['syaratList']) && is_array($item['syaratList'])) {
                foreach ($item['syaratList'] as &$syarat) {
                    $syarat['id'] = strip_tags($syarat['id'] ?? '');
                    $syarat['text'] = strip_tags($syarat['text'] ?? '');
                }
                unset($syarat);
            }

            // Sanitasi field item pengadaan
            $item['id'] = strip_tags($item['id'] ?? '');
            $item['title'] = strip_tags($item['title'] ?? '');
            $item['status'] = strip_tags($item['status'] ?? 'TERBUKA');
            if (array_key_exists('isArchived', $item)) {
                $item['isArchived'] = filter_var($item['isArchived'], FILTER_VALIDATE_BOOLEAN);
            }
            $item['startDate'] = strip_tags($item['startDate'] ?? '');
            $item['endDate'] = strip_tags($item['endDate'] ?? '');
            $item['location'] = strip_tags($item['location'] ?? '');
            $item['category'] = strip_tags($item['category'] ?? '');
            $item['imageSrc'] = strip_tags($item['imageSrc'] ?? '');
            $item['deskripsi'] = $item['deskripsi'] ?? '';
            $item['mapsMode'] = strip_tags($item['mapsMode'] ?? 'koordinat');
            $item['mapsKoordinat'] = strip_tags($item['mapsKoordinat'] ?? '');
            $item['mapsEmbedUrl'] = strip_tags($item['mapsEmbedUrl'] ?? '');
            $item['mapsLabel'] = strip_tags($item['mapsLabel'] ?? '');

            if (isset($item['imageFileName'])) {
                $item['imageFileName'] = strip_tags($item['imageFileName']);
            }
        }
        unset($item);

        DB::transaction(function () use ($currentUser, $validated, $items): void {
            $before = DaftarPengadaan::whereKey(1)->lockForUpdate()->first()?->items ?? [];
            DaftarPengadaan::updateOrCreate(
                ['id' => 1],
                [
                    'section_title' => strip_tags($validated['section_title']),
                    'categories' => $validated['categories'],
                    'items' => $items,
                ]
            );

            app(RecordProcurementActivity::class)->handle($currentUser, $before, $items);
        });

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui daftar pengadaan global."
        );

        return redirect()->back()->with('success', 'Daftar Pengadaan updated successfully.');
    }
}
