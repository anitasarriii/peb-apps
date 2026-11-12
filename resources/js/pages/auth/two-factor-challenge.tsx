import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Lock, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';
import { cn } from '@/lib/utils';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Kode Pemulihan (Recovery)',
                description:
                    'Silakan konfirmasi akses ke akun Anda dengan memasukkan salah satu kode pemulihan darurat Anda.',
                toggleText: 'Masuk menggunakan kode otentikasi (OTP)',
            };
        }

        return {
            title: 'Kode Otentikasi (OTP)',
            description:
                'Masukkan kode otentikasi yang disediakan oleh aplikasi otentikator (Google Authenticator / dsb) Anda.',
            toggleText: 'Masuk menggunakan kode pemulihan (recovery)',
        };
    }, [showRecoveryInput]);

    setLayoutProps({
        title: authConfigContent.title,
        description: authConfigContent.description,
    });

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title="Otentikasi Dua Faktor" />

            <div className="space-y-6">
                <Form
                    action={store.url()}
                    method="post"
                    className="space-y-5"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div className="group grid gap-2">
                                    <Label
                                        htmlFor="recovery_code"
                                        className="text-[11px] font-bold tracking-widest text-slate-500 uppercase transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-400 dark:group-focus-within:text-cyan-400"
                                    >
                                        Kode Pemulihan
                                    </Label>
                                    <div className="relative">
                                        {/* Ambient Glow */}
                                        <div
                                            className={cn(
                                                'absolute -inset-0.5 rounded-2xl opacity-0 blur-md transition duration-500',
                                                'bg-gradient-to-r from-cyan-500/30 to-blue-500/30',
                                                'group-focus-within:opacity-100 group-hover:opacity-40',
                                                errors.recovery_code &&
                                                    'from-red-500/30 to-rose-500/30',
                                            )}
                                        />

                                        <div className="relative flex items-center">
                                            <Lock
                                                size={16}
                                                className="pointer-events-none absolute left-4 z-10 text-slate-400 transition-colors duration-300 group-focus-within:text-cyan-500 dark:text-slate-500 dark:group-focus-within:text-cyan-400"
                                            />
                                            <Input
                                                id="recovery_code"
                                                name="recovery_code"
                                                type="text"
                                                placeholder="Masukkan kode pemulihan"
                                                autoFocus={showRecoveryInput}
                                                required
                                                className={cn(
                                                    'peer h-13 w-full rounded-2xl bg-slate-50/40 pl-11 dark:bg-[#070c14]/40',
                                                    'border border-slate-200/80 dark:border-slate-800/80',
                                                    'text-sm text-slate-900 transition-all duration-300 dark:text-white',
                                                    'focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-500/10 dark:focus-visible:ring-cyan-400/10',
                                                    errors.recovery_code &&
                                                        'border-red-500/80 focus-visible:border-red-500 focus-visible:ring-red-500/10',
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <InputError
                                        message={errors.recovery_code}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                    <div className="flex w-full items-center justify-center py-2">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            autoFocus
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className={cn(
                                                                'h-14 w-11 rounded-xl border border-slate-200/80 bg-slate-50/40 text-base font-black dark:border-slate-800/80 dark:bg-[#070c14]/40',
                                                                'transition-all duration-300 focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/30 dark:focus-visible:border-cyan-400 dark:focus-visible:ring-cyan-400/30',
                                                            )}
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className={cn(
                                    'group mt-4 h-13 w-full cursor-pointer rounded-2xl font-bold tracking-wide text-white transition-all duration-300',
                                    'bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-700 hover:via-cyan-700 hover:to-cyan-600',
                                    'dark:from-blue-600 dark:via-cyan-600 dark:to-cyan-500 dark:hover:from-blue-500 dark:hover:via-cyan-500 dark:hover:to-cyan-400',
                                    'shadow-[0_4px_20px_rgba(6,182,212,0.18)] hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(6,182,212,0.35)] active:scale-95',
                                    'disabled:cursor-not-allowed disabled:opacity-60',
                                )}
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner className="size-4 text-white" />
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span>Lanjutkan</span>
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </div>
                                )}
                            </Button>

                            {/* Toggle Recovery Mode Button */}
                            <div className="border-t border-slate-100 pt-4 text-center text-xs leading-relaxed text-slate-500 dark:border-slate-900 dark:text-slate-400/70">
                                <span>Atau, Anda dapat </span>
                                <button
                                    type="button"
                                    className="cursor-pointer font-bold text-cyan-600 transition-colors hover:text-cyan-500 hover:underline hover:underline-offset-2 dark:text-cyan-400 dark:hover:text-cyan-300"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
