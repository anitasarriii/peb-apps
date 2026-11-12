<?php

// app/Http/Controllers/Admin/PanelAdminTentangController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSectionTentang;
use App\Models\Notification;
use App\Models\PartnerSectionTentang;
use App\Models\ProfilSectionTentang;
use App\Models\QuoteSectionTentang;
use App\Models\TimSectionTentang;
use App\Models\VisiMisiSectionTentang;
use Illuminate\Http\Request;

class PanelAdminTentangController extends Controller
{
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

        // Tentukan user target: Super Admin bisa simpan untuk user lain
        $targetUserId = $currentUser->id;
        if (isset($validated['user_id']) && $currentUser->role && $currentUser->role->name === 'super_admin') {
            $targetUserId = $validated['user_id'];
        }

        $carouselItems = $validated['carousel_items'];

        foreach ($carouselItems as $index => &$item) {
            if ($item['sourceType'] === 'upload' && $request->hasFile("carousel_items.{$index}.file")) {
                $file = $request->file("carousel_items.{$index}.file");

                $type = $item['type'] ?? 'image';
                if ($type === 'video') {
                    $request->validate([
                        "carousel_items.{$index}.file" => 'required|extensions:mp4,webm,ogg,mov|max:512000', // max 500MB
                    ], [
                        "carousel_items.{$index}.file.required" => 'File video wajib diunggah.',
                        "carousel_items.{$index}.file.extensions" => 'Format berkas video harus berupa mp4, webm, ogg, atau mov.',
                        "carousel_items.{$index}.file.max" => 'Ukuran berkas video tidak boleh melebihi 500 MB.',
                    ]);
                } else {
                    $request->validate([
                        "carousel_items.{$index}.file" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000', // max 500MB
                    ], [
                        "carousel_items.{$index}.file.required" => 'File gambar wajib diunggah.',
                        "carousel_items.{$index}.file.extensions" => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                        "carousel_items.{$index}.file.max" => 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
                    ]);
                }

                $path = $file->store('hero-tentang-carousel', 'public');
                $item['url'] = '/storage/'.$path;
            }

            unset($item['file']);
            unset($item['previewUrl']);

            $item['id'] = strip_tags($item['id']);
            $item['type'] = strip_tags($item['type']);
            $item['sourceType'] = strip_tags($item['sourceType']);
            $item['url'] = strip_tags($item['url']);
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

        HeroSectionTentang::updateOrCreate(
            ['user_id' => $targetUserId],
            [
                'title' => strip_tags($validated['title']),
                'subtitle' => strip_tags($validated['subtitle']),
                'carousel_items' => $carouselItems,
            ]
        );

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Hero Halaman Tentang Kami.");

        return redirect()->back()->with('success', 'Hero Tentang Kami updated successfully.');
    }

    public function updateProfil(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'image_src' => 'nullable|string',
            'image_source_type' => 'required|in:url,upload',
            'image_file_name' => 'nullable|string',
            'experience_years' => 'required|string|max:50',
            'experience_label' => 'required|string|max:255',
            'maps_label' => 'required|string|max:255',
            'maps_value' => 'required|string|max:255',
            'maps_mode' => 'required|in:koordinat,embed',
            'maps_koordinat' => 'nullable|string|max:100',
            'maps_embed_url' => 'nullable|string',
        ], [
            'title.required' => 'Judul utama wajib diisi.',
            'description.required' => 'Deskripsi profil wajib diisi.',
            'image_source_type.required' => 'Sumber gambar wajib diisi.',
            'image_source_type.in' => 'Sumber gambar tidak valid.',
            'experience_years.required' => 'Nilai pengalaman wajib diisi.',
            'experience_years.max' => 'Nilai pengalaman tidak boleh melebihi 50 karakter.',
            'experience_label.required' => 'Label pengalaman wajib diisi.',
            'experience_label.max' => 'Label pengalaman tidak boleh melebihi 255 karakter.',
            'maps_label.required' => 'Label lokasi wajib diisi.',
            'maps_label.max' => 'Label lokasi tidak boleh melebihi 255 karakter.',
            'maps_value.required' => 'Nama lokasi wajib diisi.',
            'maps_value.max' => 'Nama lokasi tidak boleh melebihi 255 karakter.',
            'maps_mode.required' => 'Sumber peta wajib diisi.',
            'maps_mode.in' => 'Sumber peta tidak valid.',
        ]);

        $currentUser = $request->user();
        $profilSection = ProfilSectionTentang::firstOrNew();

        $imageSrc = $validated['image_src'] ?? null;
        $imageFileName = $validated['image_file_name'] ?? null;

        if ($validated['image_source_type'] === 'upload' && $request->hasFile('image_file')) {
            $request->validate([
                'image_file' => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000', // max 500MB
            ], [
                'image_file.required' => 'Berkas gambar wajib diunggah.',
                'image_file.extensions' => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                'image_file.max' => 'Ukuran berkas tidak boleh melebihi 500 MB.',
            ]);
            $file = $request->file('image_file');
            $path = $file->store('profil-media', 'public');
            $imageSrc = '/storage/'.$path;
            $imageFileName = $file->getClientOriginalName();
        }

        $profilSection->fill([
            'title' => strip_tags($validated['title']),
            'description' => strip_tags($validated['description']),
            'image_src' => $imageSrc ? strip_tags($imageSrc) : '',
            'image_source_type' => $validated['image_source_type'],
            'image_file_name' => $imageFileName ? strip_tags($imageFileName) : null,
            'experience_years' => strip_tags($validated['experience_years']),
            'experience_label' => strip_tags($validated['experience_label']),
            'maps_label' => strip_tags($validated['maps_label']),
            'maps_value' => strip_tags($validated['maps_value']),
            'maps_mode' => $validated['maps_mode'],
            'maps_koordinat' => ($validated['maps_koordinat'] ?? null) ? strip_tags($validated['maps_koordinat']) : null,
            'maps_embed_url' => ($validated['maps_embed_url'] ?? null) ? strip_tags($validated['maps_embed_url']) : null,
        ]);

        $profilSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Profil Perusahaan.");

        return redirect()->back()->with('success', 'Profil Perusahaan updated successfully.');
    }

    public function updateVisiMisi(Request $request)
    {
        $validated = $request->validate([
            'visi_label' => 'required|string|max:255',
            'visi_text' => 'required|string',
            'stats' => 'required|array|min:1|max:2',
            'stats.*.value' => 'required|string|max:50',
            'stats.*.label' => 'required|string|max:255',
            'stats.*.highlighted' => 'nullable|boolean',
            'misi_title' => 'required|string|max:255',
            'misi_subtitle' => 'nullable|string|max:500',
            'misi_items' => 'required|array|min:1',
            'misi_items.*.number' => 'required|integer|min:1',
            'misi_items.*.title' => 'required|string|max:255',
            'misi_items.*.description' => 'required|string|max:1000',
        ], [
            'visi_label.required' => 'Label lencana visi wajib diisi.',
            'visi_label.max' => 'Label lencana visi tidak boleh melebihi 255 karakter.',
            'visi_text.required' => 'Pernyataan visi utama wajib diisi.',
            'stats.required' => 'Statistik pendukung wajib diisi.',
            'stats.min' => 'Minimal harus ada 1 statistik pendukung.',
            'stats.max' => 'Maksimal hanya boleh ada 2 statistik pendukung.',
            'stats.*.value.required' => 'Nilai statistik wajib diisi.',
            'stats.*.value.max' => 'Nilai statistik tidak boleh melebihi 50 karakter.',
            'stats.*.label.required' => 'Keterangan statistik wajib diisi.',
            'stats.*.label.max' => 'Keterangan statistik tidak boleh melebihi 255 karakter.',
            'misi_title.required' => 'Judul bagian misi wajib diisi.',
            'misi_title.max' => 'Judul bagian misi tidak boleh melebihi 255 karakter.',
            'misi_subtitle.max' => 'Sub-judul misi tidak boleh melebihi 500 karakter.',
            'misi_items.required' => 'Daftar misi wajib diisi.',
            'misi_items.min' => 'Minimal harus ada 1 item misi.',
            'misi_items.*.number.required' => 'Nomor urut misi wajib diisi.',
            'misi_items.*.title.required' => 'Judul misi wajib diisi.',
            'misi_items.*.title.max' => 'Judul misi tidak boleh melebihi 255 karakter.',
            'misi_items.*.description.required' => 'Deskripsi misi wajib diisi.',
            'misi_items.*.description.max' => 'Deskripsi misi tidak boleh melebihi 1000 karakter.',
        ]);

        $currentUser = $request->user();
        $visiMisiSection = VisiMisiSectionTentang::firstOrNew();

        // Sanitasi setiap field untuk keamanan XSS
        $stats = array_map(function ($stat) {
            return [
                'value' => strip_tags($stat['value']),
                'label' => strip_tags($stat['label']),
                'highlighted' => (bool) ($stat['highlighted'] ?? false),
            ];
        }, $validated['stats']);

        $misiItems = array_values(array_map(function ($item) {
            return [
                'number' => (int) $item['number'],
                'title' => strip_tags($item['title']),
                'description' => strip_tags($item['description']),
            ];
        }, $validated['misi_items']));

        $visiMisiSection->fill([
            'visi_label' => strip_tags($validated['visi_label']),
            'visi_text' => strip_tags($validated['visi_text']),
            'stats' => $stats,
            'misi_title' => strip_tags($validated['misi_title']),
            'misi_subtitle' => ($validated['misi_subtitle'] ?? null) ? strip_tags($validated['misi_subtitle']) : null,
            'misi_items' => $misiItems,
        ]);

        $visiMisiSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Visi & Misi Perusahaan.");

        return redirect()->back()->with('success', 'Visi & Misi Perusahaan berhasil diperbarui.');
    }

    public function updateTim(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'members' => 'required|array|min:1',
            'members.*.id' => 'required|string',
            'members.*.name' => 'required|string|max:255',
            'members.*.role' => 'required|string|max:255',
            'members.*.image' => 'nullable|string|max:2048',
            'members.*.imageSourceType' => 'required|in:url,upload',
            'members.*.imageFileName' => 'nullable|string|max:255',
        ], [
            'title.required' => 'Judul section Tim wajib diisi.',
            'title.max' => 'Judul section tidak boleh melebihi 255 karakter.',
            'subtitle.max' => 'Sub-judul tidak boleh melebihi 500 karakter.',
            'members.required' => 'Daftar pimpinan wajib diisi.',
            'members.min' => 'Minimal harus ada 1 pimpinan.',
            'members.*.name.required' => 'Nama pimpinan wajib diisi.',
            'members.*.name.max' => 'Nama pimpinan tidak boleh melebihi 255 karakter.',
            'members.*.role.required' => 'Jabatan pimpinan wajib diisi.',
            'members.*.role.max' => 'Jabatan pimpinan tidak boleh melebihi 255 karakter.',
            'members.*.imageSourceType.required' => 'Sumber foto pimpinan wajib diisi.',
            'members.*.imageSourceType.in' => 'Sumber foto pimpinan tidak valid.',
        ]);

        $currentUser = $request->user();
        $timSection = TimSectionTentang::firstOrNew();

        $members = $validated['members'];

        // Proses upload foto per-anggota jika ada file baru
        foreach ($members as $index => &$member) {
            if ($member['imageSourceType'] === 'upload' && $request->hasFile("members.{$index}.imageFile")) {
                $request->validate([
                    "members.{$index}.imageFile" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000', // max 500MB
                ], [
                    "members.{$index}.imageFile.required" => 'Foto pimpinan wajib diunggah.',
                    "members.{$index}.imageFile.extensions" => 'Format foto harus berupa jpeg, png, jpg, gif, atau webp.',
                    "members.{$index}.imageFile.max" => 'Ukuran foto tidak boleh melebihi 500 MB.',
                ]);

                $file = $request->file("members.{$index}.imageFile");
                $path = $file->store('tim-anggota', 'public');
                $member['image'] = '/storage/'.$path;
                $member['imageFileName'] = $file->getClientOriginalName();
            }

            // Bersihkan field sementara yang tidak perlu disimpan
            unset($member['imageFile']);
            unset($member['imagePreviewUrl']);

            // Sanitasi XSS pada setiap field teks
            $member['id'] = strip_tags($member['id']);
            $member['name'] = strip_tags($member['name']);
            $member['role'] = strip_tags($member['role']);
            $member['image'] = isset($member['image']) ? strip_tags($member['image']) : '';
            $member['imageSourceType'] = strip_tags($member['imageSourceType']);
            if (isset($member['imageFileName'])) {
                $member['imageFileName'] = strip_tags($member['imageFileName']);
            }
        }

        $timSection->fill([
            'title' => strip_tags($validated['title']),
            'subtitle' => ($validated['subtitle'] ?? null) ? strip_tags($validated['subtitle']) : null,
            'members' => array_values($members),
        ]);

        $timSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Tim Kepemimpinan.");

        return redirect()->back()->with('success', 'Tim Kepemimpinan berhasil diperbarui.');
    }

    public function updateQuote(Request $request)
    {
        $validated = $request->validate([
            'quote_text' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'button_label' => 'required|string|max:255',
            'button_href' => 'required|string|max:255',
        ], [
            'quote_text.required' => 'Kutipan utama (quote) wajib diisi.',
            'quote_text.max' => 'Kutipan utama tidak boleh melebihi 255 karakter.',
            'description.required' => 'Pernyataan komitmen / deskripsi wajib diisi.',
            'description.max' => 'Pernyataan komitmen tidak boleh melebihi 1000 karakter.',
            'button_label.required' => 'Label tombol wajib diisi.',
            'button_label.max' => 'Label tombol tidak boleh melebihi 255 karakter.',
            'button_href.required' => 'Tautan tombol wajib diisi.',
            'button_href.max' => 'Tautan tombol tidak boleh melebihi 255 karakter.',
        ]);

        $currentUser = $request->user();
        $quoteSection = QuoteSectionTentang::firstOrNew();

        $quoteSection->fill([
            'quote_text' => strip_tags($validated['quote_text']),
            'description' => strip_tags($validated['description']),
            'button_label' => strip_tags($validated['button_label']),
            'button_href' => strip_tags($validated['button_href']),
        ]);

        $quoteSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Quote & Komitmen Halaman Tentang Kami.");

        return redirect()->back()->with('success', 'Quote & Komitmen berhasil diperbarui.');
    }

    public function updatePartner(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'partners' => 'required|array',
            'partners.*.id' => 'required|string',
            'partners.*.name' => 'required|string|max:255',
            'partners.*.logoSrc' => 'nullable|string',
            'partners.*.logoSource' => 'required|in:url,upload,none',
        ], [
            'title.required' => 'Judul utama section wajib diisi.',
            'title.max' => 'Judul utama section tidak boleh melebihi 255 karakter.',
            'partners.required' => 'Daftar partner wajib diisi.',
            'partners.array' => 'Format daftar partner tidak valid.',
            'partners.*.name.required' => 'Nama partner wajib diisi.',
            'partners.*.logoSource.required' => 'Jenis sumber logo wajib diisi.',
            'partners.*.logoSource.in' => 'Jenis sumber logo tidak valid.',
        ]);

        $currentUser = $request->user();
        $partnerSection = PartnerSectionTentang::firstOrNew();

        $partners = $validated['partners'];

        foreach ($partners as $index => &$partner) {
            if ($partner['logoSource'] === 'upload' && $request->hasFile("partners.{$index}.logoFile")) {
                $request->validate([
                    "partners.{$index}.logoFile" => 'required|extensions:jpeg,png,jpg,gif,webp,svg|max:512000', // max 500MB
                ], [
                    "partners.{$index}.logoFile.required" => 'Logo partner wajib diunggah.',
                    "partners.{$index}.logoFile.extensions" => 'Format berkas logo harus berupa jpeg, png, jpg, gif, webp, atau svg.',
                    "partners.{$index}.logoFile.max" => 'Ukuran logo tidak boleh melebihi 500 MB.',
                ]);
                $file = $request->file("partners.{$index}.logoFile");
                $path = $file->store('partner-logos', 'public');
                $partner['logoSrc'] = '/storage/'.$path;
            }

            unset($partner['logoFile']);

            $partner['id'] = strip_tags($partner['id']);
            $partner['name'] = strip_tags($partner['name']);
            if (isset($partner['logoSrc'])) {
                $partner['logoSrc'] = strip_tags($partner['logoSrc']);
            }
            $partner['logoSource'] = strip_tags($partner['logoSource']);
        }

        $partnerSection->fill([
            'title' => strip_tags($validated['title']),
            'partners' => $partners,
        ]);

        $partnerSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Partner & Kolaborator Halaman Tentang Kami.");

        return redirect()->back()->with('success', 'Partner & Kolaborator berhasil diperbarui.');
    }
}
