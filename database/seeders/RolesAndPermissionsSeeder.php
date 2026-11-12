<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'view_dashboard',
                'label' => 'Lihat Dashboard',
                'description' => 'Akses halaman dashboard utama',
            ],
            [
                'name' => 'view_content',
                'label' => 'Lihat Konten',
                'description' => 'Membaca semua konten halaman',
            ],
            [
                'name' => 'edit_content',
                'label' => 'Edit Konten',
                'description' => 'Mengubah konten halaman landing',
            ],
            [
                'name' => 'manage_gallery',
                'label' => 'Kelola Galeri',
                'description' => 'Upload dan hapus foto galeri',
            ],
            [
                'name' => 'manage_procurement',
                'label' => 'Kelola Pengadaan',
                'description' => 'Tambah dan edit data pengadaan',
            ],
            [
                'name' => 'manage_portfolio',
                'label' => 'Kelola Portfolio',
                'description' => 'Tambah dan edit proyek portfolio',
            ],
            [
                'name' => 'manage_reports',
                'label' => 'Kelola Laporan',
                'description' => 'Upload dan kelola laporan keuangan',
            ],
            [
                'name' => 'manage_users',
                'label' => 'Kelola User',
                'description' => 'Tambah, edit, dan hapus pengguna',
            ],
            [
                'name' => 'manage_roles',
                'label' => 'Kelola Role',
                'description' => 'Mengatur hak akses role',
            ],
            [
                'name' => 'manage_settings',
                'label' => 'Pengaturan Sistem',
                'description' => 'Akses pengaturan sistem penuh',
            ],
            [
                'name' => 'publish_content',
                'label' => 'Publikasi Konten',
                'description' => 'Mempublikasikan perubahan ke live',
            ],
            [
                'name' => 'delete_content',
                'label' => 'Hapus Konten',
                'description' => 'Menghapus konten secara permanen',
            ],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], $perm);
        }

        $roles = [
            [
                'name' => 'user',
                'label' => 'User',
                'description' => 'Pengguna biasa dengan akses baca saja.',
                'color' => 'text-blue-400',
                'permissions' => [
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
                ],
            ],
            [
                'name' => 'admin',
                'label' => 'Admin',
                'description' => 'Administrator dengan akses pengelolaan konten penuh.',
                'color' => 'text-admin-accent',
                'permissions' => [
                    'view_dashboard' => true,
                    'view_content' => true,
                    'edit_content' => true,
                    'manage_gallery' => true,
                    'manage_procurement' => true,
                    'manage_portfolio' => true,
                    'manage_reports' => true,
                    'manage_users' => true,
                    'manage_roles' => false,
                    'manage_settings' => false,
                    'publish_content' => true,
                    'delete_content' => false,
                ],
            ],
            [
                'name' => 'super_admin',
                'label' => 'Super Admin',
                'description' => 'Akses penuh ke seluruh sistem tanpa batasan.',
                'color' => 'text-amber-400',
                'permissions' => array_fill_keys(array_column($permissions, 'name'), true),
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['name' => $roleData['name']], $roleData);
        }

        $this->call(AdminPengadaanRoleSeeder::class);
    }
}
