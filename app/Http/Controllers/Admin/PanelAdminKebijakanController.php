<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSectionKebijakan;
use App\Models\KebijakanPebSection;
use App\Models\Notification;
use Illuminate\Http\Request;

class PanelAdminKebijakanController extends Controller
{
    /**
     * Simpan / perbarui hero section halaman Kebijakan.
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

                $path = $file->store('hero-kebijakan-carousel', 'public');
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

        HeroSectionKebijakan::updateOrCreate(
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
            "{$currentUser->name} memperbarui konten Hero Halaman Kebijakan."
        );

        return redirect()->back()->with('success', 'Hero Kebijakan updated successfully.');
    }

    /**
     * Simpan / perbarui konten Kebijakan PEB (singleton — satu record untuk seluruh aplikasi).
     */
    public function updateKebijakanPeb(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cards' => 'required|array|min:1',
            'cards.*.id' => 'required|string',
            'cards.*.title' => 'required|string|max:255',
            'cards.*.subtitle' => 'required|string|max:255',
            'cards.*.description' => 'required|string',
            'cards.*.signedBy' => 'required|string|max:255',
            'cards.*.role' => 'required|string|max:255',
            'cards.*.date' => 'required|string|max:255',
            'cards.*.file' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:512000',
            'cards.*.fileUrl' => 'nullable|string',
            'cards.*.imageSrc' => ['nullable', 'string', 'max:2048'],
            'cards.*.imageFileName' => ['nullable', 'string', 'max:255'],
            'cards.*.imageFile' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:512000'],
        ], [
            'title.required' => 'Judul section wajib diisi.',
            'cards.required' => 'Daftar kebijakan wajib diisi.',
            'cards.min' => 'Minimal harus ada 1 kartu kebijakan.',
            'cards.*.title.required' => 'Judul kartu kebijakan wajib diisi.',
            'cards.*.subtitle.required' => 'Subtitle kartu kebijakan wajib diisi.',
            'cards.*.description.required' => 'Deskripsi kartu kebijakan wajib diisi.',
            'cards.*.signedBy.required' => 'Nama penandatangan wajib diisi.',
            'cards.*.role.required' => 'Jabatan penandatangan wajib diisi.',
            'cards.*.date.required' => 'Tanggal penandatanganan wajib diisi.',
            'cards.*.file.mimes' => 'File harus berupa PDF, DOC, DOCX, JPG, atau PNG.',
            'cards.*.file.max' => 'Ukuran file tidak boleh lebih dari 500 MB.',
        ]);

        // Sanitasi tiap field agar bebas dari HTML berbahaya dan tangani upload file
        $cards = [];
        foreach ($request->all()['cards'] ?? [] as $index => $cardInput) {
            $cardData = $validated['cards'][$index];
            $imageSrc = $cardData['imageSrc'] ?? '';
            $imageFileName = $cardData['imageFileName'] ?? '';
            if ($request->hasFile("cards.{$index}.imageFile")) {
                $imageFile = $request->file("cards.{$index}.imageFile");
                $imageSrc = '/storage/'.$imageFile->store('kebijakan-images', 'public');
                $imageFileName = $imageFile->getClientOriginalName();
            }
            $fileUrl = isset($cardData['fileUrl']) ? strip_tags($cardData['fileUrl']) : null;

            // Periksa jika ada file yang diupload (diambil dari Request asli karena file ada di form data)
            if ($request->hasFile("cards.{$index}.file")) {
                $file = $request->file("cards.{$index}.file");
                $path = $file->store('kebijakan_files', 'public');
                $fileUrl = '/storage/'.$path;
            }

            $cards[] = [
                'imageSrc' => $imageSrc,
                'imageFileName' => $imageFileName,
                'id' => strip_tags($cardData['id']),
                'title' => strip_tags($cardData['title']),
                'subtitle' => strip_tags($cardData['subtitle']),
                'description' => strip_tags($cardData['description']),
                'signedBy' => strip_tags($cardData['signedBy']),
                'role' => strip_tags($cardData['role']),
                'date' => strip_tags($cardData['date']),
                'fileUrl' => $fileUrl,
            ];
        }

        // Singleton: selalu update record pertama, atau buat jika belum ada
        KebijakanPebSection::updateOrCreate(
            ['id' => 1],
            [
                'title' => strip_tags($validated['title']),
                'cards' => $cards,
            ]
        );

        $currentUser = $request->user();

        Notification::log(
            $currentUser,
            'success',
            'Konten Diperbarui',
            "{$currentUser->name} memperbarui konten Kebijakan PEB."
        );

        return redirect()->back()->with('success', 'Kebijakan PEB updated successfully.');
    }
}
