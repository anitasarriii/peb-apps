import React from 'react';
import {
    Plus,
    GripVertical,
    Trash2,
    Link as LinkIcon,
    UploadCloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dokumen } from '../types';

interface DokumenListEditorProps {
    activeDokumenList: Dokumen[];
    handleAddDokumen: () => void;
    handleDeleteDokumen: (id: string) => void;
    handleChangeDokumen: (updated: Dokumen) => void;
    draggedDokIdx: number | null;
    setDraggedDokIdx: (idx: number | null) => void;
    handleDragStartDok: (idx: number) => void;
    handleDragOverDok: (e: React.DragEvent, idx: number) => void;
    handleFileUpload: (
        dokId: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
}

export default function DokumenListEditor({
    activeDokumenList,
    handleAddDokumen,
    handleDeleteDokumen,
    handleChangeDokumen,
    draggedDokIdx,
    setDraggedDokIdx,
    handleDragStartDok,
    handleDragOverDok,
    handleFileUpload,
    fileRefs,
}: DokumenListEditorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Dokumen Unduhan ({activeDokumenList.length})
                </label>
                <button
                    type="button"
                    onClick={handleAddDokumen}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-admin-accent/10 px-2 py-1 text-[10px] font-bold text-admin-accent hover:bg-admin-accent hover:text-white"
                >
                    <Plus size={10} /> Tambah Dokumen
                </button>
            </div>
            <div className="space-y-3">
                {activeDokumenList.map((doc, dIdx) => (
                    <div
                        key={doc.id}
                        draggable
                        onDragStart={() => handleDragStartDok(dIdx)}
                        onDragOver={(e) => handleDragOverDok(e, dIdx)}
                        onDragEnd={() => setDraggedDokIdx(null)}
                        className={cn(
                            'group/dok space-y-3 rounded-xl border border-admin-border/50 bg-admin-bg/30 p-4',
                            draggedDokIdx === dIdx && 'scale-95 opacity-40',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <GripVertical
                                size={12}
                                className="cursor-grab text-admin-text-muted/30 group-hover/dok:text-admin-text-muted"
                            />
                            <span className="flex-1 text-[10px] font-bold text-admin-accent uppercase">
                                Dokumen #{dIdx + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDeleteDokumen(doc.id)}
                                className="rounded-lg p-1 text-admin-text-muted hover:bg-red-500/10 hover:text-red-400"
                            >
                                <Trash2 size={11} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-admin-text-muted uppercase">
                                    Nama Dokumen
                                </label>
                                <input
                                    type="text"
                                    value={doc.name}
                                    onChange={(e) =>
                                        handleChangeDokumen({
                                            ...doc,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-admin-border bg-admin-bg px-2.5 py-1.5 text-xs font-medium text-admin-text focus:border-admin-accent"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-admin-text-muted uppercase">
                                    Ukuran File
                                </label>
                                <input
                                    type="text"
                                    value={doc.fileSize}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-lg border border-admin-border/50 bg-admin-bg/30 px-2.5 py-1.5 text-xs font-semibold text-admin-text-muted outline-hidden"
                                    placeholder="0 MB"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex w-fit rounded-lg border border-admin-border bg-admin-bg p-0.5">
                                {(['url', 'upload'] as const).map((st) => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() =>
                                            handleChangeDokumen({
                                                ...doc,
                                                sourceType: st,
                                            })
                                        }
                                        className={cn(
                                            'flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[9px] font-bold transition-all',
                                            doc.sourceType === st
                                                ? 'bg-admin-accent text-white shadow-sm'
                                                : 'text-admin-text-muted hover:text-admin-text',
                                        )}
                                    >
                                        {st === 'url' ? (
                                            <LinkIcon size={8} />
                                        ) : (
                                            <UploadCloud size={8} />
                                        )}
                                        {st === 'url' ? 'Link URL' : 'Upload'}
                                    </button>
                                ))}
                            </div>
                            {doc.sourceType === 'url' ? (
                                <input
                                    type="text"
                                    value={doc.fileUrl}
                                    onChange={(e) =>
                                        handleChangeDokumen({
                                            ...doc,
                                            fileUrl: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-admin-border bg-admin-bg px-2.5 py-1.5 font-mono text-[10px] text-admin-text focus:border-admin-accent"
                                    placeholder="/assets/pengadaan/rks.pdf"
                                />
                            ) : (
                                <div className="space-y-1">
                                    <div
                                        onClick={() =>
                                            fileRefs.current[doc.id]?.click()
                                        }
                                        className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-admin-border bg-admin-bg/50 p-3 hover:border-admin-accent/50"
                                    >
                                        <input
                                            ref={(el) => {
                                                fileRefs.current[doc.id] = el;
                                            }}
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                                            onChange={(e) =>
                                                handleFileUpload(doc.id, e)
                                            }
                                            className="hidden"
                                        />
                                        {doc.uploading ? (
                                            <div className="flex animate-pulse items-center gap-1.5 text-[9px] font-bold text-admin-accent">
                                                <div className="size-2.5 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                Memuat file...
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud
                                                    size={16}
                                                    className="text-admin-text-muted group-hover:text-admin-accent"
                                                />
                                                <span className="text-[9px] font-bold text-admin-text">
                                                    Pilih File Dokumen/Gambar
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {doc.fileName && !doc.uploading && (
                                        <span className="block text-[9px] font-bold text-emerald-400">
                                            ✓ {doc.fileName} dimuat
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
