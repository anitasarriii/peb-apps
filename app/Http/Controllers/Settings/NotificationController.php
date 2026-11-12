<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Tandai satu notifikasi tertentu sebagai dibaca oleh user saat ini.
     */
    public function read(Request $request, Notification $notification): RedirectResponse
    {
        $userId = $request->user()->id;
        $readBy = $notification->read_by ?? [];

        if (! in_array($userId, $readBy)) {
            $readBy[] = $userId;
            $notification->update([
                'read_by' => $readBy,
            ]);
        }

        return back();
    }

    /**
     * Tandai semua notifikasi yang dapat diakses oleh user saat ini sebagai dibaca.
     */
    public function readAll(Request $request): RedirectResponse
    {
        $user = $request->user();
        $canManageAll = $user->role && in_array($user->role->name, ['super_admin', 'admin'], true);

        // Ambil notifikasi sesuai hak akses peran pengguna
        $notifications = Notification::when(! $canManageAll, function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        foreach ($notifications as $notification) {
            $readBy = $notification->read_by ?? [];
            if (! in_array($user->id, $readBy)) {
                $readBy[] = $user->id;
                $notification->update([
                    'read_by' => $readBy,
                ]);
            }
        }

        return back();
    }

    /**
     * Hapus/hilangkan notifikasi tertentu dari database.
     */
    public function destroy(Notification $notification): RedirectResponse
    {
        $notification->delete();

        return back();
    }

    /**
     * Hapus/hilangkan seluruh notifikasi milik user saat ini dari database.
     */
    public function destroyAll(Request $request): RedirectResponse
    {
        $user = $request->user();
        $canManageAll = $user->role && in_array($user->role->name, ['super_admin', 'admin'], true);

        Notification::when(! $canManageAll, function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->delete();

        return back();
    }
}
