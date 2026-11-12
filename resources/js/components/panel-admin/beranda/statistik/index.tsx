import { useCmsSave } from '@/hooks/use-cms-save';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    TrendingUp,
    Link,
    Upload,
    X,
    Plus,
    RotateCcw,
    Save,
    CheckCircle2,
    Eye,
} from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updateStatistik } from '@/routes/panel-admin/beranda/statistik-section';
import StatRowEditor, { type StatItem } from './stat-row-editor';
import PreviewPanel from './preview-panel';

interface StatistikSection {
    background_src?: string;
    bg_source?: 'url' | 'upload';
    bg_file_name?: string;
    stats?: StatItem[];
}

interface StatistikSectionEditorProps {
    statistikSection?: StatistikSection;
}

const defaultStats: StatItem[] = [
    { id: '1', icon: 'Users', value: '682', label: 'Karyawan' },
    { id: '2', icon: 'MapPin', value: '68', label: 'Lokasi Sites' },
    { id: '3', icon: 'Briefcase', value: '42', label: 'Proyek' },
    { id: '4', icon: 'Hammer', value: '17', label: 'Izin Usaha' },
];

export default function StatistikSectionEditor({
    statistikSection,
}: StatistikSectionEditorProps) {
    const [backgroundSrc, setBackgroundSrc] = useState(
        statistikSection?.background_src || '/assets/beranda/team/team.jpg',
    );
    const [bgSource, setBgSource] = useState<'url' | 'upload'>(
        statistikSection?.bg_source || 'url',
    );
    const [uploadingBg, setUploadingBg] = useState(false);
    const [bgFileName, setBgFileName] = useState(
        statistikSection?.bg_file_name || '',
    );
    const [stats, setStats] = useState<StatItem[]>(
        statistikSection?.stats || defaultStats,
    );
    const [bgFile, setBgFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi section Statistik telah diperbarui.',
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (statistikSection) {
            setBackgroundSrc(
                statistikSection.background_src || '/assets/beranda/team/team.jpg',
            );
            setBgSource(statistikSection.bg_source || 'url');
            setBgFileName(statistikSection.bg_file_name || '');
            if (statistikSection.stats && statistikSection.stats.length > 0) {
                setStats(statistikSection.stats);
            }
        }
    }, [statistikSection]);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleReset = () => {
        setBackgroundSrc(
            statistikSection?.background_src || '/assets/beranda/team/team.jpg',
        );
        setBgSource(statistikSection?.bg_source || 'url');
        setBgFileName(statistikSection?.bg_file_name || '');
        setStats(statistikSection?.stats || defaultStats);
        setBgFile(null);
        console.log('[StatistikSectionEditor] Reset ke konfigurasi terakhir.');
    };

    const handleUpdate = (updated: StatItem) =>
        setStats((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
        );

    const handleDelete = (id: string) =>
        setStats((prev) => prev.filter((s) => s.id !== id));

    const handleAdd = () => {
        setStats((prev) => [
            ...prev,
            { id: Date.now().toString(), icon: 'Star', value: '', label: '' },
        ]);
    };

    const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingBg(true);
        setBgFileName('');
        setBgFile(file);
        if (backgroundSrc.startsWith('blob:'))
            URL.revokeObjectURL(backgroundSrc);
        setBackgroundSrc(URL.createObjectURL(file));
        setBgFileName(file.name);
        setUploadingBg(false);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;
        setStats((prev) => {
            const next = [...prev];
            const draggedItem = next[draggedIndex];
            next.splice(draggedIndex, 1);
            next.splice(index, 0, draggedItem);
            return next;
        });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data: any = {
            bg_source: bgSource,
            background_src: bgSource === 'url' || !bgFile ? backgroundSrc : '',
            bg_file_name: bgSource === 'upload' ? bgFileName : '',
            stats: stats,
        };

        if (bgSource === 'upload' && bgFile) {
            data.bg_file = bgFile;
        }

        router.post(updateStatistik.url(), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setBgFile(null);
                triggerToast(
                    'success',
                    'Konfigurasi section Statistik telah diperbarui.',
                );
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('[StatistikSectionEditor] Save failed:', err);
                const errorMsg = Object.values(err).join('\n');
                triggerToast(
                    'error',
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
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
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Statistik & Kinerja
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Kelola latar belakang section, ikon,
                                        angka pencapaian, dan deskripsi kinerja.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md shadow-admin-primary/20 transition-all active:scale-95',
                                    isSaving
                                        ? 'cursor-not-allowed bg-admin-primary/60'
                                        : 'bg-admin-primary hover:bg-admin-accent',
                                )}
                            >
                                {isSaving ? (
                                    <div className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                    <Save size={14} />
                                )}
                                <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Background Image */}
                            <div className="space-y-4 border-b border-admin-border/40 pb-6">
                                <h4 className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                    Gambar Latar Belakang
                                </h4>

                                {/* Source toggle */}
                                <div className="flex gap-2">
                                    {(['url', 'upload'] as const).map((src) => (
                                        <button
                                            type="button"
                                            key={src}
                                            onClick={() => setBgSource(src)}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all',
                                                bgSource === src
                                                    ? 'border-admin-accent bg-admin-accent text-white'
                                                    : 'border-admin-border bg-admin-bg text-admin-text-muted hover:text-admin-text',
                                            )}
                                        >
                                            {src === 'url' ? (
                                                <Link className="h-3.5 w-3.5" />
                                            ) : (
                                                <Upload className="h-3.5 w-3.5" />
                                            )}
                                            {src === 'url'
                                                ? 'Dari URL'
                                                : 'Upload File'}
                                        </button>
                                    ))}
                                </div>

                                {bgSource === 'url' ? (
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={backgroundSrc}
                                            onChange={(e) =>
                                                setBackgroundSrc(e.target.value)
                                            }
                                            placeholder="https://example.com/background.jpg"
                                            className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 pr-10 font-mono text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                                        />
                                        {backgroundSrc && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setBackgroundSrc('')
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-admin-text-muted hover:text-red-400"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        'statistik-bg-file-input',
                                                    )
                                                    ?.click()
                                            }
                                            className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 py-6 transition-colors hover:border-admin-accent/50"
                                        >
                                            <input
                                                id="statistik-bg-file-input"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleBgFileChange}
                                            />
                                            <Upload className="mb-2 h-6 w-6 text-admin-text-muted transition-colors group-hover:text-admin-accent" />
                                            <span className="text-xs font-bold text-admin-text">
                                                Klik untuk memilih gambar latar
                                            </span>
                                            <span className="mt-1 text-[10px] text-admin-text-muted">
                                                PNG, JPG, WEBP maks. 500 MB
                                            </span>
                                        </div>

                                        {uploadingBg && (
                                            <div className="flex animate-pulse items-center gap-2 text-xs font-bold text-admin-accent">
                                                <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                Memproses file gambar...
                                            </div>
                                        )}

                                        {bgFileName && !uploadingBg && (
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                <CheckCircle2 size={12} />
                                                File {bgFileName} berhasil
                                                dimuat
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Background Preview */}
                                {backgroundSrc && (
                                    <div className="relative h-28 overflow-hidden rounded-xl border border-admin-border">
                                        <img
                                            src={backgroundSrc}
                                            alt="Background preview"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#0d2e2e]/60">
                                            <span className="text-xs font-semibold text-white/80">
                                                Pratinjau Overlay Gelap
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats list */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Data Statistik ({stats.length})
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        disabled={stats.length >= 6}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-admin-accent/10 px-4 py-2 text-xs font-bold text-admin-accent transition-all duration-200 hover:bg-admin-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Item
                                    </button>
                                </div>

                                {stats.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/20 py-12 text-center">
                                        <TrendingUp className="mb-3 h-8 w-8 animate-pulse text-admin-text-muted" />
                                        <p className="text-sm font-semibold text-admin-text-muted">
                                            Belum ada statistik
                                        </p>
                                        <p className="mt-1 text-xs text-admin-text-muted">
                                            Klik "Tambah Item" untuk mulai
                                            membuat daftar
                                        </p>
                                    </div>
                                )}

                                <div className="custom-scrollbar max-h-[500px] space-y-3 overflow-y-auto pr-1">
                                    {stats.map((stat, idx) => (
                                        <StatRowEditor
                                            key={stat.id}
                                            stat={stat}
                                            index={idx}
                                            onUpdate={handleUpdate}
                                            onDelete={handleDelete}
                                            onDragStart={handleDragStart}
                                            onDragOver={handleDragOver}
                                            onDragEnd={handleDragEnd}
                                            isDragging={draggedIndex === idx}
                                        />
                                    ))}
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
                    <div className="group relative flex h-[650px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Statistik
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        <PreviewPanel
                            backgroundSrc={backgroundSrc}
                            stats={stats}
                        />

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>MOCKUP PREVIEW LAYOUT</span>
                            <span className="text-amber-500 font-semibold">PRATINJAU LANGSUNG (SIMPAN UNTUK MENERAPKAN)</span>
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
