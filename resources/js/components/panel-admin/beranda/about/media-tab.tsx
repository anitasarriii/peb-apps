import {
    Play,
    Image as ImageIcon,
    Link as LinkIcon,
    UploadCloud,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaTabProps {
    mediaSourceType: 'url' | 'upload';
    setMediaSourceType: (val: 'url' | 'upload') => void;
    mediaUrl: string;
    setMediaUrl: (val: string) => void;
    mediaFileName: string;
    uploadingMedia: boolean;
    mediaInputRef: React.RefObject<HTMLInputElement | null>;
    handleMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    triggerMediaSelect: () => void;
    uploadProgress: number;
    mediaType: 'video' | 'image';
    setMediaType: (val: 'video' | 'image') => void;
}

export default function MediaTab({
    mediaSourceType,
    setMediaSourceType,
    mediaUrl,
    setMediaUrl,
    mediaFileName,
    uploadingMedia,
    mediaInputRef,
    handleMediaChange,
    triggerMediaSelect,
    uploadProgress,
    mediaType,
    setMediaType,
}: MediaTabProps) {
    return (
        <div className="animate-fadeIn space-y-6 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-6">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-admin-text">
                    Tipe Media Utama
                </span>

                {/* Pilih Tipe Media */}
                <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                    <button
                        type="button"
                        onClick={() => setMediaType('video')}
                        className={cn(
                            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                            mediaType === 'video'
                                ? 'bg-admin-accent text-white shadow-sm'
                                : 'text-admin-text-muted hover:text-admin-text',
                        )}
                    >
                        <Play size={10} /> Video
                    </button>
                    <button
                        type="button"
                        onClick={() => setMediaType('image')}
                        className={cn(
                            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                            mediaType === 'image'
                                ? 'bg-admin-accent text-white shadow-sm'
                                : 'text-admin-text-muted hover:text-admin-text',
                        )}
                    >
                        <ImageIcon size={10} /> Gambar
                    </button>
                </div>
            </div>

            {/* Pilih Tipe Source: URL atau Upload */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setMediaSourceType('url')}
                    className={cn(
                        'cursor-pointer rounded-xl border py-3 text-xs font-bold transition-all',
                        mediaSourceType === 'url'
                            ? 'border-admin-accent bg-admin-accent/5 text-admin-accent'
                            : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:bg-admin-bg',
                    )}
                >
                    Gunakan URL
                </button>
                <button
                    type="button"
                    onClick={() => setMediaSourceType('upload')}
                    className={cn(
                        'cursor-pointer rounded-xl border py-3 text-xs font-bold transition-all',
                        mediaSourceType === 'upload'
                            ? 'border-admin-accent bg-admin-accent/5 text-admin-accent'
                            : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:bg-admin-bg',
                    )}
                >
                    Unggah File
                </button>
            </div>

            {/* Tampilan Kondisional Berdasarkan Tipe Source */}
            {mediaSourceType === 'url' ? (
                <div className="space-y-2">
                    <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                        <LinkIcon size={10} />
                        Tautan URL Media
                    </label>
                    <input
                        type="text"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        placeholder="Contoh: /assets/beranda/about/about.png atau /assets/beranda/hero/hero-video.mp4"
                        required
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                        <UploadCloud size={10} />
                        Unggah File Media Lokal
                    </label>

                    {/* File Dropzone */}
                    <div
                        onClick={triggerMediaSelect}
                        className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-all duration-300 hover:border-admin-accent/50"
                    >
                        <input
                            type="file"
                            ref={mediaInputRef}
                            accept={
                                mediaType === 'video' ? 'video/*' : 'image/*'
                            }
                            onChange={handleMediaChange}
                            className="hidden"
                        />

                        <UploadCloud
                            size={28}
                            className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                        />
                        <p className="text-xs font-bold text-admin-text">
                            Pilih file{' '}
                            {mediaType === 'video' ? 'Video' : 'Gambar'}
                        </p>
                        <p className="max-w-[200px] text-center text-[10px] text-admin-text-muted">
                            Tarik & lepas file di sini atau klik untuk
                            menjelajah
                        </p>
                    </div>

                    {/* Upload Progress & Info File */}
                    {uploadingMedia && uploadProgress > 0 && (
                        <div className="space-y-2 rounded-xl border border-admin-border bg-admin-bg/80 p-4">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="max-w-[200px] truncate text-admin-text">
                                    {mediaFileName || 'Memproses file...'}
                                </span>
                                <span className="text-admin-accent">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-admin-border">
                                <div
                                    className="h-full rounded-full bg-admin-accent transition-all duration-300"
                                    style={{
                                        width: `${uploadProgress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {mediaFileName && !uploadingMedia && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 size={12} />
                            File {mediaFileName} berhasil dimuat untuk preview
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
