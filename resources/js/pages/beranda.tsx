import { Head } from '@inertiajs/react';
import AboutSection from '@/components/beranda/about-section';
import LayananSection from '@/components/beranda/layanan-section';
import PartnerSection from '@/components/beranda/partner-section';
import PortfolioSection from '@/components/beranda/portfolio-section';
import StatsSection from '@/components/beranda/stats-section';
import FooterSection from '@/components/global/footer-section';
import HeroSection from '@/components/global/hero-section-v1';
import Navbar from '@/components/global/navbar';
import BeritaPengumumanSection from '@/components/laporan/berita-pengumuman-section';
import type { ProjectItem } from '@/components/portfolio/data';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    url: string;
    label?: string;
}

interface HeroSectionData {
    title: string;
    subtitle: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string | null;
    secondary_cta_href: string | null;
    carousel_items: CarouselItem[];
}

interface StatCardData {
    label: string;
    value: string;
    description: string;
}

interface AboutSectionData {
    title: string;
    subtitle: string;
    slogan_text: string | null;
    media_type: 'video' | 'image';
    media_source_type: 'url' | 'upload';
    media_url: string | null;
    media_file_name: string | null;
    efisiensi: StatCardData;
    inovatif: StatCardData;
}

interface LayananItemData {
    id: string;
    icon: string;
    title: string;
    description: string;
}

interface LayananSectionData {
    title: string;
    services: LayananItemData[];
}

interface StatistikItemData {
    id: string;
    icon: string;
    value: string;
    label: string;
}

interface StatistikSectionData {
    background_src?: string | null;
    bg_source?: 'url' | 'upload';
    stats?: StatistikItemData[];
}

interface PartnerItemData {
    id: string;
    name: string;
    logoSrc?: string;
    logoSource?: 'url' | 'upload' | 'none';
}

interface PartnerSectionData {
    title?: string;
    partners?: PartnerItemData[];
}

interface PortfolioProjectData {
    id: string;
    title: string;
    category: string;
    year: string;
    image: string;
}

interface PortfolioSectionData {
    title: string;
    description: string;
    cta_label?: string;
    projects?: PortfolioProjectData[];
}

interface SeoMetaData {
    meta_title: string;
    meta_description: string;
    meta_keywords?: string | null;
    author?: string | null;
    robots_index?: string;
    robots_follow?: string;
    og_title: string;
    og_description: string;
    og_image?: string | null;
}

interface BeritaItemData {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    imageSrc?: string;
    image?: string;
    gallery?: string[];
}

interface BeritaSectionData {
    id: number;
    section_title: string;
    section_desc?: string;
    items: BeritaItemData[];
}

interface BerandaProps {
    daftarPortfolioSection?: {
        section_title: string;
        items: ProjectItem[];
    } | null;
    heroSection?: HeroSectionData | null;
    aboutSection?: AboutSectionData | null;
    layananSection?: LayananSectionData | null;
    statistikSection?: StatistikSectionData | null;
    partnerSection?: PartnerSectionData | null;
    portfolioSection?: PortfolioSectionData | null;
    beritaSection?: BeritaSectionData | null;
    seoMeta?: SeoMetaData | null;
}

export default function Beranda({
    daftarPortfolioSection,
    heroSection,
    aboutSection,
    layananSection,
    statistikSection,
    partnerSection,
    portfolioSection,
    beritaSection,
    seoMeta,
}: BerandaProps) {
    // Fallback values untuk SEO
    const title =
        seoMeta?.meta_title ??
        'PT Pelayanan Energi Batam | Penyedia Solusi Energi Terintegrasi';
    const description =
        seoMeta?.meta_description ??
        'PT Pelayanan Energi Batam (PEB) berkomitmen menyediakan energi yang andal, inovatif, dan berkelanjutan. Temukan informasi produk, inovasi, dan layanan kami.';
    const keywords =
        seoMeta?.meta_keywords ??
        'energi batam, peb, pelayanan energi batam, energi terbarukan, gas batam, pln group';
    const author = seoMeta?.author ?? 'PT Pelayanan Energi Batam';
    const robots = `${seoMeta?.robots_index ?? 'index'}, ${seoMeta?.robots_follow ?? 'follow'}`;
    const ogTitle =
        seoMeta?.og_title ?? 'PT Pelayanan Energi Batam | Energi Bagi Negeri';
    const ogDescription =
        seoMeta?.og_description ??
        'Penyedia infrastruktur dan solusi energi terintegrasi terpercaya di Batam.';
    const ogImage = seoMeta?.og_image ?? '/assets/beranda/about/about.png';

    // Fallback values untuk Hero Section
    const heroTitle = heroSection?.title ?? 'Energi Untuk Negeri';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Mengalirkan keandalan, menghidupkan harapan. Wujud nyata komitmen kami untuk kemajuan Batam dan Indonesia.';
    const heroCtaLabel = heroSection?.cta_label ?? 'Jelajahi Inovasi Kami';
    const heroCtaHref = heroSection?.cta_href ?? '#inovasi';
    const heroSecondaryCtaLabel =
        heroSection?.secondary_cta_label ?? 'Kontak Kami';
    const heroSecondaryCtaHref = heroSection?.secondary_cta_href ?? '#kontak';

    const defaultSlides: CarouselItem[] = [
        {
            id: 'slide-1',
            type: 'video',
            url: '/assets/beranda/hero/hero-video.mp4',
            label: 'PT Pelayanan Energi Batam',
        },
    ];

    const slides =
        heroSection?.carousel_items && heroSection.carousel_items.length > 0
            ? heroSection.carousel_items
            : defaultSlides;

    const firstVideoSlide = slides.find((slide) => slide.type === 'video');

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <meta name="robots" content={robots} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:type" content="website" />

                {/* Preload aset media video pertama jika ada */}
                {firstVideoSlide && (
                    <link
                        rel="preload"
                        as="video"
                        href={firstVideoSlide.url}
                        type="video/mp4"
                    />
                )}
            </Head>

            {/* Hero (full screen) */}
            <div className="h-screen">
                <div className="relative h-full overflow-hidden">
                    <Navbar activeLink="Beranda" />
                    <HeroSection
                        title={heroTitle}
                        subtitle={heroSubtitle}
                        ctaLabel={heroCtaLabel}
                        ctaHref={heroCtaHref}
                        secondaryCtaLabel={heroSecondaryCtaLabel}
                        secondaryCtaHref={heroSecondaryCtaHref}
                        slides={slides}
                    />
                </div>
            </div>

            {/* Stats — data dari database jika tersedia */}
            <StatsSection
                backgroundSrc={statistikSection?.background_src ?? undefined}
                stats={statistikSection?.stats}
            />

            {/* Berita & Acara */}
            <BeritaPengumumanSection beritaSection={beritaSection} />

            {/* About / Stats */}
            <AboutSection
                title={aboutSection?.title}
                subtitle={aboutSection?.subtitle}
                mediaType={aboutSection?.media_type}
                mediaUrl={aboutSection?.media_url ?? undefined}
                efisiensi={aboutSection?.efisiensi}
                inovatif={aboutSection?.inovatif}
                sloganText={aboutSection?.slogan_text ?? undefined}
            />

            {/* Layanan */}
            <LayananSection
                title={layananSection?.title}
                services={layananSection?.services}
            />

            {/* Portfolio */}
            <PortfolioSection
                data={portfolioSection}
                portfolio={daftarPortfolioSection}
            />

            {/* Partner — data dari database jika tersedia */}
            <PartnerSection
                title={partnerSection?.title ?? undefined}
                partners={partnerSection?.partners}
            />

            {/* Footer */}
            <FooterSection />
        </>
    );
}
