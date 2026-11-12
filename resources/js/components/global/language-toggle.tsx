import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale-context';
import { cn } from '@/lib/utils';

export default function LanguageToggle() {
    const [mounted, setMounted] = useState(false);
    const { locale, setLocale } = useLocale();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleLanguage = () => {
        setLocale(locale === 'id' ? 'en' : 'id');
    };

    return (
        <div className="fixed top-[calc(50%+4.25rem)] right-4 z-[100] -translate-y-1/2">
            <button
                onClick={toggleLanguage}
                className={cn(
                    'group relative flex h-14 w-14 flex-col items-center justify-center rounded-full border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500',
                    'bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30',
                    'cursor-pointer hover:scale-110 active:scale-95',
                )}
                aria-label="Toggle Language"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex flex-col items-center justify-center">
                    <Globe
                        className="h-5 w-5 text-teal-500 transition-transform duration-500 group-hover:rotate-12 dark:text-[#2dd4bf]"
                    />
                    <span className="mt-0.5 text-[9px] font-extrabold tracking-wider uppercase text-[#0d2e2e]/80 dark:text-white/80">
                        {locale === 'id' ? 'ID' : 'EN'}
                    </span>
                </div>

                {/* Tooltip */}
                <span className="pointer-events-none absolute right-full mr-4 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-white/80 dark:text-black whitespace-nowrap">
                    {locale === 'id' ? 'Switch to English' : 'Ubah ke Bahasa Indonesia'}
                </span>
            </button>
        </div>
    );
}
