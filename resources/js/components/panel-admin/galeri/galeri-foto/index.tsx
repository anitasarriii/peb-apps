import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Images, RotateCcw, Save } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { type GalleryItem, DEFAULT_CATEGORIES, defaultItems } from './types';
import AdminToast from '@/components/panel-admin/admin-toast';
import CategoryManager from './category-manager';
import PhotoList from './photo-list';
import PhotoEditor from './photo-editor';
import PreviewPanel from './preview-panel';
import { update as updateGaleriFoto } from '@/routes/panel-admin/galeri/galeri-foto';

interface GaleriFotoSectionData {
    section_title: string;
    categories: string[];
    items: GalleryItem[];
}

interface GaleriFotoEditorProps {
    selectedId?: string;
    recordMode?: boolean;
    galeriFotoSection?: GaleriFotoSectionData | null;
}

const DEFAULT_TITLE = 'Galeri Kegiatan & Fasilitas';

export default function GaleriFotoEditor({
    galeriFotoSection,
    selectedId,
    recordMode = false,
}: GaleriFotoEditorProps) {
    const [sectionTitle, setSectionTitle] = useState(
        galeriFotoSection?.section_title ?? DEFAULT_TITLE,
    );
    const [categories, setCategories] = useState<string[]>(
        galeriFotoSection?.categories?.length
            ? galeriFotoSection.categories
            : DEFAULT_CATEGORIES,
    );
    const [items, setItems] = useState<GalleryItem[]>(
        galeriFotoSection?.items?.length
            ? galeriFotoSection.items
            : defaultItems,
    );
    const [activeId, setActiveId] = useState(
        selectedId ??
            galeriFotoSection?.items?.[0]?.id ??
            (defaultItems[0]?.id || '1'),
    );
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Galeri foto telah diperbarui.',
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const activeItem =
        items.find((i) => i.id === activeId) ?? items[0] ?? defaultItems[0];

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleChange = (updated: GalleryItem) =>
        setItems((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i)),
        );

    const handleAdd = () => {
        const newItem: GalleryItem = {
            id: Date.now().toString(),
            title: 'Foto Baru',
            category: categories[0] ?? 'Umum',
            location: 'Batam, Kepulauan Riau',
            imageSrc:
                'https://placehold.co/600x400/0d2e2e/ffffff?text=Foto+Baru',
            imageSourceType: 'url',
        };
        setItems((prev) => [...prev, newItem]);
        setActiveId(newItem.id);
    };

    const handleDelete = (id: string) => {
        if (items.length <= 1) return;
        const remaining = items.filter((i) => i.id !== id);
        setItems(remaining);
        if (activeId === id) setActiveId(remaining[0].id);
    };

    const handleDragStart = (index: number) => setDraggedIndex(index);
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        setItems((prev) => {
            const next = [...prev];
            const [dragged] = next.splice(draggedIndex, 1);
            next.splice(index, 0, dragged);
            return next;
        });
        setDraggedIndex(index);
    };
    const handleDragEnd = () => setDraggedIndex(null);

    const handleReset = () => {
        setSectionTitle(galeriFotoSection?.section_title ?? DEFAULT_TITLE);
        setCategories(
            galeriFotoSection?.categories?.length
                ? galeriFotoSection.categories
                : DEFAULT_CATEGORIES,
        );
        const resetItems = galeriFotoSection?.items?.length
            ? galeriFotoSection.items
            : defaultItems;
        setItems(resetItems);
        setActiveId(selectedId || resetItems[0]?.id || '1');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            updateGaleriFoto.url(),
            {
                section_title: sectionTitle,
                categories: categories,
                items: items as any,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    triggerToast('success', 'Galeri foto telah diperbarui.');
                },
                onError: (err) => {
                    setIsSaving(false);
                    console.error('[GaleriFoto] Save error:', err);
                    const errorMsg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa input Anda.'}`,
                    );
                },
            },
        );
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header */}
                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <Images size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-admin-text">
                                    Galeri Foto
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola foto, kategori, dan informasi galeri.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Judul Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                    Judul Section
                                </label>
                                <input
                                    type="text"
                                    value={sectionTitle}
                                    onChange={(e) =>
                                        setSectionTitle(e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                    placeholder="Galeri Kegiatan & Fasilitas"
                                    required
                                />
                            </div>

                            {/* Manajemen Kategori */}
                            <CategoryManager
                                categories={categories}
                                onAdd={(cat) =>
                                    setCategories((prev) => [...prev, cat])
                                }
                                onDelete={(cat) =>
                                    setCategories((prev) =>
                                        prev.filter((c) => c !== cat),
                                    )
                                }
                            />

                            {!recordMode && (
                                <>
                                    {/* Daftar Foto */}
                                    <PhotoList
                                        items={items}
                                        activeId={activeId}
                                        draggedIndex={draggedIndex}
                                        onSelect={setActiveId}
                                        onAdd={handleAdd}
                                        onDelete={handleDelete}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDragEnd={handleDragEnd}
                                    />
                                </>
                            )}
                            {/* Editor Foto Aktif */}
                            {activeItem && (
                                <div className="border-t border-admin-border/50 pt-2">
                                    <PhotoEditor
                                        item={activeItem}
                                        categories={categories}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* Tombol Aksi */}
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

            {/* Live Preview */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <PreviewPanel
                        sectionTitle={sectionTitle}
                        items={items}
                        categories={categories}
                        activeId={activeId}
                    />
                </AnimeReveal>
            </div>

            {/* Toast */}
            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
            />
        </div>
    );
}
