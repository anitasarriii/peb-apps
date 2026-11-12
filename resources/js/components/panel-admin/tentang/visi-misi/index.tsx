import { useCmsSave } from '@/hooks/use-cms-save';
import { router } from '@inertiajs/react';
import {
    RotateCcw,
    Save,
    Eye,
    Plus,
    Trash2,
    Compass,
    Target,
} from 'lucide-react';
import { useState } from 'react';
import { updateVisiMisi } from '@/actions/App/Http/Controllers/Admin/PanelAdminTentangController';
import AnimeReveal from '@/components/global/anime-reveal';
import AdminToast from '@/components/panel-admin/admin-toast';
import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================
interface StatItem {
    value: string;
    label: string;
    highlighted?: boolean;
}

interface MisiItem {
    number: number;
    title: string;
    description: string;
}

interface VisiMisiSectionData {
    id?: number;
    visi_label: string;
    visi_text: string;
    stats: StatItem[];
    misi_title: string;
    misi_subtitle: string;
    misi_items: MisiItem[];
    updated_at?: string;
}

interface VisiMisiEditorProps {
    visiMisiSection?: VisiMisiSectionData | null;
}

// ============================================================
// Default values (fallback jika belum ada data dari DB)
// ============================================================
const DEFAULT_VISI_LABEL = 'VISI PERUSAHAAN';
const DEFAULT_VISI_TEXT =
    'Menjadi Penyedia Solusi Energi Terdepan dan Terpercaya di Kawasan Regional.';
const DEFAULT_STATS: StatItem[] = [
    {
        value: '95%',
        label: 'Efisiensi Operasional untuk mitra industri',
        highlighted: false,
    },
    {
        value: '85%',
        label: 'Energi Bersih dan Andal tersalurkan setiap tahun',
        highlighted: true,
    },
];
const DEFAULT_MISI_TITLE = 'Misi Kami';
const DEFAULT_MISI_SUBTITLE =
    'Langkah strategis untuk mewujudkan masa depan energi yang berkelanjutan.';
const DEFAULT_MISI_ITEMS: MisiItem[] = [
    {
        number: 1,
        title: 'Keandalan Pasokan',
        description:
            'Menjamin ketersediaan energi listrik yang berkualitas tinggi dan berkelanjutan.',
    },
    {
        number: 2,
        title: 'Inovasi Teknologi',
        description: 'Mengembangkan infrastruktur cerdas dan ramah lingkungan.',
    },
    {
        number: 3,
        title: 'Nilai Tambah Stakeholder',
        description:
            'Memberikan kontribusi positif bagi ekonomi dan masyarakat.',
    },
];

export default function VisiMisiEditor({
    visiMisiSection,
}: VisiMisiEditorProps) {
    // --- Inisialisasi state dari data database atau nilai default ---
    const [visiLabel, setVisiLabel] = useState(
        visiMisiSection?.visi_label ?? DEFAULT_VISI_LABEL,
    );
    const [visiText, setVisiText] = useState(
        visiMisiSection?.visi_text ?? DEFAULT_VISI_TEXT,
    );
    const [stats, setStats] = useState<StatItem[]>(
        visiMisiSection?.stats ?? DEFAULT_STATS,
    );
    const [misiTitle, setMisiTitle] = useState(
        visiMisiSection?.misi_title ?? DEFAULT_MISI_TITLE,
    );
    const [misiSubtitle, setMisiSubtitle] = useState(
        visiMisiSection?.misi_subtitle ?? DEFAULT_MISI_SUBTITLE,
    );
    const [misiItems, setMisiItems] = useState<MisiItem[]>(
        visiMisiSection?.misi_items ?? DEFAULT_MISI_ITEMS,
    );

    const [activeTab, setActiveTab] = useState<'visi' | 'misi'>('visi');
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');

    // --- Reset ke nilai default ---
    const handleReset = () => {
        setVisiLabel(DEFAULT_VISI_LABEL);
        setVisiText(DEFAULT_VISI_TEXT);
        setStats(DEFAULT_STATS);
        setMisiTitle(DEFAULT_MISI_TITLE);
        setMisiSubtitle(DEFAULT_MISI_SUBTITLE);
        setMisiItems(DEFAULT_MISI_ITEMS);
    };

    const handleAddMisi = () => {
        if (misiItems.length >= 3) {
            setToastType('error');
            setToastMessage('Batas maksimal penambahan misi hanya 3 item.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            return;
        }

        const nextNum =
            misiItems.length > 0
                ? Math.max(...misiItems.map((m) => m.number)) + 1
                : 1;
        setMisiItems([
            ...misiItems,
            {
                number: nextNum,
                title: `Misi Strategis ${nextNum}`,
                description:
                    'Penjelasan langkah taktis operasional perusahaan...',
            },
        ]);
    };

    const handleDeleteMisi = (number: number) => {
        const filtered = misiItems.filter((m) => m.number !== number);
        // Urutkan ulang nomor secara berurutan setelah hapus
        const reordered = filtered.map((m, idx) => ({ ...m, number: idx + 1 }));
        setMisiItems(reordered);
    };

    const updateMisiItem = (
        number: number,
        key: keyof MisiItem,
        value: any,
    ) => {
        setMisiItems((prev) =>
            prev.map((m) => (m.number === number ? { ...m, [key]: value } : m)),
        );
    };

    const updateStatItem = (index: number, key: keyof StatItem, value: any) => {
        setStats((prev) =>
            prev.map((s, idx) => (idx === index ? { ...s, [key]: value } : s)),
        );
    };

    // --- Kirim data ke backend via Inertia POST ---
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            updateVisiMisi.url(),
            {
                visi_label: visiLabel,
                visi_text: visiText,
                stats: stats as any,
                misi_title: misiTitle,
                misi_subtitle: misiSubtitle,
                misi_items: misiItems as any,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setToastType('success');
                    setToastMessage(
                        'Visi & Misi Perusahaan berhasil diperbarui.',
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                },
                onError: (errors) => {
                    console.error(
                        '[VisiMisiEditor] Validation errors:',
                        errors,
                    );
                    const firstError = Object.values(errors)[0] as string;
                    setToastType('error');
                    setToastMessage(
                        firstError ||
                            'Gagal menyimpan perubahan. Periksa kembali isian form.',
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 5000);
                },
                onFinish: () => {
                    setIsSaving(false);
                },
            },
        );
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol (Kiri) */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Compass size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Visi & Misi Perusahaan
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Konfigurasi teks Visi, statistik
                                        persentase, dan daftar Misi organisasi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs Form */}
                        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('visi')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeTab === 'visi'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Compass size={13} />
                                Visi & Statistik
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('misi')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeTab === 'misi'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Target size={13} />
                                Misi Strategis
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {activeTab === 'visi' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Label Lencana Visi
                                            </label>
                                            <input
                                                type="text"
                                                value={visiLabel}
                                                onChange={(e) =>
                                                    setVisiLabel(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Pernyataan Visi Utama
                                            </label>
                                            <textarea
                                                value={visiText}
                                                onChange={(e) =>
                                                    setVisiText(e.target.value)
                                                }
                                                rows={3}
                                                className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            />
                                        </div>
                                    </div>

                                    {/* Statistik Pendukung */}
                                    <div className="space-y-4 border-t border-admin-border/50 pt-4">
                                        <label className="block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Statistik Pendukung (2 Item)
                                        </label>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {stats.map((stat, idx) => (
                                                <div
                                                    key={idx}
                                                    className="space-y-3 rounded-2xl border border-admin-border bg-admin-bg p-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black tracking-wider text-admin-accent uppercase">
                                                            Statistik {idx + 1}
                                                        </span>
                                                        <label className="flex cursor-pointer items-center gap-1.5 select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    !!stat.highlighted
                                                                }
                                                                onChange={(e) =>
                                                                    updateStatItem(
                                                                        idx,
                                                                        'highlighted',
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                                className="rounded border-admin-border text-admin-accent focus:ring-admin-accent"
                                                            />
                                                            <span className="text-[10px] font-bold text-admin-text-muted">
                                                                Sorot
                                                                (Highlight)
                                                            </span>
                                                        </label>
                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={stat.value}
                                                            onChange={(e) =>
                                                                updateStatItem(
                                                                    idx,
                                                                    'value',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-sm font-bold text-admin-text outline-none"
                                                            placeholder="Nilai (e.g. 95%)"
                                                        />
                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={stat.label}
                                                            onChange={(e) =>
                                                                updateStatItem(
                                                                    idx,
                                                                    'label',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-xs font-medium text-admin-text outline-none"
                                                            placeholder="Keterangan..."
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'misi' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Judul Misi Section
                                            </label>
                                            <input
                                                type="text"
                                                value={misiTitle}
                                                onChange={(e) =>
                                                    setMisiTitle(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Sub-judul Misi Section
                                            </label>
                                            <input
                                                type="text"
                                                value={misiSubtitle}
                                                onChange={(e) =>
                                                    setMisiSubtitle(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            />
                                        </div>
                                    </div>

                                    {/* List Misi */}
                                    <div className="space-y-4 border-t border-admin-border/50 pt-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Daftar Misi Organisasi (
                                                {misiItems.length})
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleAddMisi}
                                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all duration-300 hover:bg-admin-accent hover:text-white"
                                            >
                                                <Plus size={14} /> Tambah Misi
                                            </button>
                                        </div>

                                        <div className="custom-scrollbar max-h-[350px] space-y-4 overflow-y-auto pr-1">
                                            {misiItems.map((misi) => (
                                                <div
                                                    key={misi.number}
                                                    className="group/item relative space-y-3 rounded-2xl border border-admin-border bg-admin-bg p-5"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-admin-accent/20 text-xs font-black text-admin-accent">
                                                                {misi.number}
                                                            </span>
                                                            <span className="text-[10px] font-black tracking-wider text-admin-text-muted uppercase">
                                                                Langkah Misi
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteMisi(
                                                                    misi.number,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg p-1.5 text-red-400 opacity-0 transition-all group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-500"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <input
                                                            type="text"
                                                            value={misi.title}
                                                            onChange={(e) =>
                                                                updateMisiItem(
                                                                    misi.number,
                                                                    'title',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-sm font-bold text-admin-text outline-none"
                                                            placeholder="Judul Misi..."
                                                        />
                                                        <input
                                                            type="text"
                                                            value={
                                                                misi.description
                                                            }
                                                            onChange={(e) =>
                                                                updateMisiItem(
                                                                    misi.number,
                                                                    'description',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-xs font-medium text-admin-text outline-none"
                                                            placeholder="Deskripsi misi..."
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

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
                    <div className="group relative flex h-[580px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Visi & Misi
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        {/* Mockup Frame Visi & Misi */}
                        <div className="custom-scrollbar w-full flex-1 space-y-6 overflow-y-auto rounded-[2rem] border border-admin-border bg-admin-bg p-6">
                            {/* Visi Mockup */}
                            <div className="relative overflow-hidden rounded-2xl border border-admin-border bg-admin-card p-5">
                                <span className="mb-1 block text-[9px] font-black tracking-widest text-admin-accent uppercase">
                                    {visiLabel}
                                </span>
                                <h3 className="text-sm leading-snug font-extrabold text-admin-text">
                                    "{visiText}"
                                </h3>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    {stats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                'rounded-xl border p-3 transition-all duration-300',
                                                stat.highlighted
                                                    ? 'border-[#f5e879]/40 bg-[#f5e879]/20 font-bold text-admin-text'
                                                    : 'border-admin-border bg-admin-bg',
                                            )}
                                        >
                                            <p className="text-lg leading-none font-black text-admin-text">
                                                {stat.value}
                                            </p>
                                            <p className="mt-1 text-[8px] leading-tight text-admin-text-muted">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Misi Mockup */}
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-xs font-black tracking-wide text-admin-text uppercase">
                                        {misiTitle}
                                    </h4>
                                    <p className="mt-0.5 text-[9px] leading-none text-admin-text-muted">
                                        {misiSubtitle}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {misiItems.map((item) => (
                                        <div
                                            key={item.number}
                                            className="flex items-start gap-2"
                                        >
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-admin-accent/15 text-[9px] font-extrabold text-admin-accent">
                                                {item.number}
                                            </span>
                                            <div className="flex-1 rounded-xl border border-admin-border bg-admin-card p-2.5">
                                                <h5 className="mb-1 text-[10px] leading-none font-extrabold text-admin-text">
                                                    {item.title}
                                                </h5>
                                                <p className="text-[9px] leading-tight text-admin-text-muted">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>VISI MISI MOCKUP PREVIEW</span>
                            <span>REAL-TIME EDIT</span>
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
