import { router, usePage } from '@inertiajs/react';
import { update as updatePreferences } from '@/routes/panel-admin/preferences';
import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import {
    Settings,
    Bell,
    Globe,
    Moon,
    Sun,
    Monitor,
    Save,
    RotateCcw,
    Eye,
    Shield,
    Clock,
    Database,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';
import AdminSelect from '@/components/panel-admin/admin-select';

type ThemeMode = 'light' | 'dark' | 'system';
type TabType = 'tampilan' | 'notifikasi' | 'keamanan' | 'sistem';

interface ToggleProps {
    enabled: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description: string;
}

function ToggleRow({ enabled, onChange, label, description }: ToggleProps) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border/60 bg-admin-bg/30 p-4">
            <div className="min-w-0 flex-1 pr-4">
                <p className="text-sm font-bold text-admin-text">{label}</p>
                <p className="mt-0.5 text-[10px] text-admin-text-muted">
                    {description}
                </p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={cn(
                    'shrink-0 cursor-pointer transition-colors duration-200',
                    enabled ? 'text-admin-accent' : 'text-admin-text-muted/40',
                )}
            >
                {enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
        </div>
    );
}

export default function PengaturanEditor() {
    const saved = usePage().props.cmsPreferences as
        | Record<string, string | boolean>
        | undefined;
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('tampilan');

    // Tampilan
    const [themeMode, setThemeMode] = useState<ThemeMode>(
        (saved?.themeMode as ThemeMode) ?? 'dark',
    );
    const [language, setLanguage] = useState(
        (saved?.language as string) ?? 'Indonesia',
    );
    const [timezone, setTimezone] = useState(
        (saved?.timezone as string) ?? 'Asia/Jakarta (WIB)',
    );
    const [sidebarCollapsed, setSidebarCollapsed] = useState(
        (saved?.sidebarCollapsed as boolean) ?? false,
    );
    const [compactMode, setCompactMode] = useState(
        (saved?.compactMode as boolean) ?? false,
    );
    const [animationsEnabled, setAnimationsEnabled] = useState(
        (saved?.animationsEnabled as boolean) ?? true,
    );

    // Notifikasi
    const [emailNotif, setEmailNotif] = useState(
        (saved?.emailNotif as boolean) ?? true,
    );
    const [browserNotif, setBrowserNotif] = useState(
        (saved?.browserNotif as boolean) ?? true,
    );
    const [procurementAlert, setProcurementAlert] = useState(
        (saved?.procurementAlert as boolean) ?? true,
    );
    const [reportAlert, setReportAlert] = useState(
        (saved?.reportAlert as boolean) ?? true,
    );
    const [userActivityAlert, setUserActivityAlert] = useState(
        (saved?.userActivityAlert as boolean) ?? false,
    );
    const [systemAlert, setSystemAlert] = useState(
        (saved?.systemAlert as boolean) ?? true,
    );

    // Keamanan
    const [twoFactor, setTwoFactor] = useState(
        (saved?.twoFactor as boolean) ?? false,
    );
    const [sessionTimeout, setSessionTimeout] = useState(
        (saved?.sessionTimeout as string) ?? '60 Menit',
    );
    const [loginNotif, setLoginNotif] = useState(
        (saved?.loginNotif as boolean) ?? true,
    );
    const [ipWhitelist, setIpWhitelist] = useState(
        (saved?.ipWhitelist as string) ?? '',
    );

    // Sistem
    const [maintenanceMode, setMaintenanceMode] = useState(
        (saved?.maintenanceMode as boolean) ?? false,
    );
    const [debugMode, setDebugMode] = useState(
        (saved?.debugMode as boolean) ?? false,
    );
    const [cacheEnabled, setCacheEnabled] = useState(
        (saved?.cacheEnabled as boolean) ?? true,
    );
    const [autoBackup, setAutoBackup] = useState(
        (saved?.autoBackup as boolean) ?? true,
    );
    const [backupFrequency, setBackupFrequency] = useState(
        (saved?.backupFrequency as string) ?? 'Harian',
    );

    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);

    const handleReset = () => {
        setThemeMode((saved?.themeMode as ThemeMode) ?? 'dark');
        setLanguage((saved?.language as string) ?? 'Indonesia');
        setTimezone((saved?.timezone as string) ?? 'Asia/Jakarta (WIB)');
        setSidebarCollapsed((saved?.sidebarCollapsed as boolean) ?? false);
        setCompactMode((saved?.compactMode as boolean) ?? false);
        setAnimationsEnabled((saved?.animationsEnabled as boolean) ?? true);
        setEmailNotif((saved?.emailNotif as boolean) ?? true);
        setBrowserNotif((saved?.browserNotif as boolean) ?? true);
        setProcurementAlert((saved?.procurementAlert as boolean) ?? true);
        setReportAlert((saved?.reportAlert as boolean) ?? true);
        setUserActivityAlert((saved?.userActivityAlert as boolean) ?? false);
        setSystemAlert((saved?.systemAlert as boolean) ?? true);
        setTwoFactor((saved?.twoFactor as boolean) ?? false);
        setSessionTimeout((saved?.sessionTimeout as string) ?? '60 Menit');
        setLoginNotif((saved?.loginNotif as boolean) ?? true);
        setIpWhitelist((saved?.ipWhitelist as string) ?? '');
        setMaintenanceMode((saved?.maintenanceMode as boolean) ?? false);
        setDebugMode((saved?.debugMode as boolean) ?? false);
        setCacheEnabled((saved?.cacheEnabled as boolean) ?? true);
        setAutoBackup((saved?.autoBackup as boolean) ?? true);
        setBackupFrequency((saved?.backupFrequency as string) ?? 'Harian');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(
            updatePreferences.url(),
            {
                themeMode,
                language,
                timezone,
                sidebarCollapsed,
                compactMode,
                animationsEnabled,
                emailNotif,
                browserNotif,
                procurementAlert,
                reportAlert,
                userActivityAlert,
                systemAlert,
                twoFactor,
                sessionTimeout,
                loginNotif,
                ipWhitelist,
                maintenanceMode,
                debugMode,
                cacheEnabled,
                autoBackup,
                backupFrequency,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setToastType('success');
                    setToastMessage('Preferensi pengaturan berhasil disimpan.');
                    setShowToast(true);
                    localStorage.setItem('theme', themeMode);
                    window.dispatchEvent(
                        new CustomEvent('cms-preferences-saved', {
                            detail: { themeMode, sidebarCollapsed },
                        }),
                    );
                },
                onError: (errors) => {
                    setToastType('error');
                    setToastMessage(Object.values(errors).join('\n'));
                    setShowToast(true);
                },
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
        { key: 'tampilan', label: 'Tampilan', icon: <Monitor size={13} /> },
        { key: 'notifikasi', label: 'Notifikasi', icon: <Bell size={13} /> },
        { key: 'keamanan', label: 'Keamanan', icon: <Shield size={13} /> },
        { key: 'sistem', label: 'Sistem', icon: <Database size={13} /> },
    ];

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <Settings size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-admin-text">
                                    Pengaturan
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Konfigurasi tampilan, notifikasi, keamanan,
                                    dan sistem.
                                </p>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="mb-6 grid grid-cols-4 gap-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={cn(
                                        'flex cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2.5 text-[10px] font-bold transition-all',
                                        activeTab === tab.key
                                            ? 'border border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                            : 'border border-transparent text-admin-text-muted hover:text-admin-text',
                                    )}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            {/* ── Tab: Tampilan ─────────────────────────── */}
                            {activeTab === 'tampilan' && (
                                <div className="space-y-5">
                                    {/* Theme Mode */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            Mode Tema
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(
                                                [
                                                    {
                                                        key: 'light',
                                                        label: 'Terang',
                                                        icon: <Sun size={18} />,
                                                    },
                                                    {
                                                        key: 'dark',
                                                        label: 'Gelap',
                                                        icon: (
                                                            <Moon size={18} />
                                                        ),
                                                    },
                                                    {
                                                        key: 'system',
                                                        label: 'Sistem',
                                                        icon: (
                                                            <Monitor
                                                                size={18}
                                                            />
                                                        ),
                                                    },
                                                ] as const
                                            ).map((t) => (
                                                <button
                                                    key={t.key}
                                                    type="button"
                                                    onClick={() =>
                                                        setThemeMode(t.key)
                                                    }
                                                    className={cn(
                                                        'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-4 transition-all',
                                                        themeMode === t.key
                                                            ? 'border-admin-accent/40 bg-admin-accent/10 text-admin-accent'
                                                            : 'border-admin-border bg-admin-bg/50 text-admin-text-muted hover:border-admin-accent/20',
                                                    )}
                                                >
                                                    {t.icon}
                                                    <span className="text-xs font-bold">
                                                        {t.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                <Globe size={11} /> Bahasa
                                            </label>
                                            <AdminSelect
                                                value={language}
                                                onValueChange={setLanguage}
                                                options={[
                                                    'Indonesia',
                                                    'English',
                                                ]}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                <Clock size={11} /> Zona Waktu
                                            </label>
                                            <AdminSelect
                                                value={timezone}
                                                onValueChange={setTimezone}
                                                options={[
                                                    'Asia/Jakarta (WIB)',
                                                    'Asia/Makassar (WITA)',
                                                    'Asia/Jayapura (WIT)',
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <ToggleRow
                                            enabled={sidebarCollapsed}
                                            onChange={setSidebarCollapsed}
                                            label="Sidebar Collapsed Default"
                                            description="Sidebar dimulai dalam kondisi terlipat saat pertama dibuka"
                                        />
                                        <ToggleRow
                                            enabled={compactMode}
                                            onChange={setCompactMode}
                                            label="Mode Kompak"
                                            description="Kurangi padding dan spasi untuk tampilan lebih padat"
                                        />
                                        <ToggleRow
                                            enabled={animationsEnabled}
                                            onChange={setAnimationsEnabled}
                                            label="Animasi UI"
                                            description="Aktifkan transisi dan animasi pada antarmuka"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Notifikasi ───────────────────────── */}
                            {activeTab === 'notifikasi' && (
                                <div className="space-y-3">
                                    <ToggleRow
                                        enabled={emailNotif}
                                        onChange={setEmailNotif}
                                        label="Notifikasi Email"
                                        description="Terima ringkasan aktivitas melalui email"
                                    />
                                    <ToggleRow
                                        enabled={browserNotif}
                                        onChange={setBrowserNotif}
                                        label="Notifikasi Browser"
                                        description="Tampilkan notifikasi push di browser"
                                    />
                                    <div className="border-t border-admin-border/50 pt-2">
                                        <p className="mb-3 text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                            Jenis Notifikasi
                                        </p>
                                        <div className="space-y-3">
                                            <ToggleRow
                                                enabled={procurementAlert}
                                                onChange={setProcurementAlert}
                                                label="Pengadaan Baru"
                                                description="Notifikasi saat ada tender atau pengadaan baru"
                                            />
                                            <ToggleRow
                                                enabled={reportAlert}
                                                onChange={setReportAlert}
                                                label="Laporan Diunggah"
                                                description="Notifikasi saat laporan baru diunggah"
                                            />
                                            <ToggleRow
                                                enabled={userActivityAlert}
                                                onChange={setUserActivityAlert}
                                                label="Aktivitas User"
                                                description="Notifikasi saat ada login atau perubahan user"
                                            />
                                            <ToggleRow
                                                enabled={systemAlert}
                                                onChange={setSystemAlert}
                                                label="Peringatan Sistem"
                                                description="Notifikasi error atau peringatan sistem kritis"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Keamanan ─────────────────────────── */}
                            {activeTab === 'keamanan' && (
                                <div className="space-y-5">
                                    <ToggleRow
                                        enabled={twoFactor}
                                        onChange={setTwoFactor}
                                        label="Autentikasi Dua Faktor (2FA)"
                                        description="Tambahkan lapisan keamanan ekstra saat login"
                                    />
                                    <ToggleRow
                                        enabled={loginNotif}
                                        onChange={setLoginNotif}
                                        label="Notifikasi Login"
                                        description="Kirim email saat ada login baru ke akun Anda"
                                    />

                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            <Clock size={11} /> Timeout Sesi
                                        </label>
                                        <AdminSelect
                                            value={sessionTimeout}
                                            onValueChange={setSessionTimeout}
                                            options={[
                                                '15 Menit',
                                                '30 Menit',
                                                '60 Menit',
                                                '2 Jam',
                                                '8 Jam',
                                                'Tidak Pernah',
                                            ]}
                                        />
                                        <p className="text-[10px] text-admin-text-muted">
                                            Sesi akan berakhir otomatis setelah
                                            tidak aktif selama waktu yang
                                            ditentukan.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                            IP Whitelist (Opsional)
                                        </label>
                                        <textarea
                                            value={ipWhitelist}
                                            onChange={(e) =>
                                                setIpWhitelist(e.target.value)
                                            }
                                            rows={3}
                                            className="w-full resize-none rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4 font-mono text-sm text-admin-text outline-hidden transition-all focus:border-admin-accent"
                                            placeholder="192.168.1.1&#10;10.0.0.0/24&#10;(satu IP per baris)"
                                        />
                                        <p className="text-[10px] text-admin-text-muted">
                                            Kosongkan untuk mengizinkan semua
                                            IP. Isi untuk membatasi akses hanya
                                            dari IP tertentu.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Sistem ───────────────────────────── */}
                            {activeTab === 'sistem' && (
                                <div className="space-y-5">
                                    <div className="space-y-3">
                                        <ToggleRow
                                            enabled={maintenanceMode}
                                            onChange={setMaintenanceMode}
                                            label="Mode Maintenance"
                                            description="Tampilkan halaman maintenance ke pengunjung publik"
                                        />
                                        <ToggleRow
                                            enabled={debugMode}
                                            onChange={setDebugMode}
                                            label="Mode Debug"
                                            description="Aktifkan logging detail untuk debugging (jangan di production)"
                                        />
                                        <ToggleRow
                                            enabled={cacheEnabled}
                                            onChange={setCacheEnabled}
                                            label="Cache Aktif"
                                            description="Aktifkan caching untuk performa lebih cepat"
                                        />
                                        <ToggleRow
                                            enabled={autoBackup}
                                            onChange={setAutoBackup}
                                            label="Backup Otomatis"
                                            description="Backup database secara otomatis sesuai jadwal"
                                        />
                                    </div>

                                    {autoBackup && (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                                Frekuensi Backup
                                            </label>
                                            <AdminSelect
                                                value={backupFrequency}
                                                onValueChange={
                                                    setBackupFrequency
                                                }
                                                options={[
                                                    'Setiap Jam',
                                                    'Harian',
                                                    'Mingguan',
                                                    'Bulanan',
                                                ]}
                                            />
                                        </div>
                                    )}

                                    {maintenanceMode && (
                                        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
                                                <Settings
                                                    size={16}
                                                    className="text-amber-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-amber-400">
                                                    Mode Maintenance Aktif
                                                </p>
                                                <p className="text-[10px] text-amber-400/70">
                                                    Pengunjung publik akan
                                                    melihat halaman maintenance.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

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

            {/* Preview Panel */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <div className="relative flex h-[700px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Ringkasan Pengaturan
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>
                        <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
                            {activeTab === 'keamanan' ||
                            activeTab === 'sistem' ? (
                                <p className="rounded-xl border border-admin-border p-3 text-xs text-admin-text-muted">
                                    Pilihan di bagian ini disimpan sebagai
                                    preferensi. Aktivasi keamanan, maintenance,
                                    cache, dan backup mengikuti konfigurasi
                                    layanan yang aktif.
                                </p>
                            ) : null}
                            {/* Tampilan */}
                            <div className="space-y-2 rounded-2xl border border-admin-border bg-admin-bg/30 p-4">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-admin-accent uppercase">
                                    <Monitor size={10} /> Tampilan
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                    <div>
                                        <span className="text-admin-text-muted">
                                            Tema:
                                        </span>{' '}
                                        <span className="font-bold text-admin-text capitalize">
                                            {themeMode}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-admin-text-muted">
                                            Bahasa:
                                        </span>{' '}
                                        <span className="font-bold text-admin-text">
                                            {language}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-admin-text-muted">
                                            Animasi:
                                        </span>{' '}
                                        <span
                                            className={cn(
                                                'font-bold',
                                                animationsEnabled
                                                    ? 'text-emerald-400'
                                                    : 'text-red-400',
                                            )}
                                        >
                                            {animationsEnabled
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-admin-text-muted">
                                            Kompak:
                                        </span>{' '}
                                        <span
                                            className={cn(
                                                'font-bold',
                                                compactMode
                                                    ? 'text-emerald-400'
                                                    : 'text-admin-text-muted',
                                            )}
                                        >
                                            {compactMode ? 'Ya' : 'Tidak'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Notifikasi */}
                            <div className="space-y-2 rounded-2xl border border-admin-border bg-admin-bg/30 p-4">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-admin-accent uppercase">
                                    <Bell size={10} /> Notifikasi
                                </p>
                                <div className="space-y-1">
                                    {[
                                        { label: 'Email', val: emailNotif },
                                        { label: 'Browser', val: browserNotif },
                                        {
                                            label: 'Pengadaan',
                                            val: procurementAlert,
                                        },
                                        { label: 'Laporan', val: reportAlert },
                                        {
                                            label: 'Aktivitas User',
                                            val: userActivityAlert,
                                        },
                                        { label: 'Sistem', val: systemAlert },
                                    ].map((n) => (
                                        <div
                                            key={n.label}
                                            className="flex items-center justify-between text-[10px]"
                                        >
                                            <span className="text-admin-text-muted">
                                                {n.label}
                                            </span>
                                            <span
                                                className={cn(
                                                    'font-bold',
                                                    n.val
                                                        ? 'text-emerald-400'
                                                        : 'text-admin-text-muted/40',
                                                )}
                                            >
                                                {n.val ? '● Aktif' : '○ Off'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Keamanan */}
                            <div className="space-y-2 rounded-2xl border border-admin-border bg-admin-bg/30 p-4">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-admin-accent uppercase">
                                    <Shield size={10} /> Keamanan
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                    <div>
                                        <span className="text-admin-text-muted">
                                            2FA:
                                        </span>{' '}
                                        <span
                                            className={cn(
                                                'font-bold',
                                                twoFactor
                                                    ? 'text-emerald-400'
                                                    : 'text-red-400',
                                            )}
                                        >
                                            {twoFactor ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-admin-text-muted">
                                            Timeout:
                                        </span>{' '}
                                        <span className="font-bold text-admin-text">
                                            {sessionTimeout}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Sistem */}
                            <div className="space-y-2 rounded-2xl border border-admin-border bg-admin-bg/30 p-4">
                                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-admin-accent uppercase">
                                    <Database size={10} /> Sistem
                                </p>
                                <div className="space-y-1">
                                    {[
                                        {
                                            label: 'Maintenance',
                                            val: maintenanceMode,
                                            warn: true,
                                        },
                                        {
                                            label: 'Debug Mode',
                                            val: debugMode,
                                            warn: true,
                                        },
                                        { label: 'Cache', val: cacheEnabled },
                                        {
                                            label: 'Auto Backup',
                                            val: autoBackup,
                                        },
                                    ].map((s) => (
                                        <div
                                            key={s.label}
                                            className="flex items-center justify-between text-[10px]"
                                        >
                                            <span className="text-admin-text-muted">
                                                {s.label}
                                            </span>
                                            <span
                                                className={cn(
                                                    'font-bold',
                                                    s.val
                                                        ? s.warn
                                                            ? 'text-amber-400'
                                                            : 'text-emerald-400'
                                                        : 'text-admin-text-muted/40',
                                                )}
                                            >
                                                {s.val ? '● Aktif' : '○ Off'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>RINGKASAN PENGATURAN</span>
                            <span>REAL-TIME SYNC</span>
                        </div>
                    </div>
                </AnimeReveal>
            </div>

            <AdminToast
                show={showToast}
                type={toastType}
                message={toastMessage}
            />
        </div>
    );
}
