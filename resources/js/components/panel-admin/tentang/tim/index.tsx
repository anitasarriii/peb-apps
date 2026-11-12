import { useCmsSave } from '@/hooks/use-cms-save';
import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Sparkles,
    RotateCcw,
    Save,
    Eye,
    Layout,
    Plus,
    Trash2,
    Users,
    ImageIcon,
    CheckCircle2,
} from 'lucide-react';
import { updateTim } from '@/actions/App/Http/Controllers/Admin/PanelAdminTentangController';
import AdminToast from '@/components/panel-admin/admin-toast';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    imageSourceType?: 'url' | 'upload';
    imageFileName?: string;
    imagePreviewUrl?: string;
    imageFile?: File; // Store actual File object
}

interface TimSectionData {
    id?: number;
    title: string;
    subtitle: string;
    members: TeamMember[];
    updated_at?: string;
}

interface TimKamiEditorProps {
    timSection?: TimSectionData | null;
}

const DEFAULT_TITLE = 'Tim Kepemimpinan';
const DEFAULT_SUBTITLE =
    'Dibalik keberhasilan PEB, terdapat para profesional berdedikasi tinggi dengan pengalaman luas di industri energi.';

const DEFAULT_MEMBERS: TeamMember[] = [
    {
        id: 'member-1',
        name: 'Rudi Hermawan',
        role: 'Komisaris Utama',
        image: 'https://i.pravatar.cc/400?u=rudi_h',
        imageSourceType: 'url',
    },
    {
        id: 'member-2',
        name: 'Slamet Riyadi',
        role: 'Komisaris',
        image: 'https://i.pravatar.cc/400?u=slamet',
        imageSourceType: 'url',
    },
    {
        id: 'member-3',
        name: 'Budi Santoso',
        role: 'Direktur Utama',
        image: 'https://i.pravatar.cc/400?u=budi',
        imageSourceType: 'url',
    },
    {
        id: 'member-4',
        name: 'Siti Aminah',
        role: 'Direktur Operasional',
        image: 'https://i.pravatar.cc/400?u=siti',
        imageSourceType: 'url',
    },
    {
        id: 'member-5',
        name: 'Hendra Wijaya',
        role: 'Direktur Keuangan',
        image: 'https://i.pravatar.cc/400?u=hendra',
        imageSourceType: 'url',
    },
    {
        id: 'member-6',
        name: 'Maya Putri',
        role: 'Direktur Teknik',
        image: 'https://i.pravatar.cc/400?u=maya',
        imageSourceType: 'url',
    },
];

export default function TimKamiEditor({ timSection }: TimKamiEditorProps) {
    const [title, setTitle] = useState(timSection?.title ?? DEFAULT_TITLE);
    const [subtitle, setSubtitle] = useState(
        timSection?.subtitle ?? DEFAULT_SUBTITLE,
    );

    const [members, setMembers] = useState<TeamMember[]>(
        timSection?.members ?? DEFAULT_MEMBERS,
    );

    const [activeEditIndex, setActiveEditIndex] = useState<number>(0);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleReset = () => {
        members.forEach((member) => {
            if (member.imagePreviewUrl) {
                URL.revokeObjectURL(member.imagePreviewUrl);
            }
        });

        setTitle(DEFAULT_TITLE);
        setSubtitle(DEFAULT_SUBTITLE);
        setMembers(DEFAULT_MEMBERS);
        setActiveEditIndex(0);
    };

    const handleAddMember = (defaultRole: string = 'Direktur') => {
        const newId = `member-${Date.now()}`;
        const newMember: TeamMember = {
            id: newId,
            name: 'Nama Pimpinan Baru',
            role: defaultRole,
            image: `https://i.pravatar.cc/400?u=${newId}`,
            imageSourceType: 'url',
        };

        setMembers((prev) => [...prev, newMember]);
        setActiveEditIndex(members.length);
    };

    const handleDeleteMember = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();

        const memberToDelete = members[index];
        const isKomisaris =
            memberToDelete.role.toLowerCase().includes('komisaris') ||
            memberToDelete.role.toLowerCase().includes('commissioner');

        if (isKomisaris) {
            const currentKomisarisCount = members.filter(
                (m) =>
                    m.role.toLowerCase().includes('komisaris') ||
                    m.role.toLowerCase().includes('commissioner'),
            ).length;
            if (currentKomisarisCount <= 1) {
                alert('Minimal harus memiliki 1 pimpinan di Dewan Komisaris.');
                return;
            }
        } else {
            const currentDireksiCount = members.filter(
                (m) =>
                    !m.role.toLowerCase().includes('komisaris') &&
                    !m.role.toLowerCase().includes('commissioner'),
            ).length;
            if (currentDireksiCount <= 1) {
                alert(
                    'Minimal harus memiliki 1 pimpinan di Dewan Direksi & Staff.',
                );
                return;
            }
        }

        const itemToRemove = members[index];
        if (itemToRemove.imagePreviewUrl) {
            URL.revokeObjectURL(itemToRemove.imagePreviewUrl);
        }

        const newItems = members.filter((_, idx) => idx !== index);
        setMembers(newItems);
        setActiveEditIndex(Math.max(0, index - 1));
    };

    const updateMemberField = (
        index: number,
        key: keyof TeamMember,
        value: any,
    ) => {
        setMembers((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [key]: value,
            };
            return updated;
        });
    };

    const handleFileChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadingImage(true);

        const currentMember = members[index];
        if (currentMember.imagePreviewUrl) {
            URL.revokeObjectURL(currentMember.imagePreviewUrl);
        }

        const localUrl = URL.createObjectURL(file);

        setUploadingImage(false);
        updateMemberField(index, 'image', localUrl);
        updateMemberField(index, 'imagePreviewUrl', localUrl);
        updateMemberField(index, 'imageFileName', file.name);
        updateMemberField(index, 'imageFile', file);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Bersihkan data File untuk imagePreviewUrl agar tidak dikirim ke backend
        const cleanedMembers = members.map((member) => {
            const m = { ...member };
            delete m.imagePreviewUrl;
            return m;
        });

        router.post(
            updateTim.url(),
            {
                title,
                subtitle,
                members: cleanedMembers,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setToastType('success');
                    setToastMessage('Tim Kepemimpinan berhasil diperbarui.');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                },
                onError: (errors) => {
                    console.error('[TimKamiEditor] Validation errors:', errors);
                    const firstError = Object.values(errors)[0] as string;
                    setToastType('error');
                    setToastMessage(
                        firstError ||
                            'Gagal menyimpan perubahan. Periksa kembali isian form.',
                    );
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 5000);
                },
                onFinish: () => {
                    setIsSaving(false);
                },
            },
        );
    };

    const currentEditMember = members[activeEditIndex] || members[0];

    const komisarisCount = members.filter(
        (m) =>
            m.role.toLowerCase().includes('komisaris') ||
            m.role.toLowerCase().includes('commissioner'),
    ).length;
    const direksiCount = members.filter(
        (m) =>
            !m.role.toLowerCase().includes('komisaris') &&
            !m.role.toLowerCase().includes('commissioner'),
    ).length;

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
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-admin-text">
                                        Tim Kepemimpinan
                                    </h3>
                                    <p className="mt-1 text-xs text-admin-text-muted">
                                        Sesuaikan judul section dan profil para
                                        direksi atau pimpinan perusahaan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Judul Section */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Judul Section
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Sub-judul Section
                                    </label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) =>
                                            setSubtitle(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-admin-border bg-admin-bg px-4 py-3.5 text-sm font-medium text-admin-text transition-all duration-300 outline-none hover:border-admin-accent/40 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                                    />
                                </div>
                            </div>

                            {/* Section Anggota Tim */}
                            <div className="space-y-4 border-t border-admin-border/50 pt-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                                        Daftar Pimpinan ({members.length})
                                    </label>
                                </div>

                                {/* Tabs Anggota */}
                                <div className="flex flex-col gap-6 rounded-2xl border border-admin-border/60 bg-admin-bg p-4">
                                    {/* Dewan Komisaris */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b border-admin-border/30 pb-2">
                                            <span className="block text-[10px] font-black tracking-widest text-[#eab308] uppercase">
                                                Dewan Komisaris
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddMember('Komisaris')
                                                }
                                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-[#eab308] transition-all duration-300 hover:bg-amber-500 hover:text-white"
                                            >
                                                <Plus size={12} /> Tambah
                                                Pimpinan
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {komisarisCount === 0 ? (
                                                <span className="py-1 text-[11px] text-admin-text-muted italic">
                                                    Belum ada Dewan Komisaris.
                                                    Klik tambah untuk
                                                    menambahkan.
                                                </span>
                                            ) : (
                                                members.map((member, idx) => {
                                                    const isKomisaris =
                                                        member.role
                                                            .toLowerCase()
                                                            .includes(
                                                                'komisaris',
                                                            ) ||
                                                        member.role
                                                            .toLowerCase()
                                                            .includes(
                                                                'commissioner',
                                                            );
                                                    if (!isKomisaris)
                                                        return null;
                                                    return (
                                                        <button
                                                            key={member.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveEditIndex(
                                                                    idx,
                                                                )
                                                            }
                                                            className={cn(
                                                                'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-300',
                                                                activeEditIndex ===
                                                                    idx
                                                                    ? 'border-[#eab308]/40 bg-admin-card text-[#eab308] shadow-sm'
                                                                    : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                                            )}
                                                        >
                                                            <span className="max-w-[120px] truncate">
                                                                {member.name}
                                                            </span>
                                                            {komisarisCount >
                                                                1 && (
                                                                <span
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
                                                                        handleDeleteMember(
                                                                            idx,
                                                                            e,
                                                                        )
                                                                    }
                                                                    className="ml-1 rounded-md p-0.5 transition-colors hover:bg-red-500/20 hover:text-red-400"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Dewan Direksi */}
                                    <div className="space-y-3 border-t border-admin-border/30 pt-4">
                                        <div className="flex items-center justify-between border-b border-admin-border/30 pb-2">
                                            <span className="block text-[10px] font-black tracking-widest text-admin-accent uppercase">
                                                Dewan Direksi & Staff
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddMember('Direktur')
                                                }
                                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-admin-accent/10 px-2.5 py-1 text-[10px] font-bold text-admin-accent transition-all duration-300 hover:bg-admin-accent hover:text-white"
                                            >
                                                <Plus size={12} /> Tambah
                                                Pimpinan
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {direksiCount === 0 ? (
                                                <span className="py-1 text-[11px] text-admin-text-muted italic">
                                                    Belum ada Dewan Direksi &
                                                    Staff. Klik tambah untuk
                                                    menambahkan.
                                                </span>
                                            ) : (
                                                members.map((member, idx) => {
                                                    const isKomisaris =
                                                        member.role
                                                            .toLowerCase()
                                                            .includes(
                                                                'komisaris',
                                                            ) ||
                                                        member.role
                                                            .toLowerCase()
                                                            .includes(
                                                                'commissioner',
                                                            );
                                                    if (isKomisaris)
                                                        return null;
                                                    return (
                                                        <button
                                                            key={member.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveEditIndex(
                                                                    idx,
                                                                )
                                                            }
                                                            className={cn(
                                                                'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-300',
                                                                activeEditIndex ===
                                                                    idx
                                                                    ? 'border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                                                    : 'border-transparent bg-transparent text-admin-text-muted hover:text-admin-text',
                                                            )}
                                                        >
                                                            <span className="max-w-[120px] truncate">
                                                                {member.name}
                                                            </span>
                                                            {direksiCount >
                                                                1 && (
                                                                <span
                                                                    onClick={(
                                                                        e,
                                                                    ) =>
                                                                        handleDeleteMember(
                                                                            idx,
                                                                            e,
                                                                        )
                                                                    }
                                                                    className="ml-1 rounded-md p-0.5 transition-colors hover:bg-red-500/20 hover:text-red-400"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Edit Anggota Terpilih */}
                                {currentEditMember && (
                                    <div className="animate-fadeIn space-y-4 rounded-2xl border border-admin-border bg-admin-bg p-6">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1.5 block text-[10px] font-black tracking-widest text-admin-text-muted uppercase">
                                                    Nama Lengkap
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        currentEditMember.name
                                                    }
                                                    onChange={(e) =>
                                                        updateMemberField(
                                                            activeEditIndex,
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-admin-border bg-admin-card px-3.5 py-2.5 text-sm font-bold text-admin-text outline-none"
                                                    placeholder="Nama Lengkap..."
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-[10px] font-black tracking-widest text-admin-text-muted uppercase">
                                                    Jabatan / Posisi
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        currentEditMember.role
                                                    }
                                                    onChange={(e) =>
                                                        updateMemberField(
                                                            activeEditIndex,
                                                            'role',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-admin-border bg-admin-card px-3.5 py-2.5 text-sm font-semibold text-admin-text outline-none"
                                                    placeholder="E.g., Direktur Utama"
                                                />
                                            </div>
                                        </div>

                                        {/* Foto Pimpinan */}
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black tracking-widest text-admin-text-muted uppercase">
                                                    Foto Pimpinan
                                                </label>
                                                <div className="flex gap-1.5 rounded-lg border border-admin-border/60 bg-admin-card p-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateMemberField(
                                                                activeEditIndex,
                                                                'imageSourceType',
                                                                'url',
                                                            )
                                                        }
                                                        className={cn(
                                                            'cursor-pointer rounded-md px-2 py-0.5 text-[9px] font-black uppercase transition-all duration-200',
                                                            currentEditMember.imageSourceType ===
                                                                'url'
                                                                ? 'bg-admin-bg text-admin-accent'
                                                                : 'text-admin-text-muted hover:text-admin-text',
                                                        )}
                                                    >
                                                        Tautan
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateMemberField(
                                                                activeEditIndex,
                                                                'imageSourceType',
                                                                'upload',
                                                            )
                                                        }
                                                        className={cn(
                                                            'cursor-pointer rounded-md px-2 py-0.5 text-[9px] font-black uppercase transition-all duration-200',
                                                            currentEditMember.imageSourceType ===
                                                                'upload'
                                                                ? 'bg-admin-bg text-admin-accent'
                                                                : 'text-admin-text-muted hover:text-admin-text',
                                                        )}
                                                    >
                                                        Unggah
                                                    </button>
                                                </div>
                                            </div>

                                            {currentEditMember.imageSourceType ===
                                            'upload' ? (
                                                <>
                                                    <div
                                                        onClick={
                                                            triggerFileSelect
                                                        }
                                                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-admin-card p-4 transition-all duration-300 hover:border-admin-accent/40"
                                                    >
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={(e) =>
                                                                handleFileChange(
                                                                    activeEditIndex,
                                                                    e,
                                                                )
                                                            }
                                                            accept="image/*"
                                                            className="hidden"
                                                        />
                                                        {uploadingImage ? (
                                                            <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                                                <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                                                Memproses file
                                                                gambar...
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1">
                                                                <ImageIcon
                                                                    size={16}
                                                                    className="text-admin-text-muted"
                                                                />
                                                                <p className="text-[10px] font-bold text-admin-text">
                                                                    {currentEditMember.imageFileName
                                                                        ? currentEditMember.imageFileName
                                                                        : 'Klik untuk unggah foto'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {currentEditMember.imageFileName &&
                                                        !uploadingImage && (
                                                            <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                                                <CheckCircle2
                                                                    size={12}
                                                                />
                                                                File{' '}
                                                                {
                                                                    currentEditMember.imageFileName
                                                                }{' '}
                                                                berhasil dimuat
                                                            </div>
                                                        )}
                                                </>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={
                                                        currentEditMember.image
                                                    }
                                                    onChange={(e) =>
                                                        updateMemberField(
                                                            activeEditIndex,
                                                            'image',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-admin-border bg-admin-card px-3.5 py-2.5 text-xs font-medium text-admin-text outline-none"
                                                    placeholder="Tautan Gambar..."
                                                />
                                            )}
                                        </div>
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
                    <div className="group relative flex h-[520px] flex-col overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-admin-accent" />
                                <span className="text-xs font-bold tracking-wider text-admin-text uppercase">
                                    Preview Tim Kepemimpinan
                                </span>
                            </div>
                            <span className="animate-pulse rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                Aktif
                            </span>
                        </div>

                        {/* Mockup Frame Tim */}
                        <div className="custom-scrollbar flex w-full flex-1 flex-col gap-6 overflow-y-auto rounded-[2rem] border border-admin-border bg-admin-bg p-6">
                            <div>
                                <h3 className="text-lg leading-tight font-black text-admin-text">
                                    {title}
                                </h3>
                                <p className="mt-1 text-[10px] leading-relaxed text-admin-text-muted">
                                    {subtitle}
                                </p>
                            </div>

                            {/* Grid Tim Preview */}
                            <div className="space-y-6">
                                {/* Dewan Komisaris */}
                                {members.some(
                                    (m) =>
                                        m.role
                                            .toLowerCase()
                                            .includes('komisaris') ||
                                        m.role
                                            .toLowerCase()
                                            .includes('commissioner'),
                                ) && (
                                    <div>
                                        <div className="mb-2 border-b border-admin-border/50 pb-1">
                                            <span className="text-[9px] font-black tracking-wider text-[#eab308] uppercase">
                                                Dewan Komisaris
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {members.map((member, idx) => {
                                                const isKomisaris =
                                                    member.role
                                                        .toLowerCase()
                                                        .includes(
                                                            'komisaris',
                                                        ) ||
                                                    member.role
                                                        .toLowerCase()
                                                        .includes(
                                                            'commissioner',
                                                        );
                                                if (!isKomisaris) return null;
                                                return (
                                                    <div
                                                        key={member.id}
                                                        className="group/member relative flex flex-col"
                                                    >
                                                        <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-sm">
                                                            <img
                                                                src={
                                                                    member.image
                                                                }
                                                                alt={
                                                                    member.name
                                                                }
                                                                className="aspect-[4/5] w-full object-cover grayscale transition-all duration-300 group-hover/member:grayscale-0"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        'https://i.pravatar.cc/400?img=11';
                                                                }}
                                                            />
                                                        </div>
                                                        <h4 className="mt-2 truncate text-[11px] font-black text-admin-text">
                                                            {member.name}
                                                        </h4>
                                                        <span className="mt-1 inline-block self-start rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-black text-[#eab308]">
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Dewan Direksi */}
                                {members.some(
                                    (m) =>
                                        !m.role
                                            .toLowerCase()
                                            .includes('komisaris') &&
                                        !m.role
                                            .toLowerCase()
                                            .includes('commissioner'),
                                ) && (
                                    <div>
                                        <div className="mb-2 border-b border-admin-border/50 pb-1">
                                            <span className="text-[9px] font-black tracking-wider text-admin-accent uppercase">
                                                Dewan Direksi & Staff
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {members.map((member, idx) => {
                                                const isKomisaris =
                                                    member.role
                                                        .toLowerCase()
                                                        .includes(
                                                            'komisaris',
                                                        ) ||
                                                    member.role
                                                        .toLowerCase()
                                                        .includes(
                                                            'commissioner',
                                                        );
                                                if (isKomisaris) return null;
                                                return (
                                                    <div
                                                        key={member.id}
                                                        className={cn(
                                                            'group/member relative flex flex-col',
                                                            idx % 2 === 1 &&
                                                                'mt-3',
                                                        )}
                                                    >
                                                        <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-sm">
                                                            <img
                                                                src={
                                                                    member.image
                                                                }
                                                                alt={
                                                                    member.name
                                                                }
                                                                className="aspect-[4/5] w-full object-cover grayscale transition-all duration-300 group-hover/member:grayscale-0"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    (
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        'https://i.pravatar.cc/400?img=11';
                                                                }}
                                                            />
                                                        </div>
                                                        <h4 className="mt-2 truncate text-[11px] font-black text-admin-text">
                                                            {member.name}
                                                        </h4>
                                                        <span className="mt-1 inline-block self-start rounded-full bg-admin-accent/10 px-1.5 py-0.5 text-[8px] font-black text-admin-accent">
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Keterangan Mockup */}
                        <div className="mt-4 flex shrink-0 items-center justify-between text-[10px] font-bold text-admin-text-muted">
                            <span>TEAM MEMBERS MOCKUP PREVIEW</span>
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
            />
        </div>
    );
}
