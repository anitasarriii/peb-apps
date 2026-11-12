import { cn } from '@/lib/utils';
import { RoleConfig } from '../types';
import { getRoleIcon, getRoleColor } from '../utils';

interface RoleInfoProps {
    activeRoleData?: RoleConfig;
    permissionCount: number;
}

export default function RoleInfo({
    activeRoleData,
    permissionCount,
}: RoleInfoProps) {
    if (!activeRoleData) return null;

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-2xl border p-4',
                activeRoleData.name === 'super_admin'
                    ? 'border-amber-500/20 bg-amber-500/5'
                    : activeRoleData.name === 'admin'
                      ? 'border-admin-accent/20 bg-admin-accent/5'
                      : 'border-blue-500/20 bg-blue-500/5',
            )}
        >
            <div
                className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-xl',
                    getRoleColor(activeRoleData.name, activeRoleData.color),
                    activeRoleData.name === 'super_admin'
                        ? 'bg-amber-500/10'
                        : activeRoleData.name === 'admin'
                          ? 'bg-admin-accent/10'
                          : 'bg-blue-500/10',
                )}
            >
                {getRoleIcon(activeRoleData.name)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-admin-text">
                    {activeRoleData.label}
                </p>
                <p className="text-[10px] text-admin-text-muted">
                    {activeRoleData.description}
                </p>
            </div>
            <div className="shrink-0 text-right">
                <p className="text-lg font-black text-admin-text">
                    {permissionCount}
                </p>
                <p className="text-[10px] text-admin-text-muted">Hak Akses</p>
            </div>
        </div>
    );
}
