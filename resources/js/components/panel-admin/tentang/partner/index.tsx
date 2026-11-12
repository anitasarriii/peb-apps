import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Save, Plus, RotateCcw, ShieldCheck, Eye } from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updatePartner } from '@/routes/panel-admin/tentang/partner-section';
import PartnerRowEditor from '@/components/panel-admin/beranda/partner/partner-row-editor';
import type { PartnerItem } from '@/components/panel-admin/beranda/partner/partner-row-editor';

interface PartnerSection {
    title?: string;
    partners?: PartnerItem[];
}

interface PartnerSectionEditorProps {
    partnerSection?: PartnerSection;
}

const defaultPartners: PartnerItem[] = [
    { id: '1', name: 'PLN Batam', logoSrc: '', logoSource: 'none' },
    { id: '2', name: 'Pertamina', logoSrc: '', logoSource: 'none' },
    { id: '3', name: 'Siemens', logoSrc: '', logoSource: 'none' },
    { id: '4', name: 'Schneider', logoSrc: '', logoSource: 'none' },
    { id: '5', name: 'GE Energy', logoSrc: '', logoSource: 'none' },
];

export default function PartnerTentangEditor({
    partnerSection,
}: PartnerSectionEditorProps) {
    const [title, setTitle] = useState(
        partnerSection?.title || 'Partner & Kolaborator Kami',
    );
    const [partners, setPartners] = useState<PartnerItem[]>(
        partnerSection?.partners || defaultPartners,
    );
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi partner telah diperbarui.',
    );

    // Drag-and-drop state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleUpdate = (updated: PartnerItem) =>
        setPartners((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p)),
        );

    const handleDelete = (id: string) => {
        if (partners.length <= 1) {
            alert('Minimal harus memiliki 1 partner.');
            return;
        }
        setPartners((prev) => prev.filter((p) => p.id !== id));
    };

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
    };

    const handleReset = () => {
        setTitle(partnerSection?.title || 'Partner & Kolaborator Kami');
        setPartners(partnerSection?.partners || defaultPartners);
    };

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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('title', title);

        partners.forEach((p, index) => {
            formData.append(`partners[${index}][id]`, p.id);
            formData.append(`partners[${index}][name]`, p.name);
            formData.append(`partners[${index}][logoSource]`, p.logoSource);
            formData.append(
                `partners[${index}][logoSrc]`,
                p.logoSource === 'upload' && p.logoFile ? '' : p.logoSrc || '',
            );

            if (p.logoSource === 'upload' && p.logoFile) {
                formData.append(`partners[${index}][logoFile]`, p.logoFile);
            }
        });

        router.post(updatePartner.url(), formData as any, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                triggerToast(
                    'success',
                    'Konfigurasi partner telah diperbarui.',
                );
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('[PartnerTentangEditor] Gagal menyimpan:', err);
                const errorMsg = Object.values(err).join('\n');
                triggerToast(
                    'error',
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
    };

    return (
        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol (Kiri) */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Partner & Kolaborator (Tentang)
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Konfigurasi judul section partner dan
                                        kelola daftar nama serta logo mitra
                                        kolaborator.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Section
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                                        placeholder="Judul Section Partner..."
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
                                                isDragging={
                                                    draggedIndex === idx
                                                }
                                            />
                                        ))}
                                    </div>
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
                    <div className="group relative flex h-[400px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Partner & Kolaborator
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        {/* Mockup Frame Partner */}
                        <div className="custom-scrollbar flex w-full flex-1 flex-col justify-center overflow-y-auto rounded-[2rem] border border-admin-border bg-[#f9fbfc] p-6 text-center dark:bg-[#051515]">
                            <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-[#94a3b8] uppercase dark:text-white/30">
                                {title}
                            </h3>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {partners.map((partner) => (
                                    <div
                                        key={partner.id}
                                        className="flex cursor-default items-center justify-center text-xs font-black text-[#7b8c9d] transition-all hover:text-[#00A4B9] dark:text-white/50"
                                    >
                                        {partner.logoSrc &&
                                        partner.logoSource !== 'none' ? (
                                            <img
                                                src={partner.logoSrc}
                                                alt={partner.name}
                                                className="h-6 w-auto max-w-[100px] object-contain opacity-80 transition-opacity hover:opacity-100"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).style.display = 'none';
                                                    const span =
                                                        document.createElement(
                                                            'span',
                                                        );
                                                    span.className =
                                                        'text-xs font-black text-[#7b8c9d] hover:text-[#00A4B9] dark:text-white/50';
                                                    span.textContent =
                                                        partner.name;
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).parentElement?.appendChild(
                                                        span,
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <span>
                                                {partner.name || 'Partner'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>PARTNER MOCKUP PREVIEW</span>
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
            />
        </div>
    );
}
