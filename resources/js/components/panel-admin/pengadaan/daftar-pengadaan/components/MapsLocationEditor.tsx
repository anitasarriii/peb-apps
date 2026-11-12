import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PengadaanItem } from '../types';

interface MapsLocationEditorProps {
    activeItem: PengadaanItem;
    activeMapsLabel: string;
    activeMapsMode: 'koordinat' | 'embed';
    activeMapsKoordinat: string;
    activeMapsEmbedUrl: string;
    resolvedMapsUrl: string;
    handleChange: (updated: PengadaanItem) => void;
}

export default function MapsLocationEditor({
    activeItem,
    activeMapsLabel,
    activeMapsMode,
    activeMapsKoordinat,
    activeMapsEmbedUrl,
    resolvedMapsUrl,
    handleChange,
}: MapsLocationEditorProps) {
    return (
        <div className="space-y-4 rounded-2xl border border-admin-border/50 bg-admin-bg/40 p-4">
            <div className="flex items-center gap-2">
                <MapPin size={14} className="text-admin-accent" />
                <label className="text-xs font-bold text-admin-text uppercase">
                    Koordinat Peta (Google Maps)
                </label>
            </div>
            <div className="space-y-1">
                <label className="text-[9px] font-bold text-admin-text-muted uppercase">
                    Label Peta
                </label>
                <input
                    type="text"
                    value={activeMapsLabel}
                    onChange={(e) =>
                        handleChange({
                            ...activeItem,
                            mapsLabel: e.target.value,
                        })
                    }
                    className="w-full rounded-lg border border-admin-border bg-admin-bg px-2.5 py-1.5 text-xs text-admin-text focus:border-admin-accent"
                    placeholder="PLTG Panaran, Batam"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[9px] font-bold text-admin-text-muted uppercase">
                    Sumber Peta
                </label>
                <div className="flex w-fit rounded-lg border border-admin-border bg-admin-bg p-0.5">
                    {(['koordinat', 'embed'] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() =>
                                handleChange({ ...activeItem, mapsMode: mode })
                            }
                            className={cn(
                                'flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[9px] font-bold transition-all',
                                activeMapsMode === mode
                                    ? 'bg-admin-accent text-white shadow-sm'
                                    : 'text-admin-text-muted hover:text-admin-text',
                            )}
                        >
                            {mode === 'koordinat'
                                ? '📍 Koordinat'
                                : '🔗 Embed URL'}
                        </button>
                    ))}
                </div>
            </div>
            {activeMapsMode === 'koordinat' ? (
                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-admin-text-muted uppercase">
                        Koordinat Lat, Lng
                    </label>
                    <input
                        type="text"
                        value={activeMapsKoordinat}
                        onChange={(e) =>
                            handleChange({
                                ...activeItem,
                                mapsKoordinat: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border border-admin-border bg-admin-bg px-2.5 py-1.5 font-mono text-xs text-admin-text focus:border-admin-accent"
                        placeholder="1.1301, 104.0529"
                    />
                </div>
            ) : (
                <div className="space-y-1">
                    <label className="text-[9px] font-bold text-admin-text-muted uppercase">
                        Google Maps Embed URL
                    </label>
                    <input
                        type="text"
                        value={activeMapsEmbedUrl}
                        onChange={(e) =>
                            handleChange({
                                ...activeItem,
                                mapsEmbedUrl: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border border-admin-border bg-admin-bg px-2.5 py-1.5 font-mono text-[10px] text-admin-text focus:border-admin-accent"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                </div>
            )}
            {resolvedMapsUrl && (
                <div className="h-32 overflow-hidden rounded-xl border border-admin-border bg-admin-bg">
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
            )}
        </div>
    );
}
