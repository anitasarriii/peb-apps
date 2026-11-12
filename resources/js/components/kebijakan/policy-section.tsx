import { Scale, Shield, Download, Zap } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';

interface KebijakanCard {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    signedBy: string;
    role: string;
    date: string;
    fileUrl?: string;
    imageSrc?: string;
}

interface KebijakanPebSectionData {
    title: string;
    cards: KebijakanCard[];
}

interface PolicySectionProps {
    kebijakanPebSection?: KebijakanPebSectionData | null;
}

const DEFAULT_TITLE = 'Kebijakan PEB';

const DEFAULT_CARDS: KebijakanCard[] = [
    {
        id: 'tata-kelola',
        title: 'Tata Kelola Perusahaan',
        subtitle: 'Good Corporate Governance',
        description:
            'Komitmen ini kami buat dengan penuh kesadaran dan rasa tanggung jawab karena kami yakin bahwa pengelolaan perusahaan sesuai dengan prinsip-prinsip standar yang tinggi untuk Good Corporate Governance dan best practice akan memberikan kemaslahatan bagi semua pihak serta mewujudkan kehidupan dengan kualitas yang lebih baik.',
        signedBy: 'PT Pelayanan Energi Batam',
        role: 'Direksi',
        date: 'Batam, 12 Oktober 2017',
        fileUrl: '#',
    },
    {
        id: 'manajemen-risiko',
        title: 'Manajemen Risiko',
        subtitle: 'Risk Management Policy',
        description:
            'PT Pelayanan Energi Batam (PT PEB) berkomitmen untuk melakukan pengelolaan atas risiko-risiko yang akan dihadapi dalam setiap proses bisnis perusahaan dalam rangka mencapai sasaran dan memenuhi kepatuhan terhadap Good Corporate Governance (GCG) yang dicanangkan oleh Pemerintah Republik Indonesia dalam Peraturan BUMN No. PER-01/MBU/2011.',
        signedBy: 'ROSA DARMAN',
        role: 'Direktur',
        date: 'Batam, 01 Oktober 2024',
    },
    {
        id: 'sistem-manajemen',
        title: 'Sistim Manajemen Terpadu',
        subtitle: 'Integrated Management System Policy',
        description:
            'PT Pelayanan Energi Batam (PT PEB) sebagai Badan Hukum Pemilik Izin Manufaktur/ Fabrikasi Penunjang Industri Minyak & Gas dan Manajemen Gas Transportasi Industri Lainnya. Berkomitmen untuk memenuhi kebutuhan dan melebihi Ekspektasi pelanggan, persyaratan perundangan melalui peningkatan berkelanjutan dan efisiensi biaya.',
        signedBy: 'PT Pelayanan Energi Batam',
        role: 'Direksi',
        date: 'Batam, 12 Oktober 2017',
    },
];

export default function PolicySection({
    kebijakanPebSection,
}: PolicySectionProps) {
    const title = kebijakanPebSection?.title || DEFAULT_TITLE;

    const renderWithNoTranslate = (text: string) => {
        if (!text) {
            return text;
        }

        const parts = text.split(/(PT Pelayanan Energi Batam)/g);

        return parts.map((part, i) =>
            part === 'PT Pelayanan Energi Batam' ? (
                <span key={i} className="notranslate">
                    {part}
                </span>
            ) : (
                part
            ),
        );
    };
    const cards = kebijakanPebSection?.cards?.length
        ? kebijakanPebSection.cards
        : DEFAULT_CARDS;

    const icons = [Scale, Shield, Zap];

    return (
        <section className="border-t border-[#0d2e2e]/5 bg-[#f7fafb] px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-16 dark:border-white/5 dark:bg-[#0c1f1f]">
            <div className="mx-auto w-full max-w-[1440px]">
                <AnimeReveal
                    delay={100}
                    distance={20}
                    className="mb-8 lg:mb-10"
                >
                    <h2 className="w-fit border-b-[3px] border-[#00A4B9] pb-3 text-2xl font-bold tracking-tight text-[#0d2e2e] sm:text-3xl dark:border-[#2dd4bf] dark:text-white">
                        {title}
                    </h2>
                </AnimeReveal>

                <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {cards.map((card, index) => {
                        const Icon = icons[index % icons.length];

                        return (
                            <AnimeReveal
                                key={card.id || index}
                                delay={150 + index * 100}
                                distance={24}
                                className="flex h-full min-w-0"
                            >
                                <article className="flex w-full min-w-0 flex-col rounded-2xl border border-[#0d2e2e]/10 bg-white p-6 shadow-[0_4px_24px_rgba(13,46,46,0.03)] transition-colors duration-300 hover:border-[#00A4B9]/35 sm:p-8 dark:border-white/10 dark:bg-[#122b2b] dark:hover:border-[#2dd4bf]/40">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#00A4B9]/10 text-[#008c9e] dark:bg-[#2dd4bf]/10 dark:text-[#2dd4bf]">
                                            <Icon
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <span
                                            className="text-xs font-medium tracking-[0.15em] text-[#0d2e2e]/30 dark:text-white/30"
                                            aria-hidden="true"
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {card.imageSrc && (
                                        <img
                                            src={card.imageSrc}
                                            alt={card.title}
                                            loading="lazy"
                                            className="mb-4 max-h-56 w-full rounded-xl object-contain"
                                        />
                                    )}
                                    <header className="mb-5">
                                        <h3 className="text-lg leading-snug font-bold text-[#0d2e2e] dark:text-white">
                                            {card.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-[#008c9e] sm:text-sm dark:text-[#2dd4bf]/80">
                                            {card.subtitle}
                                        </p>
                                    </header>

                                    <p className="mb-8 text-left text-sm leading-7 break-words text-[#0d2e2e]/70 dark:text-white/70">
                                        {renderWithNoTranslate(
                                            card.description,
                                        )}
                                    </p>

                                    <footer className="mt-auto border-t border-[#0d2e2e]/10 pt-5 dark:border-white/10">
                                        <p className="text-xs leading-6 text-[#0d2e2e]/50 dark:text-white/50">
                                            {card.date}
                                        </p>
                                        <p className="mt-1 text-sm text-[#0d2e2e]/70 dark:text-white/70">
                                            {card.role}
                                        </p>
                                        <p className="my-3 text-[10px] font-semibold tracking-[0.2em] text-[#008c9e] dark:text-[#2dd4bf]">
                                            TTD
                                        </p>
                                        <p className="text-sm leading-relaxed font-semibold break-words text-[#0d2e2e] dark:text-white">
                                            {renderWithNoTranslate(
                                                card.signedBy,
                                            )}
                                        </p>

                                        {card.fileUrl &&
                                            card.fileUrl !== '#' && (
                                                <a
                                                    href={card.fileUrl}
                                                    download
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#00A4B9]/25 px-4 py-2 text-xs font-semibold text-[#008c9e] transition-colors hover:bg-[#00A4B9]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00A4B9] dark:border-[#2dd4bf]/25 dark:text-[#2dd4bf] dark:hover:bg-[#2dd4bf]/10"
                                                >
                                                    <Download
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                    Unduh dokumen
                                                </a>
                                            )}
                                    </footer>
                                </article>
                            </AnimeReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
