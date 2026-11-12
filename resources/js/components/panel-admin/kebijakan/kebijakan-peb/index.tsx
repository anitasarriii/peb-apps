import { useCmsSave } from '@/hooks/use-cms-save';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ScrollText,
    RotateCcw,
    Save,
    Eye,
    Plus,
    Trash2,
    GripVertical,
} from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import ImageUploadField from '@/components/panel-admin/image-upload-field';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updateKebijakanPeb } from '@/routes/panel-admin/kebijakan/kebijakan-peb';

// ─── Tipe data ────────────────────────────────────────────────────────────────
export interface KebijakanCard {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    signedBy: string;
    role: string;
    date: string;
    fileUrl?: string;
    file?: File | null;
    imageSrc?: string;
    imageFile?: File | null;
    imagePreviewUrl?: string;
    imageFileName?: string;
}

interface KebijakanPebSectionData {
    title: string;
    cards: KebijakanCard[];
    updated_at?: string;
}

interface KebijakanPebEditorProps {
    kebijakanPebSection?: KebijakanPebSectionData | null;
}

// ─── Default fallback (identik dengan data seeder di controller) ──────────────
const DEFAULT_TITLE = 'Kebijakan PEB';

const DEFAULT_CARDS: KebijakanCard[] = [
    {
        id: 'tata-kelola',
        title: 'Tata Kelola Perusahaan',
        subtitle: 'Good Corporate Governance',
        description:
            'Komitmen ini kami buat dengan penuh kesadaran dan rasa tanggung jawab karena kami yakin bahwa pengelolaan perusahaan sesuai dengan prinsip-prinsip standar yang tinggi untuk Good Corporate Governance dan best practice akan memberikan kemaslahatan bagi semua pihak serta mewujudkan kehidupan dengan kualitas yang lebih baik.',
        signedBy: 'PT Pelayanan Energi Batam',
        role: 'Direksi',
        date: 'Batam, 12 Oktober 2017',
    },
    {
        id: 'manajemen-risiko',
        title: 'Manajemen Risiko',
        subtitle: 'Risk Management Policy',
        description:
            'PT Pelayanan Energi Batam (PT PEB) berkomitmen untuk melakukan pengelolaan atas risiko-risiko yang akan dihadapi dalam setiap proses bisnis perusahaan dalam rangka mencapai sasaran dan memenuhi kepatuhan terhadap Good Corporate Governance (GCG) yang dicanangkan oleh Pemerintah Republik Indonesia.',
        signedBy: 'ROSA DARMAN',
        role: 'Direktur',
        date: 'Batam, 01 Oktober 2024',
    },
    {
        id: 'sistem-manajemen',
        title: 'Sistim Manajemen Terpadu',
        subtitle: 'Integrated Management System Policy',
        description:
            'PT Pelayanan Energi Batam (PT PEB) sebagai Badan Hukum Pemilik Izin Manufaktur/Fabrikasi Penunjang Industri Minyak & Gas dan Manajemen Gas Transportasi Industri Lainnya. Berkomitmen untuk memenuhi kebutuhan dan melebihi Ekspektasi pelanggan, persyaratan perundangan melalui peningkatan berkelanjutan dan efisiensi biaya.',
        signedBy: 'PT Pelayanan Energi Batam',
        role: 'Direksi',
        date: 'Batam, 12 Oktober 2017',
    },
];

export default function KebijakanPebEditor({
    kebijakanPebSection,
}: KebijakanPebEditorProps) {
    // ── State form — inisialisasi dari DB, fallback ke default ─────────────────
    const [sectionTitle, setSectionTitle] = useState(
        kebijakanPebSection?.title ?? DEFAULT_TITLE,
    );
    const [cards, setCards] = useState<KebijakanCard[]>(
        kebijakanPebSection?.cards?.length
            ? kebijakanPebSection.cards
            : DEFAULT_CARDS,
    );
    const [activeId, setActiveId] = useState(
        kebijakanPebSection?.cards?.[0]?.id ?? DEFAULT_CARDS[0].id,
    );
    const [isSaving, setIsSaving] = useCmsSave();
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // ── Toast notification ────────────────────────────────────────────────────
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Kebijakan PEB telah diperbarui.',
    );

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const activeCard = cards.find((c) => c.id === activeId) ?? cards[0];

    // ── Helpers ────────────────────────────────────────────────────────────────
    const handleChange = (updated: KebijakanCard) =>
        setCards((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c)),
        );

    const handleAdd = () => {
        const newCard: KebijakanCard = {
            id: Date.now().toString(),
            title: 'Kebijakan Baru',
            subtitle: 'Subtitle Kebijakan',
            description: 'Deskripsi kebijakan baru...',
            signedBy: 'PT Pelayanan Energi Batam',
            role: 'Direksi',
            date:
                'Batam, ' +
                new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }),
            fileUrl: '',
        };
        setCards((prev) => [...prev, newCard]);
        setActiveId(newCard.id);
    };

    const handleDelete = (id: string) => {
        if (cards.length <= 1) return;
        const remaining = cards.filter((c) => c.id !== id);
        setCards(remaining);
        if (activeId === id) setActiveId(remaining[0].id);
    };

    // ── Drag-and-drop reorder ──────────────────────────────────────────────────
    const handleDragStart = (index: number) => setDraggedIndex(index);

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        setCards((prev) => {
            const next = [...prev];
            const [dragged] = next.splice(draggedIndex, 1);
            next.splice(index, 0, dragged);
            return next;
        });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => setDraggedIndex(null);

    // ── Reset ke nilai dari DB (atau default jika belum ada) ──────────────────
    const handleReset = () => {
        setSectionTitle(kebijakanPebSection?.title ?? DEFAULT_TITLE);
        const resetCards = kebijakanPebSection?.cards?.length
            ? kebijakanPebSection.cards
            : DEFAULT_CARDS;
        setCards(resetCards);
        setActiveId(resetCards[0].id);
    };

    // ── Simpan ke backend via Inertia ─────────────────────────────────────────
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            updateKebijakanPeb.url(),
            {
                title: sectionTitle,
                cards: cards as any,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    triggerToast('success', 'Kebijakan PEB telah diperbarui.');
                },
                onError: (err) => {
                    setIsSaving(false);
                    console.error('[KebijakanPeb] Save error:', err);
                    const errorMsg = Object.values(err).join('\n');
                    triggerToast(
                        'error',
                        `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
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

                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <ScrollText size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-admin-text">
                                    Kebijakan PEB
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola kebijakan utama perusahaan.
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
                                    placeholder="Kebijakan PEB"
                                    required
                                />
                            </div>

                            {/* Tab Selector Kartu */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Pilih Kebijakan ({cards.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all duration-200 hover:bg-admin-accent hover:text-white"
                                    >
                                        <Plus size={13} />
                                        Tambah Kebijakan
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                    {cards.map((card, idx) => (
                                        <div
                                            key={card.id}
                                            draggable
                                            onDragStart={() =>
                                                handleDragStart(idx)
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, idx)
                                            }
                                            onDragEnd={handleDragEnd}
                                            onClick={() => setActiveId(card.id)}
                                            className={cn(
                                                'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none',
                                                activeId === card.id
                                                    ? 'border border-admin-accent/30 bg-admin-card shadow-sm'
                                                    : 'border border-transparent hover:bg-admin-card/60',
                                                draggedIndex === idx &&
                                                    'scale-95 opacity-40',
                                            )}
                                        >
                                            {/* Drag handle */}
                                            <GripVertical
                                                size={14}
                                                className="shrink-0 cursor-grab text-admin-text-muted/40 group-hover/item:text-admin-text-muted active:cursor-grabbing"
                                            />

                                            {/* Dot indicator */}
                                            <div
                                                className={cn(
                                                    'size-1.5 shrink-0 rounded-full transition-all',
                                                    activeId === card.id
                                                        ? 'bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]'
                                                        : 'bg-admin-text-muted/30',
                                                )}
                                            />

                                            {/* Nama kartu — inline editable */}
                                            <input
                                                type="text"
                                                value={card.title}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onChange={(e) =>
                                                    handleChange({
                                                        ...card,
                                                        title: e.target.value,
                                                    })
                                                }
                                                className={cn(
                                                    'min-w-0 flex-1 border-b border-transparent bg-transparent pb-0.5 text-xs font-bold outline-hidden transition-all focus:border-admin-accent/50',
                                                    activeId === card.id
                                                        ? 'text-admin-accent'
                                                        : 'text-admin-text-muted',
                                                )}
                                                placeholder="Nama kartu..."
                                            />

                                            {/* Nomor urut */}
                                            <span className="shrink-0 text-[10px] font-bold text-admin-text-muted/40">
                                                #{idx + 1}
                                            </span>

                                            {/* Tombol hapus */}
                                            {cards.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(card.id);
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

                            {/* Editor Kartu Aktif */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                    <span className="text-xs font-bold tracking-widest text-admin-accent uppercase">
                                        Mengedit: {activeCard.title}
                                    </span>
                                </div>

                                {/* Judul Kartu */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Kartu
                                    </label>
                                    <input
                                        type="text"
                                        value={activeCard.title}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeCard,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="Judul kebijakan..."
                                        required
                                    />
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={activeCard.subtitle}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeCard,
                                                subtitle: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="Subtitle kebijakan..."
                                        required
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={activeCard.description}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeCard,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={5}
                                        className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="Isi kebijakan..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Ditandatangani Oleh */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Ditandatangani Oleh
                                        </label>
                                        <input
                                            type="text"
                                            value={activeCard.signedBy}
                                            onChange={(e) =>
                                                handleChange({
                                                    ...activeCard,
                                                    signedBy: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            placeholder="Nama penandatangan..."
                                            required
                                        />
                                    </div>

                                    {/* Jabatan */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Jabatan
                                        </label>
                                        <input
                                            type="text"
                                            value={activeCard.role}
                                            onChange={(e) =>
                                                handleChange({
                                                    ...activeCard,
                                                    role: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            placeholder="Direktur / Direksi..."
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Tanggal */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Tanggal Penandatanganan
                                    </label>
                                    <input
                                        type="text"
                                        value={activeCard.date}
                                        onChange={(e) =>
                                            handleChange({
                                                ...activeCard,
                                                date: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="Batam, DD Bulan YYYY"
                                        required
                                    />
                                </div>

                                <ImageUploadField
                                    label="Gambar kartu Kebijakan"
                                    source={activeCard.imageSrc || ''}
                                    preview={activeCard.imagePreviewUrl}
                                    fileName={activeCard.imageFileName}
                                    onUrlChange={(imageSrc) =>
                                        handleChange({
                                            ...activeCard,
                                            imageSrc,
                                            imageFile: null,
                                            imagePreviewUrl: undefined,
                                        })
                                    }
                                    onFileChange={(
                                        imageFile,
                                        imagePreviewUrl,
                                    ) =>
                                        handleChange({
                                            ...activeCard,
                                            imageFile,
                                            imagePreviewUrl,
                                            imageFileName: imageFile.name,
                                        })
                                    }
                                />

                                {/* Upload File (Dokumen) */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Dokumen (Opsional)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.png,.jpg"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] || null;
                                            handleChange({
                                                ...activeCard,
                                                file: file,
                                            });
                                        }}
                                        className="w-full cursor-pointer rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-3 text-sm font-medium text-admin-text outline-hidden transition-all file:mr-4 file:rounded-full file:border-0 file:bg-admin-accent/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-admin-accent hover:file:bg-admin-accent/20 focus:border-admin-accent"
                                    />
                                    {activeCard.fileUrl && !activeCard.file && (
                                        <p className="mt-1 text-xs text-admin-text-muted">
                                            File saat ini:{' '}
                                            <a
                                                href={activeCard.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-admin-accent underline hover:text-admin-primary"
                                            >
                                                Lihat File
                                            </a>
                                        </p>
                                    )}
                                    {activeCard.file && (
                                        <p className="mt-1 text-xs text-emerald-500">
                                            File baru dipilih:{' '}
                                            {activeCard.file.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tombol Simpan & Reset */}
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
                    <div className="relative flex h-[680px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Kebijakan
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
                            {/* Section title */}
                            <div className="mb-4">
                                <h2 className="relative inline-block text-base font-bold text-admin-text">
                                    {sectionTitle}
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-10 rounded-full bg-admin-accent" />
                                </h2>
                            </div>

                            {cards.map((card) => {
                                const isActive = card.id === activeId;
                                return (
                                    <div
                                        key={card.id}
                                        className={cn(
                                            'rounded-2xl border p-4 transition-all duration-300',
                                            isActive
                                                ? 'border-admin-accent/60 shadow-lg ring-1 shadow-admin-accent/10 ring-admin-accent/20'
                                                : 'border-admin-border bg-admin-bg/50 opacity-60',
                                        )}
                                    >
                                        {isActive && (
                                            <div className="mb-3 flex items-center gap-1.5 border-b border-admin-accent/20 pb-2">
                                                <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                                <span className="text-[10px] font-bold tracking-widest text-admin-accent uppercase">
                                                    Sedang Diedit
                                                </span>
                                            </div>
                                        )}
                                        {(card.imagePreviewUrl ||
                                            card.imageSrc) && (
                                            <img
                                                src={
                                                    card.imagePreviewUrl ||
                                                    card.imageSrc
                                                }
                                                alt={card.title}
                                                className="mb-3 max-h-48 w-full rounded-lg object-contain"
                                            />
                                        )}
                                        <h3 className="text-xs font-black tracking-wide text-admin-text uppercase">
                                            {card.title}
                                        </h3>
                                        <p className="mt-0.5 text-[10px] font-semibold text-admin-accent">
                                            {card.subtitle}
                                        </p>
                                        <p className="mt-2 line-clamp-3 text-[10px] leading-relaxed text-admin-text-muted">
                                            {card.description}
                                        </p>
                                        <div className="mt-3 flex items-end justify-between border-t border-admin-border/50 pt-2">
                                            <div>
                                                <p className="text-[10px] text-admin-text-muted">
                                                    {card.role}
                                                </p>
                                                <p className="text-[10px] font-bold text-admin-text">
                                                    {card.signedBy}
                                                </p>
                                            </div>
                                            <p className="text-[10px] text-admin-text-muted/60">
                                                {card.date}
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
