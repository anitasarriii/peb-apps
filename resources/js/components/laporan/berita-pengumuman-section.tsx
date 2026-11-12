import { ArrowRight } from 'lucide-react';
import { sectionCtaClassName } from '@/components/global/section-cta-style';
import AnimeReveal from '@/components/global/anime-reveal';
import { Link } from '@inertiajs/react';

const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

/** Data item untuk kartu berita */
interface BeritaItem {
    id?: string;
    title: string;
    subtitle: string;
    date: string;
    imageSrc?: string;
    image?: string;
}

interface BeritaSectionProps {
    beritaSection?: {
        id: number;
        section_title: string;
        section_desc?: string;
        items: BeritaItem[];
    } | null;
}

/** Data default berita & acara jika database kosong */
const defaultItems: BeritaItem[] = [
    {
        id: '1',
        title: 'Ekspansi Jaringan Listrik Baru di Kawasan Industri Kabil',
        subtitle:
            'PT Pelayanan Energi Batam mengumumkan penyelesaian proyek infrastruktur krusial untuk mendukung kebutuhan...',
        date: '28 April 2024',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: '2',
        title: 'Implementasi Panel Surya Tahap I di Kantor Pusat',
        subtitle:
            'Sebagai bagian dari komitmen Net Zero Emission 2060, kami mulai mengintegrasikan energi terbarukan pada...',
        date: '15 April 2024',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: '3',
        title: 'Peluncuran Sistem Monitoring Energi Digital Terbaru',
        subtitle:
            'Sistem baru ini memungkinkan pelanggan industri memantau konsumsi energi secara real-time dengan...',
        date: '02 April 2024',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    },
];

const bgSection =
    'bg-[#EDF5F6] transition-colors duration-500 dark:bg-[#0a1a1a]';

/**
 * Berita&Acara — Menampilkan grid berita terbaru dengan
 * gambar cover, kategori, tanggal, dan link "Baca Selengkapnya".
 */
export default function BeritaPengumumanSection({
    beritaSection,
}: BeritaSectionProps) {
    const sectionTitle = beritaSection?.section_title || 'Berita & Acara';

    // Ambil maksimal 3 berita terbaru dari database, fallback ke defaultItems jika kosong
    const items =
        beritaSection?.items && beritaSection.items.length > 0
            ? beritaSection.items.slice(0, 3)
            : defaultItems;

    return (
        <section
            className={bgSection + ' px-5 py-12 sm:px-8 lg:px-12 lg:py-20'}
        >
            <div className="mx-auto w-full max-w-[1440px]">
                <div className="w-full min-w-0 border-t border-gray-100 pt-8 lg:pt-10 dark:border-white/5">
                    {/* Section Header */}
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end lg:mb-10">
                        <div>
                            <h2 className="text-xl leading-tight font-bold text-[#1a2e2e] transition-colors duration-500 sm:text-2xl lg:text-3xl dark:text-white">
                                {sectionTitle}
                            </h2>
                            {/* Separator */}
                            <div className="mt-3 h-0.5 w-20 rounded-full bg-[#2dd4bf] sm:w-28"></div>
                        </div>
                        <Link
                            href="/berita-acara"
                            className={sectionCtaClassName}
                        >
                            Jelajahi Semua Berita
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>

                    {/* Grid Kartu Berita */}
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {items.map((item, idx) => {
                            const newsId = item.id || String(idx + 1);
                            const newsHref = `/berita-acara/detail?id=${newsId}`;
                            const newsImage = item.imageSrc || item.image || '';

                            return (
                                <Link
                                    key={idx}
                                    href={newsHref}
                                    className="group flex min-w-0 cursor-pointer flex-col bg-transparent"
                                >
                                    {/* Cover Image */}
                                    <div className="relative mb-4 h-44 w-full overflow-hidden rounded-xl sm:h-52 lg:h-56">
                                        <img
                                            src={newsImage}
                                            alt={item.title}
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    `https://placehold.co/600x400/00A4B9/ffffff?text=News`;
                                            }}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        {/* Clipping Mask Arrow Button */}
                                        <div className="absolute right-0 bottom-0 rounded-tl-[1rem] bg-[#EDF5F6] pt-3 pl-3 transition-colors duration-500 dark:bg-[#0a1a1a]">
                                            {/* Inverted corner top-right */}
                                            <div className="absolute -top-4 right-0 h-4 w-4 rounded-br-[1rem] bg-transparent shadow-[5px_5px_0_5px_#EDF5F6] transition-shadow duration-500 dark:shadow-[5px_5px_0_5px_#0a1a1a]" />
                                            {/* Inverted corner bottom-left */}
                                            <div className="absolute bottom-0 -left-4 h-4 w-4 rounded-br-[1rem] bg-transparent shadow-[5px_5px_0_5px_#EDF5F6] transition-shadow duration-500 dark:shadow-[5px_5px_0_5px_#0a1a1a]" />

                                            <div className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#00A4B9] px-3.5 text-[11px] font-bold text-white transition-all duration-300 group-hover:bg-[#1a2e2e] dark:bg-[#2dd4bf] dark:text-[#0a1a1a] dark:group-hover:bg-white">
                                                <span>Detail</span>
                                                <ArrowRight
                                                    size={14}
                                                    className="-rotate-45 transition-transform duration-300 group-hover:rotate-0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="text-xs font-semibold text-gray-400 dark:text-white/40">
                                            {item.date}
                                        </span>
                                    </div>

                                    {/* Title & Subtitle */}
                                    <h3 className="mb-2 line-clamp-3 text-base leading-snug font-bold text-[#0d2e2e] transition-colors duration-300 group-hover:text-[#00A4B9] md:text-lg dark:text-white dark:group-hover:text-[#2dd4bf]">
                                        {item.title}
                                    </h3>
                                    <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500 md:text-sm dark:text-white/50">
                                        {stripHtml(item.subtitle || '')}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
