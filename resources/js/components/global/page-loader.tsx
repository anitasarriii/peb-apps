import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function PageLoader() {
    // isMounted mengontrol eksistensi komponen di DOM
    const [isMounted, setIsMounted] = useState(true);
    // isFadingOut mengontrol transisi fade-out halus (opacity 1 -> 0, transform scale)
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Inisialisasi locale mandiri khusus untuk loader agar tidak flash
    const [pageLocale] = useState<'id' | 'en'>(() => {
        if (typeof window === 'undefined') return 'id';
        const fromCookie = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
        const fromStorage = localStorage.getItem('peb_locale');
        const cookieVal = fromCookie ? fromCookie[1] : null;
        if (cookieVal && cookieVal !== 'id')
            return cookieVal.includes('/en') ? 'en' : 'id';
        return fromStorage === 'en' ? 'en' : 'id';
    });

    const t =
        pageLocale === 'en'
            ? { waiting: 'Please Wait' }
            : { waiting: 'Mohon Menunggu' };

    useEffect(() => {
        let fadeTimer: NodeJS.Timeout;
        let unmountTimer: NodeJS.Timeout;

        // Tampilkan dengan durasi yang tenang, nyaman & elegan (1000ms),
        // kemudian transisi fade-out sangat halus selama 850ms
        fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
            unmountTimer = setTimeout(() => {
                setIsMounted(false);
            }, 850);
        }, 1000);

        // Dengarkan navigasi antar-halaman Inertia
        const unregisterStart = router.on('start', () => {
            clearTimeout(fadeTimer);
            clearTimeout(unmountTimer);
            setIsMounted(true);
            setIsFadingOut(false);
        });

        const unregisterFinish = router.on('finish', () => {
            fadeTimer = setTimeout(() => {
                setIsFadingOut(true);
                unmountTimer = setTimeout(() => {
                    setIsMounted(false);
                }, 850);
            }, 600);
        });

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(unmountTimer);
            unregisterStart();
            unregisterFinish();
        };
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden bg-[#051616] transition-all duration-850 ease-out',
                isFadingOut
                    ? 'opacity-0 pointer-events-none scale-102 blur-xs'
                    : 'opacity-100 scale-100 blur-none'
            )}
            style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute size-96 rounded-full bg-[#00A4B9]/10 blur-3xl transition-opacity duration-850"
            />
            <div
                role="status"
                aria-live="polite"
                className={cn(
                    'relative z-10 flex w-full max-w-xs flex-col items-center px-6 text-center transition-all duration-850',
                    isFadingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                )}
                style={{
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <img
                    src="/assets/logo/logo-petir.png"
                    alt="Logo PT Pelayanan Energi Batam"
                    width={80}
                    height={80}
                    className="logo-petir-glow mb-6 h-20 w-20 object-contain"
                />
                <h2
                    suppressHydrationWarning
                    className="notranslate text-sm font-medium tracking-wider text-white/90"
                >
                    {t.waiting}
                </h2>
                <div
                    aria-hidden="true"
                    className="relative mt-4 h-1 w-36 overflow-hidden rounded-full bg-white/10"
                >
                    <div className="loading-bar bg-linear-to-r from-[#00A4B9] via-[#2dd4bf] to-[#00A4B9]" />
                </div>
            </div>
        </div>
    );
}
