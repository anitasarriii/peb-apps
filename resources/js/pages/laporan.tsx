import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroSection from '@/components/global/hero-section-v2';
import ReportSection from '@/components/laporan/report-section';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
}

interface HeroSectionData {
    id: number;
    user_id?: number;
    title: string;
    subtitle: string;
    carousel_items: CarouselItem[];
}

interface SeoMeta {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
}

interface LaporanKeuanganItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    badge: string;
    imageSrc: string;
}

interface LaporanKeuanganSectionData {
    section_title: string;
    section_desc: string;
    items: LaporanKeuanganItem[];
}

interface Props {
    heroSection?: HeroSectionData | null;
    laporanKeuanganSection?: LaporanKeuanganSectionData | null;
    laporanTahunanSection?: any | null;
    seoMeta?: SeoMeta | null;
}

const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

export default function Laporan({
    heroSection,
    laporanKeuanganSection,
    laporanTahunanSection,
    seoMeta,
}: Props) {
    const pageTitle =
        seoMeta?.meta_title ??
        'Laporan & Publikasi Resmi - PT Pelayanan Energi Batam';
    const heroTitle = heroSection?.title ?? 'Laporan & Publikasi';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Dokumentasi pertanggungjawaban publik, laporan tahunan, laporan keuangan audit, serta komitmen transparansi tata kelola PT Pelayanan Energi Batam.';
    const heroSlides = heroSection?.carousel_items?.length
        ? heroSection.carousel_items
        : DEFAULT_SLIDES;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                {seoMeta?.meta_description && (
                    <meta
                        name="description"
                        content={seoMeta.meta_description}
                    />
                )}
                {seoMeta?.meta_keywords && (
                    <meta name="keywords" content={seoMeta.meta_keywords} />
                )}
            </Head>

            {/* Hero & Navbar Container */}
            <div className="relative overflow-hidden">
                <Navbar activeLink="Laporan" ctaVariant="white" />
                <HeroSection
                    title={heroTitle}
                    subtitle={heroSubtitle}
                    slides={heroSlides}
                />
            </div>

            {/* Report List Section */}
            <ReportSection
                laporanKeuanganSection={laporanKeuanganSection}
                laporanTahunanSection={laporanTahunanSection}
            />

            {/* Footer */}
            <FooterSection />
        </>
    );
}
