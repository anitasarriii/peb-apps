import { Eye } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import type { PartnerItem } from './partner-row-editor';

// ============================================================
// Props
// ============================================================
interface PreviewPanelProps {
    title: string;
    partners: PartnerItem[];
}

// ============================================================
// Component
// ============================================================
export default function PreviewPanel({ title, partners }: PreviewPanelProps) {
    return (
        <AnimeReveal delay={250} distance={20} direction="up">
            <div className="group relative flex h-[650px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                {/* Header Preview */}
                <div className="mb-4 flex shrink-0 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-admin-accent" />
                        <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                            Preview Partner
                        </span>
                    </div>
                    <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                        Aktif
                    </span>
                </div>

                {/* Monitor Mockup Layout */}
                <div className="custom-scrollbar relative flex-1 overflow-y-auto rounded-[2rem] border border-admin-border bg-[#edf5f6] p-5 select-none dark:bg-[#071717]">
                    <div className="space-y-5 text-center">
                        <div>
                            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#94a3b8] uppercase dark:text-white/50">
                                {title || 'Partner Kami'}
                            </h2>
                        </div>

                        <div className="custom-scrollbar flex gap-3 overflow-x-auto py-4">
                            {partners.map((partner) => (
                                <div
                                    key={partner.id}
                                    className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/60"
                                >
                                    {partner.logoSrc &&
                                    partner.logoSource !== 'none' ? (
                                        <img
                                            src={partner.logoSrc}
                                            alt={partner.name}
                                            className="h-9 w-auto max-w-full object-contain"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).style.display = 'none';
                                                const span =
                                                    document.createElement(
                                                        'span',
                                                    );
                                                span.className =
                                                    'text-[9px] font-bold text-[#7b8c9d] truncate max-w-full';
                                                span.textContent = partner.name;
                                                (
                                                    e.target as HTMLImageElement
                                                ).parentElement?.appendChild(
                                                    span,
                                                );
                                            }}
                                        />
                                    ) : (
                                        <span className="max-w-full truncate text-[9px] font-bold text-[#7b8c9d]">
                                            {partner.name || 'Partner'}
                                        </span>
                                    )}
                                </div>
                            ))}

                            {partners.length === 0 && (
                                <p className="w-full py-8 text-center text-[10px] text-gray-400 dark:text-gray-500">
                                    Belum ada partner untuk ditampilkan.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Mockup */}
                <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-admin-text-muted">
                    <span>MOCKUP PREVIEW LAYOUT</span>
                    <span>SINKRONISASI REAL-TIME</span>
                </div>
            </div>
        </AnimeReveal>
    );
}
