import { ArrowUpRight } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { ReactNode } from 'react';
import { protectBrandName } from '@/lib/utils';

interface AboutSectionProps {
    title?: string | ReactNode;
    description?: string | ReactNode;
    imageSrc?: string;
    experienceYears?: string;
    experienceLabel?: string;
    locationLabel?: string;
    locationValue?: string;
    mapsMode?: 'koordinat' | 'embed';
    mapsKoordinat?: string;
    mapsEmbedUrl?: string;
}

export default function AboutSection({
    title = 'PT Pelayanan Energi Batam',
    description = 'Sebagai bagian dari PLN Group, PT Pelayanan Energi Batam (PEB) berdedikasi menghadirkan infrastruktur energi kelas dunia sejak 2014. Dari fondasi kuat dalam layanan EPCI gas, kami kini bertransformasi menjadi penyedia solusi energi terintegrasi, mencakup Operasi & Pemeliharaan (O&M) Pembangkit hingga pengembangan Energi Terbarukan (Tenaga Surya). Kami siap menjawab tantangan masa depan dengan layanan yang andal, inovatif, dan berorientasi pada keberlanjutan.',
    imageSrc = '/assets/tentang-kami/about/about.png',
    experienceYears = '25+',
    experienceLabel = 'Tahun pengalaman dalam industri energi',
    locationLabel = 'Lokasi Kami',
    locationValue = 'Batam, Kepulauan Riau',
    mapsMode = 'koordinat',
    mapsKoordinat = '1.1301,104.0529',
    mapsEmbedUrl = '',
}: AboutSectionProps) {
    const bgColorClass = 'bg-[#EDF5F6] dark:bg-[#0a1a1a]';
    const shadowColorClass = 'shadow-[#EDF5F6] dark:shadow-[#0a1a1a]';

    // Logika penentuan link Google Maps
    let mapLink = '#';
    if (mapsMode === 'koordinat' && mapsKoordinat) {
        // Gabungkan koordinat dengan nama lokasi di dalam tanda kurung agar Google Maps menampilkan label nama tempat tersebut
        const labelQuery = locationValue ? ` (${locationValue})` : '';
        mapLink = `https://maps.google.com/?q=${encodeURIComponent(mapsKoordinat.trim() + labelQuery)}`;
    } else if (mapsMode === 'embed' && mapsEmbedUrl) {
        // Jika berupa iframe code lengkap, coba ekstrak URL src-nya. Jika berupa URL langsung gunakan itu.
        const iframeSrcMatch = mapsEmbedUrl.match(
            /src=["'](https:\/\/www\.google\.com\/maps\/embed[^"']+)["']/,
        );
        mapLink = iframeSrcMatch ? iframeSrcMatch[1] : mapsEmbedUrl;
    }

    // Jika description berupa string, lindungi nama brand dari Google Translate
    const processedDescription =
        typeof description === 'string'
            ? protectBrandName(description)
            : description;
    const normalizedTitle =
        typeof title === 'string' ? title.replace(/\s+/g, ' ').trim() : title;
    return (
        <section
            className={`transition-colors duration-500 ${bgColorClass} px-5 py-12 sm:px-8 lg:px-12 lg:py-14`}
        >
            <div className="mx-auto w-full max-w-[1500px]">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* Left — Text */}
                    <div className="flex flex-col justify-center lg:col-span-7">
                        <AnimeReveal delay={100} distance={30} direction="up">
                            <h2 className="notranslate mb-6 w-fit max-w-full border-b-[3px] border-[#f5e879] pb-4 text-xl leading-tight font-bold text-[#1a2e2e] transition-colors duration-500 sm:text-2xl md:text-3xl lg:text-[1.85rem] lg:leading-tight dark:text-white">
                                {normalizedTitle}
                            </h2>
                        </AnimeReveal>
                        <AnimeReveal delay={200} distance={30} direction="up">
                            <p className="max-w-[52ch] text-left text-sm leading-7 text-[#1a2e2e]/75 transition-colors duration-500 sm:text-base sm:leading-8 dark:text-white/80">
                                {processedDescription}
                            </p>
                        </AnimeReveal>
                    </div>

                    {/* Right — Image Card */}
                    <AnimeReveal
                        delay={250}
                        distance={40}
                        direction="left"
                        className="group relative mx-auto w-full max-w-[620px] lg:col-span-5"
                    >
                        {/* Glow Shadow Effect */}
                        <div className="absolute -inset-4 z-0 h-[80%] w-[80%] rounded-4xl bg-linear-to-tr from-[#00A4B9] to-[#60A5FA] opacity-70 blur-2xl lg:-inset-6 lg:blur-xl"></div>

                        {/* Experience Badge */}
                        <div className="absolute -top-6 left-2 z-20 rounded-2xl border border-l-4 border-[#e0e0e0] border-l-[#FFF098] bg-white px-4 py-3 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl sm:-top-8 sm:left-4 sm:px-5 sm:py-4 md:top-8 md:-left-6 lg:top-12 lg:-left-8 lg:px-5 lg:py-4 dark:border-white/10 dark:bg-[#1a3a3a]">
                            <p className="text-xl font-bold text-[#1a2e2e] sm:text-2xl md:text-3xl lg:text-3xl dark:text-white">
                                {experienceYears}
                            </p>
                            <p className="max-w-[120px] text-[10px] leading-snug text-[#1a2e2e]/60 sm:max-w-[140px] sm:text-xs md:text-sm lg:max-w-[135px] lg:text-xs dark:text-white">
                                {experienceLabel}
                            </p>
                        </div>

                        {/* Main Image */}
                        <div className="relative z-10 overflow-hidden rounded-3xl shadow-lg transition-shadow duration-500 group-hover:shadow-2xl">
                            <img
                                src={imageSrc}
                                alt="Gedung PT Pelayanan Energi Batam"
                                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Location Overlay */}
                            <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-[#0d2e2e]/80 to-transparent px-6 pt-16 pb-6 lg:px-8 lg:pb-8">
                                <p className="text-xs font-medium text-white md:text-sm">
                                    {locationLabel}
                                </p>
                                <p className="text-base font-bold text-white md:text-lg">
                                    {locationValue}
                                </p>
                            </div>

                            {/* --- Arrow Button with Inverted Border (Kanan Bawah) --- */}
                            <div
                                className={`absolute right-0 bottom-0 z-20 flex h-14 w-14 items-center justify-center rounded-lg bg-transparent lg:h-16 lg:w-16`}
                            >
                                <a
                                    href={mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d2e2e] text-white transition-all duration-500 hover:scale-110 lg:h-12 lg:w-12 dark:bg-[#00A4B9]"
                                >
                                    <ArrowUpRight className="h-5 w-5" />
                                </a>
                            </div>
                            <div
                                className={`absolute right-0 bottom-0 z-10 flex h-14 w-14 items-center justify-center rounded-tl-2xl transition-colors duration-500 lg:h-16 lg:w-16 ${bgColorClass}`}
                            >
                                {/* Corner Smoothing */}
                                <div
                                    className={`pointer-events-none absolute -top-5 right-0 h-5 w-5 rounded-br-2xl bg-transparent shadow-[10px_10px_0_10px] transition-shadow duration-500 ${shadowColorClass}`}
                                />
                                <div
                                    className={`pointer-events-none absolute bottom-0 -left-5 h-5 w-5 rounded-br-2xl bg-transparent shadow-[10px_10px_0_10px] transition-shadow duration-500 ${shadowColorClass}`}
                                />
                            </div>
                        </div>
                    </AnimeReveal>
                </div>
            </div>
        </section>
    );
}
