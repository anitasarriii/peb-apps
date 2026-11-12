import { ExternalLink, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseVideoUrl } from '@/lib/media-url';

interface SmartVideoProps {
    src: string;
    variant?: 'player' | 'thumbnail' | 'hero';
    className?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    playsInline?: boolean;
    onEnded?: () => void;
    onError?: () => void;
    preload?: 'auto' | 'metadata' | 'none';
    showFallbackLink?: boolean;
}

const PLATFORM_GRADIENT: Record<string, string> = {
    instagram: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    youtube: 'from-[#ff0000] to-[#990000]',
    tiktok: 'from-[#010101] via-[#25f4ee]/40 to-[#fe2c55]/50',
    vimeo: 'from-[#1ab7ea] to-[#0e6b8a]',
    gdrive: 'from-[#0f9d58] via-[#4285f4] to-[#f4b400]',
    facebook: 'from-[#1877f2] to-[#0d47a1]',
};

export default function SmartVideo({
    src,
    variant = 'player',
    className,
    autoPlay = false,
    loop = false,
    muted = false,
    controls = true,
    playsInline = true,
    onEnded,
    onError,
    preload = 'metadata',
    showFallbackLink = false,
}: SmartVideoProps) {
    const parsed = parseVideoUrl(src);

    // 1. Direct MP4 / WebM / local /storage/ / blob URL
    if (parsed.isDirect) {
        return (
            <video
                src={parsed.embedUrl}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                controls={controls && variant === 'player'}
                playsInline={playsInline}
                preload={preload}
                onEnded={onEnded}
                onError={onError}
                className={cn('h-full w-full object-cover', className)}
            />
        );
    }

    // 2. Thumbnail Mode (for Gallery Cards before clicking into Lightbox)
    if (variant === 'thumbnail') {
        if (parsed.thumbnailUrl) {
            return (
                <div className="relative h-full w-full">
                    <img
                        src={parsed.thumbnailUrl}
                        alt={parsed.label}
                        className={cn('h-full w-full object-cover', className)}
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                        {parsed.label}
                    </span>
                </div>
            );
        }

        const gradient =
            PLATFORM_GRADIENT[parsed.platform] || 'from-[#0d2e2e] to-[#005560]';

        return (
            <div
                className={cn(
                    'relative flex h-full w-full flex-col items-center justify-center bg-linear-to-br p-3 text-white',
                    gradient,
                    className,
                )}
            >
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                    <Film size={20} className="opacity-80" />
                    <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide backdrop-blur-xs">
                        {parsed.label}
                    </span>
                </div>
            </div>
        );
    }

    // 3. Hero Background Mode (Fullscreen non-interactive embed)
    if (variant === 'hero') {
        return (
            <iframe
                src={parsed.heroEmbedUrl}
                title={parsed.label}
                className={cn(
                    'pointer-events-none h-full w-full border-0',
                    className,
                )}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                loading="lazy"
            />
        );
    }

    // 4. Interactive Player Mode (Lightbox, Admin Preview, About Section)
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black',
                parsed.isVertical
                    ? 'mx-auto aspect-[9/16] max-h-[78vh] w-full max-w-[400px]'
                    : 'aspect-video w-full',
                className,
            )}
        >
            <iframe
                src={parsed.embedUrl}
                title={parsed.label}
                className="h-full w-full flex-1 border-0 bg-white dark:bg-black"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                loading="lazy"
            />
            {showFallbackLink && parsed.originalUrl && (
                <a
                    href={parsed.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1.5 bg-[#0a1d1d] px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-[#00A4B9] hover:text-white"
                >
                    <span>Buka langsung di {parsed.label}</span>
                    <ExternalLink size={12} />
                </a>
            )}
        </div>
    );
}

