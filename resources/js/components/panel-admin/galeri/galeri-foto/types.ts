export interface GalleryItem {
    id: string;
    title: string;
    category: string;
    location: string;
    imageSrc: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
}

export const DEFAULT_CATEGORIES = [
    'Enjiniring',
    'Pengadaan',
    'Konstruksi',
    'Instalasi',
    'Operasional',
    'Pemeliharaan',
];

export const defaultItems: GalleryItem[] = [
    {
        id: '1',
        title: 'Perencanaan & Desain Rekayasa Pembangkit',
        category: 'Enjiniring',
        location: 'Batam Center, Kepulauan Riau',
        imageSrc: '/assets/pengadaan/items/item1.png',
    },
    {
        id: '2',
        title: 'Diskusi Cetak Biru & Rencana Pengadaan Strategis',
        category: 'Pengadaan',
        location: 'Kantor Pusat PEB, Batam Center',
        imageSrc: '/assets/beranda/portfolio/2.png',
    },
    {
        id: '3',
        title: 'Konstruksi Struktural Sipil Gardu Hubung',
        category: 'Konstruksi',
        location: 'Kawasan Industri Tanjung Uncang',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
    },
    {
        id: '4',
        title: 'Instalasi Jaringan Pipa Gas Tekanan Tinggi',
        category: 'Instalasi',
        location: 'Kawasan Industri Kabil, Batam',
        imageSrc: '/assets/pengadaan/items/item2.png',
    },
    {
        id: '5',
        title: 'Monitoring Real-Time Ruang Pusat SCADA & IoT',
        category: 'Operasional',
        location: 'Batam Energy Control Center',
        imageSrc: '/assets/pengadaan/items/item5.png',
    },
    {
        id: '6',
        title: 'Pemeriksaan Mekanikal & Kalibrasi Kompresor Gas',
        category: 'Pemeliharaan',
        location: 'Pusat Pembangkit Listrik Panaran',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
    },
];
