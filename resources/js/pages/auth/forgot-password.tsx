import { Form, Head } from '@inertiajs/react';
import { Mail, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';
import { cn } from '@/lib/utils';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Kata Sandi" />

            {status && (
                <div className="mb-6 animate-pulse rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form action={email.url()} method="post">
                    {({ processing, errors }) => (
                        <>
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
                                            autoComplete="off"
                                            autoFocus
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

                            {/* Submit Button */}
                            <Button
                                className={cn(
                                    'group mt-6 h-13 w-full cursor-pointer rounded-2xl font-bold tracking-wide text-white transition-all duration-300',
                                    'bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-700 hover:via-cyan-700 hover:to-cyan-600',
                                    'dark:from-blue-600 dark:via-cyan-600 dark:to-cyan-500 dark:hover:from-blue-500 dark:hover:via-cyan-500 dark:hover:to-cyan-400',
                                    'shadow-[0_4px_20px_rgba(6,182,212,0.18)] hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(6,182,212,0.35)] active:scale-95',
                                    'disabled:cursor-not-allowed disabled:opacity-60',
                                )}
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner className="size-4 text-white" />
                                        <span>Mengirim tautan...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span>
                                            Kirim Tautan Pembuatan Ulang Kata
                                            Sandi
                                        </span>
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </div>
                                )}
                            </Button>
                        </>
                    )}
                </Form>

                {/* Back to Login Link */}
                <div className="border-t border-slate-100 pt-2 text-center text-xs leading-relaxed text-slate-500 dark:border-slate-900 dark:text-slate-400/70">
                    <span>Atau, kembali ke </span>
                    <TextLink
                        href={login()}
                        className="font-bold text-cyan-600 transition-colors hover:text-cyan-500 hover:underline hover:underline-offset-2 dark:text-cyan-400 dark:hover:text-cyan-300"
                    >
                        Halaman Masuk
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa Kata Sandi',
    description:
        'Masukkan alamat email Anda untuk menerima tautan pembuatan ulang kata sandi.',
};
