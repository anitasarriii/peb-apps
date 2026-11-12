<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MasterData\RoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        $query = Role::query()->when(! $isSuperAdmin, function ($query) {
            $query->where('name', 'user');
        });

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

        $roles = $query->paginate(10)->withQueryString();

        return Inertia::render('panel-admin/master-data/data-role/index', [
            'roles' => $roles,
            'permissions' => Permission::all(),
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
    public function store(RoleRequest $request)
    {
        $currentUser = $request->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        $validated = $request->validated();

        if ($validated['name'] === 'admin_pengadaan') {
            abort_unless($isSuperAdmin, 403);
            $validated['permissions'] = ['manage_procurement' => true];
        }

        if ($validated['name'] === 'super_admin' && ! $isSuperAdmin) {
            abort(403, 'Hanya Super Admin yang dapat mendaftarkan role Super Admin.');
        }

        Role::create($validated);

        return redirect()->route('panel-admin.index', ['tab' => 'Data Role'])->with('success', 'Role berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        return Inertia::render('panel-admin/master-data/data-role/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        return Inertia::render('panel-admin/master-data/data-role/edit', [
            'role' => $role,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        $currentUser = $request->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        if (! $isSuperAdmin && $role->name !== 'user') {
            abort(403, 'Anda tidak memiliki hak akses untuk memodifikasi role ini.');
        }

        $validated = $request->validated();

        if ($role->name === 'admin_pengadaan' || $validated['name'] === 'admin_pengadaan') {
            abort_unless($isSuperAdmin, 403);
            abort_if($role->name === 'admin_pengadaan' && $validated['name'] !== 'admin_pengadaan', 422, 'Identifier Admin Pengadaan tidak dapat diubah.');
            $validated['permissions'] = ['manage_procurement' => true];
        }

        if ($role->name === 'user') {
            $validated['permissions'] = [
                'view_dashboard' => true,
                'view_content' => true,
                'edit_content' => false,
                'manage_gallery' => false,
                'manage_procurement' => false,
                'manage_portfolio' => false,
                'manage_reports' => false,
                'manage_users' => false,
                'manage_roles' => false,
                'manage_settings' => false,
                'publish_content' => false,
                'delete_content' => false,
            ];
        }

        $role->update($validated);

        return redirect()->route('panel-admin.index', ['tab' => 'Data Role'])->with('success', 'Role berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $currentUser = request()->user();
        $isSuperAdmin = $currentUser->role && $currentUser->role->name === 'super_admin';

        if (! $isSuperAdmin && $role->name !== 'user') {
            abort(403, 'Anda tidak memiliki hak akses untuk menghapus role ini.');
        }

        if (in_array($role->name, ['super_admin', 'admin_pengadaan'], true)) {
            abort(403, 'Role bawaan ini tidak dapat dihapus.');
        }

        $role->delete();

        return redirect()->route('panel-admin.index', ['tab' => 'Data Role'])->with('success', 'Role berhasil dihapus.');
    }
}
