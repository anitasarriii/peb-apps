import { Maximize2, MapPin, Tag, Camera } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { resolveImageUrl } from '@/lib/media-url';
import { GalleryItem } from './data';

interface GalleryGridProps {
    items: GalleryItem[];
    onItemClick: (id: number) => void;
}

export default function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Camera
                    size={48}
                    className="mb-4 text-gray-300 dark:text-white/20"
                />
                <h4 className="text-lg font-bold text-gray-400 dark:text-white/40">
                    Belum ada dokumentasi untuk kategori ini.
                </h4>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
                <AnimeReveal
                    key={item.id}
                    delay={200 + index * 50}
                    distance={25}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-transparent bg-white p-1.5 shadow-md shadow-gray-200/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none"
                >
                    <div
                        onClick={() => onItemClick(item.id)}
                        className="relative h-48 overflow-hidden rounded-xl lg:h-52"
                    >
                        <img
                            src={resolveImageUrl(item.imageSrc)}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    `https://placehold.co/600x400/0d2e2e/ffffff?text=${item.title}`;
                            }}
                        />

                        {/* Colored Overlay Tint on Hover */}
                        <div className="absolute inset-0 flex flex-col justify-between bg-[#0d2e2e]/80 p-5 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-[#00A4B9]/80" />

                        {/* Hover Content */}
                        <div className="pointer-events-none absolute inset-0 z-10 flex translate-y-4 flex-col justify-between p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            {/* Top Icons */}
                            <div className="flex items-start justify-between">
                                <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/20 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
                                    <Tag size={10} />
                                    {item.category}
                                </span>
                                <div className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/20 backdrop-blur-md">
                                    <Maximize2
                                        size={16}
                                        className="text-white"
                                    />
                                </div>
                            </div>

                            {/* Bottom Details */}
                            <div className="space-y-2 text-white">
                                <h4 className="line-clamp-2 text-base leading-tight font-bold">
                                    {item.title}
                                </h4>
                                <p className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                                    <MapPin
                                        size={12}
                                        className="text-white/80"
                                    />
                                    {item.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </AnimeReveal>
            ))}
        </div>
    );
}
