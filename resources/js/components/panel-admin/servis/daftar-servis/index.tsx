import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Wrench,
    Plus,
    RotateCcw,
    Save,
    Eye,
    Trash2,
    GripVertical,
} from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updateDaftar } from '@/routes/panel-admin/servis/daftar-section';
import ServiceCardEditor, { type ServiceItem } from './service-card-editor';
import PreviewPanel from './preview-panel';

const defaultServices: ServiceItem[] = [
    {
        id: '1',
        title: 'Enjiniring',
        description:
            'PEB sendiri berfokus pada pembangkitan listrik untuk komunitas dan industri. PEB menggunakan metode yang berkaitan dengan kerangka teori dari bidang teknik elektro dan teknik mesin.',
        imageSrc: '/assets/beranda/portfolio/project-1.png',
    },
    {
        id: '2',
        title: 'Pengadaan',
        description:
            'PEB memanfaatkan pengetahuan dan ahli khusus untuk memastikan bahwa setiap fasilitas yang ada memiliki mesin, komponen, dan dapat beroperasi dengan aman.',
        imageSrc: '/assets/beranda/portfolio/2.png',
    },
    {
        id: '3',
        title: 'Konstruksi',
        description:
            'Berpengalaman dalam konstruksi perpipaan & pipa saluran, pembangkit listrik dengan teknologi mutakhir dan inovasi berkelanjutan serta memastikan fasilitas yang ada mampu mencapai target.',
        imageSrc: '/assets/beranda/portfolio/project-3.png',
    },
    {
        id: '4',
        title: 'Instalasi',
        description:
            'Kami bekerja sama dengan anda untuk membangun semua fasilitas dan instalasi terbaik, baik di area perkotaan yang padat maupun di daerah terpencil, untuk pipa gas atau pembangkit.',
        imageSrc: '/assets/pengadaan/items/item2.png',
    },
    {
        id: '5',
        title: 'Operasional',
        description:
            'PEB telah memastikan bahwa seluruh kontrol terkait pipeline atau power plant yang beroperasi akan selalu di monitoring selama 365 hari dalam 24 jam, setiap tahun nya.',
        imageSrc: '/assets/pengadaan/items/item5.png',
    },
    {
        id: '6',
        title: 'Pemeliharaan',
        description:
            'Kami akan memastikan bahwa pipeline gas dan power plan akan selalu berjalan dengan baik regularly, memastikan keandalan nya, memastikan jangka umur nya, biaya operasi yang lebih murah.',
        imageSrc: '/assets/pengadaan/items/item1.png',
    },
];

interface DaftarServisSectionEditorProps {
    daftarServisSection?: {
        id: number;
        title: string;
        services: ServiceItem[];
    } | null;
}

export default function DaftarServisSectionEditor({
    daftarServisSection,
}: DaftarServisSectionEditorProps) {
    const [sectionTitle, setSectionTitle] = useState(
        daftarServisSection?.title ?? 'Daftar Servis',
    );
    const [services, setServices] = useState<ServiceItem[]>(
        daftarServisSection?.services ?? defaultServices,
    );
    const [activeId, setActiveId] = useState<string>(
        daftarServisSection?.services?.[0]?.id ?? defaultServices[0].id,
    );
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const activeService =
        services.find((s) => s.id === activeId) ?? services[0];

    const handleChange = (updated: ServiceItem) => {
        setServices((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
        );
    };

    const handleAdd = () => {
        const newService: ServiceItem = {
            id: Date.now().toString(),
            title: 'Servis Baru',
            description: 'Deskripsi layanan servis baru...',
            imageSrc:
                'https://placehold.co/600x400/0d2e2e/ffffff?text=Servis+Baru',
        };
        setServices((prev) => [...prev, newService]);
        setActiveId(newService.id);
    };

    const handleDelete = (id: string) => {
        if (services.length <= 1) return;
        const remaining = services.filter((s) => s.id !== id);
        setServices(remaining);
        // Pindah ke item sebelumnya atau pertama
        if (activeId === id) {
            setActiveId(remaining[0].id);
        }
    };

    const handleDragStart = (index: number) => setDraggedIndex(index);

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        setServices((prev) => {
            const next = [...prev];
            const [dragged] = next.splice(draggedIndex, 1);
            next.splice(index, 0, dragged);
            return next;
        });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => setDraggedIndex(null);

    const handleReset = () => {
        setSectionTitle(daftarServisSection?.title ?? 'Daftar Servis');
        setServices(daftarServisSection?.services ?? defaultServices);
        setActiveId(
            daftarServisSection?.services?.[0]?.id ?? defaultServices[0].id,
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(
            updateDaftar.url(),
            {
                title: sectionTitle,
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
                                    <Wrench size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Daftar Servis
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Kelola semua layanan servis.
                                    </p>
                                </div>
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
                                    placeholder="Daftar Servis"
                                    required
                                />
                            </div>

                            {/* ── Servis Manager ─────────────────────────── */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Daftar Servis ({services.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all duration-200 hover:bg-admin-accent hover:text-white"
                                    >
                                        <Plus size={13} />
                                        Tambah Servis
                                    </button>
                                </div>

                                {/* Daftar Servis — drag & drop */}
                                <div className="space-y-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                    {services.map((service, idx) => (
                                        <div
                                            key={service.id}
                                            draggable
                                            onDragStart={() =>
                                                handleDragStart(idx)
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, idx)
                                            }
                                            onDragEnd={handleDragEnd}
                                            onClick={() =>
                                                setActiveId(service.id)
                                            }
                                            className={cn(
                                                'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none',
                                                activeId === service.id
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
                                                    activeId === service.id
                                                        ? 'bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]'
                                                        : 'bg-admin-text-muted/30',
                                                )}
                                            />

                                            {/* Nama servis — inline editable */}
                                            <input
                                                type="text"
                                                value={service.title}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onChange={(e) =>
                                                    handleChange({
                                                        ...service,
                                                        title: e.target.value,
                                                    })
                                                }
                                                className={cn(
                                                    'min-w-0 flex-1 border-b border-transparent bg-transparent pb-0.5 text-xs font-bold outline-hidden transition-all focus:border-admin-accent/50',
                                                    activeId === service.id
                                                        ? 'text-admin-accent'
                                                        : 'text-admin-text-muted',
                                                )}
                                                placeholder="Nama servis..."
                                            />

                                            {/* Nomor urut */}
                                            <span className="shrink-0 text-[10px] font-bold text-admin-text-muted/40">
                                                #{idx + 1}
                                            </span>

                                            {/* Tombol hapus */}
                                            {services.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(
                                                            service.id,
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

                            {/* ── Editor Konten Servis Aktif ─────────────── */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                    <span className="text-xs font-bold tracking-widest text-admin-accent uppercase">
                                        Mengedit: {activeService.title}
                                    </span>
                                </div>
                                {activeService && (
                                    <ServiceCardEditor
                                        service={activeService}
                                        onChange={handleChange}
                                    />
                                )}
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
                    <div className="group relative flex h-[750px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Daftar Servis
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        <PreviewPanel
                            title={sectionTitle}
                            services={services}
                            activeId={activeId}
                        />

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
                message="Daftar servis telah diperbarui."
            />
        </div>
    );
}
