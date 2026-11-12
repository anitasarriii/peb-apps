import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroSection from '@/components/global/hero-section-v2';
import DaftarServisSection from '@/components/servis/daftar-servis-section';

// ─── Tipe data yang dikirim ServisController ──────────────────────────────────
interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
}

// Catatan: dinamai HeroSectionData agar tidak bertabrakan dengan
// komponen <HeroSection> yang diimport dari hero-section-v2.
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

interface ServiceItemData {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
}

interface DaftarServisSectionData {
    id: number;
    title: string;
    services: ServiceItemData[];
}

interface Props {
    heroSection?: HeroSectionData | null;
    seoMeta?: SeoMeta | null;
    daftarServisSection?: DaftarServisSectionData | null;
}

// ─── Nilai default jika data belum dikonfigurasi admin ────────────────────────
const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

export default function Servis({
    heroSection,
    seoMeta,
    daftarServisSection,
}: Props) {
    // ── Tentukan nilai yang dirender — DB atau fallback default ───────────────
    const pageTitle =
        seoMeta?.meta_title ?? 'Servis | PT Pelayanan Energi Batam';
    const heroTitle = heroSection?.title ?? 'Servis';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Kami menghadirkan solusi energi berkelanjutan melalui layanan pengadaan dan manajemen operasional yang presisi, dirancang untuk efisiensi infrastruktur masa depan.';
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

            {/* Hero Section */}
            <div className="h-[70vh] min-h-[500px]">
                <div className="relative h-full overflow-hidden">
                    <Navbar activeLink="Servis" />
                    <HeroSection
                        title={heroTitle}
                        subtitle={heroSubtitle}
                        slides={heroSlides}
                    />
                </div>
            </div>

            {/* Daftar Servis (Custom Section) */}
            <DaftarServisSection data={daftarServisSection} />

            {/* Footer Section */}
            <FooterSection />
        </>
    );
}
