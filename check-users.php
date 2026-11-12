<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$roles = App\Models\Role::all(['id', 'name', 'label', 'permissions']);
echo "=== ROLES ===\n";
foreach ($roles as $r) {
    echo "ID: {$r->id} | Name: {$r->name} | Label: {$r->label}\n";
    echo "Permissions: " . json_encode($r->permissions) . "\n\n";
}

$users = App\Models\User::with('role')->get();
echo "=== USERS ===\n";
foreach ($users as $u) {
    $roleName = $u->role ? $u->role->name : 'No Role';
    $roleLabel = $u->role ? $u->role->label : '-';
    echo "ID: {$u->id} | Name: {$u->name} | Email: {$u->email} | Status: {$u->status} | Role: {$roleName} ({$roleLabel})\n";
}

