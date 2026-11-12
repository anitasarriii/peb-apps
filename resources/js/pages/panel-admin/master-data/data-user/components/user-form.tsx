import { RotateCcw, Save, UploadCloud } from 'lucide-react';
import React, { useRef } from 'react';
import AdminSelect from '@/components/panel-admin/admin-select';
import { cn } from '@/lib/utils';
import type { RoleItem, StatusType } from '../types';
import { STATUS_OPTIONS } from '../types';
import { avatarFallback } from '../utils';

interface UserFormProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    roles: RoleItem[];
    isAdding: boolean;
    onReset: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function UserForm({
    data,
    setData,
    errors,
    processing,
    roles,
    isAdding,
    onReset,
    onSubmit,
}: UserFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('avatar', e.target.files[0]);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex items-start gap-6 border-t border-admin-border pt-6">
                <div className="group relative">
                    <img
                        src={
                            data.avatar instanceof File
                                ? URL.createObjectURL(data.avatar)
                                : data.avatar ||
                                  avatarFallback(data.name || 'User')
                        }
                        alt="Avatar"
                        className="size-24 rounded-2xl border-2 border-admin-border object-cover transition-all duration-300 group-hover:border-admin-accent/50"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = avatarFallback(
                                data.name || 'User',
                            );
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                    >
                        <div className="flex flex-col items-center text-white">
                            <UploadCloud size={20} />
                            <span className="mt-1 text-[10px] font-bold">
                                Ubah
                            </span>
                        </div>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                <div className="flex-1 space-y-1 pt-2">
                    <h4 className="text-sm font-bold text-admin-text">
                        Foto Profil
                    </h4>
                    <p className="text-xs text-admin-text-muted">
                        Format .jpg, .png, .jpeg (Max 2MB)
                    </p>
                    {errors.avatar && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.avatar}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-muted">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={cn(
                            'w-full rounded-xl border bg-admin-bg/50 px-4 py-3 text-sm font-bold text-admin-text transition-all focus:bg-admin-card focus:outline-hidden',
                            errors.name
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-admin-border focus:border-admin-accent',
                        )}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-muted">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={cn(
                            'w-full rounded-xl border bg-admin-bg/50 px-4 py-3 text-sm font-bold text-admin-text transition-all focus:bg-admin-card focus:outline-hidden',
                            errors.email
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-admin-border focus:border-admin-accent',
                        )}
                        placeholder="admin@email.com"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-muted">
                        Password{' '}
                        {isAdding && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={cn(
                            'w-full rounded-xl border bg-admin-bg/50 px-4 py-3 text-sm font-bold text-admin-text transition-all focus:bg-admin-card focus:outline-hidden',
                            errors.password
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-admin-border focus:border-admin-accent',
                        )}
                        placeholder={
                            isAdding
                                ? 'Minimal 8 karakter'
                                : 'Kosongkan jika tidak ingin mengubah'
                        }
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-muted">
                        Konfirmasi Password{' '}
                        {isAdding && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        className={cn(
                            'w-full rounded-xl border bg-admin-bg/50 px-4 py-3 text-sm font-bold text-admin-text transition-all focus:bg-admin-card focus:outline-hidden',
                            errors.password_confirmation
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-admin-border focus:border-admin-accent',
                        )}
                        placeholder="Ulangi password"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-muted">
                        Role Pengguna <span className="text-red-500">*</span>
                    </label>
                    <AdminSelect
                        value={data.role_id}
                        onChange={(val) => setData('role_id', val)}
                        options={roles.map((r) => ({
                            value: r.id.toString(),
                            label: r.label,
                        }))}
                        placeholder="Pilih Role"
                    />
                    {errors.role_id && (
                        <p className="text-xs text-red-500">{errors.role_id}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-muted">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <AdminSelect
                        value={data.status}
                        onChange={(val) => setData('status', val as StatusType)}
                        options={STATUS_OPTIONS.map((s) => ({
                            value: s,
                            label: s,
                        }))}
                        placeholder="Pilih Status"
                    />
                    {errors.status && (
                        <p className="text-xs text-red-500">{errors.status}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-4 border-t border-admin-border pt-4">
                <button
                    type="button"
                    onClick={onReset}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                >
                    <RotateCcw size={16} /> {isAdding ? 'Batal' : 'Reset'}
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
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}
