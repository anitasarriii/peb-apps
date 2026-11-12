import { useCmsSave } from '@/hooks/use-cms-save';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Sparkles,
    Plus,
    Trash2,
    RotateCcw,
    Save,
    FileVideo,
    FileImage,
    Layout,
} from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updateHeroTentang } from '@/routes/panel-admin/tentang/hero-section';
import SlideItemEditor from './slide-item-editor';
import PreviewPanel from './preview-panel';
import SearchableSelect from '@/components/panel-admin/beranda/hero/searchable-select';

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
}

interface HeroTentang {
    title: string;
    subtitle: string;
    badge_label: string;
    carousel_items: CarouselItem[];
}

interface HeroTentangEditorProps {
    heroTentang?: HeroTentang | null;
    heroUserId?: number;
    adminUsers?: { id: number; name: string; email: string }[];
}

export default function HeroTentangEditor({
    heroTentang,
    heroUserId,
    adminUsers,
}: HeroTentangEditorProps = {}) {
    const [title, setTitle] = useState(heroTentang?.title || 'Tentang Kami');
    const [subtitle, setSubtitle] = useState(
        heroTentang?.subtitle ||
            'Informasi transparan mengenai profil PT Pelayanan Energi Batam.',
    );

    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(
        heroTentang?.carousel_items || [
            {
                id: 'slide-1',
                type: 'image',
                sourceType: 'url',
                url: '/assets/tentang-kami/hero/hero.png',
            },
            {
                id: 'slide-2',
                type: 'image',
                sourceType: 'url',
                url: '/assets/tentang-kami/hero/hero.png',
            },
        ],
    );

    const [activeEditIndex, setActiveEditIndex] = useState<number>(0);
    const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi hero Tentang Kami berhasil diperbarui.',
    );
    const [uploadProgress, setUploadProgress] = useState<
        Record<string, number>
    >({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSearchChange = (query: string) => {
        router.get(
            '/panel-admin',
            {
                tab: 'Hero Tentang Kami',
                user_id: heroUserId,
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
            { tab: 'Hero Tentang Kami', user_id: targetUserId },
            { preserveState: true, preserveScroll: true },
        );
    };

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

    const handleReset = () => {
        carouselItems.forEach((item) => {
            if (item.previewUrl) {
                URL.revokeObjectURL(item.previewUrl);
            }
        });

        setTitle(heroTentang?.title || 'Tentang Kami');
        setSubtitle(
            heroTentang?.subtitle ||
                'Informasi transparan mengenai profil PT Pelayanan Energi Batam.',
        );
        setCarouselItems(
            heroTentang?.carousel_items || [
                {
                    id: 'slide-1',
                    type: 'image',
                    sourceType: 'url',
                    url: '/assets/tentang-kami/hero/hero.png',
                },
                {
                    id: 'slide-2',
                    type: 'image',
                    sourceType: 'url',
                    url: '/assets/tentang-kami/hero/hero.png',
                },
            ],
        );
        setActiveEditIndex(0);
        setActivePreviewIndex(0);
        console.log('[HeroTentangEditor] Reset ke konfigurasi terakhir.');
    };

    const handleAddSlide = () => {
        const newId = `slide-${Date.now()}`;
        const newSlide: CarouselItem = {
            id: newId,
            type: 'image',
            sourceType: 'url',
            url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop',
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

        const itemToRemove = carouselItems[index];
        if (itemToRemove?.previewUrl) {
            URL.revokeObjectURL(itemToRemove.previewUrl);
        }

        const newItems = carouselItems.filter((_, idx) => idx !== index);
        setCarouselItems(newItems);

        setActiveEditIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1)));
        setActivePreviewIndex((prev) => (prev >= index ? Math.max(0, prev - 1) : Math.min(prev, newItems.length - 1)));
    };

    const updateCarouselItem = (
        index: number,
        key: keyof CarouselItem,
        value: any,
    ) => {
        setCarouselItems((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [key]: value,
            };
            return updated;
        });
    };

    const handleFileChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const itemId = carouselItems[index].id;
        const fileType = file.type.startsWith('video/') ? 'video' : 'image';

        if (carouselItems[index].previewUrl) {
            URL.revokeObjectURL(carouselItems[index].previewUrl);
        }

        const localUrl = URL.createObjectURL(file);

        setUploadProgress((prev) => ({ ...prev, [itemId]: 0 }));

        updateCarouselItem(index, 'url', localUrl);
        updateCarouselItem(index, 'previewUrl', localUrl);
        updateCarouselItem(index, 'fileName', file.name);
        updateCarouselItem(index, 'type', fileType);
        updateCarouselItem(index, 'file', file);
        setUploadProgress((prev) => ({ ...prev, [itemId]: 0 }));
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data: any = {
            title,
            subtitle,
            user_id: heroUserId,
            carousel_items: carouselItems.map((item) => ({
                id: item.id,
                type: item.type,
                sourceType: item.sourceType,
                url:
                    item.sourceType === 'upload'
                        ? item.file
                            ? ''
                            : item.url
                        : item.url,
                fileName: item.fileName,
                file:
                    item.sourceType === 'upload' && item.file
                        ? item.file
                        : undefined,
            })),
        };

        router.post(updateHeroTentang.url(), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                triggerToast(
                    'success',
                    'Konfigurasi hero Tentang Kami berhasil diperbarui.',
                );
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('[HeroTentangEditor] Gagal menyimpan:', err);
                const errorMsg = Object.values(err).join('\n');
                triggerToast(
                    'error',
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
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
                        <div className="mb-6 flex flex-col gap-4 border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 animate-pulse items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Layout size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Hero Halaman Tentang Kami
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Atur teks utama dan media latar belakang
                                        carousel per situs pengguna.
                                    </p>
                                </div>
                            </div>

                            {/* Dropdown Switching Situs User — khusus Super Admin */}
                            {adminUsers && (
                                <div className="flex w-fit items-center gap-3 rounded-xl border border-admin-border bg-admin-bg p-1.5">
                                    <span className="shrink-0 px-2 text-[10px] font-bold text-admin-text-muted uppercase">
                                        Situs User:
                                    </span>
                                    <SearchableSelect
                                        value={heroUserId}
                                        options={adminUsers}
                                        onChange={handleUserChange}
                                        onSearchChange={handleSearchChange}
                                        placeholder="Cari situs user..."
                                    />
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Input Teks */}
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Utama
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                        placeholder="Judul Hero Halaman Tentang Kami..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Sub-judul / Deskripsi
                                    </label>
                                    <textarea
                                        value={subtitle}
                                        onChange={(e) =>
                                            setSubtitle(e.target.value)
                                        }
                                        rows={3}
                                        className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                        placeholder="Deskripsi penjelasan..."
                                        required
                                    />
                                </div>

                                {/* Carousel Media Section */}
                                <div className="space-y-4 border-t border-admin-border/50 pt-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Slide Carousel Media Latar Belakang
                                            ({carouselItems.length})
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

                                    {/* Slide Editor */}
                                    {currentEditItem && (
                                        <SlideItemEditor
                                            item={currentEditItem}
                                            index={activeEditIndex}
                                            updateCarouselItem={
                                                updateCarouselItem
                                            }
                                            handleFileChange={handleFileChange}
                                            uploadProgress={uploadProgress}
                                            fileInputRef={fileInputRef}
                                            triggerFileSelect={
                                                triggerFileSelect
                                            }
                                        />
                                    )}
                                </div>
                            </div>

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
