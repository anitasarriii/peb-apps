<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MasterData\UserRequest;
use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        $query = User::with('role');

        if (! $isSuperAdmin) {
            $query->where(function ($q) {
                $q->whereHas('role', function ($subQ) {
                    $subQ->whereIn('name', ['admin', 'admin_pengadaan', 'user']);
                })->orWhereDoesntHave('role');
            });
        }

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        $users = $query->paginate(10)->withQueryString();

        $roles = Role::when(! $isSuperAdmin, function ($query) {
            $query->whereIn('name', ['admin', 'admin_pengadaan', 'user']);
        })->get();

        return Inertia::render('panel-admin/master-data/data-user/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $data['avatar'] = '/storage/' . $request->file('avatar')->store('avatars', 'public');
        }

        $newUser = User::create($data);
        $roleName = $newUser->role?->name ?? 'User';
        Notification::log($request->user(), 'success', 'User Ditambahkan', "{$request->user()->name} menambahkan pengguna baru: {$newUser->name} ({$roleName}).");

        return redirect()->route('panel-admin.index', ['tab' => 'Data User'])->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('panel-admin/master-data/data-user/show', [
            'user' => $user->load('role'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('panel-admin/master-data/data-user/edit', [
            'user' => $user->load('role'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        $currentUser = $request->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        if (! $isSuperAdmin) {
            if ($user->role && $user->role->name === 'super_admin') {
                abort(403, 'Anda tidak memiliki akses untuk mengubah data user Super Admin.');
            }
        }

        $data = $request->validated();
        if (empty($data['password'])) {
            unset($data['password']);
        }

        if ($request->hasFile('avatar')) {
            $data['avatar'] = '/storage/' . $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);
        $roleName = $user->fresh()->role?->name ?? 'User';
        Notification::log($currentUser, 'info', 'User Diperbarui', "{$currentUser->name} memperbarui data pengguna: {$user->name} ({$roleName}).");

        return redirect()->route('panel-admin.index', ['tab' => 'Data User'])->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $currentUser = request()->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        if ($currentUser && $currentUser->id === $user->id) {
            abort(403, 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        if (! $isSuperAdmin) {
            if ($user->role && $user->role->name === 'super_admin') {
                abort(403, 'Anda tidak memiliki akses untuk menghapus user Super Admin.');
            }
        }

        $deletedName = $user->name;
        $user->delete();
        Notification::log($currentUser, 'warning', 'User Dihapus', "{$currentUser->name} menghapus akun pengguna: {$deletedName}.");

        return redirect()->route('panel-admin.index', ['tab' => 'Data User'])->with('success', 'User berhasil dihapus.');
    }
}
