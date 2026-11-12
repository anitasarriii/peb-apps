import { Form, Head } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';
import { cn } from '@/lib/utils';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Buat Ulang Kata Sandi" />

            <Form
                action={update.url()}
                method="post"
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        {/* Email Input (ReadOnly) */}
                        <div className="group grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500"
                            >
                                Alamat Email
                            </Label>
                            <div className="relative flex items-center">
                                <Mail
                                    size={16}
                                    className="pointer-events-none absolute left-4 z-10 text-slate-400/60 dark:text-slate-500/60"
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    className={cn(
                                        'peer h-13 w-full rounded-2xl bg-slate-100/50 pl-11 dark:bg-[#070c14]/20',
                                        'border border-slate-200/50 dark:border-slate-800/50',
                                        'cursor-not-allowed text-sm text-slate-500 transition-all duration-300 dark:text-slate-400',
                                    )}
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password Input Group */}
                        <div className="group grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-400 dark:group-focus-within:text-cyan-400"
                            >
                                Kata Sandi Baru
                            </Label>
                            <div className="relative">
                                {/* Ambient Glow behind input */}
                                <div
                                    className={cn(
                                        'absolute -inset-0.5 rounded-2xl opacity-0 blur-md transition duration-500',
                                        'bg-gradient-to-r from-cyan-500/30 to-blue-500/30',
                                        'group-focus-within:opacity-100 group-hover:opacity-40',
                                        errors.password &&
                                            'from-red-500/30 to-rose-500/30',
                                    )}
                                />

                                <div className="relative flex items-center">
                                    <Lock
                                        size={16}
                                        className="pointer-events-none absolute left-4 z-10 text-slate-400 transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-500 dark:group-focus-within:text-cyan-400"
                                    />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        autoComplete="new-password"
                                        autoFocus
                                        placeholder="Masukkan kata sandi baru"
                                        className={cn(
                                            'peer h-13 w-full rounded-2xl bg-slate-50/40 pr-10 pl-11 dark:bg-[#070c14]/40',
                                            'border border-slate-200/80 dark:border-slate-800/80',
                                            'text-sm text-slate-900 transition-all duration-300 dark:text-white',
                                            'focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-500/10 dark:focus-visible:ring-cyan-400/10',
                                            errors.password &&
                                                'border-red-500/80 focus-visible:border-red-500 focus-visible:ring-red-500/10',
                                        )}
                                    />
                                </div>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password Input Group */}
                        <div className="group grid gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-400 dark:group-focus-within:text-cyan-400"
                            >
                                Konfirmasi Kata Sandi
                            </Label>
                            <div className="relative">
                                {/* Ambient Glow behind input */}
                                <div
                                    className={cn(
                                        'absolute -inset-0.5 rounded-2xl opacity-0 blur-md transition duration-500',
                                        'bg-gradient-to-r from-cyan-500/30 to-blue-500/30',
                                        'group-focus-within:opacity-100 group-hover:opacity-40',
                                        errors.password_confirmation &&
                                            'from-red-500/30 to-rose-500/30',
                                    )}
                                />

                                <div className="relative flex items-center">
                                    <Lock
                                        size={16}
                                        className="pointer-events-none absolute left-4 z-10 text-slate-400 transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-500 dark:group-focus-within:text-cyan-400"
                                    />
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="Konfirmasi kata sandi"
                                        className={cn(
                                            'peer h-13 w-full rounded-2xl bg-slate-50/40 pr-10 pl-11 dark:bg-[#070c14]/40',
                                            'border border-slate-200/80 dark:border-slate-800/80',
                                            'text-sm text-slate-900 transition-all duration-300 dark:text-white',
                                            'focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-500/10 dark:focus-visible:ring-cyan-400/10',
                                            errors.password_confirmation &&
                                                'border-red-500/80 focus-visible:border-red-500 focus-visible:ring-red-500/10',
                                        )}
                                    />
                                </div>
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className={cn(
                                'group mt-2 h-13 w-full cursor-pointer rounded-2xl font-bold tracking-wide text-white transition-all duration-300',
                                'bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-700 hover:via-cyan-700 hover:to-cyan-600',
                                'dark:from-blue-600 dark:via-cyan-600 dark:to-cyan-500 dark:hover:from-blue-500 dark:hover:via-cyan-500 dark:hover:to-cyan-400',
                                'shadow-[0_4px_20px_rgba(6,182,212,0.18)] hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(6,182,212,0.35)] active:scale-95',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                            )}
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="size-4 text-white" />
                                    <span>Mengubah kata sandi...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                    <span>Ubah Kata Sandi</span>
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </div>
                            )}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Pembuatan Ulang Kata Sandi',
    description: 'Silakan masukkan kata sandi baru Anda di bawah ini.',
};
