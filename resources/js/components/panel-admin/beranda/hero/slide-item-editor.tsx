import {
    Play,
    Image as ImageIcon,
    Link as LinkIcon,
    UploadCloud,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ImagePositionZoomControl from '@/components/panel-admin/common/image-position-zoom-control';

interface CarouselItem {
    id: string;
    type: 'video' | 'image';
    sourceType: 'url' | 'upload';
    url: string;
    fileName?: string;
    previewUrl?: string;
    label?: string;
    positionX?: number;
    positionY?: number;
    scale?: number;
    file?: File;
}

interface SlideItemEditorProps {
    item: CarouselItem;
    index: number;
    updateCarouselItem: (
        idx: number,
        key: keyof CarouselItem,
        value: any,
    ) => void;
    handleFileChange: (
        idx: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    isSaving: boolean;
    uploadPercentage: number | null;
}

export default function SlideItemEditor({
    item,
    index,
    updateCarouselItem,
    handleFileChange,
    isSaving,
    uploadPercentage,
}: SlideItemEditorProps) {
    return (
        <div className="animate-fadeIn space-y-6 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-6">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-admin-text">
                    Konfigurasi Slide {index + 1}
                </span>

                {/* Pilih Tipe Media */}
                <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                    <button
                        type="button"
                        onClick={() =>
                            updateCarouselItem(index, 'type', 'video')
                        }
                        className={cn(
                            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                            item.type === 'video'
                                ? 'bg-admin-accent text-white shadow-sm'
                                : 'text-admin-text-muted hover:text-admin-text',
                        )}
                    >
                        <Play size={10} /> Video
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            updateCarouselItem(index, 'type', 'image')
                        }
                        className={cn(
                            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                            item.type === 'image'
                                ? 'bg-admin-accent text-white shadow-sm'
                                : 'text-admin-text-muted hover:text-admin-text',
                        )}
                    >
                        <ImageIcon size={10} /> Gambar
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                    Label Navigasi Slide
                </label>
                <input
                    type="text"
                    value={item.label ?? ''}
                    onChange={(e) =>
                        updateCarouselItem(index, 'label', e.target.value)
                    }
                    className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 text-xs font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Contoh: Kantor PT PEB"
                    maxLength={100}
                />
            </div>

            {/* Pilih Tipe Source: URL atau Upload */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() =>
                        updateCarouselItem(index, 'sourceType', 'url')
                    }
                    className={cn(
                        'cursor-pointer rounded-xl border py-3 text-xs font-bold transition-all',
                        item.sourceType === 'url'
                            ? 'border-admin-accent bg-admin-accent/5 text-admin-accent'
                            : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:bg-admin-bg',
                    )}
                >
                    Input URL
                </button>
                <button
                    type="button"
                    onClick={() =>
                        updateCarouselItem(index, 'sourceType', 'upload')
                    }
                    className={cn(
                        'cursor-pointer rounded-xl border py-3 text-xs font-bold transition-all',
                        item.sourceType === 'upload'
                            ? 'border-admin-accent bg-admin-accent/5 text-admin-accent'
                            : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:bg-admin-bg',
                    )}
                >
                    Unggah File
                </button>
            </div>

            {/* Tampilan Kondisional Berdasarkan Tipe Source */}
            {item.sourceType === 'url' ? (
                <div className="space-y-2">
                    <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                        <LinkIcon size={10} />
                        Tautan URL Media
                    </label>
                    <input
                        type="text"
                        value={item.url}
                        onChange={(e) =>
                            updateCarouselItem(index, 'url', e.target.value)
                        }
                        className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        placeholder="Contoh: https://domain.com/video.mp4 atau path /assets/..."
                        required
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                        <UploadCloud size={10} />
                        Unggah File Media Lokal
                    </label>

                    <input
                        id={`hero-media-${item.id}`}
                        type="file"
                        accept=".mp4,.webm,.ogg,.mov,.jpeg,.jpg,.png,.gif,.webp"
                        onChange={(event) => handleFileChange(index, event)}
                        disabled={isSaving}
                        className="peer sr-only"
                        aria-label={`Pilih file untuk Slide ${index + 1}`}
                    />
                    <label
                        htmlFor={`hero-media-${item.id}`}
                        className={cn(
                            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-admin-accent hover:border-admin-accent/50',
                            isSaving && 'pointer-events-none opacity-50',
                        )}
                    >
                        <UploadCloud
                            size={28}
                            className="text-admin-text-muted"
                        />
                        <span className="text-xs font-semibold text-admin-text">
                            {item.file ? 'Ganti file' : 'Pilih video atau foto'}
                        </span>
                        <span className="text-center text-[10px] text-admin-text-muted">
                            Video: MP4, WebM, OGG, MOV (maks. 500 MB). Foto:
                            JPG, PNG, GIF, WebP (maks. 500 MB).
                        </span>
                    </label>
                    {item.fileName && (
                        <div className="flex items-start gap-2 rounded-xl border border-admin-border bg-admin-bg/50 p-3 text-xs text-admin-text">
                            <CheckCircle2
                                size={14}
                                className="mt-0.5 shrink-0 text-emerald-500"
                            />
                            <div className="min-w-0">
                                <p className="font-medium break-all">
                                    {item.fileName}
                                </p>
                                <p className="mt-1 text-[11px] text-admin-text-muted">
                                    {item.file
                                        ? `${(item.file.size / 1024 / 1024).toFixed(1)} MB · Siap diunggah. Klik Simpan Perubahan.`
                                        : 'File tersimpan di server.'}
                                </p>
                            </div>
                        </div>
                    )}
                    {isSaving && item.file && (
                        <div
                            role="status"
                            className="space-y-2 text-xs text-admin-text-muted"
                        >
                            <p>
                                {uploadPercentage === 100
                                    ? 'Upload selesai, sedang menyimpan...'
                                    : `Mengunggah ${uploadPercentage ?? 0}%`}
                            </p>
                            <progress
                                aria-label="Progres unggah media"
                                value={uploadPercentage ?? 0}
                                max={100}
                                className="h-2 w-full accent-admin-accent"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Pengaturan Posisi & Zoom jika tipe media adalah Gambar */}
            {item.type === 'image' && (
                <ImagePositionZoomControl
                    imageUrl={item.previewUrl || item.url}
                    positionX={item.positionX ?? 50}
                    positionY={item.positionY ?? 50}
                    scale={item.scale ?? 1}
                    onChange={({ positionX, positionY, scale }) => {
                        updateCarouselItem(index, 'positionX', positionX);
                        updateCarouselItem(index, 'positionY', positionY);
                        updateCarouselItem(index, 'scale', scale);
                    }}
                />
            )}
        </div>
    );
}
