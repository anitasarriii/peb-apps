import { cn } from '@/lib/utils';
import { RoleConfig } from '../types';
import { getRoleIcon, getRoleColor } from '../utils';

interface RoleSelectorProps {
    roles: RoleConfig[];
    activeRoleId: number;
    setActiveRoleId: (id: number) => void;
    totalPermissions: number;
}

export default function RoleSelector({
    roles,
    activeRoleId,
    setActiveRoleId,
    totalPermissions,
}: RoleSelectorProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => {
                const isActive = activeRoleId === role.id;
                const count = Object.values(role.permissions || {}).filter(
                    Boolean,
                ).length;
                return (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => setActiveRoleId(role.id)}
                        className={cn(
                            'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-200',
                            isActive
                                ? 'border-admin-accent/40 bg-admin-card shadow-lg shadow-admin-accent/10'
                                : 'border-admin-border bg-admin-bg/50 hover:border-admin-accent/20',
                        )}
                    >
                        <div
                            className={cn(
                                'flex size-10 items-center justify-center rounded-xl',
                                isActive ? 'bg-admin-accent/10' : 'bg-admin-bg',
                                getRoleColor(role.name, role.color),
                            )}
                        >
                            {getRoleIcon(role.name)}
                        </div>
                        <span
                            className={cn(
                                'text-xs font-bold',
                                isActive
                                    ? 'text-admin-accent'
                                    : 'text-admin-text-muted',
                            )}
                        >
                            {role.label}
                        </span>
                        <span className="text-[10px] text-admin-text-muted/60">
                            {count}/{totalPermissions} akses
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
