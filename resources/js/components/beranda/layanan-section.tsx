import { Wrench, BookText, Bolt, Server, RefreshCw, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';

interface ServiceItem {
    id: string;
    icon: string;
    title: string;
    description: string;
}

interface LayananSectionProps {
    title?: string;
    services?: ServiceItem[];
}

const ICON_MAP: Record<string, ReactNode> = {
    Wrench: <Wrench className="h-6 w-6" />,
    BookText: <BookText className="h-6 w-6" />,
    Bolt: <Bolt className="h-6 w-6" />,
    Server: <Server className="h-6 w-6" />,
    RefreshCw: <RefreshCw className="h-6 w-6" />,
    Zap: <Zap className="h-6 w-6" />,
};

const defaultServices: ServiceItem[] = [
    {
        id: '1',
        icon: 'Wrench',
        title: 'Enjiniring',
        description:
            'PEB sendiri berfokus pada pembangkitan listrik untuk komunitas dan industri. PEB menggunakan metode yang berkaitan dengan kerangka teori dari bidang teknik elektro dan teknik mesin.',
    },
    {
        id: '2',
        icon: 'BookText',
        title: 'Pengadaan',
        description:
            'PEB memanfaatkan pengetahuan dan ahli khusus untuk memastikan bahwa setiap fasilitas yang ada memiliki mesin, komponen, dan dapat beroperasi dengan aman.',
    },
    {
        id: '3',
        icon: 'Bolt',
        title: 'Konstruksi',
        description:
            'Berpengalaman dalam konstruksi perpipaan & pipa saluran, pembangkit listrik dengan teknologi mutakhir dan inovasi berkelanjutan serta memastikan bahwa fasilitas yang ada mampu mencapai tingkat efisiensi tertinggi.',
    },
    {
        id: '4',
        icon: 'Server',
        title: 'Instalasi',
        description:
            'Kami bekerja sama dengan anda untuk membangun semua fasilitas dan intalasi terbaik, baik di area perkotaan yang padat maupun di daerah terpencil, untuk pipa gas atau pembangkit listrik.',
    },
    {
        id: '5',
        icon: 'Zap',
        title: 'Operasional',
        description:
            'PEB telah memastikan bahwa seluruh kontrol terkait pipeline atau power plant yang beroperasi akan selalu di monitoring selama 365 hari dalam 24 jam setiap tahun nya.',
    },
    {
        id: '6',
        icon: 'RefreshCw',
        title: 'Pemeliharaan',
        description:
            'Kami akan memastikan bahwa pipeline gas dan power plan akan selalu berjalan dengan baik regularly, memastikan keandalan nya, memastikan jangka umur nya, biaya operasi yang lebih murah dan memastikan peningkatkan keamanan operasional',
    },
];

export default function LayananSection({
    title = 'Layanan Terbaik Akan Selalu Kami Berikan',
    services = defaultServices,
}: LayananSectionProps) {
    const activeServices =
        services && services.length > 0 ? services : defaultServices;

    return (
        <section className="bg-[#EDF5F6] px-5 py-12 transition-colors duration-500 sm:px-8 lg:flex lg:min-h-screen lg:items-center lg:px-12 lg:py-14 dark:bg-[#0d2e2e]">
            <div className="mx-auto w-full max-w-[1440px]">
                <AnimeReveal delay={100} distance={30} direction="up">
                    <h2 className="text-xl leading-tight font-bold text-[#1a2e2e] transition-colors duration-500 sm:text-2xl lg:text-3xl dark:text-white">
                        {title}
                    </h2>
                </AnimeReveal>

                <div className="mt-3 mb-10 h-0.5 w-24 rounded-full bg-[#2dd4bf] lg:mb-12" />

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
                    {activeServices.map((service, index) => {
                        const iconNode = ICON_MAP[service.icon] || (
                            <Wrench className="h-6 w-6" />
                        );

                        return (
                            <AnimeReveal
                                key={service.id || index}
                                delay={200 + index * 100}
                                distance={40}
                                direction="up"
                            >
                                <div className="group relative flex h-full min-h-40 flex-col rounded-2xl bg-[#F8F9FA] p-6 pt-8 text-[#1a2e2e] shadow-sm [filter:drop-shadow(0px_0px_0_rgba(43,181,178,0))_drop-shadow(0px_0px_0_rgba(43,181,178,0))] transition-all duration-500 hover:-translate-y-1 hover:bg-[#2bb5b2] hover:text-white hover:[filter:drop-shadow(8px_-8px_0_rgba(43,181,178,0.3))_drop-shadow(8px_-8px_0_rgba(43,181,178,0.3))] dark:bg-[#122b2b] dark:text-white">
                                    {/* Tab background base */}
                                    <div
                                        className="absolute z-0 rounded-2xl bg-[#F8F9FA] transition-colors duration-500 group-hover:bg-[#2bb5b2] dark:bg-[#122b2b]"
                                        style={{
                                            height: '3.5rem',
                                            width: '3.5rem',
                                            top: '-1.5rem',
                                            left: '0rem',
                                        }}
                                    />

                                    {/* Inverted curve base */}
                                    <div
                                        className="absolute z-0 transition-opacity duration-500 group-hover:opacity-0"
                                        style={{
                                            height: '1rem',
                                            width: '1rem',
                                            top: '-0.75rem',
                                            left: '3.5rem',
                                        }}
                                    >
                                        <div className="h-full w-full bg-[#F8F9FA] [mask-image:radial-gradient(circle_at_top_right,transparent_1rem,#000_1rem)] dark:bg-[#122b2b]" />
                                    </div>

                                    {/* Inverted curve hover (Teal) */}
                                    <div
                                        className="absolute z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        style={{
                                            height: '1rem',
                                            width: '1rem',
                                            top: '-0.75rem',
                                            left: '3.5rem',
                                            background: `radial-gradient(circle at top right, transparent 1rem, #2bb5b2 1rem)`,
                                        }}
                                    />

                                    {/* Kotak Putih Tempat Ikon */}
                                    <div className="absolute -top-4 left-3 z-10 flex size-10 items-center justify-center rounded-xl bg-white text-[#2bb5b2] shadow-sm transition-colors duration-500 dark:bg-[#1a3a3a] [&_svg]:size-4">
                                        {iconNode}
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 mt-4 flex flex-1 flex-col">
                                        <h3 className="mb-2 text-base font-bold lg:text-lg">
                                            {service.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-gray-600 transition-colors duration-500 group-hover:text-white/90 lg:text-sm dark:text-white/60">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </AnimeReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
