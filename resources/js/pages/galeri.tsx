import { useState } from 'react';
import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroSection from '@/components/global/hero-section-v2';
import AnimeReveal from '@/components/global/anime-reveal';
import {
    galleryData,
    categories as staticCategories,
} from '@/components/galeri/data';
import type { GalleryItem } from '@/components/galeri/data';
import GalleryFilter from '@/components/galeri/gallery-filter';
import GalleryGrid from '@/components/galeri/gallery-grid';
import GalleryLightbox from '@/components/galeri/gallery-lightbox';

// ─────────────────────────────────────────────────────────────────────────────
// Tipe data dari database (id masih string, sesuai admin panel)
// ─────────────────────────────────────────────────────────────────────────────
interface DbGalleryItem {
    id: string;
    title: string;
    category: string;
    location: string;
    imageSrc: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
}

interface GaleriFotoSectionData {
    section_title?: string;
    categories?: string[];
    items?: DbGalleryItem[];
}

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    url: string;
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
    seoMeta?: SeoMeta | null;
    galeriFotoSection?: GaleriFotoSectionData | null;
}

const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Normalisasi item dari DB (id: string) ke format display (id: number)
// ─────────────────────────────────────────────────────────────────────────────
function normalizeItems(dbItems: DbGalleryItem[]): GalleryItem[] {
    return dbItems.map((item, index) => ({
        id: parseInt(item.id, 10) || index + 1,
        title: item.title,
        category: item.category,
        location: item.location,
        imageSrc: item.imageSrc,
    }));
}

export default function Galeri({
    heroSection,
    seoMeta,
    galeriFotoSection,
}: Props) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isChangingImage, setIsChangingImage] = useState(false);

    // ── Data dari DB atau fallback ke static ──────────────────────────────────
    const hasDbItems = (galeriFotoSection?.items?.length ?? 0) > 0;
    const resolvedItems: GalleryItem[] = hasDbItems
        ? normalizeItems(galeriFotoSection!.items!)
        : galleryData;

    // Tambahkan 'Semua' sebagai opsi pertama kategori
    const resolvedCategories =
        hasDbItems && galeriFotoSection?.categories?.length
            ? ['Semua', ...galeriFotoSection.categories]
            : staticCategories;

    // Judul section dari DB atau default
    const sectionTitle =
        galeriFotoSection?.section_title ?? 'Galeri Kegiatan & Fasilitas';

    // ── Hero ──────────────────────────────────────────────────────────────────
    const pageTitle =
        seoMeta?.meta_title ?? 'Galeri Dokumentasi - PT Pelayanan Energi Batam';
    const heroTitle = heroSection?.title ?? 'Galeri';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Eksplorasi dokumentasi visual komprehensif dari fasilitas, teknologi modern, serta keterlibatan aktif tim ahli kami dalam menyokong pasokan energi Batam.';
    const heroSlides = heroSection?.carousel_items?.length
        ? heroSection.carousel_items
        : DEFAULT_SLIDES;

    // ── Filter gallery items ──────────────────────────────────────────────────
    const filteredItems =
        activeCategory === 'Semua'
            ? resolvedItems
            : resolvedItems.filter((item) => item.category === activeCategory);

    const openLightbox = (id: number) => {
        const index = filteredItems.findIndex((item) => item.id === id);
        if (index !== -1) {
            setLightboxIndex(index);
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                setIsModalVisible(true);
            }, 10);
        }
    };

    const closeLightbox = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            setLightboxIndex(null);
            document.body.style.overflow = '';
        }, 500);
    };

    const changeImageIndex = (newIndex: number) => {
        setIsChangingImage(true);
        setTimeout(() => {
            setLightboxIndex(newIndex);
            setTimeout(() => {
                setIsChangingImage(false);
            }, 50);
        }, 200);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null && !isChangingImage) {
            const newIndex =
                lightboxIndex > 0
                    ? lightboxIndex - 1
                    : filteredItems.length - 1;
            changeImageIndex(newIndex);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null && !isChangingImage) {
            const newIndex =
                lightboxIndex < filteredItems.length - 1
                    ? lightboxIndex + 1
                    : 0;
            changeImageIndex(newIndex);
        }
    };

    const currentLightboxItem =
        lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

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
                    <Navbar activeLink="Galeri" />
                    <HeroSection
                        title={heroTitle}
                        subtitle={heroSubtitle}
                        slides={heroSlides}
                    />
                </div>
            </div>

            {/* Gallery Section */}
            <section className="min-h-screen bg-[#EDF5F6] px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-14 dark:bg-[#0a1a1a]">
                <div className="mx-auto w-full">
                    {/* Header */}
                    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <AnimeReveal delay={100} distance={20}>
                            <h2 className="relative inline-block text-xl font-bold text-[#0d2e2e] transition-colors duration-500 sm:text-2xl lg:text-3xl dark:text-white">
                                {sectionTitle}
                                <span className="absolute -bottom-2 left-0 h-1 w-20 rounded-full bg-[#00A4B9] dark:bg-[#2dd4bf]" />
                            </h2>
                        </AnimeReveal>

                        {/* Filter Buttons */}
                        <GalleryFilter
                            categories={resolvedCategories}
                            activeCategory={activeCategory}
                            onCategoryChange={(cat) => {
                                setActiveCategory(cat);
                                closeLightbox();
                            }}
                        />
                    </div>

                    {/* Gallery Grid */}
                    <GalleryGrid
                        items={filteredItems}
                        onItemClick={openLightbox}
                    />
                </div>
            </section>

            {/* Lightbox Modal */}
            <GalleryLightbox
                item={currentLightboxItem}
                isVisible={isModalVisible}
                isChangingImage={isChangingImage}
                onClose={closeLightbox}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            {/* Footer Section */}
            <FooterSection />
        </>
    );
}
