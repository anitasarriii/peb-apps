import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import AboutSection from '@/components/tentang-kami/about-section';
import HeroSection from '@/components/global/hero-section-v2';
import PartnerSection from '@/components/tentang-kami/partner-section';
import QuoteSection from '@/components/tentang-kami/quote-section';
import TeamSection from '@/components/tentang-kami/team-section';
import VisiMisiSection from '@/components/tentang-kami/visi-misi-section';

// ─── Tipe data yang dikembalikan backend ──────────────────────────────────────
interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
}

interface HeroSection {
    id: number;
    user_id: number | null;
    title: string;
    subtitle: string;
    carousel_items: CarouselItem[];
}

interface SeoMeta {
    title?: string | null;
    description?: string | null;
}

interface ProfilSection {
    id: number;
    title: string;
    description: string;
    image_src: string;
    image_source_type: 'url' | 'upload';
    image_file_name?: string;
    experience_years: string;
    experience_label: string;
    maps_label: string;
    maps_value: string;
    maps_mode: 'koordinat' | 'embed';
    maps_koordinat?: string;
    maps_embed_url?: string;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
}

interface TimSection {
    id: number;
    title: string;
    subtitle: string;
    members: TeamMember[];
}

interface StatItem {
    value: string;
    label: string;
    highlighted?: boolean;
}

interface MisiItem {
    number: number;
    title: string;
    description: string;
}

interface VisiMisiSection {
    id: number;
    visi_label: string;
    visi_text: string;
    stats: StatItem[];
    misi_title: string;
    misi_subtitle: string;
    misi_items: MisiItem[];
}

interface QuoteSectionData {
    id: number;
    quote_text: string;
    description: string;
    button_label: string;
    button_href: string;
}

interface PartnerItem {
    id: string;
    name: string;
    logoSrc: string;
    logoSource: string;
}

interface PartnerSectionData {
    id: number;
    title: string;
    partners: PartnerItem[];
}

interface Props {
    heroSection?: HeroSection | null;
    seoMeta?: SeoMeta | null;
    profilSection?: ProfilSection | null;
    timSection?: TimSection | null;
    visiMisiSection?: VisiMisiSection | null;
    quoteSection?: QuoteSectionData | null;
    partnerSection?: PartnerSectionData | null;
}

// ─── Nilai default jika data belum dikonfigurasi admin ───────────────────────
const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
    {
        id: 'slide-2',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

export default function TentangKami({
    heroSection,
    seoMeta,
    profilSection,
    timSection,
    visiMisiSection,
    quoteSection,
    partnerSection,
}: Props) {
    // Gunakan data dari DB bila tersedia, jika belum gunakan fallback default
    const heroTitle = heroSection?.title ?? 'Tentang Kami';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Informasi transparan mengenai profil PT Pelayanan Energi Batam.';
    const heroSlides = heroSection?.carousel_items?.length
        ? heroSection.carousel_items
        : DEFAULT_SLIDES;

    return (
        <>
            <Head title={seoMeta?.title ?? 'Tentang Kami'}>
                {seoMeta?.description && (
                    <meta name="description" content={seoMeta.description} />
                )}
            </Head>

            {/* Hero */}
            <div className="h-[70vh] min-h-[500px]">
                <div className="relative h-full overflow-hidden">
                    <Navbar activeLink="Tentang Kami" />
                    <HeroSection
                        title={heroTitle}
                        subtitle={heroSubtitle}
                        imageSrc={
                            heroSlides[0]?.url ??
                            '/assets/tentang-kami/hero/hero.png'
                        }
                        slides={heroSlides.map((item) => ({
                            id: item.id,
                            type: item.type,
                            url: item.url,
                        }))}
                    />
                </div>
            </div>

            {/* About */}
            <AboutSection
                title={profilSection?.title ?? undefined}
                description={profilSection?.description ?? undefined}
                imageSrc={profilSection?.image_src ?? undefined}
                experienceYears={profilSection?.experience_years ?? undefined}
                experienceLabel={profilSection?.experience_label ?? undefined}
                locationLabel={profilSection?.maps_label ?? undefined}
                locationValue={profilSection?.maps_value ?? undefined}
                mapsMode={profilSection?.maps_mode ?? undefined}
                mapsKoordinat={profilSection?.maps_koordinat ?? undefined}
                mapsEmbedUrl={profilSection?.maps_embed_url ?? undefined}
            />

            {/* Visi & Misi */}
            <VisiMisiSection
                visiLabel={visiMisiSection?.visi_label ?? undefined}
                visiText={visiMisiSection?.visi_text ?? undefined}
                stats={visiMisiSection?.stats ?? undefined}
                misiTitle={visiMisiSection?.misi_title ?? undefined}
                misiSubtitle={visiMisiSection?.misi_subtitle ?? undefined}
                misiItems={visiMisiSection?.misi_items ?? undefined}
            />

            {/* Tim Kepemimpinan */}
            <TeamSection
                title={timSection?.title ?? undefined}
                subtitle={timSection?.subtitle ?? undefined}
                members={timSection?.members ?? undefined}
            />

            {/* Quote / Komitmen */}
            <QuoteSection
                quoteText={quoteSection?.quote_text ?? undefined}
                description={quoteSection?.description ?? undefined}
                buttonLabel={quoteSection?.button_label ?? undefined}
                buttonHref={quoteSection?.button_href ?? undefined}
            />

            {/* Partner & Kolaborator */}
            <PartnerSection
                title={partnerSection?.title ?? undefined}
                partners={partnerSection?.partners ?? undefined}
            />

            {/* Footer */}
            <FooterSection />
        </>
    );
}
