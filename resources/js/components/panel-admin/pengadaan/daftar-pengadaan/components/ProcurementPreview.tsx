import React from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import {
    PengadaanItem,
    Dokumen,
    Syarat,
    StatusType,
    STATUS_STYLE,
} from '../types';

interface ProcurementPreviewProps {
    previewTab: 'list' | 'detail';
    setPreviewTab: (tab: 'list' | 'detail') => void;
    items: PengadaanItem[];
    activeId: string;
    activeItem: PengadaanItem;
    activeDeskripsi: string;
    activeSyaratList: Syarat[];
    activeDokumenList: Dokumen[];
    resolvedMapsUrl: string;
    activeMapsLabel: string;
    displayUrl: string;
}

export default function ProcurementPreview({
    previewTab,
    setPreviewTab,
    items,
    activeId,
    activeItem,
    activeDeskripsi,
    activeSyaratList,
    activeDokumenList,
    resolvedMapsUrl,
    activeMapsLabel,
    displayUrl,
}: ProcurementPreviewProps) {
    return (
        <div className="space-y-6 xl:col-span-5">
            <AnimeReveal delay={250} distance={20} direction="up">
                <div className="relative flex h-[580px] flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-card p-6 shadow-xl">
                    {/* Tab toggle preview */}
                    <div className="mb-4 flex shrink-0 items-center justify-between border-b border-admin-border/50 pb-3">
                        <div className="flex rounded-xl border border-admin-border bg-admin-bg p-1">
                            <button
                                type="button"
                                onClick={() => setPreviewTab('list')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-[10px] font-bold transition-all',
                                    previewTab === 'list'
                                        ? 'bg-admin-accent text-white shadow-sm'
                                        : 'text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                View Daftar
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewTab('detail')}
                                className={cn(
                                    'rounded-lg px-3 py-1 text-[10px] font-bold transition-all',
                                    previewTab === 'detail'
                                        ? 'bg-admin-accent text-white shadow-sm'
                                        : 'text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                View Detail
                            </button>
                        </div>
                        <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                            Live Sync
                        </span>
                    </div>

                    {previewTab === 'list' ? (
                        <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
                            <div className="mb-3 flex flex-wrap gap-1.5">
                                <span className="rounded-full bg-admin-accent px-2.5 py-1 text-[10px] font-bold text-white">
                                    Semua
                                </span>
                                {activeItem.category && (
                                    <span className="rounded-full border border-admin-border bg-admin-bg px-2.5 py-1 text-[10px] font-bold text-admin-text-muted">
                                        {activeItem.category}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {items.map((item) => {
                                    const isActive = item.id === activeId;
                                    const thumb =
                                        item.imagePreviewUrl || item.imageSrc;
                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                'overflow-hidden rounded-xl border transition-all duration-300',
                                                isActive
                                                    ? 'border-admin-accent/60 shadow-lg ring-1 shadow-admin-accent/10 ring-admin-accent/20'
                                                    : 'border-admin-border opacity-60',
                                            )}
                                        >
                                            {isActive && (
                                                <div className="flex items-center gap-1 border-b border-admin-accent/20 bg-admin-accent/10 px-2 py-1">
                                                    <div className="size-1 rounded-full bg-admin-accent" />
                                                    <span className="text-[9px] font-bold tracking-widest text-admin-accent uppercase">
                                                        Diedit
                                                    </span>
                                                </div>
                                            )}
                                            <div className="relative h-20 overflow-hidden">
                                                <img
                                                    src={thumb}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            `https://placehold.co/300x200/0d2e2e/ffffff?text=${encodeURIComponent(item.category)}`;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <span
                                                    className={cn(
                                                        'absolute bottom-1.5 left-1.5 rounded border px-1.5 py-0.5 text-[8px] font-bold',
                                                        STATUS_STYLE[
                                                            item.status
                                                        ],
                                                    )}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="space-y-0.5 bg-admin-bg/30 p-2">
                                                <p className="line-clamp-1 text-[10px] font-bold text-admin-text">
                                                    {item.title}
                                                </p>
                                                <p className="text-[9px] text-admin-text-muted/60">
                                                    {item.category} ·{' '}
                                                    {item.startDate}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto pr-1">
                            {/* Banner preview */}
                            <div className="relative h-28 overflow-hidden rounded-xl bg-admin-bg/50">
                                <img
                                    src={
                                        activeItem.bannerPreviewUrl ||
                                        activeItem.bannerImage ||
                                        displayUrl
                                    }
                                    alt={activeItem.title}
                                    className="h-full w-full object-cover opacity-80"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            `https://placehold.co/600x400/0d2e2e/ffffff?text=${encodeURIComponent(activeItem.category)}`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                                <div className="absolute bottom-3 left-4">
                                    <span className="rounded bg-admin-accent px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
                                        {activeItem.category}
                                    </span>
                                    <h4 className="mt-1 line-clamp-1 text-xs font-black text-white">
                                        {activeItem.title}
                                    </h4>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold tracking-wider text-admin-accent uppercase">
                                    DESKRIPSI TENDER
                                </span>
                                <p className="text-[10px] leading-relaxed whitespace-pre-line text-admin-text-muted">
                                    {activeDeskripsi || 'Belum ada deskripsi.'}
                                </p>
                            </div>

                            {/* Syarat */}
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold tracking-wider text-admin-accent uppercase">
                                    SYARAT KUALIFIKASI
                                </span>
                                <ul className="space-y-1">
                                    {activeSyaratList.map((s) => (
                                        <li
                                            key={s.id}
                                            className="flex items-start gap-1.5 text-[10px] text-admin-text-muted"
                                        >
                                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-admin-accent" />
                                            <span>{s.text}</span>
                                        </li>
                                    ))}
                                    {activeSyaratList.length === 0 && (
                                        <span className="text-[10px] text-admin-text-muted/50 italic">
                                            Belum ada syarat.
                                        </span>
                                    )}
                                </ul>
                            </div>

                            {/* Dokumen */}
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold tracking-wider text-admin-accent uppercase">
                                    DOKUMEN UNDUHAN RKS
                                </span>
                                <div className="space-y-1.5">
                                    {activeDokumenList.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between rounded-lg border border-admin-border bg-admin-bg/30 p-2"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[10px] font-bold text-admin-text">
                                                    {doc.name}
                                                </p>
                                                <p className="text-[8px] text-admin-text-muted/60">
                                                    {doc.fileSize} · Dokumen
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                className="rounded-lg bg-admin-accent/10 px-2 py-1 text-[8px] font-bold text-admin-accent hover:bg-admin-accent hover:text-white"
                                            >
                                                Unduh RKS
                                            </button>
                                        </div>
                                    ))}
                                    {activeDokumenList.length === 0 && (
                                        <span className="text-[10px] text-admin-text-muted/50 italic">
                                            Belum ada dokumen.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Peta Lokasi */}
                            {resolvedMapsUrl && (
                                <div className="space-y-1.5">
                                    <span className="text-[9px] font-bold tracking-wider text-admin-accent uppercase">
                                        LOKASI PETA ({activeMapsLabel})
                                    </span>
                                    <div className="h-28 overflow-hidden rounded-xl border border-admin-border bg-admin-bg">
                                        <iframe
                                            src={resolvedMapsUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            title="Maps Preview"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </AnimeReveal>
        </div>
    );
}
