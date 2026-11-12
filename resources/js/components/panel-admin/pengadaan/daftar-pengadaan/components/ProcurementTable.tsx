import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { STATUS_STYLE } from '../types';
import type { PengadaanItem } from '../types';

interface ProcurementTableProps {
    items: PengadaanItem[];
    onAdd: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    disabled: boolean;
}

export default function ProcurementTable({
    items,
    onAdd,
    onEdit,
    onDelete,
    disabled,
}: ProcurementTableProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const filtered = items.filter((item) => {
        const matchesSearch = [item.title, item.category, item.location]
            .join(' ')
            .toLowerCase()
            .includes(search.trim().toLowerCase());
        const matchesStatus =
            status === 'all' ||
            (status === 'archive'
                ? item.isArchived
                : !item.isArchived && item.status === status);

        return matchesSearch && matchesStatus;
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
    const currentPage = Math.min(page, totalPages);
    const offset = (currentPage - 1) * 10;

    return (
        <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border p-5">
                <div>
                    <h3 className="text-lg font-semibold text-admin-text">
                        Daftar Pengadaan
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-admin-text-muted">
                        Kelola pengadaan dan arsip pengumuman perusahaan.
                    </p>
                </div>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={onAdd}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-admin-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-admin-accent disabled:opacity-50"
                >
                    <Plus size={15} /> Tambah Daftar
                </button>
            </div>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-admin-border bg-admin-bg px-3 py-2.5">
                    <Search
                        size={16}
                        className="shrink-0 text-admin-text-muted"
                    />
                    <input
                        aria-label="Cari daftar pengadaan"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Cari judul, kategori, atau lokasi..."
                        className="w-full bg-transparent text-xs text-admin-text outline-none"
                    />
                </label>
                <select
                    aria-label="Filter status pengadaan"
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value);
                        setPage(1);
                    }}
                    className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2.5 text-xs text-admin-text sm:w-44"
                >
                    <option value="all">Semua status</option>
                    <option value="TERBUKA">Terbuka</option>
                    <option value="SELEKSI">Seleksi</option>
                    <option value="TUTUP">Ditutup</option>
                    <option value="archive">Arsip</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                    <thead className="border-y border-admin-border bg-admin-bg/60 text-admin-text-muted">
                        <tr>
                            {[
                                'No.',
                                'Pengadaan',
                                'Status',
                                'Tanggal / Mulai',
                                'Selesai',
                                'Aksi',
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    scope="col"
                                    className="px-4 py-3 font-medium"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {filtered
                            .slice(offset, offset + 10)
                            .map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-admin-bg/50"
                                >
                                    <td className="px-4 py-4 text-admin-text-muted">
                                        {offset + index + 1}
                                    </td>
                                    <td className="max-w-md px-4 py-4">
                                        <button
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => onEdit(item.id)}
                                            className="text-left text-sm leading-5 font-medium text-admin-text hover:text-admin-accent"
                                        >
                                            {item.title}
                                        </button>
                                        <p className="mt-1 text-[11px] text-admin-text-muted">
                                            {item.category} · {item.location}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={cn(
                                                'inline-flex rounded-md border px-2 py-1 text-[10px] font-medium whitespace-nowrap',
                                                STATUS_STYLE[item.status],
                                            )}
                                        >
                                            {item.isArchived
                                                ? 'ARSIP'
                                                : item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-admin-text-muted">
                                        {item.startDate || '—'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-admin-text-muted">
                                        {item.isArchived
                                            ? '—'
                                            : item.endDate || '—'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                disabled={disabled}
                                                aria-label={`Edit ${item.title}`}
                                                title="Edit"
                                                onClick={() => onEdit(item.id)}
                                                className="rounded-lg border border-admin-border p-2 text-admin-text-muted hover:border-admin-accent hover:text-admin-accent disabled:opacity-50"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={disabled}
                                                aria-label={`Hapus ${item.title}`}
                                                title="Hapus"
                                                onClick={() =>
                                                    onDelete(item.id)
                                                }
                                                className="rounded-lg border border-admin-border p-2 text-admin-text-muted hover:border-red-400 hover:text-red-400 disabled:opacity-30"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-12 text-center text-admin-text-muted"
                                >
                                    Tidak ada pengadaan yang sesuai dengan
                                    pencarian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border px-4 py-3 text-xs text-admin-text-muted">
                <p>
                    {filtered.length ? offset + 1 : 0}–
                    {Math.min(offset + 10, filtered.length)} dari{' '}
                    {filtered.length} pengadaan
                </p>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-admin-border px-3 py-2 hover:text-admin-text disabled:opacity-30"
                    >
                        Sebelumnya
                    </button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-admin-border px-3 py-2 hover:text-admin-text disabled:opacity-30"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        </section>
    );
}
