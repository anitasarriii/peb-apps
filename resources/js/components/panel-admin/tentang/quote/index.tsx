import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Sparkles,
    RotateCcw,
    Save,
    Eye,
    Layout,
    Quote,
    Link,
} from 'lucide-react';
import { update as updateQuote } from '@/routes/panel-admin/tentang/quote-section';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';

interface QuoteSectionData {
    id?: number;
    quote_text: string;
    description: string;
    button_label: string;
    button_href: string;
    updated_at?: string;
}

interface QuoteTentangEditorProps {
    quoteSection?: QuoteSectionData | null;
}

const DEFAULT_QUOTE_TEXT = 'Energi Bagi Negeri.';
const DEFAULT_DESCRIPTION =
    'Komitmen kami adalah menjadi denyut nadi yang tak pernah berhenti untuk kemajuan Batam dan Indonesia.';
const DEFAULT_BUTTON_LABEL = 'Lihat Portofolio Kami';
const DEFAULT_BUTTON_HREF = '#portofolio';

export default function QuoteTentangEditor({
    quoteSection,
}: QuoteTentangEditorProps) {
    const [quoteText, setQuoteText] = useState(
        quoteSection?.quote_text ?? DEFAULT_QUOTE_TEXT,
    );
    const [description, setDescription] = useState(
        quoteSection?.description ?? DEFAULT_DESCRIPTION,
    );
    const [buttonLabel, setButtonLabel] = useState(
        quoteSection?.button_label ?? DEFAULT_BUTTON_LABEL,
    );
    const [buttonHref, setButtonHref] = useState(
        quoteSection?.button_href ?? DEFAULT_BUTTON_HREF,
    );

    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');

    const handleReset = () => {
        setQuoteText(DEFAULT_QUOTE_TEXT);
        setDescription(DEFAULT_DESCRIPTION);
        setButtonLabel(DEFAULT_BUTTON_LABEL);
        setButtonHref(DEFAULT_BUTTON_HREF);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            updateQuote.url(),
            {
                quote_text: quoteText,
                description,
                button_label: buttonLabel,
                button_href: buttonHref,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setToastType('success');
                    setToastMessage(
                        'Kutipan dan komitmen Tentang Kami berhasil diperbarui.',
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                },
                onError: (errors) => {
                    console.error(
                        '[QuoteTentangEditor] Validation errors:',
                        errors,
                    );
                    const firstError = Object.values(errors)[0] as string;
                    setToastType('error');
                    setToastMessage(
                        firstError ||
                            'Gagal menyimpan perubahan. Periksa kembali isian form.',
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 5000);
                },
                onFinish: () => {
                    setIsSaving(false);
                },
            },
        );
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol (Kiri) */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Quote size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Quote & Komitmen Halaman Tentang Kami
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Sesuaikan teks kutipan inspiratif,
                                        deskripsi komitmen, serta tombol
                                        navigasi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Kutipan Utama (Quote)
                                    </label>
                                    <input
                                        type="text"
                                        value={quoteText}
                                        onChange={(e) =>
                                            setQuoteText(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                        placeholder="Teks quote utama..."
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Pernyataan Komitmen / Deskripsi
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                        placeholder="Deskripsi penjelasan..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Label Tombol
                                        </label>
                                        <input
                                            type="text"
                                            value={buttonLabel}
                                            onChange={(e) =>
                                                setButtonLabel(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="E.g., Lihat Portofolio Kami"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Tautan Tombol (Href / Anchor)
                                        </label>
                                        <input
                                            type="text"
                                            value={buttonHref}
                                            onChange={(e) =>
                                                setButtonHref(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="E.g., #portofolio"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-4 border-t border-admin-border pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                                >
                                    <RotateCcw size={16} />
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-lg shadow-admin-primary/20 transition-all duration-300 active:scale-[0.98]',
                                        isSaving
                                            ? 'cursor-not-allowed bg-admin-primary/60'
                                            : 'bg-admin-primary hover:bg-admin-accent',
                                    )}
                                >
                                    {isSaving ? (
                                        <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {isSaving
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </AnimeReveal>
            </div>

            {/* Live Preview (Kanan) */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <div className="group relative flex h-[480px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Quote & Komitmen
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        {/* Mockup Frame Quote */}
                        <div
                            className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-admin-border p-8 text-center"
                            style={{
                                background:
                                    'linear-gradient(90deg, #082F3A 0%, #082F3AE5 70%, #00A4B9CC 100%)',
                            }}
                        >
                            {/* Quote Icon */}
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
                                <Quote
                                    className="h-4 w-4 text-[#FFF098]"
                                    fill="currentColor"
                                />
                            </div>

                            {/* Main Quote */}
                            <h2 className="mb-3 text-2xl leading-tight font-black tracking-wide text-white">
                                "{quoteText}"
                            </h2>

                            {/* Subtitle */}
                            <p className="mb-6 max-w-xs text-[10px] leading-relaxed text-white/80">
                                {description}
                            </p>

                            {/* Button */}
                            <button className="rounded-full bg-[#FFF098] px-5 py-2 text-[10px] font-black text-[#082F3A] shadow-md transition-all hover:bg-white">
                                {buttonLabel}
                            </button>
                        </div>

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>QUOTE MOCKUP PREVIEW</span>
                            <span>REAL-TIME EDIT</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            {/* Notification Toast */}
            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
            />
        </div>
    );
}
