import { Head } from '@inertiajs/react';
import { Grid, LayoutList } from 'lucide-react';
import { useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import FooterSection from '@/components/global/footer-section';
import HeroSection from '@/components/global/hero-section-v2';
import Navbar from '@/components/global/navbar';
import { projectsData } from '@/components/portfolio/data';
import type { ProjectItem } from '@/components/portfolio/data';
import PortfolioFilter from '@/components/portfolio/portfolio-filter';
import PortfolioGrid from '@/components/portfolio/portfolio-grid';
import PortfolioLightbox from '@/components/portfolio/portfolio-lightbox';
import PortfolioPagination from '@/components/portfolio/portfolio-pagination';

import { cn } from '@/lib/utils';

interface CarouselSlide {
    id: string;
    type: 'video' | 'image';
    sourceType?: 'url' | 'upload';
    url: string;
}

interface HeroSectionData {
    title: string;
    subtitle: string;
    carousel_items: CarouselSlide[];
}

interface DaftarPortfolioData {
    section_title: string;
    categories: string[];
    items: ProjectItem[];
}

interface SeoMetaData {
    meta_title?: string;
    meta_description?: string;
}

interface PortfolioProps {
    heroSection?: HeroSectionData | null;
    daftarPortfolioSection?: DaftarPortfolioData | null;
    seoMeta?: SeoMetaData | null;
}

export default function Portfolio({
    heroSection,
    daftarPortfolioSection,
    seoMeta,
}: PortfolioProps) {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
        null,
    );
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const openLightbox = (project: ProjectItem) => {
        setSelectedProject(project);
        setTimeout(() => setIsLightboxOpen(true), 10);
    };
    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setTimeout(() => setSelectedProject(null), 500);
    };
    // Gunakan data dari DB jika tersedia, fallback ke static data
    const allProjects: ProjectItem[] =
        daftarPortfolioSection?.items ?? projectsData;

    const sectionTitle =
        daftarPortfolioSection?.section_title ?? 'Portfolio PEB';

    const filteredProjects = allProjects.filter((project) => {
        if (activeCategory === 'all') {
            return true;
        }

        return project.category === activeCategory;
    });

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProjects = filteredProjects.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    // Hero fallback values
    const heroTitle = heroSection?.title ?? 'Portofolio';
    const heroSubtitle =
        heroSection?.subtitle ??
        'Menjelajahi rekam jejak kesuksesan pengerjaan infrastruktur energi kritis, enjiniring kelas dunia, serta pengadaan strategis penopang kelistrikan Batam.';
    const heroSlides = heroSection?.carousel_items?.length
        ? heroSection.carousel_items
        : [
              {
                  id: 'slide-1',
                  type: 'image' as const,
                  url: '/assets/tentang-kami/hero/hero.png',
              },
          ];

    const pageTitle =
        seoMeta?.meta_title ?? 'Portofolio Proyek - PT Pelayanan Energi Batam';
    const pageDescription = seoMeta?.meta_description ?? heroSubtitle;

    return (
        <div className="min-h-screen bg-[#EDF5F6] transition-colors duration-500 dark:bg-[#0a1a1a]">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
            </Head>

            {/* Hero & Navbar Container */}
            <div className="relative overflow-hidden">
                <Navbar activeLink="Portofolio" ctaVariant="white" />
                <HeroSection
                    title={heroTitle}
                    subtitle={heroSubtitle}
                    slides={heroSlides}
                />
            </div>

            {/* Daftar Portfolio Grid Section */}
            <section className="border-gray-150 border-t bg-[#EDF5F6] px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-14 dark:border-white/5 dark:bg-[#0a1a1a]">
                <div className="mx-auto w-full max-w-[1200px]">
                    {/* Header & Filter Row */}
                    <div className="mb-16 flex min-w-0 flex-col justify-between gap-8 xl:flex-row xl:items-end">
                        <AnimeReveal delay={100} distance={20}>
                            <h2 className="relative inline-block text-xl font-extrabold text-[#0d2e2e] transition-colors duration-500 sm:text-2xl lg:text-3xl dark:text-white">
                                {sectionTitle}
                                <span className="absolute -bottom-3 left-0 h-1.5 w-24 rounded-full bg-[#00A4B9]" />
                            </h2>
                        </AnimeReveal>

                        <div className="flex w-full min-w-0 flex-col items-start gap-4 md:flex-row md:items-center xl:w-auto xl:flex-1">
                            <div className="w-full min-w-0 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <PortfolioFilter
                                    activeCategory={activeCategory}
                                    onCategoryChange={(cat) => {
                                        setActiveCategory(cat);
                                        setCurrentPage(1);
                                    }}
                                    categories={
                                        daftarPortfolioSection?.categories
                                    }
                                />
                            </div>

                            <div className="border-gray-150 hidden w-fit shrink-0 items-center justify-center gap-1 self-center rounded-lg border bg-white p-1 shadow-sm transition-colors duration-500 md:flex md:self-auto dark:border-white/5 dark:bg-[#1a3a3a]">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        'cursor-pointer rounded-md p-1.5 transition-all',
                                        viewMode === 'grid'
                                            ? 'bg-[#00A4B9] text-white shadow-sm'
                                            : 'text-gray-400 hover:text-[#00A4B9] dark:text-white/30 dark:hover:text-[#2dd4bf]',
                                    )}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        'cursor-pointer rounded-md p-1.5 transition-all',
                                        viewMode === 'list'
                                            ? 'bg-[#00A4B9] text-white shadow-sm'
                                            : 'text-gray-400 hover:text-[#00A4B9] dark:text-white/30 dark:hover:text-[#2dd4bf]',
                                    )}
                                >
                                    <LayoutList size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <PortfolioGrid
                        onProjectClick={openLightbox}
                        projects={paginatedProjects}
                        activeCategory={activeCategory}
                        currentPage={currentPage}
                        viewMode={viewMode}
                    />

                    <PortfolioPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </section>

            <PortfolioLightbox
                project={selectedProject}
                isOpen={isLightboxOpen}
                onClose={closeLightbox}
            />
            <FooterSection />
        </div>
    );
}
