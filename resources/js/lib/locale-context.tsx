import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Locale = 'id' | 'en';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = 'peb_locale';

const LocaleContext = createContext<LocaleContextType>({
    locale: 'id',
    setLocale: () => {},
});

// --- Helper: read googtrans cookie (set by Google Translate) ---
function getGoogtransCookie(): Locale {
    if (typeof document === 'undefined') return 'id';
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    if (match && match[1]?.includes('/en')) return 'en';
    return 'id';
}

// --- Helper: set googtrans cookie so Google Translate reads it on reload ---
function setGoogtransCookie(locale: Locale) {
    if (typeof window === 'undefined') return;
    const value = locale === 'en' ? '/id/en' : '/id/id';
    const domain = window.location.hostname;
    document.cookie = `googtrans=${value}; path=/;`;
    document.cookie = `googtrans=${value}; path=/; domain=.${domain};`;
    document.cookie = `googtrans=${value}; path=/; domain=${domain};`;
    if (domain.includes('.')) {
        const parts = domain.split('.');
        if (parts.length >= 2) {
            const base = parts.slice(-2).join('.');
            document.cookie = `googtrans=${value}; path=/; domain=.${base};`;
            document.cookie = `googtrans=${value}; path=/; domain=${base};`;
        }
    }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('id');

    useEffect(() => {
        // Priority: cookie (set by Google Translate) → localStorage
        const fromCookie = getGoogtransCookie();
        const fromStorage = localStorage.getItem(STORAGE_KEY) as Locale | null;
        const current = fromCookie !== 'id' ? fromCookie : (fromStorage ?? 'id');
        setLocaleState(current);
        localStorage.setItem(STORAGE_KEY, current);
    }, []);

    const setLocale = (newLocale: Locale) => {
        // Set cookie so Google Translate picks it up on reload
        setGoogtransCookie(newLocale);
        // Persist in localStorage for UI state
        localStorage.setItem(STORAGE_KEY, newLocale);
        // Reload so Google Translate applies the translation to all page content
        window.location.reload();
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}
