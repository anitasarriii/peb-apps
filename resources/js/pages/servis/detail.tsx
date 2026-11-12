import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroDetail from '@/components/global/hero-section-v2';
import ServisDetailContent from '@/components/servis/detail/servis-detail-content';

interface ServiceItem {
    id: string | number;
    title: string;
    description: string;
    imageSrc: string;
}

interface DaftarServisSectionData {
    id: number;
    title: string;
    services: ServiceItem[];
}

interface SeoMeta {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
}

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType?: 'url' | 'upload';
    url: string;
    fileName?: string;
    positionX?: number;
    positionY?: number;
    scale?: number;
}

interface HeroSectionData {
    id?: number;
    title?: string;
    subtitle?: string;
    badge_label?: string;
    carousel_items?: CarouselItem[];
}

interface Props {
    heroSection?: HeroSectionData | null;
    seoMeta?: SeoMeta | null;
    daftarServisSection?: DaftarServisSectionData | null;
}

export default function ServisDetail({ heroSection, seoMeta, daftarServisSection }: Props) {
    const pageTitle =
        seoMeta?.meta_title ?? 'Detail Servis | PT Pelayanan Energi Batam';

    return (
        <div className="min-h-screen bg-[#EDF5F6] transition-colors duration-500 dark:bg-[#0a1a1a]">
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
                <Navbar activeLink="Servis" ctaVariant="white" />
                <HeroDetail
                    title={heroSection?.title || 'Detail Servis'}
                    subtitle={
                        heroSection?.subtitle ||
                        'Informasi lengkap mengenai kategori layanan energi PT Pelayanan Energi Batam.'
                    }
                    badgeLabel={heroSection?.badge_label || 'Servis'}
                    slides={
                        heroSection?.carousel_items &&
                        heroSection.carousel_items.length > 0
                            ? heroSection.carousel_items
                            : [
                                  {
                                      id: 'slide-1',
                                      type: 'image',
                                      url: '/assets/servis/hero/banner_service.jpg',
                                  },
                              ]
                    }
                />
            </div>

            {/* Main Content Component */}
            <ServisDetailContent data={daftarServisSection} />

            {/* Footer Section */}
            <FooterSection />
        </div>
    );
}
