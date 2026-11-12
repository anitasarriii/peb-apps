import { Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppearance } from '@/hooks/use-appearance';
import { useLocale } from '@/lib/locale-context';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const { locale, setLocale } = useLocale();
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Otomatis collapse di layar mobile/tablet agar tidak menutupi konten
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsCollapsed(true);
        }
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    const changeLanguage = (targetLang: 'id' | 'en') => {
        if (locale === targetLang) return;
        setLocale(targetLang);
    };

    return (
        <div
            className={cn(
                'fixed top-1/2 right-0 z-[100] -translate-y-1/2 flex items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                isCollapsed ? 'translate-x-[60px]' : 'translate-x-0'
            )}
        >
            {/* Tombol Handle Buka/Tutup */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    'flex h-14 w-6 cursor-pointer items-center justify-center rounded-l-2xl border-y border-l shadow-2xl backdrop-blur-xl transition-all duration-300',
                    'border-gray-200 bg-white/95 text-gray-500 hover:text-gray-800 hover:bg-gray-50',
                    'dark:border-white/10 dark:bg-black/25 dark:text-white/70 dark:hover:text-white dark:hover:bg-black/35',
                )}
                aria-label="Toggle Preferences Bar"
            >
                {isCollapsed ? (
                    <ChevronLeft size={13} className="animate-pulse" />
                ) : (
                    <ChevronRight size={13} />
                )}
            </button>

            {/* Panel Kontrol Utama */}
            <div className={cn(
                'flex w-[60px] flex-col items-center gap-3 rounded-r-2xl border-y border-r p-2 shadow-2xl backdrop-blur-xl',
                'border-gray-200 bg-white/95',
                'dark:border-white/10 dark:bg-black/25'
            )}>
                {/* Dark Mode Button */}
                <button
                    onClick={toggleTheme}
                    className={cn(
                        'group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
                        'bg-gray-100 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900',
                        'dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/60 dark:hover:text-white',
                        'cursor-pointer hover:scale-105 active:scale-95',
                    )}
                    aria-label="Toggle Theme"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative h-5 w-5">
                        <Sun
                            className={cn(
                                'absolute inset-0 h-5 w-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                                appearance === 'dark'
                                    ? 'scale-0 rotate-90 opacity-0'
                                    : 'scale-100 rotate-0 text-amber-500 opacity-100',
                            )}
                        />
                        <Moon
                            className={cn(
                                'absolute inset-0 h-5 w-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                                appearance === 'dark'
                                    ? 'scale-100 rotate-0 text-cyan-400 opacity-100'
                                    : 'scale-0 -rotate-90 opacity-0',
                            )}
                        />
                    </div>

                    {/* Tooltip */}
                    <span className="pointer-events-none absolute right-full mr-3 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap uppercase">
                        {appearance === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                {/* Separator line */}
                <div className="h-px w-6 bg-gray-200 dark:bg-white/10" />

                {/* Language Controls Stack */}
                <div className="flex flex-col gap-1.5">
                    {[
                        { code: 'id' as const, label: 'ID' },
                        { code: 'en' as const, label: 'EN' },
                    ].map((lang) => {
                        const isActive = locale === lang.code;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={cn(
                                    'relative flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-black tracking-wider transition-all duration-300 cursor-pointer',
                                    isActive
                                        ? 'bg-gradient-to-tr from-[#00A4B9] to-[#008c9e] text-white shadow-lg shadow-[#00A4B9]/30 scale-105'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 bg-gray-50 dark:text-white/60 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10'
                                )}
                                aria-label={`Switch to ${lang.label}`}
                            >
                                {lang.label}

                                {/* Tooltip */}
                                <span className="pointer-events-none absolute right-full mr-3 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap uppercase">
                                    {lang.code === 'id' ? 'Bahasa Indonesia' : 'English'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
