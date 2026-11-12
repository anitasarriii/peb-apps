import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, RotateCcw, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordChangeFormProps {
    onSuccessToast: (message: string) => void;
    onErrorToast: (message: string) => void;
}

export default function PasswordChangeForm({
    onSuccessToast,
    onErrorToast,
}: PasswordChangeFormProps) {
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    const { data, setData, put, processing, reset, errors } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleReset = () => {
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi frontend sebelum dikirim
        if (data.password !== data.password_confirmation) {
            onErrorToast('Konfirmasi password tidak cocok.');
            return;
        }

        if (data.password.length < 8) {
            onErrorToast('Password baru minimal harus 8 karakter.');
            return;
        }

        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                onSuccessToast('Password berhasil diperbarui.');
                reset();
            },
            onError: (errs) => {
                const firstError = Object.values(errs)[0];
                onErrorToast(
                    typeof firstError === 'string'
                        ? firstError
                        : 'Gagal memperbarui password.',
                );
            },
        });
    };

    // Syarat kekuatan password sederhana
    const hasMinLength = data.password.length >= 8;
    const hasUppercase = /[A-Z]/.test(data.password);
    const hasLowercase = /[a-z]/.test(data.password);
    const hasNumberOrSymbol = /[\d\W]/.test(data.password);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
                {/* Password Saat Ini */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Password Saat Ini
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPw ? 'text' : 'password'}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            className={cn(
                                'w-full rounded-2xl border bg-admin-bg/50 px-5 py-4 pr-12 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent',
                                errors.current_password
                                    ? 'border-rose-500'
                                    : 'border-admin-border',
                            )}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-admin-text-muted transition-colors hover:text-admin-text"
                        >
                            {showCurrentPw ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>
                    {errors.current_password && (
                        <p className="text-xs font-semibold text-rose-500">
                            {errors.current_password}
                        </p>
                    )}
                </div>

                {/* Password Baru */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Password Baru
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPw ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={cn(
                                'w-full rounded-2xl border bg-admin-bg/50 px-5 py-4 pr-12 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent',
                                errors.password
                                    ? 'border-rose-500'
                                    : 'border-admin-border',
                            )}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPw(!showNewPw)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-admin-text-muted transition-colors hover:text-admin-text"
                        >
                            {showNewPw ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs font-semibold text-rose-500">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Konfirmasi Password Baru */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPw ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            className={cn(
                                'w-full rounded-2xl border bg-admin-bg/50 px-5 py-4 pr-12 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent',
                                errors.password_confirmation
                                    ? 'border-rose-500'
                                    : 'border-admin-border',
                            )}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPw(!showConfirmPw)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-admin-text-muted transition-colors hover:text-admin-text"
                        >
                            {showConfirmPw ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-xs font-semibold text-rose-500">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* Kriteria Password */}
                <div className="space-y-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg/30 p-4">
                    <p className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                        Syarat Password
                    </p>
                    {[
                        { text: 'Minimal 8 karakter', valid: hasMinLength },
                        {
                            text: 'Mengandung huruf besar dan kecil',
                            valid: hasUppercase && hasLowercase,
                        },
                        {
                            text: 'Mengandung angka atau simbol',
                            valid: hasNumberOrSymbol,
                        },
                    ].map((req) => (
                        <div key={req.text} className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'size-1.5 rounded-full transition-colors duration-300',
                                    req.valid
                                        ? 'bg-emerald-400'
                                        : 'bg-admin-text-muted/30',
                                )}
                            />
                            <p className="text-[10px] text-admin-text-muted">
                                {req.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 border-t border-admin-border pt-4">
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={processing}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95 disabled:opacity-50"
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
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}
