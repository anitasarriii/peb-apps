import { router } from '@inertiajs/react';
import { detail as pengadaanDetail } from '@/routes/pengadaan';
import {
    Calendar,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Grid,
    LayoutList,
    Lock,
    Eye,
    Wrench,
    FileText,
    Monitor,
    Shield,
    Car,
    Users,
    Search,
    Filter,
    ChevronDown,
    ShoppingCart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';

interface ProcurementItem {
    id: number;
    title: string;
    status: 'TERBUKA' | 'SELEKSI' | 'TUTUP';
    startDate: string;
    endDate: string;
    location: string;
    image: string;
    bannerImage?: string;
    categoryIcon: ReactNode;
    category: string;
    isArchived?: boolean;
}

const getStatusStyles = (status: ProcurementItem['status']) => {
    switch (status) {
        case 'TERBUKA':
            return 'bg-[#eaf8f9] text-[#00A4B9] border-[#b2e3e5] dark:bg-[#00A4B9]/10 dark:text-[#2dd4bf] dark:border-[#00A4B9]/20';
        case 'SELEKSI':
            return 'bg-[#fef9c3] text-[#ca8a04] border-[#fde047] dark:bg-[#fef9c3]/10 dark:text-[#fde047] dark:border-[#fde047]/20';
        case 'TUTUP':
            return 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10';
        default:
            return '';
    }
};

const ProcurementCard = ({
    item,
    index,
}: {
    item: ProcurementItem;
    index: number;
}) => {
    return (
        <AnimeReveal
            delay={200 + index * 100}
            distance={30}
            className="h-full min-w-0"
        >
            <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white shadow-[0_4px_24px_rgba(13,46,46,0.03)] transition-colors duration-300 hover:border-[#00A4B9]/40 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none dark:hover:border-white/10">
                {/* Card Header / Image */}
                <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-[#edf3f4] dark:bg-white/5">
                    <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className={cn(
                            'h-full w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none',
                            item.isArchived
                                ? 'object-contain p-3'
                                : 'object-cover',
                        )}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://placehold.co/600x400/0d2e2e/ffffff?text=${item.title.substring(0, 20)}...`;
                        }}
                    />

                    {/* Category Icon */}
                    <div className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-colors duration-500 sm:top-4 sm:right-4 dark:bg-black/40">
                        {item.categoryIcon}
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <span
                        className={cn(
                            'mb-3 w-fit rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide',
                            getStatusStyles(item.status),
                        )}
                    >
                        {item.isArchived ? 'ARSIP' : item.status}
                    </span>
                    <h3
                        className="mb-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 font-semibold text-[#0d2e2e] transition-colors duration-500 dark:text-white"
                        title={item.title}
                    >
                        {item.title}
                    </h3>

                    <div className="mb-5 space-y-3">
                        <div className="flex items-center gap-2.5 text-xs text-gray-500 transition-colors duration-500 dark:text-white/50">
                            <Calendar
                                size={16}
                                className="shrink-0 text-[#00A4B9] dark:text-[#2dd4bf]"
                            />
                            <span className="min-w-0 leading-6">
                                {item.isArchived
                                    ? 'Tanggal Pengumuman:'
                                    : 'Mulai Pendaftaran:'}{' '}
                                <span className="font-medium text-gray-700 dark:text-white/80">
                                    {item.startDate}
                                </span>
                            </span>
                        </div>
                        {!item.isArchived && (
                            <div className="flex items-center gap-2.5 text-xs text-gray-500 transition-colors duration-500 dark:text-white/50">
                                <Calendar
                                    size={16}
                                    className="shrink-0 text-red-400"
                                />
                                <span className="min-w-0 leading-6">
                                    Selesai Pendaftaran:{' '}
                                    <span className="font-medium text-gray-700 dark:text-white/80">
                                        {item.endDate}
                                    </span>
                                </span>
                            </div>
                        )}
                        <div className="flex items-start gap-2.5 text-xs text-gray-500 transition-colors duration-500 dark:text-white/50">
                            <MapPin
                                size={16}
                                className="mt-0.5 shrink-0 text-[#f5e879]"
                            />
                            <span className="line-clamp-2 leading-6">
                                {item.location}
                            </span>
                        </div>
                    </div>

                    {/* Card Action */}
                    <div className="mt-auto">
                        {item.status === 'TUTUP' && !item.isArchived ? (
                            <button
                                type="button"
                                disabled
                                className="flex w-full cursor-not-allowed items-center justify-between rounded-xl bg-gray-100 px-4 py-3 text-xs font-semibold text-gray-400 transition-colors duration-500 sm:px-4 dark:bg-white/5 dark:text-white/30"
                            >
                                Pendaftaran Ditutup
                                <Lock size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    router.visit(
                                        pengadaanDetail.url({
                                            query: { id: item.id },
                                        }),
                                    )
                                }
                                className="group/btn flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#0d2e2e] px-4 py-3 text-xs font-semibold text-white transition-all duration-500 hover:bg-[#1a4a4a] sm:px-4 dark:bg-[#00A4B9] dark:hover:bg-[#008c9e]"
                            >
                                {item.isArchived
                                    ? 'Lihat pengumuman'
                                    : 'Lihat pengadaan'}
                                <ChevronRight
                                    size={18}
                                    className="transition-transform duration-500 group-hover/btn:translate-x-1"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AnimeReveal>
    );
};
const procurementData: ProcurementItem[] = [
    {
        id: 1,
        title: 'Pengadaan Jasa Pemeliharaan Rutin Pembangkit Listrik Tenaga...',
        status: 'TERBUKA',
        startDate: '12 Okt 2023',
        endDate: '25 Okt 2023',
        location: 'PLTG Panaran, Batam',
        image: '/assets/pengadaan/items/item1.png',
        categoryIcon: <FileText className="size-5 text-gray-400" />,
        category: 'Jasa',
    },
    {
        id: 2,
        title: 'Revitalisasi Sistem Perpipaan Air Pendingin Unit 1 & 2',
        status: 'TERBUKA',
        startDate: '15 Okt 2023',
        endDate: '30 Okt 2023',
        location: 'Batu Ampar, Batam',
        image: '/assets/pengadaan/items/item2.png',
        categoryIcon: <Wrench className="size-5 text-gray-400" />,
        category: 'Pemeliharaan',
    },
    {
        id: 3,
        title: 'Pengadaan Perangkat Keras & Lisensi Software Monitoring...',
        status: 'SELEKSI',
        startDate: '18 Okt 2023',
        endDate: '05 Nov 2023',
        location: 'Kantor Pusat, Batam Center',
        image: '/assets/pengadaan/items/item3.png',
        categoryIcon: <Monitor className="size-5 text-gray-400" />,
        category: 'IT & Software',
    },
    {
        id: 4,
        title: 'Jasa Keamanan dan Pengamanan Aset Vital Perusahaan Tahun 2024',
        status: 'TERBUKA',
        startDate: '20 Okt 2023',
        endDate: '10 Nov 2023',
        location: 'Seluruh Area Operasional',
        image: '/assets/pengadaan/items/item4.png',
        categoryIcon: <Shield className="size-5 text-gray-400" />,
        category: 'Keamanan',
    },
    {
        id: 5,
        title: 'Pengadaan Armada Kendaraan Operasional Lapangan 4x4',
        status: 'TERBUKA',
        startDate: '22 Okt 2023',
        endDate: '12 Nov 2023',
        location: 'Batam Center',
        image: '/assets/pengadaan/items/item5.png',
        categoryIcon: <Car className="size-5 text-gray-400" />,
        category: 'Kendaraan',
    },
    {
        id: 6,
        title: 'Konsultasi Detail Engineering Design (DED) Gardu Induk',
        status: 'TUTUP',
        startDate: '01 Sep 2023',
        endDate: '20 Sep 2023',
        location: 'Sekupang, Batam',
        image: '/assets/pengadaan/items/item6.png',
        categoryIcon: <Users className="size-5 text-gray-400" />,
        category: 'Konsultansi',
    },
];

const CustomDropdown = ({
    value,
    onChange,
    options,
    icon: Icon,
}: {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    icon: LucideIcon;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            className="relative w-full shrink-0 lg:w-auto lg:min-w-[180px]"
            ref={dropdownRef}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border bg-gray-50/50 px-4 py-2.5 transition-all duration-500 select-none dark:bg-black/20',
                    isOpen
                        ? 'border-[#00A4B9] bg-white shadow-xl shadow-[#00A4B9]/5 dark:bg-[#1a3a3a]'
                        : 'border-gray-200/60 hover:border-[#00A4B9]/20 hover:bg-white dark:border-white/10 dark:hover:bg-[#1a3a3a]',
                )}
            >
                <Icon
                    className={cn(
                        'transition-colors duration-500',
                        isOpen
                            ? 'text-[#00A4B9] dark:text-[#2dd4bf]'
                            : 'text-gray-400 dark:text-white/40',
                    )}
                    size={18}
                />
                <span className="flex-1 text-sm font-semibold whitespace-nowrap text-gray-700 dark:text-white/80">
                    {value}
                </span>
                <ChevronDown
                    className={cn(
                        'text-gray-400 transition-transform duration-500 dark:text-white/40',
                        isOpen && 'rotate-180',
                    )}
                    size={16}
                />
            </div>

            {/* Seamless Dropdown Menu */}
            <div
                className={cn(
                    'absolute top-[calc(100%+0.5rem)] right-0 left-0 z-[100] origin-top overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-2xl transition-all duration-500 dark:border-white/10 dark:bg-[#1a3a3a]',
                    isOpen
                        ? 'visible translate-y-0 scale-100 opacity-100'
                        : 'invisible -translate-y-2 scale-95 opacity-0',
                )}
            >
                <div className="max-h-60 overflow-y-auto py-2 transition-all [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-[#00A4B9]/30 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={cn(
                                'flex cursor-pointer items-center justify-between px-6 py-3.5 text-sm font-semibold transition-all duration-200',
                                value === opt
                                    ? 'bg-[#00A4B9]/5 text-[#00A4B9] dark:bg-[#00A4B9]/10 dark:text-[#2dd4bf]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#00A4B9] dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-[#2dd4bf]',
                            )}
                        >
                            {opt}
                            {value === opt && (
                                <div className="size-1.5 rounded-full bg-[#00A4B9] dark:bg-[#2dd4bf]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface ProcurementSectionProps {
    daftarPengadaan?: {
        section_title: string;
        categories: string[];
        items: {
            id: string;
            title: string;
            status: 'TERBUKA' | 'SELEKSI' | 'TUTUP';
            startDate: string;
            endDate: string;
            location: string;
            category: string;
            imageSrc: string;
            bannerImage?: string;
        }[];
    } | null;
}

// Helper untuk ikon kategori dinamis

const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();

    if (cat.includes('jasa')) {
        return <FileText className="size-5 text-gray-400" />;
    }

    if (cat.includes('pelihara') || cat.includes('pemeliharaan')) {
        return <Wrench className="size-5 text-gray-400" />;
    }

    if (
        cat.includes('it') ||
        cat.includes('software') ||
        cat.includes('komputer')
    ) {
        return <Monitor className="size-5 text-gray-400" />;
    }

    if (cat.includes('aman') || cat.includes('keamanan')) {
        return <Shield className="size-5 text-gray-400" />;
    }

    if (
        cat.includes('kendaraan') ||
        cat.includes('mobil') ||
        cat.includes('motor')
    ) {
        return <Car className="size-5 text-gray-400" />;
    }

    if (cat.includes('konsultasi') || cat.includes('konsultansi')) {
        return <Users className="size-5 text-gray-400" />;
    }

    return <ShoppingCart className="size-5 text-gray-400" />;
};

export default function ProcurementSection({
    daftarPengadaan,
}: ProcurementSectionProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
    const [locationFilter, setLocationFilter] = useState('Semua Lokasi');
    const [statusFilter, setStatusFilter] = useState('Semua Status');

    const sectionTitle =
        daftarPengadaan?.section_title ?? 'Daftar Pengadaan Terbaru';

    const activeItems = useMemo(() => {
        const baseItems = daftarPengadaan?.items ?? procurementData;

        return baseItems
            .map((item: any) => ({
                id: item.id,
                title: item.title,
                status: item.status,
                isArchived: item.isArchived === true,
                startDate: item.startDate,
                endDate: item.endDate,
                location: item.location,
                image: item.imageSrc || item.image,
                bannerImage: item.bannerImage,
                categoryIcon: getCategoryIcon(item.category),
                category: item.category,
            }))
            .sort((first, second) => {
                if (first.isArchived !== second.isArchived) {
                    return first.isArchived ? 1 : -1;
                }

                return first.isArchived
                    ? second.startDate.localeCompare(first.startDate)
                    : 0;
            });
    }, [daftarPengadaan?.items]);

    // Filter Logic
    const filteredData = useMemo(() => {
        return activeItems.filter((item) => {
            const matchesSearch = item.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesCategory =
                categoryFilter === 'Semua Kategori' ||
                item.category === categoryFilter;
            const matchesLocation =
                locationFilter === 'Semua Lokasi' ||
                item.location
                    .toLowerCase()
                    .includes(locationFilter.toLowerCase());
            const matchesStatus =
                statusFilter === 'Semua Status' ||
                (statusFilter === 'Arsip' ? item.isArchived : !item.isArchived);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation &&
                matchesStatus
            );
        });
    }, [searchTerm, categoryFilter, locationFilter, statusFilter, activeItems]);

    // Pagination States & Logic
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={cn(
                        'flex size-10 cursor-pointer items-center justify-center rounded-lg text-sm transition-all',
                        currentPage === i
                            ? 'bg-[#00A4B9] font-bold text-white shadow-lg shadow-[#00A4B9]/20 dark:bg-[#2dd4bf] dark:text-[#0d2e2e]'
                            : 'border border-gray-200 bg-white font-semibold text-gray-600 hover:border-[#00A4B9] hover:text-[#00A4B9] dark:border-white/10 dark:bg-[#122b2b] dark:text-white/60 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]',
                    )}
                >
                    {i}
                </button>,
            );
        }

        return pages;
    };

    const categories = useMemo(() => {
        if (
            daftarPengadaan?.categories &&
            daftarPengadaan.categories.length > 0
        ) {
            return ['Semua Kategori', ...daftarPengadaan.categories];
        }

        return [
            'Semua Kategori',
            'Jasa',
            'Pemeliharaan',
            'IT & Software',
            'Keamanan',
            'Kendaraan',
            'Konsultansi',
        ];
    }, [daftarPengadaan]);

    const locations = useMemo(() => {
        const itemLocations = (daftarPengadaan?.items ?? procurementData)
            .map((i: any) => {
                const parts = i.location.split(',');

                return parts[0]?.trim() || '';
            })
            .filter(Boolean);
        const uniqueLocations = Array.from(new Set(itemLocations));

        return ['Semua Lokasi', ...uniqueLocations];
    }, [daftarPengadaan?.items]);

    return (
        <section className="bg-[#f7fafb] px-5 py-9 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-10 dark:bg-[#0a1a1a]">
            <div className="mx-auto w-full max-w-[1200px]">
                {/* Header Section */}
                <div className="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <AnimeReveal delay={100} distance={20}>
                            <h2 className="relative mb-3 inline-block text-xl font-bold text-[#0d2e2e] transition-colors duration-500 sm:text-2xl dark:text-white">
                                {sectionTitle}
                                {/* separator */}
                                <span className="absolute -bottom-2 left-0 h-[3px] w-16 rounded-full bg-[#00A4B9] dark:bg-[#2dd4bf]" />
                            </h2>
                        </AnimeReveal>

                        <div className="mt-4 flex items-center gap-2">
                            <div className="hidden items-center gap-1 rounded-lg bg-white p-1 shadow-sm transition-colors duration-500 md:flex dark:bg-[#1a3a3a]">
                                <button
                                    type="button"
                                    aria-label="Tampilan kartu"
                                    aria-pressed={viewMode === 'grid'}
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        'cursor-pointer rounded-md p-1.5 transition-all',
                                        viewMode === 'grid'
                                            ? 'bg-[#00A4B9] text-white shadow-sm'
                                            : 'text-gray-400 hover:text-[#00A4B9] dark:text-white/30 dark:hover:text-[#2dd4bf]',
                                    )}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Tampilan tabel"
                                    aria-pressed={viewMode === 'list'}
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        'cursor-pointer rounded-md p-1.5 transition-all',
                                        viewMode === 'list'
                                            ? 'bg-[#00A4B9] text-white shadow-sm'
                                            : 'text-gray-400 hover:text-[#00A4B9] dark:text-white/30 dark:hover:text-[#2dd4bf]',
                                    )}
                                >
                                    <LayoutList size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <p className="text-sm text-gray-500 transition-colors duration-500 dark:text-white/40">
                            Menampilkan {paginatedData.length} dari{' '}
                            {filteredData.length} pengadaan
                        </p>
                    </div>
                </div>

                <div
                    className="mb-5 flex flex-wrap gap-2"
                    aria-label="Jenis pengadaan"
                >
                    {[
                        {
                            value: 'Semua Status',
                            label: 'Semua',
                            count: activeItems.length,
                        },
                        {
                            value: 'Aktif',
                            label: 'Pengadaan aktif',
                            count: activeItems.filter(
                                (item) => !item.isArchived,
                            ).length,
                        },
                        {
                            value: 'Arsip',
                            label: 'Arsip',
                            count: activeItems.filter((item) => item.isArchived)
                                .length,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            aria-pressed={statusFilter === tab.value}
                            onClick={() => {
                                setStatusFilter(tab.value);
                                setCurrentPage(1);
                            }}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A4B9]',
                                statusFilter === tab.value
                                    ? 'border-[#0d2e2e] bg-[#0d2e2e] text-white dark:border-[#2dd4bf] dark:bg-[#2dd4bf] dark:text-[#0d2e2e]'
                                    : 'border-[#0d2e2e]/10 bg-white text-[#0d2e2e]/65 hover:border-[#00A4B9]/40 dark:border-white/10 dark:bg-[#122b2b] dark:text-white/60',
                            )}
                        >
                            {tab.label}
                            <span className="rounded bg-current/10 px-1.5 text-[10px] tabular-nums">
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Modern Filter Bar */}
                <AnimeReveal
                    delay={200}
                    distance={20}
                    className="relative z-30"
                >
                    <div className="mb-6 w-full">
                        <div className="flex flex-col items-stretch gap-3 rounded-xl border border-[#0d2e2e]/10 bg-white p-3 shadow-xs transition-colors duration-500 lg:flex-row lg:flex-wrap lg:items-center dark:border-white/10 dark:bg-[#122b2b]/80 dark:shadow-none">
                            {/* Search Input */}
                            <div className="flex w-full min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200/60 bg-gray-50/50 px-4 py-2.5 transition-all duration-500 focus-within:border-[#00A4B9]/30 focus-within:bg-white dark:border-white/10 dark:bg-black/20 dark:focus-within:bg-[#1a3a3a]">
                                <Search
                                    className="shrink-0 text-gray-400 dark:text-white/30"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    aria-label="Cari pengadaan"
                                    placeholder="Cari nama tender atau nomor pengadaan..."
                                    className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 dark:text-white/80 dark:placeholder:text-white/20"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            {/* Category Filter */}
                            <CustomDropdown
                                value={categoryFilter}
                                onChange={(value) => {
                                    setCategoryFilter(value);
                                    setCurrentPage(1);
                                }}
                                options={categories}
                                icon={Filter}
                            />

                            {/* Location Filter */}
                            <CustomDropdown
                                value={locationFilter}
                                onChange={(value) => {
                                    setLocationFilter(value);
                                    setCurrentPage(1);
                                }}
                                options={locations}
                                icon={MapPin}
                            />

                            {/* Reset filters */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('Semua Kategori');
                                    setLocationFilter('Semua Lokasi');
                                    setStatusFilter('Semua Status');
                                    setCurrentPage(1);
                                }}
                                className="flex w-full cursor-pointer items-center justify-center rounded-lg px-3 py-2.5 text-xs font-medium text-[#008c9e] transition-colors hover:bg-[#00A4B9]/5 sm:w-auto dark:text-[#2dd4bf]"
                            >
                                Reset filter
                            </button>
                        </div>
                    </div>
                </AnimeReveal>

                {/* Items Grid / List Container */}
                <div className="relative w-full">
                    {filteredData.length > 0 ? (
                        <AnimeReveal
                            key={`${viewMode}-${filteredData.length}-${currentPage}`}
                            delay={0}
                            distance={20}
                            className="w-full transition-all duration-500"
                        >
                            {viewMode === 'list' ? (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="hidden overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white shadow-xs transition-colors duration-500 lg:block dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                        <table className="w-full border-collapse text-left">
                                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-white/10 dark:bg-black/20">
                                                <tr>
                                                    {/* <th className="px-5 py-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-white/30">
                                                        Status
                                                    </th> */}
                                                    <th className="px-4 py-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-white/30">
                                                        Judul Tender
                                                    </th>
                                                    <th className="px-4 py-3 text-center text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-white/30">
                                                        Tanggal / Mulai
                                                    </th>
                                                    <th className="px-4 py-3 text-center text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-white/30">
                                                        Selesai Pendaftaran
                                                    </th>
                                                    <th className="px-4 py-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-white/30">
                                                        Lokasi
                                                    </th>
                                                    <th className="px-5 py-3 text-right text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-white/30">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedData.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5"
                                                    >
                                                        {/* <td className="px-5 py-4">
                                                            <div
                                                                className={cn(
                                                                    'inline-block rounded-lg border px-3 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors duration-500',
                                                                    getStatusStyles(
                                                                        item.status,
                                                                    ),
                                                                )}
                                                            >
                                                                {item.status}
                                                            </div>
                                                        </td> */}
                                                        <td className="px-4 py-4">
                                                            <p className="max-w-md text-sm leading-6 font-semibold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                                                {item.title}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-sm text-gray-500 dark:text-white/40">
                                                            {item.startDate}
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-sm text-gray-500 dark:text-white/40">
                                                            {item.isArchived
                                                                ? '—'
                                                                : item.endDate}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-white/40">
                                                            {
                                                                item.location.split(
                                                                    ',',
                                                                )[0]
                                                            }
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            {item.status ===
                                                                'TUTUP' &&
                                                            !item.isArchived ? (
                                                                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400 transition-colors duration-500 dark:bg-white/5 dark:text-white/20">
                                                                    <Lock
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            pengadaanDetail.url(
                                                                                {
                                                                                    query: {
                                                                                        id: item.id,
                                                                                    },
                                                                                },
                                                                            ),
                                                                        )
                                                                    }
                                                                    className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#00A4B9] text-white shadow-lg shadow-[#00A4B9]/20 transition-all hover:bg-[#008c9e] dark:bg-[#2dd4bf] dark:text-[#0d2e2e] dark:hover:bg-[#00A4B9]"
                                                                >
                                                                    <Eye
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Grid View (Fall back for List mode on small screens) */}
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
                                        {paginatedData.map((item, index) => (
                                            <ProcurementCard
                                                key={item.id}
                                                item={item}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* Standard Grid View */
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {paginatedData.map((item, index) => (
                                        <ProcurementCard
                                            key={item.id}
                                            item={item}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimeReveal>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center px-4 py-20 text-center transition-colors duration-500">
                            <div className="mb-6 rounded-full border border-transparent bg-white p-8 shadow-xl shadow-gray-200/50 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                <Search
                                    size={48}
                                    className="text-gray-300 dark:text-white/10"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                Tidak ada pengadaan ditemukan
                            </h3>
                            <p className="mt-2 text-gray-500 transition-colors duration-500 dark:text-white/40">
                                Coba ubah kata kunci atau filter Anda
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('Semua Kategori');
                                    setLocationFilter('Semua Lokasi');
                                    setStatusFilter('Semua Status');
                                    setCurrentPage(1);
                                }}
                                className="font-regular mt-6 cursor-pointer text-sm text-[#00A4B9] transition-colors duration-500 hover:underline dark:text-[#2dd4bf]"
                            >
                                Reset Semua Filter
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={cn(
                                'flex size-10 items-center justify-center rounded-lg border transition-all',
                                currentPage === 1
                                    ? 'cursor-not-allowed border-gray-200/50 bg-gray-50/50 text-gray-300 dark:border-white/5 dark:bg-[#122b2b]/50 dark:text-white/10'
                                    : 'cursor-pointer border-gray-200 bg-white text-gray-400 hover:border-[#00A4B9] hover:text-[#00A4B9] dark:border-white/10 dark:bg-[#122b2b] dark:text-white/20 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]',
                            )}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {renderPageNumbers()}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={cn(
                                'flex size-10 items-center justify-center rounded-lg border transition-all',
                                currentPage === totalPages
                                    ? 'cursor-not-allowed border-gray-200/50 bg-gray-50/50 text-gray-300 dark:border-white/5 dark:bg-[#122b2b]/50 dark:text-white/10'
                                    : 'cursor-pointer border-gray-200 bg-white text-gray-400 hover:border-[#00A4B9] hover:text-[#00A4B9] dark:border-white/10 dark:bg-[#122b2b] dark:text-white/20 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]',
                            )}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
