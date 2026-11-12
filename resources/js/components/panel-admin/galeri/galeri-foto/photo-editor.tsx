import { useRef, useState } from 'react';
import { Images, Link as LinkIcon, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminSelect from '@/components/panel-admin/admin-select';
import type { GalleryItem } from './types';

interface PhotoEditorProps {
    item: GalleryItem;
    categories: string[];
    onChange: (updated: GalleryItem) => void;
}

export default function PhotoEditor({
    item,
    categories,
    onChange,
}: PhotoEditorProps) {
    const sourceType = item.imageSourceType ?? 'url';
    const displayUrl = item.imagePreviewUrl || item.imageSrc;
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (item.imagePreviewUrl) URL.revokeObjectURL(item.imagePreviewUrl);
        const localUrl = URL.createObjectURL(file);
        setUploadProgress(null);
        onChange({
            ...item,
            imageSrc: localUrl,
            imagePreviewUrl: localUrl,
            imageFileName: file.name,
            imageSourceType: 'upload',
            file: file,
        } as any);
        setUploadProgress(null);
    };

    return (
        <div className="space-y-4">
            {/* Active indicator */}
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                <span className="text-xs font-bold tracking-widest text-admin-accent uppercase">
                    Mengedit: {item.title}
                </span>
            </div>

            {/* Judul */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Judul Foto
                </label>
                <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                        onChange({ ...item, title: e.target.value })
                    }
                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                    placeholder="Judul foto..."
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Kategori */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Kategori
                    </label>
                    <AdminSelect
                        value={item.category}
                        onValueChange={(val) =>
                            onChange({ ...item, category: val })
                        }
                        options={categories}
                        placeholder="Pilih kategori..."
                    />
                </div>

                {/* Lokasi */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Lokasi
                    </label>
                    <input
                        type="text"
                        value={item.location}
                        onChange={(e) =>
                            onChange({ ...item, location: e.target.value })
                        }
                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                        placeholder="Lokasi foto..."
                        required
                    />
                </div>
            </div>

            {/* Gambar */}
            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                {/* Header toggle */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-admin-text">
                        <Images size={14} className="text-admin-accent" />{' '}
                        Gambar Foto
                    </label>
                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                        {(['url', 'upload'] as const).map((st) => (
                            <button
                                key={st}
                                type="button"
                                onClick={() =>
                                    onChange({ ...item, imageSourceType: st })
                                }
                                className={cn(
                                    'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                    sourceType === st
                                        ? 'bg-admin-accent text-white shadow-sm'
                                        : 'text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                {st === 'url' ? (
                                    <LinkIcon size={10} />
                                ) : (
                                    <UploadCloud size={10} />
                                )}
                                {st === 'url' ? 'URL' : 'Unggah'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* URL input */}
                {sourceType === 'url' && (
                    <input
                        type="text"
                        value={item.imageSrc}
                        onChange={(e) =>
                            onChange({
                                ...item,
                                imageSrc: e.target.value,
                                imagePreviewUrl: undefined,
                            })
                        }
                        className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                        placeholder="/assets/... atau https://..."
                        required
                    />
                )}

                {/* Upload dropzone */}
                {sourceType === 'upload' && (
                    <div className="space-y-3">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-all hover:border-admin-accent/50"
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
                            <p className="text-center text-[10px] text-admin-text-muted">
                                Tarik & lepas atau klik untuk menjelajah
                            </p>
                        </div>

                        {uploadProgress !== null && uploadProgress < 100 && (
                            <div className="space-y-2 rounded-xl border border-admin-border bg-admin-bg/80 p-4">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="max-w-[200px] truncate text-admin-text">
                                        {item.imageFileName || 'Mengupload...'}
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
                    </div>
                )}

                {/* Preview thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-admin-border/50 bg-admin-bg">
                    <img
                        src={displayUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(item.title)}`;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute right-4 bottom-3 left-4">
                        <p className="line-clamp-1 text-xs font-bold text-white">
                            {item.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-admin-accent/80 px-2 py-0.5 text-[10px] font-bold text-white">
                                {item.category}
                            </span>
                            <span className="text-[10px] text-white/60">
                                {item.location}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
