import { useCmsSave } from '@/hooks/use-cms-save';
import { router } from '@inertiajs/react';
import {
    ScrollText,
    Plus,
    Trash2,
    RotateCcw,
    Save,
    FileVideo,
    FileImage,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updateHeroKebijakan } from '@/routes/panel-admin/kebijakan/hero-section';
import InfoForm from './info-form';
import PreviewPanel from './preview-panel';
import SlideItemEditor from './slide-item-editor';
import SearchableSelect from './searchable-select';
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
    [key: string]: unknown;
}

interface HeroKebijakanProps {
    heroKebijakan?: {
        title: string;
        subtitle: string;
        badge_label: string;
        carousel_items: CarouselItem[];
    } | null;
    heroKebijakanUserId?: number;
    adminUsers?: { id: number; name: string; email: string }[];
}

// ─── Nilai default fallback ───────────────────────────────────────────────────
const DEFAULT_TITLE = 'Kebijakan';
const DEFAULT_SUBTITLE =
    'PT Pelayanan Energi Batam berkomitmen tinggi untuk menjalankan tata kelola perusahaan yang bersih, aman, berintegritas, dan selaras dengan standar tata kelola internasional.';
const DEFAULT_BADGE = 'Kebijakan';
const DEFAULT_SLIDES: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

export default function HeroKebijakanEditor({
    heroKebijakan,
    heroKebijakanUserId,
    adminUsers,
}: HeroKebijakanProps) {
    // ── State form utama ──────────────────────────────────────────────────────
    const [title, setTitle] = useState(heroKebijakan?.title ?? DEFAULT_TITLE);
    const [subtitle, setSubtitle] = useState(
        heroKebijakan?.subtitle ?? DEFAULT_SUBTITLE,
    );

    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(() => {
        if (
            heroKebijakan?.carousel_items &&
            heroKebijakan.carousel_items.length > 0
        ) {
            return heroKebijakan.carousel_items;
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
        'Hero Section Kebijakan telah diperbarui.',
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

    // ── Super Admin: switching situs user via server-side navigation ──────────
    const handleSearchChange = (query: string) => {
        router.get(
            '/panel-admin',
            {
                tab: 'Hero Kebijakan',
                user_id: heroKebijakanUserId,
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
            { tab: 'Hero Kebijakan', user_id: targetUserId },
            { preserveState: true, preserveScroll: true },
        );
    };

    // ── Reset ke nilai dari database (atau default jika belum ada) ────────────
    const handleReset = () => {
        carouselItems.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl as string);
        });

        setTitle(heroKebijakan?.title ?? DEFAULT_TITLE);
        setSubtitle(heroKebijakan?.subtitle ?? DEFAULT_SUBTITLE);
        setCarouselItems(
            heroKebijakan?.carousel_items?.length
                ? heroKebijakan.carousel_items
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
            url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
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
        setActiveEditIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1)));
        setActivePreviewIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1)));
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

        // Preview lokal siap tanpa menunggu transfer jaringan.
        updateCarouselItem(index, 'url', localUrl);
        updateCarouselItem(index, 'previewUrl', localUrl);
        updateCarouselItem(index, 'fileName', file.name);
        updateCarouselItem(index, 'type', fileType);
        updateCarouselItem(index, 'file', file);
        setUploadProgress((prev) => ({ ...prev, [itemId]: 0 }));
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    // ── Simpan ke backend via Inertia (forceFormData untuk file upload) ────────
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            updateHeroKebijakan.url(),
            {
                title,
                subtitle,
                carousel_items: carouselItems as any,
                user_id: heroKebijakanUserId,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    triggerToast(
                        'success',
                        'Hero Section Kebijakan telah diperbarui.',
                    );
                },
                onError: (err) => {
                    setIsSaving(false);
                    console.error('[HeroKebijakan] Save error:', err);
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
                                    <ScrollText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Hero Section Kebijakan
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Atur teks utama dan media latar belakang
                                        carousel per situs pengguna.
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
                                        value={heroKebijakanUserId}
                                        options={adminUsers}
                                        onChange={handleUserChange}
                                        onSearchChange={handleSearchChange}
                                        placeholder="Cari situs user..."
                                    />
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <InfoForm
                                title={title}
                                setTitle={setTitle}
                                subtitle={subtitle}
                                setSubtitle={setSubtitle}
                            />

                            {/* SECTION CAROUSEL MEDIA EDITOR */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Slide Carousel Media Latar Belakang (
                                        {carouselItems.length})
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
                                                        handleDeleteSlide(
                                                            idx,
                                                            e,
                                                        )
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
                    <PreviewPanel
                        title={title}
                        subtitle={subtitle}
                        carouselItems={carouselItems}
                        activePreviewIndex={activePreviewIndex}
                        setActivePreviewIndex={setActivePreviewIndex}
                    />
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
