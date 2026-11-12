import { useCmsSave } from '@/hooks/use-cms-save';
import { router } from '@inertiajs/react';
import {
    Sparkles,
    Plus,
    Trash2,
    RotateCcw,
    Save,
    FileVideo,
    FileImage,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import AdminToast from '@/components/panel-admin/admin-toast';
import { cn } from '@/lib/utils';
import { update as updateHero } from '@/routes/panel-admin/beranda/hero-section';
import InfoForm from './info-form';
import PreviewPanel from './preview-panel';
import SearchableSelect from './searchable-select';
import SlideItemEditor from './slide-item-editor';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
    previewUrl?: string;
    file?: File;
    label?: string;
    [key: string]: any;
}

interface HeroSectionProps {
    heroSection?: {
        title: string;
        subtitle: string;
        cta_label: string;
        cta_href: string;
        secondary_cta_label: string | null;
        secondary_cta_href: string | null;
        carousel_items: CarouselItem[];
    } | null;
    heroUserId?: number;
    adminUsers?: { id: number; name: string; email: string }[];
}

export default function HeroSectionEditor({
    heroSection,
    heroUserId,
    adminUsers,
}: HeroSectionProps) {
    const [title, setTitle] = useState(
        heroSection?.title ?? 'Energi Untuk Negeri',
    );
    const [subtitle, setSubtitle] = useState(
        heroSection?.subtitle ??
            'Mengalirkan keandalan, menghidupkan harapan. Wujud nyata komitmen kami untuk kemajuan Batam dan Indonesia.',
    );
    const [ctaLabel, setCtaLabel] = useState(
        heroSection?.cta_label ?? 'Jelajahi Inovasi Kami',
    );
    const [ctaHref, setCtaHref] = useState(heroSection?.cta_href ?? '#inovasi');
    const [secondaryCtaLabel, setSecondaryCtaLabel] = useState(
        heroSection?.secondary_cta_label ?? 'Kontak Kami',
    );
    const [secondaryCtaHref, setSecondaryCtaHref] = useState(
        heroSection?.secondary_cta_href ?? '#kontak',
    );

    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(() => {
        if (
            heroSection?.carousel_items &&
            heroSection.carousel_items.length > 0
        ) {
            return heroSection.carousel_items.map((item) => ({
                ...item,
                sourceType: item.sourceType ?? 'url',
            }));
        }

        return [
            {
                id: 'slide-1',
                type: 'video',
                sourceType: 'url',
                url: '/assets/beranda/hero/hero-video.mp4',
                label: 'Kantor PT PEB',
            },
            {
                id: 'slide-2',
                type: 'image',
                sourceType: 'url',
                url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop',
                label: 'Vidio Profile PT PEB',
            },
            {
                id: 'slide-3',
                type: 'image',
                sourceType: 'url',
                url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1600&auto=format&fit=crop',
                label: 'Layanan dan Bisnis',
            },
        ];
    });

    useEffect(() => {
        if (heroSection) {
            setTitle(heroSection.title || 'Energi Untuk Negeri');
            setSubtitle(heroSection.subtitle || 'Mengalirkan keandalan, menghidupkan harapan.');
            setCtaLabel(heroSection.cta_label || 'Jelajahi Inovasi Kami');
            setCtaHref(heroSection.cta_href || '#inovasi');
            setSecondaryCtaLabel(heroSection.secondary_cta_label || 'Kontak Kami');
            setSecondaryCtaHref(heroSection.secondary_cta_href || '#kontak');

            if (heroSection.carousel_items && heroSection.carousel_items.length > 0) {
                setCarouselItems(
                    heroSection.carousel_items.map((item) => ({
                        ...item,
                        sourceType: item.sourceType ?? 'url',
                    }))
                );
            }
        }
    }, [heroSection]);

    const [activeEditIndex, setActiveEditIndex] = useState<number>(0);
    const activePreviewIndex = activeEditIndex;
    const setActivePreviewIndex = setActiveEditIndex;
    const [isSaving, setIsSaving] = useCmsSave();
    const [uploadPercentage, setUploadPercentage] = useState<number | null>(
        null,
    );

    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi section Hero Beranda telah diperbarui.',
    );

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleSearchChange = (query: string) => {
        router.get(
            '/panel-admin',
            { tab: 'Hero Beranda', user_id: heroUserId, user_search: query },
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
            { tab: 'Hero Beranda', user_id: targetUserId },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleReset = () => {
        carouselItems.forEach((item) => {
            if (item.previewUrl) {
                URL.revokeObjectURL(item.previewUrl);
            }
        });

        setTitle('Energi Untuk Negeri');
        setSubtitle(
            'Mengalirkan keandalan, menghidupkan harapan. Wujud nyata komitmen kami untuk kemajuan Batam dan Indonesia.',
        );
        setCtaLabel('Jelajahi Inovasi Kami');
        setCtaHref('#inovasi');
        setSecondaryCtaLabel('Kontak Kami');
        setSecondaryCtaHref('#kontak');
        setCarouselItems([
            {
                id: 'slide-1',
                type: 'video',
                sourceType: 'url',
                url: '/assets/beranda/hero/hero-video.mp4',
                label: 'Kantor PT PEB',
            },
            {
                id: 'slide-2',
                type: 'image',
                sourceType: 'url',
                url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop',
                label: 'Vidio Profile PT PEB',
            },
            {
                id: 'slide-3',
                type: 'image',
                sourceType: 'url',
                url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1600&auto=format&fit=crop',
                label: 'Layanan dan Bisnis',
            },
        ]);
        setActiveEditIndex(0);
        setActivePreviewIndex(0);
    };

    const handleAddSlide = () => {
        const newId = `slide-${Date.now()}`;
        const newSlide: CarouselItem = {
            id: newId,
            type: 'image',
            sourceType: 'url',
            url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
            label: `Slide ${carouselItems.length + 1}`,
            positionX: 50,
            positionY: 50,
            scale: 1,
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

        setActiveEditIndex((prev) => {
            if (prev === index) {
                return Math.max(0, index - 1);
            }
            if (prev > index) {
                return prev - 1;
            }
            return Math.min(prev, newItems.length - 1);
        });
        setActivePreviewIndex((prev) => {
            if (prev === index) {
                return Math.max(0, index - 1);
            }
            if (prev > index) {
                return prev - 1;
            }
            return Math.min(prev, newItems.length - 1);
        });
    };

    const updateCarouselItem = (
        index: number,
        key: keyof CarouselItem,
        value: any,
    ) => {
        const currentItem = carouselItems[index];

        if (key === 'sourceType' && value === 'url' && currentItem.previewUrl) {
            URL.revokeObjectURL(currentItem.previewUrl);
        }

        setCarouselItems((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [key]: value,
                ...(key === 'sourceType' && value === 'url'
                    ? {
                          file: undefined,
                          previewUrl: undefined,
                          fileName: undefined,
                          url: currentItem.url.startsWith('blob:')
                              ? ''
                              : currentItem.url,
                      }
                    : {}),
            };

            return updated;
        });
    };

    const handleFileChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];

        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
        const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
        const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

        if (![...videoExtensions, ...imageExtensions].includes(extension)) {
            triggerToast(
                'error',
                'Pilih video MP4, WebM, OGG, MOV atau foto JPG, PNG, GIF, WebP.',
            );
            e.target.value = '';

            return;
        }

        const fileType = videoExtensions.includes(extension)
            ? 'video'
            : 'image';
        const maxSizeMb = 500;
        const maxSizeBytes = maxSizeMb * 1024 * 1024;

        if (file.size > maxSizeBytes) {
            triggerToast(
                'error',
                `Ukuran ${fileType === 'video' ? 'video' : 'gambar'} maksimal ${maxSizeMb} MB.`,
            );
            e.target.value = '';

            return;
        }

        const itemId = carouselItems[index].id;

        if (carouselItems[index].previewUrl) {
            URL.revokeObjectURL(carouselItems[index].previewUrl);
        }

        const localUrl = URL.createObjectURL(file);

        setCarouselItems((previous) =>
            previous.map((item) =>
                item.id === itemId
                    ? {
                          ...item,
                          type: fileType,
                          sourceType: 'upload',
                          url: localUrl,
                          previewUrl: localUrl,
                          fileName: file.name,
                          file,
                      }
                    : item,
            ),
        );
        e.target.value = '';
    };
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (isSaving) {
            return;
        }

        const missingFile = carouselItems.findIndex(
            (item) =>
                item.sourceType === 'upload' &&
                !item.file &&
                !heroSection?.carousel_items.some(
                    (saved) =>
                        saved.id === item.id &&
                        saved.sourceType === 'upload' &&
                        saved.url === item.url,
                ),
        );

        if (missingFile !== -1) {
            setActiveEditIndex(missingFile);
            triggerToast(
                'error',
                `Pilih file untuk Slide ${missingFile + 1} sebelum menyimpan.`,
            );

            return;
        }

        setIsSaving(true);
        setUploadPercentage(0);

        router.post(
            updateHero.url(),
            {
                title,
                subtitle,
                cta_label: ctaLabel,
                cta_href: ctaHref,
                secondary_cta_label: secondaryCtaLabel,
                secondary_cta_href: secondaryCtaHref,
                carousel_items: carouselItems.map((item) => {
                    const payload = {
                        ...item,
                        file:
                            item.sourceType === 'upload'
                                ? item.file
                                : undefined,
                    };
                    delete payload.previewUrl;

                    return payload;
                }),
                user_id: heroUserId,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onProgress: (progress) =>
                    setUploadPercentage(progress?.percentage ?? 0),
                onSuccess: (page) => {
                    const saved = page.props
                        .heroSection as HeroSectionProps['heroSection'];

                    if (saved?.carousel_items) {
                        carouselItems.forEach((item) => {
                            if (item.previewUrl) {
                                URL.revokeObjectURL(item.previewUrl);
                            }
                        });
                        setCarouselItems(saved.carousel_items);
                    }

                    triggerToast(
                        'success',
                        'Konfigurasi section Hero Beranda telah diperbarui.',
                    );
                },
                onError: (err) => {
                    console.error('Save failed:', err);
                    const errorMsg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                    );
                },
                onFinish: () => {
                    setIsSaving(false);
                    setUploadPercentage(null);
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

                        <div className="mb-8 flex flex-col gap-4 border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 animate-pulse items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Konfigurasi Landing Hero
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Atur teks utama dan media latar belakang
                                        carousel per situs pengguna.
                                    </p>
                                </div>
                            </div>

                            {/* Dropdown Switching khusus Super Admin */}
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
                            <fieldset disabled={isSaving} className="contents">
                                <InfoForm
                                    title={title}
                                    setTitle={setTitle}
                                    subtitle={subtitle}
                                    setSubtitle={setSubtitle}
                                    ctaLabel={ctaLabel}
                                    setCtaLabel={setCtaLabel}
                                    ctaHref={ctaHref}
                                    setCtaHref={setCtaHref}
                                    secondaryCtaLabel={secondaryCtaLabel}
                                    setSecondaryCtaLabel={setSecondaryCtaLabel}
                                    secondaryCtaHref={secondaryCtaHref}
                                    setSecondaryCtaHref={setSecondaryCtaHref}
                                />

                                {/* SECTION CAROUSEL MEDIA EDITOR */}
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

                                    {/* Form Detail Slide Aktif yang Diedit */}
                                    {currentEditItem && (
                                        <SlideItemEditor
                                            item={currentEditItem}
                                            index={activeEditIndex}
                                            updateCarouselItem={
                                                updateCarouselItem
                                            }
                                            handleFileChange={handleFileChange}
                                            isSaving={isSaving}
                                            uploadPercentage={uploadPercentage}
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
                            </fieldset>
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
                        ctaLabel={ctaLabel}
                        secondaryCtaLabel={secondaryCtaLabel}
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
