import { useState } from 'react';
import {
    GripVertical,
    Trash2,
    ChevronUp,
    ChevronDown,
    ImageIcon,
    Link,
    Upload,
    X,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProjectItem {
    id: string;
    title: string;
    category: string;
    year: string;
    image: string;
    imageSource: 'url' | 'upload';
    imageFile?: File;
}

interface ProjectCardEditorProps {
    project: ProjectItem;
    index: number;
    onChange: (updated: ProjectItem) => void;
    onDelete: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    triggerToast?: (type: 'error' | 'success', message: string) => void;
}

export default function ProjectCardEditor({
    project,
    index,
    onChange,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
    triggerToast,
}: ProjectCardEditorProps) {
    const [open, setOpen] = useState(false);
    const [dragStartReady, setDragStartReady] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageFileName, setImageFileName] = useState('');

    const update = (field: keyof ProjectItem, value: string) =>
        onChange({ ...project, [field]: value });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran berkas maksimal 500 MB
        const maxSizeBytes = 500 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            if (triggerToast) {
                triggerToast(
                    'error',
                    'Ukuran berkas terlalu besar! Maksimal ukuran yang diperbolehkan adalah 500 MB.',
                );
            } else {
                alert(
                    'Ukuran berkas terlalu besar! Maksimal ukuran yang diperbolehkan adalah 500 MB.',
                );
            }
            e.target.value = '';
            return;
        }

        setUploadingImage(true);
        setImageFileName('');

        const localUrl = URL.createObjectURL(file);

        setUploadingImage(false);
setImageFileName(file.name);
onChange({
                ...project,
                image: localUrl,
                imageSource: 'upload',
                imageFile: file,
            });
console.log(
                `[ProjectCardEditor] Gambar proyek "${file.name}" berhasil dimuat secara lokal.`,
            );
    };
    return (
        <div
            draggable={dragStartReady}
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(index);
            }}
            onDragEnd={() => {
                onDragEnd();
                setDragStartReady(false);
            }}
            className={cn(
                'rounded-2xl border transition-all duration-300',
                isDragging
                    ? 'border-admin-accent bg-admin-accent/5 opacity-40'
                    : 'border-admin-border bg-admin-card hover:border-admin-accent/30',
            )}
        >
            {/* Header Row */}
            <div className="flex items-center gap-3 p-4">
                {/* Drag handle */}
                <div
                    onMouseDown={() => setDragStartReady(true)}
                    onMouseUp={() => setDragStartReady(false)}
                    onMouseLeave={() => setDragStartReady(false)}
                    className="flex-shrink-0 cursor-grab p-1 text-admin-text-muted transition-colors hover:text-admin-accent active:cursor-grabbing"
                    title="Tarik untuk mengurutkan"
                >
                    <GripVertical className="h-4 w-4" />
                </div>

                {/* Thumbnail */}
                <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-admin-border bg-admin-bg">
                    {project.image ? (
                        <img
                            src={project.image}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-admin-text-muted" />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-admin-text">
                        {project.title || 'Proyek Baru'}
                    </p>
                    <p className="text-xs text-admin-text-muted">
                        {project.year} · {project.category || 'Kategori'}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onDelete(project.id)}
                        className="cursor-pointer rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        title="Hapus proyek"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="cursor-pointer rounded-lg p-1.5 text-admin-text-muted transition-colors hover:bg-admin-bg hover:text-admin-text"
                    >
                        {open ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Form */}
            {open && (
                <div className="space-y-4 border-t border-admin-border bg-admin-bg/20 px-4 py-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Judul Proyek
                        </label>
                        <input
                            type="text"
                            value={project.title}
                            onChange={(e) => update('title', e.target.value)}
                            placeholder="Nama proyek (uppercase direkomendasikan)"
                            className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                Kategori
                            </label>
                            <input
                                type="text"
                                value={project.category}
                                onChange={(e) =>
                                    update('category', e.target.value)
                                }
                                placeholder="ENERGI TERBARUKAN"
                                className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                            />
                        </div>
                        {/* Year */}
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                Tahun
                            </label>
                            <input
                                type="text"
                                value={project.year}
                                onChange={(e) => update('year', e.target.value)}
                                placeholder="2024"
                                maxLength={4}
                                className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                            />
                        </div>
                    </div>

                    {/* Image Source Toggle */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Gambar Proyek
                        </label>
                        <div className="flex gap-2">
                            {(['url', 'upload'] as const).map((src) => (
                                <button
                                    type="button"
                                    key={src}
                                    onClick={() => update('imageSource', src)}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all',
                                        project.imageSource === src
                                            ? 'border-admin-accent bg-admin-accent text-white'
                                            : 'border-admin-border bg-admin-bg text-admin-text-muted hover:text-admin-text',
                                    )}
                                >
                                    {src === 'url' ? (
                                        <Link className="h-3.5 w-3.5" />
                                    ) : (
                                        <Upload className="h-3.5 w-3.5" />
                                    )}
                                    {src === 'url' ? 'Dari URL' : 'Upload File'}
                                </button>
                            ))}
                        </div>

                        {project.imageSource === 'url' ? (
                            <div className="relative">
                                <input
                                    type="url"
                                    value={project.image}
                                    onChange={(e) =>
                                        update('image', e.target.value)
                                    }
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 pr-10 font-mono text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                                />
                                {project.image && (
                                    <button
                                        type="button"
                                        onClick={() => update('image', '')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-admin-text-muted hover:text-red-400"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                `project-img-input-${project.id}`,
                                            )
                                            ?.click()
                                    }
                                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-admin-border bg-admin-bg/40 py-6 transition-colors hover:border-admin-accent/50"
                                >
                                    <input
                                        id={`project-img-input-${project.id}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <Upload className="mb-2 h-6 w-6 text-admin-text-muted transition-colors group-hover:text-admin-accent" />
                                    <span className="text-xs font-bold text-admin-text">
                                        Klik untuk memilih gambar
                                    </span>
                                    <span className="mt-1 text-[10px] text-admin-text-muted">
                                        PNG, JPG, WEBP maks. 500 MB
                                    </span>
                                </div>

                                {uploadingImage && (
                                    <div className="flex animate-pulse items-center gap-2 text-xs font-bold text-admin-accent">
                                        <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                        Memproses file gambar...
                                    </div>
                                )}

                                {imageFileName && !uploadingImage && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                        <CheckCircle2 size={12} />
                                        File {imageFileName} berhasil dimuat
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Image Preview */}
                        {project.image && (
                            <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-admin-border">
                                <img
                                    src={project.image}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
