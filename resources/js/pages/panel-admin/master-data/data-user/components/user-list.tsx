import { Plus, Search, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserItem } from '../types';
import { getRoleStyle, getRoleIcon, avatarFallback } from '../utils';

interface UserListProps {
    users: UserItem[];
    totalUsers: number;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    activeId: number | null;
    isAdding: boolean;
    onAdd: () => void;
    onSelect: (id: number) => void;
    onDeleteClick: (id: number) => void;
}

export default function UserList({
    users,
    totalUsers,
    searchTerm,
    onSearchChange,
    activeId,
    isAdding,
    onAdd,
    onSelect,
    onDeleteClick,
}: UserListProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Daftar Pengguna ({totalUsers})
                </label>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                >
                    <Plus size={13} /> Tambah User
                </button>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-2.5 transition-all focus-within:border-admin-accent">
                <Search size={14} className="shrink-0 text-admin-text-muted" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex-1 bg-transparent text-xs font-medium text-admin-text outline-hidden"
                    placeholder="Cari nama atau email..."
                />
            </div>
            <div className="custom-scrollbar max-h-52 space-y-1.5 overflow-y-auto rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => onSelect(user.id)}
                        className={cn(
                            'group/item flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none',
                            activeId === user.id && !isAdding
                                ? 'border border-admin-accent/30 bg-admin-card shadow-sm'
                                : 'border border-transparent hover:bg-admin-card/60',
                        )}
                    >
                        <img
                            src={user.avatar || avatarFallback(user.name)}
                            alt={user.name}
                            className="size-8 shrink-0 rounded-full border-2 border-admin-border object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    avatarFallback(user.name);
                            }}
                        />
                        <div className="min-w-0 flex-1">
                            <p
                                className={cn(
                                    'truncate text-xs font-bold',
                                    activeId === user.id && !isAdding
                                        ? 'text-admin-accent'
                                        : 'text-admin-text-muted',
                                )}
                            >
                                {user.name}
                            </p>
                            <p className="truncate text-[10px] text-admin-text-muted/60">
                                {user.email}
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                            {user.role && (
                                <span
                                    className={cn(
                                        'flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold',
                                        getRoleStyle(user.role.name),
                                    )}
                                >
                                    {getRoleIcon(user.role.name)}{' '}
                                    {user.role.label}
                                </span>
                            )}
                            <span
                                className={cn(
                                    'size-1.5 rounded-full',
                                    user.status === 'Aktif'
                                        ? 'bg-emerald-400'
                                        : 'bg-admin-text-muted/40',
                                )}
                            />
                        </div>
                        {/* Delete button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(user.id);
                            }}
                            className="shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted opacity-0 transition-all group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
