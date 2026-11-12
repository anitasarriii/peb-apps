import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryItem } from './types';

interface PhotoListProps {
    items: GalleryItem[];
    activeId: string;
    draggedIndex: number | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDragEnd: () => void;
}

export default function PhotoList({
    items,
    activeId,
    draggedIndex,
    onSelect,
    onAdd,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
}: PhotoListProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Daftar Foto ({items.length})
                </label>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all duration-200 hover:bg-admin-accent hover:text-white"
                >
                    <Plus size={13} /> Tambah Foto
                </button>
            </div>

            <div className="custom-scrollbar max-h-52 space-y-1.5 overflow-y-auto rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => onDragStart(idx)}
                        onDragOver={(e) => onDragOver(e, idx)}
                        onDragEnd={onDragEnd}
                        onClick={() => onSelect(item.id)}
                        className={cn(
                            'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none',
                            activeId === item.id
                                ? 'border border-admin-accent/30 bg-admin-card shadow-sm'
                                : 'border border-transparent hover:bg-admin-card/60',
                            draggedIndex === idx && 'scale-95 opacity-40',
                        )}
                    >
                        <GripVertical
                            size={14}
                            className="shrink-0 cursor-grab text-admin-text-muted/40 group-hover/item:text-admin-text-muted"
                        />

                        <div
                            className={cn(
                                'size-1.5 shrink-0 rounded-full',
                                activeId === item.id
                                    ? 'bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]'
                                    : 'bg-admin-text-muted/30',
                            )}
                        />

                        {/* Thumbnail mini */}
                        <div className="size-8 shrink-0 overflow-hidden rounded-lg border border-admin-border/50">
                            <img
                                src={item.imagePreviewUrl || item.imageSrc}
                                alt={item.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://placehold.co/32x32/0d2e2e/ffffff?text=?';
                                }}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p
                                className={cn(
                                    'truncate text-xs font-bold',
                                    activeId === item.id
                                        ? 'text-admin-accent'
                                        : 'text-admin-text-muted',
                                )}
                            >
                                {item.title}
                            </p>
                            <p className="truncate text-[10px] text-admin-text-muted/60">
                                {item.category}
                            </p>
                        </div>

                        <span className="shrink-0 text-[10px] font-bold text-admin-text-muted/40">
                            #{idx + 1}
                        </span>

                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item.id);
                                }}
                                className="shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted opacity-0 transition-all group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
