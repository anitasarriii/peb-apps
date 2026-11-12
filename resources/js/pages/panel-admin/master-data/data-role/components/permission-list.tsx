import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Permission, RoleConfig } from '../types';

interface PermissionListProps {
    permissions: Permission[];
    activeRoleData?: RoleConfig;
    data: any;
    togglePermission: (permName: string) => void;
}

export default function PermissionList({
    permissions,
    activeRoleData,
    data,
    togglePermission,
}: PermissionListProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Hak Akses — {activeRoleData?.label}
                </label>
                {(activeRoleData?.name === 'super_admin' ||
                    activeRoleData?.name === 'user') && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                        Semua akses terkunci
                    </span>
                )}
            </div>
            <div className="custom-scrollbar max-h-72 space-y-2 overflow-y-auto pr-1">
                {permissions.map((perm) => {
                    const isEnabled = data.permissions?.[perm.name] ?? false;
                    const isLocked =
                        activeRoleData?.name === 'super_admin' ||
                        activeRoleData?.name === 'admin_pengadaan' ||
                        activeRoleData?.name === 'user';

                    return (
                        <div
                            key={perm.id}
                            onClick={() =>
                                !isLocked && togglePermission(perm.name)
                            }
                            className={cn(
                                'flex items-center gap-4 rounded-2xl border p-3.5 transition-all duration-200',
                                isLocked ? 'cursor-default' : 'cursor-pointer',
                                isEnabled
                                    ? 'border-admin-accent/20 bg-admin-accent/5'
                                    : 'border-admin-border/60 bg-admin-bg/30 hover:border-admin-border',
                            )}
                        >
                            {/* Toggle */}
                            <div
                                className={cn(
                                    'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                                    isEnabled
                                        ? 'border-admin-accent bg-admin-accent'
                                        : 'border-admin-border bg-transparent',
                                )}
                            >
                                {isEnabled && (
                                    <CheckCircle2
                                        size={12}
                                        className="text-white"
                                    />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p
                                    className={cn(
                                        'text-xs font-bold',
                                        isEnabled
                                            ? 'text-admin-text'
                                            : 'text-admin-text-muted',
                                    )}
                                >
                                    {perm.label}
                                </p>
                                <p className="text-[10px] text-admin-text-muted/60">
                                    {perm.description}
                                </p>
                            </div>
                            {isEnabled && (
                                <div className="size-1.5 shrink-0 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
