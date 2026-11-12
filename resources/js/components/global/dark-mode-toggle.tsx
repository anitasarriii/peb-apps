/**
 * DarkModeToggle — Tombol premium untuk beralih antara dark/light mode
 * Animasi: rotasi bintang (dark→light), orbit bulan (light→dark), ripple effect
 */

import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
    isDark: boolean;
    onToggle: () => void;
    className?: string;
}

export default function DarkModeToggle({
    isDark,
    onToggle,
    className,
}: DarkModeToggleProps) {
    return (
        <button
            id="dark-mode-toggle"
            onClick={onToggle}
            aria-label={isDark ? 'Mode Malam Hari' : 'Mode Siang Hari'}
            className={cn(
                // Track — pill background
                'group/toggle relative inline-flex h-8 w-[3.75rem] shrink-0 cursor-pointer items-center rounded-full',
                'transition-all duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 focus-visible:ring-offset-2',
                // Warna background track berdasarkan mode
                isDark
                    ? 'bg-[#0f2535] shadow-[inset_0_1px_4px_rgba(0,0,0,0.6),0_0_0_1px_#1E3A3F]'
                    : 'bg-[#dde8f5] shadow-[inset_0_1px_4px_rgba(0,0,0,0.08),0_0_0_1px_#c5d4e8]',
                className,
            )}
        >
            {/* ── Bintang-bintang dekoratif (hanya saat dark mode) ─────────── */}
            <span
                aria-hidden="true"
                className={cn(
                    'absolute inset-0 overflow-hidden rounded-full transition-opacity duration-500',
                    isDark ? 'opacity-100' : 'opacity-0',
                )}
            >
                {/* Bintang kecil — tersebar di trek */}
                <span
                    className="star"
                    style={{ top: '30%', left: '18%', width: 2, height: 2 }}
                />
                <span
                    className="star"
                    style={{
                        top: '60%',
                        left: '28%',
                        width: 1.5,
                        height: 1.5,
                        animationDelay: '0.4s',
                    }}
                />
                <span
                    className="star"
                    style={{
                        top: '22%',
                        left: '38%',
                        width: 1,
                        height: 1,
                        animationDelay: '0.8s',
                    }}
                />
            </span>

            {/* ── Awan dekoratif (hanya saat light mode) ───────────────────── */}
            <span
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute inset-0 overflow-hidden rounded-full transition-opacity duration-500',
                    isDark ? 'opacity-0' : 'opacity-100',
                )}
            >
                {/* Awan mini */}
                <span
                    className="cloud-dot"
                    style={{ top: '28%', left: '12%', width: 18, height: 9 }}
                />
                <span
                    className="cloud-dot"
                    style={{
                        top: '50%',
                        left: '26%',
                        width: 12,
                        height: 6,
                        animationDelay: '0.6s',
                        opacity: 0.5,
                    }}
                />
            </span>

            {/* ── Thumb (lingkaran yang bergeser) ──────────────────────────── */}
            <span
                aria-hidden="true"
                className={cn(
                    'absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full',
                    'transition-all duration-1500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                    // Posisi bergeser menggunakan transform (GPU-accelerated) untuk transisi yang sangat smooth
                    isDark
                        ? 'translate-x-[1.75rem] bg-[#1e3a5f] shadow-[0_0_12px_rgba(34,211,238,0.5),0_2px_8px_rgba(0,0,0,0.4)]'
                        : 'translate-x-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)]',
                )}
            >
                {/* Ikon Bulan — tampil saat dark mode */}
                <svg
                    viewBox="0 0 24 24"
                    className={cn(
                        'absolute h-3.5 w-3.5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                        isDark
                            ? 'scale-100 rotate-0 text-[#22D3EE] opacity-100'
                            : 'scale-50 -rotate-90 text-[#22D3EE] opacity-0',
                    )}
                    fill="currentColor"
                    aria-hidden="true"
                >
                    {/* Bulan sabit */}
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>

                {/* Ikon Matahari — tampil saat light mode */}
                <svg
                    viewBox="0 0 24 24"
                    className={cn(
                        'absolute h-3.5 w-3.5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                        isDark
                            ? 'scale-50 rotate-90 text-amber-400 opacity-0'
                            : 'scale-100 rotate-0 text-amber-400 opacity-100',
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    aria-hidden="true"
                >
                    {/* Lingkaran inti matahari */}
                    <circle cx="12" cy="12" r="4" />
                    {/* Sinar-sinar */}
                    <line x1="12" y1="2" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="22" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="2" y1="12" x2="4" y2="12" />
                    <line x1="20" y1="12" x2="22" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            </span>

            {/* ── Custom Premium Tooltip ─────────────────────────────────── */}
            <span
                className={cn(
                    'pointer-events-none absolute top-[calc(100%+12px)] left-1/2 z-50 -translate-x-1/2',
                    'rounded-xl border border-admin-border bg-admin-card px-2.5 py-1.5 text-[10px] font-bold whitespace-nowrap text-admin-text shadow-xl shadow-black/20',
                    'translate-y-1 scale-95 opacity-0 group-hover/toggle:translate-y-0 group-hover/toggle:scale-100 group-hover/toggle:opacity-100',
                    'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                    'flex items-center gap-1.5',
                )}
            >
                {/* Arrow */}
                <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-t border-l border-admin-border bg-admin-card" />
                <span className="relative z-10">
                    {isDark ? 'Mode Siang' : 'Mode Malam'}
                </span>
            </span>

            {/* ── Ripple burst saat klik (CSS-only via peer-checked trick diganti inline) */}
        </button>
    );
}
