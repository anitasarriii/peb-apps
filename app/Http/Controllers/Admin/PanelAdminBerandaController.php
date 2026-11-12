<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutSectionBeranda;
use App\Models\HeroSectionBeranda;
use App\Models\LayananSectionBeranda;
use App\Models\Notification;
use App\Models\PartnerSectionBeranda;
use App\Models\PortfolioSectionBeranda;
use App\Models\StatistikSectionBeranda;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PanelAdminBerandaController extends Controller
{
    public function updateHero(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'cta_label' => 'required|string|max:255',
            'cta_href' => 'required|string|max:255',
            'secondary_cta_label' => 'nullable|string|max:255',
            'secondary_cta_href' => 'nullable|string|max:255',
            'carousel_items' => 'required|array',
            'carousel_items.*' => 'required|array',
            'carousel_items.*.label' => 'nullable|string|max:100',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        $currentUser = $request->user();

        $targetUserId = $currentUser->id;
        if (isset($validated['user_id']) && $currentUser->role && $currentUser->role->name === 'super_admin') {
            $targetUserId = $validated['user_id'];
        }

        $carouselItems = $request->input('carousel_items', []);
        $savedItems = collect(HeroSectionBeranda::where('user_id', $targetUserId)->first()?->carousel_items ?? []);

        foreach ($carouselItems as $index => &$item) {
            $fileKey = "carousel_items.{$index}.file";
            $sourceType = $item['sourceType'] ?? ($request->hasFile($fileKey) ? 'upload' : 'url');
            if ($sourceType === 'upload' && ! $request->hasFile($fileKey)) {
                $savedItem = $savedItems->firstWhere('id', $item['id'] ?? null);
                if (! $savedItem || ($savedItem['sourceType'] ?? null) !== 'upload' || ($savedItem['url'] ?? '') !== ($item['url'] ?? '')) {
                    $request->validate([$fileKey => 'required|file'], [$fileKey.'.required' => 'Pilih file media sebelum menyimpan.']);
                }
            }
            if ($sourceType === 'upload' && $request->hasFile($fileKey)) {
                $file = $request->file("carousel_items.{$index}.file");

                $type = $item['type'] ?? 'image';
                if ($type === 'video') {
                    $request->validate([
                        "carousel_items.{$index}.file" => 'required|extensions:mp4,webm,ogg,mov|max:512000',
                    ], [
                        "carousel_items.{$index}.file.max" => 'Ukuran video maksimal 500 MB.',
                    ]);
                } else {
                    $request->validate([
                        "carousel_items.{$index}.file" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000',
                    ], [
                        "carousel_items.{$index}.file.max" => 'Ukuran gambar maksimal 10 MB.',
                    ]);
                }

                $path = $file->store('hero-carousel', 'public');
                $item['url'] = '/storage/'.$path;
                $item['fileName'] = $file->getClientOriginalName();
            }
            $item['sourceType'] = $sourceType;

            unset($item['file']);
            unset($item['previewUrl']);

            $item['url'] = strip_tags($item['url']);
            if (isset($item['fileName'])) {
                $item['fileName'] = strip_tags($item['fileName']);
            }
            if (isset($item['label'])) {
                $item['label'] = strip_tags($item['label']);
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

        HeroSectionBeranda::updateOrCreate(
            ['user_id' => $targetUserId],
            [
                'title' => strip_tags($validated['title']),
                'subtitle' => strip_tags($validated['subtitle']),
                'cta_label' => strip_tags($validated['cta_label']),
                'cta_href' => strip_tags($validated['cta_href']),
                'secondary_cta_label' => $validated['secondary_cta_label'] ? strip_tags($validated['secondary_cta_label']) : null,
                'secondary_cta_href' => $validated['secondary_cta_href'] ? strip_tags($validated['secondary_cta_href']) : null,
                'carousel_items' => $carouselItems,
            ]
        );

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Hero Section Beranda.");

        return redirect()->back()->with('success', 'Hero section updated successfully.');
    }

    public function updateAbout(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'slogan_text' => 'nullable|string',
            'media_type' => 'required|in:video,image',
            'media_source_type' => 'required|in:url,upload',
            'media_url' => 'nullable|string|max:2048',
            'media_file_name' => 'nullable|string|max:255',
            'efisiensi' => 'required|array',
            'efisiensi.label' => 'required|string|max:255',
            'efisiensi.value' => 'required|string|max:255',
            'efisiensi.description' => 'required|string',
            'inovatif' => 'required|array',
            'inovatif.label' => 'required|string|max:255',
            'inovatif.value' => 'required|string|max:255',
            'inovatif.description' => 'required|string',
        ]);

        $currentUser = $request->user();
        $aboutSection = AboutSectionBeranda::firstOrNew();

        $mediaUrl = $validated['media_url'];
        $mediaFileName = $validated['media_file_name'];

        if ($validated['media_source_type'] === 'upload' && $request->hasFile('media_file')) {
            $file = $request->file('media_file');

            if ($validated['media_type'] === 'video') {
                $request->validate([
                    'media_file' => 'required|extensions:mp4,webm,ogg,mov|max:512000', // max 500MB
                ]);
            } else {
                $request->validate([
                    'media_file' => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000', // max 500MB
                ]);
            }

            $path = $file->store('about-media', 'public');
            $mediaUrl = '/storage/'.$path;
            $mediaFileName = $file->getClientOriginalName();
        }

        $aboutSection->fill([
            'title' => strip_tags($validated['title']),
            'subtitle' => strip_tags($validated['subtitle']),
            'slogan_text' => strip_tags($validated['slogan_text']),
            'media_type' => $validated['media_type'],
            'media_source_type' => $validated['media_source_type'],
            'media_url' => $mediaUrl ? strip_tags($mediaUrl) : null,
            'media_file_name' => $mediaFileName ? strip_tags($mediaFileName) : null,
            'efisiensi' => [
                'label' => strip_tags($validated['efisiensi']['label']),
                'value' => strip_tags($validated['efisiensi']['value']),
                'description' => strip_tags($validated['efisiensi']['description']),
            ],
            'inovatif' => [
                'label' => strip_tags($validated['inovatif']['label']),
                'value' => strip_tags($validated['inovatif']['value']),
                'description' => strip_tags($validated['inovatif']['description']),
            ],
        ]);

        $aboutSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Tentang Kami.");

        return redirect()->back()->with('success', 'Tentang Kami updated successfully.');
    }

    public function updateLayanan(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'services' => 'required|array',
            'services.*.id' => 'required|string',
            'services.*.icon' => 'required|string|max:255',
            'services.*.title' => 'required|string|max:255',
            'services.*.description' => 'required|string',
        ]);

        $currentUser = $request->user();
        $layananSection = LayananSectionBeranda::firstOrNew();

        $services = $validated['services'];
        foreach ($services as &$service) {
            $service['id'] = strip_tags($service['id']);
            $service['icon'] = strip_tags($service['icon']);
            $service['title'] = strip_tags($service['title']);
            $service['description'] = strip_tags($service['description']);
        }

        $layananSection->fill([
            'title' => strip_tags($validated['title']),
            'services' => $services,
        ]);

        $layananSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Layanan Kami.");

        return redirect()->back()->with('success', 'Layanan section updated successfully.');
    }

    public function updatePortfolio(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cta_label' => 'required|string|max:255',
            'projects' => 'required|array',
        ]);

        $currentUser = $request->user();
        $portfolioSection = PortfolioSectionBeranda::firstOrNew();

        $projects = $validated['projects'];

        foreach ($projects as $index => &$project) {
            if ($request->hasFile("projects.{$index}.imageFile")) {
                $file = $request->file("projects.{$index}.imageFile");

                $request->validate([
                    "projects.{$index}.imageFile" => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000', // max 500MB
                ]);

                $path = $file->store('portfolio', 'public');
                $project['image'] = '/storage/'.$path;
            }

            unset($project['imageFile']);
            unset($project['previewUrl']);

            $project['title'] = strip_tags($project['title']);
            $project['category'] = strip_tags($project['category']);
            $project['year'] = strip_tags($project['year']);
            $project['image'] = strip_tags($project['image']);
            $project['imageSource'] = strip_tags($project['imageSource']);
        }

        $portfolioSection->fill([
            'title' => strip_tags($validated['title']),
            'description' => strip_tags($validated['description']),
            'cta_label' => strip_tags($validated['cta_label']),
            'projects' => $projects,
        ]);

        $portfolioSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Portofolio Proyek.");

        return redirect()->back()->with('success', 'Portfolio section updated successfully.');
    }

    public function updateStatistik(Request $request)
    {
        $validated = $request->validate([
            'bg_source' => 'required|in:url,upload',
            'background_src' => 'nullable|string|max:2048',
            'bg_file_name' => 'nullable|string|max:255',
            'stats' => 'required|array',
            'stats.*.id' => 'required|string',
            'stats.*.icon' => 'required|string|max:255',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.label' => 'required|string|max:255',
        ], [
            'bg_source.required' => 'Sumber latar belakang wajib dipilih.',
            'bg_source.in' => 'Sumber latar belakang tidak valid.',
            'background_src.max' => 'URL latar belakang tidak boleh melebihi 2048 karakter.',
            'stats.required' => 'Data statistik wajib diisi.',
            'stats.array' => 'Format data statistik tidak valid.',
            'stats.*.icon.required' => 'Ikon statistik wajib diisi.',
            'stats.*.value.required' => 'Nilai statistik wajib diisi.',
            'stats.*.label.required' => 'Label statistik wajib diisi.',
        ]);

        $currentUser = $request->user();
        $statistikSection = StatistikSectionBeranda::firstOrNew();

        $backgroundSrc = $validated['background_src'];
        $bgFileName = $validated['bg_file_name'];

        if ($validated['bg_source'] === 'upload' && $request->hasFile('bg_file')) {
            $request->validate([
                'bg_file' => 'required|extensions:jpeg,png,jpg,gif,webp|max:512000', // max 500MB
            ], [
                'bg_file.required' => 'Berkas gambar latar belakang wajib diunggah.',
                'bg_file.extensions' => 'Format berkas gambar harus berupa jpeg, png, jpg, gif, atau webp.',
                'bg_file.max' => 'Ukuran berkas latar belakang tidak boleh melebihi 500 MB.',
            ]);
            $file = $request->file('bg_file');
            $path = $file->store('statistik-bg', 'public');
            $backgroundSrc = '/storage/'.$path;
            $bgFileName = $file->getClientOriginalName();
        }

        $stats = $validated['stats'];
        foreach ($stats as &$stat) {
            $stat['id'] = strip_tags($stat['id']);
            $stat['icon'] = strip_tags($stat['icon']);
            $stat['value'] = strip_tags($stat['value']);
            $stat['label'] = strip_tags($stat['label']);
        }

        $statistikSection->fill([
            'bg_source' => $validated['bg_source'],
            'background_src' => $backgroundSrc ? strip_tags($backgroundSrc) : null,
            'bg_file_name' => $bgFileName ? strip_tags($bgFileName) : null,
            'stats' => $stats,
        ]);

        $statistikSection->save();

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Statistik & Kinerja.");

        return redirect()->back()->with('success', 'Statistik section updated successfully.');
    }

    public function updatePartner(Request $request)
    {

        try {
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
        } catch (ValidationException $e) {
            \Log::error('Validation Failed (Primary):', $e->errors());
            throw $e;
        }

        $currentUser = $request->user();
        $partnerSection = PartnerSectionBeranda::firstOrNew();

        $partners = $validated['partners'];

        foreach ($partners as $index => &$partner) {
            if ($partner['logoSource'] === 'upload' && $request->hasFile("partners.{$index}.logoFile")) {
                try {
                    $request->validate([
                        "partners.{$index}.logoFile" => 'required|mimes:jpeg,png,jpg,gif,webp,svg|max:512000', // max 500MB
                    ], [
                        "partners.{$index}.logoFile.required" => 'Logo partner wajib diunggah.',
                        "partners.{$index}.logoFile.mimes" => 'Format berkas logo harus berupa jpeg, png, jpg, gif, webp, atau svg.',
                        "partners.{$index}.logoFile.max" => 'Ukuran logo tidak boleh melebihi 500 MB.',
                    ]);
                } catch (ValidationException $e) {
                    \Log::error("Validation Failed (Secondary Logo index $index):", $e->errors());
                    throw $e;
                }
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

        Notification::log($currentUser, 'success', 'Konten Diperbarui', "{$currentUser->name} memperbarui konten Partner Perusahaan.");

        return redirect()->back()->with('success', 'Partner section updated successfully.');
    }
}
