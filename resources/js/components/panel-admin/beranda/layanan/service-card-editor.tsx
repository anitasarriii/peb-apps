import { useState } from 'react';
import {
    GripVertical,
    Trash2,
    ChevronUp,
    ChevronDown,
    Wrench,
    BookText,
    Bolt,
    Server,
    RefreshCw,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconKey =
    | 'Wrench'
    | 'BookText'
    | 'Bolt'
    | 'Server'
    | 'RefreshCw'
    | 'Zap';

export interface ServiceItem {
    id: string;
    icon: IconKey;
    title: string;
    description: string;
}

export const ICON_MAP: Record<IconKey, React.ReactNode> = {
    Wrench: <Wrench className="h-5 w-5" />,
    BookText: <BookText className="h-5 w-5" />,
    Bolt: <Bolt className="h-5 w-5" />,
    Server: <Server className="h-5 w-5" />,
    RefreshCw: <RefreshCw className="h-5 w-5" />,
    Zap: <Zap className="h-5 w-5" />,
};

export const ICON_OPTIONS: IconKey[] = [
    'Wrench',
    'BookText',
    'Bolt',
    'Server',
    'RefreshCw',
    'Zap',
];

interface ServiceCardEditorProps {
    service: ServiceItem;
    index: number;
    onChange: (updated: ServiceItem) => void;
    onDelete: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
}

export default function ServiceCardEditor({
    service,
    index,
    onChange,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
}: ServiceCardEditorProps) {
    const [open, setOpen] = useState(false);
    const [dragStartReady, setDragStartReady] = useState(false);

    const update = (field: keyof ServiceItem, value: string | boolean) =>
        onChange({ ...service, [field]: value });

    return (
        <div
            draggable={dragStartReady}
            onDragStart={() => {
                onDragStart(index);
            }}
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
                    : '',
                !isDragging
                    ? 'border-admin-border bg-admin-card hover:border-admin-accent/30'
                    : '',
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

                {/* Icon Preview */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                    {ICON_MAP[service.icon]}
                </div>

                {/* Title */}
                <span className="flex-1 truncate text-sm font-semibold text-admin-text">
                    {service.title || 'Layanan Baru'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onDelete(service.id)}
                        className="cursor-pointer rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        title="Hapus layanan"
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
                    {/* Icon Picker */}
                    <div>
                        <label className="mb-2 block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Ikon Layanan
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ICON_OPTIONS.map((key) => (
                                <button
                                    type="button"
                                    key={key}
                                    onClick={() => update('icon', key)}
                                    title={key}
                                    className={cn(
                                        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200',
                                        service.icon === key
                                            ? 'border-admin-accent bg-admin-accent/10 text-admin-accent'
                                            : 'border-admin-border bg-admin-bg text-admin-text-muted hover:border-admin-accent/50 hover:text-admin-accent',
                                    )}
                                >
                                    {ICON_MAP[key]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Judul Layanan
                        </label>
                        <input
                            type="text"
                            value={service.title}
                            onChange={(e) => update('title', e.target.value)}
                            placeholder="Nama Layanan"
                            className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Deskripsi Layanan
                        </label>
                        <textarea
                            value={service.description}
                            onChange={(e) =>
                                update('description', e.target.value)
                            }
                            rows={3}
                            placeholder="Deskripsi singkat layanan..."
                            className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm leading-relaxed text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
