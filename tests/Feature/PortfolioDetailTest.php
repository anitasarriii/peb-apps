<?php

use App\Models\DaftarPortfolioSection;
use App\Models\PortfolioSectionBeranda;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    DaftarPortfolioSection::create([
        'section_title' => 'Portofolio',
        'categories' => ['gas'],
        'items' => [[
            'id' => '1',
            'title' => 'Proyek halaman Portofolio',
            'category' => 'gas',
            'description' => 'Deskripsi proyek utama',
            'client' => 'Klien proyek',
            'location' => 'Batam',
            'date' => '2025',
            'imageSrc' => '/main.jpg',
        ]],
    ]);
    PortfolioSectionBeranda::create([
        'title' => 'Proyek Beranda',
        'description' => 'Pilihan proyek',
        'cta_label' => 'Lihat proyek',
        'projects' => [[
            'id' => '1',
            'title' => 'Proyek khusus Beranda',
            'category' => 'ENERGI TERBARUKAN',
            'year' => '2026',
            'image' => '/homepage.jpg',
        ]],
    ]);
});

test('portfolio page provides project details for the popup', function (): void {
    $this->get(route('portfolio'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('portfolio')
        ->where('daftarPortfolioSection.items.0.title', 'Proyek halaman Portofolio')
        ->where('daftarPortfolioSection.items.0.description', 'Deskripsi proyek utama')
        ->where('daftarPortfolioSection.items.0.client', 'Klien proyek')
    );
});

test('homepage uses the same complete portfolio data as the portfolio page', function (): void {
    $items = DaftarPortfolioSection::firstOrFail()->items;
    $this->get(route('home'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('beranda')
        ->where('daftarPortfolioSection.items', $items)
        ->where('daftarPortfolioSection.section_title', 'Portofolio')
    );
});

test('updating the portfolio data is reflected on both public pages', function (): void {
    $section = DaftarPortfolioSection::firstOrFail();
    $items = $section->items;
    $items[0]['title'] = 'Proyek yang diperbarui';
    $items[0]['description'] = 'Deskripsi detail terbaru';
    $section->update(['items' => $items]);

    foreach (['home' => 'beranda', 'portfolio' => 'portfolio'] as $route => $component) {
        $this->get(route($route))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component($component)
            ->where('daftarPortfolioSection.items', $items)
        );
    }
});

test('both admin portfolio tabs manage the same portfolio records', function (): void {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $items = DaftarPortfolioSection::firstOrFail()->items;

    foreach (['Portofolio', 'Daftar Portfolio'] as $tab) {
        $this->actingAs($user)->get(route('panel-admin.index', ['tab' => $tab]))
            ->assertOk()->assertInertia(fn (Assert $page) => $page
                ->where('daftarPortfolioSection.items', $items)
            );
    }
});

test('portfolio no longer exposes the standalone detail page', function (): void {
    $this->get('/portfolio/detail?id=1')->assertNotFound();
});
