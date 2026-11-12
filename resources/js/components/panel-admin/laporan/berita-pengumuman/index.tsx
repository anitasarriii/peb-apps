import { useCmsSave } from '@/hooks/use-cms-save';
import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    FileBarChart,
    Plus,
    Trash2,
    GripVertical,
    RotateCcw,
    Save,
    Eye,
    Link as LinkIcon,
    UploadCloud,
    Calendar,
    Search,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import SmartVideo from '@/components/global/smart-media';
import { resolveImageUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';
import {
    convertToDateInputFormat,
    formatLaporanDate,
} from '../laporan-keuangan';
import RichTextEditor from './rich-text-editor';

interface BeritaSectionData {
    section_title: string;
    section_desc: string;
    items: BeritaItem[];
}

interface BeritaPengumumanEditorProps {
    selectedId?: string;
    recordMode?: boolean;
    beritaSection?: BeritaSectionData | null;
}

export interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    url: string;
    sourceType: 'url' | 'upload';
    fileName?: string;
    previewUrl?: string;
    file?: File;
}

interface BeritaItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    imageSrc: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
    file?: File;
    gallery?: GalleryItem[];
}

const defaultItems: BeritaItem[] = [
    {
        id: '1',
        title: 'Ekspansi Jaringan Listrik Baru di Kawasan Industri Kabil',
        subtitle:
            'PT Pelayanan Energi Batam mengumumkan penyelesaian proyek infrastruktur krusial untuk mendukung kebutuhan...',
        date: '28 April 2024',
        imageSrc:
            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop',
        gallery: [],
    },
    {
        id: '2',
        title: 'Implementasi Panel Surya Tahap I di Kantor Pusat',
        subtitle:
            'Sebagai bagian dari komitmen Net Zero Emission 2060, kami mulai mengintegrasikan energi terbarukan pada...',
        date: '15 April 2024',
        imageSrc:
            'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
        gallery: [],
    },
    {
        id: '3',
        title: 'Peluncuran Sistem Monitoring Energi Digital Terbaru',
        subtitle:
            'Sistem baru ini memungkinkan pelanggan industri memantau konsumsi energi secara real-time dengan...',
        date: '02 April 2024',
        imageSrc:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
        gallery: [],
    },
];

export default function BeritaPengumumanEditor({
    beritaSection,
    selectedId,
    recordMode = false,
}: BeritaPengumumanEditorProps = {}) {
    const [sectionTitle, setSectionTitle] = useState(
        beritaSection?.section_title || 'Berita & Acara',
    );
    const [sectionDesc, setSectionDesc] = useState(
        beritaSection?.section_desc ||
            'Update terbaru mengenai proyek, kerjasama, dan inovasi kami.',
    );
    const [items, setItems] = useState<BeritaItem[]>(() => {
        const rawItems = beritaSection?.items || defaultItems;
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;
        return rawItems.map((item) => ({
            ...item,
            date: item.date || formattedToday,
        }));
    });
    const [activeId, setActiveId] = useState(
        selectedId || beritaSection?.items?.[0]?.id || defaultItems[0].id,
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const activeItem = items.find((i) => i.id === activeId) ?? items[0];
    const sourceType = activeItem.imageSourceType ?? 'url';
    const displayUrl = activeItem.imagePreviewUrl || activeItem.imageSrc;

    const handleChange = (updated: BeritaItem) =>
        setItems((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i)),
        );

    const handleAdd = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;

        const newItem: BeritaItem = {
            id: Date.now().toString(),
            title: 'Berita Baru',
            subtitle: 'Deskripsi berita...',
            date: formattedToday,
            imageSrc: 'https://placehold.co/600x400/0d2e2e/ffffff?text=Berita',
            gallery: [],
        };
        setItems((prev) => [...prev, newItem]);
        setActiveId(newItem.id);

        // Scroll otomatis ke bawah agar langsung menunjuk ke berita baru
        setTimeout(() => {
            if (listContainerRef.current) {
                listContainerRef.current.scrollTo({
                    top: listContainerRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 100);
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
            const [d] = next.splice(draggedIndex, 1);
            next.splice(index, 0, d);
            return next;
        });
        setDraggedIndex(index);
    };
    const handleDragEnd = () => setDraggedIndex(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (activeItem.imagePreviewUrl)
            URL.revokeObjectURL(activeItem.imagePreviewUrl);
        const localUrl = URL.createObjectURL(file);
        setUploadProgress(null);
        handleChange({
            ...activeItem,
            imageSrc: localUrl,
            imagePreviewUrl: localUrl,
            imageFileName: file.name,
            imageSourceType: 'upload',
            file: file,
        });
        setUploadProgress(null);
    };

    const handleReset = () => {
        setSectionTitle(beritaSection?.section_title || 'Berita & Acara');
        setSectionDesc(
            beritaSection?.section_desc ||
                'Update terbaru mengenai proyek, kerjasama, dan inovasi kami.',
        );
        setItems(
            (beritaSection?.items || defaultItems).map((item) => ({
                ...item,
                gallery: item.gallery || [],
            })),
        );
        setActiveId(
            selectedId || beritaSection?.items?.[0]?.id || defaultItems[0].id,
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = {
            section_title: sectionTitle,
            section_desc: sectionDesc,
            items: items.map((item) => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                date: item.date,
                imageSrc:
                    item.imageSourceType === 'upload'
                        ? item.file
                            ? ''
                            : item.imageSrc
                        : item.imageSrc,
                imageSourceType: item.imageSourceType || 'url',
                imageFileName: item.imageFileName,
                file:
                    item.imageSourceType === 'upload' && item.file
                        ? item.file
                        : undefined,
                gallery: (item.gallery || []).map((g) => ({
                    id: g.id,
                    type: g.type,
                    url:
                        g.sourceType === 'upload'
                            ? g.file
                                ? ''
                                : g.url
                            : g.url,
                    sourceType: g.sourceType,
                    fileName: g.fileName,
                    file:
                        g.sourceType === 'upload' && g.file
                            ? g.file
                            : undefined,
                })),
            })),
        };

        router.post('/panel-admin/berita/daftar-section', data as any, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('[BeritaPengumumanEditor] Gagal menyimpan:', err);
                const errorMsg = Object.values(err).join('\n');
                alert(
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />
                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <FileBarChart size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-admin-text">
                                    Berita & Acara
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola daftar berita dan acara terbaru.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
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
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Deskripsi Section
                                    </label>
                                    <input
                                        type="text"
                                        value={sectionDesc}
                                        onChange={(e) =>
                                            setSectionDesc(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        required
                                    />
                                </div>
                            </div>

                            {!recordMode && (
                                <>
                                    {/* Daftar Berita */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Daftar Berita ({items.length})
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleAdd}
                                                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                            >
                                                <Plus size={13} /> Tambah
                                            </button>
                                        </div>

                                        {/* Search Filter */}
                                        <div className="flex items-center gap-2 rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 transition-all focus-within:border-admin-accent">
                                            <Search
                                                size={14}
                                                className="shrink-0 text-admin-text-muted"
                                            />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 bg-transparent text-xs font-medium text-admin-text outline-hidden"
                                                placeholder="Cari judul berita..."
                                            />
                                        </div>

                                        <div
                                            ref={listContainerRef}
                                            className="custom-scrollbar max-h-44 space-y-1.5 overflow-y-auto rounded-2xl border border-admin-border/60 bg-admin-bg p-1"
                                        >
                                            {filteredItems.map(
                                                (item, index) => {
                                                    const originalIndex =
                                                        items.findIndex(
                                                            (i) =>
                                                                i.id ===
                                                                item.id,
                                                        );
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            draggable={
                                                                !searchQuery
                                                            }
                                                            onDragStart={() =>
                                                                handleDragStart(
                                                                    originalIndex,
                                                                )
                                                            }
                                                            onDragOver={(e) =>
                                                                handleDragOver(
                                                                    e,
                                                                    originalIndex,
                                                                )
                                                            }
                                                            onDragEnd={
                                                                handleDragEnd
                                                            }
                                                            onClick={() =>
                                                                setActiveId(
                                                                    item.id,
                                                                )
                                                            }
                                                            className={cn(
                                                                'group/item flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-all select-none',
                                                                activeId ===
                                                                    item.id
                                                                    ? 'border border-admin-accent/30 bg-admin-card-hover'
                                                                    : 'border border-transparent hover:bg-admin-card/50',
                                                                draggedIndex ===
                                                                    originalIndex &&
                                                                    'opacity-40',
                                                            )}
                                                        >
                                                            {!searchQuery && (
                                                                <GripVertical
                                                                    size={14}
                                                                    className="cursor-grab text-admin-text-muted/40 group-hover/item:text-admin-text-muted/80 active:cursor-grabbing"
                                                                />
                                                            )}
                                                            <div
                                                                className={cn(
                                                                    'size-1.5 shrink-0 rounded-full',
                                                                    activeId ===
                                                                        item.id
                                                                        ? 'bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]'
                                                                        : 'bg-admin-text-muted/30',
                                                                )}
                                                            />
                                                            <div className="size-8 shrink-0 overflow-hidden rounded-lg border border-admin-border/50">
                                                                <img
                                                                    src={
                                                                        item.imagePreviewUrl ||
                                                                        item.imageSrc
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        (
                                                                            e.target as HTMLImageElement
                                                                        ).src =
                                                                            'https://placehold.co/32x32/0d2e2e/ffffff?text=?';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p
                                                                    className={cn(
                                                                        'truncate text-xs font-bold',
                                                                        activeId ===
                                                                            item.id
                                                                            ? 'text-admin-accent'
                                                                            : 'text-admin-text-muted',
                                                                    )}
                                                                >
                                                                    {item.title}
                                                                </p>
                                                                <p className="truncate text-[10px] text-admin-text-muted/60">
                                                                    {formatLaporanDate(
                                                                        item.date,
                                                                    )}
                                                                </p>
                                                            </div>
                                                            {items.length >
                                                                1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(
                                                                            item.id,
                                                                        );
                                                                    }}
                                                                    className="shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted opacity-0 transition-all group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Editor Aktif */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                    <span className="text-xs font-bold tracking-widest text-admin-accent uppercase">
                                        Mengedit: {activeItem.title}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Tanggal Publikasi
                                    </label>
                                    <div className="relative flex h-[46px] w-full items-center">
                                        {/* Div Tiruan untuk UI Kalender Kustom yang Mewah */}
                                        <div
                                            onClick={() =>
                                                dateInputRef.current?.showPicker()
                                            }
                                            className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all duration-200 hover:border-admin-accent/50"
                                        >
                                            <span className="text-sm font-medium text-admin-text">
                                                {formatLaporanDate(
                                                    activeItem.date,
                                                ) || 'Pilih Tanggal'}
                                            </span>
                                            <Calendar
                                                size={16}
                                                className="pointer-events-none text-admin-text-muted"
                                            />
                                        </div>
                                        {/* Input Date Asli Tersembunyi untuk Memicu Picker Kalender */}
                                        <input
                                            ref={dateInputRef}
                                            type="date"
                                            value={convertToDateInputFormat(
                                                activeItem.date,
                                            )}
                                            onChange={(e) => {
                                                const today = new Date();
                                                const yyyy =
                                                    today.getFullYear();
                                                const mm = String(
                                                    today.getMonth() + 1,
                                                ).padStart(2, '0');
                                                const dd = String(
                                                    today.getDate(),
                                                ).padStart(2, '0');
                                                const formattedToday = `${yyyy}-${mm}-${dd}`;
                                                handleChange({
                                                    ...activeItem,
                                                    date:
                                                        e.target.value ||
                                                        formattedToday,
                                                });
                                            }}
                                            className="pointer-events-none invisible absolute"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Berita
                                    </label>
                                    <input
                                        type="text"
                                        value={activeItem.title}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeItem,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Ringkasan
                                    </label>
                                    <RichTextEditor
                                        value={activeItem.subtitle}
                                        onChange={(val) =>
                                            handleChange({
                                                ...activeItem,
                                                subtitle: val,
                                            })
                                        }
                                        placeholder="Tulis ringkasan berita di sini..."
                                    />
                                </div>

                                {/* Gambar */}
                                <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-admin-text">
                                            Gambar Berita
                                        </label>
                                        <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                                            {(['url', 'upload'] as const).map(
                                                (st) => (
                                                    <button
                                                        key={st}
                                                        type="button"
                                                        onClick={() =>
                                                            handleChange({
                                                                ...activeItem,
                                                                imageSourceType:
                                                                    st,
                                                            })
                                                        }
                                                        className={cn(
                                                            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                            sourceType === st
                                                                ? 'bg-admin-accent text-white shadow-sm'
                                                                : 'text-admin-text-muted hover:text-admin-text',
                                                        )}
                                                    >
                                                        {st === 'url' ? (
                                                            <LinkIcon
                                                                size={10}
                                                            />
                                                        ) : (
                                                            <UploadCloud
                                                                size={10}
                                                            />
                                                        )}
                                                        {st === 'url'
                                                            ? 'URL'
                                                            : 'Unggah'}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                    {sourceType === 'url' ? (
                                        <input
                                            type="text"
                                            value={activeItem.imageSrc}
                                            onChange={(e) =>
                                                handleChange({
                                                    ...activeItem,
                                                    imageSrc: e.target.value,
                                                    imagePreviewUrl: undefined,
                                                })
                                            }
                                            className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            placeholder="https://... atau /assets/..."
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
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <UploadCloud
                                                    size={28}
                                                    className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                />
                                                <p className="text-xs font-bold text-admin-text">
                                                    Pilih file Gambar
                                                </p>
                                                <p className="text-center text-[10px] text-admin-text-muted">
                                                    Tarik & lepas atau klik
                                                    untuk menjelajah
                                                </p>
                                            </div>
                                            {uploadProgress !== null &&
                                                uploadProgress < 100 && (
                                                    <div className="space-y-2 rounded-xl border border-admin-border bg-admin-bg/80 p-4">
                                                        <div className="flex justify-between text-[10px] font-bold">
                                                            <span className="max-w-[200px] truncate text-admin-text">
                                                                {activeItem.imageFileName ||
                                                                    'Mengupload...'}
                                                            </span>
                                                            <span className="text-admin-accent">
                                                                {uploadProgress}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-admin-border">
                                                            <div
                                                                className="h-full rounded-full bg-admin-accent transition-all duration-300"
                                                                style={{
                                                                    width: `${uploadProgress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-admin-border/50 bg-admin-bg">
                                        <img
                                            src={displayUrl}
                                            alt={activeItem.title}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    'https://placehold.co/600x400/0d2e2e/ffffff?text=Berita';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-4">
                                            <p className="line-clamp-1 text-xs font-bold text-white">
                                                {activeItem.title}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-white/60">
                                                {formatLaporanDate(
                                                    activeItem.date,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Galeri Media Berita */}
                                <div className="space-y-4 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                    <div className="flex items-center justify-between border-b border-admin-border/40 pb-3">
                                        <div>
                                            <label className="text-xs font-bold text-admin-text">
                                                Galeri Media Berita
                                            </label>
                                            <p className="text-[10px] text-admin-text-muted">
                                                Tambahkan dokumentasi
                                                gambar/video untuk berita ini.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentGallery =
                                                    activeItem.gallery || [];
                                                const newGalleryItem: GalleryItem =
                                                    {
                                                        id: Date.now().toString(),
                                                        type: 'image',
                                                        url: 'https://placehold.co/600x400/0d2e2e/ffffff?text=Galeri',
                                                        sourceType: 'url',
                                                    };
                                                handleChange({
                                                    ...activeItem,
                                                    gallery: [
                                                        ...currentGallery,
                                                        newGalleryItem,
                                                    ],
                                                });
                                            }}
                                            className="flex cursor-pointer items-center gap-1 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-[10px] font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                        >
                                            <Plus size={12} /> Tambah Media
                                        </button>
                                    </div>

                                    <div className="custom-scrollbar max-h-[350px] space-y-4 overflow-y-auto pr-1">
                                        {!activeItem.gallery ||
                                        activeItem.gallery.length === 0 ? (
                                            <div className="py-6 text-center text-xs text-admin-text-muted">
                                                Belum ada galeri media. Klik
                                                tambah media di atas.
                                            </div>
                                        ) : (
                                            activeItem.gallery.map(
                                                (gItem, gIdx) => {
                                                    const gDisplayUrl =
                                                        gItem.previewUrl ||
                                                        gItem.url;
                                                    return (
                                                        <div
                                                            key={gItem.id}
                                                            className="relative space-y-3 rounded-2xl border border-admin-border bg-admin-bg/40 p-4"
                                                        >
                                                            {/* Header Item Galeri */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {/* Tipe Selector */}
                                                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-0.5">
                                                                        {(
                                                                            [
                                                                                'image',
                                                                                'video',
                                                                            ] as const
                                                                        ).map(
                                                                            (
                                                                                t,
                                                                            ) => (
                                                                                <button
                                                                                    key={
                                                                                        t
                                                                                    }
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const updatedGallery =
                                                                                            [
                                                                                                ...(activeItem.gallery ||
                                                                                                    []),
                                                                                            ];
                                                                                        updatedGallery[
                                                                                            gIdx
                                                                                        ] =
                                                                                            {
                                                                                                ...gItem,
                                                                                                type: t,
                                                                                                url:
                                                                                                    t ===
                                                                                                    'video'
                                                                                                        ? 'https://www.w3schools.com/html/mov_bbb.mp4'
                                                                                                        : 'https://placehold.co/600x400/0d2e2e/ffffff?text=Galeri',
                                                                                                previewUrl:
                                                                                                    undefined,
                                                                                                file: undefined,
                                                                                                fileName:
                                                                                                    undefined,
                                                                                            };
                                                                                        handleChange(
                                                                                            {
                                                                                                ...activeItem,
                                                                                                gallery:
                                                                                                    updatedGallery,
                                                                                            },
                                                                                        );
                                                                                    }}
                                                                                    className={cn(
                                                                                        'rounded-md px-2 py-0.5 text-[9px] font-bold transition-all',
                                                                                        gItem.type ===
                                                                                            t
                                                                                            ? 'bg-admin-primary text-white shadow-sm'
                                                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                                                    )}
                                                                                >
                                                                                    {t ===
                                                                                    'image'
                                                                                        ? 'Gambar'
                                                                                        : 'Video'}
                                                                                </button>
                                                                            ),
                                                                        )}
                                                                    </div>

                                                                    {/* Source Selector */}
                                                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-0.5">
                                                                        {(
                                                                            [
                                                                                'url',
                                                                                'upload',
                                                                            ] as const
                                                                        ).map(
                                                                            (
                                                                                st,
                                                                            ) => (
                                                                                <button
                                                                                    key={
                                                                                        st
                                                                                    }
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        if (gItem.sourceType === st) return;
                                                                                        const updatedGallery =
                                                                                            [
                                                                                                ...(activeItem.gallery ||
                                                                                                    []),
                                                                                            ];
                                                                                        updatedGallery[
                                                                                            gIdx
                                                                                        ] =
                                                                                            {
                                                                                                ...gItem,
                                                                                                sourceType:
                                                                                                    st,
                                                                                                url:
                                                                                                    st === 'upload'
                                                                                                        ? ''
                                                                                                        : gItem.type ===
                                                                                                            'video'
                                                                                                            ? 'https://www.w3schools.com/html/mov_bbb.mp4'
                                                                                                            : 'https://placehold.co/600x400/0d2e2e/ffffff?text=Galeri',
                                                                                                previewUrl:
                                                                                                    undefined,
                                                                                                file: undefined,
                                                                                                fileName:
                                                                                                    undefined,
                                                                                            };
                                                                                        handleChange(
                                                                                            {
                                                                                                ...activeItem,
                                                                                                gallery:
                                                                                                    updatedGallery,
                                                                                            },
                                                                                        );
                                                                                    }}
                                                                                    className={cn(
                                                                                        'rounded-md px-2 py-0.5 text-[9px] font-bold transition-all',
                                                                                        gItem.sourceType ===
                                                                                            st
                                                                                            ? 'bg-admin-accent text-white shadow-sm'
                                                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                                                    )}
                                                                                >
                                                                                    {st ===
                                                                                    'url'
                                                                                        ? 'URL'
                                                                                        : 'Unggah'}
                                                                                </button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updatedGallery =
                                                                            (
                                                                                activeItem.gallery ||
                                                                                []
                                                                            ).filter(
                                                                                (
                                                                                    g,
                                                                                ) =>
                                                                                    g.id !==
                                                                                    gItem.id,
                                                                            );
                                                                        handleChange(
                                                                            {
                                                                                ...activeItem,
                                                                                gallery:
                                                                                    updatedGallery,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="cursor-pointer rounded-lg p-1 text-admin-text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>

                                                            {/* Input / Upload Area */}
                                                            {gItem.sourceType ===
                                                            'url' ? (
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        gItem.url
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const updatedGallery =
                                                                            [
                                                                                ...(activeItem.gallery ||
                                                                                    []),
                                                                            ];
                                                                        updatedGallery[
                                                                            gIdx
                                                                        ] = {
                                                                            ...gItem,
                                                                            url: e
                                                                                .target
                                                                                .value,
                                                                            previewUrl:
                                                                                undefined,
                                                                        };
                                                                        handleChange(
                                                                            {
                                                                                ...activeItem,
                                                                                gallery:
                                                                                    updatedGallery,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-3 py-2 font-mono text-[10px] text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                                    placeholder={
                                                                        gItem.type ===
                                                                        'video'
                                                                            ? 'https://...mp4, YouTube, Instagram Reel, TikTok, Drive'
                                                                            : 'https://...jpg atau link Google Drive'
                                                                    }
                                                                    required
                                                                />
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    <div
                                                                        onClick={() => {
                                                                            const fileInput =
                                                                                document.getElementById(
                                                                                    `gallery-file-input-${gItem.id}`,
                                                                                ) as HTMLInputElement;
                                                                            fileInput?.click();
                                                                        }}
                                                                        className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-admin-border bg-admin-bg/40 py-3 transition-all hover:border-admin-accent/50"
                                                                    >
                                                                        <input
                                                                            id={`gallery-file-input-${gItem.id}`}
                                                                            type="file"
                                                                            accept={
                                                                                gItem.type ===
                                                                                'video'
                                                                                    ? 'video/*'
                                                                                    : 'image/*'
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const files =
                                                                                    e
                                                                                        .target
                                                                                        .files;
                                                                                if (
                                                                                    !files ||
                                                                                    files.length ===
                                                                                        0
                                                                                )
                                                                                    return;
                                                                                const file =
                                                                                    files[0];
                                                                                if (
                                                                                    gItem.previewUrl
                                                                                )
                                                                                    URL.revokeObjectURL(
                                                                                        gItem.previewUrl,
                                                                                    );
                                                                                const localUrl =
                                                                                    URL.createObjectURL(
                                                                                        file,
                                                                                    );

                                                                                const updatedGallery =
                                                                                    [
                                                                                        ...(activeItem.gallery ||
                                                                                            []),
                                                                                    ];
                                                                                updatedGallery[
                                                                                    gIdx
                                                                                ] =
                                                                                    {
                                                                                        ...gItem,
                                                                                        url: localUrl,
                                                                                        previewUrl:
                                                                                            localUrl,
                                                                                        fileName:
                                                                                            file.name,
                                                                                        file: file,
                                                                                    };
                                                                                handleChange(
                                                                                    {
                                                                                        ...activeItem,
                                                                                        gallery:
                                                                                            updatedGallery,
                                                                                    },
                                                                                );
                                                                            }}
                                                                            className="hidden"
                                                                        />
                                                                        <UploadCloud
                                                                            size={
                                                                                18
                                                                            }
                                                                            className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                                        />
                                                                        <p className="text-[10px] font-bold text-admin-text">
                                                                            {gItem.fileName ||
                                                                                `Pilih file ${gItem.type === 'video' ? 'Video' : 'Gambar'}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Preview Mini Galeri */}
                                                            {gDisplayUrl && (
                                                                <div className="relative aspect-video max-h-[180px] overflow-hidden rounded-xl border border-admin-border/50 bg-admin-bg">
                                                                    {gItem.type ===
                                                                    'video' ? (
                                                                        <SmartVideo
                                                                            src={
                                                                                gDisplayUrl
                                                                            }
                                                                            variant="player"
                                                                            controls
                                                                            className="h-full w-full"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={resolveImageUrl(
                                                                                gDisplayUrl,
                                                                            )}
                                                                            alt="Preview Galeri"
                                                                            className="h-full w-full object-cover"
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                (
                                                                                    e.target as HTMLImageElement
                                                                                ).src =
                                                                                    'https://placehold.co/600x400/0d2e2e/ffffff?text=Gambar+Error';
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )
                                        )}
                                    </div>
                                </div>
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

            {/* Preview */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <div className="relative flex h-[750px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Berita
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>
                        <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
                            <div className="mb-3">
                                <h2 className="relative inline-block text-sm font-bold text-admin-text">
                                    {sectionTitle}
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-10 rounded-full bg-admin-accent" />
                                </h2>
                                <p className="mt-2 text-[10px] text-admin-text-muted">
                                    {sectionDesc}
                                </p>
                            </div>
                            {items.map((item) => {
                                const isActive = item.id === activeId;
                                const thumb =
                                    item.imagePreviewUrl || item.imageSrc;
                                return (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            'overflow-hidden rounded-xl border transition-all duration-300',
                                            isActive
                                                ? 'border-admin-accent/60 shadow-lg ring-1 shadow-admin-accent/10 ring-admin-accent/20'
                                                : 'border-admin-border opacity-60',
                                        )}
                                    >
                                        {isActive && (
                                            <div className="flex items-center gap-1 border-b border-admin-accent/20 bg-admin-accent/10 px-2 py-1">
                                                <div className="size-1 rounded-full bg-admin-accent" />
                                                <span className="text-[9px] font-bold tracking-widest text-admin-accent uppercase">
                                                    Diedit
                                                </span>
                                            </div>
                                        )}
                                        <div className="relative h-28 overflow-hidden">
                                            <img
                                                src={thumb}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        'https://placehold.co/600x300/0d2e2e/ffffff?text=Berita';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>
                                        <div className="space-y-1 bg-admin-bg/30 p-3">
                                            <p className="line-clamp-2 text-[10px] font-bold text-admin-text">
                                                {item.title}
                                            </p>
                                            <p className="text-[9px] text-admin-text-muted/60">
                                                {formatLaporanDate(item.date)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>MOCKUP PREVIEW</span>
                            <span>REAL-TIME SYNC</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            <AdminToast
                show={showToast}
                message="Berita & Acara telah diperbarui."
            />
        </div>
    );
}
