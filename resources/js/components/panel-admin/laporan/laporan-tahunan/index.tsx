import { useCmsSave } from '@/hooks/use-cms-save';
import { useState, useRef } from 'react';
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
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';
import { update as updateTahunan } from '@/routes/panel-admin/laporan/tahunan-section';

export interface AnnualReportItem {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    imageSrc: string;
    fileUrl: string;
    fileSize: string;
    imageSourceType?: 'url' | 'upload';
    fileSourceType?: 'url' | 'upload';
    imageFile?: File | null;
    docFile?: File | null;
    imagePreviewUrl?: string;
    docPreviewUrl?: string;
    imageFileName?: string;
    fileName?: string;
}

export interface KeberlanjutanItem {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    imageSrc: string;
    fileUrl: string;
    fileSize: string;
    imageSourceType?: 'url' | 'upload';
    fileSourceType?: 'url' | 'upload';
    imageFile?: File | null;
    docFile?: File | null;
    imagePreviewUrl?: string;
    docPreviewUrl?: string;
    imageFileName?: string;
    fileName?: string;
}

export interface LaporanTahunanSectionData {
    section_title: string;
    section_desc: string;
    annual_reports: AnnualReportItem[];
    keberlanjutan_items: KeberlanjutanItem[];
}

interface LaporanTahunanEditorProps {
    selectedId?: string;
    selectedCollection?: string;
    recordMode?: boolean;
    laporanTahunanSection?: LaporanTahunanSectionData | null;
}

const defaultAnnual: AnnualReportItem[] = [
    {
        id: '1',
        title: 'Annual Report 2023: Powering Digital Batam',
        subtitle:
            'Tinjauan mendalam tentang transformasi infrastruktur energi untuk mendukung pertumbuhan pusat data dan industri teknologi di Kepulauan Riau.',
        badge: 'BEST IN ENERGY SECTOR',
        imageSrc: '/assets/pengadaan/items/item2.png',
        fileUrl: '#',
        fileSize: '24.500 MB',
        imageSourceType: 'url',
        fileSourceType: 'url',
    },
    {
        id: '2',
        title: 'Annual Report 2022: Resilient Energy',
        subtitle:
            'Bagaimana kami beradaptasi dan tetap tangguh dalam menyediakan energi yang handal di tengah tantangan ekonomi global pasca-pandemi.',
        badge: 'LEGACY & INNOVATION',
        imageSrc: '/assets/pengadaan/items/item4.png',
        fileUrl: '#',
        fileSize: '18.2 MB',
        imageSourceType: 'url',
        fileSourceType: 'url',
    },
];

const defaultKeberlanjutan: KeberlanjutanItem[] = [
    {
        id: '1',
        title: 'Sustainability Report 2023',
        subtitle: 'Green Energy Initiatives',
        badge: 'SUSTAINABILITY',
        imageSrc:
            'https://placehold.co/400x600/0d2e2e/ffffff?text=Sustainability',
        fileUrl: '#',
        fileSize: '12.4 MB',
        imageSourceType: 'url',
        fileSourceType: 'url',
    },
    {
        id: '2',
        title: 'Tata Kelola Perusahaan (GCG)',
        subtitle: 'Pedoman Etika & Integritas',
        badge: 'GOVERNANCE',
        imageSrc: 'https://placehold.co/400x600/0d2e2e/ffffff?text=GCG',
        fileUrl: '#',
        fileSize: '8.1 MB',
        imageSourceType: 'url',
        fileSourceType: 'url',
    },
    {
        id: '3',
        title: 'Laporan CSR 2023',
        subtitle: 'Pemberdayaan Masyarakat Lokal',
        badge: 'CSR',
        imageSrc: 'https://placehold.co/400x600/0d2e2e/ffffff?text=CSR',
        fileUrl: '#',
        fileSize: '15.6 MB',
        imageSourceType: 'url',
        fileSourceType: 'url',
    },
];

export default function LaporanTahunanEditor({
    laporanTahunanSection,
    selectedId,
    recordMode = false,
    selectedCollection,
}: LaporanTahunanEditorProps = {}) {
    const [sectionTitle, setSectionTitle] = useState(
        laporanTahunanSection?.section_title || 'Laporan Tahunan & Publikasi',
    );
    const [sectionDesc, setSectionDesc] = useState(
        laporanTahunanSection?.section_desc ||
            'Akses laporan tahunan dan dokumen keberlanjutan PEB.',
    );
    const [annualReports, setAnnualReports] = useState<AnnualReportItem[]>(
        laporanTahunanSection?.annual_reports || defaultAnnual,
    );
    const [keberlanjutan, setKeberlanjutan] = useState<KeberlanjutanItem[]>(
        laporanTahunanSection?.keberlanjutan_items || defaultKeberlanjutan,
    );

    const [activeTab, setActiveTab] = useState<'annual' | 'keberlanjutan'>(
        selectedCollection === 'keberlanjutan_items'
            ? 'keberlanjutan'
            : 'annual',
    );
    const [activeAnnualId, setActiveAnnualId] = useState(
        (selectedCollection !== 'keberlanjutan_items'
            ? selectedId
            : undefined) ||
            laporanTahunanSection?.annual_reports?.[0]?.id ||
            defaultAnnual[0].id,
    );
    const [activeKebId, setActiveKebId] = useState(
        (selectedCollection === 'keberlanjutan_items'
            ? selectedId
            : undefined) ||
            laporanTahunanSection?.keberlanjutan_items?.[0]?.id ||
            defaultKeberlanjutan[0].id,
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Laporan tahunan telah diperbarui.',
    );

    const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const activeAnnual =
        annualReports.find((i) => i.id === activeAnnualId) ?? annualReports[0];
    const activeKeb =
        keberlanjutan.find((i) => i.id === activeKebId) ?? keberlanjutan[0];

    const handleChangeAnnual = (updated: AnnualReportItem) =>
        setAnnualReports((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i)),
        );
    const handleChangeKeb = (updated: KeberlanjutanItem) =>
        setKeberlanjutan((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i)),
        );

    const handleAddAnnual = () => {
        const newItem: AnnualReportItem = {
            id: Date.now().toString(),
            title: 'Annual Report Baru',
            subtitle: 'Deskripsi laporan tahunan...',
            badge: 'NEW REPORT',
            imageSrc: 'https://placehold.co/400x600/0d2e2e/ffffff?text=Annual',
            fileUrl: '#',
            fileSize: '0 MB',
            imageSourceType: 'url',
            fileSourceType: 'url',
        };
        setAnnualReports((prev) => [...prev, newItem]);
        setActiveAnnualId(newItem.id);
    };

    const handleAddKeb = () => {
        const newItem: KeberlanjutanItem = {
            id: Date.now().toString(),
            title: 'Publikasi Baru',
            subtitle: 'Kategori publikasi...',
            badge: 'NEW',
            imageSrc:
                'https://placehold.co/400x600/0d2e2e/ffffff?text=Publikasi',
            fileUrl: '#',
            fileSize: '0 MB',
            imageSourceType: 'url',
            fileSourceType: 'url',
        };
        setKeberlanjutan((prev) => [...prev, newItem]);
        setActiveKebId(newItem.id);
    };

    const handleDeleteAnnual = (id: string) => {
        if (annualReports.length <= 1) return;
        const remaining = annualReports.filter((i) => i.id !== id);
        setAnnualReports(remaining);
        if (activeAnnualId === id) setActiveAnnualId(remaining[0].id);
    };

    const handleDeleteKeb = (id: string) => {
        if (keberlanjutan.length <= 1) return;
        const remaining = keberlanjutan.filter((i) => i.id !== id);
        setKeberlanjutan(remaining);
        if (activeKebId === id) setActiveKebId(remaining[0].id);
    };

    const handleDragStart = (index: number) => setDraggedIndex(index);
    const handleDragOver = (
        e: React.DragEvent,
        index: number,
        type: 'annual' | 'keb',
    ) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        if (type === 'annual') {
            setAnnualReports((prev) => {
                const next = [...prev];
                const [d] = next.splice(draggedIndex, 1);
                next.splice(index, 0, d);
                return next;
            });
        } else {
            setKeberlanjutan((prev) => {
                const next = [...prev];
                const [d] = next.splice(draggedIndex, 1);
                next.splice(index, 0, d);
                return next;
            });
        }
        setDraggedIndex(index);
    };
    const handleDragEnd = () => setDraggedIndex(null);

    const handleReset = () => {
        setAnnualReports(
            laporanTahunanSection?.annual_reports || defaultAnnual,
        );
        setKeberlanjutan(
            laporanTahunanSection?.keberlanjutan_items || defaultKeberlanjutan,
        );
        setSectionTitle(
            laporanTahunanSection?.section_title ||
                'Laporan Tahunan & Publikasi',
        );
        setSectionDesc(
            laporanTahunanSection?.section_desc ||
                'Akses laporan tahunan dan dokumen keberlanjutan PEB.',
        );
        if (laporanTahunanSection?.annual_reports?.[0]) {
            setActiveAnnualId(
                (selectedCollection !== 'keberlanjutan_items'
                    ? selectedId
                    : undefined) || laporanTahunanSection.annual_reports[0].id,
            );
        }
        if (laporanTahunanSection?.keberlanjutan_items?.[0]) {
            setActiveKebId(
                (selectedCollection === 'keberlanjutan_items'
                    ? selectedId
                    : undefined) ||
                    laporanTahunanSection.keberlanjutan_items[0].id,
            );
        }
    };

    const triggerFileSelect = (key: string) => {
        fileRefs.current[key]?.click();
    };

    const handleUploadAnnualImage = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const currentItem = annualReports.find((i) => i.id === id);
        if (currentItem) {
            handleChangeAnnual({
                ...currentItem,
                imageFileName: file.name,
                imagePreviewUrl: URL.createObjectURL(file),
                imageFile: file,
                imageSrc: '',
            });
        }
    };

    const handleUploadAnnualDoc = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const currentItem = annualReports.find((i) => i.id === id);
        if (currentItem) {
            handleChangeAnnual({
                ...currentItem,
                fileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                docPreviewUrl: file.name,
                docFile: file,
                fileUrl: '',
            });
        }
    };

    const handleUploadKebImage = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const currentItem = keberlanjutan.find((i) => i.id === id);
        if (currentItem) {
            handleChangeKeb({
                ...currentItem,
                imageFileName: file.name,
                imagePreviewUrl: URL.createObjectURL(file),
                imageFile: file,
                imageSrc: '',
            });
        }
    };

    const handleUploadKebDoc = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const currentItem = keberlanjutan.find((i) => i.id === id);
        if (currentItem) {
            handleChangeKeb({
                ...currentItem,
                fileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                docPreviewUrl: file.name,
                docFile: file,
                fileUrl: '',
            });
        }
    };

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data: any = {
                section_title: sectionTitle,
                section_desc: sectionDesc,
                annual_reports: annualReports.map((item) => ({
                    id: item.id,
                    title: item.title,
                    subtitle: item.subtitle,
                    badge: item.badge,
                    imageSrc:
                        item.imageSourceType === 'upload'
                            ? item.imageFile
                                ? ''
                                : item.imageSrc
                            : item.imageSrc,
                    fileUrl:
                        item.fileSourceType === 'upload'
                            ? item.docFile
                                ? ''
                                : item.fileUrl
                            : item.fileUrl,
                    fileSize: item.fileSize,
                    imageSourceType: item.imageSourceType || 'url',
                    fileSourceType: item.fileSourceType || 'url',
                    imageFileName: item.imageFileName,
                    fileName: item.fileName,
                    imageFile:
                        item.imageSourceType === 'upload' && item.imageFile
                            ? item.imageFile
                            : undefined,
                    docFile:
                        item.fileSourceType === 'upload' && item.docFile
                            ? item.docFile
                            : undefined,
                })),
                keberlanjutan_items: keberlanjutan.map((item) => ({
                    id: item.id,
                    title: item.title,
                    subtitle: item.subtitle,
                    badge: item.badge,
                    imageSrc:
                        item.imageSourceType === 'upload'
                            ? item.imageFile
                                ? ''
                                : item.imageSrc
                            : item.imageSrc,
                    fileUrl:
                        item.fileSourceType === 'upload'
                            ? item.docFile
                                ? ''
                                : item.fileUrl
                            : item.fileUrl,
                    fileSize: item.fileSize,
                    imageSourceType: item.imageSourceType || 'url',
                    fileSourceType: item.fileSourceType || 'url',
                    imageFileName: item.imageFileName,
                    fileName: item.fileName,
                    imageFile:
                        item.imageSourceType === 'upload' && item.imageFile
                            ? item.imageFile
                            : undefined,
                    docFile:
                        item.fileSourceType === 'upload' && item.docFile
                            ? item.docFile
                            : undefined,
                })),
            };

            router.post(updateTahunan.url(), data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    triggerToast(
                        'success',
                        'Laporan tahunan telah diperbarui.',
                    );
                },
                onError: (err) => {
                    console.error(
                        '[LaporanTahunanEditor] Gagal menyimpan:',
                        err,
                    );
                    const errorMsg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                    );
                },
                onFinish: () => {
                    setIsSaving(false);
                },
            });
        } catch (err: any) {
            setIsSaving(false);
            console.error('[LaporanTahunanEditor] Pre-submit error:', err);
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
                        Laporan Tahunan & Publikasi
                    </h1>
                    <p className="mt-1 text-sm text-admin-text-muted">
                        Kelola data section laporan tahunan dan publikasi
                        keberlanjutan yang tampil di halaman laporan.
                    </p>
                </div>
            </div>

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
                                        Pengaturan Konten
                                    </h3>
                                </div>
                            </div>
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Judul & Deskripsi Section */}
                                <div className="space-y-6 rounded-[2.5rem] border border-admin-border bg-admin-bg/50 p-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Judul Section
                                        </label>
                                        <input
                                            type="text"
                                            value={sectionTitle}
                                            onChange={(e) =>
                                                setSectionTitle(e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Deskripsi Section
                                        </label>
                                        <input
                                            type="text"
                                            value={sectionDesc}
                                            onChange={(e) =>
                                                setSectionDesc(e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                </div>

                                {!recordMode && (
                                    <>
                                        {/* Tab Selector */}
                                        <div className="flex gap-2 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                            {(
                                                [
                                                    'annual',
                                                    'keberlanjutan',
                                                ] as const
                                            ).map((tab) => (
                                                <button
                                                    key={tab}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveTab(tab)
                                                    }
                                                    className={cn(
                                                        'flex-1 cursor-pointer rounded-xl py-2.5 text-xs font-bold transition-all',
                                                        activeTab === tab
                                                            ? 'border border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    {tab === 'annual'
                                                        ? 'Annual Report'
                                                        : 'Publikasi Keberlanjutan'}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {/* Annual Report Tab */}
                                {activeTab === 'annual' && activeAnnual && (
                                    <div className="space-y-4">
                                        {!recordMode && (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                        Annual Report (
                                                        {annualReports.length})
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleAddAnnual
                                                        }
                                                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                                    >
                                                        <Plus size={13} />{' '}
                                                        Tambah
                                                    </button>
                                                </div>
                                                <div className="space-y-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                                    {annualReports.map(
                                                        (item, idx) => (
                                                            <div
                                                                key={item.id}
                                                                draggable
                                                                onDragStart={() =>
                                                                    handleDragStart(
                                                                        idx,
                                                                    )
                                                                }
                                                                onDragOver={(
                                                                    e,
                                                                ) =>
                                                                    handleDragOver(
                                                                        e,
                                                                        idx,
                                                                        'annual',
                                                                    )
                                                                }
                                                                onDragEnd={
                                                                    handleDragEnd
                                                                }
                                                                onClick={() =>
                                                                    setActiveAnnualId(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none',
                                                                    activeAnnualId ===
                                                                        item.id
                                                                        ? 'border border-admin-accent/30 bg-admin-card shadow-sm'
                                                                        : 'border border-transparent hover:bg-admin-card/60',
                                                                    draggedIndex ===
                                                                        idx &&
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
                                                                        activeAnnualId ===
                                                                            item.id
                                                                            ? 'bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]'
                                                                            : 'bg-admin-text-muted/30',
                                                                    )}
                                                                />
                                                                <div className="min-w-0 flex-1">
                                                                    <p
                                                                        className={cn(
                                                                            'truncate text-xs font-bold',
                                                                            activeAnnualId ===
                                                                                item.id
                                                                                ? 'text-admin-accent'
                                                                                : 'text-admin-text-muted',
                                                                        )}
                                                                    >
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-admin-text-muted/60">
                                                                        {
                                                                            item.badge
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {annualReports.length >
                                                                    1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteAnnual(
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
                                                        ),
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {/* Editor Annual Aktif */}
                                        <div className="space-y-5 border-t border-admin-border/50 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                                <span className="text-xs font-bold tracking-widest text-admin-accent uppercase">
                                                    Mengedit:{' '}
                                                    {activeAnnual.title}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                        Badge
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            activeAnnual.badge
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeAnnual({
                                                                ...activeAnnual,
                                                                badge: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                        Ukuran File PDF
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            activeAnnual.fileSize
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeAnnual({
                                                                ...activeAnnual,
                                                                fileSize:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        placeholder="24.500 MB"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Judul
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeAnnual.title}
                                                    onChange={(e) =>
                                                        handleChangeAnnual({
                                                            ...activeAnnual,
                                                            title: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Deskripsi
                                                </label>
                                                <textarea
                                                    value={
                                                        activeAnnual.subtitle
                                                    }
                                                    onChange={(e) =>
                                                        handleChangeAnnual({
                                                            ...activeAnnual,
                                                            subtitle:
                                                                e.target.value,
                                                        })
                                                    }
                                                    rows={3}
                                                    className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    required
                                                />
                                            </div>

                                            {/* Cover Image Block */}
                                            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-admin-text">
                                                        Gambar Cover
                                                    </label>
                                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
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
                                                                    handleChangeAnnual(
                                                                        {
                                                                            ...activeAnnual,
                                                                            imageSourceType:
                                                                                st,
                                                                        },
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                                    (activeAnnual.imageSourceType ||
                                                                        'url') ===
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
                                                                {st === 'url'
                                                                    ? 'URL'
                                                                    : 'Unggah'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {(activeAnnual.imageSourceType ||
                                                    'url') === 'url' ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            activeAnnual.imageSrc
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeAnnual({
                                                                ...activeAnnual,
                                                                imageSrc:
                                                                    e.target
                                                                        .value,
                                                                imagePreviewUrl:
                                                                    undefined,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        placeholder="/assets/... atau https://..."
                                                        required
                                                    />
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div
                                                            onClick={() =>
                                                                triggerFileSelect(
                                                                    `annual-cover-${activeAnnual.id}`,
                                                                )
                                                            }
                                                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-4 transition-all hover:border-admin-accent/50"
                                                        >
                                                            <input
                                                                ref={(el) => {
                                                                    fileRefs.current[
                                                                        `annual-cover-${activeAnnual.id}`
                                                                    ] = el;
                                                                }}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) =>
                                                                    handleUploadAnnualImage(
                                                                        activeAnnual.id,
                                                                        e,
                                                                    )
                                                                }
                                                                className="hidden"
                                                            />
                                                            <UploadCloud
                                                                size={22}
                                                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                            />
                                                            <p className="text-[10px] font-bold text-admin-text">
                                                                Pilih berkas
                                                                gambar cover
                                                            </p>
                                                        </div>
                                                        {(activeAnnual.imageFileName ||
                                                            activeAnnual.imagePreviewUrl) && (
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                                <CheckCircle2
                                                                    size={12}
                                                                />
                                                                {activeAnnual.imageFileName ||
                                                                    'Gambar dipilih'}{' '}
                                                                berhasil dimuat
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Document Laporan Block */}
                                            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-admin-text">
                                                        Dokumen Laporan
                                                        (PDF/ZIP)
                                                    </label>
                                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
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
                                                                    handleChangeAnnual(
                                                                        {
                                                                            ...activeAnnual,
                                                                            fileSourceType:
                                                                                st,
                                                                        },
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                                    (activeAnnual.fileSourceType ||
                                                                        'url') ===
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
                                                                {st === 'url'
                                                                    ? 'URL'
                                                                    : 'Unggah'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {(activeAnnual.fileSourceType ||
                                                    'url') === 'url' ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            activeAnnual.fileUrl
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeAnnual({
                                                                ...activeAnnual,
                                                                fileUrl:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        placeholder="/assets/... atau https://..."
                                                        required
                                                    />
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div
                                                            onClick={() =>
                                                                triggerFileSelect(
                                                                    `annual-doc-${activeAnnual.id}`,
                                                                )
                                                            }
                                                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-4 transition-all hover:border-admin-accent/50"
                                                        >
                                                            <input
                                                                ref={(el) => {
                                                                    fileRefs.current[
                                                                        `annual-doc-${activeAnnual.id}`
                                                                    ] = el;
                                                                }}
                                                                type="file"
                                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                                                onChange={(e) =>
                                                                    handleUploadAnnualDoc(
                                                                        activeAnnual.id,
                                                                        e,
                                                                    )
                                                                }
                                                                className="hidden"
                                                            />
                                                            <UploadCloud
                                                                size={22}
                                                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                            />
                                                            <p className="text-[10px] font-bold text-admin-text">
                                                                Pilih berkas PDF
                                                                Laporan
                                                            </p>
                                                        </div>
                                                        {(activeAnnual.fileName ||
                                                            activeAnnual.docPreviewUrl) && (
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                                <CheckCircle2
                                                                    size={12}
                                                                />
                                                                {activeAnnual.fileName ||
                                                                    'Dokumen dipilih'}{' '}
                                                                berhasil dimuat
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Keberlanjutan Tab */}
                                {activeTab === 'keberlanjutan' && activeKeb && (
                                    <div className="space-y-4">
                                        {!recordMode && (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                        Publikasi (
                                                        {keberlanjutan.length})
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddKeb}
                                                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                                    >
                                                        <Plus size={13} />{' '}
                                                        Tambah
                                                    </button>
                                                </div>
                                                <div className="space-y-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                                    {keberlanjutan.map(
                                                        (item, idx) => (
                                                            <div
                                                                key={item.id}
                                                                draggable
                                                                onDragStart={() =>
                                                                    handleDragStart(
                                                                        idx,
                                                                    )
                                                                }
                                                                onDragOver={(
                                                                    e,
                                                                ) =>
                                                                    handleDragOver(
                                                                        e,
                                                                        idx,
                                                                        'keb',
                                                                    )
                                                                }
                                                                onDragEnd={
                                                                    handleDragEnd
                                                                }
                                                                onClick={() =>
                                                                    setActiveKebId(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none',
                                                                    activeKebId ===
                                                                        item.id
                                                                        ? 'border border-admin-accent/30 bg-admin-card shadow-sm'
                                                                        : 'border border-transparent hover:bg-admin-card/60',
                                                                    draggedIndex ===
                                                                        idx &&
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
                                                                        activeKebId ===
                                                                            item.id
                                                                            ? 'bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]'
                                                                            : 'bg-admin-text-muted/30',
                                                                    )}
                                                                />
                                                                <div className="min-w-0 flex-1">
                                                                    <p
                                                                        className={cn(
                                                                            'truncate text-xs font-bold',
                                                                            activeKebId ===
                                                                                item.id
                                                                                ? 'text-admin-accent'
                                                                                : 'text-admin-text-muted',
                                                                        )}
                                                                    >
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-admin-text-muted/60">
                                                                        {
                                                                            item.subtitle
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {keberlanjutan.length >
                                                                    1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteKeb(
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
                                                        ),
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {/* Editor Keb Aktif */}
                                        <div className="space-y-5 border-t border-admin-border/50 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                                <span className="text-xs font-bold tracking-widest text-admin-accent uppercase">
                                                    Mengedit: {activeKeb.title}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                        Judul Publikasi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={activeKeb.title}
                                                        onChange={(e) =>
                                                            handleChangeKeb({
                                                                ...activeKeb,
                                                                title: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                        Ukuran File PDF
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            activeKeb.fileSize
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeKeb({
                                                                ...activeKeb,
                                                                fileSize:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        placeholder="12.4 MB"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Subtitle / Kategori
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeKeb.subtitle}
                                                    onChange={(e) =>
                                                        handleChangeKeb({
                                                            ...activeKeb,
                                                            subtitle:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Badge
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeKeb.badge}
                                                    onChange={(e) =>
                                                        handleChangeKeb({
                                                            ...activeKeb,
                                                            badge: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text uppercase outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="NEW"
                                                    required
                                                />
                                            </div>

                                            {/* Keb Cover Block */}
                                            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-admin-text">
                                                        Cover Image (Opsional)
                                                    </label>
                                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
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
                                                                    handleChangeKeb(
                                                                        {
                                                                            ...activeKeb,
                                                                            imageSourceType:
                                                                                st,
                                                                        },
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                                    (activeKeb.imageSourceType ||
                                                                        'url') ===
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
                                                                {st === 'url'
                                                                    ? 'URL'
                                                                    : 'Unggah'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {(activeKeb.imageSourceType ||
                                                    'url') === 'url' ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            activeKeb.imageSrc
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeKeb({
                                                                ...activeKeb,
                                                                imageSrc:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        placeholder="https://..."
                                                    />
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div
                                                            onClick={() =>
                                                                triggerFileSelect(
                                                                    `keb-image-${activeKeb.id}`,
                                                                )
                                                            }
                                                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-4 transition-all hover:border-admin-accent/50"
                                                        >
                                                            <input
                                                                ref={(el) => {
                                                                    fileRefs.current[
                                                                        `keb-image-${activeKeb.id}`
                                                                    ] = el;
                                                                }}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) =>
                                                                    handleUploadKebImage(
                                                                        activeKeb.id,
                                                                        e,
                                                                    )
                                                                }
                                                                className="hidden"
                                                            />
                                                            <UploadCloud
                                                                size={22}
                                                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                            />
                                                            <p className="text-[10px] font-bold text-admin-text">
                                                                Pilih gambar
                                                                cover (.jpg,
                                                                .png, .webp)
                                                            </p>
                                                        </div>
                                                        {(activeKeb.imageFileName ||
                                                            activeKeb.imagePreviewUrl) && (
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                                <CheckCircle2
                                                                    size={12}
                                                                />
                                                                {activeKeb.imageFileName ||
                                                                    'Gambar dipilih'}{' '}
                                                                berhasil dimuat
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Keb Doc Block */}
                                            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-admin-text">
                                                        Dokumen Laporan
                                                        (PDF/ZIP)
                                                    </label>
                                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
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
                                                                    handleChangeKeb(
                                                                        {
                                                                            ...activeKeb,
                                                                            fileSourceType:
                                                                                st,
                                                                        },
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                                    (activeKeb.fileSourceType ||
                                                                        'url') ===
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
                                                                {st === 'url'
                                                                    ? 'URL'
                                                                    : 'Unggah'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {(activeKeb.fileSourceType ||
                                                    'url') === 'url' ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            activeKeb.fileUrl
                                                        }
                                                        onChange={(e) =>
                                                            handleChangeKeb({
                                                                ...activeKeb,
                                                                fileUrl:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                        placeholder="/assets/... atau https://..."
                                                        required
                                                    />
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div
                                                            onClick={() =>
                                                                triggerFileSelect(
                                                                    `keb-doc-${activeKeb.id}`,
                                                                )
                                                            }
                                                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-4 transition-all hover:border-admin-accent/50"
                                                        >
                                                            <input
                                                                ref={(el) => {
                                                                    fileRefs.current[
                                                                        `keb-doc-${activeKeb.id}`
                                                                    ] = el;
                                                                }}
                                                                type="file"
                                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                                                onChange={(e) =>
                                                                    handleUploadKebDoc(
                                                                        activeKeb.id,
                                                                        e,
                                                                    )
                                                                }
                                                                className="hidden"
                                                            />
                                                            <UploadCloud
                                                                size={22}
                                                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                            />
                                                            <p className="text-[10px] font-bold text-admin-text">
                                                                Pilih berkas PDF
                                                                Laporan
                                                            </p>
                                                        </div>
                                                        {(activeKeb.fileName ||
                                                            activeKeb.docPreviewUrl) && (
                                                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                                <CheckCircle2
                                                                    size={12}
                                                                />
                                                                {activeKeb.fileName ||
                                                                    'Dokumen dipilih'}{' '}
                                                                berhasil dimuat
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                    <Eye
                                        size={16}
                                        className="text-admin-accent"
                                    />
                                    <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                        Preview Laporan Tahunan
                                    </span>
                                </div>
                                <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                    Aktif
                                </span>
                            </div>
                            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
                                <p className="mb-2 text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                    Annual Report
                                </p>
                                {annualReports.map((item) => {
                                    const isActive =
                                        item.id === activeAnnualId &&
                                        activeTab === 'annual';
                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                'overflow-hidden rounded-2xl border transition-all duration-300',
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
                                            <div className="flex gap-3 bg-admin-bg/30 p-3">
                                                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-admin-border/50 bg-admin-bg">
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
                                                                'https://placehold.co/48x64/0d2e2e/ffffff?text=AR';
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[9px] font-bold tracking-widest text-admin-accent uppercase">
                                                        {item.badge}
                                                    </p>
                                                    <p className="mt-0.5 line-clamp-2 text-[10px] font-bold text-admin-text">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-[9px] text-admin-text-muted/60">
                                                        PDF · {item.fileSize}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <p className="mt-4 mb-2 text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                    Publikasi Keberlanjutan
                                </p>
                                {keberlanjutan.map((item) => {
                                    const isActive =
                                        item.id === activeKebId &&
                                        activeTab === 'keberlanjutan';
                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                'rounded-xl border p-3 transition-all duration-300',
                                                isActive
                                                    ? 'border-admin-accent/60 bg-admin-accent/5 ring-1 ring-admin-accent/20'
                                                    : 'border-admin-border bg-admin-bg/30 opacity-60',
                                            )}
                                        >
                                            {isActive && (
                                                <div className="mb-2 flex items-center gap-1">
                                                    <div className="size-1 rounded-full bg-admin-accent" />
                                                    <span className="text-[9px] font-bold tracking-widest text-admin-accent uppercase">
                                                        Diedit
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-[10px] font-bold text-admin-text">
                                                {item.title}
                                            </p>
                                            <p className="mt-0.5 text-[9px] text-admin-text-muted/60">
                                                {item.subtitle}
                                            </p>
                                            <p className="mt-1 text-[9px] text-admin-text-muted/40">
                                                Ukuran: {item.fileSize}
                                            </p>
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
            </div>

            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
            />
        </div>
    );
}
