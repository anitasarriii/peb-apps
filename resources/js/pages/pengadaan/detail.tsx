import { Head, Link } from '@inertiajs/react';
import FooterSection from '@/components/global/footer-section';
import Navbar from '@/components/global/navbar';
import ProcurementDetailContent from '@/components/pengadaan/detail/procurement-detail-content';
import { pengadaan as pengadaanIndex } from '@/routes';

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
    date?: string;
    endDate: string;
    location: string;
    category: string;
    imageSrc: string;
    deskripsi?: string;
    syaratList?: Syarat[];
    dokumenList?: Dokumen[];
    mapsMode?: 'koordinat' | 'embed';
    mapsKoordinat?: string;
    mapsEmbedUrl?: string;
    mapsLabel?: string;
}

interface DetailProps {
    item: PengadaanItem | null;
    daftarPengadaan?: {
        items: PengadaanItem[];
    } | null;
}

export default function PengadaanDetail({
    item,
    daftarPengadaan,
}: DetailProps) {
    const title = item?.title ?? 'Detail Pengadaan';

    return (
        <div className="min-h-screen bg-[#f7fafb] transition-colors duration-500 dark:bg-[#0a1a1a]">
            <Head title={`${title} - PT Pelayanan Energi Batam`} />

            {/* Hero & Navbar Container */}
            <header className="relative bg-[#0d2e2e] px-5 pt-32 pb-8 sm:px-8 sm:pt-36 lg:px-12 lg:pb-10">
                <Navbar activeLink="Pengadaan" ctaVariant="white" />
                <div className="mx-auto max-w-[1200px]">
                    <Link
                        href={pengadaanIndex()}
                        className="inline-flex min-h-10 items-center text-xs text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        ← Kembali ke Pengadaan
                    </Link>
                    <p className="mt-4 text-[10px] font-semibold tracking-[0.15em] text-[#8ed8dc] uppercase">
                        {item?.isArchived
                            ? 'Arsip pengumuman'
                            : 'Detail pengadaan'}
                    </p>
                    <h1 className="mt-3 max-w-4xl text-xl leading-snug font-semibold text-white sm:text-2xl lg:text-[1.75rem]">
                        {title}
                    </h1>
                    {item && (
                        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-6 text-white/65">
                            <span>
                                {item.isArchived
                                    ? 'Pengumuman'
                                    : 'Mulai pendaftaran'}
                                :{' '}
                                {item.startDate ||
                                    item.date ||
                                    'Belum tersedia'}
                            </span>
                            {!item.isArchived && (
                                <>
                                    <span>
                                        Selesai pendaftaran:{' '}
                                        {item.endDate || 'Belum tersedia'}
                                    </span>
                                    <span>Status: {item.status}</span>
                                </>
                            )}
                            <span>{item.location}</span>
                        </p>
                    )}
                </div>
            </header>

            {/* Main Content Component */}
            <ProcurementDetailContent
                item={item}
                daftarPengadaan={daftarPengadaan}
            />

            <FooterSection />
        </div>
    );
}
