import { useState, useEffect } from 'react';
import AdminDashboard from '@/components/panel-admin/admin-dashboard';
import AdminPanelLayout from '@/layouts/admin-panel-layout';
import { recentProjects } from '@/components/panel-admin/types';
import { router, usePage } from '@inertiajs/react';
import AdminToast from '@/components/panel-admin/admin-toast';

export default function PanelAdmin() {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('tab') || 'Dashboard';
        }
        return 'Dashboard';
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastVersion, setToastVersion] = useState(0);
    const flash = props.flash as
        | { success?: string; error?: string }
        | undefined;

    // Pantau flash messages dari Laravel Session secara global
    useEffect(() => {
        if (flash?.success) {
            setToastType('success');
            setToastMessage(flash.success);
            setShowToast(true);
            setToastVersion((version) => version + 1);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToastType('error');
            setToastMessage(flash.error);
            setShowToast(true);
            setToastVersion((version) => version + 1);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Update URL query parameter ketika activeTab berubah dan hanya fetch jika tab berbeda
    useEffect(() => {
        if (typeof window !== 'undefined' && activeTab) {
            const params = new URLSearchParams(window.location.search);
            const currentTab = params.get('tab') || 'Dashboard';

            if (activeTab !== currentTab) {
                router.get(
                    '/panel-admin',
                    { tab: activeTab === 'Dashboard' ? undefined : activeTab },
                    { preserveState: true, preserveScroll: true },
                );
            }
        }
    }, [activeTab]);

    // Listener untuk navigasi dari dashboard cards
    useEffect(() => {
        const handleAdminNavigate = (e: Event) => {
            const tab = (e as CustomEvent<string>).detail;
            setActiveTab(tab);
        };
        window.addEventListener('admin-navigate', handleAdminNavigate);
        return () =>
            window.removeEventListener('admin-navigate', handleAdminNavigate);
    }, []);

    return (
        <AdminPanelLayout activeTab={activeTab}>
            <AdminDashboard
                activeTab={activeTab}
                recentProjects={recentProjects}
                pageProps={props as any}
            />
            <AdminToast
                key={toastVersion}
                show={showToast}
                type={toastType}
                message={toastMessage}
            />
        </AdminPanelLayout>
    );
}
