import { Head } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import HeroSection from '@/components/global/hero-section-v2';
import BeritaDetailContent from '@/components/berita-acara/detail/berita-detail-content';

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

import { GalleryItem } from '@/components/berita-acara/detail/berita-detail-content';

export interface Berita {
    id: string;
    title: string;
    date: string;
    subtitle: string;
    imageSrc: string;
    contentImage?: string;
    content?: string;
    gallery?: GalleryItem[];
}

interface BeritaAcaraDetailProps {
    berita?: Berita | null;
    heroSection?: HeroSectionData | null;
}

const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

export default function BeritaAcaraDetail({
    berita,
    heroSection,
}: BeritaAcaraDetailProps) {
    const heroTitle = heroSection?.title ?? 'Berita & Acara';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Temukan informasi terkini, berita terbaru, dan acara yang akan datang dari PT Pelayanan Energi Batam.';
    const heroSlides = heroSection?.carousel_items?.length
        ? heroSection.carousel_items
        : DEFAULT_SLIDES;

    // Placeholder detail berita if no berita in db
    const defaultBerita = {
        title: 'Perjanjian Pengadaan Pembangkit Sewa Diesel Generating Set Lokasi PLTD Bukit Carok Kapasitas Total 7MW Sistem Isolated Tanjung Balai Karimun',
        date: 'Jan 23, 2028',
        subtitle:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
        contentImage: '/assets/beranda/portfolio/project-2.png',
        content: `
            <h2 class="text-2xl font-bold text-[#0d2e2e] dark:text-white mb-4">Introduction</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A diam maecenas sed enim ut sem viverra aliqura. Sit amet tellus cras adipiscing enim eu. Nec feugiat nisl pretium fusce id velit ut tortor pretium. Lectus proin nibh nisl condimentum id venenatis.</p>
        `,
        gallery: [
            {
                id: 'dummy-g1',
                type: 'image' as const,
                sourceType: 'url' as const,
                url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
            },
            {
                id: 'dummy-g2',
                type: 'video' as const,
                sourceType: 'url' as const,
                url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            },
            {
                id: 'dummy-g3',
                type: 'image' as const,
                sourceType: 'url' as const,
                url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
            },
        ],
    };

    const activeBerita = berita
        ? {
              ...berita,
              subtitle: stripHtml(berita.subtitle),
              content: berita.content || berita.subtitle || '',
              contentImage: berita.contentImage || berita.imageSrc,
              gallery: berita.gallery || [],
          }
        : defaultBerita;

    return (
        <>
            <Head>
                <title>{activeBerita.title || 'Berita & Acara'}</title>
                <meta
                    name="description"
                    content="Temukan informasi terkini, berita terbaru, dan acara yang akan datang dari PT Pelayanan Energi Batam."
                />
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

            {/* Content Area */}
            <BeritaDetailContent berita={activeBerita} />

            {/* Footer */}
            <FooterSection />
        </>
    );
}
