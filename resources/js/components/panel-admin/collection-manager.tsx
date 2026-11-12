import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { index as adminIndex } from '@/routes/panel-admin';
import { update as saveNews } from '@/routes/panel-admin/berita/daftar-section';
import { update as saveGallery } from '@/routes/panel-admin/galeri/galeri-foto';
import { update as saveFinance } from '@/routes/panel-admin/laporan/keuangan-section';
import { update as saveAnnual } from '@/routes/panel-admin/laporan/tahunan-section';
import { update as savePortfolio } from '@/routes/panel-admin/portfolio/daftar-section';
import GaleriFotoEditor from './galeri/galeri-foto';
import BeritaPengumumanEditor from './laporan/berita-pengumuman';
import LaporanKeuanganEditor from './laporan/laporan-keuangan';
import LaporanTahunanEditor from './laporan/laporan-tahunan';
import DaftarPortfolioEditor from './portfolio/daftar-portfolio';

export type CollectionKind =
    | 'gallery'
    | 'finance'
    | 'annual'
    | 'news'
    | 'portfolio';
interface CollectionItem {
    id: string;
    title: string;
    [key: string]: unknown;
}
interface CollectionSection {
    section_title?: string;
    section_desc?: string;
    categories?: string[];
    items?: CollectionItem[];
    annual_reports?: CollectionItem[];
    keberlanjutan_items?: CollectionItem[];
    [key: string]: unknown;
}
const settings = {
    gallery: { title: 'Galeri Foto', tab: 'Galeri Foto', save: saveGallery },
    finance: {
        title: 'Laporan Keuangan',
        tab: 'Laporan Keuangan',
        save: saveFinance,
    },
    annual: {
        title: 'Laporan Tahunan',
        tab: 'Laporan Tahunan',
        save: saveAnnual,
    },
    news: { title: 'Daftar Berita', tab: 'Daftar Berita', save: saveNews },
    portfolio: {
        title: 'Daftar Portofolio',
        tab: 'Daftar Portfolio',
        save: savePortfolio,
    },
};

export default function CollectionManager(props: {
    kind: CollectionKind;
    section?: CollectionSection | null;
}) {
    const { url } = usePage();

    return <CollectionView key={`${props.kind}-${url}`} {...props} />;
}

function CollectionView({
    kind,
    section,
}: {
    kind: CollectionKind;
    section?: CollectionSection | null;
}) {
    const { url } = usePage();
    const params = new URL(url, 'http://localhost').searchParams;
    const config = settings[kind];
    const mode = params.get('mode');
    const [newRecordId] = useState(() => crypto.randomUUID());
    const recordId =
        params.get('record') || (mode === 'create' ? newRecordId : null);
    const collection =
        kind === 'annual'
            ? params.get('collection') === 'keberlanjutan_items'
                ? 'keberlanjutan_items'
                : 'annual_reports'
            : 'items';
    const records =
        (section?.[collection] as CollectionItem[] | undefined) ?? [];
    const selected = records.find((record) => String(record.id) === recordId);
    const isForm = mode === 'create' || mode === 'edit';
    const listUrl = adminIndex.url({ query: { tab: config.tab } });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const formUrl = (action: string, id: string, group = collection) =>
        adminIndex.url({
            query: {
                tab: config.tab,
                mode: action,
                record: id,
                collection: group,
            },
        });
    const allRows =
        kind === 'annual'
            ? [
                  ...(section?.annual_reports ?? []).map((item) => ({
                      item,
                      group: 'annual_reports',
                      label: 'Laporan Tahunan',
                  })),
                  ...(section?.keberlanjutan_items ?? []).map((item) => ({
                      item,
                      group: 'keberlanjutan_items',
                      label: 'Keberlanjutan',
                  })),
              ]
            : records.map((item) => ({
                  item,
                  group: 'items',
                  label: String(item.category || item.badge || 'Umum'),
              }));
    const filtered = allRows.filter(
        ({ item, label }) =>
            (!filter || label === filter) &&
            [item.title, item.subtitle, item.location, label].some((value) =>
                String(value ?? '')
                    .toLowerCase()
                    .includes(search.trim().toLowerCase()),
            ),
    );
    const pages = Math.max(1, Math.ceil(filtered.length / 10));
    const currentPage = Math.min(page, pages);
    const offset = (currentPage - 1) * 10;

    const deleteRecord = (id: string, group: string) => {
        if (!window.confirm('Hapus data ini?')) {
            return;
        }

        setBusy(true);
        setError('');
        router.post(
            config.save.url(),
            {
                ...section,
                section_title: section?.section_title || config.title,
                section_desc: section?.section_desc || config.title,
                categories: section?.categories ?? ['Umum'],
                ...(kind === 'annual'
                    ? {
                          annual_reports: section?.annual_reports ?? [],
                          keberlanjutan_items:
                              section?.keberlanjutan_items ?? [],
                      }
                    : {}),
                [group]: ((section?.[group] as CollectionItem[]) ?? []).filter(
                    (item) => String(item.id) !== id,
                ),
            } as Parameters<typeof router.post>[1],
            {
                preserveScroll: true,
                onError: (errors) => setError(Object.values(errors).join('\n')),
                onFinish: () => setBusy(false),
            },
        );
    };

    if (isForm) {
        if (!recordId || (mode === 'edit' && !selected)) {
            return (
                <div className="rounded-2xl border border-admin-border bg-admin-card p-6 text-admin-text">
                    Data tidak ditemukan.{' '}
                    <Link
                        href={listUrl}
                        className="text-admin-accent underline"
                    >
                        Kembali ke daftar
                    </Link>
                </div>
            );
        }

        const draft: CollectionItem = selected ?? {
            id: recordId,
            title: '',
            subtitle: '',
            category: section?.categories?.[0] ?? 'Umum',
            date: '',
            badge: '',
            imageSrc: '',
            imageSourceType: 'url',
            fileSourceType: 'url',
            location: '',
            description: '',
            client: '',
            efficiency: '',
            fileUrl: '',
            fileSize: '',
            gallery: [],
            poinUtamaList: [],
            dokumenList: [],
        };
        const formSection = {
            ...section,
            section_title: section?.section_title || config.title,
            section_desc: section?.section_desc || config.title,
            categories: section?.categories ?? ['Umum'],
            ...(kind === 'annual'
                ? {
                      annual_reports: section?.annual_reports ?? [],
                      keberlanjutan_items: section?.keberlanjutan_items ?? [],
                  }
                : {}),
            [collection]: selected ? records : [...records, draft],
        };
        const shared = { selectedId: recordId, recordMode: true };

        return (
            <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-admin-text">
                        {mode === 'create' ? 'Tambah' : 'Edit'} {config.title}
                    </h2>
                    <Link
                        href={listUrl}
                        className="inline-flex items-center gap-2 rounded-xl border border-admin-border px-4 py-3 text-sm text-admin-text"
                    >
                        <ArrowLeft size={16} /> Kembali ke daftar
                    </Link>
                </div>
                {kind === 'gallery' && (
                    <GaleriFotoEditor
                        {...shared}
                        galeriFotoSection={
                            formSection as unknown as NonNullable<
                                ComponentProps<typeof GaleriFotoEditor>
                            >['galeriFotoSection']
                        }
                    />
                )}
                {kind === 'finance' && (
                    <LaporanKeuanganEditor
                        {...shared}
                        laporanKeuanganSection={
                            formSection as unknown as NonNullable<
                                ComponentProps<typeof LaporanKeuanganEditor>
                            >['laporanKeuanganSection']
                        }
                    />
                )}
                {kind === 'annual' && (
                    <LaporanTahunanEditor
                        {...shared}
                        selectedCollection={collection}
                        laporanTahunanSection={
                            formSection as unknown as NonNullable<
                                ComponentProps<typeof LaporanTahunanEditor>
                            >['laporanTahunanSection']
                        }
                    />
                )}
                {kind === 'news' && (
                    <BeritaPengumumanEditor
                        {...shared}
                        beritaSection={
                            formSection as unknown as NonNullable<
                                ComponentProps<typeof BeritaPengumumanEditor>
                            >['beritaSection']
                        }
                    />
                )}
                {kind === 'portfolio' && (
                    <DaftarPortfolioEditor
                        {...shared}
                        daftarPortfolioSection={
                            formSection as unknown as NonNullable<
                                ComponentProps<typeof DaftarPortfolioEditor>
                            >['daftarPortfolioSection']
                        }
                    />
                )}
            </div>
        );
    }

    return (
        <section
            aria-label={config.title}
            className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border p-5">
                <div>
                    <h2 className="text-xl font-bold text-admin-text">
                        {config.title}
                    </h2>
                    <p className="mt-1 text-sm text-admin-text-muted">
                        Kelola data {config.title.toLowerCase()} perusahaan.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {kind === 'annual' && (
                        <Link
                            href={formUrl('create', '', 'keberlanjutan_items')}
                            className="rounded-xl border border-admin-border px-4 py-3 text-sm font-semibold text-admin-text"
                        >
                            Tambah Keberlanjutan
                        </Link>
                    )}
                    <Link
                        href={formUrl(
                            'create',
                            '',
                            kind === 'annual' ? 'annual_reports' : 'items',
                        )}
                        className="inline-flex items-center gap-2 rounded-xl bg-admin-primary px-4 py-3 text-sm font-semibold text-white"
                    >
                        <Plus size={17} /> Tambah {config.title}
                    </Link>
                </div>
            </div>
            {error && (
                <p
                    role="alert"
                    className="p-4 text-sm whitespace-pre-line text-red-500"
                >
                    {error}
                </p>
            )}
            <div className="flex flex-col gap-3 border-b border-admin-border p-4 sm:flex-row">
                <label className="flex flex-1 items-center gap-2 rounded-xl border border-admin-border bg-admin-bg px-4 py-3">
                    <Search size={18} className="text-admin-text-muted" />
                    <input
                        aria-label={`Cari ${config.title}`}
                        placeholder="Cari judul, kategori, atau informasi..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        className="w-full bg-transparent text-sm text-admin-text outline-none"
                    />
                </label>
                <select
                    aria-label="Filter kategori"
                    value={filter}
                    onChange={(event) => {
                        setFilter(event.target.value);
                        setPage(1);
                    }}
                    className="rounded-xl border border-admin-border bg-admin-bg px-4 py-3 text-sm text-admin-text"
                >
                    <option value="">Semua kategori</option>
                    {[...new Set(allRows.map(({ label }) => label))].map(
                        (label) => (
                            <option key={label}>{label}</option>
                        ),
                    )}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                    <thead className="border-b border-admin-border bg-admin-bg/60 text-admin-text-muted">
                        <tr>
                            {[
                                'No.',
                                config.title,
                                'Kategori / Jenis',
                                'Tanggal / Informasi',
                                'Aksi',
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    scope="col"
                                    className="px-4 py-4 font-medium"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {filtered
                            .slice(offset, offset + 10)
                            .map(({ item, group, label }, index) => (
                                <tr
                                    key={`${group}-${item.id}`}
                                    className="even:bg-admin-bg/40"
                                >
                                    <td className="px-4 py-5 text-admin-text-muted">
                                        {offset + index + 1}
                                    </td>
                                    <td className="max-w-md px-4 py-5">
                                        <p className="font-semibold break-words text-admin-text">
                                            {item.title || 'Tanpa judul'}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-admin-text-muted">
                                            {String(
                                                item.location ||
                                                    item.subtitle ||
                                                    item.client ||
                                                    '',
                                            )}
                                        </p>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className="rounded-lg border border-admin-accent/30 bg-admin-accent/10 px-2 py-1 text-xs text-admin-accent">
                                            {label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-admin-text-muted">
                                        {String(
                                            item.date || item.fileSize || '—',
                                        )}
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex gap-2">
                                            <Link
                                                aria-label={`Edit ${item.title}`}
                                                href={formUrl(
                                                    'edit',
                                                    String(item.id),
                                                    group,
                                                )}
                                                className="rounded-lg border border-admin-border p-2 text-admin-text-muted hover:text-admin-accent"
                                            >
                                                <Pencil size={17} />
                                            </Link>
                                            <button
                                                type="button"
                                                aria-label={`Hapus ${item.title}`}
                                                disabled={busy}
                                                onClick={() =>
                                                    deleteRecord(
                                                        String(item.id),
                                                        group,
                                                    )
                                                }
                                                className="rounded-lg border border-admin-border p-2 text-admin-text-muted hover:text-red-500 disabled:opacity-40"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        {!filtered.length && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-12 text-center text-admin-text-muted"
                                >
                                    {search || filter
                                        ? 'Tidak ada data yang sesuai pencarian.'
                                        : 'Belum ada data. Klik tombol Tambah untuk membuat data baru.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border p-4 text-sm text-admin-text-muted">
                <span>
                    {filtered.length
                        ? `${offset + 1}–${Math.min(offset + 10, filtered.length)}`
                        : '0'}{' '}
                    dari {filtered.length} data
                </span>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setPage(currentPage - 1)}
                        className="rounded-lg border border-admin-border px-3 py-2 disabled:opacity-40"
                    >
                        Sebelumnya
                    </button>
                    <span>
                        {currentPage} / {pages}
                    </span>
                    <button
                        type="button"
                        disabled={currentPage === pages}
                        onClick={() => setPage(currentPage + 1)}
                        className="rounded-lg border border-admin-border px-3 py-2 disabled:opacity-40"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        </section>
    );
}
