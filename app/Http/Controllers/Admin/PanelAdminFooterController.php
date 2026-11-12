<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Controller untuk mengelola konfigurasi Footer global.
 */
class PanelAdminFooterController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'logo_src' => 'nullable|string|max:2048',
            'logo_source_type' => 'required|in:url,upload',
            'logo_file_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'socials' => 'required|array',
            'socials.*.id' => 'required|string',
            'socials.*.platform' => 'required|string|max:255',
            'socials.*.href' => 'required|string|max:2048',
            'explore_links' => 'required|array',
            'explore_links.*.id' => 'required|string',
            'explore_links.*.label' => 'required|string|max:255',
            'explore_links.*.href' => 'required|string|max:2048',
            'address' => 'required|string',
            'phone' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subscribe_heading' => 'required|string|max:255',
            'subscribe_description' => 'required|string',
            'subscribe_button_label' => 'required|string|max:255',
            'copyright_text' => 'required|string|max:255',
            'privacy_href' => 'required|string|max:2048',
            'tos_href' => 'required|string|max:2048',
        ], [
            'description.required' => 'Deskripsi brand wajib diisi.',
            'address.required' => 'Alamat wajib diisi.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Alamat email tidak valid.',
            'subscribe_heading.required' => 'Judul subscribe wajib diisi.',
            'subscribe_description.required' => 'Deskripsi subscribe wajib diisi.',
            'subscribe_button_label.required' => 'Label tombol subscribe wajib diisi.',
            'copyright_text.required' => 'Teks copyright wajib diisi.',
            'privacy_href.required' => 'URL Privacy Policy wajib diisi.',
            'tos_href.required' => 'URL Terms of Service wajib diisi.',
        ]);

        $currentUser = $request->user();
        $footer = Footer::firstOrNew();
        $logoSrc = $validated['logo_src'];
        $logoFileName = $validated['logo_file_name'];

        // Jika user memilih upload file logo
        if ($validated['logo_source_type'] === 'upload' && $request->hasFile('logo_file')) {
            $request->validate([
                'logo_file' => 'required|extensions:jpeg,png,jpg,gif,webp,svg|max:512000',
            ], [
                'logo_file.required' => 'Berkas logo wajib diunggah.',
                'logo_file.extensions' => 'Format berkas logo harus berupa jpeg, png, jpg, gif, webp, atau svg.',
                'logo_file.max' => 'Ukuran berkas logo tidak boleh melebihi 500 MB.',
            ]);

            $file = $request->file('logo_file');
            $path = $file->store('footer-logo', 'public');
            $logoSrc = '/storage/'.$path;
            $logoFileName = $file->getClientOriginalName();
        }

        // Sanitasi input teks/HTML berbahaya
        $footer->fill([
            'logo_src' => $logoSrc ? strip_tags($logoSrc) : null,
            'logo_source_type' => $validated['logo_source_type'],
            'logo_file_name' => $logoFileName ? strip_tags($logoFileName) : null,
            'description' => strip_tags($validated['description']),
            'socials' => $validated['socials'], // simpan array berformat JSON
            'explore_links' => $validated['explore_links'], // simpan array berformat JSON
            'address' => strip_tags($validated['address']),
            'phone' => strip_tags($validated['phone']),
            'email' => strip_tags($validated['email']),
            'subscribe_heading' => strip_tags($validated['subscribe_heading']),
            'subscribe_description' => strip_tags($validated['subscribe_description']),
            'subscribe_button_label' => strip_tags($validated['subscribe_button_label']),
            'copyright_text' => strip_tags($validated['copyright_text']),
            'privacy_href' => strip_tags($validated['privacy_href']),
            'tos_href' => strip_tags($validated['tos_href']),
        ]);

        $footer->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Footer global.");

        return redirect()->back()->with('success', 'Footer updated successfully.');
    }
}
