import PebLogo from '@/components/peb-logo';
import { Link, usePage } from '@inertiajs/react';
import type { AuthLayoutProps } from '@/types';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

export default function AuthPremiumLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh w-full overflow-x-hidden bg-slate-50 lg:grid-cols-2 dark:bg-[#04080f]">
            {/* ── SISI KIRI: Visualisasi Energi & Slogan (Desktop Only) ─────────── */}
            <div className="relative hidden h-full flex-col justify-between overflow-hidden border-r border-slate-900/60 bg-[#02050b] p-12 text-white lg:flex">
                {/* 1. Grid Pattern Overlay (Teknologi & Energi) */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />

                {/* 2. Glow Mesh Gradient (Efek Pendaran Cahaya Elektrik) */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute -top-28 -left-28 h-[30rem] w-[30rem] animate-pulse rounded-full bg-cyan-500/15 blur-[120px]"
                        style={{ animationDuration: '7s' }}
                    />
                    <div
                        className="absolute -right-28 -bottom-36 h-[35rem] w-[35rem] animate-pulse rounded-full bg-[#FFE600]/10 blur-[150px]"
                        style={{
                            animationDuration: '10s',
                            animationDelay: '1.5s',
                        }}
                    />
                    <div
                        className="absolute top-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-blue-600/10 blur-[130px]"
                        style={{
                            animationDuration: '9s',
                            animationDelay: '3s',
                        }}
                    />
                </div>

                {/* 3. Header Kiri (Logo Danantara & PEB) */}
                <div className="relative z-10">
                    <Link
                        href={home()}
                        className="group inline-flex items-center gap-4 transition-all"
                    >
                        <img
                            src="/assets/logo/danantara-logo-putih.svg"
                            alt="Danantara"
                            className="h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
                        />
                        <div className="h-5 w-px bg-white/20" />
                        <PebLogo
                            inverse
                            className="h-9 w-auto max-w-full object-contain transition-opacity duration-300 group-hover:opacity-90"
                        />
                    </Link>
                </div>

                {/* 4. Center Showcase: Copywriting Singkat */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
                    <div className="group relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]">
                        {/* Glow Efek Belakang */}
                        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-[#FFE600]/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
                            Energi Bagi Negeri
                        </div>

                        <h2 className="mt-5 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                            Pelayanan Energi Batam
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-slate-400/90">
                            Solusi energi terintegrasi dan andal untuk kemajuan Batam.
                        </p>
                    </div>
                </div>

                {/* 5. Footer Kiri */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-500/60">
                    <span>
                        © {new Date().getFullYear()} Pelayanan Energi Batam.
                    </span>
                    <span className="font-mono tracking-widest text-cyan-400/60 uppercase">
                        MENERANGI NEGERI
                    </span>
                </div>
            </div>

            {/* ── SISI KANAN: Form Autentikasi (Responsive & Desktop) ─────────── */}
            <div className="relative flex min-h-dvh flex-col justify-between p-6 sm:p-10 lg:p-16">
                {/* Glow Efek di Mobile */}
                <div className="absolute inset-0 z-0 lg:hidden">
                    <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-500/5" />
                    <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#FFE600]/5 blur-[120px]" />
                </div>

                {/* Mobile Header (Hanya muncul di < lg) */}
                <div className="relative z-10 flex w-full items-center justify-between lg:hidden">
                    <Link href={home()} className="flex items-center gap-3">
                        <img
                            src="/assets/logo/danantara-logo-hitam.svg"
                            alt="Danantara"
                            className="h-7 w-auto object-contain dark:hidden"
                        />
                        <img
                            src="/assets/logo/danantara-logo-putih.svg"
                            alt="Danantara"
                            className="hidden h-7 w-auto object-contain dark:block"
                        />
                        <div className="h-5 w-px bg-slate-300 dark:bg-slate-700" />
                        <PebLogo className="h-8 w-auto max-w-full object-contain dark:hidden" />
                        <PebLogo
                            inverse
                            className="hidden h-8 w-auto max-w-full object-contain dark:block"
                        />
                    </Link>
                </div>

                {/* Card Konten Autentikasi (Mewah & Glassmorphic) */}
                <div className="relative z-10 my-auto flex w-full justify-center">
                    <div className="w-full max-w-[430px]">
                        {/* Judul & Slogan Form */}
                        <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
                            <h1 className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-3xl font-black tracking-tight text-transparent dark:from-white dark:via-slate-200 dark:to-slate-400">
                                {title}
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400/70">
                                {description}
                            </p>
                        </div>

                        {/* Card Glassmorphic Premium */}
                        <div className="rounded-3xl border border-slate-200/50 bg-white/40 p-7 shadow-[0_20px_50px_rgba(8,112,184,0.06)] backdrop-blur-2xl sm:p-9 dark:border-slate-800/80 dark:bg-[#0c1422]/40 dark:shadow-none">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Footer Kanan */}
                <div className="relative z-10 mt-8 text-center text-xs text-slate-400/60 lg:text-left dark:text-slate-500/80">
                    <span>
                        © {new Date().getFullYear()} Pelayanan Energi Batam.
                        Seluruh Hak Cipta Dilindungi.
                    </span>
                </div>
            </div>
        </div>
    );
}
