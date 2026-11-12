import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimeReveal from '@/components/global/anime-reveal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryFilterProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function GalleryFilter({
    categories,
    activeCategory,
    onCategoryChange,
}: GalleryFilterProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(checkScroll, 300);
        }
    };

    return (
        <AnimeReveal delay={200} distance={20} className="relative flex w-full md:w-auto md:max-w-[60%] lg:max-w-[70%] ml-auto items-center justify-end">
            {/* Left Arrow */}
            <div
                className={cn(
                    'absolute left-0 z-10 flex h-full w-12 items-center justify-start bg-gradient-to-r from-[#EDF5F6] to-transparent transition-opacity duration-300 dark:from-[#0a1a1a]',
                    showLeftArrow ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                )}
            >
                <button
                    onClick={() => scroll('left')}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-100 dark:bg-[#122b2b] dark:text-white dark:hover:bg-[#1a3a3a]"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex w-full gap-2.5 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {categories.map((cat, index) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={cn(
                            'shrink-0 cursor-pointer select-none rounded-full px-5 py-2.5 text-xs font-bold shadow-xs transition-all duration-300',
                            activeCategory === cat
                                ? 'bg-[#0d2e2e] text-white shadow-md dark:bg-[#00A4B9]'
                                : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-[#122b2b] dark:text-white/60 dark:hover:bg-white/10'
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Right Arrow */}
            <div
                className={cn(
                    'absolute right-0 z-10 flex h-full w-12 items-center justify-end bg-gradient-to-l from-[#EDF5F6] to-transparent transition-opacity duration-300 dark:from-[#0a1a1a]',
                    showRightArrow ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                )}
            >
                <button
                    onClick={() => scroll('right')}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-100 dark:bg-[#122b2b] dark:text-white dark:hover:bg-[#1a3a3a]"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </AnimeReveal>
    );
}
