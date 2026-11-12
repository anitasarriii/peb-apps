import { createInertiaApp, usePage } from '@inertiajs/react';
import PageLoader from '@/components/global/page-loader';
import ThemeToggle from '@/components/global/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import { LocaleProvider } from '@/lib/locale-context';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'PT Pelayanan Energi Batam';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'beranda':
            case name === 'tentang-kami':
            case name === 'kontak':
            case name === 'servis':
            case name === 'servis/detail':
            case name === 'galeri':
            case name === 'kebijakan':
            case name === 'portfolio':
            case name === 'pengadaan':
            case name === 'pengadaan/detail':
            case name === 'laporan':
            case name === 'laporan/detail':
            case name === 'berita-acara':
            case name === 'berita-acara/detail':
            case name === 'panel-admin':
            case name.startsWith('panel-admin/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app: any) {
        const isClient = typeof window !== 'undefined';
        const isPanelAdmin =
            isClient && window.location.pathname.startsWith('/panel-admin');
        return (
            <LocaleProvider>
                <TooltipProvider delayDuration={0}>
                    {!isPanelAdmin && <PageLoader />}
                    {!isPanelAdmin && <ThemeToggle />}
                    <div
                        id="main-content"
                        className={
                            isPanelAdmin
                                ? 'flex min-h-screen w-full flex-col'
                                : 'flex min-h-screen w-full flex-col'
                        }
                    >
                        {app}
                    </div>

                    <Toaster />
                </TooltipProvider>
            </LocaleProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
