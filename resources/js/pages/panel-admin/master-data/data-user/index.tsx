import { useRef, useState, useCallback, useEffect } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import AdminToast from '@/components/panel-admin/admin-toast';

import {
    index as usersIndex,
    store as usersStore,
    update as usersUpdate,
    destroy as usersDestroy,
} from '@/routes/panel-admin/users';

import { PageProps, StatusType } from './types';
import UserStats from './components/user-stats';
import UserList from './components/user-list';
import UserForm from './components/user-form';
import UserPreview from './components/user-preview';
import DeleteConfirmModal from './components/delete-confirm-modal';

export default function DataUserEditor({ users, roles, filters }: PageProps) {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    // ---- State lokal ----
    const [activeId, setActiveId] = useState<number | null>(
        users.data[0]?.id ?? null,
    );
    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [isAdding, setIsAdding] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
        null,
    );
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<
        'success' | 'error' | 'warning' | 'info'
    >('success');

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelSearch = useRef<(() => void) | null>(null);

    useEffect(
        () => () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            cancelSearch.current?.();
        },
        [],
    );

    // ---- Inertia useForm untuk Create & Update ----
    const activeUser = users.data.find((u) => u.id === activeId);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: activeUser?.name ?? '',
        email: activeUser?.email ?? '',
        role_id:
            activeUser?.role_id?.toString() ?? roles[0]?.id?.toString() ?? '',
        status: (activeUser?.status ?? 'Aktif') as StatusType,
        password: '',
        password_confirmation: '',
        avatar: activeUser?.avatar ?? '',
    });

    // Sync form ketika user aktif berubah
    const selectUser = useCallback(
        (id: number) => {
            setActiveId(id);
            setIsAdding(false);
            const user = users.data.find((u) => u.id === id);
            if (user) {
                reset();
                setData({
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id?.toString() ?? '',
                    status: user.status,
                    password: '',
                    password_confirmation: '',
                    avatar: user.avatar ?? '',
                });
            }
        },
        [users.data],
    );

    // ---- Handlers ----
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        cancelSearch.current?.();
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            router.get(
                '/panel-admin',
                { tab: 'Data User', search: value || undefined },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    only: ['users', 'filters'],
                    onCancelToken: (token) => {
                        cancelSearch.current = () => token.cancel();
                    },
                },
            );
        }, 400);
    };

    const handleAdd = () => {
        setIsAdding(true);
        setActiveId(null);
        reset();
        setData({
            name: '',
            email: '',
            role_id: roles[0]?.id?.toString() ?? '',
            status: 'Aktif',
            password: '',
            password_confirmation: '',
            avatar: '',
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (isAdding) {
            post(usersStore.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAdding(false);
                    triggerToast('User baru berhasil ditambahkan.', 'success');
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    triggerToast(
                        firstError || 'Gagal menyimpan data.',
                        'error',
                    );
                },
            });
        } else if (activeId) {
            put(usersUpdate.url(activeId), {
                preserveScroll: true,
                onSuccess: () => {
                    triggerToast('Data user berhasil diperbarui.', 'success');
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    triggerToast(
                        firstError || 'Gagal menyimpan data.',
                        'error',
                    );
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(usersDestroy.url(id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteConfirm(null);
                if (activeId === id) {
                    const remaining = users.data.filter((u) => u.id !== id);
                    setActiveId(remaining[0]?.id ?? null);
                }
                triggerToast('User berhasil dihapus.', 'success');
            },
            onError: (errors) => {
                setShowDeleteConfirm(null);
                const firstError = Object.values(errors)[0];
                triggerToast(firstError || 'Gagal menghapus data.', 'error');
            },
        });
    };

    const handleReset = () => {
        if (isAdding) {
            setIsAdding(false);
            if (users.data.length > 0) selectUser(users.data[0].id);
        } else if (activeUser) {
            selectUser(activeUser.id);
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

    const getRoleLabelById = (roleId: number | string) => {
        const r = roles.find(
            (role) => role.id.toString() === roleId.toString(),
        );
        return r?.label ?? 'User';
    };

    return (
        <>
            <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-7">
                    <AnimeReveal delay={100} distance={20} direction="up">
                        <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                            <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                            <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Data User
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Kelola pengguna dan hak akses mereka.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <UserStats roles={roles} users={users.data} />

                                <UserList
                                    users={users.data}
                                    totalUsers={users.total}
                                    searchTerm={searchTerm}
                                    onSearchChange={handleSearch}
                                    activeId={activeId}
                                    isAdding={isAdding}
                                    onAdd={handleAdd}
                                    onSelect={selectUser}
                                    onDeleteClick={(id) =>
                                        setShowDeleteConfirm(id)
                                    }
                                />

                                <UserForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    processing={processing}
                                    roles={roles}
                                    isAdding={isAdding}
                                    onReset={handleReset}
                                    onSubmit={handleSave}
                                />
                            </div>
                        </div>
                    </AnimeReveal>
                </div>

                <div className="space-y-6 xl:col-span-5">
                    <UserPreview
                        users={users.data}
                        activeId={activeId}
                        isAdding={isAdding}
                        getRoleLabelById={getRoleLabelById}
                        data={data}
                    />
                </div>

                <AdminToast
                    show={showToast || recentlySuccessful}
                    type={toastType}
                    message={
                        toastMessage ||
                        flash?.success ||
                        'Data pengguna berhasil disimpan.'
                    }
                />
            </div>

            <DeleteConfirmModal
                showDeleteConfirm={showDeleteConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
                users={users.data}
                onConfirm={handleDelete}
            />
        </>
    );
}
