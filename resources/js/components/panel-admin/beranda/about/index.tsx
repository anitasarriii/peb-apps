import { useCmsSave } from '@/hooks/use-cms-save';
import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Layout,
    ImageIcon,
    Percent,
    Sparkles,
    FileText,
    RotateCcw,
    Save,
    Eye,
} from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updateAbout } from '@/routes/panel-admin/beranda/about-section';
import InfoTab from './info-tab';
import MediaTab from './media-tab';
import StatTab from './stat-tab';
import PreviewPanel from './preview-panel';

interface StatCardData {
    label: string;
    value: string;
    description: string;
}

interface AboutSectionProps {
    aboutSection?: {
        title: string;
        subtitle: string;
        slogan_text: string | null;
        media_type: 'video' | 'image';
        media_source_type: 'url' | 'upload';
        media_url: string | null;
        media_file_name: string | null;
        efisiensi: StatCardData;
        inovatif: StatCardData;
    } | null;
}

export default function AboutSectionEditor({
    aboutSection,
}: AboutSectionProps) {
    const [title, setTitle] = useState(
        aboutSection?.title ?? 'PT Pelayanan Energi Batam',
    );
    const [subtitle, setSubtitle] = useState(
        aboutSection?.subtitle ?? 'Energi Bagi Negeri',
    );
    const [sloganText, setSloganText] = useState(
        aboutSection?.slogan_text ??
            'ENERGI BAGI NEGERI (ENERGY FOR THE COUNTRY) merupakan slogan dalam menyampaikan gagasan positif tentang Visi dan Misi PT Pelayanan Energi Batam. Tonton video ini untuk menjelajahi nilai berkelanjutan dari Produk & Inovasi PEB.',
    );

    const [mediaSourceType, setMediaSourceType] = useState<'url' | 'upload'>(
        aboutSection?.media_source_type ?? 'url',
    );
    const [mediaUrl, setMediaUrl] = useState(
        aboutSection?.media_url ?? '/assets/beranda/about/about.png',
    );
    const [mediaFileName, setMediaFileName] = useState(
        aboutSection?.media_file_name ?? '',
    );
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    const [mediaType, setMediaType] = useState<'video' | 'image'>(
        aboutSection?.media_type ?? 'image',
    );

    const [efisiensi, setEfisiensi] = useState<StatCardData>(
        aboutSection?.efisiensi ?? {
            label: 'EFISIENSI',
            value: '95%',
            description:
                'Menjamin tingkat keandalan pasokan energi yang tinggi serta efisiensi operasional yang maksimal untuk mendukung kebutuhan mitra industri dan kelistrikan batam.',
        },
    );

    const [inovatif, setInovatif] = useState<StatCardData>(
        aboutSection?.inovatif ?? {
            label: 'INOVATIF',
            value: '85%',
            description:
                'Terus berinovasi dalam pengembangan produk dan layanan energi berkelanjutan demi menciptakan nilai tambah bagi kemajuan negeri.',
        },
    );

    const [activeFormTab, setActiveFormTab] = useState<
        'umum' | 'media' | 'efisiensi' | 'inovatif'
    >('umum');
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi section Tentang Kami telah diperbarui.',
    );
    const imageInputRef = useRef<HTMLInputElement>(null);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleReset = () => {
        if (mediaPreviewUrl && mediaPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreviewUrl);
        }

        setTitle(aboutSection?.title ?? 'PT Pelayanan Energi Batam');
        setSubtitle(aboutSection?.subtitle ?? 'Energi Bagi Negeri');
        setSloganText(
            aboutSection?.slogan_text ??
                'ENERGI BAGI NEGERI (ENERGY FOR THE COUNTRY) merupakan slogan dalam menyampaikan gagasan positif tentang Visi dan Misi PT Pelayanan Energi Batam. Tonton video ini untuk menjelajahi nilai berkelanjutan dari Produk & Inovasi PEB.',
        );

        setMediaSourceType(aboutSection?.media_source_type ?? 'url');
        setMediaUrl(
            aboutSection?.media_url ?? '/assets/beranda/about/about.png',
        );
        setMediaFileName(aboutSection?.media_file_name ?? '');
        setMediaPreviewUrl('');
        setMediaFile(null);
        setUploadProgress(0);
        setMediaType(aboutSection?.media_type ?? 'image');

        setEfisiensi(
            aboutSection?.efisiensi ?? {
                label: 'EFISIENSI',
                value: '95%',
                description:
                    'Menjamin tingkat keandalan pasokan energi yang tinggi serta efisiensi operasional yang maksimal untuk mendukung kebutuhan mitra industri dan kelistrikan batam.',
            },
        );

        setInovatif(
            aboutSection?.inovatif ?? {
                label: 'INOVATIF',
                value: '85%',
                description:
                    'Terus berinovasi dalam pengembangan produk dan layanan energi berkelanjutan demi menciptakan nilai tambah bagi kemajuan negeri.',
            },
        );

        setActiveFormTab('umum');
        console.log('[AboutSectionEditor] Reset ke konfigurasi default.');
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validasi ukuran berkas maksimal 500 MB (500 * 1024 * 1024 bytes)
        const maxSizeBytes = 500 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            triggerToast(
                'error',
                'Ukuran berkas terlalu besar! Maksimal ukuran yang diperbolehkan adalah 500 MB.',
            );
            e.target.value = '';
            return;
        }

        setUploadingMedia(true);
        setUploadProgress(0);

        if (mediaPreviewUrl && mediaPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreviewUrl);
        }

        const localUrl = URL.createObjectURL(file);

        setUploadingMedia(false);
        setMediaUrl(localUrl);
        setMediaPreviewUrl(localUrl);
        setMediaFileName(file.name);
        setMediaFile(file);
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
        setUploadProgress(0);
    };

    const triggerMediaSelect = () => {
        imageInputRef.current?.click();
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data: Record<string, any> = {
            title,
            subtitle,
            slogan_text: sloganText,
            media_type: mediaType,
            media_source_type: mediaSourceType,
            media_url: mediaUrl,
            media_file_name: mediaFileName,
            efisiensi,
            inovatif,
        };

        if (mediaSourceType === 'upload' && mediaFile) {
            data.media_file = mediaFile;
        }

        router.post(updateAbout.url(), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                triggerToast(
                    'success',
                    'Konfigurasi section Tentang Kami telah diperbarui.',
                );
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('Save failed:', err);
                const errorMsg = Object.values(err).join('\n');
                triggerToast(
                    'error',
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontrol (Kiri) */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between border-b border-admin-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                    <Layout size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Tentang Kami
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Sesuaikan informasi profil perusahaan,
                                        statistik, slogan, dan media pendukung.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs Form */}
                        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                            <button
                                type="button"
                                onClick={() => setActiveFormTab('media')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeFormTab === 'media'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <ImageIcon size={13} />
                                Media Utama
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFormTab('efisiensi')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeFormTab === 'efisiensi'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Percent size={13} />
                                Stat Efisiensi
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFormTab('inovatif')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeFormTab === 'inovatif'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Sparkles size={13} />
                                Stat Inovatif
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFormTab('umum')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeFormTab === 'umum'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <FileText size={13} />
                                Info Umum
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {activeFormTab === 'umum' && (
                                <InfoTab
                                    title={title}
                                    setTitle={setTitle}
                                    subtitle={subtitle}
                                    setSubtitle={setSubtitle}
                                    sloganText={sloganText}
                                    setSloganText={setSloganText}
                                />
                            )}

                            {activeFormTab === 'media' && (
                                <MediaTab
                                    mediaSourceType={mediaSourceType}
                                    setMediaSourceType={setMediaSourceType}
                                    mediaUrl={mediaUrl}
                                    setMediaUrl={setMediaUrl}
                                    mediaFileName={mediaFileName}
                                    uploadingMedia={uploadingMedia}
                                    mediaInputRef={imageInputRef}
                                    handleMediaChange={handleMediaChange}
                                    triggerMediaSelect={triggerMediaSelect}
                                    uploadProgress={uploadProgress}
                                    mediaType={mediaType}
                                    setMediaType={setMediaType}
                                />
                            )}

                            {activeFormTab === 'efisiensi' && (
                                <StatTab
                                    stat={efisiensi}
                                    setStat={setEfisiensi}
                                />
                            )}

                            {activeFormTab === 'inovatif' && (
                                <StatTab
                                    stat={inovatif}
                                    setStat={setInovatif}
                                />
                            )}

                            {/* Tombol Aksi */}
                            <div className="flex gap-4 border-t border-admin-border pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95"
                                >
                                    <RotateCcw size={16} />
                                    Reset
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

            {/* Live Preview (Kanan) */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <div className="group relative flex h-[650px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Tentang Kami
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        <PreviewPanel
                            title={title}
                            subtitle={subtitle}
                            imageUrl={mediaUrl}
                            efisiensi={efisiensi}
                            inovatif={inovatif}
                            sloganText={sloganText}
                            file={mediaFile}
                        />

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>MOCKUP PREVIEW LAYOUT</span>
                            <span>SINKRONISASI REAL-TIME</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            {/* Notification Toast */}
            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
