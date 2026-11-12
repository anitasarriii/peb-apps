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
    positionX?: number;
    positionY?: number;
    scale?: number;
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
    uploadProgress: Record<string, number>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    triggerFileSelect: () => void;
}

export default function SlideItemEditor({
    item,
    index,
    updateCarouselItem,
    handleFileChange,
    uploadProgress,
    fileInputRef,
    triggerFileSelect,
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

                    {/* File Dropzone */}
                    <div
                        onClick={triggerFileSelect}
                        className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-all duration-300 hover:border-admin-accent/50"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept={
                                item.type === 'video' ? 'video/*' : 'image/*'
                            }
                            onChange={(e) => handleFileChange(index, e)}
                            className="hidden"
                        />

                        <UploadCloud
                            size={28}
                            className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                        />
                        <p className="text-xs font-bold text-admin-text">
                            Pilih file{' '}
                            {item.type === 'video' ? 'Video' : 'Gambar'}
                        </p>
                        <p className="max-w-[200px] text-center text-[10px] text-admin-text-muted">
                            Tarik & lepas file di sini atau klik untuk
                            menjelajah
                        </p>
                    </div>

                    {/* Upload Progress & Info File */}
                    {uploadProgress[item.id] !== undefined && (
                        <div className="space-y-2 rounded-xl border border-admin-border bg-admin-bg/80 p-4">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="max-w-[200px] truncate text-admin-text">
                                    {item.fileName || 'Mengupload...'}
                                </span>
                                <span className="text-admin-accent">
                                    {uploadProgress[item.id]}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-admin-border">
                                <div
                                    className="h-full rounded-full bg-admin-accent transition-all duration-300"
                                    style={{
                                        width: `${uploadProgress[item.id]}%`,
                                    }}
                                />
                            </div>
                            {uploadProgress[item.id] < 100 && (
                                <div className="flex animate-pulse items-center gap-2 pt-1 text-[10px] font-bold text-admin-accent">
                                    <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                    Memproses file{' '}
                                    {item.type === 'video' ? 'video' : 'gambar'}
                                    ...
                                </div>
                            )}
                        </div>
                    )}

                    {item.fileName && uploadProgress[item.id] === 100 && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 size={12} />
                            File Berhasil Dimuat Lokal untuk Preview
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
