<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSectionLaporan;
use App\Models\LaporanKeuanganSection;
use App\Models\LaporanTahunanSection;
use App\Models\Notification;
use Illuminate\Http\Request;

class PanelAdminLaporanController extends Controller
{
    /**
     * Simpan / perbarui hero section halaman Laporan.
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

                $path = $file->store('hero-laporan-carousel', 'public');
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

        HeroSectionLaporan::updateOrCreate(
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
            "{$currentUser->name} memperbarui konten Hero Halaman Laporan."
        );

        return redirect()->back()->with('success', 'Hero Laporan updated successfully.');
    }

    /**
     * Simpan / perbarui daftar laporan keuangan secara global.
     */
    public function updateKeuangan(Request $request)
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
            'items.required' => 'Item laporan keuangan wajib diisi.',
            'items.array' => 'Format item laporan keuangan tidak valid.',
        ]);

        $currentUser = $request->user();
        $items = $validated['items'];

        // Proses unggahan file gambar cover per item laporan (jika imageSourceType == 'upload')
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

                $path = $file->store('laporan-keuangan-images', 'public');
                $item['imageSrc'] = '/storage/'.$path;
            }

            // Bersihkan properti preview temporer
            unset($item['file'], $item['imagePreviewUrl']);

            // Proses unggahan file per dokumen pendukung
            if (isset($item['dokumenList']) && is_array($item['dokumenList'])) {
                foreach ($item['dokumenList'] as $docIndex => &$doc) {
                    if (
                        ($doc['sourceType'] ?? '') === 'upload'
                        && $request->hasFile("items.{$index}.dokumenList.{$docIndex}.file")
                    ) {
                        $docFile = $request->file("items.{$index}.dokumenList.{$docIndex}.file");

                        $request->validate([
                            "items.{$index}.dokumenList.{$docIndex}.file" => 'required|extensions:pdf,doc,docx,xls,xlsx,zip,rar|max:20480',
                        ], [
                            "items.{$index}.dokumenList.{$docIndex}.file.required" => 'Berkas dokumen wajib diunggah.',
                            "items.{$index}.dokumenList.{$docIndex}.file.extensions" => 'Format berkas dokumen harus berupa pdf, doc, docx, xls, xlsx, zip, atau rar.',
                            "items.{$index}.dokumenList.{$docIndex}.file.max" => 'Ukuran berkas dokumen tidak boleh melebihi 20MB.',
                        ]);

                        $docPath = $docFile->store('laporan-keuangan-dokumen', 'public');
                        $doc['fileUrl'] = '/storage/'.$docPath;
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

            // Sanitasi Poin Utama List
            if (isset($item['poinUtamaList']) && is_array($item['poinUtamaList'])) {
                foreach ($item['poinUtamaList'] as &$poin) {
                    $poin['id'] = strip_tags($poin['id'] ?? '');
                    $poin['text'] = strip_tags($poin['text'] ?? '');
                }
                unset($poin);
            }

            // Sanitasi field item laporan
            $item['id'] = strip_tags($item['id'] ?? '');
            $item['title'] = strip_tags($item['title'] ?? '');
            $item['subtitle'] = strip_tags($item['subtitle'] ?? '');
            $item['date'] = strip_tags($item['date'] ?? '');
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

        LaporanKeuanganSection::updateOrCreate(
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
            "{$currentUser->name} memperbarui daftar laporan keuangan."
        );

        return redirect()->back()->with('success', 'Laporan keuangan updated successfully.');
    }

    /**
     * Simpan / perbarui daftar laporan tahunan dan keberlanjutan secara global.
     */
    public function updateTahunan(Request $request)
    {
        $request->mergeIfMissing([
            'annual_reports' => [],
            'keberlanjutan_items' => [],
        ]);

        $validated = $request->validate([
            'section_title' => 'required|string|max:255',
            'section_desc' => 'required|string|max:255',
            'annual_reports' => 'present|array',
            'keberlanjutan_items' => 'present|array',
        ], [
            'section_title.required' => 'Judul section wajib diisi.',
            'section_title.max' => 'Judul section tidak boleh melebihi 255 karakter.',
            'section_desc.required' => 'Deskripsi section wajib diisi.',
            'section_desc.max' => 'Deskripsi section tidak boleh melebihi 255 karakter.',
            'annual_reports.required' => 'Item laporan tahunan wajib diisi.',
            'annual_reports.array' => 'Format item laporan tahunan tidak valid.',
            'keberlanjutan_items.required' => 'Item publikasi keberlanjutan wajib diisi.',
            'keberlanjutan_items.array' => 'Format item publikasi keberlanjutan tidak valid.',
        ]);

        $currentUser = $request->user();
        $annualReports = $validated['annual_reports'];
        $keberlanjutanItems = $validated['keberlanjutan_items'];

        // Proses unggahan file cover & dokumen per item annual report
        foreach ($annualReports as $index => &$item) {
            // Upload Cover
            if (
                ($item['imageSourceType'] ?? '') === 'upload'
                && $request->hasFile("annual_reports.{$index}.imageFile")
            ) {
                $file = $request->file("annual_reports.{$index}.imageFile");

                $request->validate([
                    "annual_reports.{$index}.imageFile" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
                ], [
                    "annual_reports.{$index}.imageFile.required" => 'File gambar sampul wajib diunggah.',
                    "annual_reports.{$index}.imageFile.extensions" => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                    "annual_reports.{$index}.imageFile.max" => 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
                ]);

                $path = $file->store('laporan-tahunan-covers', 'public');
                $item['imageSrc'] = '/storage/'.$path;
            }

            // Upload Document
            if (
                ($item['fileSourceType'] ?? '') === 'upload'
                && $request->hasFile("annual_reports.{$index}.docFile")
            ) {
                $docFile = $request->file("annual_reports.{$index}.docFile");

                $request->validate([
                    "annual_reports.{$index}.docFile" => 'required|extensions:pdf,doc,docx,xls,xlsx,zip,rar|max:20480',
                ], [
                    "annual_reports.{$index}.docFile.required" => 'Berkas laporan wajib diunggah.',
                    "annual_reports.{$index}.docFile.extensions" => 'Format berkas dokumen harus berupa pdf, doc, docx, xls, xlsx, zip, atau rar.',
                    "annual_reports.{$index}.docFile.max" => 'Ukuran berkas dokumen tidak boleh melebihi 20MB.',
                ]);

                $docPath = $docFile->store('laporan-tahunan-dokumen', 'public');
                $item['fileUrl'] = '/storage/'.$docPath;
            }

            // Bersihkan properti preview temporer
            unset($item['imageFile'], $item['docFile'], $item['imagePreviewUrl'], $item['docPreviewUrl']);

            // Sanitasi field item laporan tahunan
            $item['id'] = strip_tags($item['id'] ?? '');
            $item['title'] = strip_tags($item['title'] ?? '');
            $item['subtitle'] = strip_tags($item['subtitle'] ?? '');
            $item['badge'] = strip_tags($item['badge'] ?? '');
            $item['imageSrc'] = strip_tags($item['imageSrc'] ?? '');
            $item['fileUrl'] = strip_tags($item['fileUrl'] ?? '');
            $item['fileSize'] = strip_tags($item['fileSize'] ?? '');
            $item['imageSourceType'] = strip_tags($item['imageSourceType'] ?? 'url');
            $item['fileSourceType'] = strip_tags($item['fileSourceType'] ?? 'url');
            if (isset($item['imageFileName'])) {
                $item['imageFileName'] = strip_tags($item['imageFileName']);
            }
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

        // Proses unggahan file dokumen per item publikasi keberlanjutan
        foreach ($keberlanjutanItems as $index => &$item) {
            // Upload Cover
            if (
                ($item['imageSourceType'] ?? '') === 'upload'
                && $request->hasFile("keberlanjutan_items.{$index}.imageFile")
            ) {
                $file = $request->file("keberlanjutan_items.{$index}.imageFile");

                $request->validate([
                    "keberlanjutan_items.{$index}.imageFile" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
                ], [
                    "keberlanjutan_items.{$index}.imageFile.required" => 'File gambar sampul wajib diunggah.',
                    "keberlanjutan_items.{$index}.imageFile.extensions" => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                    "keberlanjutan_items.{$index}.imageFile.max" => 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
                ]);

                $path = $file->store('laporan-tahunan-covers', 'public');
                $item['imageSrc'] = '/storage/'.$path;
            }

            // Upload Document
            if (
                ($item['fileSourceType'] ?? '') === 'upload'
                && $request->hasFile("keberlanjutan_items.{$index}.docFile")
            ) {
                $docFile = $request->file("keberlanjutan_items.{$index}.docFile");

                $request->validate([
                    "keberlanjutan_items.{$index}.docFile" => 'required|extensions:pdf,doc,docx,xls,xlsx,zip,rar|max:20480',
                ], [
                    "keberlanjutan_items.{$index}.docFile.required" => 'Berkas laporan wajib diunggah.',
                    "keberlanjutan_items.{$index}.docFile.extensions" => 'Format berkas dokumen harus berupa pdf, doc, docx, xls, xlsx, zip, atau rar.',
                    "keberlanjutan_items.{$index}.docFile.max" => 'Ukuran berkas dokumen tidak boleh melebihi 20MB.',
                ]);

                $docPath = $docFile->store('laporan-tahunan-dokumen', 'public');
                $item['fileUrl'] = '/storage/'.$docPath;
            }

            // Bersihkan properti preview temporer
            unset($item['imageFile'], $item['docFile'], $item['imagePreviewUrl'], $item['docPreviewUrl']);

            // Sanitasi field item publikasi keberlanjutan
            $item['id'] = strip_tags($item['id'] ?? '');
            $item['title'] = strip_tags($item['title'] ?? '');
            $item['subtitle'] = strip_tags($item['subtitle'] ?? '');
            $item['badge'] = strip_tags($item['badge'] ?? '');
            $item['imageSrc'] = strip_tags($item['imageSrc'] ?? '');
            $item['fileUrl'] = strip_tags($item['fileUrl'] ?? '');
            $item['fileSize'] = strip_tags($item['fileSize'] ?? '');
            $item['imageSourceType'] = strip_tags($item['imageSourceType'] ?? 'url');
            $item['fileSourceType'] = strip_tags($item['fileSourceType'] ?? 'url');
            if (isset($item['imageFileName'])) {
                $item['imageFileName'] = strip_tags($item['imageFileName']);
            }
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

        LaporanTahunanSection::updateOrCreate(
            ['id' => 1],
            [
                'section_title' => strip_tags($validated['section_title']),
                'section_desc' => strip_tags($validated['section_desc']),
                'annual_reports' => $annualReports,
                'keberlanjutan_items' => $keberlanjutanItems,
            ]
        );

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui daftar laporan tahunan."
        );

        return redirect()->back()->with('success', 'Laporan tahunan updated successfully.');
    }
}
