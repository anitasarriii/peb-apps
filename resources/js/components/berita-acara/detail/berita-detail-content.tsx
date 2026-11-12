import { useState } from 'react';
import { X, ZoomIn, Play } from 'lucide-react';
import SmartVideo from '@/components/global/smart-media';
import { resolveImageUrl } from '@/lib/media-url';

export interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    url: string;
    sourceType: 'url' | 'upload';
    fileName?: string;
}

export interface Berita {
    title: string;
    date: string;
    subtitle: string;
    imageSrc: string;
    contentImage: string;
    content: string;
    gallery?: GalleryItem[];
}

interface BeritaDetailContentProps {
    berita: Berita;
}

export default function BeritaDetailContent({
    berita,
}: BeritaDetailContentProps) {
    const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

    return (
        <section className="bg-[#EDF5F6] px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-14 dark:bg-[#0a1a1a]">
            <div className="xl:16 mx-auto w-full px-4 lg:px-8">
                {/* Article Header */}
                <div className="mb-10 space-y-5 text-left">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 dark:text-white/50">
                            Diterbitkan {berita.date}
                        </span>
                    </div>

                    <h1 className="text-2xl leading-tight font-black text-[#0d2e2e] md:text-3xl md:leading-[1.2] dark:text-white">
                        {berita.title}
                    </h1>
                </div>

                {/* Main Article Image */}
                <div className="mb-12 overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl dark:border-white/5 dark:bg-[#122b2b]">
                    <figure className="relative aspect-video max-h-[460px] w-full overflow-hidden">
                        <img
                            src={resolveImageUrl(berita.imageSrc)}
                            alt={berita.title}
                            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-102"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'https://placehold.co/800x450/0d2e2e/ffffff?text=Berita';
                            }}
                        />
                    </figure>
                </div>

                {/* Article Content */}
                <div
                    className="prose prose-lg max-w-none text-sm text-gray-600 dark:text-white/70 dark:prose-invert prose-headings:text-[#0d2e2e] dark:prose-headings:text-white prose-p:leading-relaxed prose-a:text-[#00A4B9] hover:prose-a:text-[#00c5dd] prose-strong:text-[#0d2e2e] dark:prose-strong:text-white prose-li:my-1 [&_ol]:list-decimal [&_ul]:list-disc"
                    dangerouslySetInnerHTML={{ __html: berita.content || berita.subtitle }}
                />

                {/* Gallery Section */}
                {berita.gallery && berita.gallery.length > 0 && (
                    <div className="mt-16 space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-white/10">
                            <h3 className="text-xl font-black text-[#0d2e2e] dark:text-white">
                                Galeri Media
                            </h3>
                            <span className="rounded-full bg-[#00A4B9]/10 px-2.5 py-0.5 text-xs font-bold text-[#00A4B9]">
                                {berita.gallery.length} Media
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {berita.gallery.map((gItem) => (
                                <div
                                    key={gItem.id}
                                    onClick={() => setLightboxItem(gItem)}
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-white p-1.5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-[#122b2b]"
                                >
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                                        {gItem.type === 'video' ? (
                                            <div className="relative h-full w-full">
                                                {/* Video Thumbnail/Preview */}
                                                <SmartVideo
                                                    src={gItem.url}
                                                    variant="thumbnail"
                                                    className="opacity-85"
                                                />
                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-all duration-300 group-hover:bg-black/10">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#0d2e2e] shadow-md transition-transform duration-300 group-hover:scale-110 dark:bg-[#0d2e2e]/90 dark:text-white">
                                                        <Play
                                                            size={16}
                                                            className="ml-0.5 fill-current"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={resolveImageUrl(gItem.url)}
                                                    alt="Galeri Berita"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            'https://placehold.co/600x400/0d2e2e/ffffff?text=Gambar';
                                                    }}
                                                />
                                                {/* Zoom Hover Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#0d2e2e] shadow-md dark:bg-[#0d2e2e]/90 dark:text-white">
                                                        <ZoomIn size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {lightboxItem && (
                <div
                    className="animate-fadeIn fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all duration-300"
                    onClick={() => setLightboxItem(null)}
                >
                    <button
                        className="absolute top-6 right-6 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
                        onClick={() => setLightboxItem(null)}
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="animate-zoomIn relative max-h-[90vh] w-full max-w-[min(860px,92vw)] overflow-hidden rounded-2xl bg-[#051515] p-2 shadow-2xl transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {lightboxItem.type === 'video' ? (
                            <SmartVideo
                                src={lightboxItem.url}
                                variant="player"
                                controls
                                autoPlay
                                showFallbackLink
                                className="max-h-[82vh]"
                            />
                        ) : (
                            <img
                                src={resolveImageUrl(lightboxItem.url)}
                                alt="Detail Galeri"
                                className="mx-auto max-h-[80vh] max-w-[85vw] rounded-xl object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://placehold.co/800x600/0d2e2e/ffffff?text=Media+Error';
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
