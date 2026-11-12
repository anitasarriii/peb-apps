import { useCmsSave } from '@/hooks/use-cms-save';
import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    FolderKanban,
    Plus,
    Trash2,
    GripVertical,
    RotateCcw,
    Save,
    Eye,
    UploadCloud,
    CheckCircle2,
    Tag,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';
import AdminSelect from '@/components/panel-admin/admin-select';
import { update as updateDaftarPortfolio } from '@/routes/panel-admin/portfolio/daftar-section';

export interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    badge: string;
    date: string;
    description: string;
    imageSrc: string;
    client: string;
    location: string;
    efficiency: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
    uploadingImage?: boolean;
    [key: string]: string | boolean | undefined;
}

const DEFAULT_CATEGORIES = ['gas', 'solar', 'operations', 'power'];

const defaultItems: PortfolioItem[] = [
    {
        id: '1',
        title: 'Batam-Pemping Pipeline Expansion',
        category: 'gas',
        badge: 'GAS INFRASTRUCTURE',
        date: '2023',
        description:
            'Peningkatan kapasitas distribusi gas bumi untuk memenuhi kebutuhan industri strategis di seluruh wilayah Batam melalui jalur transmisi bawah laut terintegrasi.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
        client: 'PT Pelayanan Energi Batam',
        location: 'Jalur Pemping - Batam',
        efficiency: 'Efisiensi Aliran 99.8%',
    },
    {
        id: '2',
        title: 'Sekupang Solar Farm Phase II',
        category: 'solar',
        badge: 'SOLAR ENERGY',
        date: '2024',
        description:
            'Pengembangan energi surya terintegrasi dengan kapasitas 10MWp untuk menyuplai kelistrikan ramah lingkungan di kawasan perumahan dan perkantoran Sekupang.',
        imageSrc: '/assets/beranda/portfolio/2.png',
        client: 'Batam Green Initiative',
        location: 'Kawasan Sekupang, Batam',
        efficiency: 'Reduksi Karbon 12,000 Ton/Thn',
    },
    {
        id: '3',
        title: 'Integrated Monitoring System',
        category: 'operations',
        badge: 'OPERATIONS',
        date: 'Ongoing',
        description:
            'Implementasi pusat monitoring digital berbasis SCADA terpusat untuk memantau stabilitas distribusi gas dan beban energi listrik secara langsung 24/7.',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
        client: 'PT Pelayanan Energi Batam',
        location: 'Control Center, Batam Center',
        efficiency: 'Uptime Sistem SCADA 99.99%',
    },
    {
        id: '4',
        title: 'Panbil Gas-Fired Station',
        category: 'power',
        badge: 'POWER PLANT',
        date: '2022',
        description:
            'Optimalisasi pembangkit listrik tenaga gas bumi yang bersih dan efisien guna menunjang pertumbuhan konsumsi listrik industri manufaktur berat.',
        imageSrc: '/assets/pengadaan/items/item4.png',
        client: 'Kawasan Industri Panbil',
        location: 'Panbil Industrial Estate, Batam',
        efficiency: 'Kapasitas Output 50 MW',
    },
];

interface DaftarPortfolioProps {
    selectedId?: string;
    recordMode?: boolean;
    daftarPortfolioSection?: {
        section_title: string;
        categories: string[];
        items: PortfolioItem[];
    } | null;
}

export default function DaftarPortfolioEditor({
    daftarPortfolioSection,
    selectedId,
    recordMode = false,
}: DaftarPortfolioProps) {
    const [sectionTitle, setSectionTitle] = useState(
        daftarPortfolioSection?.section_title ?? 'Portfolio PEB',
    );
    const [categories, setCategories] = useState<string[]>(
        daftarPortfolioSection?.categories ?? DEFAULT_CATEGORIES,
    );
    const [newCategory, setNewCategory] = useState('');
    const [items, setItems] = useState<PortfolioItem[]>(
        daftarPortfolioSection?.items?.length
            ? daftarPortfolioSection.items
            : defaultItems,
    );
    const [activeId, setActiveId] = useState(
        selectedId ||
            (daftarPortfolioSection?.items?.[0] ?? defaultItems[0]).id,
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Daftar portfolio telah diperbarui.',
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const activeItem = items.find((i) => i.id === activeId) ?? items[0];
    const displayUrl = activeItem.imagePreviewUrl || activeItem.imageSrc;

    const handleChange = (updated: PortfolioItem) =>
        setItems((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i)),
        );

    const handleAdd = () => {
        const newItem: PortfolioItem = {
            id: Date.now().toString(),
            title: 'Proyek Baru',
            category: categories[0] ?? 'gas',
            badge: 'NEW PROJECT',
            date: new Date().getFullYear().toString(),
            description: 'Deskripsi proyek baru...',
            imageSrc:
                'https://placehold.co/600x400/0d2e2e/ffffff?text=Portfolio',
            client: 'PT Pelayanan Energi Batam',
            location: 'Batam',
            efficiency: 'Efisiensi 100%',
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
            const [d] = next.splice(draggedIndex, 1);
            next.splice(index, 0, d);
            return next;
        });
        setDraggedIndex(index);
    };
    const handleDragEnd = () => setDraggedIndex(null);

    const handleAddCategory = () => {
        const trimmed = newCategory.trim();
        if (!trimmed || categories.includes(trimmed)) return;
        setCategories((prev) => [...prev, trimmed]);
        setNewCategory('');
    };

    // Efek "Memproses file..." seperti profil perusahaan
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleChange({ ...activeItem, uploadingImage: true });
        if (activeItem.imagePreviewUrl)
            URL.revokeObjectURL(activeItem.imagePreviewUrl);
        const localUrl = URL.createObjectURL(file);
        handleChange({
            ...activeItem,
            uploadingImage: false,
            imageSrc: localUrl,
            imagePreviewUrl: localUrl,
            imageFileName: file.name,
            imageSourceType: 'upload',
        });
    };

    const handleReset = () => {
        setSectionTitle(
            daftarPortfolioSection?.section_title ?? 'Portfolio PEB',
        );
        setCategories(daftarPortfolioSection?.categories ?? DEFAULT_CATEGORIES);
        setItems(
            daftarPortfolioSection?.items?.length
                ? daftarPortfolioSection.items
                : defaultItems,
        );
        setActiveId(
            selectedId ||
                (daftarPortfolioSection?.items?.[0] ?? defaultItems[0]).id,
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(
            updateDaftarPortfolio.url(),
            { section_title: sectionTitle, categories, items },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    triggerToast(
                        'success',
                        'Daftar portfolio telah diperbarui.',
                    );
                },
                onError: (err) => {
                    setIsSaving(false);
                    const msg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan:\n${msg || 'Silakan periksa input Anda.'}`,
                    );
                },
            },
        );
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />
                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <FolderKanban size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-admin-text">
                                    Daftar Portfolio
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola proyek portfolio beserta kategori
                                    filter.
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
                                    required
                                />
                            </div>

                            {/* Manajemen Kategori */}
                            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                <div className="mb-1 flex items-center gap-2">
                                    <Tag
                                        size={14}
                                        className="text-admin-accent"
                                    />
                                    <label className="text-xs font-bold text-admin-text">
                                        Kategori Filter ({categories.length})
                                    </label>
                                </div>
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
                                                    setCategories((prev) =>
                                                        prev.filter(
                                                            (c) => c !== cat,
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
                                            setNewCategory(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCategory();
                                            }
                                        }}
                                        className="flex-1 rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-xs font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="Nama kategori baru (e.g. renewable)..."
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

                            {!recordMode && (
                                <>
                                    {/* Daftar Proyek */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Proyek ({items.length})
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleAdd}
                                                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                            >
                                                <Plus size={13} /> Tambah Proyek
                                            </button>
                                        </div>
                                        <div className="custom-scrollbar max-h-52 space-y-1.5 overflow-y-auto rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                            {items.map((item, idx) => (
                                                <div
                                                    key={item.id}
                                                    draggable
                                                    onDragStart={() =>
                                                        handleDragStart(idx)
                                                    }
                                                    onDragOver={(e) =>
                                                        handleDragOver(e, idx)
                                                    }
                                                    onDragEnd={handleDragEnd}
                                                    onClick={() =>
                                                        setActiveId(item.id)
                                                    }
                                                    className={cn(
                                                        'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none',
                                                        activeId === item.id
                                                            ? 'border border-admin-accent/30 bg-admin-card shadow-sm'
                                                            : 'border border-transparent hover:bg-admin-card/60',
                                                        draggedIndex === idx &&
                                                            'scale-95 opacity-40',
                                                    )}
                                                >
                                                    <GripVertical
                                                        size={14}
                                                        className="shrink-0 cursor-grab text-admin-text-muted/40 group-hover/item:text-admin-text-muted"
                                                    />
                                                    <div
                                                        className={cn(
                                                            'size-1.5 shrink-0 rounded-full',
                                                            activeId === item.id
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
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
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
                                                            {item.badge} ·{' '}
                                                            {item.date}
                                                        </p>
                                                    </div>
                                                    <span className="shrink-0 text-[10px] font-bold text-admin-text-muted/40">
                                                        #{idx + 1}
                                                    </span>
                                                    {items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(
                                                                    item.id,
                                                                );
                                                            }}
                                                            className="shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted opacity-0 transition-all group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Editor Proyek Aktif */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                    <span className="text-xs font-bold tracking-widest text-admin-accent uppercase">
                                        Mengedit: {activeItem.title}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Kategori
                                        </label>
                                        <AdminSelect
                                            value={activeItem.category}
                                            onValueChange={(val) =>
                                                handleChange({
                                                    ...activeItem,
                                                    category: val,
                                                })
                                            }
                                            options={categories}
                                            placeholder="Pilih kategori..."
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Tahun
                                        </label>
                                        <input
                                            type="text"
                                            value={activeItem.date}
                                            onChange={(e) =>
                                                handleChange({
                                                    ...activeItem,
                                                    date: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            placeholder="2024"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Proyek
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
                                        Badge Label
                                    </label>
                                    <input
                                        type="text"
                                        value={activeItem.badge}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeItem,
                                                badge: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="GAS INFRASTRUCTURE"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={activeItem.description}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeItem,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Klien
                                        </label>
                                        <input
                                            type="text"
                                            value={activeItem.client}
                                            onChange={(e) =>
                                                handleChange({
                                                    ...activeItem,
                                                    client: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Lokasi
                                        </label>
                                        <input
                                            type="text"
                                            value={activeItem.location}
                                            onChange={(e) =>
                                                handleChange({
                                                    ...activeItem,
                                                    location: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Metrik Efisiensi / Pencapaian
                                    </label>
                                    <input
                                        type="text"
                                        value={activeItem.efficiency}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeItem,
                                                efficiency: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="Efisiensi Aliran 99.8%"
                                        required
                                    />
                                </div>

                                {/* Gambar Cover */}
                                <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-admin-text">
                                            Gambar Cover Proyek
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
                                                            (activeItem.imageSourceType ??
                                                                'url') === st
                                                                ? 'bg-admin-accent text-white shadow-sm'
                                                                : 'text-admin-text-muted hover:text-admin-text',
                                                        )}
                                                    >
                                                        {st === 'url' ? (
                                                            '🔗 URL'
                                                        ) : (
                                                            <>
                                                                <UploadCloud
                                                                    size={10}
                                                                />{' '}
                                                                Unggah
                                                            </>
                                                        )}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {(activeItem.imageSourceType ?? 'url') ===
                                    'url' ? (
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
                                            placeholder="/assets/... atau https://..."
                                            required
                                        />
                                    ) : (
                                        <div className="space-y-2">
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
                                                {activeItem.uploadingImage ? (
                                                    <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                                        <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                        Memproses file gambar...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud
                                                            size={28}
                                                            className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                        />
                                                        <p className="text-xs font-bold text-admin-text">
                                                            Pilih file Gambar
                                                        </p>
                                                        <p className="text-center text-[10px] text-admin-text-muted">
                                                            Tarik & lepas atau
                                                            klik untuk
                                                            menjelajah
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            {activeItem.imageFileName &&
                                                !activeItem.uploadingImage && (
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                        <CheckCircle2
                                                            size={12}
                                                        />
                                                        File{' '}
                                                        {
                                                            activeItem.imageFileName
                                                        }{' '}
                                                        berhasil dimuat
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                    {/* Preview */}
                                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-admin-border/50 bg-admin-bg">
                                        <img
                                            src={displayUrl}
                                            alt={activeItem.title}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(activeItem.badge)}`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute right-4 bottom-3 left-4">
                                            <span className="text-[9px] font-bold tracking-widest text-admin-accent uppercase">
                                                {activeItem.badge}
                                            </span>
                                            <p className="mt-0.5 line-clamp-1 text-xs font-bold text-white">
                                                {activeItem.title}
                                            </p>
                                            <p className="mt-0.5 text-[9px] text-white/60">
                                                {activeItem.client} ·{' '}
                                                {activeItem.date}
                                            </p>
                                        </div>
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
                    <div className="relative flex h-[800px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Portfolio
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>
                        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
                            {/* Section Header */}
                            <div className="mb-2">
                                <h2 className="relative inline-block text-sm font-bold text-admin-text">
                                    {sectionTitle}
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-10 rounded-full bg-admin-accent" />
                                </h2>
                            </div>
                            {/* Filter chips */}
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full bg-admin-accent px-2.5 py-1 text-[10px] font-bold text-white">
                                    Semua
                                </span>
                                {categories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="rounded-full border border-admin-border bg-admin-bg px-2.5 py-1 text-[10px] font-bold text-admin-text-muted capitalize"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                            {/* Grid proyek */}
                            <div className="grid grid-cols-2 gap-2">
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
                                            <div className="relative h-24 overflow-hidden">
                                                <img
                                                    src={thumb}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            `https://placehold.co/300x200/0d2e2e/ffffff?text=${encodeURIComponent(item.category)}`;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                <span className="absolute top-1.5 left-1.5 rounded bg-admin-accent/80 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
                                                    {item.badge}
                                                </span>
                                            </div>
                                            <div className="space-y-0.5 bg-admin-bg/30 p-2">
                                                <p className="line-clamp-1 text-[10px] font-bold text-admin-text">
                                                    {item.title}
                                                </p>
                                                <p className="text-[9px] text-admin-text-muted/60">
                                                    {item.client} · {item.date}
                                                </p>
                                                <p className="text-[9px] font-semibold text-admin-accent">
                                                    {item.efficiency}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
                type={toastType}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
