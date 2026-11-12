import { useCmsSave } from '@/hooks/use-cms-save';
import { useRef, useState } from 'react';
import {
    LayoutTemplate,
    RotateCcw,
    Save,
    Eye,
    UploadCloud,
    CheckCircle2,
    Link as LinkIcon,
    Facebook,
    Globe,
    AtSign,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';
import { router } from '@inertiajs/react';
import { update as updateHeader } from '@/routes/panel-admin/header';

interface HeaderData {
    logo_kiri_src?: string;
    logo_kiri_source_type?: 'url' | 'upload';
    logo_kiri_file_name?: string;
    logo_kanan_src?: string;
    logo_kanan_source_type?: 'url' | 'upload';
    logo_kanan_file_name?: string;
}

interface HeaderEditorProps {
    header?: HeaderData;
}

export default function HeaderEditor({ header }: HeaderEditorProps) {
    // Logo Kiri (Danantara)
    const [logoKiriSrc, setLogoKiriSrc] = useState(
        header?.logo_kiri_src ?? '/assets/logo/danantara-logo.svg',
    );
    const [logoKiriSourceType, setLogoKiriSourceType] = useState<
        'url' | 'upload'
    >(header?.logo_kiri_source_type ?? 'url');
    const [logoKiriFileName, setLogoKiriFileName] = useState(
        header?.logo_kiri_file_name ?? '',
    );
    const [uploadingLogoKiri, setUploadingLogoKiri] = useState(false);
    const [logoKiriPreviewUrl, setLogoKiriPreviewUrl] = useState('');
    const logoKiriInputRef = useRef<HTMLInputElement>(null);
    const [logoKiriFile, setLogoKiriFile] = useState<File | null>(null);

    // Logo Kanan (PLN PEB)
    const [logoKananSrc, setLogoKananSrc] = useState(
        header?.logo_kanan_src ?? '/assets/logo/logo.png',
    );
    const [logoKananSourceType, setLogoKananSourceType] = useState<
        'url' | 'upload'
    >(header?.logo_kanan_source_type ?? 'url');
    const [logoKananFileName, setLogoKananFileName] = useState(
        header?.logo_kanan_file_name ?? '',
    );
    const [uploadingLogoKanan, setUploadingLogoKanan] = useState(false);
    const [logoKananPreviewUrl, setLogoKananPreviewUrl] = useState('');
    const logoKananInputRef = useRef<HTMLInputElement>(null);
    const [logoKananFile, setLogoKananFile] = useState<File | null>(null);

    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);

    // Handler Logo Kiri
    const handleLogoKiriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingLogoKiri(true);
        setLogoKiriFileName(file.name);
        setLogoKiriFile(file);

        if (logoKiriPreviewUrl) {
            URL.revokeObjectURL(logoKiriPreviewUrl);
        }
        const localUrl = URL.createObjectURL(file);
        setLogoKiriPreviewUrl(localUrl);
        setUploadingLogoKiri(false);
    };

    // Handler Logo Kanan
    const handleLogoKananChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingLogoKanan(true);
        setLogoKananFileName(file.name);
        setLogoKananFile(file);

        if (logoKananPreviewUrl) {
            URL.revokeObjectURL(logoKananPreviewUrl);
        }
        const localUrl = URL.createObjectURL(file);
        setLogoKananPreviewUrl(localUrl);
        setUploadingLogoKanan(false);
    };

    const handleReset = () => {
        setLogoKiriSrc('/assets/logo/danantara-logo.svg');
        setLogoKiriSourceType('url');
        setLogoKiriFileName('');
        setLogoKiriPreviewUrl('');
        setLogoKiriFile(null);

        setLogoKananSrc('/assets/logo/logo.png');
        setLogoKananSourceType('url');
        setLogoKananFileName('');
        setLogoKananPreviewUrl('');
        setLogoKananFile(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('logo_kiri_source_type', logoKiriSourceType);
        formData.append('logo_kiri_src', logoKiriSrc || '');
        formData.append('logo_kiri_file_name', logoKiriFileName || '');

        formData.append('logo_kanan_source_type', logoKananSourceType);
        formData.append('logo_kanan_src', logoKananSrc || '');
        formData.append('logo_kanan_file_name', logoKananFileName || '');

        if (logoKiriSourceType === 'upload' && logoKiriFile) {
            formData.append('logo_kiri_file', logoKiriFile);
        }

        if (logoKananSourceType === 'upload' && logoKananFile) {
            formData.append('logo_kanan_file', logoKananFile);
        }

        router.post(updateHeader.url(), formData as any, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('Save header failed:', err);
                const errorMsg = Object.values(err).join('\n');
                alert(
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
    };

    const displayLogoKiriUrl = logoKiriPreviewUrl || logoKiriSrc;
    const displayLogoKananUrl = logoKananPreviewUrl || logoKananSrc;

    const mockLinks = [
        'Beranda',
        'Tentang Kami',
        'Servis',
        'Kebijakan',
        'Galeri',
        'Berita & Acara',
        'Laporan',
    ];

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />
                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <LayoutTemplate size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-admin-text">
                                    Header & Navbar Logo
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola logo yang muncul di bagian atas
                                    (header) halaman landing page.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Logo Kiri (Danantara) */}
                            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-xs font-bold text-admin-text">
                                            Logo Kiri (Logo Kemitraan /
                                            Danantara)
                                        </label>
                                        <p className="text-[10px] text-admin-text-muted">
                                            Logo yang ditampilkan di pojok kiri
                                            atas navbar.
                                        </p>
                                    </div>
                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                                        {(['url', 'upload'] as const).map(
                                            (st) => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    onClick={() =>
                                                        setLogoKiriSourceType(
                                                            st,
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                        logoKiriSourceType ===
                                                            st
                                                            ? 'bg-admin-accent text-white shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    {st === 'url' ? (
                                                        <LinkIcon size={10} />
                                                    ) : (
                                                        <UploadCloud
                                                            size={10}
                                                        />
                                                    )}
                                                    {st === 'url'
                                                        ? 'URL'
                                                        : 'Unggah'}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                                {logoKiriSourceType === 'url' ? (
                                    <input
                                        type="text"
                                        value={logoKiriSrc}
                                        onChange={(e) => {
                                            setLogoKiriSrc(e.target.value);
                                            setLogoKiriPreviewUrl('');
                                        }}
                                        className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="/assets/logo/danantara-logo.svg"
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        <div
                                            onClick={() =>
                                                logoKiriInputRef.current?.click()
                                            }
                                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-5 transition-all hover:border-admin-accent/50"
                                        >
                                            <input
                                                ref={logoKiriInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoKiriChange}
                                                className="hidden"
                                            />
                                            {uploadingLogoKiri ? (
                                                <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                                    <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                    Memproses file...
                                                </div>
                                            ) : (
                                                <>
                                                    <UploadCloud
                                                        size={24}
                                                        className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                    />
                                                    <p className="text-xs font-bold text-admin-text">
                                                        Pilih file Logo Kiri
                                                        (PNG/SVG/WebP)
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        {logoKiriFileName &&
                                            !uploadingLogoKiri && (
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                    <CheckCircle2 size={12} />{' '}
                                                    File {logoKiriFileName}{' '}
                                                    berhasil dimuat
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>

                            {/* Logo Kanan (PLN PEB) */}
                            <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-xs font-bold text-admin-text">
                                            Logo Kanan (Logo Perusahaan / PLN
                                            PEB)
                                        </label>
                                        <p className="text-[10px] text-admin-text-muted">
                                            Logo utama instansi yang ditampilkan
                                            di pojok kanan atas navbar.
                                        </p>
                                    </div>
                                    <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                                        {(['url', 'upload'] as const).map(
                                            (st) => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    onClick={() =>
                                                        setLogoKananSourceType(
                                                            st,
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                        logoKananSourceType ===
                                                            st
                                                            ? 'bg-admin-accent text-white shadow-sm'
                                                            : 'text-admin-text-muted hover:text-admin-text',
                                                    )}
                                                >
                                                    {st === 'url' ? (
                                                        <LinkIcon size={10} />
                                                    ) : (
                                                        <UploadCloud
                                                            size={10}
                                                        />
                                                    )}
                                                    {st === 'url'
                                                        ? 'URL'
                                                        : 'Unggah'}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                                {logoKananSourceType === 'url' ? (
                                    <input
                                        type="text"
                                        value={logoKananSrc}
                                        onChange={(e) => {
                                            setLogoKananSrc(e.target.value);
                                            setLogoKananPreviewUrl('');
                                        }}
                                        className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                        placeholder="/assets/logo/logo.png"
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        <div
                                            onClick={() =>
                                                logoKananInputRef.current?.click()
                                            }
                                            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-5 transition-all hover:border-admin-accent/50"
                                        >
                                            <input
                                                ref={logoKananInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoKananChange}
                                                className="hidden"
                                            />
                                            {uploadingLogoKanan ? (
                                                <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                                    <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                    Memproses file...
                                                </div>
                                            ) : (
                                                <>
                                                    <UploadCloud
                                                        size={24}
                                                        className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                    />
                                                    <p className="text-xs font-bold text-admin-text">
                                                        Pilih file Logo Kanan
                                                        (PNG/SVG/WebP)
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        {logoKananFileName &&
                                            !uploadingLogoKanan && (
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                    <CheckCircle2 size={12} />{' '}
                                                    File {logoKananFileName}{' '}
                                                    berhasil dimuat
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-4 border-t border-admin-border pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                                >
                                    <RotateCcw size={16} /> Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-lg shadow-admin-primary/20 transition-all duration-300 active:scale-[0.98]',
                                        isSaving
                                            ? 'cursor-not-allowed bg-admin-primary/60'
                                            : 'bg-admin-primary hover:bg-admin-accent',
                                    )}
                                >
                                    {isSaving ? (
                                        <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {isSaving
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </AnimeReveal>
            </div>

            {/* Mockup Preview */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <div className="relative flex h-[350px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-[#051515] p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-white uppercase">
                                    Pratinjau Navbar
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                REAL-TIME
                            </span>
                        </div>

                        {/* Outer Header Mockup Area */}
                        <div className="relative flex flex-1 items-center justify-center rounded-2xl border border-white/5 bg-[#EDF5F6]/10 p-4">
                            {/* Navbar Mockup */}
                            <div className="relative flex w-full items-center justify-between rounded-full border border-white/10 bg-[#1a3a3a]/75 px-6 py-3.5 shadow-lg backdrop-blur-md">
                                {/* Left Logo */}
                                <div className="flex h-8 items-center">
                                    <img
                                        src={displayLogoKiriUrl}
                                        alt="Logo Kiri"
                                        className="h-7 w-auto"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://placehold.co/100x30/0d2e2e/ffffff?text=Logo+Kiri';
                                        }}
                                    />
                                </div>

                                {/* Spacer/Divider if needed, or simply justify-between */}
                                <div className="mx-4 h-px flex-1 border-t border-dashed border-white/10 bg-white/5" />

                                {/* Right Logo */}
                                <div className="flex h-10 items-center">
                                    <img
                                        src={displayLogoKananUrl}
                                        alt="Logo Kanan"
                                        className="h-8 w-auto"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://placehold.co/100x30/0d2e2e/ffffff?text=Logo+Kanan';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>MOCKUP PREVIEW</span>
                            <span>REAL-TIME SYNC</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            <AdminToast
                show={showToast}
                message="Konfigurasi logo header berhasil diperbarui."
            />
        </div>
    );
}
