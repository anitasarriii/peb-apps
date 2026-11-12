import { router } from '@inertiajs/react';
import { detail as pengadaanDetail } from '@/routes/pengadaan';
import {
    CheckCircle2,
    FileText,
    Download,
    MapPin,
    Share2,
    Copy,
    MessageCircle,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';

interface Syarat {
    id: string;
    text: string;
}

interface Dokumen {
    id: string;
    name: string;
    fileSize: string;
    sourceType: 'url' | 'upload';
    fileUrl: string;
    fileName?: string;
}

interface PengadaanItem {
    id: string;
    title: string;
    status: 'TERBUKA' | 'SELEKSI' | 'TUTUP';
    isArchived?: boolean;
    startDate: string;
    endDate: string;
    location: string;
    category: string;
    imageSrc: string;
    bannerImage?: string;
    deskripsi?: string;
    syaratList?: Syarat[];
    dokumenList?: Dokumen[];
    mapsMode?: 'koordinat' | 'embed';
    mapsKoordinat?: string;
    mapsEmbedUrl?: string;
    mapsLabel?: string;
}

interface ProcurementDetailContentProps {
    item: PengadaanItem | null;
    daftarPengadaan?: {
        items: PengadaanItem[];
    } | null;
}

export default function ProcurementDetailContent({
    item,
    daftarPengadaan,
}: ProcurementDetailContentProps) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    // Close share menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                shareMenuRef.current &&
                !shareMenuRef.current.contains(event.target as Node)
            ) {
                setShowShareMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ── Data Resolution ──
    const deskripsiText =
        item?.deskripsi || 'Deskripsi pengadaan belum tersedia.';

    const syaratItems = (item?.syaratList ?? []).map((syarat) => syarat.text);
    const dokumenItems = item?.dokumenList ?? [];

    // Google Maps logic
    const buildMapsEmbedUrl = (input?: string): string => {
        if (!input) {
            return '';
        }

        const value = input.trim();
        const coordMatch = value.match(
            /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/,
        );

        if (coordMatch) {
            const [, lat, lng] = coordMatch;

            if (Math.abs(Number(lat)) > 90 || Math.abs(Number(lng)) > 180) {
                return '';
            }
            return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&output=embed`;
        }

        try {
            const url = new URL(value);
            return url.protocol === 'https:' &&
                ['www.google.com', 'maps.google.com', 'google.com'].includes(
                    url.hostname,
                ) &&
                url.pathname.startsWith('/maps/embed')
                ? url.href
                : '';
        } catch {
            return '';
        }
    };

    const mapsLabel = item?.mapsLabel || item?.location || '';
    const mapsMode = item?.mapsMode || 'koordinat';
    const mapsUrl =
        mapsMode === 'koordinat'
            ? buildMapsEmbedUrl(item?.mapsKoordinat)
            : buildMapsEmbedUrl(item?.mapsEmbedUrl || '');

    // Sidebar: Upcoming and Past
    const allItems = daftarPengadaan?.items ?? [];
    const otherItems = allItems.filter(
        (i) => String(i.id) !== String(item?.id),
    );

    const upcomingProcurements = otherItems
        .filter((i) => i.status === 'TERBUKA' || i.status === 'SELEKSI')
        .slice(0, 2);

    const pastProcurements = otherItems
        .filter((i) => i.status === 'TUTUP')
        .slice(0, 2);

    const handleShareCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Tautan halaman berhasil disalin ke clipboard!');
    };

    return (
        <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
            <div className="mx-auto w-full max-w-[1200px]">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
                    {/* Left Content Column (8 cols) */}
                    <div className="min-w-0 space-y-6">
                        {/* Banner Pengumuman */}
                        {(item?.bannerImage || item?.imageSrc) && (
                            <AnimeReveal delay={50} distance={20}>
                                <div className="overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white p-3 dark:border-white/10 dark:bg-[#122b2b]">
                                    <img
                                        src={item.bannerImage || item.imageSrc}
                                        alt="Banner Pengumuman"
                                        className="mx-auto max-h-[640px] w-auto max-w-full rounded-lg object-contain"
                                    />
                                </div>
                            </AnimeReveal>
                        )}

                        {/* Combined Information Card (Deskripsi, Syarat, & Download) */}
                        <AnimeReveal delay={100} distance={20}>
                            <div className="overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white shadow-xs transition-all duration-500 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                {/* Content Wrapper with Padding */}
                                <div className="space-y-7 p-5 sm:p-7">
                                    {/* Deskripsi Section */}
                                    <div className="space-y-5">
                                        <h2 className="text-base font-semibold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                            {item?.isArchived
                                                ? 'Informasi pengumuman'
                                                : 'Deskripsi pengadaan'}
                                        </h2>
                                        <div
                                            className="prose prose-sm max-w-none text-sm leading-7 break-words text-gray-600 transition-colors duration-500 dark:text-white/60 dark:prose-invert prose-headings:font-semibold prose-headings:text-[#0d2e2e] prose-p:my-3 prose-img:h-auto prose-img:max-w-full"
                                            dangerouslySetInnerHTML={{
                                                __html: deskripsiText,
                                            }}
                                        />
                                    </div>

                                    {/* Syarat Section */}
                                    {syaratItems.length > 0 && (
                                        <div className="space-y-5">
                                            <h2 className="text-base font-semibold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                                Syarat-syarat Pendaftaran
                                            </h2>
                                            <div className="grid grid-cols-1 gap-6">
                                                {syaratItems.map(
                                                    (syaratText, i) => (
                                                        <div
                                                            key={i}
                                                            className="group flex items-start gap-3"
                                                        >
                                                            <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eaf8f9] transition-colors duration-500 dark:bg-[#00A4B9]/10">
                                                                <CheckCircle2
                                                                    size={18}
                                                                    className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                                />
                                                            </div>
                                                            <p className="text-sm leading-7 text-gray-600 transition-colors duration-500 dark:text-white/70">
                                                                {syaratText}
                                                            </p>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Download Documents Box */}
                                    {dokumenItems.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="mb-2 text-base font-semibold text-[#0d2e2e] dark:text-white">
                                                Dokumen Pendukung / Unduhan
                                            </h3>
                                            {dokumenItems.map((doc, idx) => (
                                                <div
                                                    key={doc.id || idx}
                                                    className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-[#f4f7f7] p-4 transition-all duration-500 sm:flex-row dark:border-white/5 dark:bg-black/20"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors duration-500 dark:bg-[#122b2b]">
                                                            <FileText
                                                                size={20}
                                                                className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                                                {doc.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm font-medium text-gray-400 transition-colors duration-500 dark:text-white/40">
                                                                File size:{' '}
                                                                {doc.fileSize}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {doc.fileUrl ? (
                                                        <a
                                                            href={doc.fileUrl}
                                                            download
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00A4B9] px-4 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-[#00A4B9]/20 transition-all hover:bg-[#008c9e] active:scale-95 md:w-auto dark:bg-[#00A4B9] dark:hover:bg-[#008c9e]"
                                                        >
                                                            <Download
                                                                size={20}
                                                            />
                                                            Unduh dokumen
                                                        </a>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-500 md:w-auto dark:bg-white/5 dark:text-white/20"
                                                        >
                                                            Belum Tersedia
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AnimeReveal>

                        {/* Lokasi Pengadaan Card (Interaktif dengan mapsUrl) */}
                        {mapsUrl && (
                            <AnimeReveal delay={300} distance={20}>
                                <div className="rounded-2xl border border-[#0d2e2e]/10 bg-white p-5 shadow-xs transition-all duration-500 lg:p-6 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eaf8f9] transition-colors duration-500 dark:bg-[#00A4B9]/10">
                                                <MapPin
                                                    size={24}
                                                    className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                />
                                            </div>
                                            <h2 className="text-base font-semibold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                                Lokasi Pengadaan
                                            </h2>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition-all duration-500 dark:border-white/5 dark:bg-black/20">
                                            <iframe
                                                src={mapsUrl}
                                                width="100%"
                                                height="250"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                className="rounded-xl opacity-90 transition-opacity duration-500 dark:opacity-75"
                                                title="Peta Lokasi Pengadaan Detail"
                                            />
                                        </div>
                                        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60">
                                            <MapPin
                                                size={16}
                                                className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                            />
                                            {mapsLabel}
                                        </p>
                                    </div>
                                </div>
                            </AnimeReveal>
                        )}

                        {/* Social Share & Copy */}
                        <AnimeReveal delay={500} distance={20}>
                            <div className="flex items-center justify-center gap-3 pt-2 transition-colors duration-500 md:justify-end">
                                <span className="mr-2 text-sm font-medium text-gray-400 transition-colors duration-500 dark:text-white/30">
                                    Bagikan Info Pengadaan:
                                </span>
                                <div className="relative" ref={shareMenuRef}>
                                    {/* Vertical Share Menu */}
                                    <div
                                        className={`absolute bottom-full left-1/2 mb-4 flex origin-bottom -translate-x-1/2 flex-col gap-3 transition-all duration-300 ${showShareMenu ? 'visible scale-100 opacity-100' : 'invisible scale-90 opacity-0'}`}
                                    >
                                        {[
                                            {
                                                icon: (
                                                    <img
                                                        src="/assets/icon/facebook.png"
                                                        alt="Facebook"
                                                        className="size-5 object-contain brightness-0 invert"
                                                    />
                                                ),
                                                label: 'Facebook',
                                                color: 'bg-[#1877F2]',
                                            },
                                            {
                                                icon: (
                                                    <img
                                                        src="/assets/icon/twitter.png"
                                                        alt="Twitter"
                                                        className="size-5 object-contain brightness-0 invert"
                                                    />
                                                ),
                                                label: 'Twitter',
                                                color: 'bg-[#000000]',
                                            },
                                            {
                                                icon: (
                                                    <img
                                                        src="/assets/icon/whatsapp.png"
                                                        alt="WhatsApp"
                                                        className="size-5 object-contain brightness-0 invert"
                                                    />
                                                ),
                                                label: 'WhatsApp',
                                                color: 'bg-[#25D366]',
                                            },
                                        ].map((social, idx) => (
                                            <button
                                                key={idx}
                                                className={`${social.color} border-[#0d2e2e]/10/10 flex size-10 cursor-pointer items-center justify-center rounded-xl border shadow-xl transition-all hover:scale-110`}
                                                title={social.label}
                                                onClick={() => {
                                                    let url = '';
                                                    const currentUrl =
                                                        encodeURIComponent(
                                                            window.location
                                                                .href,
                                                        );
                                                    const currentText =
                                                        encodeURIComponent(
                                                            item?.title ||
                                                                'Detail Pengadaan PEB',
                                                        );

                                                    if (
                                                        social.label ===
                                                        'Facebook'
                                                    ) {
                                                        url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
                                                    } else if (
                                                        social.label ===
                                                        'Twitter'
                                                    ) {
                                                        url = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${currentText}`;
                                                    } else if (
                                                        social.label ===
                                                        'WhatsApp'
                                                    ) {
                                                        url = `https://api.whatsapp.com/send?text=${currentText}%20${currentUrl}`;
                                                    }

                                                    if (url) {
                                                        window.open(
                                                            url,
                                                            '_blank',
                                                        );
                                                    }
                                                }}
                                            >
                                                {social.icon}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() =>
                                            setShowShareMenu(!showShareMenu)
                                        }
                                        className={`flex size-12 cursor-pointer items-center justify-center rounded-2xl border shadow-sm transition-all ${showShareMenu ? 'border-[#00A4B9] bg-[#00A4B9] text-white' : 'border-gray-100 bg-white text-gray-500 hover:bg-[#00A4B9] hover:text-white dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60'}`}
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleShareCopy}
                                    className="flex size-12 cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:bg-[#00A4B9] hover:text-white dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60 dark:hover:bg-[#00A4B9]"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </AnimeReveal>
                    </div>

                    {/* Right Sidebar Column (4 cols) */}
                    <div className="min-w-0 space-y-5">
                        {/* Pengadaan aktif lainnya */}
                        {upcomingProcurements.length > 0 && (
                            <AnimeReveal delay={200} distance={20}>
                                <div className="rounded-2xl border border-[#0d2e2e]/10 bg-white p-5 shadow-xs transition-all duration-500 lg:p-6 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-5 transition-colors duration-500 dark:border-white/5">
                                            <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-white/30">
                                                Pengadaan aktif lainnya
                                            </h3>
                                        </div>
                                        <div className="space-y-5">
                                            {upcomingProcurements.map(
                                                (uItem, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() =>
                                                            router.visit(
                                                                pengadaanDetail.url(
                                                                    {
                                                                        query: {
                                                                            id: uItem.id,
                                                                        },
                                                                    },
                                                                ),
                                                            )
                                                        }
                                                        className="group flex cursor-pointer gap-3"
                                                    >
                                                        <div className="size-14 shrink-0 overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-admin-bg/20 shadow-lg shadow-gray-200/50 dark:border-white/5 dark:shadow-none">
                                                            <img
                                                                src={
                                                                    uItem.imageSrc
                                                                }
                                                                alt={
                                                                    uItem.title
                                                                }
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        'https://placehold.co/100x100/0d2e2e/ffffff?text=PEB';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="line-clamp-2 text-xs leading-tight font-bold text-[#0d2e2e] transition-colors duration-500 group-hover:text-[#00A4B9] dark:text-white dark:group-hover:text-[#2dd4bf]">
                                                                {uItem.title}
                                                            </h4>
                                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-colors duration-500 dark:text-white/40">
                                                                {
                                                                    uItem.startDate
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AnimeReveal>
                        )}

                        {/* Arsip pengadaan Card */}
                        {pastProcurements.length > 0 && (
                            <AnimeReveal delay={300} distance={20}>
                                <div className="rounded-2xl border border-[#0d2e2e]/10 bg-white p-5 shadow-xs transition-all duration-500 lg:p-6 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-5 transition-colors duration-500 dark:border-white/5">
                                            <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-white/30">
                                                Arsip pengadaan
                                            </h3>
                                        </div>
                                        <div className="space-y-5">
                                            {pastProcurements.map(
                                                (pItem, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() =>
                                                            router.visit(
                                                                pengadaanDetail.url(
                                                                    {
                                                                        query: {
                                                                            id: pItem.id,
                                                                        },
                                                                    },
                                                                ),
                                                            )
                                                        }
                                                        className="group flex cursor-pointer gap-3"
                                                    >
                                                        <div className="size-10 flex-shrink-0 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-admin-bg/20 grayscale transition-all duration-500 group-hover:grayscale-0 dark:border-white/5">
                                                            <img
                                                                src={
                                                                    pItem.imageSrc
                                                                }
                                                                alt={
                                                                    pItem.title
                                                                }
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        'https://placehold.co/100x100/0d2e2e/ffffff?text=PEB';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <h4 className="line-clamp-2 text-xs leading-5 font-semibold text-[#0d2e2e] transition-colors duration-500 group-hover:text-[#00A4B9] dark:text-white dark:group-hover:text-[#2dd4bf]">
                                                                {pItem.title}
                                                            </h4>
                                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-colors duration-500 dark:text-white/40">
                                                                {
                                                                    pItem.startDate
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AnimeReveal>
                        )}

                        {/* Contact CTA Sidebar */}
                        <AnimeReveal delay={400} distance={20}>
                            <div className="relative overflow-hidden rounded-2xl bg-[#0d2e2e] p-5 text-white shadow-xs transition-all duration-500 hover:border-[#00A4B9]/30">
                                {/* Decorative circles */}
                                <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/10 blur-2xl" />
                                <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-black/10 blur-3xl" />

                                <div className="relative z-10 space-y-5">
                                    <h3 className="text-base leading-snug font-semibold">
                                        Anda membutuhkan layanan dari kami?
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/80">
                                        Konsultasikan kebutuhan energi dan
                                        pengadaan strategis Anda dengan tim ahli
                                        kami.
                                    </p>
                                    <button
                                        onClick={() => router.visit('/kontak')}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-xs font-semibold text-[#00A4B9] shadow-xl transition-all hover:bg-[#eaf8f9]"
                                    >
                                        <MessageCircle size={20} />
                                        HUBUNGI KAMI
                                    </button>
                                </div>
                            </div>
                        </AnimeReveal>
                    </div>
                </div>
            </div>
        </main>
    );
}
