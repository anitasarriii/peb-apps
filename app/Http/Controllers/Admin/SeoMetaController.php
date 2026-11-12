<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\SeoMeta;
use Illuminate\Http\Request;

class SeoMetaController extends Controller
{
    public function update(Request $request, string $pageType)
    {
        $validated = $request->validate([
            'meta_title' => 'required|string|max:255',
            'meta_description' => 'required|string',
            'meta_keywords' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'robots_index' => 'required|in:index,noindex',
            'robots_follow' => 'required|in:follow,nofollow',
            'og_title' => 'required|string|max:255',
            'og_description' => 'required|string',
            'image_source_type' => 'required|in:url,upload',
            'og_image' => 'nullable|string|max:2048',
            'image_file_name' => 'nullable|string|max:255',
        ], [
            'meta_title.required' => 'Meta Title wajib diisi.',
            'meta_title.max' => 'Meta Title tidak boleh melebihi 255 karakter.',
            'meta_description.required' => 'Meta Description wajib diisi.',
            'robots_index.required' => 'Setelan robot index wajib dipilih.',
            'robots_index.in' => 'Setelan robot index tidak valid.',
            'robots_follow.required' => 'Setelan robot follow wajib dipilih.',
            'robots_follow.in' => 'Setelan robot follow tidak valid.',
            'og_title.required' => 'Open Graph Title wajib diisi.',
            'og_title.max' => 'Open Graph Title tidak boleh melebihi 255 karakter.',
            'og_description.required' => 'Open Graph Description wajib diisi.',
            'image_source_type.required' => 'Sumber gambar medsos wajib dipilih.',
            'image_source_type.in' => 'Sumber gambar medsos tidak valid.',
            'og_image.max' => 'URL gambar medsos tidak boleh melebihi 2048 karakter.',
        ]);

        $currentUser = $request->user();
        $seoMeta = SeoMeta::firstOrNew(['page_type' => $pageType]);

        $ogImage = $validated['og_image'] ?? null;
        $imageFileName = $validated['image_file_name'] ?? null;

        if ($validated['image_source_type'] === 'upload' && $request->hasFile('og_file')) {
            $request->validate([
                'og_file' => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000', // max 500MB
            ], [
                'og_file.required' => 'Berkas gambar medsos wajib diunggah.',
                'og_file.extensions' => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                'og_file.max' => 'Ukuran berkas gambar tidak boleh melebihi 500 MB.',
            ]);
            $file = $request->file('og_file');
            $path = $file->store('seo-og', 'public');
            $ogImage = '/storage/'.$path;
            $imageFileName = $file->getClientOriginalName();
        }

        $seoMeta->fill([
            'meta_title' => strip_tags($validated['meta_title']),
            'meta_description' => strip_tags($validated['meta_description']),
            'meta_keywords' => ! empty($validated['meta_keywords']) ? strip_tags($validated['meta_keywords']) : null,
            'author' => ! empty($validated['author']) ? strip_tags($validated['author']) : null,
            'robots_index' => $validated['robots_index'],
            'robots_follow' => $validated['robots_follow'],
            'og_title' => strip_tags($validated['og_title']),
            'og_description' => strip_tags($validated['og_description']),
            'image_source_type' => $validated['image_source_type'],
            'og_image' => $ogImage ? strip_tags($ogImage) : null,
            'image_file_name' => $imageFileName ? strip_tags($imageFileName) : null,
        ]);

        $seoMeta->save();

        $pageLabel = match ($pageType) {
            'beranda' => 'Beranda',
            'tentang' => 'Tentang Kami',
            'servis' => 'Servis',
            'kebijakan' => 'Kebijakan',
            'galeri' => 'Galeri',
            'laporan' => 'Laporan',
            'pengadaan' => 'Pengadaan',
            'portfolio' => 'Portfolio',
            default => ucfirst($pageType)
        };

        Notification::log($currentUser, 'success', 'SEO Diperbarui', "{$currentUser->name} memperbarui pengaturan SEO Halaman {$pageLabel}.");

        return redirect()->back()->with('success', "Pengaturan SEO Halaman {$pageLabel} berhasil disimpan.");
    }
}
