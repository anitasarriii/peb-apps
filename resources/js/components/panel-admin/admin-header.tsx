import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    LayoutDashboard,
    Bell,
    Search,
    X,
    CheckCircle2,
    ShoppingCart,
    FileBarChart,
    Images,
    Users,
    AlertCircle,
    Info,
    ExternalLink,
    Check,
    Globe,
    Mail,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import DarkModeToggle from '@/components/global/dark-mode-toggle';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    isDark: boolean;
    onToggleDark: () => void;
}

// ── Tipe Notifikasi ───────────────────────────────────────────
type NotifType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const NOTIF_ICON: Record<NotifType, React.ReactNode> = {
    success: <CheckCircle2 size={15} />,
    info: <Info size={15} />,
    warning: <AlertCircle size={15} />,
    error: <AlertCircle size={15} />,
};

const NOTIF_STYLE: Record<NotifType, string> = {
    success: 'bg-emerald-500/10 text-emerald-400',
    info: 'bg-admin-accent/10 text-admin-accent',
    warning: 'bg-amber-500/10 text-amber-400',
    error: 'bg-red-500/10 text-red-400',
};

// ── Suggestion data untuk search ─────────────────────────────
const SEARCH_SUGGESTIONS = [
    {
        label: 'Hero Beranda',
        icon: <LayoutDashboard size={13} />,
        tab: 'Hero Beranda',
    },
    { label: 'Galeri Foto', icon: <Images size={13} />, tab: 'Galeri Foto' },
    {
        label: 'Daftar Pengadaan',
        icon: <ShoppingCart size={13} />,
        tab: 'Daftar Pengadaan',
    },
    { label: 'Laporan Keuangan', icon: <FileBarChart size={13} />, tab: 'Laporan Keuangan' },
    { label: 'Kontak Masuk', icon: <Mail size={13} />, tab: 'Kontak Masuk' },
    { label: 'Data User', icon: <Users size={13} />, tab: 'Data User' },
];

export default function AdminHeader({
    sidebarOpen,
    setSidebarOpen,
    isDark,
    onToggleDark,
}: AdminHeaderProps) {
    const { auth } = usePage().props as any;
    const isProcurementAdmin = auth?.user?.role?.name === 'admin_pengadaan';
    const searchSuggestions = SEARCH_SUGGESTIONS.filter(
        (suggestion) =>
            !isProcurementAdmin || suggestion.tab === 'Daftar Pengadaan',
    );
    const notifications =
        (usePage().props.notifications as Notification[]) || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredSuggestions = searchQuery.trim()
        ? searchSuggestions.filter((s) =>
              s.label.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : searchSuggestions;

    const showSuggestions = searchFocused && filteredSuggestions.length > 0;

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setSearchFocused(false);
            }
            if (
                notifRef.current &&
                !notifRef.current.contains(e.target as Node)
            ) {
                setNotifOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (tab: string) => {
        setSearchQuery('');
        setSearchFocused(false);
        const event = new CustomEvent('admin-navigate', { detail: tab });
        window.dispatchEvent(event);
    };

    const markAllRead = () => {
        router.post(
            '/settings/notifications/read-all',
            {},
            { preserveScroll: true },
        );
    };

    const markRead = (id: string) => {
        router.post(
            `/settings/notifications/${id}/read`,
            {},
            { preserveScroll: true },
        );
    };

    const deleteNotif = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.delete(`/settings/notifications/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AnimeReveal
            direction="down"
            delay={500}
            distance={100}
            className="relative z-50 shrink-0"
        >
            <header className="relative z-50 flex h-18 shrink-0 items-center justify-between gap-3 border-b border-admin-border/70 bg-admin-card/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
                {/* Left: Toggle + Search */}
                <div className="flex max-w-xl flex-1 items-center gap-4">
                    {/* Toggle sidebar (desktop) */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent p-2.5 text-admin-text-muted transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:border-admin-border hover:bg-admin-card-hover hover:text-admin-accent active:scale-95 md:flex"
                        title={sidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
                    >
                        <LayoutDashboard
                            size={22}
                            className={cn(
                                'transition-transform duration-500 ease-out',
                                sidebarOpen ? 'rotate-0' : 'rotate-180',
                            )}
                        />
                    </button>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent p-2.5 text-admin-text-muted transition-all duration-300 hover:scale-110 hover:border-admin-border hover:bg-admin-card-hover hover:text-admin-accent active:scale-95 md:hidden"
                    >
                        <LayoutDashboard size={22} />
                    </button>

                    {/* ── Search Bar ─────────────────────────────── */}
                    <div
                        ref={searchRef}
                        className="relative hidden flex-1 lg:flex"
                    >
                        <div
                            className={cn(
                                'flex w-full items-center gap-3 rounded-2xl border bg-admin-bg px-5 py-3 transition-all duration-300',
                                searchFocused
                                    ? 'border-admin-accent bg-admin-card shadow-lg shadow-admin-accent/10'
                                    : 'border-admin-border hover:border-admin-accent/40',
                            )}
                        >
                            <Search
                                size={16}
                                className={cn(
                                    'shrink-0 transition-colors duration-200',
                                    searchFocused
                                        ? 'text-admin-accent'
                                        : 'text-admin-text-muted',
                                )}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                placeholder="Cari modul, konten, atau pengaturan..."
                                className="w-full bg-transparent text-sm text-admin-text outline-none placeholder:text-admin-text-muted/60"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="shrink-0 cursor-pointer text-admin-text-muted transition-colors hover:text-admin-text"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            {/* Keyboard hint */}
                            {!searchFocused && !searchQuery && (
                                <div className="hidden shrink-0 items-center gap-1 xl:flex">
                                    <kbd className="rounded-md bg-admin-border px-1.5 py-0.5 text-[10px] font-bold text-admin-text-muted">
                                        ⌘
                                    </kbd>
                                    <kbd className="rounded-md bg-admin-border px-1.5 py-0.5 text-[10px] font-bold text-admin-text-muted">
                                        K
                                    </kbd>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Suggestions */}
                        {showSuggestions && (
                            <div
                                className={cn(
                                    'absolute top-[calc(100%+8px)] right-0 left-0 z-[99999]',
                                    'rounded-2xl border border-admin-border bg-admin-card shadow-2xl shadow-black/20',
                                    'overflow-hidden',
                                    'animate-in duration-200 fade-in-0 zoom-in-95',
                                )}
                            >
                                <div className="p-2">
                                    <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                        {searchQuery
                                            ? 'Hasil Pencarian'
                                            : 'Akses Cepat'}
                                    </p>
                                    {filteredSuggestions.map((s) => (
                                        <button
                                            key={s.tab}
                                            type="button"
                                            onClick={() =>
                                                handleSuggestionClick(s.tab)
                                            }
                                            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-admin-text-muted transition-all duration-150 hover:bg-admin-card-hover hover:text-admin-text"
                                        >
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-admin-bg text-admin-accent transition-colors group-hover:bg-admin-accent/10">
                                                {s.icon}
                                            </span>
                                            <span className="flex-1">
                                                {s.label}
                                            </span>
                                            <ExternalLink
                                                size={12}
                                                className="text-admin-text-muted opacity-0 transition-opacity group-hover:opacity-100"
                                            />
                                        </button>
                                    ))}
                                    {searchQuery &&
                                        filteredSuggestions.length === 0 && (
                                            <div className="px-3 py-6 text-center text-xs text-admin-text-muted">
                                                Tidak ada hasil untuk "
                                                <span className="font-bold text-admin-text">
                                                    {searchQuery}
                                                </span>
                                                "
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex shrink-0 items-center gap-2">
                    <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />

                    {/* ── Notification Bell ──────────────────────── */}
                    {!isProcurementAdmin && (
                        <div ref={notifRef} className="relative">
                            <button
                                onClick={() => setNotifOpen((prev) => !prev)}
                                className={cn(
                                    'relative flex size-11 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-200',
                                    notifOpen
                                        ? 'border-admin-accent/40 bg-admin-accent/10 text-admin-accent'
                                        : 'border-admin-border bg-admin-bg text-admin-text-muted hover:border-admin-accent/30 hover:bg-admin-card-hover hover:text-admin-text',
                                )}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span
                                        className={cn(
                                            'absolute -top-1 -right-1 flex items-center justify-center rounded-full border-2 border-admin-bg text-[9px] font-black text-white transition-all',
                                            unreadCount > 0
                                                ? 'size-5 bg-red-500'
                                                : 'hidden',
                                        )}
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Panel */}
                            {notifOpen && (
                                <div
                                    className={cn(
                                        'fixed top-24 right-4 left-4 z-[99999] md:absolute md:top-[calc(100%+10px)] md:right-0 md:left-auto',
                                        'mx-auto w-auto max-w-md rounded-[1.75rem] border border-admin-border bg-admin-card shadow-2xl shadow-black/30 md:mx-0 md:w-96 md:max-w-none',
                                        'origin-top-right animate-in duration-200 fade-in-0 zoom-in-95 slide-in-from-top-2',
                                    )}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-admin-border/50 px-5 pt-5 pb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-admin-text">
                                                Notifikasi
                                            </h3>
                                            <p className="mt-0.5 text-[10px] text-admin-text-muted">
                                                {unreadCount > 0
                                                    ? `${unreadCount} belum dibaca`
                                                    : 'Semua sudah dibaca'}
                                            </p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={markAllRead}
                                                className="flex cursor-pointer items-center gap-1.5 text-[10px] font-bold text-admin-accent transition-colors hover:text-admin-primary"
                                            >
                                                <Check size={11} /> Tandai semua
                                                dibaca
                                            </button>
                                        )}
                                    </div>

                                    {/* List */}
                                    <div className="custom-scrollbar max-h-80 overflow-y-auto py-2">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center gap-2 py-10">
                                                <Bell
                                                    size={28}
                                                    className="text-admin-text-muted/30"
                                                />
                                                <p className="text-xs text-admin-text-muted">
                                                    Tidak ada notifikasi
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() =>
                                                        markRead(notif.id)
                                                    }
                                                    className={cn(
                                                        'group relative flex cursor-pointer items-start gap-3 px-4 py-3 transition-all duration-150',
                                                        notif.read
                                                            ? 'hover:bg-admin-bg/50'
                                                            : 'bg-admin-accent/3 hover:bg-admin-accent/5',
                                                    )}
                                                >
                                                    {/* Unread dot */}
                                                    {!notif.read && (
                                                        <span className="absolute top-8 right-5 size-1.5 -translate-y-1/2 rounded-full bg-admin-accent shadow-[0_0_6px_rgba(0,164,185,0.8)]" />
                                                    )}

                                                    {/* Icon */}
                                                    <div
                                                        className={cn(
                                                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl',
                                                            NOTIF_STYLE[
                                                                notif.type
                                                            ],
                                                        )}
                                                    >
                                                        {NOTIF_ICON[notif.type]}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={cn(
                                                                'truncate text-xs font-bold',
                                                                notif.read
                                                                    ? 'text-admin-text-muted'
                                                                    : 'text-admin-text',
                                                            )}
                                                        >
                                                            {notif.title}
                                                        </p>
                                                        <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-admin-text-muted">
                                                            {notif.message}
                                                        </p>
                                                        <p className="mt-1 text-[9px] font-medium text-admin-text-muted/50">
                                                            {notif.time}
                                                        </p>
                                                    </div>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) =>
                                                            deleteNotif(
                                                                notif.id,
                                                                e,
                                                            )
                                                        }
                                                        className="mt-0.5 shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {notifications.length > 0 && (
                                        <div className="border-t border-admin-border/50 px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.delete(
                                                        '/settings/notifications',
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                className="w-full cursor-pointer text-center text-[10px] font-bold text-admin-text-muted transition-colors hover:text-red-400"
                                            >
                                                Hapus semua notifikasi
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {/* View Site */}
                    <Link
                        href="/"
                        className={cn(
                            'group/site relative flex size-11 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-200',
                            'border-admin-border bg-admin-bg text-admin-text-muted hover:border-admin-accent/30 hover:bg-admin-card-hover hover:text-admin-text active:scale-95',
                        )}
                    >
                        <Globe size={18} />

                        {/* Custom Premium Tooltip */}
                        <span
                            className={cn(
                                'pointer-events-none absolute top-[calc(100%+12px)] left-1/2 z-50 -translate-x-1/2',
                                'rounded-xl border border-admin-border bg-admin-card px-2.5 py-1.5 text-[10px] font-bold whitespace-nowrap text-admin-text shadow-xl shadow-black/20',
                                'translate-y-1 scale-95 opacity-0 group-hover/site:translate-y-0 group-hover/site:scale-100 group-hover/site:opacity-100',
                                'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                                'flex items-center gap-1.5',
                            )}
                        >
                            {/* Arrow */}
                            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-t border-l border-admin-border bg-admin-card" />
                            <span className="relative z-10">
                                Kunjungi Website
                            </span>
                        </span>
                    </Link>
                </div>
            </header>
        </AnimeReveal>
    );
}
