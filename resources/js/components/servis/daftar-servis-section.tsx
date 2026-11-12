import { router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';

interface ServiceItem {
    id: string | number;
    title: string;
    description: string;
    imageSrc: string;
}

interface DaftarServisSectionProps {
    data?: {
        title: string;
        services: ServiceItem[];
    } | null;
}

const servicesData: ServiceItem[] = [
    {
        id: '1',
        title: 'Enjiniring',
        description:
            'PEB sendiri berfokus pada pembangkitan listrik untuk komunitas dan industri. PEB menggunakan metode yang berkaitan dengan kerangka teori dari bidang teknik elektro dan teknik mesin.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
    },
    {
        id: '2',
        title: 'Pengadaan',
        description:
            'PEB memanfaatkan pengetahuan dan ahli khusus untuk memastikan bahwa setiap fasilitas yang ada memiliki mesin, komponen, dan dapat beroperasi dengan aman.',
        imageSrc: '/assets/beranda/portfolio/2.png',
    },
    {
        id: '3',
        title: 'Konstruksi',
        description:
            'Berpengalaman dalam konstruksi perpipaan & pipa saluran, pembangkit listrik dengan teknologi mutakhir dan inovasi berkelanjutan serta memastikan fasilitas yang ada mampu mencapai...',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
    },
    {
        id: '4',
        title: 'Instalasi',
        description:
            'Kami bekerja sama dengan anda untuk membangun semua fasilitas dan intalasi terbaik, baik di area perkotaan yang padat maupun di daerah terpencil, untuk pipa gas atau pembangkit...',
        imageSrc: '/assets/pengadaan/items/item2.png',
    },
    {
        id: '5',
        title: 'Operasional',
        description:
            'PEB telah memastikan bahwa seluruh kontrol terkait pipeline atau power plant yang beroperasi akan selalu di monitoring selama 365 hari dalam 24 jam, setiap tahun nya.',
        imageSrc: '/assets/pengadaan/items/item5.png',
    },
    {
        id: '6',
        title: 'Pemeliharaan',
        description:
            'Kami akan memastikan bahwa pipeline gas dan power plan akan selalu berjalan dengan baik regularly, memastikan keandalan nya, memastikan jangka umur nya, biaya operasi yang lebih murah...',
        imageSrc: '/assets/pengadaan/items/item1.png',
    },
];

export default function DaftarServisSection({
    data,
}: DaftarServisSectionProps) {
    const title = data?.title ?? 'Daftar Servis';
    const services = data?.services?.length ? data.services : servicesData;

    return (
        <section className="bg-[#EDF5F6] px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-14 dark:bg-[#0a1a1a]">
            <div className="mx-auto w-full">
                {/* Section Header */}
                <div className="mb-9">
                    <AnimeReveal delay={100} distance={20}>
                        <h2 className="relative inline-block text-xl font-bold text-[#0d2e2e] transition-colors duration-500 sm:text-2xl lg:text-3xl dark:text-white">
                            {title}
                            {/* Teal line indicator matching the image */}
                            <span className="absolute -bottom-2 left-0 h-1 w-20 rounded-full bg-[#00A4B9] dark:bg-[#2dd4bf]" />
                        </h2>
                    </AnimeReveal>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <AnimeReveal
                            key={service.id}
                            delay={200 + index * 100}
                            distance={30}
                        >
                            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-lg shadow-gray-200/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none dark:hover:border-white/10">
                                {/* Card Image with brand color overlay */}
                                <div className="relative h-48 shrink-0 overflow-hidden lg:h-52">
                                    <img
                                        src={service.imageSrc}
                                        alt={service.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                `https://placehold.co/600x400/0d2e2e/ffffff?text=${service.title}`;
                                        }}
                                    />
                                    {/* Teal tint overlay matching the image blend effect */}
                                    <div className="absolute inset-0 bg-[#00A4B9]/15 mix-blend-multiply transition-colors duration-500 dark:bg-[#2dd4bf]/10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-1 flex-col p-5 lg:p-6">
                                    <h3 className="mb-3 text-base font-bold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                        {service.title}
                                    </h3>

                                    <p className="mb-6 line-clamp-3 flex-1 text-xs leading-relaxed text-gray-500 transition-colors duration-500 sm:text-sm dark:text-white/60">
                                        {service.description}
                                    </p>

                                    {/* Action Button */}
                                    <div className="mt-auto">
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    `/servis/detail?id=${service.id}`,
                                                )
                                            }
                                            className="group/btn inline-flex cursor-pointer items-center justify-between gap-3 rounded-full bg-[#0d2e2e] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#163f3f] hover:shadow-md active:scale-95 dark:bg-[#00A4B9] dark:hover:bg-[#008c9e]"
                                        >
                                            Lihat Selengkapnya
                                            <ChevronRight
                                                size={14}
                                                className="transition-transform duration-300 group-hover/btn:translate-x-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </AnimeReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
