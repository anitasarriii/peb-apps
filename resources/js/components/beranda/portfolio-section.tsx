import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { sectionCtaClassName } from '@/components/global/section-cta-style';

import { useEffect, useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { projectsData } from '@/components/portfolio/data';
import type { ProjectItem } from '@/components/portfolio/data';
import PortfolioGrid from '@/components/portfolio/portfolio-grid';
import PortfolioLightbox from '@/components/portfolio/portfolio-lightbox';
import { portfolio as portfolioRoute } from '@/routes';

interface PortfolioSectionProps {
    data?: { description?: string } | null;
    portfolio?: { section_title: string; items: ProjectItem[] } | null;
}

export default function PortfolioSection({
    data,
    portfolio,
}: PortfolioSectionProps) {
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
        null,
    );
    const visibleProjects = (portfolio?.items ?? projectsData).slice(0, 6);

    useEffect(() => {
        if (!selectedProject) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedProject(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedProject]);

    return (
        <section className="bg-[#EDF5F6] px-5 py-10 transition-colors duration-500 sm:px-8 lg:px-12 dark:bg-[#0a1a1a]">
            <div className="mx-auto w-full max-w-[1200px]">
                <AnimeReveal
                    delay={100}
                    distance={30}
                    direction="up"
                    className="mb-6 flex flex-wrap items-end justify-between gap-4"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-bold text-[#0d2e2e] sm:text-2xl dark:text-white">
                            {portfolio?.section_title || 'Portfolio PEB'}
                        </h2>
                        <div
                            aria-hidden="true"
                            className="mt-3 h-0.5 w-24 rounded-full bg-[#2dd4bf]"
                        />
                        <p className="mt-3 text-sm leading-6 text-[#0d2e2e]/60 dark:text-white/60">
                            {data?.description ||
                                'Rekam jejak proyek dan layanan PT Pelayanan Energi Batam.'}
                        </p>
                    </div>
                    <Link
                        href={portfolioRoute()}
                        className={sectionCtaClassName}
                    >
                        Lihat semua portofolio
                        <ArrowRight aria-hidden="true" />
                    </Link>
                </AnimeReveal>
                {visibleProjects.length > 0 ? (
                    <>
                        <PortfolioGrid
                            projects={visibleProjects}
                            activeCategory="all"
                            currentPage={1}
                            onProjectClick={setSelectedProject}
                            viewMode="grid"
                        />
                    </>
                ) : (
                    <p className="rounded-xl border border-[#0d2e2e]/10 p-6 text-sm text-[#0d2e2e]/60 dark:border-white/10 dark:text-white/60">
                        Belum ada portofolio yang ditampilkan.
                    </p>
                )}
            </div>
            {selectedProject && (
                <PortfolioLightbox
                    project={selectedProject}
                    isOpen
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}
