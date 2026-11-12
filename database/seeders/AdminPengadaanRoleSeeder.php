<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class AdminPengadaanRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::firstOrCreate(['name' => 'manage_procurement'], [
            'label' => 'Kelola Pengadaan',
            'description' => 'Melihat, menambah, mengedit, menghapus, mengunggah, mempublikasikan dan mengarsipkan Pengadaan.',
        ]);

        Role::firstOrCreate(['name' => 'admin_pengadaan'], [
            'label' => 'Admin Pengadaan',
            'description' => 'Mengelola dan mempublikasikan Pengadaan secara langsung. Tidak memiliki akses modul CMS lainnya.',
            'color' => 'text-admin-accent',
            'permissions' => ['manage_procurement' => true],
        ]);
    }
}
