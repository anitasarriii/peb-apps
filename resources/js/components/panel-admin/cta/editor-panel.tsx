import { Save, Upload, Link, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorPanelProps {
    text: string;
    setText: (v: string) => void;
    buttonLabel: string;
    setButtonLabel: (v: string) => void;
    buttonHref: string;
    setButtonHref: (v: string) => void;
    backgroundSrc: string;
    setBackgroundSrc: (v: string) => void;
    bgSource: 'url' | 'upload';
    setBgSource: (v: 'url' | 'upload') => void;
    uploadingBg: boolean;
    bgFileName: string;
    isSaving: boolean;
    handleBgFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
}

export default function EditorPanel({
    text,
    setText,
    buttonLabel,
    setButtonLabel,
    buttonHref,
    setButtonHref,
    backgroundSrc,
    setBackgroundSrc,
    bgSource,
    setBgSource,
    uploadingBg,
    bgFileName,
    isSaving,
    handleBgFileChange,
    handleSave,
}: EditorPanelProps) {
    return (
        <div className="space-y-6">
            {/* Teks & Tombol */}
            <div className="space-y-4 rounded-2xl border border-admin-border bg-admin-card p-6">
                <h3 className="text-sm font-bold text-admin-text">
                    Konten Teks
                </h3>

                <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Teks Utama
                    </label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Anda membutuhkan layanan dari kami?"
                        className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-admin-text transition-colors placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-none"
                    />
                    <p className="mt-1.5 text-xs text-admin-text-muted">
                        Akan ditampilkan dalam format <em>italic</em> pada
                        halaman.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                            Label Tombol
                        </label>
                        <input
                            type="text"
                            value={buttonLabel}
                            onChange={(e) => setButtonLabel(e.target.value)}
                            placeholder="Hubungi Kami"
                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-admin-text transition-colors placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                            Link Tombol (href)
                        </label>
                        <input
                            type="text"
                            value={buttonHref}
                            onChange={(e) => setButtonHref(e.target.value)}
                            placeholder="#hubungi atau /kontak"
                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-admin-text transition-colors placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Background Image */}
            <div className="space-y-4 rounded-2xl border border-admin-border bg-admin-card p-6">
                <h3 className="text-sm font-bold text-admin-text">
                    Gambar Latar Belakang
                </h3>

                {/* Source toggle */}
                <div className="flex gap-2">
                    {(['url', 'upload'] as const).map((src) => (
                        <button
                            key={src}
                            onClick={() => setBgSource(src)}
                            className={cn(
                                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all',
                                bgSource === src
                                    ? 'bg-admin-accent text-white'
                                    : 'border border-admin-border bg-admin-bg text-admin-text-muted hover:text-admin-text',
                            )}
                        >
                            {src === 'url' ? (
                                <Link className="h-3.5 w-3.5" />
                            ) : (
                                <Upload className="h-3.5 w-3.5" />
                            )}
                            {src === 'url' ? 'Dari URL' : 'Upload File'}
                        </button>
                    ))}
                </div>

                {bgSource === 'url' ? (
                    <div className="relative">
                        <input
                            type="url"
                            value={backgroundSrc}
                            onChange={(e) => setBackgroundSrc(e.target.value)}
                            placeholder="https://example.com/cta-background.jpg"
                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 pr-10 text-sm text-admin-text transition-colors placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-none"
                        />
                        {backgroundSrc && (
                            <button
                                onClick={() => setBackgroundSrc('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-admin-text-muted hover:text-red-400"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div
                            onClick={() =>
                                document
                                    .getElementById('cta-bg-file-input')
                                    ?.click()
                            }
                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-6 transition-all duration-300 hover:border-admin-accent/50"
                        >
                            <input
                                id="cta-bg-file-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleBgFileChange}
                            />
                            <Upload
                                size={28}
                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                            />
                            <p className="text-xs font-bold text-admin-text">
                                Pilih File Gambar Latar
                            </p>
                            <p className="text-[10px] text-admin-text-muted">
                                Format yang didukung: JPG, PNG, WEBP
                            </p>
                        </div>

                        {uploadingBg && (
                            <div className="flex animate-pulse items-center gap-2 text-xs font-bold text-admin-accent">
                                <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                Memproses file gambar...
                            </div>
                        )}

                        {bgFileName && !uploadingBg && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                <CheckCircle2 size={12} />
                                File {bgFileName} berhasil dimuat
                            </div>
                        )}
                    </div>
                )}

                {/* Preview strip */}
                {backgroundSrc && (
                    <div className="relative h-24 overflow-hidden rounded-xl border border-admin-border">
                        <img
                            src={backgroundSrc}
                            alt="BG Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                    'none';
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0d2e2e]/70">
                            <span className="text-xs font-semibold text-white/80">
                                Preview dengan overlay
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-admin-accent px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-70"
                >
                    <Save
                        className={cn('h-4 w-4', isSaving && 'animate-spin')}
                    />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </div>
    );
}
