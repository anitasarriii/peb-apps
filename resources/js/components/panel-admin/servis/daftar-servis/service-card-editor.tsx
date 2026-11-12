import { useRef, useState } from 'react';
import {
    Image as ImageIcon,
    Link as LinkIcon,
    UploadCloud,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
    imageFile?: File;
}

interface ServiceCardEditorProps {
    service: ServiceItem;
    onChange: (updated: ServiceItem) => void;
}

export default function ServiceCardEditor({
    service,
    onChange,
}: ServiceCardEditorProps) {
    const sourceType = service.imageSourceType ?? 'url';
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const setSourceType = (type: 'url' | 'upload') => {
        onChange({ ...service, imageSourceType: type });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // Revoke URL lama jika ada
        if (service.imagePreviewUrl) {
            URL.revokeObjectURL(service.imagePreviewUrl);
        }

        const localUrl = URL.createObjectURL(file);
        setUploadProgress(null);

        onChange({
            ...service,
            imageSrc: localUrl,
            imagePreviewUrl: localUrl,
            imageFileName: file.name,
            imageSourceType: 'upload',
            imageFile: file,
        });
        setUploadProgress(null);
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const displayUrl = service.imagePreviewUrl || service.imageSrc;

    return (
        <div className="space-y-4">
            {/* Deskripsi */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Deskripsi
                </label>
                <textarea
                    value={service.description}
                    onChange={(e) =>
                        onChange({ ...service, description: e.target.value })
                    }
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Deskripsi layanan servis..."
                    required
                />
            </div>

            {/* ── Thumbnail Media ───────────────────────────────── */}
            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                {/* Header + toggle tipe */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-admin-text">
                        <ImageIcon size={14} className="text-admin-accent" />
                        Gambar Thumbnail
                    </label>

                    {/* Toggle URL / Upload */}
                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                        <button
                            type="button"
                            onClick={() => setSourceType('url')}
                            className={cn(
                                'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                sourceType === 'url'
                                    ? 'bg-admin-accent text-white shadow-sm'
                                    : 'text-admin-text-muted hover:text-admin-text',
                            )}
                        >
                            <LinkIcon size={10} />
                            URL
                        </button>
                        <button
                            type="button"
                            onClick={() => setSourceType('upload')}
                            className={cn(
                                'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                sourceType === 'upload'
                                    ? 'bg-admin-accent text-white shadow-sm'
                                    : 'text-admin-text-muted hover:text-admin-text',
                            )}
                        >
                            <UploadCloud size={10} />
                            Unggah
                        </button>
                    </div>
                </div>

                {/* ── Mode URL ── */}
                {sourceType === 'url' && (
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                            <LinkIcon size={10} />
                            Tautan URL Gambar
                        </label>
                        <input
                            type="text"
                            value={service.imageSrc}
                            onChange={(e) =>
                                onChange({
                                    ...service,
                                    imageSrc: e.target.value,
                                    imagePreviewUrl: undefined,
                                })
                            }
                            className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                            placeholder="/assets/servis/image.png atau https://..."
                            required
                        />
                    </div>
                )}

                {/* ── Mode Upload ── */}
                {sourceType === 'upload' && (
                    <div className="space-y-3">
                        <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                            <UploadCloud size={10} />
                            Unggah File Gambar Lokal
                        </label>

                        {/* Dropzone */}
                        <div
                            onClick={triggerFileSelect}
                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-all duration-300 hover:border-admin-accent/50"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <UploadCloud
                                size={28}
                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                            />
                            <p className="text-xs font-bold text-admin-text">
                                Pilih file Gambar
                            </p>
                            <p className="max-w-[200px] text-center text-[10px] text-admin-text-muted">
                                Tarik & lepas file di sini atau klik untuk
                                menjelajah
                            </p>
                        </div>

                        {/* Progress bar */}
                        {uploadProgress !== null && uploadProgress < 100 && (
                            <div className="space-y-2 rounded-xl border border-admin-border bg-admin-bg/80 p-4">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="max-w-[200px] truncate text-admin-text">
                                        {service.imageFileName ||
                                            'Mengupload...'}
                                    </span>
                                    <span className="text-admin-accent">
                                        {uploadProgress}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-admin-border">
                                    <div
                                        className="h-full rounded-full bg-admin-accent transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Sukses */}
                        {service.imageFileName && uploadProgress === 100 && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                <CheckCircle2 size={12} />
                                File berhasil dimuat untuk preview
                            </div>
                        )}
                    </div>
                )}

                {/* Preview thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-admin-border/50 bg-admin-bg">
                    <img
                        src={displayUrl}
                        alt={service.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(service.title)}`;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                        <p className="text-xs font-bold text-white">
                            {service.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-white/60">
                            Preview thumbnail
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
