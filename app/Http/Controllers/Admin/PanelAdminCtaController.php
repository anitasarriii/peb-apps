<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CtaSection;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Controller independen untuk mengelola CTA Section global.
 *
 * CTA sebelumnya dikelola via PanelAdminBerandaController::updateCta().
 * Setelah refactor, CTA berdiri sendiri sebagai menu independen di panel admin
 * sehingga logikanya dipindahkan ke sini.
 */
class PanelAdminCtaController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'button_label' => 'required|string|max:255',
            'button_href' => 'required|string|max:255',
            'bg_source' => 'required|in:url,upload',
            'background_src' => 'nullable|string|max:2048',
            'bg_file_name' => 'nullable|string|max:255',
        ], [
            'text.required' => 'Teks utama wajib diisi.',
            'text.max' => 'Teks utama tidak boleh melebihi 255 karakter.',
            'button_label.required' => 'Label tombol wajib diisi.',
            'button_label.max' => 'Label tombol tidak boleh melebihi 255 karakter.',
            'button_href.required' => 'Link tombol wajib diisi.',
            'button_href.max' => 'Link tombol tidak boleh melebihi 255 karakter.',
            'bg_source.required' => 'Sumber latar belakang wajib dipilih.',
            'bg_source.in' => 'Sumber latar belakang tidak valid.',
            'background_src.max' => 'URL latar belakang tidak boleh melebihi 2048 karakter.',
        ]);

        $currentUser = $request->user();
        $ctaSection = CtaSection::firstOrNew();
        $backgroundSrc = $validated['background_src'];
        $bgFileName = $validated['bg_file_name'];

        // Jika user memilih upload file gambar latar
        if ($validated['bg_source'] === 'upload' && $request->hasFile('bg_file')) {
            $request->validate([
                'bg_file' => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
            ], [
                'bg_file.required' => 'Berkas gambar latar belakang wajib diunggah.',
                'bg_file.extensions' => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                'bg_file.max' => 'Ukuran berkas latar belakang tidak boleh melebihi 500 MB.',
            ]);

            $file = $request->file('bg_file');
            $path = $file->store('cta-bg', 'public');
            $backgroundSrc = '/storage/'.$path;
            $bgFileName = $file->getClientOriginalName();
        }

        $ctaSection->fill([
            'text' => strip_tags($validated['text']),
            'button_label' => strip_tags($validated['button_label']),
            'button_href' => strip_tags($validated['button_href']),
            'bg_source' => $validated['bg_source'],
            'background_src' => $backgroundSrc ? strip_tags($backgroundSrc) : null,
            'bg_file_name' => $bgFileName ? strip_tags($bgFileName) : null,
        ]);

        $ctaSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Call to Action.");

        return redirect()->back()->with('success', 'Call to Action updated successfully.');
    }
}
