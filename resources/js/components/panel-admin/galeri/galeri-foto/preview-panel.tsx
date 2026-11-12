import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryItem } from './types';

interface PreviewPanelProps {
    sectionTitle: string;
    items: GalleryItem[];
    categories: string[];
    activeId: string;
}

export default function PreviewPanel({
    sectionTitle,
    items,
    categories,
    activeId,
}: PreviewPanelProps) {
    return (
        <div className="relative flex h-[800px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
            {/* Header */}
            <div className="mb-4 flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Eye size={16} className="text-admin-accent" />
                    <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                        Preview Galeri
                    </span>
                </div>
                <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                    Aktif
                </span>
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
                {/* Section title */}
                <div className="mb-2">
                    <h2 className="relative inline-block text-sm font-bold text-admin-text">
                        {sectionTitle}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-10 rounded-full bg-admin-accent" />
                    </h2>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-admin-accent px-2.5 py-1 text-[10px] font-bold text-white">
                        Semua
                    </span>
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className="rounded-full border border-admin-border bg-admin-bg px-2.5 py-1 text-[10px] font-bold text-admin-text-muted"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Grid foto */}
                <div className="grid grid-cols-2 gap-2">
                    {items.map((item) => {
                        const isActive = item.id === activeId;
                        const thumb = item.imagePreviewUrl || item.imageSrc;
                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    'overflow-hidden rounded-xl border transition-all duration-300',
                                    isActive
                                        ? 'border-admin-accent/60 shadow-lg ring-1 shadow-admin-accent/10 ring-admin-accent/20'
                                        : 'border-admin-border opacity-60',
                                )}
                            >
                                {isActive && (
                                    <div className="flex items-center gap-1 border-b border-admin-accent/20 bg-admin-accent/10 px-2 py-1">
                                        <div className="size-1 rounded-full bg-admin-accent" />
                                        <span className="text-[9px] font-bold tracking-widest text-admin-accent uppercase">
                                            Diedit
                                        </span>
                                    </div>
                                )}
                                <div className="relative h-20 overflow-hidden">
                                    <img
                                        src={thumb}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                `https://placehold.co/300x200/0d2e2e/ffffff?text=${encodeURIComponent(item.category)}`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <span className="absolute top-1.5 left-1.5 rounded-full bg-admin-accent/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="bg-admin-bg/30 p-2">
                                    <p className="line-clamp-1 text-[10px] font-bold text-admin-text">
                                        {item.title}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-[9px] text-admin-text-muted/60">
                                        {item.location}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                <span>MOCKUP PREVIEW</span>
                <span>REAL-TIME SYNC</span>
            </div>
        </div>
    );
}
