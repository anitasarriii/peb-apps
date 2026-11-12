import { useState } from 'react';

import LaporanKeuanganSection from '@/components/laporan/laporan-keuangan-section';
import LaporanTahunanSection from '@/components/laporan/laporan-tahunan-section';
import ReportFilterBar from '@/components/laporan/report-filter-bar';

/** Opsi filter kategori laporan */
const categories = [
    'Semua Kategori',
    'Laporan Keuangan',
    'Laporan Tahunan',
    'Laporan Keberlanjutan',
    'Laporan Kinerja',
];

/** Opsi filter tahun */
const years = ['Semua Tahun', '2025', '2024', '2023', '2022'];

interface ReportSectionProps {
    laporanKeuanganSection?: any;
    laporanTahunanSection?: any;
}

/**
 * ReportSection — Komponen orchestrator untuk halaman arsip laporan.
 * Mengelola state filter secara terpusat dan mendelegasikan rendering
 * ke masing-masing sub-komponen yang sudah dipisahkan.
 */
export default function ReportSection({
    laporanKeuanganSection,
    laporanTahunanSection,
}: ReportSectionProps) {
    // State filter terpusat — didistribusikan ke ReportFilterBar via props
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
    const [yearFilter, setYearFilter] = useState('Semua Tahun');

    const bgSection =
        'bg-[#f7fafb] transition-colors duration-500 dark:bg-[#0a1a1a]';

    /** Handler reset seluruh filter ke nilai default */
    const handleResetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('Semua Kategori');
        setYearFilter('Semua Tahun');
    };

    const handleLihatSemuaLaporanKeuangan = () => {
        setCategoryFilter('Laporan Keuangan');
        const section = document.getElementById('report-filter-section');

        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section
            id="report-filter-section"
            className={
                bgSection + ' scroll-mt-28 px-5 py-9 sm:px-8 lg:px-12 lg:py-10'
            }
        >
            <div className="mx-auto w-full max-w-[1200px]">
                <div className="mb-6">
                    <h2 className="w-fit border-b-[3px] border-[#00A4B9] pb-2 text-xl font-bold tracking-tight text-[#0d2e2e] sm:text-2xl dark:border-[#2dd4bf] dark:text-white">
                        Laporan & Publikasi
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#0d2e2e]/60 dark:text-white/60">
                        Akses laporan keuangan, laporan tahunan, dan publikasi
                        perusahaan.
                    </p>
                </div>
                {/* Modern Filter Bar */}
                <ReportFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    categoryFilter={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    yearFilter={yearFilter}
                    onYearChange={setYearFilter}
                    onReset={handleResetFilters}
                    categories={categories}
                    years={years}
                />

                {/* Section: Laporan Keuangan */}
                <LaporanKeuanganSection
                    laporanKeuanganSection={laporanKeuanganSection}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    yearFilter={yearFilter}
                    onLihatSemua={handleLihatSemuaLaporanKeuangan}
                />

                {/* Section: Laporan Tahunan & Keberlanjutan */}
                <LaporanTahunanSection
                    laporanTahunanSection={laporanTahunanSection}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    yearFilter={yearFilter}
                />
            </div>
        </section>
    );
}
