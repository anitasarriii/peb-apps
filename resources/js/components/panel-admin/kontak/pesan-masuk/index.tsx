import { router } from '@inertiajs/react';
import {
    CheckCheck,
    Clock,
    Inbox,
    Mail,
    MailOpen,
    Reply,
    Search,
    Trash2,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';

export interface ContactMessageItem {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface KontakMasukManagerProps {
    messages: ContactMessageItem[];
}

function formatMessageDate(isoDate: string): string {
    if (!isoDate) return '-';
    try {
        const d = new Date(isoDate);
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return isoDate;
    }
}

export default function KontakMasukManager({
    messages: initialMessages,
}: KontakMasukManagerProps) {
    const [messages, setMessages] = useState<ContactMessageItem[]>(
        initialMessages || [],
    );
    const [selectedId, setSelectedId] = useState<number | null>(
        initialMessages?.[0]?.id ?? null,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'read'>(
        'all',
    );
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setMessages(initialMessages || []);
        if (
            initialMessages?.length > 0 &&
            !initialMessages.some((m) => m.id === selectedId)
        ) {
            setSelectedId(initialMessages[0].id);
        }
    }, [initialMessages, selectedId]);

    const unreadCount = messages.filter((m) => !m.is_read).length;

    const filteredMessages = messages.filter((m) => {
        if (filterMode === 'unread' && m.is_read) return false;
        if (filterMode === 'read' && !m.is_read) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.subject.toLowerCase().includes(q) ||
            m.message.toLowerCase().includes(q)
        );
    });

    const selectedMessage =
        messages.find((m) => m.id === selectedId) ||
        filteredMessages[0] ||
        null;

    const handleSelectMessage = (msg: ContactMessageItem) => {
        setSelectedId(msg.id);
        setConfirmDeleteId(null);

        if (!msg.is_read) {
            setMessages((prev) =>
                prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)),
            );
            router.patch(
                `/panel-admin/kontak/pesan-masuk/${msg.id}/read`,
                { is_read: true },
                { preserveScroll: true, preserveState: true },
            );
        }
    };

    const handleToggleRead = (msg: ContactMessageItem) => {
        const nextState = !msg.is_read;
        setMessages((prev) =>
            prev.map((m) =>
                m.id === msg.id ? { ...m, is_read: nextState } : m,
            ),
        );
        router.patch(
            `/panel-admin/kontak/pesan-masuk/${msg.id}/read`,
            { is_read: nextState },
            { preserveScroll: true, preserveState: true },
        );
    };

    const handleMarkAllRead = () => {
        if (unreadCount === 0) return;
        setIsProcessing(true);
        setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
        router.post(
            '/panel-admin/kontak/pesan-masuk/read-all',
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    const handleDelete = (id: number) => {
        setIsProcessing(true);
        router.delete(`/panel-admin/kontak/pesan-masuk/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setMessages((prev) => prev.filter((m) => m.id !== id));
                setConfirmDeleteId(null);
                if (selectedId === id) {
                    const remaining = messages.filter((m) => m.id !== id);
                    setSelectedId(remaining[0]?.id ?? null);
                }
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <AnimeReveal delay={100} distance={20} direction="up">
                <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-admin-border bg-admin-card p-6 shadow-xl sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-admin-accent/10 text-admin-accent">
                            <Inbox size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-xl font-black text-admin-text">
                                    Kontak Masuk
                                </h2>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-admin-accent px-2.5 py-0.5 text-[11px] font-bold text-white">
                                        {unreadCount} Baru
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-admin-text-muted">
                                Semua pesan yang dikirim pengunjung melalui
                                formulir Hubungi Kami
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {(
                            [
                                { id: 'all', label: `Semua (${messages.length})` },
                                {
                                    id: 'unread',
                                    label: `Belum Dibaca (${unreadCount})`,
                                },
                                {
                                    id: 'read',
                                    label: `Sudah Dibaca (${messages.length - unreadCount})`,
                                },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setFilterMode(tab.id)}
                                className={cn(
                                    'cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-all',
                                    filterMode === tab.id
                                        ? 'bg-admin-accent text-white shadow-md shadow-admin-accent/20'
                                        : 'border border-admin-border bg-admin-bg/50 text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                disabled={isProcessing}
                                onClick={handleMarkAllRead}
                                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-500 transition-all hover:bg-emerald-500 hover:text-white disabled:opacity-50"
                            >
                                <CheckCheck size={14} />
                                Tandai Semua Dibaca
                            </button>
                        )}
                    </div>
                </div>
            </AnimeReveal>

            {/* Master-Detail Grid */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                {/* Left Column: Inbox List */}
                <div className="xl:col-span-5">
                    <AnimeReveal delay={150} distance={20} direction="up">
                        <div className="flex h-[650px] flex-col rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                            {/* Search Input */}
                            <div className="relative mb-4 shrink-0">
                                <Search
                                    size={15}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 text-admin-text-muted"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari pengirim, email, atau isi pesan..."
                                    className="w-full rounded-2xl border border-admin-border bg-admin-bg/60 py-3 pr-4 pl-10 text-xs font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                />
                            </div>

                            {/* Message Cards */}
                            <div className="custom-scrollbar flex-1 space-y-2.5 overflow-y-auto pr-1">
                                {filteredMessages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                                        <Inbox
                                            size={40}
                                            className="mb-3 text-admin-text-muted/30"
                                        />
                                        <p className="text-sm font-bold text-admin-text-muted">
                                            Belum ada pesan masuk
                                        </p>
                                        <p className="mt-1 max-w-[220px] text-xs text-admin-text-muted/70">
                                            Pesan dari pengunjung halaman Kontak
                                            akan muncul otomatis di sini.
                                        </p>
                                    </div>
                                ) : (
                                    filteredMessages.map((msg) => {
                                        const isActive =
                                            selectedMessage?.id === msg.id;
                                        return (
                                            <button
                                                key={msg.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectMessage(msg)
                                                }
                                                className={cn(
                                                    'w-full cursor-pointer rounded-2xl border p-4 text-left transition-all duration-200',
                                                    isActive
                                                        ? 'border-admin-accent bg-admin-accent/10 shadow-md shadow-admin-accent/5'
                                                        : msg.is_read
                                                          ? 'border-admin-border/70 bg-admin-bg/30 hover:bg-admin-bg/60'
                                                          : 'border-admin-accent/30 bg-admin-bg/70 hover:border-admin-accent/60',
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        {!msg.is_read && (
                                                            <span className="size-2 shrink-0 rounded-full bg-admin-accent shadow-[0_0_8px_rgba(0,164,185,0.8)]" />
                                                        )}
                                                        <span
                                                            className={cn(
                                                                'truncate text-xs',
                                                                msg.is_read
                                                                    ? 'font-semibold text-admin-text'
                                                                    : 'font-extrabold text-admin-text',
                                                            )}
                                                        >
                                                            {msg.name}
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0 text-[10px] font-medium text-admin-text-muted">
                                                        {formatMessageDate(
                                                            msg.created_at,
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mt-1.5 flex items-center gap-2">
                                                    <span className="inline-block max-w-full truncate rounded-md bg-admin-primary/10 px-2 py-0.5 text-[10px] font-bold text-admin-accent">
                                                        {msg.subject}
                                                    </span>
                                                </div>

                                                <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-admin-text-muted">
                                                    {msg.message}
                                                </p>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </AnimeReveal>
                </div>

                {/* Right Column: Message Detail */}
                <div className="xl:col-span-7">
                    <AnimeReveal delay={200} distance={20} direction="up">
                        <div className="flex h-[650px] flex-col rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-xl">
                            {!selectedMessage ? (
                                <div className="flex flex-1 flex-col items-center justify-center text-center">
                                    <MailOpen
                                        size={48}
                                        className="mb-3 text-admin-text-muted/30"
                                    />
                                    <p className="text-base font-bold text-admin-text">
                                        Pilih Pesan untuk Membaca Detail
                                    </p>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Klik salah satu pesan di panel sebelah
                                        kiri.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Top Sender Header */}
                                    <div className="flex flex-col justify-between gap-4 border-b border-admin-border pb-6 sm:flex-row sm:items-start">
                                        <div className="flex items-start gap-4">
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-admin-primary/15 text-base font-black text-admin-accent">
                                                {selectedMessage.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-extrabold text-admin-text">
                                                        {selectedMessage.name}
                                                    </h3>
                                                    <span
                                                        className={cn(
                                                            'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase',
                                                            selectedMessage.is_read
                                                                ? 'bg-slate-500/10 text-admin-text-muted'
                                                                : 'bg-admin-accent/15 text-admin-accent',
                                                        )}
                                                    >
                                                        {selectedMessage.is_read
                                                            ? 'Sudah Dibaca'
                                                            : 'Baru'}
                                                    </span>
                                                </div>
                                                <a
                                                    href={`mailto:${selectedMessage.email}`}
                                                    className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-admin-accent hover:underline"
                                                >
                                                    <Mail size={12} />
                                                    {selectedMessage.email}
                                                </a>
                                                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-admin-text-muted">
                                                    <Clock size={11} />
                                                    Diterima pada{' '}
                                                    {formatMessageDate(
                                                        selectedMessage.created_at,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleRead(
                                                        selectedMessage,
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-admin-border bg-admin-bg/50 px-3 py-2 text-xs font-bold text-admin-text transition-all hover:bg-admin-card-hover"
                                            >
                                                {selectedMessage.is_read ? (
                                                    <>
                                                        <Mail size={13} />
                                                        Tandai Belum Dibaca
                                                    </>
                                                ) : (
                                                    <>
                                                        <MailOpen size={13} />
                                                        Tandai Sudah Dibaca
                                                    </>
                                                )}
                                            </button>

                                            {confirmDeleteId ===
                                            selectedMessage.id ? (
                                                <div className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-2.5 py-1.5">
                                                    <span className="text-[11px] font-bold text-red-400">
                                                        Hapus?
                                                    </span>
                                                    <button
                                                        type="button"
                                                        disabled={isProcessing}
                                                        onClick={() =>
                                                            handleDelete(
                                                                selectedMessage.id,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-lg bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-red-600"
                                                    >
                                                        Ya
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setConfirmDeleteId(
                                                                null,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-lg px-2 py-1 text-[11px] font-bold text-admin-text-muted hover:text-admin-text"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setConfirmDeleteId(
                                                            selectedMessage.id,
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={13} />
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject Banner */}
                                    <div className="mt-5 rounded-2xl border border-admin-border/60 bg-admin-bg/50 px-5 py-3.5">
                                        <span className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                            Subjek / Perihal
                                        </span>
                                        <p className="mt-0.5 text-sm font-bold text-admin-text">
                                            {selectedMessage.subject}
                                        </p>
                                    </div>

                                    {/* Message Body */}
                                    <div className="custom-scrollbar mt-5 flex-1 overflow-y-auto rounded-2xl border border-admin-border/50 bg-admin-bg/30 p-6">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-admin-text">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {/* Bottom Reply CTA */}
                                    <div className="mt-5 flex items-center justify-between border-t border-admin-border pt-5">
                                        <span className="flex items-center gap-1.5 text-xs text-admin-text-muted">
                                            <User size={13} />
                                            Balasan akan diarahkan ke{' '}
                                            <strong className="text-admin-text">
                                                {selectedMessage.email}
                                            </strong>
                                        </span>
                                        <a
                                            href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                                            className="flex items-center gap-2 rounded-2xl bg-admin-primary px-6 py-3 text-xs font-bold text-white shadow-lg shadow-admin-primary/20 transition-all hover:bg-admin-accent active:scale-95"
                                        >
                                            <Reply size={15} />
                                            Balas via Email
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </AnimeReveal>
                </div>
            </div>
        </div>
    );
}

