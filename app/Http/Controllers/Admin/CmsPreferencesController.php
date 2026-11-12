<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CmsPreferencesRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CmsPreferencesController extends Controller
{
    /** @return array<string, mixed> */
    public static function forUser(User $user): array
    {
        $disk = Storage::disk('local');
        $path = 'cms-preferences-'.$user->id.'.json';

        return $disk->exists($path) ? $disk->json($path) : [];
    }

    public function update(CmsPreferencesRequest $request): RedirectResponse
    {
        $path = Storage::disk('local')->path('cms-preferences-'.$request->user()->id.'.json');
        File::ensureDirectoryExists(dirname($path));
        File::replace($path, json_encode($request->validated(), JSON_THROW_ON_ERROR));

        return back()->with('success', 'Preferensi pengaturan berhasil disimpan.');
    }
}
