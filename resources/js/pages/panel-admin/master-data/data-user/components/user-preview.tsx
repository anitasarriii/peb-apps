import { Eye } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { UserItem } from '../types';
import { getRoleStyle, getRoleIcon, avatarFallback } from '../utils';

interface UserPreviewProps {
    users: UserItem[];
    activeId: number | null;
    isAdding: boolean;
    getRoleLabelById: (id: string | number) => string;
    data: any; // form data for real-time sync
}

export default function UserPreview({
    users,
    activeId,
    isAdding,
    getRoleLabelById,
    data,
}: UserPreviewProps) {
    return (
        <AnimeReveal delay={250} distance={20} direction="up">
            <div className="relative flex h-[700px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                <div className="mb-4 flex shrink-0 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-admin-accent" />
                        <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                            Daftar Pengguna / Ringkasan
                        </span>
                    </div>
                    {isAdding && (
                        <span className="animate-pulse rounded-sm bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                            Menambah Data Baru
                        </span>
                    )}
                </div>
                <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
                    {/* Render new user preview at the top if isAdding */}
                    {isAdding && (
                        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/5 p-4 shadow-lg ring-1 ring-blue-500/20 transition-all duration-300">
                            <div className="mb-3 flex items-center gap-1.5 border-b border-blue-500/20 pb-2">
                                <div className="size-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                                    Preview Baru
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        data.avatar instanceof File
                                            ? URL.createObjectURL(data.avatar)
                                            : data.avatar ||
                                              avatarFallback(
                                                  data.name || 'User',
                                              )
                                    }
                                    alt="Preview"
                                    className="size-10 rounded-full border-2 border-blue-500/30 object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-admin-text">
                                        {data.name || 'Nama Lengkap'}
                                    </p>
                                    <p className="truncate text-[10px] text-admin-text-muted">
                                        {data.email || 'Alamat Email'}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    {data.role_id && (
                                        <span className="rounded-full border border-admin-border px-1.5 py-0.5 text-[9px] font-bold text-admin-text-muted">
                                            {getRoleLabelById(data.role_id)}
                                        </span>
                                    )}
                                    <span
                                        className={cn(
                                            'text-[9px] font-bold',
                                            data.status === 'Aktif'
                                                ? 'text-emerald-400'
                                                : 'text-admin-text-muted',
                                        )}
                                    >
                                        {data.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {users.map((user) => {
                        const isActive = activeId === user.id && !isAdding;

                        // Gunakan state data form jika user sedang diedit (real-time feedback)
                        const displayName = isActive ? data.name : user.name;
                        const displayEmail = isActive ? data.email : user.email;
                        const displayAvatar = isActive
                            ? data.avatar instanceof File
                                ? URL.createObjectURL(data.avatar)
                                : data.avatar
                            : user.avatar;
                        const displayStatus = isActive
                            ? data.status
                            : user.status;
                        const displayRoleId = isActive
                            ? data.role_id
                            : user.role_id;
                        const roleLabel = getRoleLabelById(displayRoleId);
                        const roleName = user.role?.name || 'admin';

                        return (
                            <div
                                key={user.id}
                                className={cn(
                                    'rounded-2xl border p-4 transition-all duration-300',
                                    isActive
                                        ? 'border-admin-accent/60 bg-admin-card shadow-lg ring-1 shadow-admin-accent/10 ring-admin-accent/20'
                                        : 'border-admin-border bg-admin-bg/50 opacity-70',
                                )}
                            >
                                {isActive && (
                                    <div className="mb-3 flex items-center gap-1.5 border-b border-admin-accent/20 pb-2">
                                        <div className="size-1.5 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                        <span className="text-[10px] font-bold tracking-widest text-admin-accent uppercase">
                                            Sedang Diedit
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            displayAvatar ||
                                            avatarFallback(displayName)
                                        }
                                        alt={displayName}
                                        className={cn(
                                            'size-10 rounded-full border-2 object-cover',
                                            isActive
                                                ? 'border-admin-accent/30'
                                                : 'border-admin-border',
                                        )}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                avatarFallback(displayName);
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-admin-text">
                                            {displayName}
                                        </p>
                                        <p className="truncate text-[10px] text-admin-text-muted">
                                            {displayEmail}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <span
                                            className={cn(
                                                'flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold',
                                                getRoleStyle(roleName),
                                            )}
                                        >
                                            {getRoleIcon(roleName)} {roleLabel}
                                        </span>
                                        <span
                                            className={cn(
                                                'text-[9px] font-bold',
                                                displayStatus === 'Aktif'
                                                    ? 'text-emerald-400'
                                                    : 'text-admin-text-muted',
                                            )}
                                        >
                                            {displayStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                    <span>LIVE PREVIEW</span>
                    <span>REAL-TIME SYNC</span>
                </div>
            </div>
        </AnimeReveal>
    );
}
