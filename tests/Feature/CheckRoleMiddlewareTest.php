<?php

use App\Http\Middleware\CheckRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

it('allows access if user has the correct role', function () {
    $role = Role::factory()->create(['name' => 'super_admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $request = Request::create('/test', 'GET');
    $request->setUserResolver(fn () => $user);

    $middleware = new CheckRole;

    $response = $middleware->handle($request, function () {
        return response('OK');
    }, 'super_admin');

    expect($response->getStatusCode())->toBe(200);
});

it('aborts with 403 if user does not have the correct role', function () {
    $role = Role::factory()->create(['name' => 'admin']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $request = Request::create('/test', 'GET');
    $request->setUserResolver(fn () => $user);

    $middleware = new CheckRole;

    $middleware->handle($request, function () {
        return response('OK');
    }, 'super_admin');
})->throws(HttpException::class, 'Unauthorized action.');

it('aborts with 403 if user has no role', function () {
    $user = User::factory()->create(['role_id' => null]);

    $request = Request::create('/test', 'GET');
    $request->setUserResolver(fn () => $user);

    $middleware = new CheckRole;

    $middleware->handle($request, function () {
        return response('OK');
    }, 'super_admin');
})->throws(HttpException::class, 'Unauthorized action.');

it('aborts with 403 if user is not authenticated', function () {
    $request = Request::create('/test', 'GET');

    $middleware = new CheckRole;

    $middleware->handle($request, function () {
        return response('OK');
    }, 'super_admin');
})->throws(HttpException::class, 'Unauthorized action.');
