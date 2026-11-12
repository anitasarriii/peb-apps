import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import AdminHeader from '@/components/panel-admin/admin-header';
import AdminSidebar from '@/components/panel-admin/admin-sidebar';
import RequestFeedback from '@/components/panel-admin/request-feedback';
import { AdminToastHost } from '@/components/panel-admin/admin-toast';
import { menuItems } from '@/components/panel-admin/types';
import { cn } from '@/lib/utils';

interface AdminPanelLayoutProps {
    children: React.ReactNode;
    activeTab: string;
}

export default function AdminPanelLayout({
    children,
    activeTab,
}: AdminPanelLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
        () => {
            // Auto-open dropdown parent based on activeTab
            const parent = menuItems.find((m) =>
                m.children?.some((c) => c.name === activeTab),
            );

            return parent ? { [parent.name]: true } : {};
        },
    );

    // Inisialisasi state dark mode berdasarkan localStorage atau preferensi sistem
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return (
                localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)
            );
        }

        return false;
    });

    useEffect(() => {
        const applyPreferences = (event: Event) => {
            const preferences = (
                event as CustomEvent<{
                    themeMode: string;
                    sidebarCollapsed: boolean;
                }>
            ).detail;
            setIsDark(
                preferences.themeMode === 'dark' ||
                    (preferences.themeMode === 'system' &&
                        window.matchMedia('(prefers-color-scheme: dark)')
                            .matches),
            );
            setSidebarOpen(!preferences.sidebarCollapsed);
        };
        window.addEventListener('cms-preferences-saved', applyPreferences);
        return () =>
            window.removeEventListener(
                'cms-preferences-saved',
                applyPreferences,
            );
    }, []);

    // Efek untuk menyinkronkan class 'dark' pada document root
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // Tutup sidebar secara otomatis di layar mobile
    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth >= 768);
        };

        handleResize(); // Cek awal saat render
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handleTabClick = (tabName: string) => {
        if (window.location.pathname !== '/panel-admin') {
            router.visit(`/panel-admin?tab=${encodeURIComponent(tabName)}`);
        } else {
            // Dispatch a custom event to change the tab
            const event = new CustomEvent('admin-navigate', {
                detail: tabName,
            });
            window.dispatchEvent(event);
        }
    };

    return (
        <div className="admin-typography flex h-screen overflow-hidden bg-admin-bg font-sans text-sm leading-relaxed font-normal transition-colors duration-500">
            <Head title={`${activeTab} - Admin Panel`} />
            <RequestFeedback />
            <AdminToastHost />

            {/* Mobile Overlay — menutup sidebar saat klik di luar */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
                    sidebarOpen
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0',
                )}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={handleTabClick}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                menuItems={menuItems}
            />

            {/* Main Content Area */}
            <main className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                {/* Dekorasi blob blur di sudut kanan atas */}
                <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-admin-accent/5 blur-3xl" />

                {/* Header */}
                <AdminHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isDark={isDark}
                    onToggleDark={() => setIsDark(!isDark)}
                />

                {children}
            </main>
        </div>
    );
}
