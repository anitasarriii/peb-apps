import AnimeReveal from '@/components/global/anime-reveal';
import SmartVideo from '@/components/global/smart-media';
import { detectMediaType, resolveImageUrl } from '@/lib/media-url';

interface StatCard {
    label: string;
    value: string;
    description: string;
}

interface AboutSectionProps {
    title?: string;
    subtitle?: string;
    mediaType?: 'video' | 'image';
    mediaUrl?: string;
    borderSrc?: string;
    efisiensi?: StatCard;
    inovatif?: StatCard;
    sloganText?: string;
}

const defaultEfisiensi: StatCard = {
    label: 'EFISIENSI',
    value: '95%',
    description:
        'Menjamin tingkat keandalan pasokan energi yang tinggi serta efisiensi operasional yang maksimal untuk mendukung kebutuhan mitra industri dan kelistrikan batam.',
};

const defaultInovatif: StatCard = {
    label: 'INOVATIF',
    value: '85%',
    description:
        'Terus berinovasi dalam pengembangan produk dan layanan energi berkelanjutan demi menciptakan nilai tambah bagi kemajuan negeri.',
};

const defaultSlogan =
    'ENERGI BAGI NEGERI (ENERGY FOR THE COUNTRY) merupakan slogan dalam menyampaikan gagasan positif tentang Visi dan Misi PT Pelayanan Energi Batam. Tonton video ini untuk menjelajahi nilai berkelanjutan dari Produk & Inovasi PEB.';

export default function AboutSection({
    title = 'PT Pelayanan Energi Batam',
    subtitle = 'Energi Bagi Negeri',
    mediaType = 'image',
    mediaUrl = '/assets/beranda/about/about.png',
    borderSrc = '/assets/beranda/about/border-shape.png',
    efisiensi = defaultEfisiensi,
    inovatif = defaultInovatif,
    sloganText = defaultSlogan,
}: AboutSectionProps) {
    const bgSection =
        'bg-[#EDF5F6] transition-colors duration-500 dark:bg-[#0a1a1a]';
    const bgCard1 = 'bg-[#B8F0F0] dark:bg-[#123333]';
    const bgCard2 = 'bg-[#F5E879] dark:bg-[#333012]';

    return (
        <section
            id="tentang-peb"
            className={`${bgSection} px-5 py-12 sm:px-8 lg:flex lg:min-h-screen lg:items-center lg:px-12 lg:py-14`}
        >
            <div className="mx-auto w-full max-w-[1440px]">
                <AnimeReveal
                    delay={100}
                    distance={30}
                    direction="up"
                    className="mb-8 lg:mb-10"
                >
                    <h2 className="text-xl leading-tight font-bold text-[#1a2e2e] transition-colors duration-500 sm:text-2xl lg:text-3xl dark:text-white">
                        <span className="block" translate="no">
                            {title}
                        </span>
                        <span className="mt-1 block text-base font-semibold sm:text-lg lg:text-xl">
                            {subtitle}
                        </span>
                    </h2>
                    <div className="mt-3 h-0.5 w-24 rounded-full bg-[#2dd4bf]" />
                </AnimeReveal>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
                    <AnimeReveal
                        delay={200}
                        distance={40}
                        direction="right"
                        className="group relative lg:col-span-4 lg:row-span-2"
                    >
                        <div className="absolute -top-3 -left-3 z-10 h-20 w-20 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1">
                            <img
                                src={borderSrc}
                                alt=""
                                className="h-full w-full dark:opacity-50 dark:invert"
                            />
                        </div>
                        <div className="relative h-full min-h-72 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                            {detectMediaType(mediaUrl, null, mediaType) === 'video' ? (
                                <SmartVideo
                                    src={mediaUrl}
                                    variant="player"
                                    className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls
                                />
                            ) : (
                                <img
                                    src={resolveImageUrl(mediaUrl)}
                                    alt={title}
                                    className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            'none';
                                    }}
                                />
                            )}
                        </div>
                    </AnimeReveal>

                    <AnimeReveal
                        delay={300}
                        distance={40}
                        direction="left"
                        className={`group flex flex-col justify-center rounded-2xl ${bgCard1} p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl lg:col-span-8`}
                    >
                        <span className="text-xs font-bold tracking-widest text-[#1a2e2e] uppercase transition-colors duration-500 dark:text-white/80">
                            {efisiensi.label}
                        </span>
                        <hr className="my-3 border-[#1a2e2e]/20 transition-colors duration-500 dark:border-white/10" />
                        <p className="mb-2 text-3xl leading-none font-bold text-[#1a2e2e] transition-all duration-500 group-hover:scale-[1.02] lg:text-4xl dark:text-white">
                            {efisiensi.value}
                        </p>
                        <p className="text-sm leading-relaxed text-[#1a2e2e]/80 transition-colors duration-500 dark:text-white/70">
                            {efisiensi.description}
                        </p>
                    </AnimeReveal>

                    <AnimeReveal
                        delay={400}
                        distance={40}
                        direction="up"
                        className={`group flex flex-col justify-center rounded-2xl ${bgCard2} p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl lg:col-span-4`}
                    >
                        <span className="text-xs font-bold tracking-widest text-[#1a2e2e] uppercase transition-colors duration-500 dark:text-white/80">
                            {inovatif.label}
                        </span>
                        <hr className="my-3 border-[#1a2e2e]/20 transition-colors duration-500 dark:border-white/10" />
                        <p className="mb-2 text-3xl leading-none font-bold text-[#1a2e2e] transition-all duration-500 group-hover:scale-[1.02] lg:text-4xl dark:text-white">
                            {inovatif.value}
                        </p>
                        <p className="text-sm leading-relaxed text-[#1a2e2e]/80 transition-colors duration-500 dark:text-white/70">
                            {inovatif.description}
                        </p>
                    </AnimeReveal>

                    <AnimeReveal
                        delay={500}
                        distance={40}
                        direction="left"
                        className="group flex flex-col justify-center rounded-2xl p-6 transition-all duration-500 lg:col-span-4"
                    >
                        <div className="mb-4 flex items-center gap-1 transition-transform duration-500 group-hover:scale-[1.02]">
                            <div className="h-10 w-1.5 rounded-full bg-[#053028] transition-colors duration-500 dark:bg-[#2dd4bf]" />
                            <div className="h-6 w-1.5 rounded-full bg-[#05302899]/60 transition-colors duration-500 dark:bg-[#2dd4bf]/40" />
                            <div className="h-12 w-1.5 rounded-full bg-[#053028CC]/80 transition-colors duration-500 dark:bg-[#2dd4bf]/60" />
                        </div>
                        <p className="text-sm leading-relaxed text-[#1a2e2e]/70 transition-colors duration-500 dark:text-white/60">
                            {sloganText}
                        </p>
                    </AnimeReveal>
                </div>
            </div>
        </section>
    );
}
