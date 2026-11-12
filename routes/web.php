<?php

use App\Http\Controllers\Admin\CmsPreferencesController;
use App\Http\Controllers\Admin\MasterData\RoleController;
use App\Http\Controllers\Admin\MasterData\UserController;
use App\Http\Controllers\Admin\PanelAdminBerandaController;
use App\Http\Controllers\Admin\PanelAdminBeritaController;
use App\Http\Controllers\Admin\PanelAdminController;
use App\Http\Controllers\Admin\PanelAdminCtaController;
use App\Http\Controllers\Admin\PanelAdminFooterController;
use App\Http\Controllers\Admin\PanelAdminGaleriController;
use App\Http\Controllers\Admin\PanelAdminHeaderController;
use App\Http\Controllers\Admin\PanelAdminKebijakanController;
use App\Http\Controllers\Admin\PanelAdminKontakController;
use App\Http\Controllers\Admin\PanelAdminLaporanController;
use App\Http\Controllers\Admin\PanelAdminPengadaanController;
use App\Http\Controllers\Admin\PanelAdminPortfolioController;
use App\Http\Controllers\Admin\PanelAdminServisController;
use App\Http\Controllers\Admin\PanelAdminTentangController;
use App\Http\Controllers\Admin\SeoMetaController;
use App\Http\Controllers\BerandaController;
use App\Http\Controllers\BeritaAcaraController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\KebijakanController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ServisController;
use App\Http\Controllers\TentangKamiController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BerandaController::class, 'index'])->name('home');

Route::get('/beranda', [BerandaController::class, 'index'])->name('beranda');
Route::get('/tentang-kami', [TentangKamiController::class, 'index'])->name('tentang-kami');
Route::get('/servis', [ServisController::class, 'index'])->name('servis');
Route::get('/servis/detail', [ServisController::class, 'detail'])->name('servis.detail');
Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri');
Route::get('/kebijakan', [KebijakanController::class, 'index'])->name('kebijakan');
Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
Route::get('/pengadaan', [PengadaanController::class, 'index'])->name('pengadaan');
Route::get('/pengadaan/detail', [PengadaanController::class, 'detail'])->name('pengadaan.detail');
Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan');
Route::get('/laporan/detail', [LaporanController::class, 'detail'])->name('laporan.detail');
Route::get('/berita-acara', [BeritaAcaraController::class, 'index'])->name('berita-acara');
Route::get('/berita-acara/detail', [BeritaAcaraController::class, 'detail'])->name('berita-acara.detail');
Route::get('/kontak', [KontakController::class, 'index'])->name('kontak');
Route::post('/kontak', [KontakController::class, 'store'])->name('kontak.store');

Route::middleware(['auth', 'verified'])->prefix('panel-admin')->name('panel-admin.')->group(function () {
    Route::get('/', [PanelAdminController::class, 'index'])->name('index');
    Route::post('/preferences', [CmsPreferencesController::class, 'update'])->name('preferences.update');

    Route::prefix('beranda')->name('beranda.')->group(function () {
        Route::post('/hero-section', [PanelAdminBerandaController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/about-section', [PanelAdminBerandaController::class, 'updateAbout'])->name('about-section.update');
        Route::post('/layanan-section', [PanelAdminBerandaController::class, 'updateLayanan'])->name('layanan-section.update');
        Route::post('/portfolio-section', [PanelAdminBerandaController::class, 'updatePortfolio'])->name('portfolio-section.update');
        Route::post('/statistik-section', [PanelAdminBerandaController::class, 'updateStatistik'])->name('statistik-section.update');
        Route::post('/partner-section', [PanelAdminBerandaController::class, 'updatePartner'])->name('partner-section.update');
    });

    // Route CTA independen — tidak terikat grup beranda
    Route::post('/cta-section', [PanelAdminCtaController::class, 'update'])->name('cta-section.update');

    // Route Footer global
    Route::post('/footer', [PanelAdminFooterController::class, 'update'])->name('footer.update');

    // Route Header global
    Route::post('/header', [PanelAdminHeaderController::class, 'update'])->name('header.update');

    Route::prefix('tentang')->name('tentang.')->group(function () {
        Route::post('/hero-section', [PanelAdminTentangController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/profil-section', [PanelAdminTentangController::class, 'updateProfil'])->name('profil-section.update');
        Route::post('/visi-misi-section', [PanelAdminTentangController::class, 'updateVisiMisi'])->name('visi-misi-section.update');
        Route::post('/tim-section', [PanelAdminTentangController::class, 'updateTim'])->name('tim-section.update');
        Route::post('/quote-section', [PanelAdminTentangController::class, 'updateQuote'])->name('quote-section.update');
        Route::post('/partner-section', [PanelAdminTentangController::class, 'updatePartner'])->name('partner-section.update');
    });

    Route::prefix('servis')->name('servis.')->group(function () {
        Route::post('/hero-section', [PanelAdminServisController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/hero-detail-section', [PanelAdminServisController::class, 'updateHeroDetail'])->name('hero-detail-section.update');
        Route::post('/daftar-section', [PanelAdminServisController::class, 'updateDaftar'])->name('daftar-section.update');
    });

    Route::prefix('kebijakan')->name('kebijakan.')->group(function () {
        Route::post('/hero-section', [PanelAdminKebijakanController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/kebijakan-peb', [PanelAdminKebijakanController::class, 'updateKebijakanPeb'])->name('kebijakan-peb.update');
    });

    Route::prefix('galeri')->name('galeri.')->group(function () {
        Route::post('/hero-section', [PanelAdminGaleriController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/galeri-foto', [PanelAdminGaleriController::class, 'updateGaleriFoto'])->name('galeri-foto.update');
    });

    Route::prefix('portfolio')->name('portfolio.')->group(function () {
        Route::post('/hero-section', [PanelAdminPortfolioController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/daftar-section', [PanelAdminPortfolioController::class, 'updateDaftarPortfolio'])->name('daftar-section.update');
    });

    Route::prefix('laporan')->name('laporan.')->group(function () {
        Route::post('/hero-section', [PanelAdminLaporanController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/keuangan-section', [PanelAdminLaporanController::class, 'updateKeuangan'])->name('keuangan-section.update');
        Route::post('/tahunan-section', [PanelAdminLaporanController::class, 'updateTahunan'])->name('tahunan-section.update');
    });

    Route::prefix('berita')->name('berita.')->group(function () {
        Route::post('/hero-section', [PanelAdminBeritaController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/daftar-section', [PanelAdminBeritaController::class, 'updateDaftar'])->name('daftar-section.update');
    });

    Route::prefix('pengadaan')->name('pengadaan.')->group(function () {
        Route::post('/hero-section', [PanelAdminPengadaanController::class, 'updateHero'])->name('hero-section.update');
        Route::post('/daftar-section', [PanelAdminPengadaanController::class, 'updateDaftar'])->name('daftar-section.update');
    });

    Route::prefix('kontak')->name('kontak.')->group(function () {
        Route::post('/hero-section', [PanelAdminKontakController::class, 'updateHero'])->name('hero-section.update');
        Route::patch('/pesan-masuk/{contactMessage}/read', [PanelAdminKontakController::class, 'toggleRead'])->name('pesan-masuk.read');
        Route::post('/pesan-masuk/read-all', [PanelAdminKontakController::class, 'markAllRead'])->name('pesan-masuk.read-all');
        Route::delete('/pesan-masuk/{contactMessage}', [PanelAdminKontakController::class, 'destroyMessage'])->name('pesan-masuk.destroy');
    });

    Route::post('/seo-meta/{page_type}', [SeoMetaController::class, 'update'])->name('seo-meta.update');
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('panel-admin.index');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
