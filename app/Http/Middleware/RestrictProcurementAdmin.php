<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictProcurementAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user?->role?->name !== 'admin_pengadaan') {
            return $next($request);
        }

        if ($request->is('dashboard')) {
            return redirect()->route('panel-admin.index', ['tab' => 'Daftar Pengadaan']);
        }

        if ($request->routeIs('panel-admin.index')) {
            abort_unless($user->hasPermission('manage_procurement'), 403);
            if (! $request->has('tab')) {
                return redirect()->route('panel-admin.index', ['tab' => 'Daftar Pengadaan']);
            }
            abort_unless($request->query('tab') === 'Daftar Pengadaan', 403);
        } elseif ($request->routeIs('panel-admin.pengadaan.daftar-section.update')) {
            abort_unless($user->hasPermission('manage_procurement'), 403);
        } elseif ($request->is('panel-admin', 'panel-admin/*', 'dashboard', 'settings', 'settings/*', 'api', 'api/*')) {
            abort(403, 'Akun ini hanya memiliki akses pengelolaan Pengadaan.');
        }

        return $next($request);
    }
}
