export type StatusType = 'TERBUKA' | 'SELEKSI' | 'TUTUP';

export interface Syarat {
    id: string;
    text: string;
}

export interface Dokumen {
    id: string;
    name: string;
    fileSize: string;
    sourceType: 'url' | 'upload';
    fileUrl: string;
    fileName?: string;
    uploading?: boolean;
}

export interface PengadaanItem {
    id: string;
    title: string;
    status: StatusType;
    isArchived?: boolean;
    startDate: string;
    endDate: string;
    location: string;
    category: string;
    imageSrc: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
    bannerImage?: string;
    bannerPreviewUrl?: string;
    bannerFileName?: string;
    bannerFile?: File | null;

    // Field detail tambahan untuk setiap pengadaan
    deskripsi?: string;
    syaratList?: Syarat[];
    dokumenList?: Dokumen[];
    mapsMode?: 'koordinat' | 'embed';
    mapsKoordinat?: string;
    mapsEmbedUrl?: string;
    mapsLabel?: string;
}

// export const STATUS_OPTIONS: StatusType[] = ['TERBUKA', 'SELEKSI', 'TUTUP'];
export const STATUS_OPTIONS: StatusType[] = ['TERBUKA', 'TUTUP'];

export const DEFAULT_CATEGORIES = [
    'Jasa',
    'Pemeliharaan',
    'IT & Software',
    'Keamanan',
    'Kendaraan',
    'Konsultansi',
];

export const defaultSyarat: Syarat[] = [
    {
        id: '1',
        text: 'Memiliki Surat Izin Usaha Perdagangan (SIUP) yang masih berlaku sesuai dengan bidang pekerjaan.',
    },
    {
        id: '2',
        text: 'Berpengalaman dalam mengerjakan proyek sejenis dalam 5 tahun terakhir.',
    },
];

export const defaultDokumen: Dokumen[] = [
    {
        id: '1',
        name: 'Dokumen Rencana Kerja & Syarat (RKS)',
        fileSize: '12.4 MB',
        sourceType: 'url',
        fileUrl: '/assets/pengadaan/rks.pdf',
    },
];

export const defaultItems: PengadaanItem[] = [
    {
        id: '1',
        title: 'Pengadaan Jasa Pemeliharaan Rutin Pembangkit Listrik Tenaga Gas',
        status: 'TERBUKA',
        startDate: '12 Okt 2023',
        endDate: '25 Okt 2023',
        location: 'PLTG Panaran, Batam',
        category: 'Jasa',
        imageSrc: '/assets/pengadaan/items/item1.png',
        deskripsi:
            'PT Pelayanan Energi Batam mengundang penyedia jasa pemeliharaan turbin gas yang berpengalaman untuk berpartisipasi dalam pemeliharaan rutin guna menjaga keandalan pasokan listrik.',
        syaratList: defaultSyarat,
        dokumenList: defaultDokumen,
        mapsMode: 'koordinat',
        mapsKoordinat: '1.1301,104.0529',
        mapsLabel: 'PLTG Panaran, Batam',
    },
    {
        id: '2',
        title: 'Revitalisasi Sistem Perpipaan Air Pendingin Unit 1 & 2',
        status: 'TERBUKA',
        startDate: '15 Okt 2023',
        endDate: '30 Okt 2023',
        location: 'Batu Ampar, Batam',
        category: 'Pemeliharaan',
        imageSrc: '/assets/pengadaan/items/item2.png',
        deskripsi:
            'Pekerjaan revitalisasi sistem perpipaan air pendingin (cooling water system) untuk meningkatkan efisiensi pendinginan generator pada unit pembangkit 1 & 2.',
        syaratList: defaultSyarat,
        dokumenList: defaultDokumen,
        mapsMode: 'koordinat',
        mapsKoordinat: '1.1500,104.0300',
        mapsLabel: 'Batu Ampar, Batam',
    },
    {
        id: '3',
        title: 'Pengadaan Perangkat Keras & Lisensi Software Monitoring',
        status: 'SELEKSI',
        startDate: '18 Okt 2023',
        endDate: '05 Nov 2023',
        location: 'Kantor Pusat, Batam Center',
        category: 'IT & Software',
        imageSrc: '/assets/pengadaan/items/item3.png',
        deskripsi:
            'Pengadaan infrastruktur monitoring server dan sistem lisensi software terpusat untuk kebutuhan pemantauan jaringan pipa gas secara real-time.',
        syaratList: defaultSyarat,
        dokumenList: defaultDokumen,
        mapsMode: 'koordinat',
        mapsKoordinat: '1.1280,104.0510',
        mapsLabel: 'Kantor Pusat, Batam Center',
    },
];

export const STATUS_STYLE: Record<StatusType, string> = {
    TERBUKA: 'bg-admin-accent/10 text-admin-accent border-admin-accent/30',
    SELEKSI: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    TUTUP: 'bg-admin-border text-admin-text-muted border-admin-border',
};

export function buildMapsEmbedUrl(input?: string): string {
    if (!input) return '';
    if (input.includes('google.com/maps/embed')) return input;
    const coordMatch = input.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
        const [, lat, lng] = coordMatch;
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1id!2sid!4v1`;
    }
    return input;
}
