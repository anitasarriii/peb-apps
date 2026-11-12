<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

test('master data update and search are measured without changing credentials or permissions', function (string $kind): void {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $target = $kind === 'users' ? User::factory()->create(['role_id' => $role->id]) : Role::factory()->create(['name' => 'benchmark_role']);
    $password = $kind === 'users' ? $target->password : null;
    $tab = $kind === 'users' ? 'Data User' : 'Data Role';
    $this->actingAs($user);
    $headers = ['X-Inertia' => 'true', 'X-Inertia-Version' => app(HandleInertiaRequests::class)->version(Request::create('/'))];
    $phase = getenv('CMS_MASTER_PHASE');
    if ($phase === 'after') {
        $headers['X-Inertia-Partial-Component'] = 'panel-admin';
        $headers['X-Inertia-Partial-Data'] = $kind.',filters';
    }
    $samples = [];
    for ($iteration = 0; $iteration < 5; $iteration++) {
        $payload = $kind === 'users'
            ? ['name' => 'Renamed '.$iteration, 'email' => $target->email, 'role_id' => $role->id, 'status' => 'Aktif']
            : ['name' => 'benchmark_role', 'label' => 'Renamed '.$iteration, 'description' => 'Renamed '.$iteration, 'permissions' => ['view_content' => true]];
        DB::enableQueryLog();
        DB::flushQueryLog();
        $start = hrtime(true);
        $this->put(route('panel-admin.'.$kind.'.update', $target), $payload)->assertRedirect()->assertSessionHasNoErrors();
        $save = (hrtime(true) - $start) / 1e6;
        $saveQueries = DB::getQueryLog();
        DB::flushQueryLog();
        $start = hrtime(true);
        $this->get(route('panel-admin.index', ['tab' => $tab, 'search' => 'Renamed']), $headers)->assertOk()->assertJsonPath('props.'.$kind.'.total', 1);
        $reload = (hrtime(true) - $start) / 1e6;
        $queries = DB::getQueryLog();
        DB::disableQueryLog();
        $samples[] = ['save_ms' => round($save, 3), 'redirect_get_ms' => round($reload, 3), 'save_queries' => count($saveQueries), 'get_queries' => count($queries), 'get_db_ms' => round(array_sum(array_column($queries, 'time')), 3)];
    }
    if ($kind === 'users') {
        expect($target->refresh()->password)->toBe($password);
    }
    if ($phase) {
        $path = base_path('docs/cms-master-'.$phase.'.json');
        $results = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
        $results[$kind] = ['environment' => 'isolated SQLite; master baseline after shared middleware optimization', 'samples' => $samples];
        file_put_contents($path, json_encode($results, JSON_PRETTY_PRINT));
    }
})->with(['users', 'roles']);

test('CMS saves are measured against an isolated database and public reads see the committed content', function (string $name, string $routeName, string $tab, string $table, array $payload, string $publicRoute, string $publicField): void {
    expect(config('database.default'))->toBe('sqlite')
        ->and(config('database.connections.sqlite.database'))->toBe(':memory:');
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $this->actingAs($user);
    $headers = ['X-Inertia' => 'true', 'X-Inertia-Version' => app(HandleInertiaRequests::class)->version(Request::create('/'))];
    $adminUrl = route('panel-admin.index', ['tab' => $tab]);
    $routeParameters = str_contains($routeName, 'seo-meta') ? ['page_type' => 'kebijakan'] : [];
    $saveUrl = route($routeName, $routeParameters);
    $this->from($adminUrl)->post($saveUrl, $payload)->assertRedirect()->assertSessionHasNoErrors();
    $this->get($adminUrl)->assertOk();

    $samples = [];
    for ($iteration = 0; $iteration < 5; $iteration++) {
        DB::enableQueryLog();
        DB::flushQueryLog();
        $start = hrtime(true);
        $this->from($adminUrl)->post($saveUrl, $payload)->assertRedirect()->assertSessionHasNoErrors();
        $saveMs = (hrtime(true) - $start) / 1e6;
        $saveQueries = DB::getQueryLog();
        DB::flushQueryLog();
        $start = hrtime(true);
        $reloadHeaders = $headers;
        if (getenv('CMS_PERFORMANCE_PHASE') === 'after') {
            $reloadHeaders['X-Inertia-Partial-Component'] = 'panel-admin';
            $reloadHeaders['X-Inertia-Partial-Data'] = explode('.', $publicField)[0].',flash,notifications';
        }
        $response = $this->get($adminUrl, $reloadHeaders);
        $response->assertOk();
        $reloadMs = (hrtime(true) - $start) / 1e6;
        $reloadQueries = DB::getQueryLog();
        DB::disableQueryLog();
        $samples[] = [
            'save_ms' => round($saveMs, 3), 'redirect_get_ms' => round($reloadMs, 3),
            'save_db_ms' => round(array_sum(array_column($saveQueries, 'time')), 3),
            'get_db_ms' => round(array_sum(array_column($reloadQueries, 'time')), 3),
            'save_queries' => count($saveQueries), 'get_queries' => count($reloadQueries),
            'response_bytes' => strlen($response->getContent()),
        ];
    }
    expect(DB::table($table)->count())->toBe(1);
    $this->get(route($publicRoute), $headers)->assertOk()->assertJsonPath('props.'.$publicField, $payload[array_key_first($payload)]);
    if ($publicRoute === 'portfolio') {
        $this->get(route('home'), $headers)->assertOk()->assertJsonPath('props.daftarPortfolioSection.section_title', $payload['section_title']);
    }
    if ($table === 'footers') {
        $this->get(route('servis'), $headers)->assertOk()->assertJsonPath('props.footer.description', $payload['description']);
    }

    if ($phase = getenv('CMS_PERFORMANCE_PHASE')) {
        $path = base_path('docs/cms-performance-'.$phase.'.json');
        $results = file_exists($path) ? json_decode(file_get_contents($path), true) : [];
        $results[$name] = ['environment' => 'PHP feature HTTP kernel; SQLite :memory:; five warm samples; no upload', 'samples' => $samples];
        file_put_contents($path, json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
})->with([
    'hero' => ['Beranda Hero', 'panel-admin.beranda.hero-section.update', 'Hero Beranda', 'hero_section_berandas', ['title' => 'Benchmark hero', 'subtitle' => 'Deskripsi', 'cta_label' => 'Lihat', 'cta_href' => '/servis', 'secondary_cta_label' => '', 'secondary_cta_href' => '', 'carousel_items' => [['id' => 'slide', 'type' => 'image', 'sourceType' => 'url', 'url' => '/image.jpg']]], 'home', 'heroSection.title'],
    'about' => ['Beranda About', 'panel-admin.beranda.about-section.update', 'Tentang Kami', 'about_section_berandas', ['title' => 'Benchmark about', 'subtitle' => 'Deskripsi', 'slogan_text' => 'Energi', 'media_type' => 'image', 'media_source_type' => 'url', 'media_url' => '/image.jpg', 'media_file_name' => '', 'efisiensi' => ['label' => 'Efisiensi', 'value' => '90', 'description' => 'Efisien'], 'inovatif' => ['label' => 'Inovasi', 'value' => '90', 'description' => 'Inovatif']], 'home', 'aboutSection.title'],
    'services' => ['Servis', 'panel-admin.servis.daftar-section.update', 'Daftar Servis', 'daftar_servis_sections', ['title' => 'Benchmark servis', 'services' => [['id' => 'service', 'title' => 'Servis', 'description' => 'Deskripsi', 'imageSrc' => '/image.jpg', 'imageSourceType' => 'url']]], 'servis', 'daftarServisSection.title'],
    'policy' => ['Kebijakan', 'panel-admin.kebijakan.kebijakan-peb.update', 'Kebijakan PEB', 'kebijakan_peb_sections', ['title' => 'Benchmark kebijakan', 'cards' => [['id' => 'card', 'title' => 'Kebijakan', 'subtitle' => 'Subjudul', 'description' => 'Deskripsi', 'signedBy' => 'Direksi', 'role' => 'Direktur', 'date' => '2026-11-03']]], 'kebijakan', 'kebijakanPebSection.title'],
    'seo' => ['SEO Kebijakan', 'panel-admin.seo-meta.update', 'SEO Kebijakan', 'seo_metas', ['meta_title' => 'Benchmark SEO', 'meta_description' => 'Deskripsi', 'meta_keywords' => '', 'author' => '', 'robots_index' => 'index', 'robots_follow' => 'follow', 'og_title' => 'OG', 'og_description' => 'Deskripsi', 'image_source_type' => 'url', 'og_image' => '', 'image_file_name' => ''], 'kebijakan', 'seoMeta.meta_title'],
    'gallery' => ['Galeri', 'panel-admin.galeri.galeri-foto.update', 'Galeri Foto', 'galeri_foto_sections', ['section_title' => 'Benchmark galeri', 'categories' => ['Umum'], 'items' => [['id' => 'photo', 'title' => 'Foto', 'category' => 'Umum', 'location' => 'Batam', 'imageSrc' => '/image.jpg']]], 'galeri', 'galeriFotoSection.section_title'],
    'finance' => ['Laporan Keuangan', 'panel-admin.laporan.keuangan-section.update', 'Laporan Keuangan', 'laporan_keuangan_sections', ['section_title' => 'Benchmark keuangan', 'section_desc' => 'Deskripsi', 'items' => [['id' => 'report', 'title' => 'Laporan', 'subtitle' => 'Deskripsi', 'date' => '2026-11-03', 'imageSrc' => '', 'poinUtamaList' => [], 'dokumenList' => []]]], 'laporan', 'laporanKeuanganSection.section_title'],
    'annual' => ['Laporan Tahunan', 'panel-admin.laporan.tahunan-section.update', 'Laporan Tahunan', 'laporan_tahunan_sections', ['section_title' => 'Benchmark tahunan', 'section_desc' => 'Deskripsi', 'annual_reports' => [['id' => 'annual', 'title' => 'Tahunan', 'subtitle' => '', 'badge' => '2026', 'imageSrc' => '', 'fileUrl' => '', 'fileSize' => '']], 'keberlanjutan_items' => []], 'laporan', 'laporanTahunanSection.section_title'],
    'procurement' => ['Pengadaan', 'panel-admin.pengadaan.daftar-section.update', 'Daftar Pengadaan', 'daftar_pengadaans', ['section_title' => 'Benchmark pengadaan', 'categories' => ['Jasa'], 'items' => [['id' => 'procurement', 'title' => 'Pengadaan', 'status' => 'TERBUKA', 'category' => 'Jasa', 'startDate' => '2026-11-03', 'endDate' => '2026-12-03', 'location' => 'Batam']]], 'pengadaan', 'daftarPengadaan.section_title'],
    'portfolio' => ['Portofolio', 'panel-admin.portfolio.daftar-section.update', 'Daftar Portfolio', 'daftar_portfolio_sections', ['section_title' => 'Benchmark portfolio', 'categories' => ['gas'], 'items' => [['id' => 'project', 'title' => 'Proyek', 'category' => 'gas', 'badge' => '2026', 'date' => '2026', 'description' => 'Deskripsi', 'imageSrc' => '', 'client' => 'PEB', 'location' => 'Batam', 'efficiency' => '90']]], 'portfolio', 'daftarPortfolioSection.section_title'],
    'cta' => ['CTA', 'panel-admin.cta-section.update', 'Call to Action', 'cta_sections', ['text' => 'Benchmark CTA', 'button_label' => 'Kontak', 'button_href' => '/kontak', 'bg_source' => 'url', 'background_src' => '', 'bg_file_name' => ''], 'home', 'ctaSection.text'],
    'footer' => ['Footer', 'panel-admin.footer.update', 'Footer', 'footers', ['description' => 'Benchmark footer', 'logo_source_type' => 'url', 'logo_src' => '', 'logo_file_name' => '', 'socials' => [['id' => 'social', 'platform' => 'Facebook', 'href' => 'https://example.com']], 'explore_links' => [['id' => 'link', 'label' => 'Kontak', 'href' => '/kontak']], 'address' => 'Batam', 'phone' => '123', 'email' => 'test@example.com', 'subscribe_heading' => 'Berlangganan', 'subscribe_description' => 'Informasi', 'subscribe_button_label' => 'Kirim', 'copyright_text' => 'PEB', 'privacy_href' => '/', 'tos_href' => '/'], 'home', 'footer.description'],
]);
