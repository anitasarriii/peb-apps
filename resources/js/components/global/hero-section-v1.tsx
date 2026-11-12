import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { sectionCtaClassName } from '@/components/global/section-cta-style';
import SmartVideo from '@/components/global/smart-media';
import { detectMediaType, parseVideoUrl, resolveImageUrl } from '@/lib/media-url';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType?: 'url' | 'upload';
    url: string;
    fileName?: string;
    previewUrl?: string;
    label?: string;
    positionX?: number;
    positionY?: number;
    scale?: number;
}

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    videoSrc?: string;
    imageSrc?: string;
    slides?: CarouselItem[];
    children?: ReactNode;
}

export default function HeroSection({
    title,
    subtitle,
    ctaLabel,
    ctaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    videoSrc,
    slides: customSlides,
}: HeroSectionProps) {
    const bgColor =
        'bg-[#EDF5F6] transition-colors duration-500 dark:bg-[#0a1a1a]';
    const shadowColor = 'shadow-[#EDF5F6] dark:shadow-[#0a1a1a]';

    // Kumpulan slide default jika customSlides tidak diberikan
    const defaultSlides: CarouselItem[] = [
        {
            id: 'slide-1',
            type: 'video',
            url: videoSrc || '/assets/beranda/hero/hero-video.mp4',
            label: 'PT Pelayanan Energi Batam',
        },
    ];

    const activeSlides =
        customSlides && customSlides.length > 0 ? customSlides : defaultSlides;
    const [rawCurrentSlide, setCurrentSlide] = useState(0);
    const currentSlide =
        rawCurrentSlide >= activeSlides.length
            ? Math.max(0, activeSlides.length - 1)
            : rawCurrentSlide;

    const currentMediaType = activeSlides[currentSlide]?.type;
    const currentMediaUrl = activeSlides[currentSlide]?.url;

    useEffect(() => {
        if (activeSlides.length <= 1 || currentMediaType === 'video') {
            return;
        }

        const timeout = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 6000);

        return () => clearTimeout(timeout);
    }, [currentSlide, currentMediaType, currentMediaUrl, activeSlides.length]);

    return (
        <section
            className={`relative box-border h-screen w-full max-w-full overflow-hidden ${bgColor} p-4 pb-0 lg:p-6 lg:pb-0`}
        >
            {/* Main Card Container */}
            <div
                id="beranda"
                className="relative h-full w-full max-w-full overflow-hidden rounded-t-[2.5rem]"
            >
                {/* Background Media Carousel with Crossfade */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-[#0d2e2e] lg:rounded-t-[3.5rem]">
                    {activeSlides.map((slide, index) => {
                        const isActive = index === currentSlide;

                        return (
                            <div
                                key={slide.id || index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    isActive
                                        ? 'z-10 opacity-60'
                                        : 'pointer-events-none z-0 opacity-0'
                                }`}
                            >
                                {detectMediaType(slide.url, null, slide.type) === 'video' ? (
                                    parseVideoUrl(slide.url).isDirect ? (
                                        <video
                                            key={`${slide.id || index}-${isActive ? 'active' : 'inactive'}`}
                                            autoPlay={isActive}
                                            loop={activeSlides.length === 1}
                                            onEnded={() => {
                                                if (isActive) {
                                                    setCurrentSlide((previous) =>
                                                        previous === index
                                                            ? (previous + 1) %
                                                              activeSlides.length
                                                            : previous,
                                                    );
                                                }
                                            }}
                                            muted
                                            playsInline
                                            preload={isActive ? 'auto' : 'none'}
                                            className="h-full w-full object-cover"
                                        >
                                            <source
                                                src={slide.url}
                                                type="video/mp4"
                                            />
                                        </video>
                                    ) : (
                                        <SmartVideo
                                            src={slide.url}
                                            variant="hero"
                                            className="h-full w-full"
                                        />
                                    )
                                ) : (
                                    <img
                                        src={resolveImageUrl(slide.url)}
                                        alt=""
                                        loading={isActive ? 'eager' : 'lazy'}
                                        fetchPriority={
                                            isActive ? 'high' : 'low'
                                        }
                                        className="h-full w-full object-cover transition-transform duration-500"
                                        style={{
                                            objectPosition: `${slide.positionX ?? 50}% ${slide.positionY ?? 50}%`,
                                            transform:
                                                slide.scale && slide.scale !== 1
                                                    ? `scale(${slide.scale})`
                                                    : undefined,
                                            transformOrigin: `${slide.positionX ?? 50}% ${slide.positionY ?? 50}%`,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                    {/* Dark linear gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 z-15 bg-linear-to-t from-[#0d2e2e] via-[#0d2e2e]/45 to-transparent" />
                </div>

                {/* Navigasi slide berlabel */}
                {activeSlides.length > 1 && (
                    <div className="absolute right-4 bottom-4 left-4 z-25 overflow-x-auto rounded-2xl border border-white/10 bg-[#071d2a]/75 p-3 shadow-xl backdrop-blur-md sm:right-8 sm:left-8 lg:right-12 lg:left-12">
                        <div
                            className="grid gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${activeSlides.length}, minmax(0, 1fr))`,
                            }}
                        >
                            {activeSlides.map((_, idx) => {
                                const isActive = currentSlide === idx;

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentSlide(idx)}
                                        className="group cursor-pointer text-left"
                                        aria-label={`Tampilkan ${activeSlides[idx]?.label?.trim() || `Slide ${idx + 1}`}`}
                                        aria-current={
                                            isActive ? 'true' : undefined
                                        }
                                    >
                                        <span
                                            className={`flex items-center gap-2 text-xs font-semibold transition-colors sm:text-sm ${
                                                isActive
                                                    ? 'text-white'
                                                    : 'text-white/65 group-hover:text-white'
                                            }`}
                                        >
                                            <span
                                                className={`size-2 shrink-0 rounded-full transition-all ${
                                                    isActive
                                                        ? 'bg-[#FFE872] ring-2 ring-[#FFE872]/25'
                                                        : 'bg-[#77b8ff]'
                                                }`}
                                            />
                                            {activeSlides[idx]?.label?.trim() ||
                                                `Slide ${idx + 1}`}
                                        </span>
                                        <span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/20">
                                            <span
                                                className={`block h-full rounded-full transition-all duration-500 ${
                                                    isActive
                                                        ? 'w-full bg-gradient-to-r from-[#00A4B9] to-[#FFE872]'
                                                        : 'w-0 bg-white/40 group-hover:w-full'
                                                }`}
                                            />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Content Area (Tetap Statis) */}
                <div className="relative z-20 flex h-full w-full min-w-0 items-end justify-between px-5 pb-28 sm:px-8 sm:pb-28 lg:px-12 lg:pb-28">
                    <div className="w-full max-w-2xl min-w-0 lg:max-w-4xl">
                        <AnimeReveal delay={100} distance={30} direction="up">
                            <h1 className="mb-4 max-w-full text-2xl leading-tight font-bold break-words text-white sm:mb-5 sm:text-3xl lg:text-4xl lg:leading-[1.1] lg:whitespace-nowrap">
                                {title}
                            </h1>
                        </AnimeReveal>
                        <AnimeReveal delay={200} distance={30} direction="up">
                            <p className="mb-6 max-w-lg text-sm leading-relaxed break-words text-white/80 sm:mb-8 sm:text-base lg:max-w-2xl">
                                {subtitle}
                            </p>
                        </AnimeReveal>
                        <AnimeReveal delay={300} distance={30} direction="up">
                            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                                <a
                                    href={ctaHref}
                                    className={sectionCtaClassName}
                                >
                                    {ctaLabel}
                                </a>
                                {secondaryCtaLabel && (
                                    <a
                                        href={secondaryCtaHref}
                                        className={sectionCtaClassName}
                                    >
                                        {secondaryCtaLabel}
                                    </a>
                                )}
                            </div>
                        </AnimeReveal>
                    </div>
                </div>

                {/* --- Inverted Border: Logo Area (Kiri Atas) --- */}
                <div
                    className={`absolute top-0 left-0 z-20 flex h-20 w-36 items-center rounded-br-[2.5rem] px-4 sm:h-24 sm:w-40 sm:px-6 lg:w-52 lg:px-8 ${bgColor}`}
                >
                    {/* Corner Smoothing (The Magic Curves) */}
                    <div
                        className={`absolute -bottom-10 left-0 h-10 w-10 rounded-tl-[2.5rem] bg-transparent shadow-[-20px_-20px_0_20px] transition-shadow duration-500 ${shadowColor}`}
                    ></div>
                    <div
                        className={`absolute top-0 -right-10 h-10 w-10 rounded-tl-[2.5rem] bg-transparent shadow-[-20px_-20px_0_20px] transition-shadow duration-500 ${shadowColor}`}
                    ></div>
                </div>

                {/* --- Inverted Border: Logo Area (Kanan Atas) --- */}
                <div
                    className={`absolute top-0 right-0 z-20 flex h-20 w-44 items-center justify-end rounded-bl-[2.5rem] px-4 sm:h-24 sm:w-48 sm:px-6 lg:w-52 lg:px-8 ${bgColor}`}
                >
                    {/* Corner Smoothing (The Magic Curves) */}
                    <div
                        className={`absolute right-0 -bottom-10 h-10 w-10 rounded-tr-[2.5rem] bg-transparent shadow-[20px_-20px_0_20px] transition-shadow duration-500 ${shadowColor}`}
                    ></div>
                    <div
                        className={`absolute top-0 -left-10 h-10 w-10 rounded-tr-[2.5rem] bg-transparent shadow-[20px_-20px_0_20px] transition-shadow duration-500 ${shadowColor}`}
                    ></div>
                </div>
            </div>
        </section>
    );
}
