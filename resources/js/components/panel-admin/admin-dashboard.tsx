import { usePage } from '@inertiajs/react';
import CollectionManager from './collection-manager';
import {
    ChevronDown,
    Activity,
    TrendingUp,
    MoreVertical,
    Home,
    Info,
    Wrench,
    ScrollText,
    Images,
    FileBarChart,
    ShoppingCart,
    FolderKanban,
    LayoutTemplate,
    Headset,
    Database,
    Users,
    Shield,
    Globe,
    FileText,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Clock,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import DataRoleEditor from '@/pages/panel-admin/master-data/data-role/index';
import DataUserEditor from '@/pages/panel-admin/master-data/data-user/index';
import AboutSectionEditor from './beranda/about';
import HeroSectionEditor from './beranda/hero';
import LayananSectionEditor from './beranda/layanan';
import PartnerSectionEditor from './beranda/partner';
import StatistikSectionEditor from './beranda/statistik';
import HeroBeritaEditor from './berita/hero';
import CtaSectionEditor from './cta';
import FooterEditor from './footer';
import HeroGaleriEditor from './galeri/hero';
import HeaderEditor from './header';
import HeroKebijakanEditor from './kebijakan/hero';
import KebijakanPebEditor from './kebijakan/kebijakan-peb';
import HeroLaporanEditor from './laporan/hero';
import HeroKontakEditor from './kontak/hero';
import KontakMasukManager from './kontak/pesan-masuk';
import DaftarPengadaanEditor from './pengadaan/daftar-pengadaan';
import HeroPengadaanEditor from './pengadaan/hero';
import HeroPortfolioEditor from './portfolio/hero';
import DaftarServisSectionEditor from './servis/daftar-servis';
import HeroDetailServisEditor from './servis/hero-detail';
import HeroServisEditor from './servis/hero';
import HeroTentangEditor from './tentang/hero';
import PartnerTentangEditor from './tentang/partner';
import ProfilPerusahaanEditor from './tentang/profil';
import VisiMisiEditor from './tentang/visi-misi';
import TimKamiEditor from './tentang/tim';
import QuoteTentangEditor from './tentang/quote';
import ProfilEditor from './profil';
import PengaturanEditor from './pengaturan';
import SeoEditor from './seo';
import type { ProjectItem } from './types';

interface AdminDashboardProps {
    activeTab: string;
    recentProjects: ProjectItem[];
    pageProps?: any;
}

// ============================================================
// Sub-component: Master Data Redirect Card
// ============================================================
function MasterDataRedirect({
    title,
    description,
    icon,
    url,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    url: string;
}) {
    return (
        <AnimeReveal delay={100} distance={20} direction="up">
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-admin-border bg-admin-card p-12 text-center shadow-2xl">
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-admin-accent/10 text-admin-accent">
                    {icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-admin-text">
                    {title}
                </h3>
                <p className="mb-6 max-w-md text-sm text-admin-text-muted">
                    {description}
                </p>
                <a
                    href={url}
                    className="flex items-center gap-2 rounded-2xl bg-admin-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-admin-primary/20 transition-all hover:bg-admin-accent active:scale-95"
                >
                    Buka {title} <ArrowRight size={16} />
                </a>
            </div>
        </AnimeReveal>
    );
}

// ============================================================
// Sub-component: Module Overview Card
// ============================================================
interface ModuleItem {
    name: string;
    icon: React.ReactNode;
    sections: number;
    status: 'complete' | 'partial' | 'empty';
    color: string;
    tab: string;
}

function ModuleCard({
    mod,
    delay,
    onNavigate,
}: {
    mod: ModuleItem;
    delay: number;
    onNavigate: (tab: string) => void;
}) {
    const statusConfig = {
        complete: {
            label: 'Lengkap',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            dot: 'bg-emerald-400',
        },
        partial: {
            label: 'Sebagian',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            dot: 'bg-amber-400',
        },
        empty: {
            label: 'Kosong',
            color: 'text-admin-text-muted/60',
            bg: 'bg-admin-border/30',
            dot: 'bg-admin-text-muted/40',
        },
    };
    const s = statusConfig[mod.status];

    return (
        <AnimeReveal delay={delay} distance={20} direction="up">
            <div
                onClick={() => onNavigate(mod.tab)}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-admin-border bg-admin-card p-6 shadow-sm transition-all duration-300 hover:border-admin-accent/30 hover:shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-admin-accent/3 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                    <div className="mb-4 flex items-start justify-between">
                        <div
                            className={cn(
                                'flex size-11 items-center justify-center rounded-2xl',
                                mod.color,
                            )}
                        >
                            {mod.icon}
                        </div>
                        <span
                            className={cn(
                                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold',
                                s.bg,
                                s.color,
                            )}
                        >
                            <span
                                className={cn('size-1.5 rounded-full', s.dot)}
                            />
                            {s.label}
                        </span>
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-admin-text">
                        {mod.name}
                    </h4>
                    <p className="text-[10px] text-admin-text-muted">
                        {mod.sections} section tersedia
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-admin-accent opacity-0 transition-opacity group-hover:opacity-100">
                        Kelola <ArrowRight size={10} />
                    </div>
                </div>
            </div>
        </AnimeReveal>
    );
}

// ============================================================
// Sub-component: Recent Activity
// ============================================================
function RecentActivityCard() {
    const { props } = usePage();
    const notifications = (props.notifications as any[]) || [];

    const getActivityDetails = (title: string, type: string) => {
        const lower = (title || '').toLowerCase();
        if (lower.includes('user') || lower.includes('pengguna')) {
            return {
                icon: <Users size={14} />,
                color: 'text-blue-400 bg-blue-500/10',
            };
        }
        if (lower.includes('pengadaan')) {
            return {
                icon: <ShoppingCart size={14} />,
                color: 'text-amber-400 bg-amber-500/10',
            };
        }
        if (lower.includes('laporan') || lower.includes('keuangan')) {
            return {
                icon: <FileText size={14} />,
                color: 'text-cyan-400 bg-cyan-500/10',
            };
        }
        if (lower.includes('galeri') || lower.includes('foto')) {
            return {
                icon: <Images size={14} />,
                color: 'text-purple-400 bg-purple-500/10',
            };
        }
        if (lower.includes('seo')) {
            return {
                icon: <AlertCircle size={14} />,
                color: 'text-orange-400 bg-orange-500/10',
            };
        }
        if (lower.includes('login') || lower.includes('masuk')) {
            return {
                icon: <Shield size={14} />,
                color: 'text-indigo-400 bg-indigo-500/10',
            };
        }
        if (type === 'warning' || lower.includes('hapus')) {
            return {
                icon: <AlertCircle size={14} />,
                color: 'text-rose-400 bg-rose-500/10',
            };
        }
        return {
            icon: <CheckCircle2 size={14} />,
            color: 'text-emerald-400 bg-emerald-500/10',
        };
    };

    return (
        <AnimeReveal delay={900} distance={20}>
            <div className="flex h-[420px] flex-col rounded-[2rem] border border-admin-border bg-admin-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-admin-text">
                            Aktivitas Terkini
                        </h3>
                        <p className="mt-0.5 text-[10px] text-admin-text-muted">
                            Riwayat perubahan dan aktivitas semua akun
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-admin-border bg-admin-card-hover px-2.5 py-1 text-[11px] font-medium text-admin-text-muted">
                        <Clock size={12} />
                        <span>Live History</span>
                    </div>
                </div>

                <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-admin-text-muted">
                            <Clock size={32} className="mb-2 opacity-30" />
                            <p className="text-xs font-semibold">Belum ada riwayat aktivitas</p>
                            <p className="mt-0.5 text-[10px]">Aktivitas perubahan oleh akun admin akan tercatat di sini</p>
                        </div>
                    ) : (
                        notifications.map((act) => {
                            const { icon, color } = getActivityDetails(act.raw_title || act.title, act.type);
                            return (
                                <div
                                    key={act.id}
                                    className="group flex items-start gap-3 rounded-2xl border border-transparent p-2.5 transition-all duration-200 hover:border-admin-border/50 hover:bg-admin-card-hover/40"
                                >
                                    <div
                                        className={cn(
                                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105',
                                            color,
                                        )}
                                    >
                                        {icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-xs font-semibold text-admin-text">
                                                {act.title}
                                            </p>
                                            <span className="shrink-0 text-[10px] text-admin-text-muted">
                                                {act.time}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-[11px] leading-snug text-admin-text-muted line-clamp-2">
                                            {act.message}
                                        </p>
                                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-admin-text-muted/80">
                                            <span className="inline-block size-1.5 rounded-full bg-cyan-400" />
                                            <span>
                                                Oleh: <strong className="font-semibold text-admin-text">{act.triggered_by}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AnimeReveal>
    );
}

// ============================================================
// Sub-component: Quick Access Card
// ============================================================
function QuickAccessCard({
    onNavigate,
}: {
    onNavigate: (tab: string) => void;
}) {
    const quickLinks = [
        {
            label: 'Hero Beranda',
            tab: 'Hero Beranda',
            icon: <Home size={13} />,
        },
        {
            label: 'Galeri Foto',
            tab: 'Galeri Foto',
            icon: <Images size={13} />,
        },
        {
            label: 'Daftar Pengadaan',
            tab: 'Daftar Pengadaan',
            icon: <ShoppingCart size={13} />,
        },
        {
            label: 'Daftar Portfolio',
            tab: 'Daftar Portfolio',
            icon: <FolderKanban size={13} />,
        },
        { label: 'Data User', tab: 'Data User', icon: <Users size={13} /> },
        { label: 'Footer', tab: 'Footer', icon: <LayoutTemplate size={13} /> },
        // { label: 'Pengaturan', tab: 'Pengaturan', icon: <Shield size={13} /> },
    ];

    return (
        <AnimeReveal delay={950} distance={20}>
            <div className="rounded-[2rem] border border-admin-border bg-admin-card p-6 shadow-sm">
                <div className="mb-5">
                    <h3 className="text-base font-bold text-admin-text">
                        Akses Cepat
                    </h3>
                    <p className="mt-0.5 text-[10px] text-admin-text-muted">
                        Navigasi langsung ke modul yang sering digunakan
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((link) => (
                        <button
                            key={link.tab}
                            type="button"
                            onClick={() => onNavigate(link.tab)}
                            className="group flex cursor-pointer items-center gap-2.5 rounded-xl border border-admin-border bg-admin-bg/50 px-3 py-2.5 text-left text-admin-text-muted transition-all duration-200 hover:border-admin-accent/30 hover:bg-admin-card-hover hover:text-admin-text"
                        >
                            <span className="shrink-0 text-admin-accent transition-transform group-hover:scale-110">
                                {link.icon}
                            </span>
                            <span className="truncate text-[10px] font-bold">
                                {link.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </AnimeReveal>
    );
}

// ============================================================
// Main Export: AdminDashboard
// ============================================================
export default function AdminDashboard({
    activeTab,
    recentProjects,
    pageProps,
}: AdminDashboardProps) {
    const renderContent = () => {
        switch (activeTab) {
            case 'Hero Beranda':
                return (
                    <HeroSectionEditor
                        key={`${pageProps?.heroUserId}-${pageProps?.heroSection?.updated_at || 'empty'}`}
                        heroSection={pageProps?.heroSection}
                        heroUserId={pageProps?.heroUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Tentang Kami':
                return (
                    <AboutSectionEditor
                        key={pageProps?.aboutSection?.updated_at || 'empty'}
                        aboutSection={pageProps?.aboutSection}
                    />
                );
            case 'Layanan':
                return (
                    <LayananSectionEditor
                        key={pageProps?.layananSection?.updated_at || 'empty'}
                        layananSection={pageProps?.layananSection}
                    />
                );
            case 'Statistik':
                return (
                    <StatistikSectionEditor
                        key={pageProps?.statistikSection?.updated_at || 'empty'}
                        statistikSection={pageProps?.statistikSection}
                    />
                );
            case 'Partner':
                return (
                    <PartnerSectionEditor
                        key={pageProps?.partnerSection?.updated_at || 'empty'}
                        partnerSection={pageProps?.partnerSection}
                    />
                );
            case 'Call to Action':
                return (
                    <CtaSectionEditor
                        key={pageProps?.ctaSection?.updated_at || 'cta'}
                        ctaSection={pageProps?.ctaSection}
                    />
                );
            case 'SEO Beranda':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'beranda'}
                        pageTitle="Halaman Beranda"
                        pageType="beranda"
                        seoData={pageProps?.seoData}
                    />
                );
            case 'Hero Tentang Kami':
                return (
                    <HeroTentangEditor
                        key={`${pageProps?.heroUserId || 'hero-tentang'}-${pageProps?.heroTentang?.updated_at || 'new'}`}
                        heroTentang={pageProps?.heroTentang}
                        heroUserId={pageProps?.heroUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Profil Perusahaan':
                return (
                    <ProfilPerusahaanEditor
                        key={
                            pageProps?.profilSection?.updated_at ||
                            'profil-perusahaan'
                        }
                        profilSection={pageProps?.profilSection}
                    />
                );
            case 'Visi & Misi':
                return (
                    <VisiMisiEditor
                        key={
                            pageProps?.visiMisiSection?.updated_at ||
                            'visi-misi'
                        }
                        visiMisiSection={pageProps?.visiMisiSection}
                    />
                );
            case 'Tim Kami':
                return (
                    <TimKamiEditor
                        key={pageProps?.timSection?.updated_at || 'tim-kami'}
                        timSection={pageProps?.timSection}
                    />
                );
            case 'Quote Tentang':
                return (
                    <QuoteTentangEditor
                        key={
                            pageProps?.quoteSection?.updated_at ||
                            'quote-tentang'
                        }
                        quoteSection={pageProps?.quoteSection}
                    />
                );
            case 'Partner Tentang':
                return (
                    <PartnerTentangEditor
                        key={
                            pageProps?.partnerSection?.updated_at ||
                            'partner-tentang'
                        }
                        partnerSection={pageProps?.partnerSection}
                    />
                );
            case 'SEO Tentang Kami':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'tentang'}
                        pageTitle="Halaman Tentang Kami"
                        pageType="tentang"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== SERVIS ROUTES ==========
            case 'Hero Servis':
                return (
                    <HeroServisEditor
                        key={`${pageProps?.heroServisUserId}-${pageProps?.heroServis?.updated_at || 'empty'}`}
                        heroServis={pageProps?.heroServis}
                        heroServisUserId={pageProps?.heroServisUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Hero Detail Servis':
                return (
                    <HeroDetailServisEditor
                        key={`${pageProps?.heroServisDetailUserId}-${pageProps?.heroServisDetail?.updated_at || 'empty'}`}
                        heroServisDetail={pageProps?.heroServisDetail}
                        heroServisDetailUserId={pageProps?.heroServisDetailUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Daftar Servis':
                return (
                    <DaftarServisSectionEditor
                        key={
                            pageProps?.daftarServisSection?.updated_at ||
                            'empty'
                        }
                        daftarServisSection={pageProps?.daftarServisSection}
                    />
                );
            case 'SEO Servis':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'servis'}
                        pageTitle="Halaman Servis"
                        pageType="servis"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== KEBIJAKAN ROUTES ==========
            case 'Hero Kebijakan':
                return (
                    <HeroKebijakanEditor
                        key={`${pageProps?.heroKebijakanUserId}-${pageProps?.heroKebijakan?.updated_at || 'empty'}`}
                        heroKebijakan={pageProps?.heroKebijakan}
                        heroKebijakanUserId={pageProps?.heroKebijakanUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Kebijakan PEB':
                return (
                    <KebijakanPebEditor
                        key={
                            pageProps?.kebijakanPebSection?.updated_at ||
                            'kebijakan-peb'
                        }
                        kebijakanPebSection={pageProps?.kebijakanPebSection}
                    />
                );
            case 'SEO Kebijakan':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'kebijakan'}
                        pageTitle="Halaman Kebijakan"
                        pageType="kebijakan"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== GALERI ROUTES ==========
            case 'Hero Galeri':
                return (
                    <HeroGaleriEditor
                        key={pageProps?.heroGaleri?.updated_at || 'hero-galeri'}
                        heroGaleri={pageProps?.heroGaleri}
                        heroGaleriUserId={pageProps?.heroGaleriUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Galeri Foto':
                return (
                    <CollectionManager
                        kind="gallery"
                        section={pageProps?.galeriFotoSection}
                    />
                );
            case 'SEO Galeri':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'galeri'}
                        pageTitle="Halaman Galeri"
                        pageType="galeri"
                        seoData={pageProps?.seoData}
                    />
                );

            case 'Hero Laporan':
                return (
                    <HeroLaporanEditor
                        key={`${pageProps?.heroUserId}-${pageProps?.heroLaporan?.updated_at || 'empty'}`}
                        heroLaporan={pageProps?.heroLaporan}
                        heroUserId={pageProps?.heroUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Laporan Keuangan':
                return (
                    <CollectionManager
                        kind="finance"
                        section={pageProps?.laporanKeuanganSection}
                    />
                );
            case 'Laporan Tahunan':
                return (
                    <CollectionManager
                        kind="annual"
                        section={pageProps?.laporanTahunanSection}
                    />
                );
            case 'SEO Laporan':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'laporan'}
                        pageTitle="Halaman Laporan"
                        pageType="laporan"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== BERITA ROUTES ==========
            case 'Hero Section Berita':
                return (
                    <HeroBeritaEditor
                        key={`${pageProps?.heroUserId}-${pageProps?.heroBerita?.updated_at || 'empty'}`}
                        heroBerita={pageProps?.heroBerita}
                        heroUserId={pageProps?.heroUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Daftar Berita':
                return (
                    <CollectionManager
                        kind="news"
                        section={pageProps?.beritaSection}
                    />
                );
            case 'SEO Berita':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'berita'}
                        pageTitle="Halaman Berita"
                        pageType="berita"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== PENGADAAN ROUTES ==========
            case 'Hero Pengadaan':
                return (
                    <HeroPengadaanEditor
                        key={`${pageProps?.heroUserId}-${pageProps?.heroPengadaan?.updated_at || 'empty'}`}
                        heroPengadaan={pageProps?.heroPengadaan}
                        heroUserId={pageProps?.heroUserId}
                    />
                );
            case 'Daftar Pengadaan':
                return (
                    <DaftarPengadaanEditor
                        key={`${pageProps?.daftarPengadaan?.id ?? 'loading'}-${pageProps?.daftarPengadaan?.updated_at ?? 'empty'}`}
                        daftarPengadaan={pageProps?.daftarPengadaan}
                    />
                );
            case 'SEO Pengadaan':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'pengadaan'}
                        pageTitle="Halaman Pengadaan"
                        pageType="pengadaan"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== PORTFOLIO ROUTES ==========
            case 'Hero Portfolio':
                return (
                    <HeroPortfolioEditor
                        key={`${pageProps?.heroPortfolioUserId || 'portfolio'}-${pageProps?.heroPortfolio?.updated_at || 'new'}`}
                        heroPortfolio={pageProps?.heroPortfolio}
                        heroPortfolioUserId={pageProps?.heroPortfolioUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Portofolio':
            case 'Daftar Portfolio':
                return (
                    <CollectionManager
                        kind="portfolio"
                        section={pageProps?.daftarPortfolioSection}
                    />
                );
            case 'SEO Portfolio':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'portfolio'}
                        pageTitle="Halaman Portfolio"
                        pageType="portfolio"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== HUBUNGI KAMI ROUTES ==========
            case 'Hero Hubungi Kami':
                return (
                    <HeroKontakEditor
                        key={`${pageProps?.heroUserId || 'kontak'}-${pageProps?.heroKontak?.updated_at || 'new'}`}
                        heroKontak={pageProps?.heroKontak}
                        heroUserId={pageProps?.heroUserId}
                        adminUsers={pageProps?.adminUsers}
                    />
                );
            case 'Kontak Masuk':
                return (
                    <KontakMasukManager
                        messages={pageProps?.contactMessages || []}
                    />
                );
            case 'SEO Hubungi Kami':
                return (
                    <SeoEditor
                        key={pageProps?.seoData?.updated_at || 'kontak'}
                        pageTitle="Halaman Hubungi Kami"
                        pageType="kontak"
                        seoData={pageProps?.seoData}
                    />
                );

            // ========== FOOTER ==========
            case 'Footer':
                return <FooterEditor footer={pageProps?.footer} />;

            // ========== HEADER ==========
            case 'Header':
                return <HeaderEditor header={pageProps?.header} />;

            // ========== MASTER DATA ==========
            case 'Data Role':
                if (!pageProps?.roles) {
                    return (
                        <div className="p-8 text-center text-admin-text-muted">
                            Memuat Data Role...
                        </div>
                    );
                }

                return (
                    <DataRoleEditor
                        roles={pageProps.roles}
                        permissions={pageProps.permissions}
                    />
                );
            case 'Data User':
                if (!pageProps?.users) {
                    return (
                        <div className="p-8 text-center text-admin-text-muted">
                            Memuat Data User...
                        </div>
                    );
                }

                return (
                    <DataUserEditor
                        users={pageProps.users}
                        roles={pageProps.allRoles}
                        filters={pageProps.filters}
                    />
                );

            // ========== PROFIL & PENGATURAN ==========
            case 'Profil':
                return <ProfilEditor />;
            case 'Pengaturan':
                return <PengaturanEditor />;

            case 'Dashboard':
            default:
                return (
                    <>
                        {/* Module Overview */}
                        <AnimeReveal delay={820} distance={20}>
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-admin-text">
                                    Modul Halaman
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Klik modul untuk langsung mengelola
                                    kontennya
                                </p>
                            </div>
                        </AnimeReveal>
                        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                            {(
                                [
                                    {
                                        name: 'Beranda',
                                        icon: <Home size={20} />,
                                        sections: 8,
                                        status: 'complete',
                                        color: 'bg-admin-accent/10 text-admin-accent',
                                        tab: 'Hero Beranda',
                                    },
                                    {
                                        name: 'Tentang Kami',
                                        icon: <Info size={20} />,
                                        sections: 7,
                                        status: 'complete',
                                        color: 'bg-blue-500/10 text-blue-400',
                                        tab: 'Hero Tentang Kami',
                                    },
                                    {
                                        name: 'Servis',
                                        icon: <Wrench size={20} />,
                                        sections: 4,
                                        status: 'complete',
                                        color: 'bg-emerald-500/10 text-emerald-400',
                                        tab: 'Hero Servis',
                                    },
                                    {
                                        name: 'Kebijakan',
                                        icon: <ScrollText size={20} />,
                                        sections: 3,
                                        status: 'complete',
                                        color: 'bg-purple-500/10 text-purple-400',
                                        tab: 'Hero Kebijakan',
                                    },
                                    {
                                        name: 'Galeri',
                                        icon: <Images size={20} />,
                                        sections: 3,
                                        status: 'complete',
                                        color: 'bg-pink-500/10 text-pink-400',
                                        tab: 'Hero Galeri',
                                    },
                                    {
                                        name: 'Berita',
                                        icon: <FileText size={20} />,
                                        sections: 3,
                                        status: 'complete',
                                        color: 'bg-emerald-500/10 text-emerald-400',
                                        tab: 'Hero Section Berita',
                                    },
                                    {
                                        name: 'Pengadaan',
                                        icon: <ShoppingCart size={20} />,
                                        sections: 4,
                                        status: 'complete',
                                        color: 'bg-orange-500/10 text-orange-400',
                                        tab: 'Hero Pengadaan',
                                    },
                                    {
                                        name: 'Portfolio',
                                        icon: <FolderKanban size={20} />,
                                        sections: 3,
                                        status: 'complete',
                                        color: 'bg-cyan-500/10 text-cyan-400',
                                        tab: 'Hero Portfolio',
                                    },
                                    {
                                        name: 'Hubungi Kami',
                                        icon: <Headset size={20} />,
                                        sections: 2,
                                        status: 'complete',
                                        color: 'bg-teal-500/10 text-teal-400',
                                        tab: 'Hero Hubungi Kami',
                                    },
                                    {
                                        name: 'Footer',
                                        icon: <LayoutTemplate size={20} />,
                                        sections: 5,
                                        status: 'partial',
                                        color: 'bg-indigo-500/10 text-indigo-400',
                                        tab: 'Footer',
                                    },
                                    {
                                        name: 'Master Data',
                                        icon: <Database size={20} />,
                                        sections: 2,
                                        status: 'complete',
                                        color: 'bg-teal-500/10 text-teal-400',
                                        tab: 'Data User',
                                    },
                                    {
                                        name: 'SEO Global',
                                        icon: <Globe size={20} />,
                                        sections: 8,
                                        status: 'partial',
                                        color: 'bg-rose-500/10 text-rose-400',
                                        tab: 'SEO Beranda',
                                    },
                                    {
                                        name: 'Pengguna',
                                        icon: <Users size={20} />,
                                        sections: 2,
                                        status: 'complete',
                                        color: 'bg-violet-500/10 text-violet-400',
                                        tab: 'Data User',
                                    },
                                ] as ModuleItem[]
                            ).map((mod, idx) => (
                                <ModuleCard
                                    key={mod.name}
                                    mod={mod}
                                    delay={870 + idx * 30}
                                    onNavigate={(tab) => {
                                        // Trigger navigation via setActiveTab — passed through props
                                        const event = new CustomEvent(
                                            'admin-navigate',
                                            { detail: tab },
                                        );
                                        window.dispatchEvent(event);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Bottom Row: Activity + Quick Access */}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <RecentActivityCard />
                            <QuickAccessCard
                                onNavigate={(tab) => {
                                    const event = new CustomEvent(
                                        'admin-navigate',
                                        { detail: tab },
                                    );
                                    window.dispatchEvent(event);
                                }}
                            />
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="custom-scrollbar z-10 flex-1 overflow-y-auto scroll-smooth p-4 sm:p-6 lg:p-8">
            {/* Page Heading */}
            <AnimeReveal delay={800} distance={20}>
                <div className="mb-6 border-b border-admin-border/60 pb-5">
                    <h2 className="text-3xl font-black tracking-tight text-admin-text">
                        {activeTab}
                    </h2>
                    <p className="mt-1 text-xs font-normal text-admin-text-muted">
                        Halaman ini menampilkan data terkait{' '}
                        {activeTab.toLowerCase()}.
                    </p>
                </div>
            </AnimeReveal>

            {renderContent()}
        </div>
    );
}
