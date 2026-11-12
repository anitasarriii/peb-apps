import { useState, useEffect } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import SmartVideo from '@/components/global/smart-media';
import { detectMediaType, parseVideoUrl, resolveImageUrl } from '@/lib/media-url';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType?: 'url' | 'upload';
    url: string;
    fileName?: string;
    previewUrl?: string;
    positionX?: number;
    positionY?: number;
    scale?: number;
}

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    imageSrc?: string;
    badgeLabel?: string;
    slides?: CarouselItem[];
}

export default function HeroSection({
    title = 'Tentang Kami',
    subtitle = 'Informasi transparan mengenai profil PT Pelayanan Energi Batam.',
    imageSrc = '/assets/tentang-kami/hero/hero.png',
    slides: customSlides,
}: HeroSectionProps) {
    const bgColor =
        'bg-[#EDF5F6] transition-colors duration-500 dark:bg-[#0a1a1a]';
    const shadowColor = 'shadow-[#EDF5F6] dark:shadow-[#0a1a1a]';

    const defaultSlides: CarouselItem[] = [
        {
            id: 'slide-1',
            type: 'image',
            url: imageSrc || '/assets/tentang-kami/hero/hero.png',
        },
    ];

    const activeSlides =
        customSlides && customSlides.length > 0 ? customSlides : defaultSlides;
    const [currentSlide, setCurrentSlide] = useState(0);

    // Efek autoplay carousel (berpindah setiap 6 detik)
    useEffect(() => {
        if (activeSlides.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [activeSlides.length]);

    return (
        <section
            className={`relative h-[70vh] min-h-[500px] w-full ${bgColor} p-4 lg:p-6`}
        >
            {/* Main Card Container */}
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-[#0d2e2e]">
                {/* Background Media Carousel with Crossfade */}
                <div className="absolute inset-0 z-0">
                    {activeSlides.map((slide, index) => {
                        const isActive = index === currentSlide;

                        return (
                            <div
                                key={slide.id || index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    isActive
                                        ? 'z-10 opacity-50'
                                        : 'pointer-events-none z-0 opacity-0'
                                }`}
                            >
                                {detectMediaType(slide.url, null, slide.type) === 'video' ? (
                                    parseVideoUrl(slide.url).isDirect ? (
                                        <video
                                            key={`${slide.id || index}-${isActive ? 'active' : 'inactive'}`}
                                            autoPlay={isActive}
                                            loop
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
                    {/* Dark linear gradient overlay to ensure text readability */}
                    <div className="pointer-events-none absolute inset-0 z-15 bg-linear-to-t from-[#0d2e2e] via-[#0d2e2e]/40 to-transparent" />
                </div>

                {/* Dots Navigation (Tengah Bawah) */}
                {activeSlides.length > 1 && (
                    <div className="absolute bottom-10 left-1/2 z-25 flex -translate-x-1/2 items-center gap-2">
                        {activeSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${
                                    currentSlide === idx
                                        ? 'w-8 bg-white'
                                        : 'w-2 bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Pergi ke slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Content Area */}
                <div className="relative z-20 flex h-full w-full items-end justify-between px-5 pb-9 sm:px-8 sm:pb-10 lg:px-12 lg:pb-14">
                    {/* Left — Title & Subtitle */}
                    <div className="max-w-4xl pb-16 lg:pb-0">
                        <AnimeReveal delay={100} distance={30}>
                            <h1 className="mb-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-bold text-white lg:leading-[1.1]">
                                {title}
                            </h1>
                        </AnimeReveal>
                        <AnimeReveal delay={200} distance={30}>
                            <div className="mb-5 h-1 w-24 rounded-full bg-[#f5e879]" />
                            <p className="max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                                {subtitle}
                            </p>
                        </AnimeReveal>
                    </div>
                </div>
            </div>

            {/* --- Inverted Border: Logo Area (Kiri Atas) --- */}
            {/* Placed outside the main overflow-hidden container to avoid sub-pixel clipping line anomalies.
                We keep the top-left corner SQUARE so it covers Sibling 1's rounded corner without creating anti-aliasing gaps. */}
            <div
                className={`absolute top-4 left-4 z-20 flex h-20 w-36 items-center rounded-br-[2.5rem] px-4 sm:h-24 sm:w-40 sm:px-6 lg:top-6 lg:left-6 lg:w-52 lg:px-8 ${bgColor}`}
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
            {/* Placed outside the main overflow-hidden container to avoid sub-pixel clipping line anomalies.
                We keep the top-right corner SQUARE so it covers Sibling 1's rounded corner without creating anti-aliasing gaps. */}
            <div
                className={`absolute top-4 right-4 z-20 flex h-20 w-44 items-center justify-end rounded-bl-[2.5rem] px-4 sm:h-24 sm:w-48 sm:px-6 lg:top-6 lg:right-6 lg:w-52 lg:px-8 ${bgColor}`}
            >
                {/* Corner Smoothing (The Magic Curves) */}
                <div
                    className={`absolute right-0 -bottom-10 h-10 w-10 rounded-tr-[2.5rem] bg-transparent shadow-[20px_-20px_0_20px] transition-shadow duration-500 ${shadowColor}`}
                ></div>
                <div
                    className={`absolute top-0 -left-10 h-10 w-10 rounded-tr-[2.5rem] bg-transparent shadow-[20px_-20px_0_20px] transition-shadow duration-500 ${shadowColor}`}
                ></div>
            </div>
        </section>
    );
}
