import { useCmsSave } from '@/hooks/use-cms-save';
import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Sparkles,
    ImageIcon,
    RotateCcw,
    Save,
    Eye,
    Layout,
    Calendar,
    MapPin,
} from 'lucide-react';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import { update as updateProfil } from '@/routes/panel-admin/tentang/profil-section';
import MediaTab from './media-tab';

interface ProfilSection {
    title: string;
    description: string;
    image_src: string;
    image_source_type: 'url' | 'upload';
    image_file_name?: string;
    experience_years: string;
    experience_label: string;
    maps_label: string;
    maps_value: string;
    maps_mode: 'koordinat' | 'embed';
    maps_koordinat?: string;
    maps_embed_url?: string;
}

interface ProfilSectionEditorProps {
    profilSection?: ProfilSection | null;
}

// ── Helper: generate Google Maps embed URL dari koordinat ─────
function buildMapsEmbedUrl(input: string): string {
    if (!input) return '';
    // Jika sudah berupa embed URL, kembalikan langsung
    if (input.includes('google.com/maps/embed')) return input;
    // Jika berupa koordinat "lat,lng", buat embed URL
    const coordMatch = input.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
        const [, lat, lng] = coordMatch;
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1`;
    }
    return input;
}

export default function ProfilPerusahaanEditor({
    profilSection,
}: ProfilSectionEditorProps = {}) {
    const [title, setTitle] = useState(
        profilSection?.title || 'PT Pelayanan\nEnergi Batam',
    );
    const [description, setDescription] = useState(
        profilSection?.description ||
            'Sebagai bagian dari PLN Group, PT Pelayanan Energi Batam (PEB) berdedikasi menghadirkan infrastruktur energi kelas dunia sejak 2014. Dari fondasi kuat dalam layanan EPCI gas, kami kini bertransformasi menjadi penyedia solusi energi terintegrasi, mencakup Operasi & Pemeliharaan (O&M) Pembangkit hingga pengembangan Energi Terbarukan (Tenaga Surya). Kami siap menjawab tantangan masa depan dengan layanan yang andal, inovatif, dan berorientasi pada keberlanjutan.',
    );
    const [imageSrc, setImageSrc] = useState(
        profilSection?.image_src || '/assets/tentang-kami/about/about.png',
    );
    const [experienceYears, setExperienceYears] = useState(
        profilSection?.experience_years || '25+',
    );
    const [experienceLabel, setExperienceLabel] = useState(
        profilSection?.experience_label ||
            'Tahun pengalaman dalam industri energi',
    );

    // Maps
    const [mapsMode, setMapsMode] = useState<'koordinat' | 'embed'>(
        profilSection?.maps_mode || 'koordinat',
    );
    const [mapsKoordinat, setMapsKoordinat] = useState(
        profilSection?.maps_koordinat || '1.1301,104.0529',
    );
    const [mapsEmbedUrl, setMapsEmbedUrl] = useState(
        profilSection?.maps_embed_url || '',
    );
    const [locationLabel, setLocationLabel] = useState(
        profilSection?.maps_label || 'Lokasi Kami',
    );
    const [locationValue, setLocationValue] = useState(
        profilSection?.maps_value || 'Batam, Kepulauan Riau',
    );

    const [imageSourceType, setImageSourceType] = useState<'url' | 'upload'>(
        profilSection?.image_source_type || 'url',
    );
    const [imageFileName, setImageFileName] = useState(
        profilSection?.image_file_name || '',
    );
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<'konten' | 'badge' | 'media'>(
        'konten',
    );
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState(
        'Konfigurasi profil Tentang Kami berhasil diperbarui.',
    );

    // ── Computed Maps URL ─────────────────────────────────────
    const resolvedMapsUrl =
        mapsMode === 'koordinat'
            ? buildMapsEmbedUrl(mapsKoordinat)
            : buildMapsEmbedUrl(mapsEmbedUrl);

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleReset = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setTitle(profilSection?.title || 'PT Pelayanan\nEnergi Batam');
        setDescription(
            profilSection?.description ||
                'Sebagai bagian dari PLN Group, PT Pelayanan Energi Batam (PEB) berdedikasi menghadirkan infrastruktur energi kelas dunia sejak 2014. Dari fondasi kuat dalam layanan EPCI gas, kami kini bertransformasi menjadi penyedia solusi energi terintegrasi, mencakup Operasi & Pemeliharaan (O&M) Pembangkit hingga pengembangan Energi Terbarukan (Tenaga Surya). Kami siap menjawab tantangan masa depan dengan layanan yang andal, inovatif, dan berorientasi pada keberlanjutan.',
        );
        setImageSrc(
            profilSection?.image_src || '/assets/tentang-kami/about/about.png',
        );
        setExperienceYears(profilSection?.experience_years || '25+');
        setExperienceLabel(
            profilSection?.experience_label ||
                'Tahun pengalaman dalam industri energi',
        );

        setMapsMode(profilSection?.maps_mode || 'koordinat');
        setMapsKoordinat(profilSection?.maps_koordinat || '1.1301,104.0529');
        setMapsEmbedUrl(profilSection?.maps_embed_url || '');
        setLocationLabel(profilSection?.maps_label || 'Lokasi Kami');
        setLocationValue(profilSection?.maps_value || 'Batam, Kepulauan Riau');

        setImageSourceType(profilSection?.image_source_type || 'url');
        setImageFileName(profilSection?.image_file_name || '');
        setImagePreviewUrl('');
        setImageFile(null);
        console.log('[ProfilPerusahaanEditor] Reset ke konfigurasi terakhir.');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadingImage(true);

        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }

        const localUrl = URL.createObjectURL(file);

        setUploadingImage(false);
        setImageSrc(localUrl);
        setImagePreviewUrl(localUrl);
        setImageFileName(file.name);
        setImageFile(file);
    };

    const triggerImageSelect = () => {
        imageInputRef.current?.click();
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data: any = {
            title,
            description,
            image_src:
                imageSourceType === 'upload'
                    ? imageFile
                        ? ''
                        : imageSrc
                    : imageSrc,
            image_source_type: imageSourceType,
            image_file_name: imageFileName,
            experience_years: experienceYears,
            experience_label: experienceLabel,
            maps_label: locationLabel,
            maps_value: locationValue,
            maps_mode: mapsMode,
            maps_koordinat: mapsKoordinat,
            maps_embed_url: mapsEmbedUrl,
        };

        if (imageSourceType === 'upload' && imageFile) {
            data.image_file = imageFile;
        }

        router.post(updateProfil.url(), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                triggerToast(
                    'success',
                    'Konfigurasi profil Tentang Kami berhasil diperbarui.',
                );
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('[ProfilPerusahaanEditor] Gagal menyimpan:', err);
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
                                        Profil Perusahaan (Tentang Kami)
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Konfigurasi info profil, tahun
                                        pengalaman, lokasi, dan media visual.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs Form */}
                        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('konten')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeTab === 'konten'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Layout size={13} />
                                Konten Teks
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('badge')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeTab === 'badge'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <Calendar size={13} />
                                Lencana & Lokasi
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('media')}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300',
                                    activeTab === 'media'
                                        ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                        : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                )}
                            >
                                <ImageIcon size={13} />
                                Gambar Utama
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {activeTab === 'konten' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Judul Utama (Mendukung Multi-baris
                                            \n)
                                        </label>
                                        <textarea
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            rows={2}
                                            className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="PT Pelayanan&#10;Energi Batam..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Deskripsi Profil
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            rows={6}
                                            className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                            placeholder="Deskripsi profil perusahaan lengkap..."
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'badge' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Nilai Pengalaman (Years/Value)
                                            </label>
                                            <input
                                                type="text"
                                                value={experienceYears}
                                                onChange={(e) =>
                                                    setExperienceYears(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                                placeholder="E.g., 25+"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Label Pengalaman
                                            </label>
                                            <input
                                                type="text"
                                                value={experienceLabel}
                                                onChange={(e) =>
                                                    setExperienceLabel(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                                placeholder="Tahun pengalaman..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Lokasi Peta Interaktif */}
                                    <div className="mt-4 space-y-4 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin
                                                size={16}
                                                className="text-admin-accent"
                                            />
                                            <label className="text-xs font-bold tracking-widest text-admin-text uppercase">
                                                Lokasi Perusahaan (Maps)
                                            </label>
                                        </div>

                                        {/* Label & Value Lokasi */}
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Label Lokasi
                                                </label>
                                                <input
                                                    type="text"
                                                    value={locationLabel}
                                                    onChange={(e) =>
                                                        setLocationLabel(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="E.g., Lokasi Kami"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Nama Lokasi
                                                </label>
                                                <input
                                                    type="text"
                                                    value={locationValue}
                                                    onChange={(e) =>
                                                        setLocationValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="E.g., Batam, Kepulauan Riau"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Mode Toggle */}
                                        <div className="space-y-2 pt-2">
                                            <label className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                                Sumber Peta
                                            </label>
                                            <div className="flex w-fit rounded-lg border border-admin-border bg-admin-bg p-1">
                                                {(
                                                    [
                                                        'koordinat',
                                                        'embed',
                                                    ] as const
                                                ).map((mode) => (
                                                    <button
                                                        key={mode}
                                                        type="button"
                                                        onClick={() =>
                                                            setMapsMode(mode)
                                                        }
                                                        className={cn(
                                                            'flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-1.5 text-[10px] font-bold transition-all',
                                                            mapsMode === mode
                                                                ? 'bg-admin-accent text-white shadow-sm'
                                                                : 'text-admin-text-muted hover:text-admin-text',
                                                        )}
                                                    >
                                                        {mode === 'koordinat'
                                                            ? '📍 Koordinat Lat,Lng'
                                                            : '🔗 Embed URL'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {mapsMode === 'koordinat' ? (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Koordinat (Latitude,
                                                    Longitude)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={mapsKoordinat}
                                                    onChange={(e) =>
                                                        setMapsKoordinat(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="1.1301, 104.0529"
                                                />
                                                <p className="text-[10px] text-admin-text-muted">
                                                    💡 Cara mendapatkan
                                                    koordinat: buka Google Maps
                                                    → klik kanan lokasi → salin
                                                    koordinat (format: lat, lng)
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Google Maps Embed URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={mapsEmbedUrl}
                                                    onChange={(e) =>
                                                        setMapsEmbedUrl(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                                />
                                                <p className="text-[10px] text-admin-text-muted">
                                                    💡 Cara mendapatkan embed
                                                    URL: buka Google Maps → cari
                                                    lokasi → klik Share → Embed
                                                    a map → salin src="..."
                                                </p>
                                            </div>
                                        )}

                                        {/* Preview Maps di Editor */}
                                        {resolvedMapsUrl && (
                                            <div className="space-y-2 pt-2">
                                                <label className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                                    Preview Peta Lokasi
                                                </label>
                                                <div className="relative h-40 overflow-hidden rounded-2xl border border-admin-border/50 bg-admin-bg">
                                                    <iframe
                                                        src={resolvedMapsUrl}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        className="rounded-2xl"
                                                        title="Preview Lokasi Editor"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <MediaTab
                                    imageSourceType={imageSourceType}
                                    setImageSourceType={setImageSourceType}
                                    imageSrc={imageSrc}
                                    setImageSrc={setImageSrc}
                                    imageFileName={imageFileName}
                                    uploadingImage={uploadingImage}
                                    imageInputRef={imageInputRef}
                                    handleImageChange={handleImageChange}
                                    triggerImageSelect={triggerImageSelect}
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
                    <div className="group relative flex h-[750px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Profil Perusahaan
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        {/* Mockup Frame Profil */}
                        <div className="custom-scrollbar relative flex w-full flex-1 flex-col gap-6 overflow-y-auto rounded-[2rem] border border-admin-border bg-admin-bg p-6">
                            <div className="flex flex-col gap-3">
                                <h2 className="text-2xl leading-tight font-black whitespace-pre-line text-admin-text">
                                    {title}
                                </h2>
                                <div className="h-1.5 w-full rounded-full bg-[#f5e879]" />
                                <p className="text-xs leading-relaxed text-admin-text-muted">
                                    {description}
                                </p>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl shadow-md">
                                <img
                                    src={imageSrc}
                                    alt="Mockup Profil"
                                    className="aspect-[4/3] w-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop';
                                    }}
                                />

                                {/* Experience Badge */}
                                <div className="absolute top-4 left-4 z-10 flex flex-col rounded-xl border border-l-4 border-admin-border/50 border-l-[#FFF098] bg-admin-card p-3 shadow-lg">
                                    <span className="text-base leading-none font-extrabold text-admin-text">
                                        {experienceYears}
                                    </span>
                                    <span className="mt-1 max-w-[100px] text-[8px] leading-tight text-admin-text-muted">
                                        {experienceLabel}
                                    </span>
                                </div>

                                {/* Location Overlay */}
                                <div className="absolute right-0 bottom-0 left-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <MapPin
                                        size={12}
                                        className="text-admin-accent"
                                    />
                                    <div>
                                        <p className="text-[8px] font-bold tracking-wider text-white/60 uppercase">
                                            {locationLabel}
                                        </p>
                                        <p className="text-xs font-bold text-white">
                                            {locationValue}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Google Maps di Mockup Panel */}
                            {resolvedMapsUrl && (
                                <div className="mt-2 space-y-2">
                                    <span className="text-[8px] font-bold tracking-wider text-admin-text-muted uppercase">
                                        Peta Lokasi Interaktif
                                    </span>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-admin-border bg-admin-bg">
                                        <iframe
                                            title="Maps Lokasi Preview Mockup"
                                            src={resolvedMapsUrl}
                                            className="h-full w-full rounded-2xl border-0"
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>PROFIL MOCKUP PREVIEW</span>
                            <span>REAL-TIME EDIT</span>
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
