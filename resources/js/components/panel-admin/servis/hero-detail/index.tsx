import { useCmsSave } from '@/hooks/use-cms-save';
import { router } from '@inertiajs/react';
import {
    Wrench,
    Plus,
    Trash2,
    RotateCcw,
    Save,
    FileVideo,
    FileImage,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import SmartVideo from '@/components/global/smart-media';
import { detectMediaType, resolveImageUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import { update as updateHeroDetailServis } from '@/routes/panel-admin/servis/hero-detail-section';
import SlideItemEditor from '../hero/slide-item-editor';
import SearchableSelect from '../hero/searchable-select';
import AdminToast from '@/components/panel-admin/admin-toast';

// ─── Tipe data ────────────────────────────────────────────────────────────────
interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
    previewUrl?: string;
    file?: File;
    positionX?: number;
    positionY?: number;
    scale?: number;
    [key: string]: unknown;
}

interface HeroDetailServisProps {
    heroServisDetail?: {
        id?: number;
        title: string;
        subtitle: string;
        badge_label: string;
        carousel_items: CarouselItem[];
        updated_at?: string;
    } | null;
    heroServisDetailUserId?: number;
    adminUsers?: { id: number; name: string; email: string }[];
}

// ─── Nilai default fallback ───────────────────────────────────────────────────
const DEFAULT_TITLE = 'Detail Servis';
const DEFAULT_SUBTITLE =
    'Informasi lengkap mengenai kategori layanan energi PT Pelayanan Energi Batam.';
const DEFAULT_BADGE = 'Servis';
const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/servis/hero/banner_service.jpg',
    },
];

export default function HeroDetailServisEditor({
    heroServisDetail,
    heroServisDetailUserId,
    adminUsers,
}: HeroDetailServisProps) {
    // ── State form utama ──────────────────────────────────────────────────────
    const [title, setTitle] = useState(
        heroServisDetail?.title ?? DEFAULT_TITLE,
    );
    const [subtitle, setSubtitle] = useState(
        heroServisDetail?.subtitle ?? DEFAULT_SUBTITLE,
    );
    const [badgeLabel, setBadgeLabel] = useState(
        heroServisDetail?.badge_label ?? DEFAULT_BADGE,
    );

    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(() => {
        if (
            heroServisDetail?.carousel_items &&
            heroServisDetail.carousel_items.length > 0
        ) {
            return heroServisDetail.carousel_items;
        }
        return DEFAULT_SLIDES;
    });

    const [activeEditIndex, setActiveEditIndex] = useState<number>(0);
    const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
    const [isSaving, setIsSaving] = useCmsSave();
    const [uploadProgress, setUploadProgress] = useState<
        Record<string, number>
    >({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Toast notification ────────────────────────────────────────────────────
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Hero Detail Servis telah diperbarui.',
    );

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // ── Sinkronisasi tab edit ↔ preview ───────────────────────────────────────
    useEffect(() => {
        setActivePreviewIndex(activeEditIndex);
    }, [activeEditIndex]);

    useEffect(() => {
        setActiveEditIndex(activePreviewIndex);
    }, [activePreviewIndex]);

    // ── Super Admin: switching situs user melalui server-side navigation ─────
    const handleSearchChange = (query: string) => {
        router.get(
            '/panel-admin',
            {
                tab: 'Hero Detail Servis',
                user_id: heroServisDetailUserId,
                user_search: query,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['adminUsers'],
            },
        );
    };

    const handleUserChange = (targetUserId: number) => {
        router.get(
            '/panel-admin',
            { tab: 'Hero Detail Servis', user_id: targetUserId },
            { preserveState: true, preserveScroll: true },
        );
    };

    // ── Reset ke nilai dari database (atau default jika belum ada) ────────────
    const handleReset = () => {
        carouselItems.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl as string);
        });

        setTitle(heroServisDetail?.title ?? DEFAULT_TITLE);
        setSubtitle(heroServisDetail?.subtitle ?? DEFAULT_SUBTITLE);
        setBadgeLabel(heroServisDetail?.badge_label ?? DEFAULT_BADGE);
        setCarouselItems(
            heroServisDetail?.carousel_items?.length
                ? heroServisDetail.carousel_items
                : DEFAULT_SLIDES,
        );
        setActiveEditIndex(0);
        setActivePreviewIndex(0);
    };

    // ── Tambah slide baru ─────────────────────────────────────────────────────
    const handleAddSlide = () => {
        const newSlide: CarouselItem = {
            id: `slide-${Date.now()}`,
            type: 'image',
            sourceType: 'url',
            url: '/assets/servis/hero/banner_service.jpg',
        };
        setCarouselItems((prev) => [...prev, newSlide]);
        setActiveEditIndex(carouselItems.length);
        setActivePreviewIndex(carouselItems.length);
    };

    // ── Hapus slide ───────────────────────────────────────────────────────────
    const handleDeleteSlide = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (carouselItems.length <= 1) {
            alert('Minimal harus memiliki 1 media latar belakang.');
            return;
        }

        const itemToRemove = carouselItems[index];
        if (itemToRemove?.previewUrl)
            URL.revokeObjectURL(itemToRemove.previewUrl as string);

        const newItems = carouselItems.filter((_, idx) => idx !== index);
        setCarouselItems(newItems);
        setActiveEditIndex((prev) =>
            prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1),
        );
        setActivePreviewIndex((prev) =>
            prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1),
        );
    };

    // ── Perbarui satu field pada item carousel ────────────────────────────────
    const updateCarouselItem = (
        index: number,
        key: keyof CarouselItem,
        value: unknown,
    ) => {
        setCarouselItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [key]: value };
            return updated;
        });
    };

    // ── Proses pemilihan file lokal (preview sementara) ───────────────────────
    const handleFileChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validasi ukuran maksimal 500 MB
        const maxSizeBytes = 500 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            triggerToast(
                'error',
                'Ukuran berkas terlalu besar! Maksimal 500 MB.',
            );
            e.target.value = '';
            return;
        }

        const itemId = carouselItems[index].id;
        const fileType = file.type.startsWith('video/') ? 'video' : 'image';

        if (carouselItems[index].previewUrl) {
            URL.revokeObjectURL(carouselItems[index].previewUrl as string);
        }

        const localUrl = URL.createObjectURL(file);
        setUploadProgress((prev) => ({ ...prev, [itemId]: 0 }));

        updateCarouselItem(index, 'url', localUrl);
        updateCarouselItem(index, 'previewUrl', localUrl);
        updateCarouselItem(index, 'fileName', file.name);
        updateCarouselItem(index, 'type', fileType);
        updateCarouselItem(index, 'file', file);
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    // ── Simpan ke backend via Inertia (forceFormData untuk file upload) ────────
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            updateHeroDetailServis.url(),
            {
                title,
                subtitle,
                badge_label: badgeLabel,
                carousel_items: carouselItems as any,
                user_id: heroServisDetailUserId,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    triggerToast(
                        'success',
                        'Hero Detail Servis berhasil diperbarui.',
                    );
                },
                onError: (err) => {
                    setIsSaving(false);
                    console.error('[HeroDetailServis] Save error:', err);
                    const errorMsg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                    );
                },
            },
        );
    };

    const currentEditItem = carouselItems[activeEditIndex] || carouselItems[0];
    const activePreviewSlide =
        carouselItems[activePreviewIndex] || carouselItems[0];

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol (Kiri) */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header */}
                        <div className="mb-8 flex flex-col gap-4 border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 animate-pulse items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Wrench size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Hero Detail Servis
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Kelola judul, sub-judul, dan banner latar
                                        halaman detail layanan (kategori spesifik).
                                    </p>
                                </div>
                            </div>

                            {/* Dropdown switching situs user — hanya tampil untuk Super Admin */}
                            {adminUsers && (
                                <div className="flex w-fit items-center gap-3 rounded-xl border border-admin-border bg-admin-bg p-1.5">
                                    <span className="shrink-0 px-2 text-[10px] font-bold text-admin-text-muted uppercase">
                                        Situs User:
                                    </span>
                                    <SearchableSelect
                                        value={heroServisDetailUserId}
                                        options={adminUsers}
                                        onChange={handleUserChange}
                                        onSearchChange={handleSearchChange}
                                        placeholder="Cari situs user..."
                                    />
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Input Informasi Teks */}
                            <div className="space-y-4">
                                {/* Badge Label */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Label Badge / Kategori
                                    </label>
                                    <input
                                        type="text"
                                        value={badgeLabel}
                                        onChange={(e) => setBadgeLabel(e.target.value)}
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Servis"
                                    />
                                </div>

                                {/* Judul */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Hero
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Detail Servis"
                                        required
                                    />
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Subtitle / Deskripsi
                                    </label>
                                    <textarea
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        rows={4}
                                        className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Informasi lengkap mengenai kategori layanan energi..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* SECTION CAROUSEL MEDIA EDITOR */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Slide Media Latar Belakang ({carouselItems.length})
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleAddSlide}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all duration-300 hover:bg-admin-accent hover:text-white"
                                    >
                                        <Plus size={14} /> Tambah Slide
                                    </button>
                                </div>

                                {/* Slide Tab Buttons */}
                                <div className="flex flex-wrap gap-2 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                    {carouselItems.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                'flex items-center rounded-xl border transition-all duration-300',
                                                activeEditIndex === idx
                                                    ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                                    : 'border-transparent bg-transparent text-admin-text-muted hover:bg-admin-card/50 hover:text-admin-text',
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveEditIndex(idx);
                                                    setActivePreviewIndex(idx);
                                                }}
                                                className="flex cursor-pointer items-center gap-2 px-3.5 py-2 text-xs font-bold"
                                            >
                                                {item.type === 'video' ? (
                                                    <FileVideo size={13} />
                                                ) : (
                                                    <FileImage size={13} />
                                                )}
                                                <span>Slide {idx + 1}</span>
                                            </button>

                                            {carouselItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    title={`Hapus Slide ${idx + 1}`}
                                                    onClick={(e) =>
                                                        handleDeleteSlide(idx, e)
                                                    }
                                                    className="mr-1.5 cursor-pointer rounded-md p-1 text-admin-text-muted transition-colors hover:bg-red-500/20 hover:text-red-400"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Form Detail Slide Aktif */}
                                {currentEditItem && (
                                    <SlideItemEditor
                                        item={currentEditItem}
                                        index={activeEditIndex}
                                        updateCarouselItem={updateCarouselItem}
                                        handleFileChange={handleFileChange}
                                        uploadProgress={uploadProgress}
                                        fileInputRef={fileInputRef}
                                        triggerFileSelect={triggerFileSelect}
                                    />
                                )}
                            </div>

                            {/* Tombol Simpan & Reset */}
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
                    <div className="group relative flex h-[550px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Live Preview (Detail Servis)
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Slide {activePreviewIndex + 1} dari{' '}
                                {carouselItems.length}
                            </span>
                        </div>

                        {/* Monitor Mockup Area */}
                        <div className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-[2rem] border border-admin-border bg-[#0d2e2e] p-6 shadow-inner select-none">
                            {/* Render Slide Aktif di Background Preview */}
                            {carouselItems.map((slide, index) => {
                                const isActive = index === activePreviewIndex;
                                const displayUrl =
                                    slide.previewUrl || slide.url;

                                return (
                                    <div
                                        key={slide.id || index}
                                        className={cn(
                                            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                                            isActive
                                                ? 'pointer-events-auto opacity-60'
                                                : 'pointer-events-none opacity-0',
                                        )}
                                    >
                                        {isActive &&
                                            (detectMediaType(displayUrl, slide.file, slide.type) === 'video' ? (
                                                <SmartVideo
                                                    src={displayUrl}
                                                    variant="hero"
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={resolveImageUrl(displayUrl)}
                                                    alt="Preview Slide"
                                                    className="h-full w-full object-cover transition-transform duration-300"
                                                    style={{
                                                        objectPosition: `${slide.positionX ?? 50}% ${slide.positionY ?? 50}%`,
                                                        transform:
                                                            slide.scale &&
                                                            slide.scale !== 1
                                                                ? `scale(${slide.scale})`
                                                                : undefined,
                                                        transformOrigin: `${slide.positionX ?? 50}% ${slide.positionY ?? 50}%`,
                                                    }}
                                                />
                                            ))}
                                    </div>
                                );
                            })}

                            {/* Overlay Gelap Linear */}
                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0d2e2e] via-[#0d2e2e]/50 to-transparent" />

                            {/* Navigasi Slide Mockup */}
                            {carouselItems.length > 1 && (
                                <div className="pointer-events-none absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 justify-between">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActivePreviewIndex(
                                                (activePreviewIndex -
                                                    1 +
                                                    carouselItems.length) %
                                                    carouselItems.length,
                                            )
                                        }
                                        className="pointer-events-auto flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-colors hover:bg-black/70"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActivePreviewIndex(
                                                (activePreviewIndex + 1) %
                                                    carouselItems.length,
                                            )
                                        }
                                        className="pointer-events-auto flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-colors hover:bg-black/70"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Dots Indikator Slide */}
                            {carouselItems.length > 1 && (
                                <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-20 flex justify-center gap-1.5">
                                    {carouselItems.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() =>
                                                setActivePreviewIndex(idx)
                                            }
                                            className={cn(
                                                'size-1.5 cursor-pointer rounded-full transition-all duration-300',
                                                activePreviewIndex === idx
                                                    ? 'w-4 bg-admin-accent shadow-sm'
                                                    : 'bg-white/40 hover:bg-white/70',
                                            )}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Simulasi Konten Teks Hero Detail */}
                            <div className="pointer-events-none relative z-10 max-w-[85%] space-y-2">
                                <h1 className="font-sans text-lg leading-tight font-black break-words text-white drop-shadow-md lg:text-2xl">
                                    {title || 'Detail Servis'}
                                </h1>
                                <div className="h-0.5 w-16 rounded-full bg-[#f5e879]" />
                                <p className="line-clamp-3 font-sans text-[10px] leading-relaxed text-white/80 drop-shadow-sm">
                                    {subtitle ||
                                        'Informasi lengkap mengenai kategori layanan energi PT Pelayanan Energi Batam.'}
                                </p>
                            </div>
                        </div>

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>MOCKUP PREVIEW HERO DETAIL</span>
                            <span>ASPECT RATIO 16:9</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            {/* Notification Toast */}
            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}

