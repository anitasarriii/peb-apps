<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

function cmsPreferencePayload(): array
{
    return array_merge(array_fill_keys(['sidebarCollapsed', 'compactMode', 'animationsEnabled', 'emailNotif', 'browserNotif', 'procurementAlert', 'reportAlert', 'userActivityAlert', 'systemAlert', 'twoFactor', 'loginNotif', 'maintenanceMode', 'debugMode', 'cacheEnabled', 'autoBackup'], false), [
        'themeMode' => 'light', 'language' => 'Indonesia', 'timezone' => 'Asia/Jakarta (WIB)',
        'sessionTimeout' => '60 Menit', 'ipWhitelist' => '', 'backupFrequency' => 'Harian',
    ]);
}

test('preferences are persisted per user and read back from the server without changing authentication', function (): void {
    Storage::fake('local');
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $payload = cmsPreferencePayload();
    $payload['compactMode'] = true;
    $payload['twoFactor'] = true;
    $samples = [];
    for ($iteration = 0; $iteration < 5; $iteration++) {
        $start = hrtime(true);
        $this->actingAs($user)->from(route('panel-admin.index', ['tab' => 'Pengaturan']))
            ->post(route('panel-admin.preferences.update'), $payload)->assertRedirect()->assertSessionHasNoErrors();
        $save = (hrtime(true) - $start) / 1e6;
        $start = hrtime(true);
        $this->get(route('panel-admin.index', ['tab' => 'Pengaturan']))
            ->assertOk()->assertInertia(fn ($page) => $page->where('cmsPreferences.compactMode', true)->where('cmsPreferences.themeMode', 'light'));
        $samples[] = ['save_ms' => round($save, 3), 'redirect_get_ms' => round((hrtime(true) - $start) / 1e6, 3)];
    }
    expect(Storage::disk('local')->json('cms-preferences-'.$user->id.'.json')['compactMode'])->toBeTrue()
        ->and($user->refresh()->two_factor_secret)->toBeNull();
    $other = User::factory()->create(['role_id' => $role->id]);
    $this->actingAs($other)->get(route('panel-admin.index', ['tab' => 'Pengaturan']))
        ->assertInertia(fn ($page) => $page->where('cmsPreferences', []));
    if (getenv('CMS_PERFORMANCE_PHASE') === 'after') {
        file_put_contents(base_path('docs/cms-preferences-after.json'), json_encode(['samples' => $samples, 'storage' => 'isolated fake local disk; atomic file replacement'], JSON_PRETTY_PRINT));
    }
});

test('a preference storage error never returns a success notification', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    File::partialMock()->shouldReceive('replace')->once()->andThrow(new RuntimeException('Test write failure'));
    $this->actingAs($user)->post(route('panel-admin.preferences.update'), cmsPreferencePayload())
        ->assertStatus(500)->assertSessionMissing('success');
    Storage::disk('local')->assertMissing('cms-preferences-'.$user->id.'.json');
});

test('redirect-only CMS saves do not query unrelated shared content', function (): void {
    $user = User::factory()->create(['role_id' => Role::factory()->create(['name' => 'super_admin'])->id]);
    DB::enableQueryLog();
    $this->actingAs($user)->post(route('panel-admin.cta-section.update'), [
        'text' => 'Baru', 'button_label' => 'Kontak', 'button_href' => '/kontak',
        'bg_source' => 'url', 'background_src' => '', 'bg_file_name' => '',
    ])->assertRedirect()->assertSessionHasNoErrors();
    $queries = collect(DB::getQueryLog())->pluck('query')->implode(' ');
    DB::disableQueryLog();
    expect($queries)->not->toContain('"footers"')->not->toContain('"headers"');
});

test('a successful collection save redirects straight to its list with no second form GET', function (): void {
    $user = User::factory()->create(['role_id' => Role::factory()->create(['name' => 'super_admin'])->id]);
    $this->actingAs($user)->from(route('panel-admin.index', ['tab' => 'Galeri Foto', 'mode' => 'create']))
        ->withHeader('X-Cms-Return-To-List', '1')
        ->post(route('panel-admin.galeri.galeri-foto.update'), [
            'section_title' => 'Galeri', 'categories' => ['Umum'],
            'items' => [['id' => 'new', 'title' => 'Foto baru', 'category' => 'Umum', 'location' => 'Batam', 'imageSrc' => '/image.jpg']],
        ])->assertRedirect(route('panel-admin.index', ['tab' => 'Galeri Foto']))->assertSessionHasNoErrors();
    $this->assertDatabaseCount('galeri_foto_sections', 1);
});

test('validation errors stay on the form without storing invalid data', function (): void {
    $user = User::factory()->create(['role_id' => Role::factory()->create(['name' => 'super_admin'])->id]);
    $form = route('panel-admin.index', ['tab' => 'Galeri Foto', 'mode' => 'create']);
    $this->actingAs($user)->from($form)->withHeader('X-Cms-Return-To-List', '1')
        ->post(route('panel-admin.galeri.galeri-foto.update'), ['section_title' => '', 'items' => []])
        ->assertRedirect($form)->assertSessionHasErrors('section_title');
    $this->assertDatabaseCount('galeri_foto_sections', 0);
});

test('partial master data requests omit unrelated shared content', function (): void {
    $user = User::factory()->create(['role_id' => Role::factory()->create(['name' => 'super_admin'])->id]);
    $version = app(HandleInertiaRequests::class)->version(Request::create('/'));
    $this->actingAs($user)->get(route('panel-admin.index', ['tab' => 'Data User']), [
        'X-Inertia' => 'true', 'X-Inertia-Version' => $version,
        'X-Inertia-Partial-Component' => 'panel-admin', 'X-Inertia-Partial-Data' => 'users,filters',
    ])->assertOk()->assertJsonMissingPath('props.footer')->assertJsonMissingPath('props.notifications')
        ->assertJsonPath('props.users.total', 1);
});
