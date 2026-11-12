<?php

use App\Http\Middleware\CheckPermission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

test('middleware allows request if user has permission', function () {
    $role = Role::factory()->create([
        'name' => 'admin',
        'permissions' => ['view_dashboard' => true],
    ]);

    $user = User::factory()->create([
        'role_id' => $role->id,
    ]);

    $request = Request::create('/panel-admin', 'GET');
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    $middleware = new CheckPermission;

    $response = $middleware->handle($request, function ($req) {
        return response('Next called');
    }, 'view_dashboard');

    expect($response->getContent())->toBe('Next called');
});

test('middleware aborts request if user does not have permission', function () {
    $role = Role::factory()->create([
        'name' => 'user',
        'permissions' => ['view_dashboard' => false],
    ]);

    $user = User::factory()->create([
        'role_id' => $role->id,
    ]);

    $request = Request::create('/settings', 'GET');
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    $middleware = new CheckPermission;

    $this->expectException(HttpException::class);
    $this->expectExceptionMessage('Unauthorized action.');

    $middleware->handle($request, function ($req) {
        return response('Next called');
    }, 'manage_settings');
});

test('middleware aborts request if user is not authenticated', function () {
    $request = Request::create('/panel-admin', 'GET');

    $middleware = new CheckPermission;

    $this->expectException(HttpException::class);
    $this->expectExceptionMessage('Unauthorized action.');

    $middleware->handle($request, function ($req) {
        return response('Next called');
    }, 'view_dashboard');
});
