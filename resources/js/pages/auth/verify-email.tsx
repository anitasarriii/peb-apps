import { Form, Head } from '@inertiajs/react';
import { Mail, LogOut } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { cn } from '@/lib/utils';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 animate-pulse rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang
                    Anda berikan saat pendaftaran.
                </div>
            )}

            <Form
                action={send.url()}
                method="post"
                className="flex flex-col gap-6 text-center"
            >
                {({ processing }) => (
                    <>
                        {/* Submit Button */}
                        <Button
                            disabled={processing}
                            type="submit"
                            className={cn(
                                'group h-13 w-full cursor-pointer rounded-2xl font-bold tracking-wide text-white transition-all duration-300',
                                'bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-700 hover:via-cyan-700 hover:to-cyan-600',
                                'dark:from-blue-600 dark:via-cyan-600 dark:to-cyan-500 dark:hover:from-blue-500 dark:hover:via-cyan-500 dark:hover:to-cyan-400',
                                'shadow-[0_4px_20px_rgba(6,182,212,0.18)] hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(6,182,212,0.35)] active:scale-95',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                            )}
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="size-4 text-white" />
                                    <span>Mengirim ulang...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                    <Mail size={16} />
                                    <span>Kirim Ulang Email Verifikasi</span>
                                </div>
                            )}
                        </Button>

                        {/* Logout Link */}
                        <div className="mt-2 flex justify-center border-t border-slate-100 pt-2 dark:border-slate-900">
                            <TextLink
                                href={logout()}
                                className="flex items-center gap-1.5 font-bold text-slate-500 transition-colors hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                            >
                                <LogOut size={14} />
                                <span>Keluar Akun</span>
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi Email',
    description:
        'Silakan verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan ke email Anda.',
};
