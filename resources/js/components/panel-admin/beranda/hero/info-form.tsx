import { Type, AlignLeft, Sparkles, Link as LinkIcon } from 'lucide-react';

interface InfoFormProps {
    title: string;
    setTitle: (val: string) => void;
    subtitle: string;
    setSubtitle: (val: string) => void;
    ctaLabel: string;
    setCtaLabel: (val: string) => void;
    ctaHref: string;
    setCtaHref: (val: string) => void;
    secondaryCtaLabel: string;
    setSecondaryCtaLabel: (val: string) => void;
    secondaryCtaHref: string;
    setSecondaryCtaHref: (val: string) => void;
}

export default function InfoForm({
    title,
    setTitle,
    subtitle,
    setSubtitle,
    ctaLabel,
    setCtaLabel,
    ctaHref,
    setCtaHref,
    secondaryCtaLabel,
    setSecondaryCtaLabel,
    secondaryCtaHref,
    setSecondaryCtaHref,
}: InfoFormProps) {
    return (
        <div className="space-y-6">
            {/* Input Judul */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    <Type size={14} className="text-admin-accent" />
                    Judul Utama (Title)
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Masukkan judul utama..."
                    required
                />
            </div>

            {/* Input Subtitle */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    <AlignLeft size={14} className="text-admin-accent" />
                    Sub-Judul (Subtitle)
                </label>
                <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm leading-relaxed font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Masukkan deskripsi penjelasan..."
                    required
                />
            </div>

            {/* CTA UTAMA */}
            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-admin-border/50 bg-admin-bg/20 p-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-admin-text-muted uppercase">
                        <Sparkles size={12} className="text-admin-accent" />
                        Tombol Utama (CTA Utama)
                    </h4>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-admin-text-muted/70 uppercase">
                        Teks Tombol
                    </label>
                    <input
                        type="text"
                        value={ctaLabel}
                        onChange={(e) => setCtaLabel(e.target.value)}
                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-3.5 text-xs font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        placeholder="Teks tombol..."
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-admin-text-muted/70 uppercase">
                        Tautan Tombol (Link/Anchor)
                    </label>
                    <input
                        type="text"
                        value={ctaHref}
                        onChange={(e) => setCtaHref(e.target.value)}
                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-3.5 text-xs font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        placeholder="Target URL..."
                        required
                    />
                </div>
            </div>

            {/* CTA SEKUNDER */}
            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-admin-border/50 bg-admin-bg/20 p-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-admin-text-muted uppercase">
                        <LinkIcon size={12} className="text-admin-accent" />
                        Tombol Sekunder (Tombol Kontak)
                    </h4>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-admin-text-muted/70 uppercase">
                        Teks Tombol
                    </label>
                    <input
                        type="text"
                        value={secondaryCtaLabel}
                        onChange={(e) => setSecondaryCtaLabel(e.target.value)}
                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-3.5 text-xs font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        placeholder="Teks tombol..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-admin-text-muted/70 uppercase">
                        Tautan Tombol (Link/Anchor)
                    </label>
                    <input
                        type="text"
                        value={secondaryCtaHref}
                        onChange={(e) => setSecondaryCtaHref(e.target.value)}
                        className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-3.5 text-xs font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        placeholder="Target URL..."
                    />
                </div>
            </div>
        </div>
    );
}
