import { useCmsSave } from '@/hooks/use-cms-save';
import { router } from '@inertiajs/react';
import { Briefcase, Eye, Plus, RotateCcw, Save, Star } from 'lucide-react';
import { useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import AdminToast from '@/components/panel-admin/admin-toast';
import { cn } from '@/lib/utils';
import { update as updateLayanan } from '@/routes/panel-admin/beranda/layanan-section';
import PreviewPanel from './preview-panel';
import ServiceCardEditor, { type ServiceItem } from './service-card-editor';

const defaultServices: ServiceItem[] = [
    {
        id: '1',
        icon: 'Wrench',
        title: 'Enjiniring',
        description:
            'PEB sendiri berfokus pada pembangkitan listrik untuk komunitas dan industri. PEB menggunakan metode yang berkaitan dengan kerangka teori dari bidang teknik elektro dan teknik mesin.',
    },
    {
        id: '2',
        icon: 'BookText',
        title: 'Pengadaan',
        description:
            'PEB memanfaatkan pengetahuan dan ahli khusus untuk memastikan bahwa setiap fasilitas yang ada memiliki mesin, komponen, dan dapat beroperasi dengan aman.',
    },
    {
        id: '3',
        icon: 'Bolt',
        title: 'Konstruksi',
        description:
            'Berpengalaman dalam konstruksi perpipaan & pipa saluran, pembangkit listrik dengan teknologi mutakhir dan inovasi berkelanjutan serta memastikan bahwa fasilitas yang ada mampu mencapai tingkat efisiensi tertinggi.',
    },
    {
        id: '4',
        icon: 'Server',
        title: 'Instalasi',
        description:
            'Kami bekerja sama dengan anda untuk membangun semua fasilitas dan intalasi terbaik, baik di area perkotaan yang padat maupun di daerah terpencil, untuk pipa gas atau pembangkit listrik.',
    },
    {
        id: '5',
        icon: 'Zap',
        title: 'Operasional',
        description:
            'PEB telah memastikan bahwa seluruh kontrol terkait pipeline atau power plant yang beroperasi akan selalu di monitoring selama 365 hari dalam 24 jam setiap tahun nya.',
    },
    {
        id: '6',
        icon: 'RefreshCw',
        title: 'Pemeliharaan',
        description:
            'Kami akan memastikan bahwa pipeline gas dan power plan akan selalu berjalan dengan baik regularly, memastikan keandalan nya, memastikan jangka umur nya, biaya operasi yang lebih murah dan memastikan peningkatkan keamanan operasional.',
    },
];

interface LayananSectionProps {
    layananSection?: {
        title: string;
        services: ServiceItem[];
    } | null;
}

export default function LayananSectionEditor({
    layananSection,
}: LayananSectionProps) {
    const [title, setTitle] = useState(
        layananSection?.title ?? 'Layanan Terbaik Akan Selalu Kami Berikan',
    );
    const [services, setServices] = useState<ServiceItem[]>(
        layananSection?.services ?? defaultServices,
    );
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleReset = () => {
        setTitle(
            layananSection?.title ?? 'Layanan Terbaik Akan Selalu Kami Berikan',
        );
        setServices(layananSection?.services ?? defaultServices);
        console.log('[LayananSectionEditor] Reset ke konfigurasi default.');
    };

    const handleChange = (updated: ServiceItem) =>
        setServices((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
        );

    const handleDelete = (id: string) =>
        setServices((prev) => prev.filter((s) => s.id !== id));

    const handleAdd = () => {
        const newService: ServiceItem = {
            id: Date.now().toString(),
            icon: 'Wrench',
            title: '',
            description: '',
        };
        setServices((prev) => [...prev, newService]);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) {
            return;
        }

        setServices((prev) => {
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

        router.post(
            updateLayanan.url(),
            {
                title,
                services: services as any,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
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
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Layanan Kami
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Sesuaikan informasi daftar layanan
                                        terbaik yang kami sediakan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Judul Section */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                    Judul Utama Section
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                    placeholder="Layanan Terbaik Akan Selalu Kami Berikan..."
                                    required
                                />
                            </div>

                            {/* Daftar Layanan */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Daftar Item Layanan ({services.length})
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-admin-accent/10 px-4 py-2 text-xs font-bold text-admin-accent transition-all duration-200 hover:bg-admin-accent hover:text-white"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Layanan
                                    </button>
                                </div>

                                {services.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/20 py-12 text-center">
                                        <Star className="mb-3 h-8 w-8 animate-pulse text-admin-text-muted" />
                                        <p className="text-sm font-semibold text-admin-text-muted">
                                            Belum ada layanan
                                        </p>
                                        <p className="mt-1 text-xs text-admin-text-muted">
                                            Klik "Tambah Layanan" untuk mulai
                                            membuat daftar
                                        </p>
                                    </div>
                                )}

                                <div className="custom-scrollbar max-h-[500px] space-y-3 overflow-y-auto pr-1">
                                    {services.map((service, idx) => (
                                        <ServiceCardEditor
                                            key={service.id}
                                            service={service}
                                            index={idx}
                                            onChange={handleChange}
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
                                    Preview Layanan
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        <PreviewPanel title={title} services={services} />

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>MOCKUP PREVIEW LAYOUT</span>
                            <span>SINKRONISASI REAL-TIME</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            {/* Notification Toast */}
            <AdminToast
                show={showToast}
                message="Konfigurasi section Layanan telah diperbarui."
            />
        </div>
    );
}
