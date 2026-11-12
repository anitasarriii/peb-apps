import React from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Syarat } from '../types';

interface SyaratListEditorProps {
    activeSyaratList: Syarat[];
    handleAddSyarat: () => void;
    handleDeleteSyarat: (id: string) => void;
    handleChangeSyarat: (id: string, text: string) => void;
    draggedSyaratIdx: number | null;
    setDraggedSyaratIdx: (idx: number | null) => void;
    handleDragStartSyarat: (idx: number) => void;
    handleDragOverSyarat: (e: React.DragEvent, idx: number) => void;
}

export default function SyaratListEditor({
    activeSyaratList,
    handleAddSyarat,
    handleDeleteSyarat,
    handleChangeSyarat,
    draggedSyaratIdx,
    setDraggedSyaratIdx,
    handleDragStartSyarat,
    handleDragOverSyarat,
}: SyaratListEditorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Syarat Kualifikasi ({activeSyaratList.length})
                </label>
                <button
                    type="button"
                    onClick={handleAddSyarat}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-admin-accent/10 px-2 py-1 text-[10px] font-bold text-admin-accent hover:bg-admin-accent hover:text-white"
                >
                    <Plus size={10} /> Tambah Syarat
                </button>
            </div>
            <div className="space-y-2">
                {activeSyaratList.map((syarat, sIdx) => (
                    <div
                        key={syarat.id}
                        draggable
                        onDragStart={() => handleDragStartSyarat(sIdx)}
                        onDragOver={(e) => handleDragOverSyarat(e, sIdx)}
                        onDragEnd={() => setDraggedSyaratIdx(null)}
                        className={cn(
                            'group/item flex items-start gap-2.5 rounded-xl border border-admin-border/50 bg-admin-bg/30 p-2.5',
                            draggedSyaratIdx === sIdx && 'scale-95 opacity-40',
                        )}
                    >
                        <GripVertical
                            size={12}
                            className="mt-2.5 shrink-0 cursor-grab text-admin-text-muted/30 group-hover/item:text-admin-text-muted"
                        />
                        <textarea
                            value={syarat.text}
                            onChange={(e) =>
                                handleChangeSyarat(syarat.id, e.target.value)
                            }
                            rows={2}
                            className="flex-1 resize-none bg-transparent text-xs font-medium text-admin-text outline-hidden focus:border-b focus:border-admin-accent/40"
                        />
                        {activeSyaratList.length > 0 && (
                            <button
                                type="button"
                                onClick={() => handleDeleteSyarat(syarat.id)}
                                className="mt-0.5 shrink-0 rounded-lg p-1 text-admin-text-muted hover:bg-red-500/10 hover:text-red-400"
                            >
                                <Trash2 size={11} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
