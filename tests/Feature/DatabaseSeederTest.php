<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\Hash;

test('roles and permissions seeder works', function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    expect(Permission::count())->toBeGreaterThan(0);
    expect(Role::count())->toBe(3);

    $superAdminRole = Role::where('name', 'super_admin')->first();
    expect($superAdminRole)->not->toBeNull();
    expect($superAdminRole->permissions)->toBeArray();
    expect($superAdminRole->permissions['view_dashboard'])->toBeTrue();
});

test('database seeder works', function () {
    $this->seed();

    expect(User::count())->toBe(3);

    $admin = User::where('email', 'admin@peb.co.id')->first();
    expect($admin)->not->toBeNull();
    expect($admin->role->name)->toBe('super_admin');
    expect(Hash::check('admin123', $admin->password))->toBeTrue();

    $admin = User::where('email', 'admin@peb.co.id')->first();
    expect($admin)->not->toBeNull();
    expect($admin->role->name)->toBe('admin');
    expect(Hash::check('password', $admin->password))->toBeTrue();

    $user = User::where('email', 'user@peb.co.id')->first();
    expect($user)->not->toBeNull();
    expect($user->role->name)->toBe('user');
    expect(Hash::check('password', $user->password))->toBeTrue();
});
