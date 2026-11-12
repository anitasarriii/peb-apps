import { useCmsSave } from '@/hooks/use-cms-save';
import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Images,
    Plus,
    Trash2,
    RotateCcw,
    Save,
    FileVideo,
    FileImage,
} from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import PreviewPanel from '@/components/panel-admin/galeri/hero/preview-panel';
import SearchableSelect from '@/components/panel-admin/beranda/hero/searchable-select';
import ImagePositionZoomControl from '@/components/panel-admin/common/image-position-zoom-control';
import { update as updateHeroGaleri } from '@/routes/panel-admin/galeri/hero-section';

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

interface HeroGaleriProps {
    heroGaleri?: {
        title: string;
        subtitle: string;
        badge_label: string;
        carousel_items: CarouselItem[];
    } | null;
    heroGaleriUserId?: number;
    adminUsers?: { id: number; name: string; email: string }[];
}

const DEFAULT_TITLE = 'Galeri';
const DEFAULT_SUBTITLE =
    'Eksplorasi dokumentasi visual komprehensif dari fasilitas, teknologi modern, serta keterlibatan aktif tim ahli kami dalam menyokong pasokan energi Batam.';
const DEFAULT_BADGE = 'Galeri';
const DEFAULT_ITEMS: CarouselItem[] = [
    {
        id: 'slide-1',
        type: 'image',
        sourceType: 'url',
        url: '/assets/tentang-kami/hero/hero.png',
    },
];

export default function HeroGaleriEditor({
    heroGaleri,
    heroGaleriUserId,
    adminUsers,
}: HeroGaleriProps) {
    const [title, setTitle] = useState(heroGaleri?.title ?? DEFAULT_TITLE);
    const [subtitle, setSubtitle] = useState(
        heroGaleri?.subtitle ?? DEFAULT_SUBTITLE,
    );
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(() => {
        if (
            heroGaleri?.carousel_items &&
            heroGaleri.carousel_items.length > 0
        ) {
            return heroGaleri.carousel_items;
        }
        return DEFAULT_ITEMS;
    });

    const [activeEditIndex, setActiveEditIndex] = useState(0);
    const [activePreviewIndex, setActivePreviewIndex] = useState(0);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Hero section galeri telah diperbarui.',
    );

    const [uploadProgress, setUploadProgress] = useState<
        Record<string, number>
    >({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (carouselItems.length <= 1) return;
        const interval = setInterval(() => {
            setActivePreviewIndex((prev) => (prev + 1) % carouselItems.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselItems.length]);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const updateItem = (index: number, key: keyof CarouselItem, value: any) => {
        setCarouselItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [key]: value };
            return updated;
        });
    };

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

    const handleDeleteSlide = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (carouselItems.length <= 1) {
            alert('Minimal harus memiliki 1 media latar belakang.');
            return;
        }
        const item = carouselItems[index];
        if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
        const newItems = carouselItems.filter((_, i) => i !== index);
        setCarouselItems(newItems);
        setActiveEditIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1)));
        setActivePreviewIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1)));
    };

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
        if (carouselItems[index].previewUrl)
            URL.revokeObjectURL(carouselItems[index].previewUrl!);
        const localUrl = URL.createObjectURL(file);
        setUploadProgress((prev) => ({ ...prev, [itemId]: 0 }));
        updateItem(index, 'url', localUrl);
        updateItem(index, 'previewUrl', localUrl);
        updateItem(index, 'fileName', file.name);
        updateItem(index, 'type', fileType);
        updateItem(index, 'file', file);
        setUploadProgress((prev) => ({ ...prev, [itemId]: 0 }));
    };

    const handleReset = () => {
        carouselItems.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        setTitle(heroGaleri?.title ?? DEFAULT_TITLE);
        setSubtitle(heroGaleri?.subtitle ?? DEFAULT_SUBTITLE);
        setCarouselItems(
            heroGaleri?.carousel_items?.length
                ? heroGaleri.carousel_items
                : DEFAULT_ITEMS,
        );
        setActiveEditIndex(0);
        setActivePreviewIndex(0);
    };

    const handleSearchChange = (query: string) => {
        router.get(
            '/panel-admin',
            {
                tab: 'Hero Galeri',
                user_id: heroGaleriUserId,
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
            { tab: 'Hero Galeri', user_id: targetUserId },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            updateHeroGaleri.url(),
            {
                title,
                subtitle,
                carousel_items: carouselItems as any,
                user_id: heroGaleriUserId,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    triggerToast(
                        'success',
                        'Hero section galeri telah diperbarui.',
                    );
                },
                onError: (err) => {
                    setIsSaving(false);
                    console.error('[HeroGaleri] Save error:', err);
                    const errorMsg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                    );
                },
            },
        );
    };

    const currentEditItem = carouselItems[activeEditIndex] ?? carouselItems[0];

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        <div className="mb-8 flex flex-col gap-4 border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Images size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Hero Section Galeri
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Atur teks utama dan media latar belakang
                                        hero galeri per situs pengguna.
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
                                        value={heroGaleriUserId}
                                        options={adminUsers}
                                        onChange={handleUserChange}
                                        onSearchChange={handleSearchChange}
                                        placeholder="Cari situs user..."
                                    />
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Info Fields */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Hero
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Galeri"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Subtitle / Deskripsi
                                    </label>
                                    <textarea
                                        value={subtitle}
                                        onChange={(e) =>
                                            setSubtitle(e.target.value)
                                        }
                                        rows={4}
                                        className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Deskripsi singkat..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Carousel Media */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Slide Carousel ({carouselItems.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddSlide}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all duration-300 hover:bg-admin-accent hover:text-white"
                                    >
                                        <Plus size={14} /> Tambah Slide
                                    </button>
                                </div>

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

                                {/* Slide Editor */}
                                {currentEditItem && (
                                    <div className="animate-fadeIn space-y-6 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-admin-text">
                                                Konfigurasi Slide{' '}
                                                {activeEditIndex + 1}
                                            </span>
                                            <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                                                {(
                                                    ['video', 'image'] as const
                                                ).map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() =>
                                                            updateItem(
                                                                activeEditIndex,
                                                                'type',
                                                                t,
                                                            )
                                                        }
                                                        className={cn(
                                                            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                            currentEditItem.type ===
                                                                t
                                                                ? 'bg-admin-accent text-white shadow-sm'
                                                                : 'text-admin-text-muted hover:text-admin-text',
                                                        )}
                                                    >
                                                        {t === 'video' ? (
                                                            <FileVideo
                                                                size={10}
                                                            />
                                                        ) : (
                                                            <FileImage
                                                                size={10}
                                                            />
                                                        )}
                                                        {t === 'video'
                                                            ? 'Video'
                                                            : 'Gambar'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {(['url', 'upload'] as const).map(
                                                (st) => (
                                                    <button
                                                        key={st}
                                                        type="button"
                                                        onClick={() =>
                                                            updateItem(
                                                                activeEditIndex,
                                                                'sourceType',
                                                                st,
                                                            )
                                                        }
                                                        className={cn(
                                                            'cursor-pointer rounded-xl border py-3 text-xs font-bold transition-all',
                                                            currentEditItem.sourceType ===
                                                                st
                                                                ? 'border-admin-accent bg-admin-accent/5 text-admin-accent'
                                                                : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:bg-admin-bg',
                                                        )}
                                                    >
                                                        {st === 'url'
                                                            ? 'Input URL'
                                                            : 'Unggah File'}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                        {currentEditItem.sourceType ===
                                        'url' ? (
                                            <input
                                                type="text"
                                                value={currentEditItem.url}
                                                onChange={(e) =>
                                                    updateItem(
                                                        activeEditIndex,
                                                        'url',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                placeholder="/assets/... atau https://..."
                                                required
                                            />
                                        ) : (
                                            <div className="space-y-3">
                                                <div
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-all hover:border-admin-accent/50"
                                                >
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept={
                                                            currentEditItem.type ===
                                                            'video'
                                                                ? 'video/*'
                                                                : 'image/*'
                                                        }
                                                        onChange={(e) =>
                                                            handleFileChange(
                                                                activeEditIndex,
                                                                e,
                                                            )
                                                        }
                                                        className="hidden"
                                                    />
                                                    <p className="text-xs font-bold text-admin-text">
                                                        Pilih file{' '}
                                                        {currentEditItem.type ===
                                                        'video'
                                                            ? 'Video'
                                                            : 'Gambar'}
                                                    </p>
                                                    <p className="text-center text-[10px] text-admin-text-muted">
                                                        Tarik & lepas atau klik
                                                        untuk menjelajah
                                                    </p>
                                                </div>
                                                {uploadProgress[
                                                    currentEditItem.id
                                                ] !== undefined && (
                                                    <div className="space-y-2 rounded-xl border border-admin-border bg-admin-bg/80 p-4">
                                                        <div className="flex justify-between text-[10px] font-bold">
                                                            <span className="max-w-[200px] truncate text-admin-text">
                                                                {currentEditItem.fileName ||
                                                                    'Mengupload...'}
                                                            </span>
                                                            <span className="text-admin-accent">
                                                                {
                                                                    uploadProgress[
                                                                        currentEditItem
                                                                            .id
                                                                    ]
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-admin-border">
                                                            <div
                                                                className="h-full rounded-full bg-admin-accent transition-all duration-300"
                                                                style={{
                                                                    width: `${uploadProgress[currentEditItem.id]}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Pengaturan Posisi & Zoom jika tipe media adalah Gambar */}
                                        {currentEditItem.type === 'image' && (
                                            <ImagePositionZoomControl
                                                imageUrl={
                                                    currentEditItem.previewUrl ||
                                                    currentEditItem.url
                                                }
                                                positionX={
                                                    (currentEditItem.positionX as number) ??
                                                    50
                                                }
                                                positionY={
                                                    (currentEditItem.positionY as number) ??
                                                    50
                                                }
                                                scale={
                                                    (currentEditItem.scale as number) ??
                                                    1
                                                }
                                                onChange={({
                                                    positionX,
                                                    positionY,
                                                    scale,
                                                }) => {
                                                    updateItem(
                                                        activeEditIndex,
                                                        'positionX',
                                                        positionX,
                                                    );
                                                    updateItem(
                                                        activeEditIndex,
                                                        'positionY',
                                                        positionY,
                                                    );
                                                    updateItem(
                                                        activeEditIndex,
                                                        'scale',
                                                        scale,
                                                    );
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 border-t border-admin-border pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                                >
                                    <RotateCcw size={16} /> Reset
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

            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
            />
        </div>
    );
}
