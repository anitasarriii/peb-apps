<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\DaftarPengadaan;
use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\AdminPengadaanRoleSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->seed(AdminPengadaanRoleSeeder::class);
    $this->procurementUser = User::factory()->create(['role_id' => Role::where('name', 'admin_pengadaan')->firstOrFail()->id]);
});

test('procurement seeding is additive and idempotent without changing existing users or roles', function (): void {
    $admin = Role::factory()->create(['name' => 'admin', 'permissions' => ['edit_content' => true]]);
    $user = User::factory()->create(['role_id' => $admin->id]);
    $this->seed(AdminPengadaanRoleSeeder::class);
    expect(Role::where('name', 'admin_pengadaan')->count())->toBe(1)
        ->and($admin->fresh()->permissions)->toBe(['edit_content' => true])
        ->and($user->fresh()->role_id)->toBe($admin->id)
        ->and($this->procurementUser->hasPermission('manage_procurement'))->toBeTrue()
        ->and($this->procurementUser->hasPermission('manage_roles'))->toBeFalse();
});

test('procurement login ignores forbidden intended URLs and opens its own list', function (): void {
    $this->withSession(['url.intended' => route('panel-admin.index', ['tab' => 'Data User'])])
        ->post('/login', ['email' => $this->procurementUser->email, 'password' => 'password'])
        ->assertRedirect(route('panel-admin.index', ['tab' => 'Daftar Pengadaan']));
    $this->assertAuthenticatedAs($this->procurementUser);
    $this->get(route('panel-admin.index'))->assertRedirect(route('panel-admin.index', ['tab' => 'Daftar Pengadaan']));
    $this->post('/logout')->assertRedirect('/');
    $this->assertGuest();
});

test('procurement list has no other CMS data including partial reload requests', function (): void {
    Notification::log($this->procurementUser, 'info', 'Rahasia Modul Lain', 'Konten modul lain');
    $this->actingAs($this->procurementUser)->get(route('panel-admin.index', ['tab' => 'Daftar Pengadaan']))
        ->assertOk()->assertInertia(fn ($page) => $page->component('panel-admin')
        ->has('daftarPengadaan')->missing('users')->missing('roles')->missing('permissions')
        ->missing('heroBeranda')->missing('cmsPreferences')->where('footer', null)->where('header', null)
        ->where('ctaSection', null)->has('notifications', 0));
    $version = app(HandleInertiaRequests::class)->version(request());
    $this->get(route('panel-admin.index', ['tab' => 'Daftar Pengadaan']), ['X-Inertia' => 'true', 'X-Inertia-Version' => $version, 'X-Inertia-Partial-Component' => 'panel-admin', 'X-Inertia-Partial-Data' => 'users,roles,permissions,footer,header'])
        ->assertOk()->assertJsonMissingPath('props.users')->assertJsonMissingPath('props.roles');
});

test('procurement login with two factor recovery code still opens only procurement', function (): void {
    $this->procurementUser->forceFill([
        'two_factor_secret' => encrypt('isolated-test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['isolated-recovery-code'])),
        'two_factor_confirmed_at' => now(),
    ])->save();
    $this->post('/login', ['email' => $this->procurementUser->email, 'password' => 'password'])
        ->assertRedirect(route('two-factor.login'));
    $this->post(route('two-factor.login.store'), ['recovery_code' => 'isolated-recovery-code'])
        ->assertRedirect(route('panel-admin.index', ['tab' => 'Daftar Pengadaan']));
    $this->assertAuthenticatedAs($this->procurementUser);
});

test('all other CMS tabs are forbidden even if broad permissions were accidentally assigned', function (string $tab): void {
    $this->procurementUser->role->update(['permissions' => ['manage_procurement' => true, 'manage_roles' => true, 'manage_users' => true, 'edit_content' => true, '*' => true]]);
    $this->actingAs($this->procurementUser)->get(route('panel-admin.index', ['tab' => $tab]))->assertForbidden();
})->with(['Dashboard', 'Hero Beranda', 'Tentang Kami', 'Hero Tentang Kami', 'Profil Perusahaan', 'Visi & Misi', 'Tim Kami', 'Quote Tentang', 'Partner Tentang', 'Hero Servis', 'Daftar Servis', 'Kebijakan PEB', 'Hero Kebijakan', 'Galeri Foto', 'Hero Galeri', 'Laporan Keuangan', 'Laporan Tahunan', 'Laporan Keberlanjutan', 'Hero Laporan', 'Daftar Berita', 'Hero Section Berita', 'Daftar Portfolio', 'Hero Portfolio', 'Header', 'Footer', 'Call to Action', 'Statistik', 'Partner', 'Data User', 'Data Role', 'Pengaturan', 'Profil', 'Hero Pengadaan', 'SEO Pengadaan', 'SEO Beranda', 'Unknown']);

test('every other registered CMS endpoint rejects procurement admin before validation or model binding', function (): void {
    $this->actingAs($this->procurementUser);
    $checked = 0;
    foreach (Route::getRoutes() as $route) {
        if (! str_starts_with($route->uri(), 'panel-admin') || in_array($route->getName(), ['panel-admin.index', 'panel-admin.pengadaan.daftar-section.update'], true)) {
            continue;
        }
        $uri = '/'.preg_replace('/\{[^}]+\}/', '999999', $route->uri());
        foreach (array_diff($route->methods(), ['HEAD']) as $method) {
            $this->json($method, $uri, ['role_id' => 1])->assertForbidden();
            $checked++;
        }
    }
    expect($checked)->toBeGreaterThan(40);
    $this->get('/dashboard')->assertForbidden();
    $this->get('/settings/profile')->assertForbidden();
    $this->patch('/settings/profile', ['role_id' => 1])->assertForbidden();
    $this->put('/settings/password', [])->assertForbidden();
    $this->delete('/settings/profile')->assertForbidden();
});

test('procurement admin publishes updates archives and deletes while retaining media and recording actors and status', function (): void {
    Storage::fake('public');
    $this->actingAs($this->procurementUser);
    $endpoint = route('panel-admin.pengadaan.daftar-section.update');
    $payload = ['section_title' => 'Pengadaan', 'categories' => ['Jasa'], 'items' => [[
        'id' => 'tender-1', 'title' => 'Tender langsung', 'status' => 'TERBUKA', 'isArchived' => false,
        'imageSourceType' => 'upload', 'file' => UploadedFile::fake()->image('cover.jpg'),
        'bannerFile' => UploadedFile::fake()->image('main.jpg'), 'dokumenList' => [[
            'id' => 'doc-1', 'name' => 'Persyaratan', 'sourceType' => 'upload',
            'file' => UploadedFile::fake()->create('syarat.pdf', 100, 'application/pdf'),
        ]],
    ]]];
    $this->post($endpoint, $payload)->assertRedirect()->assertSessionHasNoErrors();
    $original = DaftarPengadaan::firstOrFail()->items[0];
    $this->get(route('pengadaan'))->assertInertia(fn ($page) => $page->where('daftarPengadaan.items.0.title', 'Tender langsung'));
    $created = Notification::where('title', 'Pengadaan Dibuat')->firstOrFail();
    expect($created->user_id)->toBe($this->procurementUser->id)->and($created->created_at)->not->toBeNull();
    $payload['items'] = [array_merge($original, ['title' => 'Tender diperbarui', 'status' => 'TUTUP'])];
    $this->post($endpoint, $payload)->assertRedirect()->assertSessionHasNoErrors();
    $saved = DaftarPengadaan::firstOrFail()->items[0];
    expect($saved['imageSrc'])->toBe($original['imageSrc'])->and($saved['bannerImage'])->toBe($original['bannerImage'])
        ->and($saved['dokumenList'][0]['fileUrl'])->toBe($original['dokumenList'][0]['fileUrl']);
    $change = json_decode(Notification::where('title', 'Pengadaan Diperbarui')->latest('id')->firstOrFail()->message, true);
    expect($change['status_before'])->toBe('TERBUKA')->and($change['status_after'])->toBe('TUTUP');
    $payload['items'][0]['isArchived'] = true;
    $this->post($endpoint, $payload)->assertSessionHasNoErrors();
    $this->get(route('pengadaan'))->assertInertia(fn ($page) => $page->where('daftarPengadaan.items.0.isArchived', true));
    $this->get(route('pengadaan.detail', ['id' => 'tender-1']))->assertInertia(fn ($page) => $page->where('item.title', 'Tender diperbarui'));
    $payload['items'] = [];
    $this->post($endpoint, $payload)->assertSessionHasNoErrors();
    expect(DaftarPengadaan::firstOrFail()->items)->toBe([]);
    $this->get(route('pengadaan.detail', ['id' => 'tender-1']))->assertNotFound();
    expect(Notification::where('title', 'Pengadaan Dihapus')->where('user_id', $this->procurementUser->id)->exists())->toBeTrue();
});

test('super admin can assign procurement role and retains normal access', function (): void {
    $super = User::factory()->create(['role_id' => Role::factory()->create(['name' => 'super_admin'])->id]);
    $target = User::factory()->create();
    $this->actingAs($super)->put(route('panel-admin.users.update', $target), [
        'name' => $target->name, 'email' => $target->email, 'role_id' => $this->procurementUser->role_id, 'status' => 'Aktif',
    ])->assertSessionHasNoErrors();
    expect($target->fresh()->role->name)->toBe('admin_pengadaan');
    foreach (['Dashboard', 'Daftar Pengadaan', 'Data User', 'Data Role', 'Pengaturan', 'Galeri Foto'] as $tab) {
        $this->get(route('panel-admin.index', ['tab' => $tab]))->assertOk();
    }
    $this->get(route('panel-admin.roles.index'))->assertOk();
    $role = $this->procurementUser->role;
    $this->put(route('panel-admin.roles.update', $role), ['name' => 'admin_pengadaan', 'label' => 'Admin Pengadaan', 'permissions' => ['manage_users' => true]])->assertSessionHasNoErrors();
    expect($role->fresh()->permissions)->toBe(['manage_procurement' => true]);
    $this->delete(route('panel-admin.roles.destroy', $role))->assertForbidden();
    $this->put(route('panel-admin.roles.update', $role), ['name' => 'renamed_procurement', 'label' => 'Rename', 'permissions' => ['manage_users' => true]])->assertUnprocessable();
    expect($role->fresh()->name)->toBe('admin_pengadaan');
});

test('public registration remains unavailable and procurement permission can be revoked', function (): void {
    $this->get('/register')->assertNotFound();
    $this->post('/register', [])->assertNotFound();
    $this->procurementUser->role->update(['permissions' => ['manage_procurement' => false]]);
    $this->actingAs($this->procurementUser)->get(route('panel-admin.index'))->assertForbidden();
    $this->postJson(route('panel-admin.pengadaan.daftar-section.update'), [])->assertForbidden();
});
