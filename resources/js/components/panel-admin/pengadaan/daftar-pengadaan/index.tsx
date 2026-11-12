import { useCmsSave } from '@/hooks/use-cms-save';
import { router } from '@inertiajs/react';
import { ShoppingCart, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import AdminToast from '@/components/panel-admin/admin-toast';
import { cn } from '@/lib/utils';
import { update as updateDaftar } from '@/routes/panel-admin/pengadaan/daftar-section';

import ActiveItemEditor from './components/ActiveItemEditor';
import ProcurementPreview from './components/ProcurementPreview';
import ProcurementTable from './components/ProcurementTable';
import { DEFAULT_CATEGORIES, defaultItems, buildMapsEmbedUrl } from './types';
import type { Dokumen, PengadaanItem } from './types';

interface DaftarPengadaanEditorProps {
    daftarPengadaan?: {
        id: number;
        section_title: string;
        categories: string[];
        items: PengadaanItem[];
    } | null;
}

export default function DaftarPengadaanEditor({
    daftarPengadaan,
}: DaftarPengadaanEditorProps) {
    const [sectionTitle, setSectionTitle] = useState(
        daftarPengadaan?.section_title ?? 'Daftar Pengadaan Terbaru',
    );
    const [categories, setCategories] = useState<string[]>(
        daftarPengadaan?.categories ?? DEFAULT_CATEGORIES,
    );
    const [newCategory, setNewCategory] = useState('');
    const [items, setItems] = useState<PengadaanItem[]>(
        daftarPengadaan?.items ?? [],
    );
    const [activeId, setActiveId] = useState(
        daftarPengadaan?.items?.[0]?.id ?? defaultItems[0].id,
    );

    const [isSaving, setIsSaving] = useCmsSave();
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
    const formSnapshot = useRef<{
        items: PengadaanItem[];
        title: string;
        categories: string[];
    } | null>(null);
    const [listChanged, setListChanged] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewTab, setPreviewTab] = useState<'list' | 'detail'>('list');
    const [draggedSyaratIdx, setDraggedSyaratIdx] = useState<number | null>(
        null,
    );
    const [draggedDokIdx, setDraggedDokIdx] = useState<number | null>(null);
    const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const activeItem =
        items.find((i) => i.id === activeId) ?? items[0] ?? defaultItems[0];
    const sourceType = activeItem.imageSourceType ?? 'url';
    const displayUrl = activeItem.imagePreviewUrl || activeItem.imageSrc;

    // Normalisasi data detail agar ter-inisialisasi
    const activeDeskripsi = activeItem.deskripsi ?? '';
    const activeSyaratList = activeItem.syaratList ?? [];
    const activeDokumenList = activeItem.dokumenList ?? [];
    const activeMapsMode = activeItem.mapsMode ?? 'koordinat';
    const activeMapsKoordinat = activeItem.mapsKoordinat ?? '1.1301,104.0529';
    const activeMapsEmbedUrl = activeItem.mapsEmbedUrl ?? '';
    const activeMapsLabel = activeItem.mapsLabel ?? '';

    const resolvedMapsUrl =
        activeMapsMode === 'koordinat'
            ? buildMapsEmbedUrl(activeMapsKoordinat)
            : buildMapsEmbedUrl(activeMapsEmbedUrl);

    const handleChange = (updated: PengadaanItem) =>
        setItems((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i)),
        );

    const handleAdd = () => {
        formSnapshot.current = { items, title: sectionTitle, categories };
        const newItem: PengadaanItem = {
            id: Date.now().toString(),
            title: '',
            status: 'TERBUKA',
            startDate: '',
            endDate: '',
            location: 'Batam',
            category: categories[0] ?? 'Jasa',
            imageSrc: '',
            deskripsi: '',
            syaratList: [],
            dokumenList: [],
            mapsMode: 'koordinat',
            mapsKoordinat: '',
            mapsLabel: '',
        };
        setItems((prev) => [...prev, newItem]);
        setActiveId(newItem.id);
        setView('create');
        setPreviewTab('detail');
    };

    const handleEdit = (id: string) => {
        formSnapshot.current = { items, title: sectionTitle, categories };
        setActiveId(id);
        setView('edit');
        setPreviewTab('detail');
    };

    const handleCancel = () => {
        if (formSnapshot.current) {
            setItems(formSnapshot.current.items);
            setSectionTitle(formSnapshot.current.title);
            setCategories(formSnapshot.current.categories);
        }

        formSnapshot.current = null;
        setView('list');
    };

    const handleDelete = (id: string) => {
        if (
            !window.confirm(
                'Hapus pengadaan ini dari daftar? Klik Simpan perubahan untuk menerapkan penghapusan.',
            )
        ) {
            return;
        }

        const remaining = items.filter((i) => i.id !== id);
        setItems(remaining);

        if (activeId === id) {
            setActiveId(remaining[0]?.id ?? '');
        }

        setListChanged(true);
    };

    const handleAddCategory = () => {
        const trimmed = newCategory.trim();

        if (!trimmed || categories.includes(trimmed)) {
            return;
        }

        setCategories((prev) => [...prev, trimmed]);
        setNewCategory('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];
        setUploadingImage(true);

        if (activeItem.imagePreviewUrl) {
            URL.revokeObjectURL(activeItem.imagePreviewUrl);
        }

        const localUrl = URL.createObjectURL(file);
        setUploadingImage(false);
        handleChange({
            ...activeItem,
            imageSrc: localUrl,
            imagePreviewUrl: localUrl,
            imageFileName: file.name,
            imageSourceType: 'upload',
        });
    };

    // ── Syarat Handlers ───────────────────────────────────────
    const handleAddSyarat = () => {
        const newList = [
            ...activeSyaratList,
            { id: Date.now().toString(), text: 'Syarat baru...' },
        ];
        handleChange({ ...activeItem, syaratList: newList });
    };

    const handleDeleteSyarat = (id: string) => {
        const newList = activeSyaratList.filter((s) => s.id !== id);
        handleChange({ ...activeItem, syaratList: newList });
    };

    const handleChangeSyarat = (id: string, text: string) => {
        const newList = activeSyaratList.map((s) =>
            s.id === id ? { ...s, text } : s,
        );
        handleChange({ ...activeItem, syaratList: newList });
    };

    const handleDragStartSyarat = (idx: number) => setDraggedSyaratIdx(idx);
    const handleDragOverSyarat = (e: React.DragEvent, idx: number) => {
        e.preventDefault();

        if (draggedSyaratIdx === null || draggedSyaratIdx === idx) {
            return;
        }

        const newList = [...activeSyaratList];
        const [d] = newList.splice(draggedSyaratIdx, 1);
        newList.splice(idx, 0, d);
        handleChange({ ...activeItem, syaratList: newList });
        setDraggedSyaratIdx(idx);
    };

    // ── Dokumen Handlers ──────────────────────────────────────
    const handleAddDokumen = () => {
        const newList: Dokumen[] = [
            ...activeDokumenList,
            {
                id: Date.now().toString(),
                name: 'Dokumen Baru',
                fileSize: '0 MB',
                sourceType: 'url',
                fileUrl: '',
            },
        ];
        handleChange({ ...activeItem, dokumenList: newList });
    };

    const handleDeleteDokumen = (id: string) => {
        const newList = activeDokumenList.filter((d) => d.id !== id);
        handleChange({ ...activeItem, dokumenList: newList });
    };

    const handleChangeDokumen = (updated: Dokumen) => {
        const newList = activeDokumenList.map((d) =>
            d.id === updated.id ? updated : d,
        );
        handleChange({ ...activeItem, dokumenList: newList });
    };

    const handleDragStartDok = (idx: number) => setDraggedDokIdx(idx);
    const handleDragOverDok = (e: React.DragEvent, idx: number) => {
        e.preventDefault();

        if (draggedDokIdx === null || draggedDokIdx === idx) {
            return;
        }

        const newList = [...activeDokumenList];
        const [d] = newList.splice(draggedDokIdx, 1);
        newList.splice(idx, 0, d);
        handleChange({ ...activeItem, dokumenList: newList });
        setDraggedDokIdx(idx);
    };

    const handleFileUpload = (
        dokId: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Tandai uploading
        const loadingList = activeDokumenList.map((d) =>
            d.id === dokId ? { ...d, uploading: true } : d,
        );
        handleChange({ ...activeItem, dokumenList: loadingList });

        const localUrl = URL.createObjectURL(file);
        const sizeMB = (file.size / 1024 / 1024).toFixed(1) + ' MB';
        const finishedList: Dokumen[] = activeDokumenList.map((d) =>
            d.id === dokId
                ? {
                      ...d,
                      uploading: false,
                      fileUrl: localUrl,
                      fileName: file.name,
                      fileSize: sizeMB,
                      sourceType: 'upload',
                  }
                : d,
        );
        handleChange({ ...activeItem, dokumenList: finishedList });
    };

    const handleReset = () => {
        setSectionTitle(
            daftarPengadaan?.section_title ?? 'Daftar Pengadaan Terbaru',
        );
        setCategories(daftarPengadaan?.categories ?? DEFAULT_CATEGORIES);
        setItems(daftarPengadaan?.items ?? defaultItems);
        setActiveId(daftarPengadaan?.items?.[0]?.id ?? defaultItems[0].id);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (isSaving) {
            return;
        }

        if (view !== 'list' && !activeItem.title.trim()) {
            alert('Judul pengadaan wajib diisi.');

            return;
        }

        setIsSaving(true);

        const itemsToSubmit = items.map((item) => {
            // Cari file cover jika diupload
            const file =
                item.imageSourceType === 'upload' &&
                fileInputRef.current?.files?.[0] &&
                item.id === activeId
                    ? fileInputRef.current.files[0]
                    : null;

            // Lampirkan dokumen & file upload
            const dokumenList =
                item.dokumenList?.map((doc) => {
                    const docInput =
                        item.id === activeId ? fileRefs.current[doc.id] : null;
                    const docFile =
                        doc.sourceType === 'upload' && docInput?.files?.[0]
                            ? docInput.files[0]
                            : null;

                    return {
                        id: doc.id,
                        name: doc.name,
                        fileSize: doc.fileSize,
                        sourceType: doc.sourceType,
                        fileUrl: doc.fileUrl,
                        fileName: doc.fileName ?? '',
                        file: docFile,
                    };
                }) ?? [];

            return {
                ...item,
                id: item.id,
                title: item.title,
                status: item.status,
                startDate: item.startDate,
                endDate: item.endDate,
                location: item.location,
                category: item.category,
                imageSrc: item.imageSrc,
                imageSourceType: item.imageSourceType ?? 'url',
                imageFileName: item.imageFileName ?? '',
                deskripsi: item.deskripsi ?? '',
                mapsMode: item.mapsMode ?? 'koordinat',
                mapsKoordinat: item.mapsKoordinat ?? '',
                mapsEmbedUrl: item.mapsEmbedUrl ?? '',
                mapsLabel: item.mapsLabel ?? '',
                syaratList: item.syaratList ?? [],
                dokumenList: dokumenList,
                file: file,
            };
        });

        const payload = {
            section_title: sectionTitle,
            categories: categories,
            items: itemsToSubmit,
        };

        router.post(updateDaftar.url(), payload as any, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const saved = page.props.daftarPengadaan as
                    | { items?: PengadaanItem[] }
                    | undefined;

                if (saved?.items) {
                    setItems(saved.items);
                }

                setIsSaving(false);
                setListChanged(false);
                setView('list');
                formSnapshot.current = null;
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

    if (view === 'list') {
        return (
            <div className="space-y-4">
                <ProcurementTable
                    items={items}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    disabled={isSaving}
                />
                {listChanged && (
                    <form
                        onSubmit={handleSave}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-border bg-admin-card p-4"
                    >
                        <p className="text-xs text-admin-text-muted">
                            Penghapusan belum disimpan.
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => {
                                    handleReset();
                                    setListChanged(false);
                                }}
                                className="rounded-lg border border-admin-border px-4 py-2.5 text-xs text-admin-text"
                            >
                                Batalkan
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-lg bg-admin-primary px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan perubahan'}
                            </button>
                        </div>
                    </form>
                )}
                <AdminToast
                    show={showToast}
                    message="Daftar Pengadaan berhasil diperbarui!"
                />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn mx-auto w-full max-w-[960px] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 text-xs font-medium text-admin-text-muted hover:text-admin-accent disabled:opacity-50"
                >
                    <ArrowLeft size={15} /> Batal dan kembali
                </button>
                <span className="text-xs text-admin-text-muted">
                    {view === 'create' ? 'Pengadaan baru' : 'Edit pengadaan'}
                </span>
            </div>
            <div className="space-y-5">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-2xl border border-admin-border bg-admin-card p-5 shadow-xs sm:p-6">
                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <ShoppingCart size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-admin-text">
                                    {view === 'create'
                                        ? 'Tambah Pengadaan'
                                        : 'Edit Pengadaan'}
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola item tender dan detail teknis
                                    pengadaan perusahaan.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Editor Item Aktif */}
                            {activeItem && (
                                <ActiveItemEditor
                                    activeItem={activeItem}
                                    categories={categories}
                                    handleChange={handleChange}
                                    sourceType={sourceType}
                                    displayUrl={displayUrl}
                                    uploadingImage={uploadingImage}
                                    fileInputRef={fileInputRef}
                                    handleFileChange={handleFileChange}
                                    activeDeskripsi={activeDeskripsi}
                                    activeSyaratList={activeSyaratList}
                                    handleAddSyarat={handleAddSyarat}
                                    handleDeleteSyarat={handleDeleteSyarat}
                                    handleChangeSyarat={handleChangeSyarat}
                                    draggedSyaratIdx={draggedSyaratIdx}
                                    setDraggedSyaratIdx={setDraggedSyaratIdx}
                                    handleDragStartSyarat={
                                        handleDragStartSyarat
                                    }
                                    handleDragOverSyarat={handleDragOverSyarat}
                                    activeDokumenList={activeDokumenList}
                                    handleAddDokumen={handleAddDokumen}
                                    handleDeleteDokumen={handleDeleteDokumen}
                                    handleChangeDokumen={handleChangeDokumen}
                                    draggedDokIdx={draggedDokIdx}
                                    setDraggedDokIdx={setDraggedDokIdx}
                                    handleDragStartDok={handleDragStartDok}
                                    handleDragOverDok={handleDragOverDok}
                                    handleFileUpload={handleFileUpload}
                                    fileRefs={fileRefs}
                                    activeMapsLabel={activeMapsLabel}
                                    activeMapsMode={activeMapsMode}
                                    activeMapsKoordinat={activeMapsKoordinat}
                                    activeMapsEmbedUrl={activeMapsEmbedUrl}
                                    resolvedMapsUrl={resolvedMapsUrl}
                                />
                            )}

                            <details className="rounded-xl border border-admin-border bg-admin-bg/20">
                                <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-admin-text-muted">
                                    Pengaturan halaman & kategori
                                </summary>
                                <div className="space-y-4 border-t border-admin-border p-4">
                                    {' '}
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
                                            className="w-full rounded-lg border border-admin-border bg-admin-bg/50 px-3 py-2.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    {/* Manajemen Kategori */}
                                    <div className="space-y-3 rounded-xl border border-admin-border/60 bg-admin-bg/30 p-4">
                                        <label className="text-xs font-bold text-admin-text">
                                            Kategori Filter ({categories.length}
                                            )
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <div
                                                    key={cat}
                                                    className="group/cat flex items-center gap-1.5 rounded-xl border border-admin-border bg-admin-card px-3 py-1.5 text-xs font-bold text-admin-text"
                                                >
                                                    <span>{cat}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setCategories(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (c) =>
                                                                            c !==
                                                                            cat,
                                                                    ),
                                                            )
                                                        }
                                                        className="cursor-pointer opacity-0 transition-all group-hover/cat:opacity-100 hover:text-red-400"
                                                    >
                                                        <Trash2 size={11} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) =>
                                                    setNewCategory(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddCategory();
                                                    }
                                                }}
                                                className="flex-1 rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-xs font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                placeholder="Nama kategori baru..."
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddCategory}
                                                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-4 py-2.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                            >
                                                <Plus size={13} /> Tambah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </details>
                            {/* Tombol Aksi */}
                            <div className="flex gap-4 border-t border-admin-border pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-admin-border px-4 py-2.5 text-xs font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        isSaving ||
                                        uploadingImage ||
                                        activeDokumenList.some(
                                            (document) => document.uploading,
                                        )
                                    }
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-admin-primary/20 transition-all duration-300 active:scale-[0.98]',
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
                                        : 'Simpan Pengadaan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </AnimeReveal>
            </div>

            <details className="rounded-2xl border border-admin-border bg-admin-card p-4">
                <summary className="cursor-pointer text-xs font-medium text-admin-text-muted">
                    Lihat pratinjau pengadaan
                </summary>
                <div className="mt-4">
                    <ProcurementPreview
                        previewTab={previewTab}
                        setPreviewTab={setPreviewTab}
                        items={items}
                        activeId={activeId}
                        activeItem={activeItem}
                        activeDeskripsi={activeDeskripsi}
                        activeSyaratList={activeSyaratList}
                        activeDokumenList={activeDokumenList}
                        resolvedMapsUrl={resolvedMapsUrl}
                        activeMapsLabel={activeMapsLabel}
                        displayUrl={displayUrl}
                    />
                </div>
            </details>
            <AdminToast
                show={showToast}
                message="Daftar Pengadaan berhasil diperbarui!"
            />
        </div>
    );
}
