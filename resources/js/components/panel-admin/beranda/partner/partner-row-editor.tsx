import {
    Trash2,
    Upload,
    Link,
    X,
    GripVertical,
    ChevronDown,
    ChevronUp,
    Building2,
    CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// Type Definition (inline untuk menghindari module resolution issue)
// ============================================================
export interface PartnerItem {
    id: string;
    name: string;
    logoSrc: string;
    logoSource: 'url' | 'upload' | 'none';
    logoFile?: File;
}

// ============================================================
// Props
// ============================================================
interface PartnerRowEditorProps {
    partner: PartnerItem;
    index: number;
    onUpdate: (updated: PartnerItem) => void;
    onDelete: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
}

// ============================================================
// Component
// ============================================================
export default function PartnerRowEditor({
    partner,
    index,
    onUpdate,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
}: PartnerRowEditorProps) {
    const [open, setOpen] = useState(false);
    const [dragStartReady, setDragStartReady] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoFileName, setLogoFileName] = useState('');

    // Helper: update satu field pada partner
    const update = (field: keyof PartnerItem, val: string) =>
        onUpdate({ ...partner, [field]: val });

    // Handler upload file logo yang langsung menempel ke state tanpa delay
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadingLogo(true);
        setLogoFileName(file.name);

        // Gunakan object URL agar preview langsung muncul dan file tetap ikut dalam submit
        const previewUrl = URL.createObjectURL(file);

        onUpdate({
            ...partner,
            logoSrc: previewUrl,
            logoSource: 'upload',
            logoFile: file,
        });

        setUploadingLogo(false);
        console.log(
            `[PartnerRowEditor] Logo "${file.name}" berhasil dipilih untuk partner: ${partner.name || 'Baru'}`,
        );
    };

    return (
        <div
            draggable={dragStartReady}
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(index);
            }}
            onDragEnd={() => {
                onDragEnd();
                setDragStartReady(false);
            }}
            className={cn(
                'rounded-2xl border transition-all duration-300',
                isDragging
                    ? 'border-admin-accent bg-admin-accent/5 opacity-40'
                    : 'border-admin-border bg-admin-card hover:border-admin-accent/30',
            )}
        >
            {/* ── Header Row ── */}
            <div className="flex items-center gap-3 p-3.5">
                {/* Drag Handle */}
                <div
                    onMouseDown={() => setDragStartReady(true)}
                    onMouseUp={() => setDragStartReady(false)}
                    onMouseLeave={() => setDragStartReady(false)}
                    className="flex-shrink-0 cursor-grab p-1 text-admin-text-muted transition-colors hover:text-admin-accent active:cursor-grabbing"
                    title="Tarik untuk mengurutkan"
                >
                    <GripVertical className="h-4 w-4" />
                </div>

                {/* Logo Preview Thumbnail */}
                <div className="flex h-9 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-admin-bg">
                    {partner.logoSrc && partner.logoSource !== 'none' ? (
                        <img
                            src={partner.logoSrc}
                            alt={partner.name}
                            className="h-full w-full object-contain p-1"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                    'none';
                            }}
                        />
                    ) : (
                        <Building2 className="h-4 w-4 text-admin-text-muted" />
                    )}
                </div>

                <span className="flex-1 truncate text-sm font-semibold text-admin-text">
                    {partner.name || 'Partner Baru'}
                </span>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onDelete(partner.id)}
                        className="cursor-pointer rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        title="Hapus partner"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="cursor-pointer rounded-lg p-1.5 text-admin-text-muted transition-colors hover:bg-admin-bg hover:text-admin-text"
                    >
                        {open ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* ── Expanded Form ── */}
            {open && (
                <div className="space-y-4 border-t border-admin-border bg-admin-bg/20 px-4 py-4">
                    {/* Nama Partner */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Nama Partner
                        </label>
                        <input
                            type="text"
                            value={partner.name}
                            onChange={(e) => update('name', e.target.value)}
                            placeholder="Nama perusahaan / partner"
                            className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                        />
                    </div>

                    {/* Logo Source Selector */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Logo (Opsional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {(['none', 'url', 'upload'] as const).map((src) => (
                                <button
                                    type="button"
                                    key={src}
                                    onClick={() =>
                                        onUpdate({
                                            ...partner,
                                            logoSource: src,
                                            logoSrc:
                                                src === 'none'
                                                    ? ''
                                                    : partner.logoSrc,
                                        })
                                    }
                                    className={cn(
                                        'flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all',
                                        partner.logoSource === src
                                            ? 'border-admin-accent bg-admin-accent text-white'
                                            : 'border-admin-border bg-admin-bg text-admin-text-muted hover:text-admin-text',
                                    )}
                                >
                                    {src === 'url' ? (
                                        <Link className="h-3.5 w-3.5" />
                                    ) : src === 'upload' ? (
                                        <Upload className="h-3.5 w-3.5" />
                                    ) : (
                                        <Building2 className="h-3.5 w-3.5" />
                                    )}
                                    {src === 'none'
                                        ? 'Teks Saja'
                                        : src === 'url'
                                          ? 'Dari URL'
                                          : 'Upload'}
                                </button>
                            ))}
                        </div>

                        {/* Input URL */}
                        {partner.logoSource === 'url' && (
                            <div className="relative">
                                <input
                                    type="url"
                                    value={partner.logoSrc}
                                    onChange={(e) =>
                                        update('logoSrc', e.target.value)
                                    }
                                    placeholder="https://example.com/logo.png"
                                    className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 pr-10 font-mono text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                                />
                                {partner.logoSrc && (
                                    <button
                                        type="button"
                                        onClick={() => update('logoSrc', '')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-admin-text-muted hover:text-red-400"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Upload File */}
                        {partner.logoSource === 'upload' && (
                            <div className="space-y-2">
                                <div
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                `partner-logo-input-${partner.id}`,
                                            )
                                            ?.click()
                                    }
                                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 py-5 transition-colors hover:border-admin-accent/50"
                                >
                                    <input
                                        id={`partner-logo-input-${partner.id}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <Upload className="mb-1.5 h-5 w-5 text-admin-text-muted transition-colors group-hover:text-admin-accent" />
                                    <span className="text-xs font-bold text-admin-text">
                                        Klik untuk upload logo
                                    </span>
                                    <span className="mt-0.5 text-[10px] text-admin-text-muted">
                                        PNG, SVG transparan direkomendasikan
                                    </span>
                                </div>

                                {uploadingLogo && (
                                    <div className="flex animate-pulse items-center gap-2 text-xs font-bold text-admin-accent">
                                        <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                        Memproses file gambar...
                                    </div>
                                )}

                                {logoFileName && !uploadingLogo && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                        <CheckCircle2 size={12} />
                                        File {logoFileName} berhasil dimuat
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Logo Preview */}
                        {partner.logoSrc && partner.logoSource !== 'none' && (
                            <div className="mt-3 flex h-16 w-24 items-center justify-center rounded-xl border border-admin-border bg-white p-2">
                                <img
                                    src={partner.logoSrc}
                                    alt="Logo preview"
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
