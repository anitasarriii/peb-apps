<?php

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

test('user has permission checks role correctly', function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $superAdminRole = Role::where('name', 'super_admin')->first();
    $adminRole = Role::where('name', 'admin')->first();
    $userRole = Role::where('name', 'user')->first();

    $superAdmin = User::factory()->create([
        'role_id' => $superAdminRole->id,
    ]);

    $admin = User::factory()->create([
        'role_id' => $adminRole->id,
    ]);

    $user = User::factory()->create([
        'role_id' => $userRole->id,
    ]);

    // Super admin should have all permissions
    expect($superAdmin->hasPermission('view_dashboard'))->toBeTrue();
    expect($superAdmin->hasPermission('manage_settings'))->toBeTrue();
    expect($superAdmin->hasPermission('non_existent_permission'))->toBeTrue(); // Super admin overrides

    // Admin should have some permissions but not all
    expect($admin->hasPermission('view_dashboard'))->toBeTrue();
    expect($admin->hasPermission('edit_content'))->toBeTrue();
    expect($admin->hasPermission('manage_settings'))->toBeFalse();
    expect($admin->hasPermission('non_existent_permission'))->toBeFalse();

    // User should have minimal permissions
    expect($user->hasPermission('view_dashboard'))->toBeTrue();
    expect($user->hasPermission('edit_content'))->toBeFalse();
    expect($user->hasPermission('manage_settings'))->toBeFalse();

    // User without a role should have no permissions
    $noRoleUser = User::factory()->create();
    expect($noRoleUser->hasPermission('view_dashboard'))->toBeFalse();
});
