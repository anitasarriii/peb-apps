import { AlertTriangle } from 'lucide-react';
import { UserItem } from '../types';

interface DeleteConfirmModalProps {
    showDeleteConfirm: number | null;
    setShowDeleteConfirm: (id: number | null) => void;
    users: UserItem[];
    onConfirm: (id: number) => void;
}

export default function DeleteConfirmModal({
    showDeleteConfirm,
    setShowDeleteConfirm,
    users,
    onConfirm,
}: DeleteConfirmModalProps) {
    if (!showDeleteConfirm) return null;

    const userToDelete = users.find((u) => u.id === showDeleteConfirm);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-3xl border border-admin-border bg-admin-card p-8 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-admin-text">
                            Konfirmasi Hapus
                        </h4>
                        <p className="text-[10px] text-admin-text-muted">
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
                <p className="mb-6 text-xs text-admin-text-muted">
                    Apakah Anda yakin ingin menghapus user{' '}
                    <strong className="text-admin-text">
                        {userToDelete?.name}
                    </strong>
                    ? Semua data terkait akan dihapus secara permanen.
                </p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 cursor-pointer rounded-2xl border border-admin-border px-4 py-3 text-xs font-bold text-admin-text transition-all hover:bg-admin-card-hover"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(showDeleteConfirm)}
                        className="flex-1 cursor-pointer rounded-2xl bg-red-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
