import { Form, Head } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { cn } from '@/lib/utils';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk ke Akun" />

            {status && (
                <div className="mb-6 animate-pulse rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email Input Group */}
                            <div className="group grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-[11px] font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-400 dark:group-focus-within:text-cyan-400"
                                >
                                    Alamat Email
                                </Label>
                                <div className="relative">
                                    {/* Ambient Glow behind input */}
                                    <div
                                        className={cn(
                                            'absolute -inset-0.5 rounded-2xl opacity-0 blur-md transition duration-500',
                                            'bg-gradient-to-r from-cyan-500/30 to-blue-500/30',
                                            'group-focus-within:opacity-100 group-hover:opacity-40',
                                            errors.email &&
                                                'from-red-500/30 to-rose-500/30',
                                        )}
                                    />

                                    <div className="relative flex items-center">
                                        <Mail
                                            size={16}
                                            className="pointer-events-none absolute left-4 z-10 text-slate-400 transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-500 dark:group-focus-within:text-cyan-400"
                                        />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="nama@email.com"
                                            className={cn(
                                                'peer h-13 w-full rounded-2xl bg-slate-50/40 pl-11 dark:bg-[#070c14]/40',
                                                'border border-slate-200/80 dark:border-slate-800/80',
                                                'text-sm text-slate-900 transition-all duration-300 dark:text-white',
                                                'focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-500/10 dark:focus-visible:ring-cyan-400/10',
                                                errors.email &&
                                                    'border-red-500/80 focus-visible:border-red-500 focus-visible:ring-red-500/10',
                                            )}
                                        />
                                    </div>
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Input Group */}
                            <div className="group grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-[11px] font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-400 dark:group-focus-within:text-cyan-400"
                                    >
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-500 hover:underline hover:underline-offset-2 dark:text-cyan-400 dark:hover:text-cyan-300"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
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
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Masukkan kata sandi"
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

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center space-x-2.5 py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className={cn(
                                        'rounded-md border-slate-300 transition-all duration-300',
                                        'data-[state=checked]:border-cyan-600 data-[state=checked]:bg-cyan-600',
                                        'focus-visible:ring-cyan-500/30 dark:border-slate-800 dark:bg-slate-950/40',
                                        'dark:data-[state=checked]:border-cyan-500 dark:data-[state=checked]:bg-cyan-500',
                                    )}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-xs font-semibold text-slate-500 transition-colors select-none hover:text-slate-700 dark:text-slate-400/80 dark:hover:text-slate-200"
                                >
                                    Ingat saya di perangkat ini
                                </Label>
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
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner className="size-4 text-white" />
                                        <span>Memproses masuk...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span>Masuk ke Akun</span>
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </div>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Akun',
    description: 'Masukkan email dan kata sandi Anda.',
};
