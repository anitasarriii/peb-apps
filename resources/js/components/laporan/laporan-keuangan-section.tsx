import { ArrowRight } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import ReportCard from '@/components/laporan/report-card';

/**
 * Memformat string tanggal dari format YYYY-MM-DD ke format tampilan "DD MMM YYYY".
 * Jika string tanggal adalah format teks biasa (misal "15 Mar 2024"), langsung dikembalikan apa adanya.
 */
export function formatLaporanDate(dateStr: string): string {
    if (!dateStr) {
        return '';
    }

    const monthsEnToId: Record<string, string> = {
        jan: 'Januari',
        feb: 'Februari',
        mar: 'Maret',
        apr: 'April',
        may: 'Mei',
        jun: 'Juni',
        jul: 'Juli',
        aug: 'Agustus',
        sep: 'September',
        oct: 'Oktober',
        nov: 'November',
        dec: 'Desember',
    };

    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dateStr)) {
        // Normalisasi data lama (misal "15 Mar 2024" atau "10 May 2023") ke format bahasa Indonesia
        const parts = dateStr.trim().split(/\s+/);

        if (parts.length === 3) {
            const day = parts[0];
            const monthStr = parts[1].toLowerCase().substring(0, 3);
            const monthId = monthsEnToId[monthStr] || parts[1];
            const year = parts[2];

            return `${day} ${monthId} ${year}`;
        }

        return dateStr;
    }

    try {
        const date = new Date(dateStr);

        if (isNaN(date.getTime())) {
            return dateStr;
        }

        const monthsId = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        const day = date.getDate();
        const month = monthsId[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    } catch {
        return dateStr;
    }
}

export interface PoinUtama {
    id: string;
    text: string;
}

export interface DokumenPendukung {
    id: string;
    name: string;
    fileSize: string;
    sourceType: 'url' | 'upload';
    fileUrl: string;
    fileName?: string;
}

export interface LaporanKeuanganItem {
    id?: string;
    title: string;
    subtitle: string;
    date: string;
    badge: string;
    image?: string;
    imageSrc?: string;
    poinUtamaList?: PoinUtama[];
    dokumenList?: DokumenPendukung[];
}

export interface LaporanKeuanganSectionData {
    section_title: string;
    section_desc: string;
    items: LaporanKeuanganItem[];
}

interface LaporanKeuanganSectionProps {
    laporanKeuanganSection?: LaporanKeuanganSectionData | null;
    searchTerm: string;
    categoryFilter: string;
    yearFilter: string;
    onLihatSemua?: () => void;
}

/** Data default laporan keuangan as fallback */
const defaultItems: LaporanKeuanganItem[] = [
    {
        id: '1',
        title: 'Laporan Keuangan Konsolidasian 2023',
        subtitle:
            'Laporan audit akhir tahun yang mencakup seluruh entitas bisnis energi Batam.',
        date: '15 Mar 2024',
        badge: 'Q4 2023',
        imageSrc: '/assets/pengadaan/items/item1.png',
        poinUtamaList: [
            {
                id: '1',
                text: 'Neraca Keuangan Audited menggambarkan pertumbuhan aset bersih perusahaan sebesar 12.4% YoY.',
            },
            {
                id: '2',
                text: 'Laporan Laba Rugi menunjukkan peningkatan efisiensi biaya transmisi gas dan penguatan laba operasional.',
            },
            {
                id: '3',
                text: 'Kajian Arus Kas terperinci mengenai alokasi investasi proyek energi surya strategis di Sekupang.',
            },
            {
                id: '4',
                text: 'Opini Auditor Independen dengan hasil Wajar Tanpa Pengecualian (WTP) atas laporan konsolidasi.',
            },
        ],
        dokumenList: [
            {
                id: 'd1',
                name: 'Dokumen Laporan Keuangan Audited 2024',
                fileSize: '2.4 MB',
                sourceType: 'url',
                fileUrl: '#',
            },
        ],
    },
    {
        id: '2',
        title: 'Laporan Kinerja Kuartal III - 2023',
        subtitle:
            'Analisis pertumbuhan operasional dan efisiensi energi periode Juli-September.',
        date: '20 Nov 2023',
        badge: 'Q3 2023',
        imageSrc: '/assets/pengadaan/items/item5.png',
        poinUtamaList: [],
        dokumenList: [],
    },
    {
        id: '3',
        title: 'Laporan Kinerja Kuartal II - 2023',
        subtitle:
            'Data komprehensif mengenai realisasi anggaran dan pendapatan semester pertama.',
        date: '15 Aug 2023',
        badge: 'Q2 2023',
        imageSrc: '/assets/pengadaan/items/item3.png',
        poinUtamaList: [],
        dokumenList: [],
    },
    {
        id: '4',
        title: 'Laporan Kinerja Kuartal I - 2023',
        subtitle: 'Rangkuman inisiatif awal tahun and target operasional 2023.',
        date: '10 May 2023',
        badge: 'Q1 2023',
        imageSrc: '/assets/pengadaan/items/item6.png',
        poinUtamaList: [],
        dokumenList: [],
    },
];

export default function LaporanKeuanganSection({
    laporanKeuanganSection,
    searchTerm,
    categoryFilter,
    yearFilter,
    onLihatSemua,
}: LaporanKeuanganSectionProps) {
    const title = laporanKeuanganSection?.section_title || 'Laporan Keuangan';
    const desc =
        laporanKeuanganSection?.section_desc ||
        'Ikhtisar performa finansial per kuartal dan tahunan.';
    const items = laporanKeuanganSection?.items?.length
        ? laporanKeuanganSection.items
        : defaultItems;

    // Sembunyikan section jika kategori tidak relevan dengan Laporan Keuangan / Laporan Kinerja
    const showSection =
        categoryFilter === 'Semua Kategori' ||
        categoryFilter === 'Laporan Keuangan' ||
        categoryFilter === 'Laporan Kinerja';

    if (!showSection) {
        return null;
    }

    // Memfilter data items berdasarkan search, kategori, dan tahun
    const filteredItems = items.filter((item) => {
        // 1. Filter kategori Kinerja
        if (categoryFilter === 'Laporan Kinerja') {
            const isKinerja =
                item.title.toLowerCase().includes('kinerja') ||
                item.subtitle.toLowerCase().includes('kinerja') ||
                item.badge.toLowerCase().includes('kinerja');

            if (!isKinerja) {
                return false;
            }
        }

        // 2. Filter pencarian
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                item.title.toLowerCase().includes(searchLower) ||
                item.subtitle.toLowerCase().includes(searchLower) ||
                item.badge.toLowerCase().includes(searchLower);

            if (!matchesSearch) {
                return false;
            }
        }

        // 3. Filter tahun
        if (yearFilter && yearFilter !== 'Semua Tahun') {
            const matchesYear =
                item.date.toLowerCase().includes(yearFilter) ||
                item.title.toLowerCase().includes(yearFilter) ||
                item.badge.toLowerCase().includes(yearFilter);

            if (!matchesYear) {
                return false;
            }
        }

        return true;
    });

    // Tampilkan maksimal 4 item jika kategori filter adalah "Semua Kategori"
    const displayItems =
        categoryFilter === 'Semua Kategori'
            ? filteredItems.slice(0, 3)
            : filteredItems;

    if (displayItems.length === 0) {
        return (
            <div className="mb-7 w-full rounded-2xl border border-dashed border-gray-200 bg-white/40 py-8 text-center backdrop-blur-sm transition-colors duration-500 dark:border-white/10 dark:bg-[#122b2b]/30">
                <p className="text-[14px] text-gray-500 dark:text-white/40">
                    Tidak ada laporan keuangan yang cocok dengan kriteria filter
                    Anda.
                </p>
            </div>
        );
    }

    return (
        <AnimeReveal delay={300} distance={20} className="relative z-20">
            <div className="mb-7 w-full min-w-0">
                {/* Section Header */}
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-[#0d2e2e] transition-colors duration-500 sm:text-lg dark:text-white">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500 transition-colors duration-500 dark:text-white/40">
                            {desc}
                        </p>
                    </div>
                    {categoryFilter === 'Semua Kategori' && onLihatSemua && (
                        <button
                            onClick={onLihatSemua}
                            className="group flex cursor-pointer items-center gap-1 text-[13px] font-bold text-[#00A4B9] hover:underline dark:text-[#2dd4bf]"
                        >
                            Lihat Semua{' '}
                            <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </button>
                    )}
                </div>

                {/* Grid Kartu Laporan */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {displayItems.map((item, index) => (
                        <ReportCard
                            key={item.id ?? index}
                            title={item.title}
                            description={item.subtitle}
                            image={item.imageSrc || item.image}
                            badge={item.badge}
                            meta={formatLaporanDate(item.date)}
                            href={
                                item.id
                                    ? `/laporan/detail?id=${encodeURIComponent(item.id)}`
                                    : '/laporan/detail'
                            }
                            fileUrl={
                                item.dokumenList?.find(
                                    (document) =>
                                        document.fileUrl &&
                                        document.fileUrl !== '#',
                                )?.fileUrl
                            }
                        />
                    ))}
                </div>
            </div>
        </AnimeReveal>
    );
}
