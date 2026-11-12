import { useState } from 'react';
import {
    GripVertical,
    Trash2,
    ChevronUp,
    ChevronDown,
    Users,
    MapPin,
    Briefcase,
    Hammer,
    Star,
    Zap,
    TrendingUp,
    Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconKey =
    | 'Users'
    | 'MapPin'
    | 'Briefcase'
    | 'Hammer'
    | 'Star'
    | 'Zap'
    | 'TrendingUp'
    | 'Award';

export interface StatItem {
    id: string;
    icon: IconKey;
    value: string;
    label: string;
}

export const ICON_MAP: Record<IconKey, React.ReactNode> = {
    Users: <Users className="h-5 w-5" />,
    MapPin: <MapPin className="h-5 w-5" />,
    Briefcase: <Briefcase className="h-5 w-5" />,
    Hammer: <Hammer className="h-5 w-5" />,
    Star: <Star className="h-5 w-5" />,
    Zap: <Zap className="h-5 w-5" />,
    TrendingUp: <TrendingUp className="h-5 w-5" />,
    Award: <Award className="h-5 w-5" />,
};

export const ICON_OPTIONS: IconKey[] = [
    'Users',
    'MapPin',
    'Briefcase',
    'Hammer',
    'Star',
    'Zap',
    'TrendingUp',
    'Award',
];

interface StatRowEditorProps {
    stat: StatItem;
    index: number;
    onUpdate: (updated: StatItem) => void;
    onDelete: (id: string) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
}

export default function StatRowEditor({
    stat,
    index,
    onUpdate,
    onDelete,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
}: StatRowEditorProps) {
    const [open, setOpen] = useState(false);
    const [dragStartReady, setDragStartReady] = useState(false);

    const update = (field: keyof StatItem, val: string) =>
        onUpdate({ ...stat, [field]: val });

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

                {/* Icon Preview */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                    {ICON_MAP[stat.icon]}
                </div>

                <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-admin-text">
                        {stat.label || 'Stat Baru'}
                    </span>
                    <span className="text-xs text-admin-text-muted">
                        Nilai: {stat.value || '—'}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onDelete(stat.id)}
                        className="cursor-pointer rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        title="Hapus statistik"
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
                <div className="space-y-4 border-t border-admin-border bg-admin-bg/20 px-4 py-4">
                    {/* Icon Picker */}
                    <div>
                        <label className="mb-2 block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                            Ikon Statistik
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {ICON_OPTIONS.map((key) => (
                                <button
                                    type="button"
                                    key={key}
                                    onClick={() => update('icon', key)}
                                    title={key}
                                    className={cn(
                                        'flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200',
                                        stat.icon === key
                                            ? 'border-admin-accent bg-admin-accent/10 text-admin-accent'
                                            : 'border-admin-border bg-admin-bg text-admin-text-muted hover:border-admin-accent/50 hover:text-admin-accent',
                                    )}
                                >
                                    {ICON_MAP[key]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Value */}
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                Angka / Nilai
                            </label>
                            <input
                                type="text"
                                value={stat.value}
                                onChange={(e) =>
                                    update('value', e.target.value)
                                }
                                placeholder="682"
                                className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm font-bold text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                            />
                        </div>

                        {/* Label */}
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                Label / Nama
                            </label>
                            <input
                                type="text"
                                value={stat.label}
                                onChange={(e) =>
                                    update('label', e.target.value)
                                }
                                placeholder="Karyawan"
                                className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 text-sm text-admin-text transition-all duration-300 placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-hidden"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
