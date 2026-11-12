interface InfoFormProps {
    title: string;
    setTitle: (v: string) => void;
    subtitle: string;
    setSubtitle: (v: string) => void;
}

export default function InfoForm({
    title,
    setTitle,
    subtitle,
    setSubtitle,
}: InfoFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Judul Hero
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Kebijakan"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Subtitle / Deskripsi
                </label>
                <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    placeholder="Deskripsi singkat tentang kebijakan..."
                    required
                />
            </div>
        </div>
    );
}
