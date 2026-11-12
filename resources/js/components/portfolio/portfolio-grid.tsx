import type { RefObject } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import type { ProjectItem } from './data';

interface PortfolioGridProps {
    projects: ProjectItem[];
    activeCategory: string;
    currentPage: number;
    onProjectClick: (project: ProjectItem) => void;
    viewMode?: 'grid' | 'list';
    layout?: 'grid' | 'carousel';
    scrollRef?: RefObject<HTMLDivElement | null>;
}

export default function PortfolioGrid({
    projects,
    activeCategory,
    currentPage,
    onProjectClick,
    viewMode = 'grid',
    layout = 'grid',
    scrollRef,
}: PortfolioGridProps) {
    return (
        <AnimeReveal
            key={`${activeCategory}-${currentPage}`}
            delay={150}
            distance={20}
            direction="up"
        >
            <div
                ref={scrollRef}
                className={cn(
                    layout === 'carousel'
                        ? 'hide-scrollbar flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth pb-3'
                        : 'grid items-stretch gap-5',
                    layout === 'carousel'
                        ? ''
                        : viewMode === 'grid'
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                          : 'grid-cols-1',
                )}
            >
                {projects.map((project) => (
                    <div
                        key={project.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Lihat detail ${project.title}`}
                        aria-haspopup="dialog"
                        onClick={() => onProjectClick(project)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                onProjectClick(project);
                            }
                        }}
                        className={cn(
                            'group border-gray-150 flex h-full min-w-0 transform cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-[#122b2b]',
                            layout === 'carousel' &&
                                'h-auto w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-2.5rem)/3)]',
                            viewMode === 'grid'
                                ? 'flex-col'
                                : 'flex-col md:flex-row',
                        )}
                    >
                        {/* Image with overlay badge */}
                        <div
                            className={cn(
                                'relative shrink-0 overflow-hidden',
                                viewMode === 'grid'
                                    ? 'h-48 w-full lg:h-52'
                                    : 'h-52 w-full md:h-auto md:w-64',
                            )}
                        >
                            <img
                                src={project.imageSrc}
                                alt={project.title}
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        `https://placehold.co/600x400/0d2e2e/ffffff?text=${project.title}`;
                                }}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-[#00A4B9]/5 mix-blend-multiply" />

                            {/* Category Badge overlay on top left */}
                            <div className="absolute top-4 left-4 rounded-md border border-white/10 bg-[#00A4B9] px-2.5 py-0.5 text-xs font-extrabold tracking-widest text-white uppercase shadow-xs">
                                {project.badge || project.category}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between p-5 lg:p-6">
                            <div className="space-y-3">
                                {/* Title & Date */}
                                <div className="flex flex-col gap-2">
                                    <h3
                                        className={cn(
                                            'leading-snug font-extrabold break-words whitespace-normal text-[#0d2e2e] transition-colors duration-300 group-hover:text-[#00A4B9] dark:text-white',
                                            viewMode === 'grid'
                                                ? 'text-sm md:text-base'
                                                : 'text-lg md:text-xl',
                                        )}
                                    >
                                        {project.title}
                                    </h3>
                                    <span className="shrink-0 self-start text-[10px] font-bold whitespace-nowrap text-gray-400 md:mt-1 dark:text-white/30">
                                        {project.date}
                                    </span>
                                </div>

                                {/* Description Paragraph */}
                                <p
                                    className={cn(
                                        'leading-relaxed text-gray-500 transition-colors duration-500 dark:text-white/50',
                                        viewMode === 'grid'
                                            ? 'line-clamp-3 text-xs'
                                            : 'line-clamp-4 text-sm',
                                    )}
                                >
                                    {project.description}
                                </p>
                            </div>

                            {/* View Project button link at bottom */}
                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-[#00A4B9] transition-colors duration-300 group-hover:text-[#00c5dd] dark:border-white/5">
                                <span className="text-[10px] font-black tracking-widest uppercase">
                                    Lihat Proyek
                                </span>
                                <svg
                                    className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AnimeReveal>
    );
}
