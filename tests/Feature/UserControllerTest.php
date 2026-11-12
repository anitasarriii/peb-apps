<?php

use App\Models\Role;
use App\Models\User;

it('renders the user index page with data if authorized', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this->actingAs($user)->get('/panel-admin/users');

    $response->assertStatus(200);
});
