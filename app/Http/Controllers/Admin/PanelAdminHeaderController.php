<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Header;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Controller untuk mengelola konfigurasi Header (Logo Kiri & Kanan).
 */
class PanelAdminHeaderController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'logo_kiri_src' => 'nullable|string|max:2048',
            'logo_kiri_source_type' => 'required|in:url,upload',
            'logo_kiri_file_name' => 'nullable|string|max:255',
            'logo_kanan_src' => 'nullable|string|max:2048',
            'logo_kanan_source_type' => 'required|in:url,upload',
            'logo_kanan_file_name' => 'nullable|string|max:255',
        ]);

        $currentUser = $request->user();
        $header = Header::firstOrNew();

        $logoKiriSrc = $validated['logo_kiri_src'];
        $logoKiriFileName = $validated['logo_kiri_file_name'];
        $logoKananSrc = $validated['logo_kanan_src'];
        $logoKananFileName = $validated['logo_kanan_file_name'];

        // Jika user mengunggah file logo kiri
        if ($validated['logo_kiri_source_type'] === 'upload' && $request->hasFile('logo_kiri_file')) {
            $request->validate([
                'logo_kiri_file' => 'required|extensions:jpeg,png,jpg,gif,webp,svg|max:512000',
            ], [
                'logo_kiri_file.required' => 'Berkas logo kiri wajib diunggah.',
                'logo_kiri_file.extensions' => 'Format berkas logo kiri harus berupa jpeg, png, jpg, gif, webp, atau svg.',
                'logo_kiri_file.max' => 'Ukuran berkas logo kiri tidak boleh melebihi 500 MB.',
            ]);

            $fileKiri = $request->file('logo_kiri_file');
            $pathKiri = $fileKiri->store('header-logo', 'public');
            $logoKiriSrc = '/storage/'.$pathKiri;
            $logoKiriFileName = $fileKiri->getClientOriginalName();
        }

        // Jika user mengunggah file logo kanan
        if ($validated['logo_kanan_source_type'] === 'upload' && $request->hasFile('logo_kanan_file')) {
            $request->validate([
                'logo_kanan_file' => 'required|extensions:jpeg,png,jpg,gif,webp,svg|max:512000',
            ], [
                'logo_kanan_file.required' => 'Berkas logo kanan wajib diunggah.',
                'logo_kanan_file.extensions' => 'Format berkas logo kanan harus berupa jpeg, png, jpg, gif, webp, atau svg.',
                'logo_kanan_file.max' => 'Ukuran berkas logo kanan tidak boleh melebihi 500 MB.',
            ]);

            $fileKanan = $request->file('logo_kanan_file');
            $pathKanan = $fileKanan->store('header-logo', 'public');
            $logoKananSrc = '/storage/'.$pathKanan;
            $logoKananFileName = $fileKanan->getClientOriginalName();
        }

        $header->fill([
            'logo_kiri_src' => $logoKiriSrc ? strip_tags($logoKiriSrc) : '/assets/logo/danantara-logo.svg',
            'logo_kiri_source_type' => $validated['logo_kiri_source_type'],
            'logo_kiri_file_name' => $logoKiriFileName ? strip_tags($logoKiriFileName) : null,
            'logo_kanan_src' => $logoKananSrc ? strip_tags($logoKananSrc) : '/assets/logo/logo.png',
            'logo_kanan_source_type' => $validated['logo_kanan_source_type'],
            'logo_kanan_file_name' => $logoKananFileName ? strip_tags($logoKananFileName) : null,
        ]);

        $header->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui logo Header (logo kiri & logo kanan) global.");

        return redirect()->back()->with('success', 'Header updated successfully.');
    }
}
