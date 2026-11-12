import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader2,
    Info,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'loading' | 'info';

interface AdminToastProps {
    show: boolean;
    type?: ToastType;
    title?: string;
    message?: string;
    onClose?: () => void;
}

interface ToastInstance {
    id: string;
    type: ToastType;
    title: string;
    message: string;
    timestamp: number;
    isExiting?: boolean;
}

const VARIANTS: Record<
    ToastType,
    {
        icon: React.ReactNode;
        iconBg: string;
        iconColor: string;
        border: string;
        bar: string;
        defaultTitle: string;
    }
> = {
    success: {
        icon: <CheckCircle2 size={20} />,
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bar: 'bg-emerald-400/60',
        defaultTitle: 'Berhasil Disimpan!',
    },
    error: {
        icon: <XCircle size={20} />,
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-400',
        border: 'border-red-500/30',
        bar: 'bg-red-400/60',
        defaultTitle: 'Terjadi Kesalahan!',
    },
    warning: {
        icon: <AlertTriangle size={20} />,
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-400',
        border: 'border-amber-500/30',
        bar: 'bg-amber-400/60',
        defaultTitle: 'Perhatian!',
    },
    loading: {
        icon: <Loader2 size={20} className="animate-spin" />,
        iconBg: 'bg-admin-accent/10',
        iconColor: 'text-admin-accent',
        border: 'border-admin-accent/30',
        bar: 'bg-admin-accent/60',
        defaultTitle: 'Memproses...',
    },
    info: {
        icon: <Info size={20} />,
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
        border: 'border-blue-500/30',
        bar: 'bg-blue-400/60',
        defaultTitle: 'Informasi',
    },
};

// Queue helper untuk menampung toast secara global
let globalToastListeners: Array<(toasts: ToastInstance[]) => void> = [];
let globalToasts: ToastInstance[] = [];

const addGlobalToast = (toast: ToastInstance) => {
    // Hindari duplikasi pesan kembar beruntun dalam waktu singkat
    if (
        globalToasts.length > 0 &&
        globalToasts[0].type === toast.type &&
        Date.now() - globalToasts[0].timestamp < 800
    ) {
        return;
    }
    globalToasts = [toast, ...globalToasts].slice(0, 5); // Simpan maksimal 5 tumpukan terbaru
    globalToastListeners.forEach((l) => l(globalToasts));
};

const markToastExiting = (id: string) => {
    globalToasts = globalToasts.map((t) =>
        t.id === id ? { ...t, isExiting: true } : t,
    );
    globalToastListeners.forEach((l) => l(globalToasts));
};

const removeGlobalToast = (id: string) => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    globalToastListeners.forEach((l) => l(globalToasts));
};

export default function AdminToast({
    show,
    type = 'success',
    title,
    message = 'Perubahan telah diperbarui.',
    onClose,
}: AdminToastProps) {
    // Tambah tumpukan baru jika show bernilai true
    useEffect(() => {
        if (show) {
            const variant = VARIANTS[type];
            const resolvedTitle = title ?? variant.defaultTitle;
            const newId = Math.random().toString(36).substring(2, 9);
            const newToast: ToastInstance = {
                id: newId,
                type,
                title: resolvedTitle,
                message,
                timestamp: Date.now(),
            };

            addGlobalToast(newToast);

            // Trigger transisi exit (slide right) setelah 4 detik
            setTimeout(() => {
                markToastExiting(newId);
                // Beri waktu 500ms agar animasi slide-out selesai sebelum data dihapus sepenuhnya dari DOM
                setTimeout(() => {
                    removeGlobalToast(newId);
                    if (onClose) onClose();
                }, 500);
            }, 4000);
        }
    }, [show, type, title, message]);

    return null;
}

export function AdminToastHost() {
    const [toasts, setToasts] = useState<ToastInstance[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const listener = (newToasts: ToastInstance[]) => {
            setToasts([...newToasts]);
        };
        globalToastListeners.push(listener);
        setToasts([...globalToasts]);

        return () => {
            globalToastListeners = globalToastListeners.filter(
                (l) => l !== listener,
            );
        };
    }, []);

    const handleManualClose = (id: string) => {
        markToastExiting(id);
        setTimeout(() => {
            removeGlobalToast(id);
        }, 500);
    };

    if (toasts.length === 0) return null;

    return createPortal(
        <div
            className="pointer-events-none fixed right-8 bottom-8 z-[9999] flex flex-col items-end gap-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ minWidth: '340px' }}
        >
            {toasts.map((toast, index) => {
                const variant = VARIANTS[toast.type];

                // Kalkulasi transisi dan style stack
                const isFirst = index === 0;
                const offset = index * 8;
                const scale = 1 - index * 0.05;

                const hoverStyle = {
                    transform: toast.isExiting
                        ? 'translateX(120%)'
                        : 'translateX(0)',
                    opacity: toast.isExiting ? 0 : 1,
                    zIndex: 100 - index,
                    transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                };

                const stackedStyle = {
                    transform: toast.isExiting
                        ? 'translateX(120%)'
                        : `translateY(${offset}px) scale(${scale})`,
                    opacity: toast.isExiting
                        ? 0
                        : index > 2
                          ? 0
                          : 1 - index * 0.2,
                    zIndex: 100 - index,
                    position: isFirst ? 'relative' : ('absolute' as any),
                    bottom: 0,
                    transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                };

                const style = isHovered ? hoverStyle : stackedStyle;

                return (
                    <div
                        key={toast.id}
                        style={style}
                        className={cn(
                            'flex w-full max-w-sm items-center gap-3',
                            'border bg-admin-card',
                            variant.border,
                            'rounded-2xl p-4 pr-5 shadow-2xl shadow-black/25',
                            'pointer-events-auto select-none',
                            // Animasi muncul pertama kali (slide right to left)
                            'animate-slide-in-toast',
                        )}
                    >
                        {/* Icon */}
                        <div
                            className={cn(
                                'flex size-10 shrink-0 items-center justify-center rounded-xl',
                                variant.iconBg,
                                variant.iconColor,
                            )}
                        >
                            {variant.icon}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-admin-text">
                                {toast.title}
                            </h4>
                            <p className="mt-0.5 text-[10px] text-admin-text-muted">
                                {toast.message}
                            </p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleManualClose(toast.id);
                            }}
                            className="shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text"
                        >
                            <X size={14} />
                        </button>

                        {/* Progress bar di toast paling atas/terbaru */}
                        {isFirst &&
                            toast.type !== 'loading' &&
                            !toast.isExiting && (
                                <div className="absolute right-0 bottom-0 left-0 h-0.5 overflow-hidden rounded-b-2xl">
                                    <div
                                        className={cn(
                                            'animate-toast-progress h-full origin-left',
                                            variant.bar,
                                        )}
                                    />
                                </div>
                            )}
                    </div>
                );
            })}
        </div>,
        document.body,
    );
}
