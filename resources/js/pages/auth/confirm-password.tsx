import { Form, Head } from '@inertiajs/react';
import { Lock, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import { cn } from '@/lib/utils';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
            >
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        {/* Password Input Group */}
                        <div className="group grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-400 dark:group-focus-within:text-cyan-400"
                            >
                                Kata Sandi
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
                                        placeholder="Masukkan kata sandi Anda"
                                        autoComplete="current-password"
                                        autoFocus
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

                        {/* Submit Button */}
                        <div className="flex items-center">
                            <Button
                                type="submit"
                                className={cn(
                                    'group h-13 w-full cursor-pointer rounded-2xl font-bold tracking-wide text-white transition-all duration-300',
                                    'bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-700 hover:via-cyan-700 hover:to-cyan-600',
                                    'dark:from-blue-600 dark:via-cyan-600 dark:to-cyan-500 dark:hover:from-blue-500 dark:hover:via-cyan-500 dark:hover:to-cyan-400',
                                    'shadow-[0_4px_20px_rgba(6,182,212,0.18)] hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(6,182,212,0.35)] active:scale-95',
                                    'disabled:cursor-not-allowed disabled:opacity-60',
                                )}
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner className="size-4 text-white" />
                                        <span>Mengonfirmasi...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span>Konfirmasi Kata Sandi</span>
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi Kata Sandi',
    description:
        'Ini adalah area aman aplikasi. Silakan konfirmasi kata sandi Anda sebelum melanjutkan.',
};
