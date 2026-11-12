import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Briefcase, Plus, RotateCcw, Save, Eye, ImageIcon } from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updatePortfolio } from '@/routes/panel-admin/beranda/portfolio-section';
import ProjectCardEditor, { type ProjectItem } from './project-card-editor';
import PreviewPanel from './preview-panel';

const defaultProjects: ProjectItem[] = [
    {
        id: '1',
        title: 'PEMBANGKIT LISTRIK TENAGA GAS BATAM',
        category: 'OPERASIONAL & PEMELIHARAAN',
        year: '2024',
        image: '/assets/beranda/portfolio/project-1.png',
        imageSource: 'url',
    },
    {
        id: '2',
        title: 'SOLAR HYBRID SYSTEM TANJUNG UNCANG',
        category: 'ENERGI TERBARUKAN',
        year: '2025',
        image: '/assets/beranda/portfolio/project-2.png',
        imageSource: 'url',
    },
    {
        id: '3',
        title: 'TRANSMISI 150KV ANTAR PULAU',
        category: 'INFRASTRUKTUR JARINGAN',
        year: '2026',
        image: '/assets/beranda/portfolio/project-3.png',
        imageSource: 'url',
    },
    {
        id: '4',
        title: 'PROYEK PENGEMBANGAN PLTS CIRATA',
        category: 'ENERGI TERBARUKAN',
        year: '2024',
        image: '/assets/beranda/portfolio/project-1.png',
        imageSource: 'url',
    },
    {
        id: '5',
        title: 'MAINTENANCE TURBIN GAS PLTGU',
        category: 'OPERASIONAL & PEMELIHARAAN',
        year: '2025',
        image: '/assets/beranda/portfolio/project-2.png',
        imageSource: 'url',
    },
];

interface PortfolioSectionProps {
    portfolioSection?: {
        title: string;
        description: string;
        cta_label: string;
        projects: ProjectItem[];
    } | null;
}

export default function PortfolioSectionEditor({
    portfolioSection,
}: PortfolioSectionProps) {
    const [sectionTitle, setSectionTitle] = useState(
        portfolioSection?.title ?? 'Portfolio Proyek',
    );
    const [sectionDesc, setSectionDesc] = useState(
        portfolioSection?.description ??
            'Komitmen kami dalam menghadirkan solusi energi berkelanjutan tercermin dalam rekam jejak proyek strategis di seluruh Indonesia.',
    );
    const [ctaLabel, setCtaLabel] = useState(
        portfolioSection?.cta_label ?? "Let's work together",
    );
    const [projects, setProjects] = useState<ProjectItem[]>(() => {
        if (
            portfolioSection?.projects &&
            portfolioSection.projects.length > 0
        ) {
            return portfolioSection.projects;
        }
        return defaultProjects;
    });
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi section Portofolio telah diperbarui.',
    );
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleReset = () => {
        setSectionTitle(portfolioSection?.title ?? 'Portfolio Proyek');
        setSectionDesc(
            portfolioSection?.description ??
                'Komitmen kami dalam menghadirkan solusi energi berkelanjutan tercermin dalam rekam jejak proyek strategis di seluruh Indonesia.',
        );
        setCtaLabel(portfolioSection?.cta_label ?? "Let's work together");
        setProjects(
            portfolioSection?.projects && portfolioSection.projects.length > 0
                ? portfolioSection.projects
                : defaultProjects,
        );
        console.log('[PortfolioSectionEditor] Reset ke konfigurasi default.');
    };

    const handleChange = (updated: ProjectItem) =>
        setProjects((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p)),
        );

    const handleDelete = (id: string) =>
        setProjects((prev) => prev.filter((p) => p.id !== id));

    const handleAdd = () => {
        setProjects((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                title: '',
                category: '',
                year: new Date().getFullYear().toString(),
                image: '',
                imageSource: 'url',
            },
        ]);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;
        setProjects((prev) => {
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

        const data: Record<string, any> = {
            title: sectionTitle,
            description: sectionDesc,
            cta_label: ctaLabel,
            projects: projects,
        };

        router.post(updatePortfolio.url(), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                triggerToast(
                    'success',
                    'Konfigurasi section Portofolio telah diperbarui.',
                );
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('Save failed:', err);
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
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Portofolio Proyek
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Sesuaikan informasi daftar proyek
                                        unggulan beserta CTA portofolio.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Pengaturan Header */}
                            <div className="space-y-4 border-b border-admin-border/40 pb-6">
                                <h4 className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                    Pengaturan Header
                                </h4>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Section
                                    </label>
                                    <input
                                        type="text"
                                        value={sectionTitle}
                                        onChange={(e) =>
                                            setSectionTitle(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Portfolio Proyek..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Deskripsi Header
                                    </label>
                                    <textarea
                                        value={sectionDesc}
                                        onChange={(e) =>
                                            setSectionDesc(e.target.value)
                                        }
                                        rows={3}
                                        className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm leading-relaxed font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Tulis deskripsi singkat..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Daftar Proyek */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Daftar Proyek ({projects.length})
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-admin-accent/10 px-4 py-2 text-xs font-bold text-admin-accent transition-all duration-200 hover:bg-admin-accent hover:text-white"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Proyek
                                    </button>
                                </div>

                                {projects.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/20 py-12 text-center">
                                        <ImageIcon className="mb-3 h-8 w-8 animate-pulse text-admin-text-muted" />
                                        <p className="text-sm font-semibold text-admin-text-muted">
                                            Belum ada proyek
                                        </p>
                                        <p className="mt-1 text-xs text-admin-text-muted">
                                            Klik "Tambah Proyek" untuk mulai
                                            mengunggah foto proyek
                                        </p>
                                    </div>
                                )}

                                <div className="custom-scrollbar max-h-[500px] space-y-3 overflow-y-auto pr-1">
                                    {projects.map((project, idx) => (
                                        <ProjectCardEditor
                                            key={project.id}
                                            project={project}
                                            index={idx}
                                            onChange={handleChange}
                                            onDelete={handleDelete}
                                            onDragStart={handleDragStart}
                                            onDragOver={handleDragOver}
                                            onDragEnd={handleDragEnd}
                                            isDragging={draggedIndex === idx}
                                            triggerToast={triggerToast}
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
                                    Preview Portofolio
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        <PreviewPanel
                            sectionTitle={sectionTitle}
                            sectionDesc={sectionDesc}
                            projects={projects}
                        />

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
                type={toastType}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
