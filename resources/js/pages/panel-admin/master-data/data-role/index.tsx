import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { update as updateRole } from '@/routes/panel-admin/roles';
import { ShieldCheck, RotateCcw, Save } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';

import { RoleConfig, Permission, PaginationData } from './types';
import RoleSelector from './components/role-selector';
import RoleInfo from './components/role-info';
import PermissionList from './components/permission-list';
import RolePreview from './components/role-preview';

export default function DataRoleEditor({
    roles,
    permissions,
}: {
    roles: PaginationData<RoleConfig>;
    permissions: Permission[];
}) {
    const [activeRoleId, setActiveRoleId] = useState<number>(
        roles.data[0]?.id || 0,
    );

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<
        'success' | 'error' | 'warning' | 'info'
    >('success');

    const activeRoleData = roles.data.find((r) => r.id === activeRoleId);

    const { data, setData, put, processing, reset, recentlySuccessful } =
        useForm({
            name: '',
            label: '',
            description: '',
            color: '',
            permissions: {} as Record<string, boolean>,
        });

    useEffect(() => {
        if (activeRoleData) {
            let initialPermissions = activeRoleData.permissions || {};
            if (activeRoleData.name === 'user') {
                initialPermissions = {
                    view_dashboard: true,
                    view_content: true,
                };
            }
            setData({
                name: activeRoleData.name,
                label: activeRoleData.label,
                description: activeRoleData.description || '',
                color: activeRoleData.color || '',
                permissions: initialPermissions,
            });
        }
    }, [activeRoleId, roles]);

    const togglePermission = (permName: string) => {
        if (
            activeRoleData?.name === 'super_admin' ||
            activeRoleData?.name === 'user'
        )
            return;
        setData('permissions', {
            ...data.permissions,
            [permName]: !data.permissions[permName],
        });
    };

    const handleReset = () => {
        if (activeRoleData) {
            let initialPermissions = activeRoleData.permissions || {};
            if (activeRoleData.name === 'user') {
                initialPermissions = {
                    view_dashboard: true,
                    view_content: true,
                };
            }
            setData({
                name: activeRoleData.name,
                label: activeRoleData.label,
                description: activeRoleData.description || '',
                color: activeRoleData.color || '',
                permissions: initialPermissions,
            });
        }
    };

    const triggerToast = (
        msg: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'success',
    ) => {
        setToastMessage(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(updateRole.url(activeRoleId), {
            preserveScroll: true,
            onSuccess: () => {
                triggerToast('Data role berhasil diperbarui.', 'success');
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                triggerToast(firstError || 'Gagal memperbarui role.', 'error');
            },
        });
    };

    const permissionCount = Object.values(data.permissions || {}).filter(
        Boolean,
    ).length;

    const isReadOnly =
        activeRoleData?.name === 'super_admin' ||
        activeRoleData?.name === 'user';

    return (
        <>
            <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-7">
                    <AnimeReveal delay={100} distance={20} direction="up">
                        <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                            <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                            <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Data Role
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Atur hak akses untuk setiap role
                                        pengguna.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <RoleSelector
                                    roles={roles.data}
                                    activeRoleId={activeRoleId}
                                    setActiveRoleId={setActiveRoleId}
                                    totalPermissions={permissions.length}
                                />

                                <RoleInfo
                                    activeRoleData={activeRoleData}
                                    permissionCount={permissionCount}
                                />

                                <PermissionList
                                    permissions={permissions}
                                    activeRoleData={activeRoleData}
                                    data={data}
                                    togglePermission={togglePermission}
                                />

                                {!isReadOnly && (
                                    <div className="flex gap-4 border-t border-admin-border pt-4">
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                                        >
                                            <RotateCcw size={16} /> Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={cn(
                                                'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-lg shadow-admin-primary/20 transition-all duration-300 active:scale-[0.98]',
                                                processing
                                                    ? 'cursor-not-allowed bg-admin-primary/60'
                                                    : 'bg-admin-primary hover:bg-admin-accent',
                                            )}
                                        >
                                            {processing ? (
                                                <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            ) : (
                                                <Save size={16} />
                                            )}
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </AnimeReveal>
                </div>

                <div className="space-y-6 xl:col-span-5">
                    <RolePreview
                        roles={roles.data}
                        activeRoleId={activeRoleId}
                        permissions={permissions}
                        data={data}
                    />
                </div>

                <AdminToast
                    show={showToast || recentlySuccessful}
                    type={toastType}
                    message={toastMessage || 'Data role berhasil diperbarui.'}
                />
            </div>
        </>
    );
}
