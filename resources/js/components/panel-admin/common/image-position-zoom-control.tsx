import { useCallback, useRef, useState } from 'react';
import {
    Move,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Focus,
    ArrowUpLeft,
    ArrowUp,
    ArrowUpRight,
    ArrowLeft,
    Circle,
    ArrowRight,
    ArrowDownLeft,
    ArrowDown,
    ArrowDownRight,
    Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImagePositionZoomControlProps {
    imageUrl?: string;
    positionX?: number; // 0 - 100 (persen)
    positionY?: number; // 0 - 100 (persen)
    scale?: number; // 1.0 - 2.5
    onChange: (values: {
        positionX: number;
        positionY: number;
        scale: number;
    }) => void;
    className?: string;
}

const PRESET_POSITIONS = [
    { label: 'Kiri Atas', x: 0, y: 0, icon: ArrowUpLeft },
    { label: 'Tengah Atas', x: 50, y: 0, icon: ArrowUp },
    { label: 'Kanan Atas', x: 100, y: 0, icon: ArrowUpRight },
    { label: 'Kiri Tengah', x: 0, y: 50, icon: ArrowLeft },
    { label: 'Tengah (Pusat)', x: 50, y: 50, icon: Circle },
    { label: 'Kanan Tengah', x: 100, y: 50, icon: ArrowRight },
    { label: 'Kiri Bawah', x: 0, y: 100, icon: ArrowDownLeft },
    { label: 'Tengah Bawah', x: 50, y: 100, icon: ArrowDown },
    { label: 'Kanan Bawah', x: 100, y: 100, icon: ArrowDownRight },
];

export default function ImagePositionZoomControl({
    imageUrl,
    positionX = 50,
    positionY = 50,
    scale = 1,
    onChange,
    className,
}: ImagePositionZoomControlProps) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Hitung posisi dari koordinat mouse
    const updatePositionFromMouseEvent = useCallback(
        (clientX: number, clientY: number) => {
            if (!boxRef.current) return;
            const rect = boxRef.current.getBoundingClientRect();
            const relX = Math.max(
                0,
                Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)),
            );
            const relY = Math.max(
                0,
                Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)),
            );
            onChange({
                positionX: relX,
                positionY: relY,
                scale,
            });
        },
        [onChange, scale],
    );

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        updatePositionFromMouseEvent(e.clientX, e.clientY);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            updatePositionFromMouseEvent(moveEvent.clientX, moveEvent.clientY);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleReset = () => {
        onChange({
            positionX: 50,
            positionY: 50,
            scale: 1,
        });
    };

    const isCustomPosition = positionX !== 50 || positionY !== 50 || scale !== 1;

    return (
        <div
            className={cn(
                'space-y-4 rounded-2xl border border-admin-border/70 bg-admin-bg/60 p-4 transition-all',
                className,
            )}
        >
            {/* Header Kontrol */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-admin-border/40 pb-3">
                <div className="flex items-center gap-2">
                    <Focus size={15} className="text-admin-accent" />
                    <div>
                        <h4 className="text-xs font-bold text-admin-text">
                            Pengaturan Posisi & Zoom Foto (Framing)
                        </h4>
                        <p className="text-[10px] text-admin-text-muted">
                            Geser atau perbesar agar subjek utama foto tidak terpotong di layar.
                        </p>
                    </div>
                </div>

                {isCustomPosition && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex cursor-pointer items-center gap-1 rounded-lg border border-admin-border bg-admin-card px-2.5 py-1 text-[11px] font-semibold text-admin-text-muted transition-colors hover:border-admin-accent/40 hover:text-admin-text"
                        title="Kembalikan ke posisi tengah dan ukuran asli"
                    >
                        <RotateCcw size={11} /> Reset Posisi
                    </button>
                )}
            </div>

            {/* Area Visual: Interaktif Box & Preset Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                {/* Frame Interaktif (Titik Fokus) */}
                <div className="sm:col-span-8">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] text-admin-text-muted">
                        <span className="flex items-center gap-1 font-semibold">
                            <Move size={12} /> Klik atau geser titik fokus pada foto:
                        </span>
                        <span className="font-mono text-[10px] font-bold text-admin-accent">
                            X: {positionX}% · Y: {positionY}%
                        </span>
                    </div>

                    <div
                        ref={boxRef}
                        onMouseDown={handleMouseDown}
                        className={cn(
                            'group relative h-44 w-full cursor-crosshair overflow-hidden rounded-xl border border-admin-border bg-[#0d2e2e] shadow-inner select-none transition-all',
                            isDragging && 'ring-2 ring-admin-accent',
                        )}
                        title="Klik atau seret untuk mengarahkan fokus foto"
                    >
                        {/* Gambar dengan Posisi dan Zoom Realtime */}
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Visual Framing"
                                className="pointer-events-none h-full w-full object-cover select-none"
                                style={{
                                    objectPosition: `${positionX}% ${positionY}%`,
                                    transform: scale !== 1 ? `scale(${scale})` : undefined,
                                    transformOrigin: `${positionX}% ${positionY}%`,
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop';
                                }}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                                Gambar belum dipilih
                            </div>
                        )}

                        {/* Grid Garis Bantu (Rule of Thirds) */}
                        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 transition-opacity group-hover:opacity-60">
                            <div className="border-r border-b border-white/20" />
                            <div className="border-r border-b border-white/20" />
                            <div className="border-b border-white/20" />
                            <div className="border-r border-b border-white/20" />
                            <div className="border-r border-b border-white/20" />
                            <div className="border-b border-white/20" />
                            <div className="border-r border-white/20" />
                            <div className="border-r border-white/20" />
                            <div />
                        </div>

                        {/* Indikator Titik Fokus (Crosshair Dot) */}
                        <div
                            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                            style={{
                                left: `${positionX}%`,
                                top: `${positionY}%`,
                            }}
                        >
                            <div className="relative flex items-center justify-center">
                                <span className="absolute size-7 animate-ping rounded-full bg-admin-accent/40" />
                                <span className="relative size-4 rounded-full border-2 border-white bg-admin-accent shadow-md" />
                            </div>
                        </div>

                        {/* Hint Badge */}
                        <div className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-xs">
                            Format Layar Hero
                        </div>
                    </div>
                </div>

                {/* Preset 9 Arah Cepat */}
                <div className="flex flex-col justify-between sm:col-span-4">
                    <div>
                        <span className="mb-1.5 block text-[11px] font-semibold text-admin-text-muted">
                            Arah Fokus Cepat:
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                            {PRESET_POSITIONS.map((preset) => {
                                const Icon = preset.icon;
                                const isCurrent =
                                    positionX === preset.x && positionY === preset.y;
                                return (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() =>
                                            onChange({
                                                positionX: preset.x,
                                                positionY: preset.y,
                                                scale,
                                            })
                                        }
                                        className={cn(
                                            'flex h-9 cursor-pointer items-center justify-center rounded-lg border text-xs transition-all',
                                            isCurrent
                                                ? 'border-admin-accent bg-admin-accent text-white shadow-xs'
                                                : 'border-admin-border/80 bg-admin-card text-admin-text-muted hover:border-admin-border hover:bg-admin-bg hover:text-admin-text',
                                        )}
                                        title={preset.label}
                                    >
                                        <Icon size={14} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-3 flex items-start gap-1 rounded-lg border border-admin-border/50 bg-admin-card/50 p-2 text-[10px] text-admin-text-muted">
                        <Info size={13} className="mt-0.5 shrink-0 text-admin-accent" />
                        <span>
                            Gunakan tombol arah cepat (misal Atas jika bagian kepala/atap gedung terpotong).
                        </span>
                    </div>
                </div>
            </div>

            {/* Slider Kontrol Presisi (Zoom & Posisi Horisontal/Vertikal) */}
            <div className="grid grid-cols-1 gap-3 border-t border-admin-border/40 pt-3 sm:grid-cols-3">
                {/* Slider Zoom */}
                <div className="space-y-1.5 rounded-xl border border-admin-border/40 bg-admin-card/40 p-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-admin-text">
                            <ZoomIn size={12} className="text-admin-accent" /> Perbesaran (Zoom)
                        </span>
                        <span className="font-mono text-xs font-bold text-admin-accent">
                            {Math.round(scale * 100)}%
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                onChange({
                                    positionX,
                                    positionY,
                                    scale: Math.max(1, Math.round((scale - 0.1) * 20) / 20),
                                })
                            }
                            disabled={scale <= 1}
                            className="rounded p-1 text-admin-text-muted transition-colors hover:bg-admin-bg disabled:opacity-40"
                            title="Perkecil"
                        >
                            <ZoomOut size={13} />
                        </button>
                        <input
                            type="range"
                            min="1"
                            max="2.5"
                            step="0.05"
                            value={scale}
                            onChange={(e) =>
                                onChange({
                                    positionX,
                                    positionY,
                                    scale: parseFloat(e.target.value),
                                })
                            }
                            className="h-1.5 w-full cursor-pointer accent-admin-accent"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                onChange({
                                    positionX,
                                    positionY,
                                    scale: Math.min(2.5, Math.round((scale + 0.1) * 20) / 20),
                                })
                            }
                            disabled={scale >= 2.5}
                            className="rounded p-1 text-admin-text-muted transition-colors hover:bg-admin-bg disabled:opacity-40"
                            title="Perbesar"
                        >
                            <ZoomIn size={13} />
                        </button>
                    </div>
                </div>

                {/* Slider Geser Horisontal (X) */}
                <div className="space-y-1.5 rounded-xl border border-admin-border/40 bg-admin-card/40 p-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-admin-text">
                            <Move size={12} className="text-admin-accent" /> Geser Kiri / Kanan
                        </span>
                        <span className="font-mono text-xs font-bold text-admin-accent">
                            {positionX}%
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-admin-text-muted">
                        <span>Kiri</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={positionX}
                            onChange={(e) =>
                                onChange({
                                    positionX: parseInt(e.target.value, 10),
                                    positionY,
                                    scale,
                                })
                            }
                            className="h-1.5 w-full cursor-pointer accent-admin-accent"
                        />
                        <span>Kanan</span>
                    </div>
                </div>

                {/* Slider Geser Vertikal (Y) */}
                <div className="space-y-1.5 rounded-xl border border-admin-border/40 bg-admin-card/40 p-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-admin-text">
                            <Move size={12} className="text-admin-accent rotate-90" /> Geser Atas / Bawah
                        </span>
                        <span className="font-mono text-xs font-bold text-admin-accent">
                            {positionY}%
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-admin-text-muted">
                        <span>Atas</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={positionY}
                            onChange={(e) =>
                                onChange({
                                    positionX,
                                    positionY: parseInt(e.target.value, 10),
                                    scale,
                                })
                            }
                            className="h-1.5 w-full cursor-pointer accent-admin-accent"
                        />
                        <span>Bawah</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

