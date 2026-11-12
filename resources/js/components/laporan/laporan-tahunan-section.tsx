import AnimeReveal from '@/components/global/anime-reveal';
import ReportCard from '@/components/laporan/report-card';

interface AnnualReportItem {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    imageSrc: string;
    fileUrl: string;
    fileSize: string;
}

interface KeberlanjutanItem {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    imageSrc: string;
    fileUrl: string;
    fileSize: string;
}

interface LaporanTahunanSectionProps {
    laporanTahunanSection?: {
        section_title: string;
        section_desc: string;
        annual_reports: AnnualReportItem[];
        keberlanjutan_items: KeberlanjutanItem[];
    } | null;
    searchTerm: string;
    categoryFilter: string;
    yearFilter: string;
}

const defaultAnnual: AnnualReportItem[] = [
    {
        id: '1',
        title: 'Annual Report 2023: Powering Digital Batam',
        subtitle:
            'Tinjauan mendalam tentang transformasi infrastruktur energi untuk mendukung pertumbuhan pusat data dan industri teknologi di Kepulauan Riau.',
        badge: 'BEST IN ENERGY SECTOR',
        imageSrc: '/assets/pengadaan/items/item2.png',
        fileUrl: '#',
        fileSize: '24.5 MB',
    },
    {
        id: '2',
        title: 'Annual Report 2022: Resilient Energy',
        subtitle:
            'Bagaimana kami beradaptasi dan tetap tangguh dalam menyediakan energi yang handal di tengah tantangan ekonomi global pasca-pandemi.',
        badge: 'LEGACY & INNOVATION',
        imageSrc: '/assets/pengadaan/items/item4.png',
        fileUrl: '#',
        fileSize: '18.2 MB',
    },
];

const defaultKeberlanjutan: KeberlanjutanItem[] = [
    {
        id: '1',
        title: 'Sustainability Report 2023',
        subtitle: 'Green Energy Initiatives',
        badge: 'SUSTAINABILITY',
        imageSrc:
            'https://placehold.co/400x600/0d2e2e/ffffff?text=Sustainability',
        fileUrl: '#',
        fileSize: '12.4 MB',
    },
    {
        id: '2',
        title: 'Tata Kelola Perusahaan (GCG)',
        subtitle: 'Pedoman Etika & Integritas',
        badge: 'GOVERNANCE',
        imageSrc: 'https://placehold.co/400x600/0d2e2e/ffffff?text=GCG',
        fileUrl: '#',
        fileSize: '8.1 MB',
    },
    {
        id: '3',
        title: 'Laporan CSR 2023',
        subtitle: 'Pemberdayaan Masyarakat Lokal',
        badge: 'CSR',
        imageSrc: 'https://placehold.co/400x600/0d2e2e/ffffff?text=CSR',
        fileUrl: '#',
        fileSize: '15.6 MB',
    },
];

export default function LaporanTahunanSection({
    laporanTahunanSection,
    searchTerm,
    categoryFilter,
    yearFilter,
}: LaporanTahunanSectionProps) {
    const title = laporanTahunanSection?.section_title || 'Laporan Tahunan';
    const description =
        laporanTahunanSection?.section_desc ||
        'Dokumentasi perjalanan tahunan kami dalam membangun energi berkelanjutan.';
    const annualReports =
        laporanTahunanSection?.annual_reports || defaultAnnual;
    const keberlanjutanItems =
        laporanTahunanSection?.keberlanjutan_items || defaultKeberlanjutan;

    // Sembunyikan section jika kategori tidak relevan dengan Laporan Tahunan / Laporan Keberlanjutan
    const showSection =
        categoryFilter === 'Semua Kategori' ||
        categoryFilter === 'Laporan Tahunan' ||
        categoryFilter === 'Laporan Keberlanjutan';

    if (!showSection) {
        return null;
    }

    // Memfilter data
    const filterItem = (item: any) => {
        if (
            categoryFilter !== 'Semua Kategori' &&
            categoryFilter !==
                (annualReports.includes(item)
                    ? 'Laporan Tahunan'
                    : 'Laporan Keberlanjutan')
        ) {
            return false;
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                item.title.toLowerCase().includes(searchLower) ||
                item.subtitle.toLowerCase().includes(searchLower) ||
                (item.badge ?? '').toLowerCase().includes(searchLower);

            if (!matchesSearch) {
                return false;
            }
        }

        if (yearFilter && yearFilter !== 'Semua Tahun') {
            const matchesYear =
                item.title.toLowerCase().includes(yearFilter) ||
                (item.badge ?? '').toLowerCase().includes(yearFilter);

            if (!matchesYear) {
                return false;
            }
        }

        return true;
    };

    const allFiltered = [
        ...annualReports
            .filter(filterItem)
            .map((item) => ({ ...item, reportType: 'annual' as const })),
        ...keberlanjutanItems.filter(filterItem).map((item) => ({
            ...item,
            reportType: 'keberlanjutan' as const,
        })),
    ];

    if (allFiltered.length === 0) {
        return (
            <div className="mb-7 w-full rounded-2xl border border-dashed border-gray-200 bg-white/40 py-8 text-center backdrop-blur-sm transition-colors duration-500 dark:border-white/10 dark:bg-[#122b2b]/30">
                <p className="text-[14px] text-gray-500 dark:text-white/40">
                    Tidak ada laporan tahunan maupun publikasi keberlanjutan
                    yang cocok dengan kriteria filter Anda.
                </p>
            </div>
        );
    }

    return (
        <AnimeReveal delay={400} distance={20} className="relative z-20">
            <div className="mb-7 w-full min-w-0 border-t border-gray-100 pt-8 dark:border-white/5">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#0d2e2e] transition-colors duration-500 sm:text-lg dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500 transition-colors duration-500 dark:text-white/40">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {allFiltered.map((item) => (
                        <ReportCard
                            key={`${item.reportType}-${item.id}`}
                            title={item.title}
                            description={item.subtitle}
                            image={item.imageSrc}
                            badge={
                                item.reportType === 'annual'
                                    ? 'Laporan tahunan'
                                    : 'Keberlanjutan'
                            }
                            meta={
                                item.fileUrl && item.fileUrl !== '#'
                                    ? item.fileSize
                                    : undefined
                            }
                            href={`/laporan/detail?type=${item.reportType}&id=${encodeURIComponent(item.id)}`}
                            fileUrl={item.fileUrl}
                        />
                    ))}
                </div>
            </div>
        </AnimeReveal>
    );
}
