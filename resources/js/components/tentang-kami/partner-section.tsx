import AnimeReveal from '@/components/global/anime-reveal';

interface PartnerItem {
    id: string;
    name: string;
    logoSrc: string;
    logoSource: string;
}

interface PartnerSectionProps {
    title?: string;
    partners?: PartnerItem[];
}

export default function PartnerSection({
    title = 'Partner & Kolaborator Kami',
    partners = [
        { id: '1', name: 'PLN Batam', logoSrc: '', logoSource: 'none' },
        { id: '2', name: 'Pertamina', logoSrc: '', logoSource: 'none' },
        { id: '3', name: 'Siemens', logoSrc: '', logoSource: 'none' },
        { id: '4', name: 'Schneider', logoSrc: '', logoSource: 'none' },
        { id: '5', name: 'GE Energy', logoSrc: '', logoSource: 'none' },
    ],
}: PartnerSectionProps) {
    return (
        <section className="bg-[#f9fbfc] px-5 py-10 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-12 dark:bg-[#051515]">
            <div className="mx-auto w-full text-center">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <h3 className="mb-6 text-xs font-bold tracking-[0.2em] text-[#94a3b8] uppercase transition-colors duration-500 sm:text-xs md:text-sm lg:text-base dark:text-white/50">
                        {title}
                    </h3>
                </AnimeReveal>

                <AnimeReveal
                    delay={150}
                    distance={30}
                    direction="up"
                    className="relative flex w-full items-center overflow-hidden py-6"
                >
                    {/* Gradient masks for smooth edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f9fbfc] to-transparent dark:from-[#051515]"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f9fbfc] to-transparent dark:from-[#051515]"></div>

                    {/* Scrolling Track */}
                    <div className="flex w-max animate-infinite-scroll items-center gap-4 pr-4 hover:[animation-play-state:paused] md:gap-6 md:pr-6">
                        {[...partners, ...partners].map((partner, index) => (
                            <div
                                key={`${partner.id || index}-${index}`}
                                className="flex h-16 w-36 shrink-0 cursor-default items-center justify-center rounded-xl border border-gray-100 bg-white px-4 shadow-sm transition-all duration-300 hover:border-[#00A4B9]/30 hover:shadow-md sm:h-18 sm:w-40 md:h-20 md:w-44 dark:border-white/10 dark:bg-white/60"
                            >
                                {partner.logoSrc &&
                                partner.logoSource !== 'none' ? (
                                    <img
                                        src={partner.logoSrc}
                                        alt={partner.name}
                                        className="h-8 w-auto max-w-full object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-10 md:h-12"
                                        onError={(e) => {
                                            (
                                                e.target as HTMLImageElement
                                            ).style.display = 'none';
                                            const parent = (
                                                e.target as HTMLImageElement
                                            ).parentElement;
                                            if (parent) {
                                                const span =
                                                    document.createElement(
                                                        'span',
                                                    );
                                                span.className =
                                                    'text-xs font-bold text-[#7b8c9d] md:text-sm whitespace-nowrap';
                                                span.textContent = partner.name;
                                                parent.appendChild(span);
                                            }
                                        }}
                                    />
                                ) : (
                                    <span className="text-xs font-bold whitespace-nowrap text-[#7b8c9d] md:text-sm">
                                        {partner.name || 'Partner'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </AnimeReveal>
            </div>
        </section>
    );
}
