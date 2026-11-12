import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroSection from '@/components/global/hero-section-v2';
import ProcurementSection from '@/components/pengadaan/procurement-section';

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

interface Props {
    heroSection?: HeroSectionData | null;
    daftarPengadaan?: any;
    seoMeta?: SeoMeta | null;
}

const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/pengadaan/banner_event.png',
    },
];

export default function Pengadaan({
    heroSection,
    daftarPengadaan,
    seoMeta,
}: Props) {
    const pageTitle =
        seoMeta?.meta_title ?? 'Pengadaan | PT Pelayanan Energi Batam';
    const heroTitle = heroSection?.title ?? 'Pengadaan';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Eksplorasi dokumentasi visual komprehensif dari fasilitas, teknologi modern, serta keterlibatan aktif tim ahli kami dalam menyokong pasokan energi Batam.';
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
                <Navbar activeLink="Pengadaan" />
                <HeroSection
                    title={heroTitle}
                    subtitle={heroSubtitle}
                    slides={heroSlides}
                />
            </div>

            {/* Procurement List Section */}
            <ProcurementSection daftarPengadaan={daftarPengadaan} />

            {/* Footer */}
            <FooterSection />
        </>
    );
}
