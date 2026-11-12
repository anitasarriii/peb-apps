import React from 'react';
import { X, MapPin, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveImageUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import { GalleryItem } from './data';

interface GalleryLightboxProps {
    item: GalleryItem | null;
    isVisible: boolean;
    isChangingImage: boolean;
    onClose: () => void;
    onPrev: (e: React.MouseEvent) => void;
    onNext: (e: React.MouseEvent) => void;
}

export default function GalleryLightbox({
    item,
    isVisible,
    isChangingImage,
    onClose,
    onPrev,
    onNext,
}: GalleryLightboxProps) {
    if (!item) return null;

    return (
        <div
            onClick={onClose}
            className={cn(
                'fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-3 sm:p-4 backdrop-blur-md transition-all duration-500 ease-in-out',
                isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
        >
            {/* Unified Premium Card */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    'relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl transition-all duration-500 md:flex-row dark:border-white/10 dark:bg-[#122b2b]',
                    isVisible
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'translate-y-8 scale-95 opacity-0',
                )}
            >
                {/* Close Button Inside Card (Top Right) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                    <X size={16} />
                </button>

                {/* Image Container with Nav Arrows Overlaid */}
                <div className="group/image relative h-[42vh] w-full shrink-0 bg-[#051515] sm:h-[48vh] md:h-full md:w-[55%] lg:w-[65%]">
                    <img
                        src={resolveImageUrl(item.imageSrc)}
                        alt={item.title}
                        className={cn(
                            'h-full w-full object-contain transition-all duration-500 ease-in-out',
                            isChangingImage
                                ? 'scale-98 opacity-0 blur-xs'
                                : 'scale-100 opacity-100 blur-none',
                        )}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://placehold.co/800x600/0d2e2e/ffffff?text=${item.title}`;
                        }}
                    />
                    {/* Teal overlay to match brand tone */}
                    <div className="absolute inset-0 bg-[#00A4B9]/5 mix-blend-multiply" />

                    {/* Left Nav Arrow */}
                    <button
                        onClick={onPrev}
                        className="absolute top-1/2 left-3 z-20 flex size-9 sm:size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white shadow-md backdrop-blur-xs transition-all select-none hover:scale-105 hover:bg-black/75 active:scale-95 md:opacity-0 md:group-hover/image:opacity-100"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Right Nav Arrow */}
                    <button
                        onClick={onNext}
                        className="absolute top-1/2 right-3 z-20 flex size-9 sm:size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white shadow-md backdrop-blur-xs transition-all select-none hover:scale-105 hover:bg-black/75 active:scale-95 md:opacity-0 md:group-hover/image:opacity-100"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Caption & Metadata Panel — no scroll, compact */}
                <div
                    className={cn(
                        'flex min-h-0 flex-1 flex-col justify-center gap-3 bg-white p-4 sm:gap-4 sm:p-6 md:w-[45%] md:p-8 lg:w-[35%] lg:p-10 dark:bg-[#122b2b] transition-all duration-500 ease-in-out',
                        isChangingImage
                            ? 'translate-y-4 opacity-0 md:translate-y-0 md:translate-x-4'
                            : 'translate-y-0 translate-x-0 opacity-100',
                    )}
                >
                    {/* Category badge */}
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#b2e3e5] bg-[#eaf8f9] px-3 py-1 text-[10px] font-bold tracking-wider text-[#00A4B9] uppercase dark:border-[#00A4B9]/20 dark:bg-[#00A4B9]/15 dark:text-[#2dd4bf]">
                        <Tag size={10} />
                        {item.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg leading-snug font-bold text-[#0d2e2e] sm:text-xl lg:text-2xl dark:text-white">
                        {item.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-white/50">
                        <MapPin size={14} className="text-[#00A4B9] dark:text-[#2dd4bf] shrink-0" />
                        {item.location}
                    </div>

                    <div className="h-px w-full bg-gray-100 dark:bg-white/10" />

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-gray-500 dark:text-white/60 sm:text-sm line-clamp-4 md:line-clamp-none">
                        Menampilkan dokumentasi visual dari aktivitas dan fasilitas terkait{' '}
                        <span className="font-semibold text-gray-700 dark:text-white/80">{item.title}</span>{' '}
                        di lokasi {item.location}. Kategori ini berfokus pada{' '}
                        {item.category.toLowerCase()} yang menjadi bagian penting dari operasional PT Pelayanan Energi Batam.
                    </p>
                </div>
            </div>
        </div>
    );
}
