<?php

use App\Models\AboutSectionBeranda;
use App\Models\CtaSection;
use App\Models\Footer;
use App\Models\HeroSectionBeranda;
use App\Models\LayananSectionBeranda;
use App\Models\PartnerSectionBeranda;
use App\Models\PortfolioSectionBeranda;
use App\Models\SeoMeta;
use App\Models\StatistikSectionBeranda;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('renders the public beranda page with fallback data when database is empty', function () {
    $response = $this->get(route('beranda'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('beranda')
        ->where('heroSection', null)
        ->where('aboutSection', null)
        ->where('layananSection', null)
        ->where('statistikSection', null)
        ->where('partnerSection', null)
        ->where('portfolioSection', null)
        ->where('seoMeta', null)
        ->where('ctaSection', null)
        ->where('footer', null)
    );
});

it('renders the public beranda page with configured hero, about, layanan, and seo database data', function () {
    // Create admin user for relation
    $user = User::factory()->create();

    // Create hero data
    $hero = HeroSectionBeranda::create([
        'user_id' => $user->id,
        'title' => 'Judul Hero Custom',
        'subtitle' => 'Subtitle Hero Custom',
        'cta_label' => 'Mulai Sekarang',
        'cta_href' => '/mulai',
        'secondary_cta_label' => 'Info Lanjut',
        'secondary_cta_href' => '/info',
        'carousel_items' => [
            ['id' => 'slide-1', 'type' => 'image', 'url' => 'https://example.com/custom-image.jpg', 'label' => 'Kantor PT PEB'],
        ],
    ]);

    // Create about data
    $about = AboutSectionBeranda::create([
        'title' => 'Judul Tentang Custom',
        'subtitle' => 'Subtitle Tentang Custom',
        'slogan_text' => 'Slogan Tentang Custom',
        'media_type' => 'video',
        'media_source_type' => 'url',
        'media_url' => 'https://example.com/custom-video.mp4',
        'media_file_name' => '',
        'efisiensi' => [
            'label' => 'EFISIENSI CUSTOM',
            'value' => '99%',
            'description' => 'Deskripsi Efisiensi Custom',
        ],
        'inovatif' => [
            'label' => 'INOVATIF CUSTOM',
            'value' => '90%',
            'description' => 'Deskripsi Inovatif Custom',
        ],
    ]);

    // Create layanan data
    $layanan = LayananSectionBeranda::create([
        'title' => 'Judul Layanan Custom',
        'services' => [
            [
                'id' => 'layanan-1',
                'icon' => 'Zap',
                'title' => 'Layanan Kilat',
                'description' => 'Deskripsi layanan kilat custom',
            ],
        ],
    ]);

    // Create statistik data
    $statistik = StatistikSectionBeranda::create([
        'background_src' => 'https://example.com/custom-bg.jpg',
        'bg_source' => 'url',
        'stats' => [
            ['id' => 'stat-1', 'icon' => 'Users', 'value' => '100', 'label' => 'Tim Kami'],
            ['id' => 'stat-2', 'icon' => 'MapPin', 'value' => '25', 'label' => 'Lokasi'],
        ],
    ]);

    // Create partner data
    $partner = PartnerSectionBeranda::create([
        'title' => 'Mitra Unggulan Kami',
        'partners' => [
            ['id' => 'p-1', 'name' => 'PLN Batam', 'logoSrc' => '', 'logoSource' => 'none'],
            ['id' => 'p-2', 'name' => 'Pertamina', 'logoSrc' => 'https://example.com/pertamina.png', 'logoSource' => 'url'],
        ],
    ]);

    $portfolio = PortfolioSectionBeranda::create([
        'title' => 'Portofolio Energi PEB',
        'description' => 'Daftar proyek energi unggulan PEB.',
        'cta_label' => 'Lihat Portofolio',
        'projects' => [
            [
                'id' => 'project-1',
                'title' => 'Proyek Energi Batam',
                'category' => 'Energi',
                'year' => '2026',
                'image' => '/assets/project.jpg',
                'imageSource' => 'url',
            ],
        ],
    ]);

    // Create SEO data
    $seo = SeoMeta::create([
        'page_type' => 'beranda',
        'meta_title' => 'Judul SEO Custom',
        'meta_description' => 'Deskripsi SEO Custom',
        'meta_keywords' => 'custom, seo',
        'author' => 'PT PEB Custom',
        'robots_index' => 'noindex',
        'robots_follow' => 'nofollow',
        'og_title' => 'Judul OG Custom',
        'og_description' => 'Deskripsi OG Custom',
        'image_source_type' => 'url',
        'og_image' => 'https://example.com/custom-og.jpg',
    ]);

    // Create CTA data
    $cta = CtaSection::create([
        'text' => 'Teks CTA Eksklusif',
        'button_label' => 'Hubungi Kami Segera',
        'button_href' => '/kontak-cepat',
        'bg_source' => 'url',
        'background_src' => 'https://example.com/custom-cta-bg.jpg',
        'bg_file_name' => '',
    ]);

    // Create Footer data
    $footer = Footer::create([
        'logo_source_type' => 'url',
        'logo_src' => 'https://example.com/custom-logo.png',
        'logo_file_name' => '',
        'description' => 'Energi baru untuk Batam.',
        'socials' => [
            ['id' => '1', 'platform' => 'Facebook', 'href' => 'https://facebook.com/peb'],
        ],
        'explore_links' => [
            ['id' => '1', 'label' => 'Kontak', 'href' => '/kontak'],
        ],
        'address' => 'Batam, Indonesia',
        'phone' => '021-123456',
        'email' => 'contact@peb.co.id',
        'subscribe_heading' => 'Berlangganan',
        'subscribe_description' => 'Berlangganan berita terbaru.',
        'subscribe_button_label' => 'Kirim',
        'copyright_text' => 'Copyright 2026 PT PEB',
        'privacy_href' => '/privacy',
        'tos_href' => '/tos',
    ]);

    $response = $this->get(route('beranda'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('beranda')
        ->has('heroSection', fn (Assert $page) => $page
            ->where('title', 'Judul Hero Custom')
            ->where('subtitle', 'Subtitle Hero Custom')
            ->where('cta_label', 'Mulai Sekarang')
            ->where('cta_href', '/mulai')
            ->where('secondary_cta_label', 'Info Lanjut')
            ->where('secondary_cta_href', '/info')
            ->where('carousel_items.0.label', 'Kantor PT PEB')
            ->has('carousel_items', 1)
            ->etc()
        )
        ->has('aboutSection', fn (Assert $page) => $page
            ->where('title', 'Judul Tentang Custom')
            ->where('subtitle', 'Subtitle Tentang Custom')
            ->where('slogan_text', 'Slogan Tentang Custom')
            ->where('media_type', 'video')
            ->where('media_url', 'https://example.com/custom-video.mp4')
            ->where('efisiensi.label', 'EFISIENSI CUSTOM')
            ->where('efisiensi.value', '99%')
            ->where('inovatif.label', 'INOVATIF CUSTOM')
            ->where('inovatif.value', '90%')
            ->etc()
        )
        ->has('layananSection', fn (Assert $page) => $page
            ->where('title', 'Judul Layanan Custom')
            ->has('services', 1, fn (Assert $page) => $page
                ->where('id', 'layanan-1')
                ->where('icon', 'Zap')
                ->where('title', 'Layanan Kilat')
                ->where('description', 'Deskripsi layanan kilat custom')
            )
            ->etc()
        )
        ->has('statistikSection', fn (Assert $page) => $page
            ->where('background_src', 'https://example.com/custom-bg.jpg')
            ->where('bg_source', 'url')
            ->has('stats', 2, fn (Assert $page) => $page
                ->where('id', 'stat-1')
                ->where('icon', 'Users')
                ->where('value', '100')
                ->where('label', 'Tim Kami')
            )
            ->etc()
        )
        ->has('partnerSection', fn (Assert $page) => $page
            ->where('title', 'Mitra Unggulan Kami')
            ->has('partners', 2, fn (Assert $page) => $page
                ->where('id', 'p-1')
                ->where('name', 'PLN Batam')
                ->where('logoSrc', '')
                ->where('logoSource', 'none')
            )
            ->etc()
        )
        ->has('portfolioSection', fn (Assert $page) => $page
            ->where('title', 'Portofolio Energi PEB')
            ->where('description', 'Daftar proyek energi unggulan PEB.')
            ->has('projects', 1, fn (Assert $page) => $page
                ->where('id', 'project-1')
                ->where('title', 'Proyek Energi Batam')
                ->where('category', 'Energi')
                ->where('year', '2026')
                ->etc()
            )
            ->etc()
        )
        ->has('seoMeta', fn (Assert $page) => $page
            ->where('meta_title', 'Judul SEO Custom')
            ->where('meta_description', 'Deskripsi SEO Custom')
            ->where('robots_index', 'noindex')
            ->where('robots_follow', 'nofollow')
            ->where('og_title', 'Judul OG Custom')
            ->etc()
        )
        ->has('ctaSection', fn (Assert $page) => $page
            ->where('text', 'Teks CTA Eksklusif')
            ->where('button_label', 'Hubungi Kami Segera')
            ->where('button_href', '/kontak-cepat')
            ->where('background_src', 'https://example.com/custom-cta-bg.jpg')
            ->etc()
        )
        ->has('footer', fn (Assert $page) => $page
            ->where('description', 'Energi baru untuk Batam.')
            ->where('address', 'Batam, Indonesia')
            ->where('phone', '021-123456')
            ->where('email', 'contact@peb.co.id')
            ->etc()
        )
    );
});
