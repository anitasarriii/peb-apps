import SmartVideo from '@/components/global/smart-media';
import { detectMediaType, resolveImageUrl } from '@/lib/media-url';

interface StatCardData {
    label: string;
    value: string;
    description: string;
}

interface PreviewPanelProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    efisiensi: StatCardData;
    inovatif: StatCardData;
    sloganText: string;
    file?: File | null;
}

export default function PreviewPanel({
    title,
    subtitle,
    imageUrl,
    efisiensi,
    inovatif,
    sloganText,
    file = null,
}: PreviewPanelProps) {
    const actualType = detectMediaType(imageUrl, file);

    return (
        <div className="custom-scrollbar relative h-full flex-1 overflow-y-auto rounded-[2rem] border border-admin-border bg-[#edf5f6] p-5 select-none dark:bg-[#0a1a1a]">
            {/* Layout Konten Utama Mockup */}
            <div className="space-y-4">
                {/* Title & Subtitle Mockup */}
                <div className="space-y-1.5">
                    <h2 className="text-xs leading-tight font-bold text-[#1a2e2e] lg:text-sm dark:text-white">
                        {title}
                        <br />
                        <span className="text-admin-accent">{subtitle}</span>
                    </h2>
                    <div className="h-0.5 w-10 rounded-full bg-emerald-400" />
                </div>

                {/* Grid Row 1 */}
                <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-12">
                    {/* Left: Image Container Mockup */}
                    <div className="relative md:col-span-5">
                        <div className="absolute -top-1.5 -left-1.5 z-10 size-6 opacity-60">
                            <div className="size-3 border-t border-l border-admin-accent" />
                        </div>
                        <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-admin-border bg-admin-bg">
                            {actualType === 'video' ? (
                                <SmartVideo
                                    src={imageUrl}
                                    variant="player"
                                    className="h-full w-full object-cover grayscale"
                                    muted
                                    playsInline
                                    autoPlay
                                    loop
                                />
                            ) : (
                                <img
                                    src={resolveImageUrl(imageUrl)}
                                    alt="About Preview"
                                    className="h-full w-full object-cover grayscale"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop';
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right: Efisiensi Card Mockup */}
                    <div className="flex flex-col justify-start rounded-xl border border-emerald-500/10 bg-[#B8F0F0] p-3.5 md:col-span-7 dark:bg-[#123333]">
                        <span className="text-[7px] font-bold tracking-widest text-[#1a2e2e] uppercase dark:text-white/80">
                            {efisiensi.label || 'EFISIENSI'}
                        </span>
                        <hr className="my-1.5 border-[#1a2e2e]/10 dark:border-white/10" />
                        <span className="text-2xl leading-none font-black text-[#1a2e2e] dark:text-white">
                            {efisiensi.value || '95%'}
                        </span>
                        <p className="mt-1.5 text-[8px] leading-relaxed text-[#1a2e2e]/85 dark:text-white/70">
                            {efisiensi.description}
                        </p>
                    </div>
                </div>

                {/* Grid Row 2 */}
                <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-12">
                    {/* Left: Inovatif Card Mockup */}
                    <div className="flex flex-col justify-start rounded-xl border border-yellow-500/10 bg-[#F5E879] p-3.5 md:col-span-6 dark:bg-[#333012]">
                        <span className="text-[7px] font-bold tracking-widest text-[#1a2e2e] uppercase dark:text-white/80">
                            {inovatif.label || 'INOVATIF'}
                        </span>
                        <hr className="my-1.5 border-[#1a2e2e]/10 dark:border-white/10" />
                        <span className="text-2xl leading-none font-black text-[#1a2e2e] dark:text-white">
                            {inovatif.value || '85%'}
                        </span>
                        <p className="mt-1.5 text-[8px] leading-relaxed text-[#1a2e2e]/85 dark:text-white/70">
                            {inovatif.description}
                        </p>
                    </div>

                    {/* Right: Slogan & Accent Bars Mockup */}
                    <div className="flex flex-col justify-center p-2 md:col-span-6">
                        <div className="mb-2 flex items-center gap-1">
                            <div className="h-6 w-0.5 rounded-sm bg-[#053028] dark:bg-[#2dd4bf]" />
                            <div className="h-4 w-0.5 rounded-sm bg-[#053028]/60 dark:bg-[#2dd4bf]/40" />
                            <div className="h-8 w-0.5 rounded-sm bg-[#053028] dark:bg-[#2dd4bf]" />
                        </div>
                        <p className="text-[8px] leading-relaxed text-[#1a2e2e]/70 dark:text-white/60">
                            {sloganText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
