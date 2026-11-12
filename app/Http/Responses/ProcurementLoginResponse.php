<?php

namespace App\Http\Responses;

use App\Models\Notification;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse;
use Laravel\Fortify\Http\Responses\LoginResponse;
use Symfony\Component\HttpFoundation\Response;

class ProcurementLoginResponse extends LoginResponse implements TwoFactorLoginResponse
{
    public function toResponse($request): Response
    {
        $user = $request->user();
        $roleName = $user?->role?->name ?? 'User';

        if ($user) {
            Notification::log($user, 'info', 'Aktivitas Login', "{$user->name} ({$roleName}) berhasil masuk ke Panel Admin.");
        }

        // Bersihkan url.intended jika mengarah ke dashboard starter kit bawaan
        $intended = $request->session()->get('url.intended');
        if ($intended && (str_ends_with($intended, '/dashboard') || $intended === url('/dashboard'))) {
            $request->session()->forget('url.intended');
        }

        if ($roleName === 'admin_pengadaan') {
            $request->session()->forget('url.intended');

            return $request->wantsJson()
                ? response()->json(['two_factor' => false, 'redirect' => route('panel-admin.index', ['tab' => 'Daftar Pengadaan'])])
                : redirect()->route('panel-admin.index', ['tab' => 'Daftar Pengadaan']);
        }

        if (in_array($roleName, ['super_admin', 'admin'], true)) {
            $request->session()->forget('url.intended');

            return $request->wantsJson()
                ? response()->json(['two_factor' => false, 'redirect' => route('panel-admin.index')])
                : redirect()->route('panel-admin.index');
        }

        return $request->routeIs('two-factor.login.store')
            ? (new \Laravel\Fortify\Http\Responses\TwoFactorLoginResponse)->toResponse($request)
            : parent::toResponse($request);
    }
}
