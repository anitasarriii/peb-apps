import { Type, AlignLeft } from 'lucide-react';

interface InfoTabProps {
    title: string;
    setTitle: (val: string) => void;
    subtitle: string;
    setSubtitle: (val: string) => void;
    sloganText: string;
    setSloganText: (val: string) => void;
}

export default function InfoTab({
    title,
    setTitle,
    subtitle,
    setSubtitle,
    sloganText,
    setSloganText,
}: InfoTabProps) {
    return (
        <div className="animate-fadeIn space-y-5">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    <Type size={14} className="text-admin-accent" />
                    Judul Section (Title)
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Nama perusahaan..."
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    <Type size={14} className="text-admin-accent" />
                    Sub-Judul (Subtitle)
                </label>
                <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Slogan atau sub-tagline..."
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    <AlignLeft size={14} className="text-admin-accent" />
                    Teks Penjelasan Slogan
                </label>
                <textarea
                    value={sloganText}
                    onChange={(e) => setSloganText(e.target.value)}
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm leading-relaxed font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Masukkan narasi slogan..."
                    required
                />
            </div>
        </div>
    );
}
