import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Zap,
    Cpu,
    Globe,
    FileText,
    Server,
    Activity,
    Wrench,
    Shield,
    Monitor,
    TrendingUp,
    ChevronRight,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';

type ServiceType =
    | 'Enjiniring'
    | 'Pengadaan'
    | 'Konstruksi'
    | 'Instalasi'
    | 'Operasional'
    | 'Pemeliharaan';

interface ServiceDetail {
    title: string;
    text1: string;
    text2: string;
    imageSrc: string;
    feature1: {
        icon: React.ReactNode;
        title: string;
        desc: string;
    };
    feature2: {
        icon: React.ReactNode;
        title: string;
        desc: string;
    };
}

const serviceDetails: Record<ServiceType, ServiceDetail> = {
    Enjiniring: {
        title: 'Layanan Enjiniring Komprehensif',
        text1: 'PEB telah terbukti fokus dalam pembangunan infrastruktur pembangkit listrik untuk komunitas dan industri dengan kerangka kerja berdasarkan teori teknik elektro dan mesin yang efisien. Kami menyediakan solusi rekayasa dari tahap konseptual hingga desain detail, memastikan setiap proyek memenuhi standar keamanan, efisiensi, dan keandalan tertinggi.',
        text2: 'Tim ahli kami berpengalaman dalam merancang sistem yang kompleks, mengoptimalkan kinerja energi, dan meminimalkan dampak lingkungan. Dengan pendekatan multidisiplin, kami mengintegrasikan teknologi terkini untuk memberikan hasil yang inovatif dan berkelanjutan bagi klien kami di sektor energi.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
        feature1: {
            icon: <Zap className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />,
            title: 'Sistem Elektrikal',
            desc: 'Desain komprehensif untuk jaringan distribusi daya, panel kontrol, dan sistem kelistrikan tegangan tinggi/rendah.',
        },
        feature2: {
            icon: <Cpu className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />,
            title: 'Rekayasa Mekanikal',
            desc: 'Perencanaan terperinci untuk perpipaan industri, sistem turbin, dan infrastruktur mekanikal tugas berat.',
        },
    },
    Pengadaan: {
        title: 'Manajemen Pengadaan Energi Strategis',
        text1: 'Layanan pengadaan kami berfokus pada penyediaan material teknik, suku cadang, dan komponen pembangkit listrik dengan efisiensi rantai pasok global terbaik. Kami bermitra dengan manufaktur orisinil untuk menjamin kualitas material yang tahan lama dan memenuhi standar industri energi.',
        text2: 'Kami memastikan proses pengadaan yang transparan, akuntabel, dan tepat waktu melalui sistem e-procurement yang canggih. Hal ini meminimalkan downtime fasilitas operasional dan memastikan proyek Anda berjalan sesuai jadwal.',
        imageSrc: '/assets/beranda/portfolio/2.png',
        feature1: {
            icon: (
                <Globe className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Rantai Pasok Global',
            desc: 'Akses ke jaringan produsen suku cadang dan komponen energi global dengan jaminan harga kompetitif.',
        },
        feature2: {
            icon: (
                <FileText className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Kepatuhan & Sertifikasi',
            desc: 'Jaminan keaslian suku cadang dengan sertifikasi industri internasional lengkap dan terakreditasi.',
        },
    },
    Konstruksi: {
        title: 'Konstruksi Infrastruktur Energi Presisi',
        text1: 'Pembangunan fisik pembangkit listrik, gardu induk, dan jaringan transmisi dengan tingkat presisi tinggi. Tim lapangan kami dilengkapi keahlian konstruksi terkini serta standar keselamatan kerja internasional yang ketat.',
        text2: 'Kami bangga dengan catatan nihil kecelakaan kerja (Zero Accident) dan kepatuhan ramah lingkungan yang memastikan proyek selesai dengan hasil struktural yang kokoh dan berkelanjutan.',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
        feature1: {
            icon: (
                <Server className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Gardu Induk & Grid',
            desc: 'Konstruksi gardu hubung dan gardu induk dengan integrasi smart grid modern dan efisien.',
        },
        feature2: {
            icon: (
                <Activity className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Manajemen Proyek',
            desc: 'Pengawasan lapangan harian yang ketat dengan pelaporan real-time untuk kelancaran pengerjaan.',
        },
    },
    Instalasi: {
        title: 'Instalasi Sistem Mekanikal & Elektrikal',
        text1: 'Pemasangan pipa gas bertekanan tinggi, turbin generator, dan Battery Energy Storage System (BESS) secara aman di berbagai medan geografis, mulai dari area perkotaan padat hingga daerah terpencil di Kepulauan Riau.',
        text2: 'Prosedur instalasi kami melalui serangkaian pengujian pra-komisioning yang ketat untuk menjamin kelayakan pengoperasian jangka panjang tanpa kebocoran atau kegagalan daya.',
        imageSrc: '/assets/pengadaan/items/item2.png',
        feature1: {
            icon: (
                <Wrench className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Instalasi Pipa Gas',
            desc: 'Sistem perpipaan gas industri berkualitas tinggi dengan pengelasan standar ASME.',
        },
        feature2: {
            icon: <Zap className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />,
            title: 'Sistem Penyimpanan BESS',
            desc: 'Integrasi penyimpanan baterai berkapasitas besar untuk stabilitas daya grid industri.',
        },
    },
    Operasional: {
        title: 'Manajemen Operasional 24/7 Real-Time',
        text1: 'Pengawasan operasional pembangkit dan pipeline gas dilakukan secara berkelanjutan selama 365 hari dalam 24 jam. Kami memanfaatkan sistem monitoring berbasis SCADA dan IoT pintar untuk memastikan aliran daya tetap stabil.',
        text2: 'Tim operator bersertifikasi kami siap siaga melakukan penyesuaian parameter operasional secara cepat guna mengantisipasi fluktuasi beban dan menghindari gangguan pasokan daya.',
        imageSrc: '/assets/pengadaan/items/item5.png',
        feature1: {
            icon: (
                <Monitor className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Pusat Kontrol SCADA',
            desc: 'Pemantauan visual waktu nyata terhadap seluruh stasiun penerima gas dan pembangkit.',
        },
        feature2: {
            icon: (
                <Shield className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Mitigasi Cepat',
            desc: 'Protokol tanggap darurat otomatis untuk penghentian operasional yang aman saat terjadi anomali.',
        },
    },
    Pemeliharaan: {
        title: 'Layanan Pemeliharaan Preventif & Korektif',
        text1: 'Pemeliharaan terjadwal secara berkala untuk menjaga keandalan mesin, memperpanjang masa pakai aset, serta meminimalkan downtime. Kami mencakup pemeliharaan rutin turbin, overhaul kompresor, dan kalibrasi sensor.',
        text2: 'Dengan analisis prediktif berbasis data, kami dapat mendeteksi gejala keausan komponen sebelum terjadi kerusakan fatal, menghemat biaya operasional perbaikan hingga 40%.',
        imageSrc: '/assets/pengadaan/items/item1.png',
        feature1: {
            icon: (
                <Wrench className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Overhaul Pembangkit',
            desc: 'Perbaikan besar turbin gas, generator, dan panel distribusi dengan akurasi dan presisi tinggi.',
        },
        feature2: {
            icon: (
                <TrendingUp className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
            ),
            title: 'Analisis Prediktif',
            desc: 'Pemantauan getaran, suhu, dan sirkulasi pelumas untuk deteksi dini keausan komponen.',
        },
    },
};

const defaultServicesList: ServiceItem[] = [
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
            'Berpengalaman dalam konstruksi perpipaan & pipa saluran, pembangkit listrik dengan teknologi mutakhir dan inovasi berkelanjutan serta memastikan fasilitas yang ada mampu mencapai target.',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
    },
    {
        id: '4',
        title: 'Instalasi',
        description:
            'Kami bekerja sama dengan anda untuk membangun semua fasilitas dan instalasi terbaik, baik di area perkotaan yang padat maupun di daerah terpencil, untuk pipa gas atau pembangkit.',
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
            'Kami akan memastikan bahwa pipeline gas and power plan akan selalu berjalan dengan baik regularly, memastikan keandalan nya, memastikan jangka umur nya, biaya operasi yang lebih murah.',
        imageSrc: '/assets/pengadaan/items/item1.png',
    },
];

interface ServiceItem {
    id: string | number;
    title: string;
    description: string;
    imageSrc: string;
}

interface ServisDetailContentProps {
    data?: {
        id: number;
        title: string;
        services: ServiceItem[];
    } | null;
}

export default function ServisDetailContent({
    data,
}: ServisDetailContentProps) {
    const services = data?.services?.length
        ? data.services
        : defaultServicesList;

    const [activeId, setActiveId] = useState<string | number>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const queryId = params.get('id');
            if (queryId) {
                const found = services.find((s) => String(s.id) === queryId);
                if (found) return found.id;
            }
        }
        return services[0]?.id ?? '1';
    });

    const activeServiceObj =
        services.find((s) => s.id === activeId) ?? services[0];

    const getActiveDetail = (serviceItem: ServiceItem): ServiceDetail => {
        const keys = Object.keys(serviceDetails) as ServiceType[];
        const matchedKey = keys.find((key) =>
            serviceItem.title.toLowerCase().includes(key.toLowerCase()),
        );

        const baseDetail = matchedKey
            ? serviceDetails[matchedKey]
            : serviceDetails['Enjiniring'];

        return {
            title: serviceItem.title,
            text1: serviceItem.description,
            text2: baseDetail.text2,
            imageSrc: serviceItem.imageSrc,
            feature1: baseDetail.feature1,
            feature2: baseDetail.feature2,
        };
    };

    const activeData = getActiveDetail(activeServiceObj);

    return (
        <main className="bg-[#EDF5F6] px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-14 dark:bg-[#0a1a1a]">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Left Column - Dynamic Content (8 cols) */}
                    <div className="space-y-10 lg:col-span-8">
                        {/* Dynamic Content Container */}
                        <AnimeReveal
                            key={String(activeId)}
                            delay={100}
                            distance={15}
                            direction="up"
                            className="space-y-10"
                        >
                            {/* Title & Description */}
                            <div className="space-y-6">
                                <h2 className="text-3xl leading-tight font-bold text-[#0d2e2e] transition-colors duration-500 lg:text-4xl dark:text-white">
                                    {activeData.title}
                                </h2>
                                <p className="text-md leading-relaxed text-gray-600 transition-colors duration-500 dark:text-white/70">
                                    {activeData.text1}
                                </p>
                                <p className="text-md leading-relaxed text-gray-600 transition-colors duration-500 dark:text-white/70">
                                    {activeData.text2}
                                </p>
                            </div>

                            {/* Large Image matching the image layout */}
                            <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-gray-50 p-2 shadow-2xl shadow-gray-200/40 transition-all duration-500 dark:border-white/5 dark:bg-black/20 dark:shadow-none">
                                <img
                                    src={activeData.imageSrc}
                                    alt={activeData.title}
                                    className="h-[450px] w-full rounded-[2.2rem] object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://placehold.co/1200x800/0d2e2e/ffffff?text=PEB+Energy+Services';
                                    }}
                                />
                                <div className="absolute inset-0 rounded-[2.2rem] bg-[#00A4B9]/10 mix-blend-multiply" />
                            </div>

                            {/* Sub Features Grid */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {/* Feature 1 */}
                                <div className="flex items-start gap-4 p-2">
                                    <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf8f9] shadow-sm transition-colors duration-500 dark:bg-[#00A4B9]/10">
                                        {activeData.feature1.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                            {activeData.feature1.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-gray-500 dark:text-white/50">
                                            {activeData.feature1.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex items-start gap-4 p-2">
                                    <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf8f9] shadow-sm transition-colors duration-500 dark:bg-[#00A4B9]/10">
                                        {activeData.feature2.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                            {activeData.feature2.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-gray-500 dark:text-white/50">
                                            {activeData.feature2.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AnimeReveal>
                    </div>

                    {/* Right Column - Navigation Sidebar (4 cols) */}
                    <div className="space-y-8 lg:col-span-4">
                        {/* Sidebar Navigation Card */}
                        <AnimeReveal delay={200} distance={20}>
                            <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-gray-200/50 transition-all duration-500 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                {/* Sidebar Title Banner */}
                                <div className="bg-[#0d2e2e] px-8 py-5 transition-colors dark:bg-[#081e1e]">
                                    <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                                        OUR SERVICES
                                    </h3>
                                </div>

                                {/* Services List */}
                                <div className="divide-y divide-gray-100 transition-colors dark:divide-white/5">
                                    {services.map((service) => {
                                        const isActive =
                                            activeId === service.id;
                                        return (
                                            <button
                                                key={service.id}
                                                onClick={() =>
                                                    setActiveId(service.id)
                                                }
                                                className={cn(
                                                    'text-md flex w-full cursor-pointer items-center justify-between px-8 py-5 text-left font-semibold transition-all duration-300 select-none',
                                                    isActive
                                                        ? 'bg-gray-50/50 font-bold text-[#00A4B9] dark:bg-white/5 dark:text-[#2dd4bf]'
                                                        : 'text-gray-600 hover:bg-gray-50/30 hover:text-[#00A4B9] dark:text-white/60 dark:hover:bg-white/2 dark:hover:text-[#2dd4bf]',
                                                )}
                                            >
                                                <span>{service.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </AnimeReveal>

                        {/* Secondary Interactive Call-to-action */}
                        <AnimeReveal delay={300} distance={20}>
                            <div className="relative overflow-hidden rounded-[2rem] bg-[#00A4B9] p-8 text-white shadow-2xl shadow-[#00A4B9]/30 transition-all duration-500 hover:-translate-y-1">
                                <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/10 blur-2xl" />
                                <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-black/10 blur-3xl" />

                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-xl leading-tight font-bold">
                                        Butuh Solusi Kustom?
                                    </h3>
                                    <p className="text-xs leading-relaxed text-white/80">
                                        Konsultasikan rekayasa enjiniring, studi
                                        kelayakan, atau rencana konstruksi
                                        energi Anda bersama tim ahli kami.
                                    </p>
                                    <Link
                                        href="/kontak"
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-bold text-[#00A4B9] shadow-xl transition-all hover:bg-[#eaf8f9]"
                                    >
                                        Hubungi Tim Ahli
                                    </Link>
                                </div>
                            </div>
                        </AnimeReveal>
                    </div>
                </div>
            </div>
        </main>
    );
}
