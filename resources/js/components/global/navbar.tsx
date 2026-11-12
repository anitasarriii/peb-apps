import { usePage } from '@inertiajs/react';
import { createTimeline } from 'animejs';
import {
    ChevronDown,
    Wrench,
    Scale,
    Newspaper,
    ClipboardList,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import PebLogo from '@/components/peb-logo';
import { ANIMATION_TIMINGS } from '@/lib/constants';
import { useLocale } from '@/lib/locale-context';
import { cn } from '@/lib/utils';

interface NavLink {
    label: string;
    href: string;
}

interface NavbarProps {
    links?: NavLink[];
    logo?: ReactNode;
    cta?: {
        label: string;
        href: string;
    };
    activeLink?: string;
    ctaVariant?: 'outline' | 'white';
}

const defaultLinks: NavLink[] = [
    { label: 'Beranda', href: '/beranda' },
    { label: 'Tentang Kami', href: '/tentang-kami' },
    { label: 'Servis', href: '/servis' },
    { label: 'Kebijakan', href: '/kebijakan' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Berita & Acara', href: '/berita-acara' },
    { label: 'Pengadaan', href: '/pengadaan' },
    { label: 'Portofolio', href: '/portfolio' },
    { label: 'Hubungi Kami', href: '/kontak' },
];

const defaultCta = { label: 'Kontak Kami', href: '#kontak' };

function DefaultLogo({ isFloating }: { isFloating: boolean }) {
    const { props } = usePage();
    const header = (props as any).header;
    const logoKananSrc = header?.logo_kanan_src || '/assets/logo/logo.png';
    const logoKananDarkSrc =
        header?.logo_kanan_dark_src || '/assets/logo/logo-putih.svg';

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center overflow-visible',
                isFloating
                    ? 'h-6 sm:h-7 lg:h-9'
                    : 'h-7 sm:h-8 lg:h-10 xl:h-12',
            )}
        >
            <PebLogo
                src={logoKananSrc}
                alt="PLN Pelayanan Energi Batam"
                translate="no"
                className={cn(
                    'h-full w-auto max-w-[5.5rem] origin-center object-contain object-center align-middle transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-[6.5rem] lg:max-w-[7.5rem] xl:max-w-[10rem]',
                    isFloating ? 'hidden' : 'block dark:hidden',
                )}
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                        '/assets/logo/logo.png';
                }}
            />
            <PebLogo
                src={logoKananDarkSrc}
                alt="PLN Pelayanan Energi Batam"
                translate="no"
                className={cn(
                    'h-full w-auto max-w-[5.5rem] origin-center object-contain object-center align-middle transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-[6.5rem] lg:max-w-[7.5rem] xl:max-w-[10rem]',
                    isFloating ? 'block' : 'hidden dark:block',
                )}
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                        '/assets/logo/logo-putih.svg';
                }}
            />
        </div>
    );
}

function DanantaraLogo({
    href,
    isFloating,
}: {
    href: string;
    isFloating: boolean;
}) {
    const { props } = usePage();
    const header = (props as any).header;
    const logoKiriSrc =
        header?.logo_kiri_src || '/assets/logo/danantara-logo-hitam.svg';
    const logoKiriDarkSrc =
        header?.logo_kiri_dark_src || '/assets/logo/danantara-logo-putih.svg';

    return (
        <a
            href={href}
            className={cn(
                'flex shrink-0 items-center justify-center overflow-visible transition-opacity duration-300 hover:opacity-80',
                isFloating
                    ? 'h-4 sm:h-5 lg:h-6 xl:h-8'
                    : 'h-5 sm:h-6 lg:h-7 xl:h-8',
            )}
            aria-label="Danantara"
        >
            <img
                src={logoKiriSrc}
                alt="Danantara"
                className={cn(
                    'h-full w-auto object-contain object-center align-middle transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isFloating
                        ? 'hidden max-w-[5.5rem] sm:max-w-[6.5rem] lg:max-w-[7.5rem] xl:max-w-[10rem]'
                        : 'block max-w-[4.75rem] sm:max-w-[5.5rem] lg:max-w-[6.5rem] xl:max-w-[8rem] dark:hidden',
                )}
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                        '/assets/logo/danantara-logo-hitam.svg';
                }}
            />
            <img
                src={logoKiriDarkSrc}
                alt="Danantara"
                className={cn(
                    'h-full w-auto object-contain object-center align-middle transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isFloating
                        ? 'block max-w-[5.5rem] sm:max-w-[6.5rem] lg:max-w-[7.5rem] xl:max-w-[10rem]'
                        : 'hidden max-w-[4.75rem] sm:max-w-[5.5rem] lg:max-w-[6.5rem] xl:max-w-[8rem] dark:block',
                )}
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                        '/assets/logo/danantara-logo-putih.svg';
                }}
            />
        </a>
    );
}

const isInformasiActive = (active: string | undefined) => {
    if (!active) {
        return false;
    }

    return [
        'Servis',
        'Kebijakan',
        'Kebijakan Korporat',
        'Berita & Acara',
        'Pengadaan',
    ].includes(active);
};

const isSubLinkActive = (label: string, active: string | undefined) => {
    if (!active) {
        return false;
    }

    if (label === 'Kebijakan' && active === 'Kebijakan Korporat') {
        return true;
    }

    return label === active;
};

export default function Navbar({
    links = defaultLinks,
    cta = defaultCta,
    activeLink,
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(() =>
        isInformasiActive(activeLink),
    );
    const [isDesktopInfoOpen, setIsDesktopInfoOpen] = useState(false);
    const desktopDropdownRef = useRef<HTMLDivElement>(null);
    const { locale, setLocale } = useLocale();

    const translations = {
        id: {
            beranda: 'Beranda',
            tentangKami: 'Tentang Kami',
            informasi: 'Informasi',
            portofolio: 'Portofolio',
            galeri: 'Galeri',
            hubungiKami: 'Hubungi Kami',
            gantiBahasa: 'Ganti Bahasa / Language',
            servisTitle: 'Servis',
            servisDesc: 'Layanan energi listrik & utilitas terbaik untuk Anda.',
            kebijakanTitle: 'Kebijakan',
            kebijakanDesc: 'Tata kelola korporat, kepatuhan, dan regulasi.',
            beritaAcaraTitle: 'Berita & Acara',
            beritaAcaraDesc: 'Informasi, kegiatan, dan rilis pers terbaru.',
            laporanTitle: 'Laporan',
            laporanDesc: 'Transparansi kinerja keuangan & operasional.',
            pengadaanTitle: 'Pengadaan',
            pengadaanDesc: 'Peluang kerja sama & informasi tender korporat.',
        },
        en: {
            beranda: 'Home',
            tentangKami: 'About Us',
            informasi: 'Information',
            portofolio: 'Portfolio',
            galeri: 'Gallery',
            hubungiKami: 'Contact Us',
            gantiBahasa: 'Language / Ganti Bahasa',
            servisTitle: 'Services',
            servisDesc:
                'The best electrical energy & utility services for you.',
            kebijakanTitle: 'Policy',
            kebijakanDesc: 'Corporate governance, compliance, and regulations.',
            beritaAcaraTitle: 'News & Events',
            beritaAcaraDesc:
                'Latest information, activities, and press releases.',
            laporanTitle: 'Reports',
            laporanDesc: 'Transparency of financial & operational performance.',
            pengadaanTitle: 'Procurement',
            pengadaanDesc:
                'Cooperation opportunities & corporate tender information.',
        },
    };
    const t = translations[locale] || translations.id;

    const translatedInformasiSubLinks = [
        {
            id: 'Servis',
            label: t.servisTitle,
            href: '/servis',
            desc: t.servisDesc,
            icon: Wrench,
        },
        {
            id: 'Kebijakan',
            label: t.kebijakanTitle,
            href: '/kebijakan',
            desc: t.kebijakanDesc,
            icon: Scale,
        },
        {
            id: 'Berita & Acara',
            label: t.beritaAcaraTitle,
            href: '/berita-acara',
            desc: t.beritaAcaraDesc,
            icon: Newspaper,
        },
        {
            id: 'Pengadaan',
            label: t.pengadaanTitle,
            href: '/pengadaan',
            desc: t.pengadaanDesc,
            icon: ClipboardList,
        },
    ];

    useEffect(() => {
        // locale is now managed globally via LocaleProvider
    }, []);

    // Tutup desktop dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                desktopDropdownRef.current &&
                !desktopDropdownRef.current.contains(e.target as Node)
            ) {
                setIsDesktopInfoOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = (targetLang: 'id' | 'en') => {
        if (locale === targetLang) {
            return;
        }

        setLocale(targetLang);
    };

    const [isFloating, setIsFloating] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimationDone, setIsAnimationDone] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < 1280,
    );
    const mounted = typeof document !== 'undefined';

    const desktopMenuRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    const { props } = usePage();
    const header = (props as any).header;
    const logoKiriDarkSrc =
        header?.logo_kiri_dark_src || '/assets/logo/danantara-logo-putih.svg';

    // Deteksi Scroll untuk floating & hide effect
    useEffect(() => {
        if (!isAnimationDone) {
            return;
        }

        const handleScroll = () => {
            // Tutup mobile menu dropdown saat di-scroll agar tidak melayang di layar
            setIsOpen(false);

            const currentScrollY = window.scrollY;

            // Jika posisi di paling atas halaman (kembali ke tempat semula)
            if (currentScrollY <= 10) {
                console.log(
                    '[Navbar Scroll] Posisi kembali ke atas. Mengaktifkan navbar absolute.',
                );
                setIsFloating(false);
                setIsVisible(true);
            } else {
                // Jika sedang di scroll ke bawah -> sembunyikan (hide) navbar
                if (currentScrollY > lastScrollY.current) {
                    console.log(
                        '[Navbar Scroll] Gulir ke bawah: Sembunyikan navbar.',
                    );
                    setIsFloating(true);
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollY.current) {
                    // Jika sedang di scroll ke atas -> tampilkan floating navbar
                    console.log(
                        '[Navbar Scroll] Gulir ke atas: Tampilkan floating navbar.',
                    );
                    setIsFloating(true);
                    setIsVisible(true);
                }
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isAnimationDone]);

    useEffect(() => {
        if (window.innerWidth < 1280) {
            return;
        }

        if (desktopMenuRef.current) {
            const menu = desktopMenuRef.current;

            // Ukur lebar asli sebelum dimodifikasi
            const targetWidth = menu.scrollWidth || 500;

            // Inisialisasi state awal (v4: bisa langsung lewat style atau animate)
            menu.style.opacity = '0';
            menu.style.width = '48px';
            menu.style.transform = 'translateY(-100px)';
            menu.style.overflow = 'hidden';
            menu.style.whiteSpace = 'nowrap';

            // Tunggu page loader selesai
            console.log(
                `[Navbar] Menjadwalkan animasi masuk navbar dalam ${ANIMATION_TIMINGS.NAVBAR_ANIMATION_DELAY}ms...`,
            );
            const timer = setTimeout(() => {
                console.log(
                    '[Navbar] Memulai animasi masuk navbar (translateY & width)...',
                );
                const tl = createTimeline({
                    defaults: {
                        ease: 'outElastic(1, .8)',
                    },
                });

                tl.add(menu, {
                    translateY: 0,
                    opacity: [0, 1],
                    duration: 1000,
                }).add(
                    menu,
                    {
                        width: [48, targetWidth],
                        duration: 800,
                        ease: 'outQuart',
                        onComplete: () => {
                            console.log(
                                '[Navbar] Animasi masuk navbar selesai.',
                            );
                            menu.style.width = 'fit-content';
                            menu.style.overflow = 'visible';
                            menu.style.whiteSpace = 'normal';
                            setIsAnimationDone(true);
                        },
                    },
                    '-=500',
                );
            }, ANIMATION_TIMINGS.NAVBAR_ANIMATION_DELAY);

            return () => clearTimeout(timer);
        }
    }, []);

    const isDefaultMenu =
        links === defaultLinks ||
        (links.length === defaultLinks.length && links[0]?.href === '/beranda');

    return (
        <nav
            className={cn(
                'fixed right-6 left-6 z-50 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                isFloating
                    ? 'top-3 rounded-3xl border border-white/10 bg-[#102727]/85 px-6 py-2.5 shadow-2xl backdrop-blur-xl lg:px-8 lg:py-3'
                    : 'top-3 border-transparent bg-transparent px-5 py-4 shadow-none backdrop-blur-none lg:px-8 lg:py-6',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-28 opacity-0',
            )}
        >
            {/* Kiri: Logo Danantara */}
            <div className="flex min-w-0 shrink-0 items-center">
                <DanantaraLogo href={cta.href} isFloating={isFloating} />
            </div>

            {/* Desktop Menu */}
            <div
                ref={desktopMenuRef}
                translate="no"
                className={cn(
                    'hidden items-center gap-1 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex',
                    isFloating
                        ? 'border-transparent bg-transparent px-0 py-0 shadow-none backdrop-blur-none'
                        : 'border border-white/10 bg-[#1a3a3a]/70 px-1.5 py-1.5 shadow-lg backdrop-blur-md',
                )}
            >
                {isDefaultMenu ? (
                    <>
                        {/* 1. Beranda */}
                        <a
                            href="/beranda"
                            className={cn(
                                'relative rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-500 xl:text-base 2xl:px-6 2xl:py-2.5',
                                activeLink === 'Beranda'
                                    ? 'font-semibold text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            {t.beranda}
                            {activeLink === 'Beranda' && (
                                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#00A4B9]" />
                            )}
                        </a>

                        {/* 2. Tentang Kami */}
                        <a
                            href="/tentang-kami"
                            className={cn(
                                'relative rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-500 xl:text-base 2xl:px-6 2xl:py-2.5',
                                activeLink === 'Tentang Kami'
                                    ? 'font-semibold text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            {t.tentangKami}
                            {activeLink === 'Tentang Kami' && (
                                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#00A4B9]" />
                            )}
                        </a>

                        {/* 3. Informasi (Dropdown) */}
                        <div className="relative" ref={desktopDropdownRef}>
                            <button
                                onClick={() =>
                                    setIsDesktopInfoOpen((prev) => !prev)
                                }
                                className={cn(
                                    'relative flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-500 xl:text-base 2xl:px-6 2xl:py-2.5',
                                    isInformasiActive(activeLink) ||
                                        isDesktopInfoOpen
                                        ? 'font-semibold text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <span>{t.informasi}</span>
                                <ChevronDown
                                    className={cn(
                                        'size-3.5 text-white/50 transition-transform duration-300',
                                        isDesktopInfoOpen
                                            ? 'rotate-180 text-white'
                                            : '',
                                    )}
                                />
                                {isInformasiActive(activeLink) && (
                                    <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#00A4B9]" />
                                )}
                            </button>

                            {/* Panel Dropdown */}
                            <div
                                className={cn(
                                    'absolute top-full left-1/2 z-50 w-[360px] -translate-x-1/2 pt-3 transition-all duration-300',
                                    isDesktopInfoOpen
                                        ? 'pointer-events-auto translate-y-0 opacity-100'
                                        : 'pointer-events-none translate-y-2 opacity-0',
                                )}
                            >
                                <div className="rounded-2xl border border-white/10 bg-[#102727]/95 p-2 shadow-2xl backdrop-blur-xl">
                                    <div className="flex flex-col gap-0.5">
                                        {translatedInformasiSubLinks.map(
                                            (subLink) => {
                                                const Icon = subLink.icon;
                                                const isSubActive =
                                                    isSubLinkActive(
                                                        subLink.id,
                                                        activeLink,
                                                    );

                                                return (
                                                    <a
                                                        key={subLink.id}
                                                        href={subLink.href}
                                                        onClick={() =>
                                                            setIsDesktopInfoOpen(
                                                                false,
                                                            )
                                                        }
                                                        className={cn(
                                                            'group/item flex items-start gap-3.5 rounded-xl p-2.5 text-left transition-all duration-300',
                                                            isSubActive
                                                                ? 'bg-white/10 font-bold text-white'
                                                                : 'text-white/70 hover:bg-white/5 hover:text-white',
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                                                                isSubActive
                                                                    ? 'bg-[#00A4B9]/20 text-[#00A4B9] shadow-[0_0_10px_rgba(0,164,185,0.3)]'
                                                                    : 'bg-white/5 text-white/50 group-hover/item:bg-[#00A4B9]/10 group-hover/item:text-[#00A4B9]',
                                                            )}
                                                        >
                                                            <Icon className="size-4.5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5 text-sm font-semibold xl:text-base">
                                                                {subLink.label}
                                                                {isSubActive && (
                                                                    <span className="size-1.5 animate-pulse rounded-full bg-[#00A4B9]" />
                                                                )}
                                                            </div>
                                                            <p className="mt-0.5 text-[11px] leading-relaxed font-normal text-white/40">
                                                                {subLink.desc}
                                                            </p>
                                                        </div>
                                                    </a>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Portofolio */}
                        <a
                            href="/portfolio"
                            className={cn(
                                'relative rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-500 xl:text-base 2xl:px-6 2xl:py-2.5',
                                activeLink === 'Portofolio'
                                    ? 'font-semibold text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            {t.portofolio}
                            {activeLink === 'Portofolio' && (
                                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#00A4B9]" />
                            )}
                        </a>

                        {/* 5. Galeri */}
                        <a
                            href="/galeri"
                            className={cn(
                                'relative rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-500 xl:text-base 2xl:px-6 2xl:py-2.5',
                                activeLink === 'Galeri'
                                    ? 'font-semibold text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            {t.galeri}
                            {activeLink === 'Galeri' && (
                                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#00A4B9]" />
                            )}
                        </a>

                        {/* 6. Hubungi Kami */}
                        <a
                            href="/kontak"
                            className={cn(
                                'relative rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-500 xl:text-base 2xl:px-6 2xl:py-2.5',
                                activeLink === 'Hubungi Kami'
                                    ? 'font-semibold text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            {t.hubungiKami}
                            {activeLink === 'Hubungi Kami' && (
                                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#00A4B9]" />
                            )}
                        </a>
                    </>
                ) : (
                    links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={cn(
                                'relative rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-500 xl:text-base 2xl:px-6 2xl:py-2.5',
                                activeLink === link.label
                                    ? 'font-semibold text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            {link.label}
                            {activeLink === link.label && (
                                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#00A4B9]" />
                            )}
                        </a>
                    ))
                )}
            </div>

            {/* Desktop CTA & Language */}
            <div className="hidden items-center gap-6 lg:flex">
                {/* Logo PLN di kanan */}
                <DefaultLogo isFloating={isFloating} />
            </div>

            {/* Mobile: Logo PLN dan Hamburger di area kanan */}
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
                <DefaultLogo isFloating={isFloating} />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative h-5 w-7 transition-transform focus:outline-none ${isOpen
                            ? 'rotate-135 delay-200 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
                            : 'rotate-0 delay-0 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
                        }`}
                    aria-label="Toggle Menu"
                >
                    <span
                        className={`absolute left-0 h-0.5 w-full rounded-full bg-white transition-all ${isOpen
                                ? 'top-1/2 -translate-y-1/2 delay-0 duration-200'
                                : 'top-0 delay-500 duration-200'
                            }`}
                    />
                    <span
                        className={`absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-full bg-white transition-opacity ${isOpen
                                ? 'opacity-0 delay-0 duration-200'
                                : 'opacity-100 delay-500 duration-200'
                            }`}
                    />
                    <span
                        className={`absolute left-0 h-0.5 w-full rounded-full transition-all ${isOpen
                                ? 'top-1/2 -translate-y-1/2 delay-0 duration-200'
                                : 'top-full -translate-y-full delay-500 duration-200'
                            }`}
                    >
                        <span
                            className={`absolute block h-full w-full rounded-full bg-white transition-transform ${isOpen
                                    ? 'rotate-90 delay-200 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
                                    : 'rotate-0 delay-0 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
                                }`}
                        />
                    </span>
                </button>
            </div>

            {/* Mobile Menu Dropdown (React Portal) */}
            {mounted &&
                createPortal(
                    <div
                        className={cn(
                            'fixed right-5 left-3 z-[9999] rounded-2xl border border-white/10 bg-[#1a3a3a]/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out lg:hidden',
                            isFloating ? 'top-[76px]' : 'top-[106px]',
                            isOpen && isVisible
                                ? 'visible translate-y-0 opacity-100'
                                : 'pointer-events-none invisible -translate-y-4 opacity-0',
                        )}
                        style={{ maxHeight: '75vh', overflowY: 'auto' }}
                    >
                        <div className="flex flex-col gap-2">
                            {isDefaultMenu ? (
                                <>
                                    {/* Beranda */}
                                    <a
                                        href="/beranda"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                                            activeLink === 'Beranda'
                                                ? 'bg-white/10 font-semibold text-white'
                                                : 'text-white/80 hover:bg-white/5 hover:text-white',
                                        )}
                                    >
                                        {t.beranda}
                                    </a>

                                    {/* Tentang Kami */}
                                    <a
                                        href="/tentang-kami"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                                            activeLink === 'Tentang Kami'
                                                ? 'bg-white/10 font-semibold text-white'
                                                : 'text-white/80 hover:bg-white/5 hover:text-white',
                                        )}
                                    >
                                        {t.tentangKami}
                                    </a>

                                    {/* Informasi Accordion */}
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() =>
                                                setIsMobileInfoOpen(
                                                    !isMobileInfoOpen,
                                                )
                                            }
                                            className={cn(
                                                'flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium transition-colors',
                                                isInformasiActive(activeLink)
                                                    ? 'bg-[#00A4B9]/15 font-semibold text-white'
                                                    : 'text-white/80 hover:bg-white/5 hover:text-white',
                                            )}
                                        >
                                            <span>{t.informasi}</span>
                                            <ChevronDown
                                                className={cn(
                                                    'size-4 text-white/50 transition-transform duration-300',
                                                    isMobileInfoOpen
                                                        ? 'rotate-180'
                                                        : '',
                                                )}
                                            />
                                        </button>

                                        <div
                                            className={cn(
                                                'overflow-hidden transition-all duration-300',
                                                isMobileInfoOpen
                                                    ? 'mt-1 max-h-[500px] border-l border-white/10 pl-4 opacity-100'
                                                    : 'max-h-0 opacity-0',
                                            )}
                                        >
                                            {translatedInformasiSubLinks.map(
                                                (subLink) => {
                                                    const Icon = subLink.icon;
                                                    const isSubActive =
                                                        isSubLinkActive(
                                                            subLink.id,
                                                            activeLink,
                                                        );

                                                    return (
                                                        <a
                                                            key={subLink.id}
                                                            href={subLink.href}
                                                            onClick={() =>
                                                                setIsOpen(false)
                                                            }
                                                            className={cn(
                                                                'my-0.5 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                                                                isSubActive
                                                                    ? 'bg-[#00A4B9]/10 font-semibold text-[#00A4B9]'
                                                                    : 'text-white/70 hover:text-white',
                                                            )}
                                                        >
                                                            <Icon className="size-4 shrink-0" />
                                                            <span>
                                                                {subLink.label}
                                                            </span>
                                                        </a>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>

                                    {/* Portofolio */}
                                    <a
                                        href="/portfolio"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                                            activeLink === 'Portofolio'
                                                ? 'bg-white/10 font-semibold text-white'
                                                : 'text-white/80 hover:bg-white/5 hover:text-white',
                                        )}
                                    >
                                        {t.portofolio}
                                    </a>

                                    {/* Galeri */}
                                    <a
                                        href="/galeri"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                                            activeLink === 'Galeri'
                                                ? 'bg-white/10 font-semibold text-white'
                                                : 'text-white/80 hover:bg-white/5 hover:text-white',
                                        )}
                                    >
                                        {t.galeri}
                                    </a>

                                    {/* Hubungi Kami */}
                                    <a
                                        href="/kontak"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                                            activeLink === 'Hubungi Kami'
                                                ? 'bg-white/10 font-semibold text-white'
                                                : 'text-white/80 hover:bg-white/5 hover:text-white',
                                        )}
                                    >
                                        {t.hubungiKami}
                                    </a>
                                </>
                            ) : (
                                links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block rounded-lg px-4 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        {link.label}
                                    </a>
                                ))
                            )}
                            {/* Mobile Dropdown Language Switcher */}
                            <div className="mt-3 flex items-center justify-between border-t border-white/10 px-4 pt-4">
                                <span className="text-sm font-medium text-white/60">
                                    {t.gantiBahasa}
                                </span>
                                <div className="flex items-center rounded-full border border-white/10 bg-[#102727]/50 px-3 py-1.5 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toggleLanguage('id');
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            'cursor-pointer rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase transition-colors',
                                            locale === 'id'
                                                ? 'bg-white/10 font-bold text-white'
                                                : 'text-white/50 hover:text-white',
                                        )}
                                    >
                                        ID
                                    </button>
                                    <span className="mx-2 text-xs font-light text-white/20">
                                        |
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toggleLanguage('en');
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            'cursor-pointer rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase transition-colors',
                                            locale === 'en'
                                                ? 'bg-white/10 font-bold text-white'
                                                : 'text-white/50 hover:text-white',
                                        )}
                                    >
                                        EN
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 border-t border-white/10 pt-4">
                                {/* Mobile: Logo Danantara sebagai pengganti tombol Kontak Kami */}
                                <a
                                    href={cta.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex justify-center"
                                    aria-label="Danantara"
                                >
                                    <img
                                        src={logoKiriDarkSrc}
                                        alt="Danantara"
                                        className="block h-10 w-auto"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/assets/logo/danantara-logo-putih.svg';
                                        }}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </nav>
    );
}
