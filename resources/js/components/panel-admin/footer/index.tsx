import { useCmsSave } from '@/hooks/use-cms-save';
import { useRef, useState } from 'react';
import {
    LayoutTemplate,
    RotateCcw,
    Save,
    Eye,
    Plus,
    Trash2,
    GripVertical,
    UploadCloud,
    CheckCircle2,
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Link as LinkIcon,
    Bell,
    Facebook,
    AtSign,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';
import { router } from '@inertiajs/react';
import { update as updateFooter } from '@/routes/panel-admin/footer';

interface FooterLink {
    id: string;
    label: string;
    href: string;
}

interface SocialLink {
    id: string;
    platform: string;
    href: string;
}

// ── Default Data ──────────────────────────────────────────────
const defaultLinks: FooterLink[] = [
    { id: '1', label: 'Tentang Kami', href: '/tentang-kami' },
    { id: '2', label: 'Layanan & Produk', href: '/servis' },
    { id: '3', label: 'Galeri', href: '/galeri' },
    { id: '4', label: 'Portofolio', href: '/portfolio' },
    { id: '5', label: 'Kebijakan Korporat', href: '/kebijakan' },
    { id: '6', label: 'Pengadaan', href: '/pengadaan' },
    { id: '7', label: 'Berita Terkini', href: '#' },
    { id: '8', label: 'Karir', href: '#' },
];

const defaultSocials: SocialLink[] = [
    { id: '1', platform: 'Facebook', href: '#' },
    { id: '2', platform: 'Website', href: '#' },
    { id: '3', platform: 'Email', href: '#' },
];

type TabType = 'brand' | 'explore' | 'kontak' | 'subscribe' | 'bottom';

interface FooterData {
    logo_src?: string;
    logo_source_type?: 'url' | 'upload';
    logo_file_name?: string;
    description?: string;
    socials?: SocialLink[];
    explore_links?: FooterLink[];
    address?: string;
    phone?: string;
    email?: string;
    subscribe_heading?: string;
    subscribe_description?: string;
    subscribe_button_label?: string;
    copyright_text?: string;
    privacy_href?: string;
    tos_href?: string;
}

interface FooterEditorProps {
    footer?: FooterData;
}

export default function FooterEditor({ footer }: FooterEditorProps) {
    const [activeTab, setActiveTab] = useState<TabType>('brand');

    // Brand
    const [logoSrc, setLogoSrc] = useState(
        footer?.logo_src ?? '/assets/logo/logo-putih.png',
    );
    const [logoSourceType, setLogoSourceType] = useState<'url' | 'upload'>(
        footer?.logo_source_type ?? 'url',
    );
    const [logoFileName, setLogoFileName] = useState(
        footer?.logo_file_name ?? '',
    );
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
    const [description, setDescription] = useState(
        footer?.description ??
            'Energi bagi negeri. Kami berkomitmen untuk menyediakan energi yang andal dan berkelanjutan untuk mendukung pertumbuhan industri dan ekonomi Batam.',
    );
    const [socials, setSocials] = useState<SocialLink[]>(
        footer?.socials ?? defaultSocials,
    );
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Explore
    const [exploreLinks, setExploreLinks] = useState<FooterLink[]>(
        footer?.explore_links ?? defaultLinks,
    );
    const [draggedLinkIdx, setDraggedLinkIdx] = useState<number | null>(null);

    // Kontak
    const [address, setAddress] = useState(
        footer?.address ??
            'Jl. Jend. Sudirman No. 123,\nBatam Center, Batam,\nKepulauan Riau',
    );
    const [phone, setPhone] = useState(footer?.phone ?? '(0778) 463 150');
    const [email, setEmail] = useState(footer?.email ?? 'info@plnbatam.co.id');

    // Subscribe
    const [subscribeHeading, setSubscribeHeading] = useState(
        footer?.subscribe_heading ?? 'Berlangganan Info',
    );
    const [subscribeDescription, setSubscribeDescription] = useState(
        footer?.subscribe_description ??
            'Dapatkan informasi tender terbaru langsung ke email Anda.',
    );
    const [subscribeButtonLabel, setSubscribeButtonLabel] = useState(
        footer?.subscribe_button_label ?? 'Langganan',
    );

    // Bottom Bar
    const [copyrightText, setCopyrightText] = useState(
        footer?.copyright_text ??
            `© ${new Date().getFullYear()} PT Pelayanan Energi Batam. All rights reserved.`,
    );
    const [privacyHref, setPrivacyHref] = useState(footer?.privacy_href ?? '#');
    const [tosHref, setTosHref] = useState(footer?.tos_href ?? '#');

    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);

    // Logo upload — efek "Memproses file..." seperti profil perusahaan
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingLogo(true);
        setLogoFileName(file.name);
        setLogoFile(file);

        if (logoPreviewUrl) {
            URL.revokeObjectURL(logoPreviewUrl);
        }
        const localUrl = URL.createObjectURL(file);
        setLogoPreviewUrl(localUrl);
        setUploadingLogo(false);
    };

    // Explore link handlers
    const handleAddLink = () =>
        setExploreLinks((prev) => [
            ...prev,
            { id: Date.now().toString(), label: 'Link Baru', href: '#' },
        ]);
    const handleDeleteLink = (id: string) => {
        if (exploreLinks.length <= 1) return;
        setExploreLinks((prev) => prev.filter((l) => l.id !== id));
    };
    const handleChangeLink = (
        id: string,
        key: keyof FooterLink,
        value: string,
    ) =>
        setExploreLinks((prev) =>
            prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)),
        );
    const handleDragStartLink = (idx: number) => setDraggedLinkIdx(idx);
    const handleDragOverLink = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (draggedLinkIdx === null || draggedLinkIdx === idx) return;
        setExploreLinks((prev) => {
            const next = [...prev];
            const [d] = next.splice(draggedLinkIdx, 1);
            next.splice(idx, 0, d);
            return next;
        });
        setDraggedLinkIdx(idx);
    };

    // Social handlers
    const handleChangeSocial = (
        id: string,
        key: keyof SocialLink,
        value: string,
    ) =>
        setSocials((prev) =>
            prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
        );

    const handleReset = () => {
        setLogoSrc('/assets/logo/logo-putih.png');
        setLogoSourceType('url');
        setLogoFileName('');
        setLogoPreviewUrl('');
        setDescription(
            'Energi bagi negeri. Kami berkomitmen untuk menyediakan energi yang andal dan berkelanjutan untuk mendukung pertumbuhan industri dan ekonomi Batam.',
        );
        setSocials(defaultSocials);
        setExploreLinks(defaultLinks);
        setAddress(
            'Jl. Jend. Sudirman No. 123,\nBatam Center, Batam,\nKepulauan Riau',
        );
        setPhone('(0778) 463 150');
        setEmail('info@plnbatam.co.id');
        setSubscribeHeading('Berlangganan Info');
        setSubscribeDescription(
            'Dapatkan informasi tender terbaru langsung ke email Anda.',
        );
        setSubscribeButtonLabel('Langganan');
        setCopyrightText(
            `© ${new Date().getFullYear()} PT Pelayanan Energi Batam. All rights reserved.`,
        );
        setPrivacyHref('#');
        setTosHref('#');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('logo_source_type', logoSourceType);
        formData.append('logo_src', logoSrc || '');
        formData.append('logo_file_name', logoFileName || '');
        formData.append('description', description);
        formData.append('address', address);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('subscribe_heading', subscribeHeading);
        formData.append('subscribe_description', subscribeDescription);
        formData.append('subscribe_button_label', subscribeButtonLabel);
        formData.append('copyright_text', copyrightText);
        formData.append('privacy_href', privacyHref);
        formData.append('tos_href', tosHref);

        if (logoSourceType === 'upload' && logoFile) {
            formData.append('logo_file', logoFile);
        }

        socials.forEach((social, index) => {
            formData.append(`socials[${index}][id]`, social.id);
            formData.append(`socials[${index}][platform]`, social.platform);
            formData.append(`socials[${index}][href]`, social.href);
        });

        exploreLinks.forEach((link, index) => {
            formData.append(`explore_links[${index}][id]`, link.id);
            formData.append(`explore_links[${index}][label]`, link.label);
            formData.append(`explore_links[${index}][href]`, link.href);
        });

        router.post(updateFooter.url(), formData as any, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('Save failed:', err);
                const errorMsg = Object.values(err).join('\n');
                alert(
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
    };

    const displayLogoUrl = logoPreviewUrl || logoSrc;

    const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
        { key: 'brand', label: 'Brand', icon: <Building2 size={13} /> },
        { key: 'explore', label: 'Explore', icon: <Globe size={13} /> },
        { key: 'kontak', label: 'Kontak', icon: <Phone size={13} /> },
        { key: 'subscribe', label: 'Subscribe', icon: <Bell size={13} /> },
        {
            key: 'bottom',
            label: 'Bottom Bar',
            icon: <LayoutTemplate size={13} />,
        },
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
                                    Footer
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola semua konten footer landing page.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Tab Navigation */}
                            <div className="flex flex-wrap gap-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all',
                                            activeTab === tab.key
                                                ? 'border border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                                : 'border border-transparent text-admin-text-muted hover:text-admin-text',
                                        )}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ── Tab: Brand ─────────────────────────────── */}
                            {activeTab === 'brand' && (
                                <div className="space-y-5">
                                    {/* Logo */}
                                    <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-admin-text">
                                                Logo Footer
                                            </label>
                                            <div className="flex rounded-lg border border-admin-border bg-admin-bg p-1">
                                                {(
                                                    ['url', 'upload'] as const
                                                ).map((st) => (
                                                    <button
                                                        key={st}
                                                        type="button"
                                                        onClick={() =>
                                                            setLogoSourceType(
                                                                st,
                                                            )
                                                        }
                                                        className={cn(
                                                            'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold transition-all',
                                                            logoSourceType ===
                                                                st
                                                                ? 'bg-admin-accent text-white shadow-sm'
                                                                : 'text-admin-text-muted hover:text-admin-text',
                                                        )}
                                                    >
                                                        {st === 'url' ? (
                                                            <LinkIcon
                                                                size={10}
                                                            />
                                                        ) : (
                                                            <UploadCloud
                                                                size={10}
                                                            />
                                                        )}
                                                        {st === 'url'
                                                            ? 'URL'
                                                            : 'Unggah'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {logoSourceType === 'url' ? (
                                            <input
                                                type="text"
                                                value={logoSrc}
                                                onChange={(e) => {
                                                    setLogoSrc(e.target.value);
                                                    setLogoPreviewUrl('');
                                                }}
                                                className="w-full rounded-xl border border-admin-border bg-admin-bg/75 px-4 py-3 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                placeholder="/assets/logo/logo-putih.png"
                                            />
                                        ) : (
                                            <div className="space-y-2">
                                                <div
                                                    onClick={() =>
                                                        logoInputRef.current?.click()
                                                    }
                                                    className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg/40 p-5 transition-all hover:border-admin-accent/50"
                                                >
                                                    <input
                                                        ref={logoInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleLogoChange
                                                        }
                                                        className="hidden"
                                                    />
                                                    {uploadingLogo ? (
                                                        <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                                            <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                            Memproses file
                                                            logo...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <UploadCloud
                                                                size={24}
                                                                className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                                            />
                                                            <p className="text-xs font-bold text-admin-text">
                                                                Pilih file Logo
                                                                (PNG/SVG)
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                {logoFileName &&
                                                    !uploadingLogo && (
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                            <CheckCircle2
                                                                size={12}
                                                            />{' '}
                                                            File {logoFileName}{' '}
                                                            berhasil dimuat
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                        {/* Logo Preview */}
                                        <div className="flex h-16 items-center justify-center overflow-hidden rounded-xl border border-admin-border/50 bg-[#0d2e2e]">
                                            <img
                                                src={displayLogoUrl}
                                                alt="Logo Preview"
                                                className="h-12 w-auto object-contain"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Deskripsi Brand
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            rows={4}
                                            className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Tautan Media Sosial
                                        </label>
                                        {socials.map((social) => (
                                            <div
                                                key={social.id}
                                                className="flex items-center gap-3 rounded-2xl border border-admin-border/60 bg-admin-bg/30 p-3"
                                            >
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-admin-accent/10 text-admin-accent">
                                                    {social.platform ===
                                                    'Facebook' ? (
                                                        <Facebook size={14} />
                                                    ) : social.platform ===
                                                      'Website' ? (
                                                        <Globe size={14} />
                                                    ) : (
                                                        <AtSign size={14} />
                                                    )}
                                                </div>
                                                <span className="w-20 shrink-0 text-xs font-bold text-admin-text-muted">
                                                    {social.platform}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={social.href}
                                                    onChange={(e) =>
                                                        handleChangeSocial(
                                                            social.id,
                                                            'href',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 rounded-xl border border-admin-border bg-admin-bg px-3 py-2 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Explore ───────────────────────────── */}
                            {activeTab === 'explore' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Link Navigasi ({exploreLinks.length}
                                            )
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddLink}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 py-1.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                                        >
                                            <Plus size={13} /> Tambah Link
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {exploreLinks.map((link, idx) => (
                                            <div
                                                key={link.id}
                                                draggable
                                                onDragStart={() =>
                                                    handleDragStartLink(idx)
                                                }
                                                onDragOver={(e) =>
                                                    handleDragOverLink(e, idx)
                                                }
                                                onDragEnd={() =>
                                                    setDraggedLinkIdx(null)
                                                }
                                                className={cn(
                                                    'group/link flex items-center gap-3 rounded-2xl border border-admin-border/60 bg-admin-bg/30 p-3',
                                                    draggedLinkIdx === idx &&
                                                        'scale-95 opacity-40',
                                                )}
                                            >
                                                <GripVertical
                                                    size={14}
                                                    className="shrink-0 cursor-grab text-admin-text-muted/40 group-hover/link:text-admin-text-muted"
                                                />
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={(e) =>
                                                        handleChangeLink(
                                                            link.id,
                                                            'label',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-xs font-bold text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="Label link..."
                                                />
                                                <input
                                                    type="text"
                                                    value={link.href}
                                                    onChange={(e) =>
                                                        handleChangeLink(
                                                            link.id,
                                                            'href',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 rounded-xl border border-admin-border bg-admin-bg px-3 py-2 font-mono text-xs text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                    placeholder="/halaman atau https://..."
                                                />
                                                {exploreLinks.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteLink(
                                                                link.id,
                                                            )
                                                        }
                                                        className="shrink-0 cursor-pointer rounded-lg p-1 text-admin-text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Kontak ────────────────────────────── */}
                            {activeTab === 'kontak' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            <MapPin
                                                size={12}
                                                className="text-admin-accent"
                                            />{' '}
                                            Alamat
                                        </label>
                                        <textarea
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            rows={4}
                                            className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            <Phone
                                                size={12}
                                                className="text-admin-accent"
                                            />{' '}
                                            Nomor Telepon
                                        </label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            <Mail
                                                size={12}
                                                className="text-admin-accent"
                                            />{' '}
                                            Alamat Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Subscribe ─────────────────────────── */}
                            {activeTab === 'subscribe' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Judul Subscribe
                                        </label>
                                        <input
                                            type="text"
                                            value={subscribeHeading}
                                            onChange={(e) =>
                                                setSubscribeHeading(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Deskripsi Subscribe
                                        </label>
                                        <textarea
                                            value={subscribeDescription}
                                            onChange={(e) =>
                                                setSubscribeDescription(
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Label Tombol
                                        </label>
                                        <input
                                            type="text"
                                            value={subscribeButtonLabel}
                                            onChange={(e) =>
                                                setSubscribeButtonLabel(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Bottom Bar ────────────────────────── */}
                            {activeTab === 'bottom' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Teks Copyright
                                        </label>
                                        <input
                                            type="text"
                                            value={copyrightText}
                                            onChange={(e) =>
                                                setCopyrightText(e.target.value)
                                            }
                                            className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                URL Privacy Policy
                                            </label>
                                            <input
                                                type="text"
                                                value={privacyHref}
                                                onChange={(e) =>
                                                    setPrivacyHref(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                placeholder="#"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                URL Terms of Service
                                            </label>
                                            <input
                                                type="text"
                                                value={tosHref}
                                                onChange={(e) =>
                                                    setTosHref(e.target.value)
                                                }
                                                className="w-full rounded-2xl border border-admin-border bg-admin-bg/50 px-4 py-3 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                                placeholder="#"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

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

            {/* Live Preview */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <div className="relative flex h-[750px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Footer
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        {/* Footer Mockup */}
                        <div className="custom-scrollbar flex-1 overflow-hidden overflow-y-auto rounded-2xl">
                            <div className="space-y-5 bg-[#0d2e2e] p-5">
                                {/* Grid 4 kolom */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Brand */}
                                    <div className="space-y-3">
                                        <img
                                            src={displayLogoUrl}
                                            alt="Logo"
                                            className="h-8 w-auto object-contain"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).style.display = 'none';
                                            }}
                                        />
                                        <p className="line-clamp-3 text-[9px] leading-relaxed text-white/50">
                                            {description}
                                        </p>
                                        <div className="flex gap-2">
                                            {socials.map((s) => (
                                                <div
                                                    key={s.id}
                                                    className="flex size-5 items-center justify-center rounded bg-[#FFE872]/20"
                                                >
                                                    {s.platform ===
                                                    'Facebook' ? (
                                                        <Facebook
                                                            size={9}
                                                            className="text-[#FFE872]"
                                                        />
                                                    ) : s.platform ===
                                                      'Website' ? (
                                                        <Globe
                                                            size={9}
                                                            className="text-[#FFE872]"
                                                        />
                                                    ) : (
                                                        <AtSign
                                                            size={9}
                                                            className="text-[#FFE872]"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Explore */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-bold tracking-widest text-[#FFE872] uppercase">
                                            Explore
                                        </p>
                                        {exploreLinks
                                            .slice(0, 5)
                                            .map((link) => (
                                                <p
                                                    key={link.id}
                                                    className="text-[9px] text-white/50"
                                                >
                                                    {link.label}
                                                </p>
                                            ))}
                                        {exploreLinks.length > 5 && (
                                            <p className="text-[9px] text-white/30">
                                                +{exploreLinks.length - 5}{' '}
                                                lainnya
                                            </p>
                                        )}
                                    </div>

                                    {/* Kontak */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-bold tracking-widest text-[#FFE872] uppercase">
                                            Hubungi Kami
                                        </p>
                                        <div className="flex items-start gap-1.5">
                                            <MapPin
                                                size={9}
                                                className="mt-0.5 shrink-0 text-[#FFE872]"
                                            />
                                            <p className="line-clamp-3 text-[9px] whitespace-pre-line text-white/50">
                                                {address}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Phone
                                                size={9}
                                                className="shrink-0 text-[#FFE872]"
                                            />
                                            <p className="text-[9px] text-white/50">
                                                {phone}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Mail
                                                size={9}
                                                className="shrink-0 text-[#FFE872]"
                                            />
                                            <p className="truncate text-[9px] text-white/50">
                                                {email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Subscribe */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-bold tracking-widest text-[#FFE872] uppercase">
                                            {subscribeHeading}
                                        </p>
                                        <p className="line-clamp-2 text-[9px] text-white/50">
                                            {subscribeDescription}
                                        </p>
                                        <div className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5">
                                            <p className="text-[9px] text-white/30">
                                                Alamat Email Anda
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-[#FFE872] px-3 py-1.5 text-center">
                                            <p className="text-[9px] font-bold text-[#0d2e2e]">
                                                {subscribeButtonLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Bar */}
                                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                    <p className="max-w-[60%] truncate text-[8px] text-white/30">
                                        {copyrightText}
                                    </p>
                                    <div className="flex gap-3">
                                        <p className="text-[8px] text-white/30">
                                            Privacy Policy
                                        </p>
                                        <p className="text-[8px] text-white/30">
                                            Terms of Service
                                        </p>
                                    </div>
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
                message="Konfigurasi footer telah diperbarui."
            />
        </div>
    );
}
