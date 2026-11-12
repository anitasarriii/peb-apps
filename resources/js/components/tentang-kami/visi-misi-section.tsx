interface StatItem {
    value: string;
    label: string;
    highlighted?: boolean;
}

interface MisiItem {
    number: number;
    title: string;
    description: string;
}

interface VisiMisiSectionProps {
    visiLabel?: string;
    visiText?: string;
    stats?: StatItem[];
    misiTitle?: string;
    misiSubtitle?: string;
    misiItems?: MisiItem[];
}

const defaultStats: StatItem[] = [
    { value: '95%', label: 'Efisiensi Operasional untuk mitra industri' },
    {
        value: '85%',
        label: 'Energi Bersih dan Andal tersalurkan setiap tahun',
        highlighted: true,
    },
];

const defaultMisiItems: MisiItem[] = [
    {
        number: 1,
        title: 'Keandalan Pasokan',
        description:
            'Menjamin ketersediaan energi listrik yang berkualitas tinggi dan berkelanjutan.',
    },
    {
        number: 2,
        title: 'Inovasi Teknologi',
        description: 'Mengembangkan infrastruktur cerdas dan ramah lingkungan.',
    },
    {
        number: 3,
        title: 'Nilai Tambah Stakeholder',
        description:
            'Memberikan kontribusi positif bagi ekonomi dan masyarakat.',
    },
];

import AnimeReveal from '@/components/global/anime-reveal';

export default function VisiMisiSection({
    visiLabel = 'VISI PERUSAHAAN',
    visiText = 'Menjadi Penyedia Solusi Energi Terdepan dan Terpercaya di Kawasan Regional.',
    stats = defaultStats,
    misiTitle = 'Misi Kami',
    misiSubtitle = 'Langkah strategis untuk mewujudkan masa depan energi yang berkelanjutan.',
    misiItems = defaultMisiItems,
}: VisiMisiSectionProps) {
    return (
        <section className="relative overflow-hidden bg-[#EDF5F6] px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-14 dark:bg-[#0a1a1a]">
            <div className="mx-auto w-full">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left — Visi */}
                    <div>
                        <AnimeReveal
                            delay={100}
                            distance={40}
                            direction="right"
                            className="relative overflow-hidden rounded-3xl bg-[#00A4B90D] p-6 backdrop-blur-xl transition-colors duration-500 lg:p-8 dark:bg-white/5"
                        >
                            {/* Decorative glow */}
                            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#00A4B9] opacity-15 blur-xl lg:-top-28 lg:-right-28 lg:h-72 lg:w-72" />
                            <p className="mb-3 text-xs font-bold tracking-widest text-[#2bb5b2] uppercase md:text-xs lg:text-sm">
                                {visiLabel}
                            </p>
                            <h2 className="mb-6 text-lg leading-snug font-bold text-[#1a2e2e] transition-colors duration-500 sm:text-xl md:text-2xl lg:text-2xl lg:leading-snug dark:text-white">
                                {visiText}
                            </h2>
                            <div className="mb-8"></div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, index) => (
                                    <AnimeReveal
                                        key={index}
                                        delay={300 + index * 100}
                                        distance={30}
                                        direction="up"
                                        className={`group cursor-default rounded-2xl px-4 py-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${stat.highlighted ? 'bg-[#f5e879] hover:bg-[#fff098] dark:bg-[#f5e879] dark:hover:bg-[#fff098]' : 'bg-[#EDF5F6] hover:bg-white dark:bg-white/10 dark:hover:bg-white/20'}`}
                                    >
                                        <p
                                            className={`mb-1.5 inline-block text-xl font-bold text-[#1a2e2e] transition-transform duration-500 group-hover:scale-105 md:text-2xl lg:text-3xl dark:text-[#0d2e2e] ${stat.highlighted ? 'text-[#1a2e2e] dark:text-[#0d2e2e]' : 'text-[#1a2e2e]/70 group-hover:text-[#1a2e2e] dark:text-white/80 dark:group-hover:text-white'}`}
                                        >
                                            {stat.value}
                                        </p>
                                        <p
                                            className={`text-xs leading-relaxed transition-colors duration-500 md:text-xs lg:text-sm ${stat.highlighted ? 'font-semibold text-[#1a2e2e] dark:text-[#0d2e2e]' : 'text-[#1a2e2e]/70 group-hover:text-[#1a2e2e] dark:text-white/80 dark:group-hover:text-white'}`}
                                        >
                                            {stat.label}
                                        </p>
                                    </AnimeReveal>
                                ))}
                            </div>
                        </AnimeReveal>
                    </div>

                    {/* Right — Misi */}
                    <div>
                        <AnimeReveal delay={200} distance={30} direction="left">
                            <h2 className="mb-2 text-xl font-bold text-[#1a2e2e] transition-colors duration-500 sm:text-2xl md:text-2xl lg:text-3xl dark:text-white">
                                {misiTitle}
                            </h2>
                            <p className="mb-6 max-w-md text-xs leading-relaxed text-[#1a2e2e]/70 transition-colors duration-500 sm:text-sm md:text-base lg:mb-8 dark:text-white/70">
                                {misiSubtitle}
                            </p>
                        </AnimeReveal>

                        <div className="space-y-0">
                            {misiItems.map((item, index) => (
                                <AnimeReveal
                                    key={item.number}
                                    delay={300 + index * 100}
                                    distance={20}
                                    direction="left"
                                    className="group flex cursor-default items-stretch gap-3 lg:gap-4"
                                >
                                    {/* Stepper column */}
                                    <div className="flex flex-col items-center">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2bb5b2] text-xs font-bold text-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#00A4B9] md:h-10 md:w-10 md:text-sm">
                                            {item.number}
                                        </span>
                                        {index < misiItems.length - 1 && (
                                            <div className="w-px flex-1 bg-[#2bb5b2]/30 transition-colors duration-500 group-hover:bg-[#00A4B9]/50" />
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="mb-3 flex-1 rounded-2xl bg-[#F8FAFC] p-3 transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-white group-hover:shadow-lg lg:mb-3 lg:px-4 lg:py-3 dark:bg-white/10 dark:group-hover:bg-white/20">
                                        <h3 className="mb-1 text-sm font-bold text-[#1a2e2e] transition-colors duration-500 group-hover:text-[#00A4B9] md:text-base dark:text-white dark:group-hover:text-[#2dd4bf]">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-[#1a2e2e]/70 transition-colors duration-500 group-hover:text-[#1a2e2e] md:text-xs lg:text-sm dark:text-white/70 dark:group-hover:text-white/90">
                                            {item.description}
                                        </p>
                                    </div>
                                </AnimeReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
