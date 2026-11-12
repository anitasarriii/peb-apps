import { cn } from '@/lib/utils';
import { getRoleStyle, getRoleIcon } from '../utils';
import { RoleItem, UserItem } from '../types';

interface UserStatsProps {
    roles: RoleItem[];
    users: UserItem[];
}

export default function UserStats({ roles, users }: UserStatsProps) {
    const roleCount = (roleName: string) =>
        users.filter((u) => u?.role?.name === roleName).length;

    return (
        <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => (
                <div
                    key={role.id}
                    className={cn(
                        'flex items-center gap-2 rounded-2xl border p-3',
                        getRoleStyle(role.name),
                    )}
                >
                    <div
                        className={cn(
                            'flex size-7 items-center justify-center rounded-lg',
                            getRoleStyle(role.name).split(' ')[0],
                        )}
                    >
                        <span className={getRoleStyle(role.name).split(' ')[1]}>
                            {getRoleIcon(role.name)}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-admin-text-muted">
                            {role.label}
                        </p>
                        <p className="text-sm font-black text-admin-text">
                            {roleCount(role.name)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
