import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Save, Plus, RotateCcw, Building2 } from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updatePartner } from '@/routes/panel-admin/beranda/partner-section';
import { defaultPartners, type PartnerItem } from './types';
import PartnerRowEditor from './partner-row-editor';
import PreviewPanel from './preview-panel';

interface PartnerSection {
    title?: string;
    partners?: PartnerItem[];
}

interface PartnerSectionEditorProps {
    partnerSection?: PartnerSection;
}

// ============================================================
// Main Export: PartnerSectionEditor
// ============================================================
export default function PartnerSectionEditor({
    partnerSection,
}: PartnerSectionEditorProps) {
    // ── State ──────────────────────────────────────────────
    const [title, setTitle] = useState(
        partnerSection?.title || 'Partner Kami & Kollaborators',
    );
    const [partners, setPartners] = useState<PartnerItem[]>(
        partnerSection?.partners || defaultPartners,
    );
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi section Partner telah diperbarui.',
    );

    // Drag-and-drop state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // ── CRUD Handlers ──────────────────────────────────────
    const handleUpdate = (updated: PartnerItem) =>
        setPartners((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p)),
        );

    const handleDelete = (id: string) =>
        setPartners((prev) => prev.filter((p) => p.id !== id));

    const handleAdd = () => {
        setPartners((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                name: '',
                logoSrc: '',
                logoSource: 'none',
            },
        ]);
        console.log('[PartnerSectionEditor] Partner baru ditambahkan.');
    };

    const handleReset = () => {
        setTitle(partnerSection?.title || 'Partner Kami & Kollaborators');
        setPartners(partnerSection?.partners || defaultPartners);
        console.log('[PartnerSectionEditor] Reset ke konfigurasi terakhir.');
    };

    // ── Drag-and-Drop Handlers ─────────────────────────────
    const handleDragStart = (index: number) => setDraggedIndex(index);

    const handleDragOver = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;
        setPartners((prev) => {
            const next = [...prev];
            const draggedItem = next[draggedIndex];
            next.splice(draggedIndex, 1);
            next.splice(index, 0, draggedItem);
            return next;
        });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => setDraggedIndex(null);

    // ── Save Handler ───────────────────────────────────────
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            title,
            partners: partners.map((p) => ({
                id: p.id,
                name: p.name || 'Partner Baru',
                logoSource: p.logoSource || (p.logoSrc ? 'url' : 'none'),
                logoSrc:
                    p.logoSource === 'upload' && p.logoFile
                        ? ''
                        : p.logoSrc || '',
                logoFile: p.logoSource === 'upload' ? p.logoFile : undefined,
            })),
        };

        router.post(updatePartner.url(), payload, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                triggerToast(
                    'success',
                    'Konfigurasi section Partner telah diperbarui.',
                );
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('[PartnerSectionEditor] Gagal menyimpan:', err);
                const errorMsg =
                    typeof err === 'object' && err !== null
                        ? Object.values(err).join('\n')
                        : String(err);
                triggerToast(
                    'error',
                    `Gagal menyimpan perubahan:\n${errorMsg || JSON.stringify(err)}`,
                );
            },
        });
    };

    return (
        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* ══════════════════════════════════════════════
                Form Editor — Col span 7
            ══════════════════════════════════════════════ */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        {/* Dekorasi blur latar */}
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header Panel */}
                        <div className="mb-6 flex items-center justify-between border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Partner Perusahaan
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Kelola logo dan nama partner,
                                        kolaborator, serta perusahaan
                                        terafiliasi.
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
                                    placeholder="Partner Kami & Kollaborators..."
                                    required
                                />
                            </div>

                            {/* Daftar Partner */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Daftar Partner ({partners.length})
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-admin-accent/10 px-4 py-2 text-xs font-bold text-admin-accent transition-all duration-200 hover:bg-admin-accent hover:text-white"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Partner
                                    </button>
                                </div>

                                {/* Empty State */}
                                {partners.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/20 py-12 text-center">
                                        <Building2 className="mb-3 h-8 w-8 animate-pulse text-admin-text-muted" />
                                        <p className="text-sm font-semibold text-admin-text-muted">
                                            Belum ada partner
                                        </p>
                                        <p className="mt-1 text-xs text-admin-text-muted">
                                            Klik "Tambah Partner" untuk mulai
                                            mengunggah logo partner
                                        </p>
                                    </div>
                                )}

                                {/* List dengan drag-and-drop */}
                                <div className="custom-scrollbar max-h-[500px] space-y-3 overflow-y-auto pr-1">
                                    {partners.map((partner, idx) => (
                                        <PartnerRowEditor
                                            key={partner.id}
                                            partner={partner}
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

            {/* ══════════════════════════════════════════════
                Live Preview — Col span 5
            ══════════════════════════════════════════════ */}
            <div className="space-y-6 xl:col-span-5">
                <PreviewPanel title={title} partners={partners} />
            </div>

            {/* ══════════════════════════════════════════════
                Notification Toast
            ══════════════════════════════════════════════ */}
            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
