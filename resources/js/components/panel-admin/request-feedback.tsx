import { router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdminToast from './admin-toast';

export default function RequestFeedback() {
    const active = useRef(false);
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [failure, setFailure] = useState('');

    useEffect(() => {
        const cleanup = [
            router.on('before', (event) => {
                const visit = event.detail.visit;

                if (visit.method === 'get') {
                    return;
                }

                if (active.current) {
                    return false;
                }

                active.current = true;
                setFailure('');
                const current = new URL(window.location.href);
                const tab = current.searchParams.get('tab') || '';
                const contentProps: Record<string, string> = {
                    'Hero Beranda': 'heroSection',
                    'Tentang Kami': 'aboutSection',
                    Layanan: 'layananSection',
                    Statistik: 'statistikSection',
                    Partner: 'partnerSection',
                    'Call to Action': 'ctaSection',
                    'Daftar Servis': 'daftarServisSection',
                    'Kebijakan PEB': 'kebijakanPebSection',
                    'Galeri Foto': 'galeriFotoSection',
                    'Laporan Keuangan': 'laporanKeuanganSection',
                    'Laporan Tahunan': 'laporanTahunanSection',
                    'Daftar Berita': 'beritaSection',
                    'Daftar Pengadaan': 'daftarPengadaan',
                    'Daftar Portfolio': 'daftarPortfolioSection',
                    Footer: 'footer',
                    Header: 'header',
                    Pengaturan: 'cmsPreferences',
                    'Data User': 'users',
                    'Data Role': 'roles',
                };
                const content = tab.startsWith('SEO ')
                    ? 'seoData'
                    : contentProps[tab];

                if (content && current.pathname === '/panel-admin') {
                    visit.only = [content, 'flash', 'notifications'];
                }

                if (current.searchParams.has('mode')) {
                    visit.headers['X-Cms-Return-To-List'] = '1';
                }
            }),
            router.on('start', (event) => {
                if (event.detail.visit.method !== 'get') {
                    setSaving(true);
                    setProgress(null);
                }
            }),
            router.on('progress', (event) => {
                if (active.current) {
                    setProgress(event.detail.progress?.percentage ?? null);
                }
            }),
            router.on('finish', (event) => {
                if (event.detail.visit.method !== 'get') {
                    active.current = false;
                    setSaving(false);
                    setProgress(null);
                }
            }),
            router.on('networkError', () => {
                if (active.current) {
                    setFailure(
                        'Koneksi terputus. Perubahan belum dapat dikonfirmasi. Silakan coba lagi.',
                    );
                }
            }),
            router.on('httpException', () => {
                if (active.current) {
                    setFailure(
                        'Server gagal memproses perubahan. Periksa pesan kesalahan dan coba lagi.',
                    );
                }
            }),
        ];

        return () => cleanup.forEach((stop) => stop());
    }, []);

    return (
        <>
            {saving && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-5 left-5 z-[9999] flex items-center gap-2 rounded-xl border border-admin-border bg-admin-card px-4 py-3 text-xs text-admin-text shadow-lg"
                >
                    <LoaderCircle
                        size={16}
                        className="animate-spin text-admin-accent"
                    />
                    {progress !== null && progress < 100
                        ? `Mengunggah ${progress}%...`
                        : 'Menyimpan perubahan...'}
                </div>
            )}
            <AdminToast
                show={Boolean(failure)}
                type="error"
                message={failure}
            />
        </>
    );
}
