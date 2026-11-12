import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroSection from '@/components/global/hero-section-v2';
import PolicySection from '@/components/kebijakan/policy-section';

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
    author?: string;
    robots_index?: string;
    robots_follow?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
}

interface KebijakanCard {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    signedBy: string;
    role: string;
    date: string;
}

interface KebijakanPebSectionData {
    title: string;
    cards: KebijakanCard[];
}

interface Props {
    heroSection?: HeroSectionData | null;
    seoMeta?: SeoMeta | null;
    kebijakanPebSection?: KebijakanPebSectionData | null;
}

const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

export default function Kebijakan({
    heroSection,
    seoMeta,
    kebijakanPebSection,
}: Props) {
    const pageTitle =
        seoMeta?.meta_title ?? 'Kebijakan Korporat | PT Pelayanan Energi Batam';
    const heroTitle = heroSection?.title ?? 'Kebijakan';
    const heroSubtitle =
        heroSection?.subtitle ??
        'PT Pelayanan Energi Batam berkomitmen tinggi untuk menjalankan tata kelola perusahaan yang bersih, aman, berintegritas, dan selaras dengan standar tata kelola internasional.';
    const heroSlides = heroSection?.carousel_items?.length
        ? heroSection.carousel_items
        : DEFAULT_SLIDES;

    return (
        <div className="min-h-screen bg-[#EDF5F6] transition-colors duration-500 dark:bg-[#0a1a1a]">
            <Head>
                <title>{pageTitle}</title>
                {seoMeta?.author && (
                    <meta name="author" content={seoMeta.author} />
                )}
                {seoMeta?.robots_index && (
                    <meta
                        name="robots"
                        content={`${seoMeta.robots_index},${seoMeta.robots_follow || 'follow'}`}
                    />
                )}
                {seoMeta?.og_title && (
                    <meta property="og:title" content={seoMeta.og_title} />
                )}
                {seoMeta?.og_description && (
                    <meta
                        property="og:description"
                        content={seoMeta.og_description}
                    />
                )}
                {seoMeta?.og_image && (
                    <meta property="og:image" content={seoMeta.og_image} />
                )}
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
                <Navbar activeLink="Kebijakan Korporat" ctaVariant="white" />
                <HeroSection
                    title={heroTitle}
                    subtitle={heroSubtitle}
                    slides={heroSlides}
                />
            </div>

            {/* Kebijakan PEB Section */}
            <PolicySection kebijakanPebSection={kebijakanPebSection} />

            {/* Footer Section */}
            <FooterSection />
        </div>
    );
}
