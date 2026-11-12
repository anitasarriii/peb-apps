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
    CheckCircle2,
    FileText,
    Calendar,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';
import { update as updateKeuangan } from '@/routes/panel-admin/laporan/keuangan-section';

/**
 * Mengonversi format tanggal string ke format input tanggal HTML5 YYYY-MM-DD.
 * Mendukung format string lama seperti "15 Mar 2024" atau "10 May 2023".
 */
export function convertToDateInputFormat(dateStr: string): string {
    if (!dateStr) return '';
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(dateStr)) return dateStr;

    try {
        const monthsMap: Record<string, string> = {
            jan: '01',
            feb: '02',
            mar: '03',
            apr: '04',
            may: '05',
            jun: '06',
            jul: '07',
            aug: '08',
            sep: '09',
            oct: '10',
            nov: '11',
            dec: '12',
        };

        const parts = dateStr.trim().split(/\s+/);
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const monthStr = parts[1].toLowerCase().substring(0, 3);
            const month = monthsMap[monthStr];
            const year = parts[2];

            if (month && year.length === 4) {
                return `${year}-${month}-${day}`;
            }
        }

        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    } catch (e) {
        // Abaikan
    }

    return '';
}

/**
 * Memformat string tanggal dari format YYYY-MM-DD ke format tampilan "DD MMM YYYY" (Bahasa Indonesia).
 * Jika string tanggal adalah format teks biasa (misal "15 Mar 2024"), langsung dikembalikan apa adanya.
 */
export function formatLaporanDate(dateStr: string): string {
    if (!dateStr) return '';

    const monthsEnToId: Record<string, string> = {
        jan: 'Januari',
        feb: 'Februari',
        mar: 'Maret',
        apr: 'April',
        may: 'Mei',
        jun: 'Juni',
        jul: 'Juli',
        aug: 'Agustus',
        sep: 'September',
        oct: 'Oktober',
        nov: 'November',
        dec: 'Desember',
    };

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) {
        // Normalisasi data lama (misal "15 Mar 2024" atau "10 May 2023") ke format bahasa Indonesia
        const parts = dateStr.trim().split(/\s+/);
        if (parts.length === 3) {
            const day = parts[0];
            const monthStr = parts[1].toLowerCase().substring(0, 3);
            const monthId = monthsEnToId[monthStr] || parts[1];
            const year = parts[2];
            return `${day} ${monthId} ${year}`;
        }
        return dateStr;
    }

    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        const monthsId = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        const day = date.getDate();
        const month = monthsId[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    } catch (e) {
        return dateStr;
    }
}

export interface PoinUtama {
    id: string;
    text: string;
}

export interface DokumenPendukung {
    id: string;
    name: string;
    fileSize: string;
    sourceType: 'url' | 'upload';
    fileUrl: string;
    fileName?: string;
    uploading?: boolean;
    file?: File;
}

export interface LaporanKeuanganItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    badge: string;
    imageSrc: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
    file?: File;
    poinUtamaList: PoinUtama[];
    dokumenList: DokumenPendukung[];
}

export interface LaporanKeuanganSectionData {
    section_title: string;
    section_desc: string;
    items: LaporanKeuanganItem[];
}

interface LaporanKeuanganEditorProps {
    selectedId?: string;
    recordMode?: boolean;
    laporanKeuanganSection?: LaporanKeuanganSectionData | null;
}

const defaultItems: LaporanKeuanganItem[] = [
    {
        id: '1',
        title: 'Laporan Keuangan Konsolidasian 2023',
        subtitle:
            'Laporan audit akhir tahun yang mencakup seluruh entitas bisnis energi Batam.',
        date: '15 Mar 2024',
        badge: 'Q4 2023',
        imageSrc: '/assets/pengadaan/items/item1.png',
        imageSourceType: 'url',
        poinUtamaList: [
            {
                id: '1',
                text: 'Neraca Keuangan Audited menggambarkan pertumbuhan aset bersih perusahaan sebesar 12.4% YoY.',
            },
            {
                id: '2',
                text: 'Laporan Laba Rugi menunjukkan peningkatan efisiensi biaya transmisi gas dan penguatan laba operasional.',
            },
            {
                id: '3',
                text: 'Kajian Arus Kas terperinci mengenai alokasi investasi proyek energi surya strategis di Sekupang.',
            },
            {
                id: '4',
                text: 'Opini Auditor Independen dengan hasil Wajar Tanpa Pengecualian (WTP) atas laporan konsolidasi.',
            },
        ],
        dokumenList: [
            {
                id: 'd1',
                name: 'Dokumen Laporan Keuangan Audited 2024',
                fileSize: '2.4 MB',
                sourceType: 'url',
                fileUrl: '#',
            },
        ],
    },
    {
        id: '2',
        title: 'Laporan Kinerja Kuartal III - 2023',
        subtitle:
            'Analisis pertumbuhan operasional dan efisiensi energi periode Juli-September.',
        date: '20 Nov 2023',
        badge: 'Q3 2023',
        imageSrc: '/assets/pengadaan/items/item5.png',
        imageSourceType: 'url',
        poinUtamaList: [],
        dokumenList: [],
    },
    {
        id: '3',
        title: 'Laporan Kinerja Kuartal II - 2023',
        subtitle:
            'Data komprehensif mengenai realisasi anggaran dan pendapatan semester pertama.',
        date: '15 Aug 2023',
        badge: 'Q2 2023',
        imageSrc: '/assets/pengadaan/items/item3.png',
        imageSourceType: 'url',
        poinUtamaList: [],
        dokumenList: [],
    },
    {
        id: '4',
        title: 'Laporan Kinerja Kuartal I - 2023',
        subtitle: 'Rangkuman inisiatif awal tahun dan target operasional 2023.',
        date: '10 May 2023',
        badge: 'Q1 2023',
        imageSrc: '/assets/pengadaan/items/item6.png',
        imageSourceType: 'url',
        poinUtamaList: [],
        dokumenList: [],
    },
];

export default function LaporanKeuanganEditor({
    laporanKeuanganSection,
    selectedId,
    recordMode = false,
}: LaporanKeuanganEditorProps = {}) {
    const [sectionTitle, setSectionTitle] = useState(
        laporanKeuanganSection?.section_title || 'Laporan Keuangan',
    );
    const [sectionDesc, setSectionDesc] = useState(
        laporanKeuanganSection?.section_desc ||
            'Ikhtisar performa finansial per kuartal dan tahunan.',
    );
    const [items, setItems] = useState<LaporanKeuanganItem[]>(() => {
        const rawItems = laporanKeuanganSection?.items || defaultItems;
        return rawItems.map((item) => ({
            ...item,
            poinUtamaList: item.poinUtamaList || [],
            dokumenList: item.dokumenList || [],
        }));
    });
    const [activeId, setActiveId] = useState(
        selectedId ||
            laporanKeuanganSection?.items?.[0]?.id ||
            defaultItems[0].id,
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [draggedPoinIdx, setDraggedPoinIdx] = useState<number | null>(null);
    const [draggedDokIdx, setDraggedDokIdx] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Laporan keuangan telah diperbarui.',
    );
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [previewMode, setPreviewMode] = useState<'list' | 'detail'>('list');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const dateInputRef = useRef<HTMLInputElement>(null);

    const activeItem = items.find((i) => i.id === activeId) ?? items[0];
    const sourceType = activeItem.imageSourceType ?? 'url';
    const displayUrl = activeItem.imagePreviewUrl || activeItem.imageSrc;

    const handleChange = (updated: LaporanKeuanganItem) =>
        setItems((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i)),
        );

    const handleAdd = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;

        const newItem: LaporanKeuanganItem = {
            id: Date.now().toString(),
            title: 'Laporan Baru',
            subtitle: 'Deskripsi laporan...',
            date: formattedToday,
            badge: 'Q1 2025',
            imageSrc: 'https://placehold.co/400x500/0d2e2e/ffffff?text=Laporan',
            poinUtamaList: [],
            dokumenList: [],
        };
        setItems((prev) => [...prev, newItem]);
        setActiveId(newItem.id);
    };

    const handleDelete = (id: string) => {
        if (items.length <= 1) return;
        setItems((prev) => {
            const next = prev.filter((i) => i.id !== id);
            if (activeId === id) setActiveId(next[0].id);
            return next;
        });
    };

    const handleDragStart = (idx: number) => setDraggedIndex(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === idx) return;
        setItems((prev) => {
            const next = [...prev];
            const [dragged] = next.splice(draggedIndex, 1);
            next.splice(idx, 0, dragged);
            return next;
        });
        setDraggedIndex(idx);
    };
    const handleDragEnd = () => setDraggedIndex(null);

    // Poin Utama Handlers
    const handleAddPoin = () => {
        handleChange({
            ...activeItem,
            poinUtamaList: [
                ...activeItem.poinUtamaList,
                { id: Date.now().toString(), text: 'Poin utama baru...' },
            ],
        });
    };
    const handleDeletePoin = (id: string) => {
        handleChange({
            ...activeItem,
            poinUtamaList: activeItem.poinUtamaList.filter((p) => p.id !== id),
        });
    };
    const handleChangePoin = (id: string, text: string) => {
        handleChange({
            ...activeItem,
            poinUtamaList: activeItem.poinUtamaList.map((p) =>
                p.id === id ? { ...p, text } : p,
            ),
        });
    };
    const handleDragStartPoin = (idx: number) => setDraggedPoinIdx(idx);
    const handleDragOverPoin = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (draggedPoinIdx === null || draggedPoinIdx === idx) return;
        const next = [...activeItem.poinUtamaList];
        const [dragged] = next.splice(draggedPoinIdx, 1);
        next.splice(idx, 0, dragged);
        handleChange({ ...activeItem, poinUtamaList: next });
        setDraggedPoinIdx(idx);
    };
    const handleDragEndPoin = () => setDraggedPoinIdx(null);

    const handleDragStartDok = (idx: number) => setDraggedDokIdx(idx);
    const handleDragOverDok = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (draggedDokIdx === null || draggedDokIdx === idx) return;
        const next = [...activeItem.dokumenList];
        const [dragged] = next.splice(draggedDokIdx, 1);
        next.splice(idx, 0, dragged);
        handleChange({ ...activeItem, dokumenList: next });
        setDraggedDokIdx(idx);
    };

    // Dokumen Pendukung Handlers
    const handleAddDokumen = () => {
        handleChange({
            ...activeItem,
            dokumenList: [
                ...activeItem.dokumenList,
                {
                    id: Date.now().toString(),
                    name: 'Dokumen Baru',
                    fileSize: '0 KB',
                    sourceType: 'url',
                    fileUrl: '#',
                },
            ],
        });
    };
    const handleDeleteDokumen = (id: string) => {
        handleChange({
            ...activeItem,
            dokumenList: activeItem.dokumenList.filter((d) => d.id !== id),
        });
    };
    const handleChangeDokumen = (
        id: string,
        updates: Partial<DokumenPendukung>,
    ) => {
        handleChange({
            ...activeItem,
            dokumenList: activeItem.dokumenList.map((d) =>
                d.id === id ? { ...d, ...updates } : d,
            ),
        });
    };

    const handleFileUploadDokumen = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        handleChangeDokumen(id, { uploading: true });

        // Simulasi proses upload 1.5 detik
        handleChangeDokumen(id, {
            uploading: false,
            fileName: file.name,
            fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            file: file,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadProgress(null);

        setUploadProgress(null);

        handleChange({
            ...activeItem,
            imageSrc: '',
            imageFileName: file.name,
            imagePreviewUrl: URL.createObjectURL(file),
            file: file,
        });
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleReset = () => {
        setItems(laporanKeuanganSection?.items || defaultItems);
        setActiveId(
            selectedId ||
                laporanKeuanganSection?.items?.[0]?.id ||
                defaultItems[0].id,
        );
        setSectionTitle(
            laporanKeuanganSection?.section_title || 'Laporan Keuangan',
        );
        setSectionDesc(
            laporanKeuanganSection?.section_desc ||
                'Ikhtisar performa finansial per kuartal dan tahunan.',
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data: any = {
                section_title: sectionTitle,
                section_desc: sectionDesc,
                items: items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    subtitle: item.subtitle,
                    date: item.date,
                    badge: item.badge,
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
                    poinUtamaList: (item.poinUtamaList || []).map((poin) => ({
                        id: poin.id,
                        text: poin.text,
                    })),
                    dokumenList: (item.dokumenList || []).map((doc) => ({
                        id: doc.id,
                        name: doc.name,
                        fileSize: doc.fileSize,
                        sourceType: doc.sourceType,
                        fileUrl:
                            doc.sourceType === 'upload'
                                ? doc.file
                                    ? ''
                                    : doc.fileUrl
                                : doc.fileUrl,
                        fileName: doc.fileName,
                        file:
                            doc.sourceType === 'upload' && doc.file
                                ? doc.file
                                : undefined,
                    })),
                })),
            };

            router.post(updateKeuangan.url(), data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    triggerToast(
                        'success',
                        'Laporan keuangan telah diperbarui.',
                    );
                },
                onError: (err) => {
                    console.error(
                        '[LaporanKeuanganEditor] Gagal menyimpan:',
                        err,
                    );
                    const errorMsg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                    );
                },
                onFinish: () => {
                    setIsSaving(false);
                },
            });
        } catch (err: any) {
            setIsSaving(false);
            console.error('[LaporanKeuanganEditor] Pre-submit error:', err);
            triggerToast(
                'error',
                `Terjadi kesalahan sebelum menyimpan: ${err.message || err}`,
            );
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-admin-primary shadow-lg shadow-admin-primary/20">
                    <FileBarChart size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-admin-text">
                        Laporan Keuangan
                    </h1>
                    <p className="mt-1 text-sm text-admin-text-muted">
                        Kelola section laporan keuangan yang tampil di halaman
                        laporan.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                <AnimeReveal
                    delay={100}
                    distance={20}
                    className="xl:col-span-7"
                >
                    <div className="overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card shadow-xl">
                        <div className="border-b border-admin-border bg-admin-bg/30 px-8 py-5">
                            <h2 className="text-sm font-bold tracking-widest text-admin-text uppercase">
                                Pengaturan Konten
                            </h2>
                        </div>
                        <form onSubmit={handleSave} className="p-8">
                            <div className="space-y-6 rounded-[2.5rem] border border-admin-border bg-admin-bg/50 p-6">
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
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Item Laporan ({items.length})
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleAdd}
                                                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                            >
                                                <Plus size={13} /> Tambah
                                            </button>
                                        </div>
                                        <div className="custom-scrollbar max-h-48 space-y-1.5 overflow-y-auto rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
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
                                                            {formatLaporanDate(
                                                                item.date,
                                                            )}
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
                                                            className="shrink-0 cursor-pointer rounded-lg p-1.5 text-admin-text-muted opacity-0 transition-all group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Editor Item Aktif */}
                            <div className="mt-6 rounded-[2.5rem] border border-admin-border bg-admin-card p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-sm font-bold tracking-widest text-admin-text uppercase">
                                        Detail Item Laporan
                                    </h3>
                                    <span className="rounded-lg bg-admin-accent/10 px-2.5 py-1 text-[10px] font-bold text-admin-accent">
                                        ID: {activeItem.id}
                                    </span>
                                </div>

                                <div className="mb-5 grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Badge Kuartal
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
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            placeholder="Q1 2025"
                                            required
                                        />
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
                                                onChange={(e) =>
                                                    handleChange({
                                                        ...activeItem,
                                                        date: e.target.value,
                                                    })
                                                }
                                                className="pointer-events-none invisible absolute"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-5 space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Laporan
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
                                <div className="mb-5 space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        value={activeItem.subtitle}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeItem,
                                                subtitle: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        required
                                    />
                                </div>

                                {/* Poin Utama Section */}
                                <div className="mb-5 space-y-3 border-t border-admin-border/50 pt-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Poin Utama & Bab Laporan (
                                            {activeItem.poinUtamaList.length})
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddPoin}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                        >
                                            <Plus size={13} /> Tambah Poin
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {activeItem.poinUtamaList.map(
                                            (poin, idx) => (
                                                <div
                                                    key={poin.id}
                                                    draggable
                                                    onDragStart={() =>
                                                        handleDragStartPoin(idx)
                                                    }
                                                    onDragOver={(e) =>
                                                        handleDragOverPoin(
                                                            e,
                                                            idx,
                                                        )
                                                    }
                                                    onDragEnd={
                                                        handleDragEndPoin
                                                    }
                                                    className={cn(
                                                        'group/item flex items-start gap-3 rounded-2xl border border-admin-border/60 bg-admin-bg/30 p-3',
                                                        draggedPoinIdx ===
                                                            idx &&
                                                            'scale-95 opacity-40',
                                                    )}
                                                >
                                                    <GripVertical
                                                        size={14}
                                                        className="mt-3 shrink-0 cursor-grab text-admin-text-muted/40 group-hover/item:text-admin-text-muted"
                                                    />
                                                    <div className="mt-2.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-admin-accent/10">
                                                        <CheckCircle2
                                                            size={12}
                                                            className="text-admin-accent"
                                                        />
                                                    </div>
                                                    <textarea
                                                        value={poin.text}
                                                        onChange={(e) =>
                                                            handleChangePoin(
                                                                poin.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows={2}
                                                        className="flex-1 resize-none border-b border-transparent bg-transparent text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent/50"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeletePoin(
                                                                poin.id,
                                                            )
                                                        }
                                                        className="mt-1 shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Dokumen Pendukung Section */}
                                <div className="mb-5 space-y-3 border-t border-admin-border/50 pt-4">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            <FileText
                                                size={14}
                                                className="text-admin-accent"
                                            />
                                            Dokumen Pendukung (
                                            {activeItem.dokumenList.length})
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddDokumen}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                        >
                                            <Plus size={13} /> Tambah Dokumen
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {activeItem.dokumenList.map(
                                            (dok, idx) => (
                                                <div
                                                    key={dok.id}
                                                    draggable
                                                    onDragStart={() =>
                                                        handleDragStartDok(idx)
                                                    }
                                                    onDragOver={(e) =>
                                                        handleDragOverDok(
                                                            e,
                                                            idx,
                                                        )
                                                    }
                                                    onDragEnd={() =>
                                                        setDraggedDokIdx(null)
                                                    }
                                                    className={cn(
                                                        'group/dok space-y-4 rounded-2xl border border-admin-border/60 bg-admin-bg/30 p-5',
                                                        draggedDokIdx === idx &&
                                                            'scale-95 opacity-40',
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical
                                                            size={14}
                                                            className="cursor-grab text-admin-text-muted/40 group-hover/dok:text-admin-text-muted"
                                                        />
                                                        <span className="flex-1 text-xs font-bold tracking-widest text-admin-accent uppercase">
                                                            Dokumen #{idx + 1}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteDokumen(
                                                                    dok.id,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg p-1 text-admin-text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                                                Nama Dokumen
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={dok.name}
                                                                onChange={(e) =>
                                                                    handleChangeDokumen(
                                                                        dok.id,
                                                                        {
                                                                            name: e
                                                                                .target
                                                                                .value,
                                                                        },
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-xs font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                                                Ukuran File
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    dok.fileSize
                                                                }
                                                                onChange={(e) =>
                                                                    handleChangeDokumen(
                                                                        dok.id,
                                                                        {
                                                                            fileSize:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2.5 text-xs font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                                placeholder="12.4 MB"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Source toggle */}
                                                    <div className="space-y-2">
                                                        <div className="flex w-fit rounded-lg border border-admin-border bg-admin-bg p-1">
                                                            {(
                                                                [
                                                                    'url',
                                                                    'upload',
                                                                ] as const
                                                            ).map((st) => (
                                                                <button
                                                                    key={st}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleChangeDokumen(
                                                                            dok.id,
                                                                            {
                                                                                sourceType:
                                                                                    st,
                                                                            },
                                                                        )
                                                                    }
                                                                    className={cn(
                                                                        'flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-1.5 text-[10px] font-bold transition-all',
                                                                        dok.sourceType ===
                                                                            st
                                                                            ? 'bg-admin-accent text-white shadow-sm'
                                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                                    )}
                                                                >
                                                                    {st ===
                                                                    'url' ? (
                                                                        <LinkIcon
                                                                            size={
                                                                                10
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <UploadCloud
                                                                            size={
                                                                                10
                                                                            }
                                                                        />
                                                                    )}
                                                                    {st ===
                                                                    'url'
                                                                        ? 'URL File'
                                                                        : 'Unggah File'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {dok.sourceType ===
                                                        'url' ? (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    dok.fileUrl
                                                                }
                                                                onChange={(e) =>
                                                                    handleChangeDokumen(
                                                                        dok.id,
                                                                        {
                                                                            fileUrl:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-3 py-2.5 font-mono text-[10px] text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                                placeholder="/assets/... atau https://..."
                                                                required
                                                            />
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div
                                                                    onClick={() =>
                                                                        fileRefs.current[
                                                                            dok
                                                                                .id
                                                                        ]?.click()
                                                                    }
                                                                    className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-4 transition-all hover:border-admin-accent/50"
                                                                >
                                                                    <input
                                                                        ref={(
                                                                            el,
                                                                        ) => {
                                                                            fileRefs.current[
                                                                                dok.id
                                                                            ] =
                                                                                el;
                                                                        }}
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            handleFileUploadDokumen(
                                                                                dok.id,
                                                                                e,
                                                                            )
                                                                        }
                                                                        className="hidden"
                                                                    />
                                                                    {dok.uploading ? (
                                                                        <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                                                            <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                                            Memproses
                                                                            file
                                                                            dokumen...
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <UploadCloud
                                                                                size={
                                                                                    22
                                                                                }
                                                                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                                            />
                                                                            <p className="text-[10px] font-bold text-admin-text">
                                                                                Pilih
                                                                                file
                                                                                PDF
                                                                                /
                                                                                DOC
                                                                                /
                                                                                ZIP
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                {dok.fileName &&
                                                                    !dok.uploading && (
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                                            <CheckCircle2
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                            {
                                                                                dok.fileName
                                                                            }{' '}
                                                                            berhasil
                                                                            dimuat
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Gambar Cover */}
                                <div className="mt-5 space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-admin-text">
                                            Gambar Cover
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
                                                        <div className="h-1.5 overflow-hidden rounded-full bg-admin-border">
                                                            <div
                                                                className="h-full bg-admin-accent transition-all duration-300"
                                                                style={{
                                                                    width: `${uploadProgress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                    <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-admin-border/50">
                                        <img
                                            src={displayUrl}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src =
                                                    `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(activeItem.badge)}`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute top-3 left-3 rounded bg-admin-accent/90 px-2 py-1 text-[10px] font-bold text-white">
                                            {activeItem.badge}
                                        </div>
                                        <div className="absolute bottom-3 left-4">
                                            <p className="line-clamp-1 text-xs font-bold text-white">
                                                {activeItem.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4 border-t border-admin-border pt-4">
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

                {/* Preview */}
                <div className="mt-8 space-y-6 xl:col-span-5 xl:mt-0">
                    <AnimeReveal delay={250} distance={20} direction="up">
                        <div className="relative flex h-[750px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                            <div className="mb-4 flex shrink-0 items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Eye
                                        size={16}
                                        className="text-admin-accent"
                                    />
                                    <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                        Preview Tampilan
                                    </span>
                                </div>
                                <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                    Aktif
                                </span>
                            </div>

                            <div className="mb-4 flex shrink-0 rounded-xl bg-admin-bg/50 p-1">
                                <button
                                    onClick={() => setPreviewMode('list')}
                                    className={cn(
                                        'flex-1 rounded-lg py-2 text-xs font-bold transition-all',
                                        previewMode === 'list'
                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                            : 'text-admin-text-muted hover:text-admin-text',
                                    )}
                                >
                                    Laporan Keuangan
                                </button>
                                <button
                                    onClick={() => setPreviewMode('detail')}
                                    className={cn(
                                        'flex-1 rounded-lg py-2 text-xs font-bold transition-all',
                                        previewMode === 'detail'
                                            ? 'bg-admin-card text-admin-accent shadow-sm'
                                            : 'text-admin-text-muted hover:text-admin-text',
                                    )}
                                >
                                    Detail Laporan
                                </button>
                            </div>

                            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
                                {previewMode === 'list' ? (
                                    <>
                                        <div className="mb-3">
                                            <h2 className="relative inline-block text-sm font-bold text-admin-text">
                                                {sectionTitle}
                                                <span className="absolute -bottom-1 left-0 h-0.5 w-10 rounded-full bg-admin-accent" />
                                            </h2>
                                            <p className="mt-2 text-[10px] text-admin-text-muted">
                                                {sectionDesc}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {items.map((item) => {
                                                const isActive =
                                                    item.id === activeId;
                                                const thumb =
                                                    item.imagePreviewUrl ||
                                                    item.imageSrc;
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
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        `https://placehold.co/300x200/0d2e2e/ffffff?text=${encodeURIComponent(item.badge)}`;
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                            <span className="absolute top-1.5 left-1.5 rounded bg-admin-accent/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                                {item.badge}
                                                            </span>
                                                        </div>
                                                        <div className="bg-admin-bg/30 p-2">
                                                            <p className="line-clamp-1 text-[10px] font-bold text-admin-text">
                                                                {item.title}
                                                            </p>
                                                            <p className="mt-0.5 text-[9px] text-admin-text-muted/60">
                                                                {formatLaporanDate(
                                                                    item.date,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4">
                                            <div className="relative h-32 overflow-hidden rounded-xl border border-admin-border/50">
                                                <img
                                                    src={displayUrl}
                                                    alt={activeItem.title}
                                                    className="h-full w-full object-cover opacity-80"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(activeItem.badge)}`;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                                <div className="absolute right-3 bottom-3 left-3">
                                                    <span className="mb-1 inline-block rounded bg-admin-accent/90 px-1.5 py-0.5 text-[8px] font-bold text-white">
                                                        {activeItem.badge}
                                                    </span>
                                                    <h2 className="line-clamp-2 text-xs font-bold text-white">
                                                        {activeItem.title}
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 space-y-2">
                                            <h3 className="border-b border-admin-border pb-1 text-[10px] font-bold tracking-widest text-admin-text uppercase">
                                                Deskripsi Laporan
                                            </h3>
                                            <p className="text-[11px] leading-relaxed text-admin-text-muted">
                                                {activeItem.subtitle}
                                            </p>
                                        </div>

                                        {activeItem.poinUtamaList.length >
                                            0 && (
                                            <div className="mb-4 space-y-2">
                                                <h3 className="border-b border-admin-border pb-1 text-[10px] font-bold tracking-widest text-admin-text uppercase">
                                                    Poin Utama & Bab Laporan
                                                </h3>
                                                <div className="space-y-2.5">
                                                    {activeItem.poinUtamaList.map(
                                                        (poin) => (
                                                            <div
                                                                key={poin.id}
                                                                className="flex items-start gap-2"
                                                            >
                                                                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-admin-accent/10">
                                                                    <CheckCircle2
                                                                        size={
                                                                            10
                                                                        }
                                                                        className="text-admin-accent"
                                                                    />
                                                                </div>
                                                                <p className="text-[10px] leading-relaxed text-admin-text-muted">
                                                                    {poin.text}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {activeItem.dokumenList.length > 0 && (
                                            <div className="mb-4 space-y-2">
                                                <h3 className="border-b border-admin-border pb-1 text-[10px] font-bold tracking-widest text-admin-text uppercase">
                                                    Dokumen Pendukung
                                                </h3>
                                                <div className="space-y-2">
                                                    {activeItem.dokumenList.map(
                                                        (dok) => (
                                                            <div
                                                                key={dok.id}
                                                                className="flex items-center gap-2 rounded-lg border border-admin-border/50 bg-admin-bg/30 p-2"
                                                            >
                                                                <FileText
                                                                    size={14}
                                                                    className="shrink-0 text-admin-accent"
                                                                />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-[10px] font-bold text-admin-text">
                                                                        {
                                                                            dok.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[8px] text-admin-text-muted">
                                                                        {
                                                                            dok.fileSize
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                                <span>MOCKUP PREVIEW</span>
                                <span>REAL-TIME SYNC</span>
                            </div>
                        </div>
                    </AnimeReveal>
                </div>
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
