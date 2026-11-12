import type { LucideIcon } from 'lucide-react';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    Settings,
    BarChart3,
    Database,
    Home,
    Info,
    Wrench,
    ScrollText,
    Images,
    FileBarChart,
    ShoppingCart,
    FolderKanban,
    LayoutTemplate,
    Megaphone,
    Headset,
} from 'lucide-react';

// =====================
// Type Definitions
// =====================

export interface MenuChild {
    name: string;
    permission?: string;
}

export interface MenuItem {
    name: string;
    // Menggunakan LucideIcon agar prop `size`, `className`, dsb. dikenali TypeScript
    icon: LucideIcon;
    children?: MenuChild[];
    permission?: string;
}

export interface StatItem {
    title: string;
    value: string;
    trend: string;
    isUp: boolean;
}

export interface ProjectItem {
    id: number;
    name: string;
    status: 'In Progress' | 'Planning' | 'Completed' | 'Review';
    date: string;
    progress: number;
}

// =====================
// Static Data
// =====================

export const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
    {
        name: 'Beranda',
        icon: Home,
        permission: 'view_content',
        children: [
            { name: 'Hero Beranda', permission: 'edit_content' },
            { name: 'Tentang Kami', permission: 'edit_content' },
            { name: 'Layanan', permission: 'edit_content' },
            { name: 'Portofolio', permission: 'edit_content' },
            { name: 'Statistik', permission: 'edit_content' },
            { name: 'Partner', permission: 'edit_content' },
            { name: 'SEO Beranda', permission: 'edit_content' },
        ],
    },
    {
        name: 'Tentang Kami',
        icon: Info,
        permission: 'view_content',
        children: [
            { name: 'Hero Tentang Kami', permission: 'edit_content' },
            { name: 'Profil Perusahaan', permission: 'edit_content' },
            { name: 'Visi & Misi', permission: 'edit_content' },
            { name: 'Tim Kami', permission: 'edit_content' },
            { name: 'Quote Tentang', permission: 'edit_content' },
            { name: 'Partner Tentang', permission: 'edit_content' },
            { name: 'SEO Tentang Kami', permission: 'edit_content' },
        ],
    },
    {
        name: 'Servis',
        icon: Wrench,
        permission: 'view_content',
        children: [
            { name: 'Hero Servis', permission: 'edit_content' },
            { name: 'Hero Detail Servis', permission: 'edit_content' },
            { name: 'Daftar Servis', permission: 'edit_content' },
            { name: 'SEO Servis', permission: 'edit_content' },
        ],
    },
    {
        name: 'Kebijakan',
        icon: ScrollText,
        permission: 'view_content',
        children: [
            { name: 'Hero Kebijakan', permission: 'edit_content' },
            { name: 'Kebijakan PEB', permission: 'edit_content' },
            { name: 'SEO Kebijakan', permission: 'edit_content' },
        ],
    },
    {
        name: 'Galeri',
        icon: Images,
        permission: 'manage_gallery',
        children: [
            { name: 'Hero Galeri' },
            { name: 'Galeri Foto' },
            { name: 'SEO Galeri' },
        ],
    },
    {
        name: 'Berita',
        icon: FileText,
        permission: 'view_content',
        children: [
            { name: 'Hero Section Berita', permission: 'edit_content' },
            { name: 'Daftar Berita', permission: 'edit_content' },
            { name: 'SEO Berita', permission: 'edit_content' },
        ],
    },
    {
        name: 'Pengadaan',
        icon: ShoppingCart,
        permission: 'manage_procurement',
        children: [
            { name: 'Hero Pengadaan' },
            { name: 'Daftar Pengadaan' },
            { name: 'SEO Pengadaan' },
        ],
    },
    {
        name: 'Portfolio',
        icon: FolderKanban,
        permission: 'manage_portfolio',
        children: [
            { name: 'Hero Portfolio' },
            { name: 'Daftar Portfolio' },
            { name: 'SEO Portfolio' },
        ],
    },
    {
        name: 'Hubungi Kami',
        icon: Headset,
        children: [
            { name: 'Hero Hubungi Kami' },
            { name: 'Kontak Masuk' },
            { name: 'SEO Hubungi Kami' },
        ],
    },
    { name: 'Header', icon: LayoutTemplate, permission: 'view_content' },
    { name: 'Footer', icon: LayoutTemplate, permission: 'view_content' },
    // CTA independen — tidak terikat satu halaman saja
    { name: 'Call to Action', icon: Megaphone, permission: 'edit_content' },
    {
        name: 'Master Data',
        icon: Database,
        children: [
            { name: 'Data Role', permission: 'manage_roles' },
            { name: 'Data User', permission: 'manage_users' },
        ],
    },
    // { name: 'Pengaturan', icon: Settings, permission: 'manage_settings' },
];

export const stats: StatItem[] = [
    { title: 'Foto Galeri', value: '9', trend: '+3 bulan ini', isUp: true },
    {
        title: 'Pengadaan Aktif',
        value: '5',
        trend: '+2 minggu ini',
        isUp: true,
    },
    { title: 'Laporan Publik', value: '7', trend: '+1 bulan ini', isUp: true },
    {
        title: 'Proyek Portfolio',
        value: '9',
        trend: '+2 bulan ini',
        isUp: true,
    },
];

export const recentProjects: ProjectItem[] = [
    {
        id: 1,
        name: 'Batam-Pemping Pipeline',
        status: 'In Progress',
        date: '12 Okt 2024',
        progress: 75,
    },
    {
        id: 2,
        name: 'Sekupang Solar Farm',
        status: 'Planning',
        date: '05 Nov 2024',
        progress: 20,
    },
    {
        id: 3,
        name: 'Panbil Gas Station',
        status: 'Completed',
        date: '28 Sep 2024',
        progress: 100,
    },
    {
        id: 4,
        name: 'SCADA Integration',
        status: 'Review',
        date: '15 Okt 2024',
        progress: 90,
    },
];
