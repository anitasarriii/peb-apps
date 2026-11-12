<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\HeroSectionKontak;
use App\Models\Notification;
use Illuminate\Http\Request;

class PanelAdminKontakController extends Controller
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

                $path = $file->store('hero-kontak-carousel', 'public');
                $item['url'] = '/storage/'.$path;
            }

            unset($item['file']);
            unset($item['previewUrl']);

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

        HeroSectionKontak::updateOrCreate(
            ['user_id' => $targetUserId],
            [
                'title' => strip_tags($validated['title']),
                'subtitle' => strip_tags($validated['subtitle']),
                'carousel_items' => $carouselItems,
            ]
        );

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Hero Halaman Hubungi Kami.");

        return redirect()->back()->with('success', 'Hero Hubungi Kami berhasil diperbarui.');
    }

    /**
     * Tandai pesan kontak sebagai sudah dibaca atau belum dibaca.
     */
    public function toggleRead(Request $request, ContactMessage $contactMessage)
    {
        $isRead = $request->has('is_read')
            ? $request->boolean('is_read')
            : ! $contactMessage->is_read;

        $contactMessage->update(['is_read' => $isRead]);

        return redirect()->back();
    }

    /**
     * Tandai seluruh pesan masuk sebagai sudah dibaca.
     */
    public function markAllRead(Request $request)
    {
        ContactMessage::where('is_read', false)->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Semua pesan masuk ditandai sudah dibaca.');
    }

    /**
     * Hapus pesan kontak masuk.
     */
    public function destroyMessage(Request $request, ContactMessage $contactMessage)
    {
        $senderName = $contactMessage->name;
        $contactMessage->delete();

        $currentUser = $request->user();
        Notification::log(
            $currentUser,
            'info',
            'Pesan Dihapus',
            "{$currentUser->name} menghapus pesan kontak dari {$senderName}."
        );

        return redirect()->back()->with('success', 'Pesan masuk berhasil dihapus.');
    }
}

