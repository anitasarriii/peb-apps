import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Grid, LayoutList } from 'lucide-react';
import { useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { formatLaporanDate } from '../laporan/laporan-keuangan-section';

const stripHtml = (html: string) => {
    if (!html) {
        return '';
    }

    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

// Dummy data untuk berita & acara
export interface BeritaItem {
    id: string;
    title: string;
    date: string;
    description: string;
    subtitle?: string;
    imageSrc: string;
}

const dummyBerita: BeritaItem[] = [
    {
        id: '1',
        title: 'Peresmian Infrastruktur Energi Terbarukan',
        date: '2024',
        description:
            'Langkah nyata dalam mendukung transisi energi hijau di wilayah operasional Batam dengan peresmian fasilitas terbaru.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
    },
    {
        id: '2',
        title: 'Penghargaan Kinerja K3 Terbaik',
        date: '2023',
        description:
            'PT Pelayanan Energi Batam kembali meraih penghargaan atas konsistensi penerapan standar keselamatan kerja zero accident.',
        imageSrc: '/assets/beranda/portfolio/project-2.png',
    },
    {
        id: '3',
        title: 'Program CSR: Edukasi Lingkungan',
        date: '2023',
        description:
            'Mendukung komunitas lokal melalui program edukasi tentang pentingnya pelestarian lingkungan dan energi bersih.',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
    },
    {
        id: '4',
        title: 'Kerjasama Strategis Skala Internasional',
        date: '2022',
        description:
            'Penandatanganan MoU dengan mitra global untuk peningkatan kapasitas dan adopsi teknologi smart grid.',
        imageSrc: '/assets/beranda/portfolio/1.png',
    },
    {
        id: '5',
        title: 'Audit Kelistrikan Rutin Kuartal II',
        date: '2022',
        description:
            'Pelaksanaan audit komprehensif pada seluruh aset transmisi guna memastikan keandalan pasokan listrik.',
        imageSrc: '/assets/beranda/portfolio/2.png',
    },
    {
        id: '6',
        title: 'Workshop Inovasi Digital 2021',
        date: '2021',
        description:
            'Pelatihan internal bagi seluruh karyawan untuk mengadopsi sistem digitalisasi dalam operasional perusahaan.',
        imageSrc: '/assets/beranda/portfolio/3.png',
    },
];

const ITEMS_PER_PAGE = 6;

interface BeritaSectionData {
    section_title: string;
    section_desc: string;
    items: BeritaItem[];
}

interface DaftarBeritaSectionProps {
    beritaSection?: BeritaSectionData | null;
}

export default function DaftarBeritaSection({
    beritaSection,
}: DaftarBeritaSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const beritaList = beritaSection?.items?.length
        ? beritaSection.items
        : dummyBerita;
    const sectionTitle = beritaSection?.section_title || 'Berita & Acara';
    const sectionDesc =
        beritaSection?.section_desc ||
        'Temukan informasi terkini, berita terbaru, dan acara yang akan datang dari PT Pelayanan Energi Batam.';

    const totalPages = Math.ceil(beritaList.length / ITEMS_PER_PAGE);

    const currentData = beritaList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
    const handleNext = () =>
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));

    return (
        <section className="bg-[#f7fafb] px-5 py-9 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-10 dark:bg-[#0a1a1a]">
            <div className="mx-auto w-full max-w-[1200px]">
                <div className="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end lg:mb-7">
                    <div className="max-w-2xl text-left">
                        <h2 className="w-fit border-b-[3px] border-[#00A4B9] pb-2 text-xl font-bold tracking-tight text-[#0d2e2e] sm:text-2xl dark:border-[#2dd4bf] dark:text-white">
                            {sectionTitle}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[#0d2e2e]/60 dark:text-white/60">
                            {sectionDesc}
                        </p>
                    </div>

                    <div className="hidden shrink-0 items-center gap-1 rounded-lg bg-white p-1 shadow-sm transition-colors duration-500 md:flex dark:bg-[#1a3a3a]">
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
                            aria-label="Tampilan daftar"
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

                <AnimeReveal
                    key={`${viewMode}-${currentPage}`}
                    delay={150}
                    distance={20}
                    direction="up"
                >
                    <div
                        className={cn(
                            'grid items-stretch gap-5',
                            viewMode === 'grid'
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1',
                        )}
                    >
                        {currentData.map((item) => (
                            <Link
                                href={`/berita-acara/detail?id=${item.id}`}
                                key={item.id}
                                className={cn(
                                    'group flex min-w-0 overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white shadow-[0_4px_24px_rgba(13,46,46,0.03)] transition-colors duration-300 hover:border-[#00A4B9]/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00A4B9] dark:border-white/10 dark:bg-[#122b2b]',
                                    viewMode === 'grid'
                                        ? 'flex-col'
                                        : 'flex-col md:flex-row',
                                )}
                            >
                                {/* Image */}
                                <div
                                    className={cn(
                                        'relative shrink-0 overflow-hidden',
                                        viewMode === 'grid'
                                            ? 'aspect-video w-full'
                                            : 'aspect-video w-full md:aspect-auto md:w-60',
                                    )}
                                >
                                    <img
                                        src={item.imageSrc}
                                        alt={item.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(item.title)}`;
                                        }}
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-[#00A4B9]/5 mix-blend-multiply" />
                                </div>

                                {/* Content Area */}
                                <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
                                    <div className="space-y-3">
                                        {/* Title & Date */}
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs font-medium text-[#0d2e2e]/50 dark:text-white/50">
                                                {formatLaporanDate(item.date)}
                                            </span>
                                            <h3
                                                className={cn(
                                                    'line-clamp-3 leading-snug font-bold break-words text-[#0d2e2e] transition-colors duration-300 group-hover:text-[#008c9e] dark:text-white dark:group-hover:text-[#2dd4bf]',
                                                    viewMode === 'grid'
                                                        ? 'text-base'
                                                        : 'text-lg',
                                                )}
                                            >
                                                {item.title}
                                            </h3>
                                        </div>

                                        {/* Description Paragraph */}
                                        <p
                                            className={cn(
                                                'text-xs leading-6 break-words text-[#0d2e2e]/65 transition-colors duration-500 dark:text-white/60',
                                                viewMode === 'grid'
                                                    ? 'line-clamp-3'
                                                    : 'line-clamp-4',
                                            )}
                                        >
                                            {stripHtml(
                                                item.subtitle ||
                                                    item.description,
                                            )}
                                        </p>
                                    </div>

                                    {/* View Link */}
                                    <div className="mt-4 flex items-center justify-between border-t border-[#0d2e2e]/10 pt-3 text-[#008c9e] dark:border-white/10 dark:text-[#2dd4bf]">
                                        <span className="text-xs font-semibold">
                                            Baca selengkapnya
                                        </span>
                                        <svg
                                            className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </AnimeReveal>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            aria-label="Halaman sebelumnya"
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all hover:border-[#00A4B9] hover:text-[#00A4B9] disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:bg-[#122b2b] dark:text-white/20 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                aria-label={`Halaman ${idx + 1}`}
                                aria-current={
                                    currentPage === idx + 1 ? 'page' : undefined
                                }
                                onClick={() => setCurrentPage(idx + 1)}
                                className={cn(
                                    'flex size-10 cursor-pointer items-center justify-center rounded-lg text-sm font-bold transition-all',
                                    currentPage === idx + 1
                                        ? 'bg-[#00A4B9] text-white shadow-lg shadow-[#00A4B9]/20 dark:bg-[#2dd4bf] dark:text-[#0d2e2e]'
                                        : 'border border-gray-200 bg-white text-gray-600 hover:border-[#00A4B9] hover:text-[#00A4B9] dark:border-white/10 dark:bg-[#122b2b] dark:text-white/60 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]',
                                )}
                            >
                                {idx + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            aria-label="Halaman berikutnya"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all hover:border-[#00A4B9] hover:text-[#00A4B9] disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:bg-[#122b2b] dark:text-white/20 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
