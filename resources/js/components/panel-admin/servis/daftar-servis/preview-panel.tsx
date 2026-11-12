import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ServiceItem } from './service-card-editor';

interface PreviewPanelProps {
    title: string;
    services: ServiceItem[];
    activeId: string;
}

export default function PreviewPanel({
    title,
    services,
    activeId,
}: PreviewPanelProps) {
    return (
        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
            {/* Section Header */}
            <div className="mb-2">
                <h2 className="relative inline-block text-base font-bold text-admin-text">
                    {title}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-10 rounded-full bg-admin-accent" />
                </h2>
            </div>

            {/* Grid Servis */}
            {services.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/20">
                    <p className="text-xs font-semibold text-admin-text-muted">
                        Belum ada servis
                    </p>
                </div>
            ) : (
                services.map((service) => {
                    const isActive = service.id === activeId;
                    return (
                        <div
                            key={service.id}
                            className={cn(
                                'group overflow-hidden rounded-2xl border transition-all duration-300',
                                isActive
                                    ? 'border-admin-accent/60 shadow-lg ring-1 shadow-admin-accent/10 ring-admin-accent/20'
                                    : 'border-admin-border bg-admin-bg/50 opacity-60',
                            )}
                        >
                            {/* Active badge */}
                            {isActive && (
                                <div className="flex items-center gap-1.5 border-b border-admin-accent/20 bg-admin-accent/10 px-3 py-1.5">
                                    <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                    <span className="text-[10px] font-bold tracking-widest text-admin-accent uppercase">
                                        Sedang Diedit
                                    </span>
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative h-28 overflow-hidden">
                                <img
                                    src={service.imageSrc}
                                    alt={service.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            `https://placehold.co/600x400/0d2e2e/ffffff?text=${service.title}`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="space-y-1.5 bg-admin-bg/30 p-3">
                                <h3 className="line-clamp-1 text-xs font-bold text-admin-text">
                                    {service.title}
                                </h3>
                                <p className="line-clamp-2 text-[10px] leading-relaxed text-admin-text-muted">
                                    {service.description}
                                </p>
                                <button className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-bold text-admin-accent">
                                    Lihat Detail <ChevronRight size={9} />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
