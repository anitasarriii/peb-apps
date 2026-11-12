export interface GalleryItem {
    id: number;
    title: string;
    category: string;
    location: string;
    imageSrc: string;
}

export const galleryData: GalleryItem[] = [
    {
        id: 1,
        title: 'Peringatan HUT Kemerdekaan RI ke-79 di Lingkungan PT Pelayanan Energi Batam',
        category: 'Kegiatan Perusahaan',
        location: 'Gedung Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-2.png',
    },
    {
        id: 2,
        title: 'Upacara Peringatan Hari Kemerdekaan RI di Kantor PLN Batam',
        category: 'Kegiatan Perusahaan',
        location: 'Kantor Pusat PLN Batam',
        imageSrc: '/storage/galeri-foto/photo-3.png',
    },
    {
        id: 3,
        title: 'Rapat CoC Departemen Operasi & Business Development PT PEB',
        category: 'Operasional & K3',
        location: 'Ruang Rapat Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-4.png',
    },
    {
        id: 4,
        title: 'Perayaan Hari Ulang Tahun (HUT) ke-10 PT Pelayanan Energi Batam',
        category: 'Kegiatan Perusahaan',
        location: 'Graha Energi, Tanjung Uncang, Batam',
        imageSrc: '/storage/galeri-foto/photo-5.JPG',
    },
    {
        id: 5,
        title: 'Internalisasi Budaya Perusahaan & Yel-Yel AKHLAK PT PEB',
        category: 'Operasional & K3',
        location: 'Ruang Rapat Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-7.png',
    },
    {
        id: 6,
        title: 'Foto Bersama Manajemen & Karyawan pada Peringatan HUT ke-10 PT PEB',
        category: 'Kegiatan Perusahaan',
        location: 'Graha Energi, Tanjung Uncang, Batam',
        imageSrc: '/storage/galeri-foto/photo-8.png',
    },
    {
        id: 7,
        title: 'Semarak Kebersamaan Karyawan PT PEB dalam Rangkaian HUT RI ke-79',
        category: 'Kegiatan Perusahaan',
        location: 'Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-9.png',
    },
    {
        id: 8,
        title: 'Pengarahan Komitmen K3 & Safety Leadership Manajemen PT PEB',
        category: 'Operasional & K3',
        location: 'Ruang Rapat Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-12.png',
    },
    {
        id: 9,
        title: 'Diskusi & Kolaborasi Tim Perencanaan Strategis PEB',
        category: 'Strategi & Manajemen',
        location: 'Ruang Rapat Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-14.png',
    },
    {
        id: 10,
        title: 'Focus Group Discussion (FGD) Penyusunan RJPP PT PEB Tahun 2024-2028',
        category: 'Strategi & Manajemen',
        location: 'Gedung Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-15.png',
    },
    {
        id: 11,
        title: 'Sesi Foto Bersama Peserta FGD Penyusunan RJPP 2024-2028',
        category: 'Strategi & Manajemen',
        location: 'Gedung Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-16.png',
    },
    {
        id: 12,
        title: 'Penyerahan Plakat Penghargaan kepada Narasumber FGD RJPP',
        category: 'Strategi & Manajemen',
        location: 'Gedung Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-17.png',
    },
    {
        id: 13,
        title: 'Rapat Koordinasi Teknis Proyek Infrastruktur Kelistrikan',
        category: 'Operasional & K3',
        location: 'Ruang Rapat Graha Energi, Batam',
        imageSrc: '/storage/galeri-foto/photo-18.png',
    },
    {
        id: 14,
        title: 'Acara Pisah Sambut Direktur PT Pelayanan Energi Batam',
        category: 'Kegiatan Perusahaan',
        location: 'Graha Energi, Tanjung Uncang, Batam',
        imageSrc: '/storage/galeri-foto/photo-19.png',
    },
    {
        id: 15,
        title: 'Penandatanganan Berita Acara Serah Terima Jabatan Direksi PT PEB',
        category: 'Strategi & Manajemen',
        location: 'Graha Energi, Tanjung Uncang, Batam',
        imageSrc: '/storage/galeri-foto/photo-21.png',
    },
    {
        id: 16,
        title: 'Peringatan Hari Kartini Srikandi PT Pelayanan Energi Batam',
        category: 'Kegiatan Perusahaan',
        location: 'Batam, Kepulauan Riau',
        imageSrc: '/storage/galeri-foto/photo-22.jpg',
    },
];

export const categories = [
    'Semua',
    'Kegiatan Perusahaan',
    'Operasional & K3',
    'Strategi & Manajemen',
];
