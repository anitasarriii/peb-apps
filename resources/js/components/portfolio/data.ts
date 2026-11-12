export interface ProjectItem {
    id: string;
    title: string;
    category: string;
    badge: string;
    date: string;
    description: string;
    imageSrc: string;
    client: string;
    location: string;
    efficiency: string;
}

export const projectsData: ProjectItem[] = [
    // Page 1
    {
        id: 'pipeline-expansion',
        title: 'Batam-Pemping Pipeline Expansion',
        category: 'gas',
        badge: 'GAS INFRASTRUCTURE',
        date: '2023',
        description:
            'Peningkatan kapasitas distribusi gas bumi untuk memenuhi kebutuhan industri strategis di seluruh wilayah Batam melalui jalur transmisi bawah laut terintegrasi.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
        client: 'PT Pelayanan Energi Batam',
        location: 'Jalur Pemping - Batam',
        efficiency: 'Efisiensi Aliran 99.8%',
    },
    {
        id: 'solar-farm',
        title: 'Sekupang Solar Farm Phase II',
        category: 'solar',
        badge: 'SOLAR ENERGY',
        date: '2024',
        description:
            'Pengembangan energi surya terintegrasi dengan kapasitas 10MWp untuk menyuplai kelistrikan ramah lingkungan di kawasan perumahan dan perkantoran Sekupang.',
        imageSrc: '/assets/beranda/portfolio/2.png',
        client: 'Batam Green Initiative',
        location: 'Kawasan Sekupang, Batam',
        efficiency: 'Reduksi Karbon 12,000 Ton/Thn',
    },
    {
        id: 'monitoring-system',
        title: 'Integrated Monitoring System',
        category: 'operations',
        badge: 'OPERATIONS',
        date: 'Ongoing',
        description:
            'Implementasi pusat monitoring digital berbasis SCADA terpusat untuk memantau stabilitas distribusi gas dan beban energi listrik secara langsung 24/7.',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
        client: 'PT Pelayanan Energi Batam',
        location: 'Control Center, Batam Center',
        efficiency: 'Uptime Sistem SCADA 99.99%',
    },
    {
        id: 'gas-fired-station',
        title: 'Panbil Gas-Fired Station',
        category: 'power',
        badge: 'POWER PLANT',
        date: '2022',
        description:
            'Optimalisasi pembangkit listrik tenaga gas bumi yang bersih dan efisien guna menunjang pertumbuhan konsumsi listrik industri manufaktur berat.',
        imageSrc: '/assets/pengadaan/items/item4.png',
        client: 'Kawasan Industri Panbil',
        location: 'Panbil Industrial Estate, Batam',
        efficiency: 'Kapasitas Output 50 MW',
    },
    {
        id: 'safety-audit',
        title: 'Safety Integrity Level Audit',
        category: 'operations',
        badge: 'OPERATIONS',
        date: '2023',
        description:
            'Program berkala audit keselamatan tingkat lanjut pada fasilitas pipa gas tekanan tinggi dan stasiun katup guna memastikan mitigasi risiko terbaik.',
        imageSrc: '/assets/beranda/portfolio/3.png',
        client: 'Direktorat Jenderal Migas',
        location: 'Seluruh Jaringan Pipa Batam',
        efficiency: 'Skor Kepatuhan K3 100%',
    },
    {
        id: 'receiving-hub',
        title: 'Tanjung Uncang Receiving Hub',
        category: 'gas',
        badge: 'GAS INFRASTRUCTURE',
        date: '2021',
        description:
            'Fasilitas penerimaan dan distribusi gas bumi pusat yang menghubungkan pasokan energi utama ke pipa-pipa penyalur industri di wilayah Tanjung Uncang.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
        client: 'Asosiasi Industri Tanjung Uncang',
        location: 'Tanjung Uncang, Batam',
        efficiency: 'Volume Penyaluran 80 MMSCFD',
    },
    // Page 2
    {
        id: 'kabil-transmission',
        title: 'Kabil Gas Transmission Line',
        category: 'gas',
        badge: 'GAS INFRASTRUCTURE',
        date: '2022',
        description:
            'Instalasi jalur transmisi gas bawah tanah modern di sepanjang koridor industri Kabil untuk mendukung kebutuhan boiler industri kimia.',
        imageSrc: '/assets/beranda/portfolio/2.png',
        client: 'Kawasan Industri Kabil',
        location: 'Kabil, Batam',
        efficiency: 'Tekanan Pipa 350 Psi',
    },
    {
        id: 'floating-solar',
        title: 'Tembesi Floating Solar Study',
        category: 'solar',
        badge: 'SOLAR ENERGY',
        date: '2025',
        description:
            'Studi kelayakan teknis dan lingkungan pembangunan panel surya terapung di Waduk Tembesi guna memaksimalkan potensi area permukaan air waduk.',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
        client: 'Badan Pengusahaan Batam',
        location: 'Waduk Tembesi, Batam',
        efficiency: 'Proyeksi Output 15MWp',
    },
    {
        id: 'scada-upgrade',
        title: 'SCADA Infrastructure Upgrade',
        category: 'operations',
        badge: 'OPERATIONS',
        date: '2023',
        description:
            'Pembaruan arsitektur transmisi data SCADA dengan sensor nirkabel terenkripsi berkecepatan tinggi pada seluruh stasiun katup distribusi gas.',
        imageSrc: '/assets/pengadaan/items/item4.png',
        client: 'PT Pelayanan Energi Batam',
        location: 'Seluruh Stasiun Katup Batam',
        efficiency: 'Latensi Transmisi < 100ms',
    },
];
