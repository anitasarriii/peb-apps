import React from 'react';
import { Link as LinkIcon, UploadCloud, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PengadaanItem } from '../types';

interface CoverImageEditorProps {
    activeItem: PengadaanItem;
    sourceType: 'url' | 'upload';
    displayUrl: string;
    uploadingImage: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChange: (updated: PengadaanItem) => void;
}

export default function CoverImageEditor({
    activeItem,
    sourceType,
    displayUrl,
    uploadingImage,
    fileInputRef,
    handleFileChange,
    handleChange,
}: CoverImageEditorProps) {
    return (
        <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-admin-text">
                    Gambar Cover
                </label>
                <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                    {(['url', 'upload'] as const).map((st) => (
                        <button
                            key={st}
                            type="button"
                            onClick={() =>
                                handleChange({
                                    ...activeItem,
                                    imageSourceType: st,
                                })
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

            {sourceType === 'url' ? (
                <input
                    type="text"
                    value={activeItem.imageSrc}
                    onChange={(e) =>
                        handleChange({
                            ...activeItem,
                            imageSrc: e.target.value,
                            imagePreviewUrl: undefined,
                        })
                    }
                    className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                    placeholder="/assets/... atau https://..."
                />
            ) : (
                <div className="space-y-2">
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
                        {uploadingImage ? (
                            <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                Memproses file gambar...
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                    {activeItem.imageFileName && !uploadingImage && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 size={12} />
                            File {activeItem.imageFileName} berhasil dimuat
                        </div>
                    )}
                </div>
            )}

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-admin-border/50 bg-admin-bg">
                <img
                    src={displayUrl}
                    alt={activeItem.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(activeItem.category || 'PEB')}`;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute right-4 bottom-3 left-4">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="rounded border border-admin-accent/30 bg-admin-accent/10 px-2 py-0.5 text-[9px] font-bold text-admin-accent">
                            {activeItem.status}
                        </span>
                        <span className="text-[9px] text-white/60">
                            {activeItem.category}
                        </span>
                    </div>
                    <p className="line-clamp-1 text-xs font-bold text-white">
                        {activeItem.title}
                    </p>
                </div>
            </div>
        </div>
    );
}
