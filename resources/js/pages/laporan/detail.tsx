import { Head, Link } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import ReportDetailContent from '@/components/laporan/detail/report-detail-content';
import { laporan } from '@/routes';

interface LaporanDetailProps {
    item?: any | null;
    type?: string | null;
    laporanKeuanganSection?: any | null;
    laporanTahunanSection?: any | null;
    heroSection?: any | null;
}

export default function LaporanDetail({
    item,
    type,
    laporanKeuanganSection,
    laporanTahunanSection,
}: LaporanDetailProps) {
    const title = item?.title || 'Detail Laporan & Publikasi';
    const badge =
        item?.badge || (type === 'keberlanjutan' ? 'Keberlanjutan' : 'Laporan');

    return (
        <div className="min-h-screen bg-[#f7fafb] transition-colors duration-500 dark:bg-[#0a1a1a]">
            <Head title={`${title} - PT Pelayanan Energi Batam`} />

            {/* Hero & Navbar Container */}
            <header className="relative bg-[#0d2e2e] px-5 pt-32 pb-8 sm:px-8 sm:pt-36 lg:px-12 lg:pb-10">
                <Navbar activeLink="Laporan" ctaVariant="white" />
                <div className="mx-auto max-w-[1200px]">
                    <Link
                        href={laporan()}
                        className="inline-flex min-h-10 items-center text-xs text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        ← Kembali ke Laporan
                    </Link>
                    <p className="mt-4 text-[10px] font-semibold tracking-[0.15em] text-[#8ed8dc] uppercase">
                        {badge}
                    </p>
                    <h1 className="mt-3 max-w-4xl text-xl leading-snug font-semibold text-white sm:text-2xl lg:text-[1.75rem]">
                        {title}
                    </h1>
                </div>
            </header>
            {/* Main Content Component */}
            <ReportDetailContent
                item={item}
                type={type}
                laporanKeuanganSection={laporanKeuanganSection}
                laporanTahunanSection={laporanTahunanSection}
            />

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
