import { useCmsSave } from '@/hooks/use-cms-save';
import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { update as updateSeo } from '@/routes/panel-admin/seo-meta';
import {
    Search,
    Share2,
    Settings,
    Globe,
    Eye,
    Save,
    RotateCcw,
    CheckCircle2,
    ImageIcon,
    Link as LinkIcon,
    Info,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';

export interface SeoMetaItem {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    author: string;
    robots_index: 'index' | 'noindex';
    robots_follow: 'follow' | 'nofollow';
    og_title: string;
    og_description: string;
    og_image: string;
    image_source_type: 'url' | 'upload';
    image_file_name: string;
}

interface SeoEditorProps {
    pageTitle: string;
    pageType:
        | 'beranda'
        | 'tentang'
        | 'servis'
        | 'kebijakan'
        | 'galeri'
        | 'laporan'
        | 'pengadaan'
        | 'portfolio'
        | 'berita'
        | 'kontak';
    seoData?: SeoMetaItem;
}

export default function SeoEditor({
    pageTitle,
    pageType,
    seoData,
}: SeoEditorProps) {
    // Helper function untuk mendapatkan default values berdasarkan pageType
    const getDefaultMetaTitle = () => {
        switch (pageType) {
            case 'beranda':
                return 'PT Pelayanan Energi Batam | Penyedia Solusi Energi Terintegrasi';
            case 'tentang':
                return 'Tentang Kami | PT Pelayanan Energi Batam';
            case 'servis':
                return 'Layanan Servis | PT Pelayanan Energi Batam';
            case 'kebijakan':
                return 'Kebijakan Korporat | PT Pelayanan Energi Batam';
            case 'galeri':
                return 'Galeri Dokumentasi | PT Pelayanan Energi Batam';
            case 'laporan':
                return 'Laporan & Publikasi | PT Pelayanan Energi Batam';
            case 'pengadaan':
                return 'Pengadaan & Tender | PT Pelayanan Energi Batam';
            case 'portfolio':
                return 'Portofolio Proyek | PT Pelayanan Energi Batam';
            case 'berita':
                return 'Berita & Acara | PT Pelayanan Energi Batam';
            default:
                return '';
        }
    };

    const getDefaultMetaDescription = () => {
        switch (pageType) {
            case 'beranda':
                return 'PT Pelayanan Energi Batam (PEB) berkomitmen menyediakan energi yang andal, inovatif, dan berkelanjutan. Temukan informasi produk, inovasi, dan layanan kami.';
            case 'tentang':
                return 'Kenali lebih dekat PT Pelayanan Energi Batam, visi misi kami untuk memberikan layanan energi kelas dunia, serta profil tim kepemimpinan kami.';
            case 'servis':
                return 'Jelajahi layanan servis lengkap PT Pelayanan Energi Batam: Enjiniring, Pengadaan, Konstruksi, Instalasi, Operasional, dan Pemeliharaan.';
            case 'kebijakan':
                return 'PT Pelayanan Energi Batam berkomitmen menjalankan tata kelola perusahaan yang bersih, aman, berintegritas, dan selaras dengan standar internasional.';
            case 'galeri':
                return 'Eksplorasi dokumentasi visual komprehensif dari fasilitas, teknologi modern, serta keterlibatan aktif tim ahli PT Pelayanan Energi Batam.';
            case 'laporan':
                return 'Dokumentasi pertanggungjawaban publik, laporan tahunan, laporan keuangan audit, serta komitmen transparansi tata kelola PT Pelayanan Energi Batam.';
            case 'pengadaan':
                return 'Informasi tender dan pengadaan barang/jasa PT Pelayanan Energi Batam. Temukan peluang kerjasama dan daftar pengadaan terbuka.';
            case 'portfolio':
                return 'Rekam jejak proyek infrastruktur energi kritis, enjiniring kelas dunia, dan pengadaan strategis PT Pelayanan Energi Batam di Batam.';
            case 'berita':
                return 'Ikuti perkembangan terbaru, proyek strategis, dan pencapaian PT Pelayanan Energi Batam secara berkala.';
            default:
                return '';
        }
    };

    const getDefaultOgTitle = () => {
        switch (pageType) {
            case 'beranda':
                return 'PT Pelayanan Energi Batam | Energi Bagi Negeri';
            case 'tentang':
                return 'Tentang Kami - PT Pelayanan Energi Batam';
            case 'servis':
                return 'Layanan Servis - PT Pelayanan Energi Batam';
            case 'kebijakan':
                return 'Kebijakan Korporat - PT Pelayanan Energi Batam';
            case 'galeri':
                return 'Galeri Dokumentasi - PT Pelayanan Energi Batam';
            case 'laporan':
                return 'Laporan & Publikasi - PT Pelayanan Energi Batam';
            case 'pengadaan':
                return 'Pengadaan & Tender - PT Pelayanan Energi Batam';
            case 'portfolio':
                return 'Portofolio Proyek - PT Pelayanan Energi Batam';
            case 'berita':
                return 'Berita & Acara - PT Pelayanan Energi Batam';
            default:
                return '';
        }
    };

    const getDefaultOgDescription = () => {
        switch (pageType) {
            case 'beranda':
                return 'Penyedia infrastruktur dan solusi energi terintegrasi terpercaya di Batam.';
            case 'tentang':
                return 'Transformasi berkelanjutan PT Pelayanan Energi Batam menuju penyedia energi hijau.';
            case 'servis':
                return 'Solusi servis energi profesional dengan tim ahli berpengalaman di bidang enjiniring, konstruksi, dan operasional.';
            case 'kebijakan':
                return 'Komitmen tata kelola perusahaan yang transparan, berintegritas, dan sesuai standar ISO internasional.';
            case 'galeri':
                return 'Dokumentasi visual fasilitas dan kegiatan operasional PT Pelayanan Energi Batam di Batam.';
            case 'laporan':
                return 'Laporan keuangan, laporan tahunan, dan publikasi resmi PT Pelayanan Energi Batam untuk transparansi publik.';
            case 'pengadaan':
                return 'Daftar tender dan pengadaan terbuka PT Pelayanan Energi Batam. Bergabunglah sebagai mitra pengadaan kami.';
            case 'portfolio':
                return 'Jelajahi portofolio proyek energi PT Pelayanan Energi Batam: gas infrastructure, solar energy, power plant, dan operations.';
            case 'berita':
                return 'Ikuti perkembangan terbaru, proyek strategis, dan pencapaian PT Pelayanan Energi Batam secara berkala.';
            default:
                return '';
        }
    };

    // State form
    const [metaTitle, setMetaTitle] = useState(
        seoData?.meta_title ?? getDefaultMetaTitle(),
    );
    const [metaDescription, setMetaDescription] = useState(
        seoData?.meta_description ?? getDefaultMetaDescription(),
    );
    const [metaKeywords, setMetaKeywords] = useState(
        seoData?.meta_keywords ??
            'energi batam, peb, pelayanan energi batam, energi terbarukan, gas batam, pln group',
    );
    const [author, setAuthor] = useState(
        seoData?.author ?? 'PT Pelayanan Energi Batam',
    );
    const [robotsIndex, setRobotsIndex] = useState<'index' | 'noindex'>(
        (seoData?.robots_index as 'index' | 'noindex') ?? 'index',
    );
    const [robotsFollow, setRobotsFollow] = useState<'follow' | 'nofollow'>(
        (seoData?.robots_follow as 'follow' | 'nofollow') ?? 'follow',
    );

    // Open Graph state
    const [ogTitle, setOgTitle] = useState(
        seoData?.og_title ?? getDefaultOgTitle(),
    );
    const [ogDescription, setOgDescription] = useState(
        seoData?.og_description ?? getDefaultOgDescription(),
    );
    const [ogImage, setOgImage] = useState(
        seoData?.og_image ?? '/assets/beranda/about/about.png',
    );
    const [imageSourceType, setImageSourceType] = useState<'url' | 'upload'>(
        (seoData?.image_source_type as 'url' | 'upload') ?? 'url',
    );
    const [imageFileName, setImageFileName] = useState(
        seoData?.image_file_name ?? '',
    );
    const [ogFile, setOgFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<'meta' | 'og'>('meta');
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);

    const handleReset = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setMetaTitle(getDefaultMetaTitle());
        setMetaDescription(getDefaultMetaDescription());
        setMetaKeywords(
            'energi batam, peb, pelayanan energi batam, energi terbarukan, gas batam, pln group',
        );
        setAuthor('PT Pelayanan Energi Batam');
        setRobotsIndex('index');
        setRobotsFollow('follow');

        setOgTitle(getDefaultOgTitle());
        setOgDescription(getDefaultOgDescription());
        setOgImage('/assets/beranda/about/about.png');
        setImageSourceType('url');
        setImageFileName('');
        setImagePreviewUrl('');
        setOgFile(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadingImage(true);

        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }

        const localUrl = URL.createObjectURL(file);
        setOgImage(localUrl);
        setImagePreviewUrl(localUrl);
        setImageFileName(file.name);
        setOgFile(file);
        setUploadingImage(false);
    };

    const triggerImageSelect = () => {
        imageInputRef.current?.click();
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('meta_title', metaTitle);
        formData.append('meta_description', metaDescription);
        formData.append('meta_keywords', metaKeywords || '');
        formData.append('author', author || '');
        formData.append('robots_index', robotsIndex);
        formData.append('robots_follow', robotsFollow);
        formData.append('og_title', ogTitle);
        formData.append('og_description', ogDescription);
        formData.append('image_source_type', imageSourceType);
        formData.append('og_image', ogImage || '');
        formData.append('image_file_name', imageFileName || '');

        if (imageSourceType === 'upload' && ogFile) {
            formData.append('og_file', ogFile);
        }

        router.post(updateSeo.url({ page_type: pageType }), formData as any, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('Save failed:', err);
                const errorMsg = Object.values(err).join('\n');
                alert(
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol (Kiri) */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Pengaturan SEO - {pageTitle}
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Konfigurasikan metadata pencarian Google
                                        dan Open Graph halaman.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs Form */}
                        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('meta')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeTab === 'meta'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Globe size={13} />
                                Metadata Dasar
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('og')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeTab === 'og'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Share2 size={13} />
                                Open Graph (Medsos)
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {activeTab === 'meta' && (
                                <div className="space-y-5">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Meta Title
                                            </label>
                                            <span
                                                className={cn(
                                                    'text-[10px] font-bold',
                                                    metaTitle.length > 60
                                                        ? 'text-amber-500'
                                                        : 'text-emerald-400',
                                                )}
                                            >
                                                {metaTitle.length} / 60 Karakter
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            value={metaTitle}
                                            onChange={(e) =>
                                                setMetaTitle(e.target.value)
                                            }
                                            maxLength={70}
                                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="Masukkan judul meta halaman..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Meta Description
                                            </label>
                                            <span
                                                className={cn(
                                                    'text-[10px] font-bold',
                                                    metaDescription.length > 160
                                                        ? 'text-amber-500'
                                                        : 'text-emerald-400',
                                                )}
                                            >
                                                {metaDescription.length} / 160
                                                Karakter
                                            </span>
                                        </div>
                                        <textarea
                                            value={metaDescription}
                                            onChange={(e) =>
                                                setMetaDescription(
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={200}
                                            rows={4}
                                            className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="Masukkan deskripsi ringkas halaman..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Meta Keywords (Pisahkan dengan koma)
                                        </label>
                                        <input
                                            type="text"
                                            value={metaKeywords}
                                            onChange={(e) =>
                                                setMetaKeywords(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="E.g. energi, batam, peb, gas"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Author
                                            </label>
                                            <input
                                                type="text"
                                                value={author}
                                                onChange={(e) =>
                                                    setAuthor(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                                placeholder="Nama Pembuat"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Robots Index
                                            </label>
                                            <div className="flex rounded-xl border border-admin-border/60 bg-admin-bg p-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRobotsIndex('index')
                                                    }
                                                    className={cn(
                                                        'flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold uppercase transition-all duration-200',
                                                        robotsIndex === 'index'
                                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    Index
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRobotsIndex(
                                                            'noindex',
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold uppercase transition-all duration-200',
                                                        robotsIndex ===
                                                            'noindex'
                                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    NoIndex
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Robots Follow
                                            </label>
                                            <div className="flex rounded-xl border border-admin-border/60 bg-admin-bg p-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRobotsFollow(
                                                            'follow',
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold uppercase transition-all duration-200',
                                                        robotsFollow ===
                                                            'follow'
                                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    Follow
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRobotsFollow(
                                                            'nofollow',
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold uppercase transition-all duration-200',
                                                        robotsFollow ===
                                                            'nofollow'
                                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    NoFollow
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'og' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Open Graph Title (Medsos Share)
                                        </label>
                                        <input
                                            type="text"
                                            value={ogTitle}
                                            onChange={(e) =>
                                                setOgTitle(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="Masukkan judul share media sosial..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Open Graph Description
                                        </label>
                                        <textarea
                                            value={ogDescription}
                                            onChange={(e) =>
                                                setOgDescription(e.target.value)
                                            }
                                            rows={3}
                                            className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="Masukkan deskripsi share media sosial..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Gambar Share Medsos (OG Image)
                                            </label>
                                            <div className="flex gap-2 rounded-lg border border-admin-border/60 bg-admin-bg p-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setImageSourceType(
                                                            'url',
                                                        )
                                                    }
                                                    className={cn(
                                                        'cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-black uppercase transition-all duration-200',
                                                        imageSourceType ===
                                                            'url'
                                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    Tautan URL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setImageSourceType(
                                                            'upload',
                                                        )
                                                    }
                                                    className={cn(
                                                        'cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-black uppercase transition-all duration-200',
                                                        imageSourceType ===
                                                            'upload'
                                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    Unggah File
                                                </button>
                                            </div>
                                        </div>

                                        {imageSourceType === 'url' ? (
                                            <input
                                                type="text"
                                                value={ogImage}
                                                onChange={(e) =>
                                                    setOgImage(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 font-mono text-sm text-xs font-medium text-admin-text outline-hidden transition-all duration-300 hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                                placeholder="https://..."
                                            />
                                        ) : (
                                            <div className="space-y-3">
                                                <div
                                                    onClick={triggerImageSelect}
                                                    className="group/upload flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg p-6 transition-all duration-300 hover:border-admin-accent/40"
                                                >
                                                    <input
                                                        type="file"
                                                        ref={imageInputRef}
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                    {uploadingImage ? (
                                                        <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                                            <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                            Memproses file
                                                            gambar...
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/5 text-admin-accent/60 transition-all duration-300 group-hover/upload:scale-110 group-hover/upload:bg-admin-accent/10 group-hover/upload:text-admin-accent">
                                                                <ImageIcon
                                                                    size={20}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-admin-text">
                                                                {imageFileName
                                                                    ? `Terpilih: ${imageFileName}`
                                                                    : 'Klik untuk memilih berkas gambar'}
                                                            </p>
                                                            <p className="text-[10px] font-semibold tracking-wider text-admin-text-muted uppercase">
                                                                Format: PNG,
                                                                JPG, WEBP (Max
                                                                2MB)
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                {imageFileName &&
                                                    !uploadingImage && (
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                            <CheckCircle2
                                                                size={12}
                                                            />
                                                            File {imageFileName}{' '}
                                                            berhasil dimuat
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tombol Aksi */}
                            <div className="flex gap-4 border-t border-admin-border pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                                >
                                    <RotateCcw size={16} />
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-lg shadow-admin-primary/20 transition-all duration-300 active:scale-[0.98]',
                                        isSaving
                                            ? 'cursor-not-allowed bg-admin-primary/60'
                                            : 'bg-admin-primary hover:bg-admin-accent',
                                    )}
                                >
                                    {isSaving ? (
                                        <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {isSaving
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </AnimeReveal>
            </div>

            {/* Live Preview (Kanan) */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <div className="group relative flex h-[650px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Tampilan SEO
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Live Mockup
                            </span>
                        </div>

                        {/* Google Search Mockup */}
                        {activeTab === 'meta' ? (
                            <div className="custom-scrollbar flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-[2rem] border border-admin-border bg-[#171717] p-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                                    <Search
                                        size={12}
                                        className="text-zinc-500"
                                    />
                                    Hasil Penelusuran Google (Mockup)
                                </div>
                                <div className="space-y-2.5 rounded-xl border border-zinc-800 bg-black/40 p-5">
                                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                        <Globe size={11} />
                                        <span>peb.co.id</span>
                                        <span>›</span>
                                        <span className="max-w-[150px] truncate">
                                            {pageType}
                                        </span>
                                    </div>
                                    <h4 className="cursor-pointer text-[15px] leading-tight font-semibold text-[#8ab4f8] hover:underline">
                                        {metaTitle || 'Tanpa Judul Meta'}
                                    </h4>
                                    <p className="text-xs leading-relaxed font-medium break-words text-zinc-300">
                                        {metaDescription ||
                                            'Silakan masukkan deskripsi meta untuk melihat pratinjau halaman ini pada hasil mesin pencari Google...'}
                                    </p>
                                </div>
                                <div className="mt-4 space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 text-[10px] text-zinc-400">
                                    <div className="flex items-start gap-2">
                                        <Info
                                            size={13}
                                            className="mt-0.5 shrink-0 text-zinc-500"
                                        />
                                        <div>
                                            <p className="mb-0.5 font-bold tracking-wider text-zinc-300 uppercase">
                                                Rekomendasi SEO Google:
                                            </p>
                                            <ul className="mt-1 list-inside list-disc space-y-1 font-medium">
                                                <li>
                                                    Judul Meta idealnya berkisar
                                                    antara{' '}
                                                    <span className="text-emerald-400">
                                                        50 - 60 karakter
                                                    </span>
                                                    .
                                                </li>
                                                <li>
                                                    Deskripsi Meta idealnya
                                                    berkisar antara{' '}
                                                    <span className="text-emerald-400">
                                                        120 - 160 karakter
                                                    </span>
                                                    .
                                                </li>
                                                <li>
                                                    Robots tag disetel ke{' '}
                                                    <span className="text-emerald-400">
                                                        {robotsIndex},{' '}
                                                        {robotsFollow}
                                                    </span>
                                                    .
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Social Media Share Mockup */
                            <div className="custom-scrollbar flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-[2rem] border border-admin-border bg-zinc-900 p-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                                    <Share2
                                        size={12}
                                        className="text-zinc-500"
                                    />
                                    Facebook & LinkedIn Share Preview
                                </div>

                                <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-black/50">
                                    <div className="relative aspect-[1.91/1] w-full overflow-hidden border-b border-zinc-800 bg-zinc-950">
                                        <img
                                            src={ogImage}
                                            alt="Pratinjau Gambar Open Graph"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1.5 bg-[#1e1e1e] p-4 text-left">
                                        <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
                                            PEB.CO.ID
                                        </span>
                                        <h4 className="line-clamp-1 text-xs font-bold text-zinc-200">
                                            {ogTitle || 'Judul Open Graph'}
                                        </h4>
                                        <p className="line-clamp-2 text-[10px] leading-relaxed text-zinc-400">
                                            {ogDescription ||
                                                'Deskripsi Open Graph...'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 text-[10px] text-zinc-400">
                                    <div className="flex items-start gap-2">
                                        <Info
                                            size={13}
                                            className="mt-0.5 shrink-0 text-zinc-500"
                                        />
                                        <div>
                                            <p className="mb-0.5 font-bold tracking-wider text-zinc-300 uppercase">
                                                Rekomendasi Open Graph:
                                            </p>
                                            <ul className="mt-1 list-inside list-disc space-y-1 font-medium">
                                                <li>
                                                    Rasio gambar ideal adalah{' '}
                                                    <span className="text-emerald-400">
                                                        1.91:1
                                                    </span>{' '}
                                                    (Contoh: 1200 x 630 piksel).
                                                </li>
                                                <li>
                                                    Pastikan meta tag OG aktif
                                                    agar tampilan link share
                                                    terlihat profesional di
                                                    WhatsApp, Facebook, dan
                                                    Telegram.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>SEO PREVIEW ENGINE</span>
                            <span>REAL-TIME GRAPHIC</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            {/* Notification Toast */}
            {showToast && (
                <div className="animate-slide-in fixed right-8 bottom-8 z-9999 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-admin-card p-4 pr-6 shadow-2xl">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-admin-text">
                            Berhasil Disimpan!
                        </h4>
                        <p className="text-[10px] text-admin-text-muted">
                            Konfigurasi SEO Halaman berhasil disimpan.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
