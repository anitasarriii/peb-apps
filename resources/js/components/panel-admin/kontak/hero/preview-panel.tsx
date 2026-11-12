import { ChevronLeft, ChevronRight } from 'lucide-react';
import SmartVideo from '@/components/global/smart-media';
import { detectMediaType, resolveImageUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
    previewUrl?: string;
    file?: File;
    positionX?: number;
    positionY?: number;
    scale?: number;
}

interface PreviewPanelProps {
    title: string;
    subtitle: string;
    carouselItems: CarouselItem[];
    activePreviewIndex: number;
    setActivePreviewIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function PreviewPanel({
    title,
    subtitle,
    carouselItems,
    activePreviewIndex,
    setActivePreviewIndex,
}: PreviewPanelProps) {
    return (
        <div className="group relative flex h-[550px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
            <div className="mb-4 flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                        Live Preview (Carousel)
                    </span>
                </div>
                <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                    Slide {activePreviewIndex + 1} dari {carouselItems.length}
                </span>
            </div>

            {/* Monitor Mockup Area */}
            <div className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-[2rem] border border-admin-border bg-[#0d2e2e] p-6 shadow-inner select-none">
                {/* Render Slide Aktif di Background Preview */}
                {carouselItems.map((slide, index) => {
                    const isActive = index === activePreviewIndex;
                    const displayUrl = slide.previewUrl || slide.url;
                    const actualType = detectMediaType(
                        displayUrl,
                        slide.file,
                        slide.type,
                    );

                    return (
                        <div
                            key={slide.id || index}
                            className={cn(
                                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                                isActive
                                    ? 'pointer-events-auto opacity-60'
                                    : 'pointer-events-none opacity-0',
                            )}
                        >
                            {isActive &&
                                (actualType === 'video' ? (
                                    <SmartVideo
                                        src={displayUrl}
                                        variant="hero"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="h-full w-full object-cover transition-all duration-700"
                                    />
                                ) : (
                                    <img
                                        src={resolveImageUrl(displayUrl)}
                                        alt={`Preview Slide ${index + 1}`}
                                        className="h-full w-full object-cover transition-all duration-300"
                                        style={{
                                            objectPosition: `${slide.positionX ?? 50}% ${slide.positionY ?? 50}%`,
                                            transform:
                                                slide.scale && slide.scale !== 1
                                                    ? `scale(${slide.scale})`
                                                    : undefined,
                                            transformOrigin: `${slide.positionX ?? 50}% ${slide.positionY ?? 50}%`,
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop';
                                        }}
                                    />
                                ))}
                        </div>
                    );
                })}

                {/* Overlay Gelap Linear */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0d2e2e] via-[#0d2e2e]/50 to-transparent" />

                {/* Kontrol Navigasi Manual di Mockup Preview */}
                {carouselItems.length > 1 && (
                    <div className="pointer-events-none absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 justify-between">
                        <button
                            type="button"
                            onClick={() =>
                                setActivePreviewIndex(
                                    (prev) =>
                                        (prev - 1 + carouselItems.length) %
                                        carouselItems.length,
                                )
                            }
                            className="pointer-events-auto flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-colors hover:bg-black/70"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setActivePreviewIndex(
                                    (prev) => (prev + 1) % carouselItems.length,
                                )
                            }
                            className="pointer-events-auto flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-colors hover:bg-black/70"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Dots Navigasi Preview */}
                {carouselItems.length > 1 && (
                    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                        {carouselItems.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActivePreviewIndex(idx)}
                                className={cn(
                                    'h-1.5 rounded-full transition-all duration-300',
                                    activePreviewIndex === idx
                                        ? 'w-5 bg-white'
                                        : 'w-1.5 bg-white/40 hover:bg-white/70',
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Konten Teks Mockup */}
                <div className="relative z-10 space-y-2 pb-6">
                    <span className="inline-block rounded-md bg-admin-accent/20 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-admin-accent uppercase backdrop-blur-md">
                        Hubungi Kami
                    </span>
                    <h3 className="line-clamp-2 text-xl font-black text-white">
                        {title || 'Hubungi Kami'}
                    </h3>
                    <p className="line-clamp-2 text-xs text-white/70">
                        {subtitle ||
                            'Kami siap mendengar kebutuhan energi dan kerja sama strategis Anda. Hubungi tim ahli kami kapan saja.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

