import { Eye } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { RoleConfig, Permission } from '../types';
import { getRoleIcon, getRoleColor } from '../utils';

interface RolePreviewProps {
    roles: RoleConfig[];
    activeRoleId: number;
    permissions: Permission[];
    data: any; // form data for real-time sync
}

export default function RolePreview({
    roles,
    activeRoleId,
    permissions,
    data,
}: RolePreviewProps) {
    return (
        <AnimeReveal delay={250} distance={20} direction="up">
            <div className="relative flex h-[700px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                <div className="mb-4 flex shrink-0 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-admin-accent" />
                        <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                            Ringkasan Role
                        </span>
                    </div>
                    <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                        Aktif
                    </span>
                </div>
                <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
                    {roles.map((role) => {
                        // To show real-time changes for the active role, merge with form data
                        const currentPerms =
                            role.id === activeRoleId
                                ? data.permissions
                                : role.permissions || {};
                        const enabledPerms = permissions.filter(
                            (p) => currentPerms[p.name],
                        );
                        const isActive = role.id === activeRoleId;

                        return (
                            <div
                                key={role.id}
                                className={cn(
                                    'rounded-2xl border p-4 transition-all duration-300',
                                    isActive
                                        ? 'border-admin-accent/60 shadow-lg ring-1 shadow-admin-accent/10 ring-admin-accent/20'
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
                                <div className="mb-3 flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'flex size-8 items-center justify-center rounded-xl',
                                            getRoleColor(role.name, role.color),
                                            role.name === 'super_admin'
                                                ? 'bg-amber-500/10'
                                                : role.name === 'admin'
                                                  ? 'bg-admin-accent/10'
                                                  : 'bg-blue-500/10',
                                        )}
                                    >
                                        {getRoleIcon(role.name)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-admin-text">
                                            {role.label}
                                        </p>
                                        <p className="text-[10px] text-admin-text-muted">
                                            {enabledPerms.length}/
                                            {permissions.length} hak akses
                                        </p>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="ml-2 h-1.5 flex-1 overflow-hidden rounded-full bg-admin-border">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all duration-500',
                                                role.name === 'super_admin'
                                                    ? 'bg-amber-400'
                                                    : role.name === 'admin'
                                                      ? 'bg-admin-accent'
                                                      : 'bg-blue-400',
                                            )}
                                            style={{
                                                width: `${(enabledPerms.length / permissions.length) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {enabledPerms.slice(0, 6).map((p) => (
                                        <span
                                            key={p.id}
                                            className="rounded-full bg-admin-accent/10 px-2 py-0.5 text-[9px] font-bold text-admin-accent"
                                        >
                                            {p.label}
                                        </span>
                                    ))}
                                    {enabledPerms.length > 6 && (
                                        <span className="rounded-full bg-admin-border px-2 py-0.5 text-[9px] font-bold text-admin-text-muted">
                                            +{enabledPerms.length - 6} lainnya
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                    <span>RINGKASAN ROLE</span>
                    <span>REAL-TIME SYNC</span>
                </div>
            </div>
        </AnimeReveal>
    );
}
