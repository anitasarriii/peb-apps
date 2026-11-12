import { router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, LogOut, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import type { MenuItem } from './types';

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    openDropdowns: Record<string, boolean>;
    toggleDropdown: (name: string) => void;
    menuItems: MenuItem[];
}

export default function AdminSidebar({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    openDropdowns,
    toggleDropdown,
    menuItems,
}: AdminSidebarProps) {
    const { auth, unreadMessagesCount } = usePage().props as any;
    const user = auth?.user;
    const isProcurementAdmin = user?.role?.name === 'admin_pengadaan';

    // Helper untuk mengecek permission
    const hasPermission = (permissionName: string | undefined): boolean => {
        if (!permissionName) return true;
        if (user?.role?.name === 'super_admin') return true;
        return !!user?.role?.permissions?.[permissionName];
    };

    // Filter menuItems berdasarkan permissions
    const filteredMenuItems = menuItems
        .filter((item) => !isProcurementAdmin || item.name === 'Pengadaan')
        .map((item) => {
            // Jika user tidak punya permission untuk parent menu, return null
            if (!hasPermission(item.permission)) return null;

            // Jika item memiliki children, filter juga children-nya
            if (item.children) {
                const filteredChildren = item.children.filter(
                    (child) =>
                        hasPermission(child.permission) &&
                        (!isProcurementAdmin ||
                            child.name === 'Daftar Pengadaan'),
                );

                // Jika memiliki children tetapi setelah difilter hasilnya kosong,
                // sembunyikan parent-nya (return null)
                if (filteredChildren.length === 0) return null;

                return {
                    ...item,
                    children: filteredChildren,
                };
            }

            return item;
        })
        .filter(Boolean) as MenuItem[];

    // State untuk mengontrol popover profil
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Ref untuk mendeteksi klik di luar popover
    const profileRef = useRef<HTMLDivElement>(null);

    // Tutup popover jika klik di luar area
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        }

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    return (
        <aside
            className={cn(
                'fixed inset-y-0 left-0 z-9999 flex h-full w-64 flex-col border-r border-admin-border/70 bg-admin-card shadow-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:relative md:shadow-none',
                sidebarOpen
                    ? 'translate-x-0'
                    : '-translate-x-full md:w-20 md:translate-x-0',
            )}
        >
            <AnimeReveal
                direction="right"
                delay={300}
                distance={100}
                className="flex h-full w-full flex-col overflow-visible"
            >
                {/* Logo Area */}
                <div
                    className={cn(
                        'flex h-18 shrink-0 items-center border-b border-admin-border/70 px-5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                        sidebarOpen
                            ? 'justify-between'
                            : 'md:justify-center md:px-0',
                    )}
                >
                    <div
                        className={cn(
                            'flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                            sidebarOpen
                                ? 'w-full gap-3'
                                : 'md:w-auto md:justify-center md:gap-0',
                        )}
                    >
                        <img
                            src="/assets/logo/logo-petir.svg"
                            alt="Logo PEB"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    '/assets/logo/logo-petir.png';
                            }}
                            className="size-10 shrink-0 rounded-xl object-contain shadow-md shadow-[#FFE600]/20 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        />
                        <div
                            className={cn(
                                'shrink-0 overflow-hidden text-left transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                sidebarOpen
                                    ? 'md:max-w-xs md:translate-x-0 md:opacity-100'
                                    : 'md:pointer-events-none md:max-w-0 md:-translate-x-4 md:opacity-0',
                            )}
                        >
                            <h1 className="text-lg leading-none font-black tracking-tight text-admin-text">
                                Admin
                                <span className="text-admin-accent">Panel</span>
                            </h1>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="cursor-pointer text-admin-text-muted hover:text-admin-accent md:hidden"
                    >
                        <LogOut size={20} className="rotate-180" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="hide-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        const hasChildren = !!item.children;
                        const isChildActive =
                            hasChildren &&
                            item.children?.some((c) => c.name === activeTab);
                        const isActive =
                            activeTab === item.name || isChildActive;
                        const isDropdownOpen = openDropdowns[item.name];

                        return (
                            <div key={item.name} className="space-y-1">
                                <button
                                    onClick={() => {
                                        if (hasChildren) {
                                            toggleDropdown(item.name);

                                            if (!sidebarOpen) {
                                                setSidebarOpen(true);
                                            }
                                        } else {
                                            setActiveTab(item.name);

                                            // Tutup sidebar di mobile setelah navigasi
                                            if (window.innerWidth < 768) {
                                                setSidebarOpen(false);
                                            }
                                        }
                                    }}
                                    className={cn(
                                        'group flex w-full cursor-pointer items-center rounded-xl px-3 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                        sidebarOpen
                                            ? 'justify-between'
                                            : 'md:justify-center',
                                        isActive && !hasChildren
                                            ? 'bg-admin-primary text-white shadow-xl shadow-admin-primary/20'
                                            : 'text-admin-text-muted hover:bg-admin-card-hover hover:text-admin-text',
                                        isChildActive &&
                                            'bg-admin-card-hover text-admin-text',
                                    )}
                                    title={!sidebarOpen ? item.name : undefined}
                                >
                                    <div
                                        className={cn(
                                            'flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                            sidebarOpen ? 'gap-3' : 'md:gap-0',
                                        )}
                                    >
                                        <Icon
                                            size={19}
                                            className={cn(
                                                'shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                                isActive
                                                    ? 'scale-110 text-admin-accent'
                                                    : 'group-hover:scale-110',
                                                !sidebarOpen && 'md:mx-auto',
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                'text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                                sidebarOpen
                                                    ? 'md:max-w-xs md:translate-x-0 md:opacity-100'
                                                    : 'overflow-hidden md:pointer-events-none md:max-w-0 md:-translate-x-4 md:opacity-0',
                                            )}
                                        >
                                            {item.name}
                                        </span>
                                    </div>

                                    {hasChildren && (
                                        <ChevronDown
                                            size={16}
                                            className={cn(
                                                'shrink-0 text-admin-text-muted transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                                isDropdownOpen && 'rotate-180',
                                                sidebarOpen
                                                    ? 'md:w-auto md:scale-100 md:opacity-100'
                                                    : 'overflow-hidden md:pointer-events-none md:w-0 md:scale-50 md:opacity-0',
                                            )}
                                        />
                                    )}

                                    {isActive && !hasChildren && (
                                        <div
                                            className={cn(
                                                'ml-auto h-6 w-1.5 shrink-0 rounded-full bg-admin-accent shadow-[0_0_10px_rgba(0,164,185,0.8)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                                sidebarOpen
                                                    ? 'md:w-1.5 md:scale-100 md:opacity-100'
                                                    : 'md:pointer-events-none md:w-0 md:scale-50 md:opacity-0',
                                            )}
                                        />
                                    )}
                                </button>

                                {/* Dropdown Children */}
                                {hasChildren && sidebarOpen && (
                                    <div
                                        className={cn(
                                            'grid transition-all duration-300 ease-in-out',
                                            isDropdownOpen
                                                ? 'grid-rows-[1fr] opacity-100'
                                                : 'grid-rows-[0fr] opacity-0',
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="space-y-0.5 py-1.5 pr-2 pl-6">
                                                {item.children?.map((child) => (
                                                    <button
                                                        key={child.name}
                                                        onClick={() => {
                                                            setActiveTab(
                                                                child.name,
                                                            );

                                                            if (
                                                                window.innerWidth <
                                                                768
                                                            ) {
                                                                setSidebarOpen(
                                                                    false,
                                                                );
                                                            }
                                                        }}
                                                        className={cn(
                                                            'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300',
                                                            activeTab ===
                                                                child.name
                                                                ? 'bg-admin-accent/10 text-admin-accent'
                                                                : 'text-admin-text-muted hover:bg-admin-card-hover hover:text-admin-text',
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'size-1.5 shrink-0 rounded-full',
                                                                activeTab ===
                                                                    child.name
                                                                    ? 'bg-admin-accent shadow-[0_0_8px_rgba(0,164,185,0.8)]'
                                                                    : 'bg-admin-text-muted/40',
                                                            )}
                                                        />
                                                        <span className="whitespace-nowrap">
                                                            {child.name}
                                                        </span>
                                                        {child.name ===
                                                            'Kontak Masuk' &&
                                                            Number(
                                                                unreadMessagesCount,
                                                            ) > 0 && (
                                                                <span className="ml-auto rounded-full bg-admin-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                                    {
                                                                        unreadMessagesCount
                                                                    }
                                                                </span>
                                                            )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* User Profile Summary */}
                <div
                    ref={profileRef}
                    className="relative flex shrink-0 justify-center p-4"
                >
                    {/* ── Popover Card ─────────────────────────────────── */}
                    <div
                        className={cn(
                            'z-9999 rounded-2xl border border-admin-border bg-admin-card shadow-2xl shadow-black/20',
                            'transition-all duration-300 ease-out',
                            // Posisi: di atas tombol jika terbuka, di sebelah kanan (lebar tetap w-64) jika tertutup
                            sidebarOpen
                                ? 'absolute right-4 bottom-[calc(100%+0.5rem)] left-4 z-50 origin-bottom'
                                : 'absolute bottom-5 left-[calc(100%+0.5rem)] z-50 w-64 origin-bottom-left',
                            isProfileOpen
                                ? 'pointer-events-auto translate-x-0 translate-y-0 opacity-100'
                                : sidebarOpen
                                  ? 'pointer-events-none translate-y-3 opacity-0'
                                  : 'pointer-events-none translate-x-3 opacity-0',
                        )}
                    >
                        {/* Header Popover — Info Profil */}
                        <div className="border-b border-admin-border p-4">
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img
                                        src={
                                            user?.avatar ||
                                            'https://i.pravatar.cc/150?img=11'
                                        }
                                        alt={user?.name || 'Admin'}
                                        className="size-12 rounded-full border-2 border-admin-accent object-cover"
                                    />
                                    {/* Indikator online */}
                                    <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-admin-card bg-emerald-400 shadow-sm" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-admin-text">
                                        {user?.name || 'Nama'}
                                    </p>
                                    <p className="text-[10px] font-semibold text-admin-text-muted capitalize">
                                        {user?.role?.label ||
                                            user?.role?.name ||
                                            'Super Administrator'}
                                    </p>
                                    <p className="mt-0.5 truncate text-[10px] font-medium text-admin-accent">
                                        {user?.email || 'admin@peb.co.id'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Aksi */}
                        <div className="space-y-0.5 p-2">
                            {/* Tombol Profil */}
                            {!isProcurementAdmin && (
                                <button
                                    onClick={() => {
                                        setActiveTab('Profil');
                                        setIsProfileOpen(false);
                                    }}
                                    className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-admin-text-muted transition-all duration-200 hover:bg-admin-card-hover hover:text-admin-text"
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-admin-card-hover transition-colors group-hover:bg-admin-accent/10">
                                        <User
                                            size={15}
                                            className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                        />
                                    </span>
                                    <span>Lihat Profil</span>
                                </button>
                            )}

                            {/* Tombol Pengaturan
                            <button
                                onClick={() => {
                                    setActiveTab('Pengaturan');
                                    setIsProfileOpen(false);
                                }}
                                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-admin-text-muted transition-all duration-200 hover:bg-admin-card-hover hover:text-admin-text"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-admin-card-hover transition-colors group-hover:bg-admin-accent/10">
                                    <Settings
                                        size={15}
                                        className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                    />
                                </span>
                                <span>Pengaturan</span>
                            </button>
                            */}
                        </div>

                        {/* Divider + Tombol Logout */}
                        <div className="border-t border-admin-border p-2">
                            <button
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    router.post('/logout');
                                }}
                                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-50 transition-colors group-hover:bg-red-100 dark:bg-red-950/30 dark:group-hover:bg-red-900/40">
                                    <LogOut
                                        size={15}
                                        className="text-red-400 transition-colors group-hover:text-red-500"
                                    />
                                </span>
                                <span>Keluar</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Trigger Button ───────────────────────────────── */}
                    <button
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        className={cn(
                            'flex cursor-pointer items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                            sidebarOpen
                                ? 'w-full gap-4 rounded-2xl px-4 py-3'
                                : 'size-12 justify-center gap-0 rounded-xl p-0',
                            isProfileOpen
                                ? 'bg-admin-primary/10 ring-1 ring-admin-accent/30'
                                : 'bg-admin-card-hover hover:bg-admin-border',
                        )}
                        title={!sidebarOpen ? 'Profil Admin' : undefined}
                    >
                        <img
                            src={
                                user?.avatar ||
                                'https://i.pravatar.cc/150?img=11'
                            }
                            alt={user?.name || 'Admin'}
                            className="size-10 shrink-0 rounded-full border-2 border-admin-accent object-cover"
                        />
                        <div
                            className={cn(
                                'flex-1 overflow-hidden text-left transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                sidebarOpen
                                    ? 'md:max-w-xs md:translate-x-0 md:opacity-100'
                                    : 'md:pointer-events-none md:max-w-0 md:-translate-x-4 md:opacity-0',
                            )}
                        >
                            <p className="truncate text-sm font-bold text-admin-text">
                                {user?.name || 'Admin'}
                            </p>
                            <p className="text-[10px] font-semibold tracking-wider text-admin-text-muted uppercase">
                                {user?.role?.label ||
                                    user?.role?.name ||
                                    'Super Administrator'}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'flex shrink-0 flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                                sidebarOpen
                                    ? 'md:w-auto md:scale-100 md:opacity-100'
                                    : 'overflow-hidden md:pointer-events-none md:w-0 md:scale-50 md:opacity-0',
                            )}
                        >
                            <ChevronUp
                                size={16}
                                className={cn(
                                    'translate-y-[4px] text-admin-text-muted transition-all duration-300',
                                    isProfileOpen && 'text-admin-accent',
                                )}
                            />
                            <ChevronDown
                                size={16}
                                className={cn(
                                    'translate-y-[-1px] text-admin-text-muted transition-all duration-300',
                                    isProfileOpen && 'text-admin-accent',
                                )}
                            />
                        </div>
                    </button>
                </div>
            </AnimeReveal>
        </aside>
    );
}
