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
    setActivePreviewIndex:
        | React.Dispatch<React.SetStateAction<number>>
        | ((i: number) => void);
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
                <div className="pointer-events-none absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            (setActivePreviewIndex as any)(
                                (activePreviewIndex -
                                    1 +
                                    carouselItems.length) %
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
                            (setActivePreviewIndex as any)(
                                (activePreviewIndex + 1) % carouselItems.length,
                            )
                        }
                        className="pointer-events-auto flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-colors hover:bg-black/70"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Titik Indikator Slide (Bullet Points) */}
                <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-20 flex justify-center gap-1.5">
                    {carouselItems.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => (setActivePreviewIndex as any)(idx)}
                            className={cn(
                                'size-1.5 cursor-pointer rounded-full transition-all duration-300',
                                activePreviewIndex === idx
                                    ? 'w-4 bg-admin-accent shadow-sm'
                                    : 'bg-white/40 hover:bg-white/70',
                            )}
                        />
                    ))}
                </div>

                {/* Simulasi Logo/Header Kiri Atas */}
                <div className="pointer-events-none absolute top-0 left-0 flex h-8 w-20 items-center justify-center rounded-br-2xl border-r border-b border-admin-border/50 bg-admin-card">
                    <div className="size-2 animate-pulse rounded-full bg-admin-accent" />
                    <span className="ml-1 text-[8px] font-black tracking-tighter text-admin-text-muted">
                        PEB LOGO
                    </span>
                </div>

                {/* Simulasi Konten Teks Landing Page */}
                <div className="pointer-events-none relative z-10 max-w-[85%] space-y-3">
                    <h1 className="font-sans text-lg leading-tight font-black break-words text-white drop-shadow-md lg:text-2xl">
                        {title || 'Portfolio'}
                    </h1>
                    <p className="line-clamp-3 font-sans text-[10px] leading-relaxed text-white/80 drop-shadow-sm">
                        {subtitle ||
                            'Karya dan proyek yang telah kami selesaikan.'}
                    </p>
                    <div className="pointer-events-none flex flex-wrap gap-2 pt-2">
                        <span className="inline-block rounded-full bg-white px-5 py-2 text-[10px] font-bold text-[#0d2e2e] shadow-lg">
                            Pelajari Lebih Lanjut
                        </span>
                    </div>
                </div>

                {/* Scroll Down Button */}
                <div className="pointer-events-none absolute right-0 bottom-0 flex h-12 w-12 items-center justify-center rounded-tl-2xl border-t border-l border-admin-border/50 bg-admin-card">
                    <div className="flex size-6 items-center justify-center rounded-full border border-admin-text-muted/30 text-admin-text-muted">
                        <span className="text-[8px]">↓</span>
                    </div>
                </div>
            </div>

            {/* Keterangan Mockup */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-admin-text-muted">
                <span>MOCKUP PREVIEW CAROUSEL</span>
                <span>ASPECT RATIO 16:9</span>
            </div>
        </div>
    );
}
