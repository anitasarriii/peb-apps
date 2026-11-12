import { X, Calendar, Briefcase, TrendingUp, Activity } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import type { ProjectItem } from './data';

interface PortfolioLightboxProps {
    project: ProjectItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function PortfolioLightbox({
    project,
    isOpen,
    onClose,
}: PortfolioLightboxProps) {
    useEffect(() => {
        if (!isOpen || !project) {
return;
}

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
onClose();
}
        };
        window.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [isOpen, project, onClose]);

    if (!project || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 font-sans text-sm leading-6 font-normal backdrop-blur-md transition-all duration-500 ease-in-out sm:p-4',
                isOpen
                    ? 'pointer-events-auto opacity-100'
                    : 'pointer-events-none opacity-0',
            )}
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal={isOpen}
                aria-labelledby="portfolio-project-title"
                className={cn(
                    'relative max-h-[calc(100dvh-2rem)] w-full max-w-5xl min-w-0 transform overflow-x-hidden overflow-y-auto rounded-2xl border border-white/10 bg-white [overflow-wrap:anywhere] shadow-2xl transition-all duration-500 ease-in-out dark:bg-[#0c1f1f]',
                    isOpen
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'translate-y-8 scale-95 opacity-0',
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button — selalu di pojok kanan atas modal */}
                <button
                    type="button"
                    autoFocus
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 flex size-8 cursor-pointer items-center justify-center rounded-xl border border-gray-100 bg-white/80 text-gray-500 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-100 sm:size-9 dark:border-white/10 dark:bg-black/30 dark:text-white/60 dark:hover:bg-black/50 dark:hover:text-white"
                    aria-label="Tutup detail proyek"
                >
                    <X size={15} />
                </button>

                {/* Layout — stack di mobile, side-by-side di md */}
                <div className="grid min-w-0 grid-cols-1 items-stretch md:grid-cols-2">
                    {/* Image side */}
                    <div className="relative h-48 min-w-0 overflow-hidden bg-[#051515] sm:h-56 md:h-auto md:min-h-[420px]">
                        <img
                            src={project.imageSrc}
                            alt={project.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    `https://placehold.co/600x400/0d2e2e/ffffff?text=${project.title}`;
                            }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[#00A4B9]/10 mix-blend-multiply" />

                        {/* Category Badge overlay */}
                        <div className="absolute top-4 left-4 max-w-[calc(100%-4rem)] rounded-xl border border-white/20 bg-[#00A4B9]/90 px-3 py-1.5 text-xs leading-5 font-medium whitespace-normal text-white shadow-sm backdrop-blur-md sm:top-6 sm:left-6">
                            {project.badge}
                        </div>
                    </div>

                    {/* Details side — flex-col, no scroll */}
                    <div className="flex min-w-0 flex-col gap-6 bg-white p-5 pt-12 sm:p-7 sm:pt-12 md:pt-7 dark:bg-gradient-to-b dark:from-[#0c1f1f] dark:to-[#081515]">
                        <div className="space-y-2 sm:space-y-4">
                            {/* Subtitle / category */}
                            <span className="inline-block rounded-lg border border-[#00A4B9]/20 bg-[#00A4B9]/10 px-2.5 py-1 text-xs font-medium text-[#008c9e] dark:text-[#2dd4bf]">
                                Detail Proyek
                            </span>

                            {/* Main Title */}
                            <h3
                                id="portfolio-project-title"
                                className="text-lg leading-snug font-semibold break-words text-[#0d2e2e] sm:text-xl dark:text-white"
                            >
                                {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm leading-6 font-normal break-words text-gray-500 dark:text-white/60">
                                {project.description}
                            </p>
                        </div>

                        {/* Metrik Proyek Grid (2x2) */}
                        <div className="grid grid-cols-1 gap-4 border-y border-gray-100 py-5 sm:grid-cols-2 dark:border-white/5">
                            {/* Tahun */}
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#00A4B9]/10 bg-[#00A4B9]/10 text-[#00A4B9] sm:size-10 dark:border-[#2dd4bf]/10 dark:bg-[#2dd4bf]/10 dark:text-[#2dd4bf]">
                                    <Calendar size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs leading-5 font-medium text-gray-500 dark:text-white/40">
                                        Tahun
                                    </p>
                                    <p className="text-sm leading-6 font-medium break-words text-[#0d2e2e] dark:text-white">
                                        {project.date}
                                    </p>
                                </div>
                            </div>

                            {/* Klien */}
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#00A4B9]/10 bg-[#00A4B9]/10 text-[#00A4B9] sm:size-10 dark:border-[#2dd4bf]/10 dark:bg-[#2dd4bf]/10 dark:text-[#2dd4bf]">
                                    <Briefcase size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs leading-5 font-medium text-gray-500 dark:text-white/40">
                                        Klien
                                    </p>
                                    <p className="text-sm leading-6 font-medium break-words text-[#0d2e2e] dark:text-white">
                                        {project.client}
                                    </p>
                                </div>
                            </div>

                            {/* Performa */}
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#00A4B9]/10 bg-[#00A4B9]/10 text-[#00A4B9] sm:size-10 dark:border-[#2dd4bf]/10 dark:bg-[#2dd4bf]/10 dark:text-[#2dd4bf]">
                                    <TrendingUp size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs leading-5 font-medium text-gray-500 dark:text-white/40">
                                        Performa
                                    </p>
                                    <p className="text-sm leading-6 font-medium break-words text-[#0d2e2e] dark:text-white">
                                        {project.efficiency}
                                    </p>
                                </div>
                            </div>

                            {/* Lokasi */}
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#00A4B9]/10 bg-[#00A4B9]/10 text-[#00A4B9] sm:size-10 dark:border-[#2dd4bf]/10 dark:bg-[#2dd4bf]/10 dark:text-[#2dd4bf]">
                                    <Activity size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs leading-5 font-medium text-gray-500 dark:text-white/40">
                                        Lokasi
                                    </p>
                                    <p className="text-sm leading-6 font-medium break-words text-[#0d2e2e] dark:text-white">
                                        {project.location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action footer */}
                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10">
                            <span className="text-xs font-normal text-gray-500 dark:text-white/40">
                                Status: Selesai
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
