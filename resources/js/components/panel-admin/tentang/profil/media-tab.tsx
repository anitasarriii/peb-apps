import { Link as LinkIcon, UploadCloud, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaTabProps {
    imageSourceType: 'url' | 'upload';
    setImageSourceType: (val: 'url' | 'upload') => void;
    imageSrc: string;
    setImageSrc: (val: string) => void;
    imageFileName: string;
    uploadingImage: boolean;
    imageInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    triggerImageSelect: () => void;
}

export default function MediaTab({
    imageSourceType,
    setImageSourceType,
    imageSrc,
    setImageSrc,
    imageFileName,
    uploadingImage,
    imageInputRef,
    handleImageChange,
    triggerImageSelect,
}: MediaTabProps) {
    return (
        <div className="animate-fadeIn space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setImageSourceType('url')}
                    className={cn(
                        'cursor-pointer rounded-xl border py-3 text-xs font-bold transition-all',
                        imageSourceType === 'url'
                            ? 'border-admin-accent bg-admin-accent/5 text-admin-accent'
                            : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:bg-admin-bg',
                    )}
                >
                    Gunakan URL Gambar
                </button>
                <button
                    type="button"
                    onClick={() => setImageSourceType('upload')}
                    className={cn(
                        'cursor-pointer rounded-xl border py-3 text-xs font-bold transition-all',
                        imageSourceType === 'upload'
                            ? 'border-admin-accent bg-admin-accent/5 text-admin-accent'
                            : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:bg-admin-bg',
                    )}
                >
                    Unggah File Baru
                </button>
            </div>

            {imageSourceType === 'url' ? (
                <div className="space-y-2">
                    <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                        <LinkIcon size={10} />
                        URL Path Gambar
                    </label>
                    <input
                        type="text"
                        value={imageSrc}
                        onChange={(e) => setImageSrc(e.target.value)}
                        className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        placeholder="Contoh: /assets/tentang-kami/about/about.png"
                        required
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-admin-text-muted/70 uppercase">
                        <UploadCloud size={10} />
                        Unggah File Gambar
                    </label>
                    <div
                        onClick={triggerImageSelect}
                        className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-all duration-300 hover:border-admin-accent/50"
                    >
                        <input
                            type="file"
                            ref={imageInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <UploadCloud
                            size={28}
                            className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                        />
                        <p className="text-xs font-bold text-admin-text">
                            Pilih File Gambar
                        </p>
                        <p className="text-[10px] text-admin-text-muted">
                            Format yang didukung: JPG, PNG, WEBP
                        </p>
                    </div>

                    {uploadingImage && (
                        <div className="flex animate-pulse items-center gap-2 text-xs font-bold text-admin-accent">
                            <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                            Memproses file gambar...
                        </div>
                    )}

                    {imageFileName && !uploadingImage && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 size={12} />
                            File {imageFileName} berhasil dimuat
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
