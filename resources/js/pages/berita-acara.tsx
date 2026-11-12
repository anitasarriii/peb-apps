import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroSection from '@/components/global/hero-section-v2';
import DaftarBeritaSection from '@/components/berita-acara/daftar-berita-section';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
}

interface HeroSectionData {
    id: number;
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
    beritaSection?: any | null;
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

export default function BeritaAcara({
    heroSection,
    beritaSection,
    seoMeta,
}: Props) {
    const pageTitle =
        seoMeta?.meta_title ??
        'Berita & Acara - PT Pelayanan Energi Batam';
    const heroTitle = heroSection?.title ?? 'Berita & Acara';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Temukan informasi terkini, berita terbaru, dan acara yang akan datang dari PT Pelayanan Energi Batam.';
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
                <Navbar activeLink="Berita & Acara" ctaVariant="white" />
                <HeroSection
                    title={heroTitle}
                    subtitle={heroSubtitle}
                    slides={heroSlides}
                />
            </div>

            {/* Area konten berita dan acara */}
            <DaftarBeritaSection beritaSection={beritaSection} />

            {/* Footer */}
            <FooterSection />
        </>
    );
}
