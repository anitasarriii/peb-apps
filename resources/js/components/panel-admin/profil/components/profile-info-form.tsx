import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    User,
    Mail,
    Phone,
    UploadCloud,
    CheckCircle2,
    Save,
    RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileInfoFormProps {
    user: {
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        role?: {
            name: string;
            description?: string;
        };
    };
    onSuccessToast: (message: string) => void;
    onErrorToast: (message: string) => void;
}

export default function ProfileInfoForm({
    user,
    onSuccessToast,
    onErrorToast,
}: ProfileInfoFormProps) {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>('');
    const [avatarFileName, setAvatarFileName] = useState<string>('');
    const [uploadingProgress, setUploadingProgress] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: null as File | null,
        _method: 'PATCH', // Spoofing PATCH untuk PHP multipart/form-data
    });

    const displayAvatar =
        avatarPreviewUrl ||
        user.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=0d2e2e&color=fff&size=80`;

    const compressImage = (
        file: File,
        callback: (compressedFile: File) => void,
    ) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Batasi dimensi maksimum untuk avatar agar tajam namun efisien
                const MAX_WIDTH = 500;
                const MAX_HEIGHT = 500;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Gambar ulang dengan interpolasi tinggi
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                // Ekspor blob menjadi File dengan format JPEG kualitas 85%
                                const compressed = new File(
                                    [blob],
                                    file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                                    {
                                        type: 'image/jpeg',
                                        lastModified: Date.now(),
                                    },
                                );
                                callback(compressed);
                            } else {
                                callback(file);
                            }
                        },
                        'image/jpeg',
                        0.85, // Kualitas 85% (jernih dan tidak merusak detail visual)
                    );
                } else {
                    callback(file);
                }
            };
            img.onerror = () => callback(file);
        };
        reader.onerror = () => callback(file);
    };

    const compressGif = (
        file: File,
        callback: (compressedFile: File) => void,
    ) => {
        // Meload script gifshot secara dinamis dari CDN jika belum terpasang
        const loadGifshot = (onLoadCallback: () => void) => {
            if ((window as any).gifshot) {
                onLoadCallback();
                return;
            }
            const script = document.createElement('script');
            script.src =
                'https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.3.2/gifshot.min.js';
            script.onload = () => onLoadCallback();
            script.onerror = () => {
                console.error(
                    'Gagal memuat library gifshot untuk kompresi GIF. Menggunakan file asli.',
                );
                callback(file);
            };
            document.head.appendChild(script);
        };

        loadGifshot(() => {
            const gifshot = (window as any).gifshot;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;

                // Menggunakan gifshot untuk meresize dimensi gif beranimasi
                gifshot.createGIF(
                    {
                        gifWidth: 300,
                        gifHeight: 300,
                        images: [dataUrl],
                        keepCameraOn: false,
                    },
                    (obj: any) => {
                        if (!obj.error) {
                            fetch(obj.image)
                                .then((res) => res.blob())
                                .then((blob) => {
                                    const compressed = new File(
                                        [blob],
                                        file.name,
                                        {
                                            type: 'image/gif',
                                            lastModified: Date.now(),
                                        },
                                    );
                                    callback(compressed);
                                })
                                .catch(() => callback(file));
                        } else {
                            console.error('Error kompresi GIF:', obj.errorMsg);
                            callback(file);
                        }
                    },
                );
            };
            reader.onerror = () => callback(file);
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi format file gambar sebelum dikompresi
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/webp',
            'image/gif',
        ];
        if (!allowedTypes.includes(file.type)) {
            onErrorToast('Format berkas harus JPEG, PNG, JPG, WEBP, atau GIF.');
            return;
        }

        // Validasi ukuran berkas (Maksimal 500 MB)
        if (file.size > 500 * 1024 * 1024) {
            onErrorToast(
                'Ukuran berkas terlalu besar! Maksimal ukuran yang diperbolehkan adalah 500 MB.',
            );
            return;
        }

        setUploadingProgress(true);
        setAvatarFileName(file.name);

        // Kompresi gambar secara asinkron sebelum diset ke form state
        if (file.type === 'image/gif') {
            compressGif(file, (compressedFile) => {
                setData('avatar', compressedFile);

                if (avatarPreviewUrl) {
                    URL.revokeObjectURL(avatarPreviewUrl);
                }
                const localUrl = URL.createObjectURL(compressedFile);
                setUploadingProgress(false);
                setAvatarPreviewUrl(localUrl);

                console.log(
                    `[DEBUG GIF COMPRESSION] GIF Asli: ${(file.size / 1024).toFixed(2)} KB | Hasil Kompresi: ${(compressedFile.size / 1024).toFixed(2)} KB (Efisiensi: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%)`,
                );
            });
        } else {
            compressImage(file, (compressedFile) => {
                setData('avatar', compressedFile);

                if (avatarPreviewUrl) {
                    URL.revokeObjectURL(avatarPreviewUrl);
                }
                const localUrl = URL.createObjectURL(compressedFile);
                setUploadingProgress(false);
                setAvatarPreviewUrl(localUrl);

                // Tampilkan log kompresi di Console untuk audit
                console.log(
                    `[DEBUG COMPRESSION] Foto Asli: ${(file.size / 1024).toFixed(2)} KB | Hasil Kompresi: ${(compressedFile.size / 1024).toFixed(2)} KB (Efisiensi: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%)`,
                );
            });
        }
    };

    const handleReset = () => {
        reset();
        setAvatarPreviewUrl('');
        setAvatarFileName('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                onSuccessToast('Profil berhasil diperbarui.');
                setAvatarFileName('');
            },
            onError: (errs) => {
                const firstError = Object.values(errs)[0];
                onErrorToast(
                    typeof firstError === 'string'
                        ? firstError
                        : 'Gagal memperbarui profil.',
                );
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Uploader */}
            <div className="flex items-center gap-5 rounded-2xl border border-admin-border/60 bg-admin-bg/30 p-5">
                <div className="relative shrink-0">
                    <img
                        src={displayAvatar}
                        alt={data.name}
                        className="size-20 rounded-full border-4 border-admin-accent object-cover shadow-lg shadow-admin-accent/20"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0d2e2e&color=fff&size=80`;
                        }}
                    />
                    <span className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-2 border-admin-card bg-emerald-400" />
                </div>
                <div className="flex-1 space-y-2">
                    <div>
                        <p className="text-sm font-bold text-admin-text">
                            {data.name || 'User'}
                        </p>
                        <p className="text-[10px] text-admin-text-muted capitalize">
                            {user.role?.name
                                ? user.role.name.replace('_', ' ')
                                : 'Administrator'}
                        </p>
                    </div>
                    <div
                        onClick={() => avatarInputRef.current?.click()}
                        className="group flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-admin-border bg-admin-bg/40 px-4 py-2 transition-all hover:border-admin-accent/50"
                    >
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        {uploadingProgress ? (
                            <div className="flex animate-pulse items-center gap-2 text-[10px] font-bold text-admin-accent">
                                <div className="size-3 animate-spin rounded-full border-2 border-admin-accent/20 border-t-admin-accent" />
                                Memproses foto profil...
                            </div>
                        ) : (
                            <>
                                <UploadCloud
                                    size={13}
                                    className="text-admin-text-muted transition-colors group-hover:text-admin-accent"
                                />
                                <span className="text-[10px] font-bold text-admin-text-muted group-hover:text-admin-text">
                                    Ganti Foto
                                </span>
                            </>
                        )}
                    </div>
                    {avatarFileName && !uploadingProgress && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 size={11} /> {avatarFileName} berhasil
                            dimuat
                        </div>
                    )}
                    {errors.avatar && (
                        <p className="text-[10px] font-bold text-rose-500">
                            {errors.avatar}
                        </p>
                    )}
                </div>
            </div>

            {/* Input Nama & Telepon */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        <User size={11} /> Nama Lengkap
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={cn(
                            'w-full rounded-2xl border bg-admin-bg/50 px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent',
                            errors.name
                                ? 'border-rose-500'
                                : 'border-admin-border',
                        )}
                        required
                    />
                    {errors.name && (
                        <p className="text-xs font-semibold text-rose-500">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        <Phone size={11} /> Nomor Telepon
                    </label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className={cn(
                            'w-full rounded-2xl border bg-admin-bg/50 px-4 py-3.5 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent',
                            errors.phone
                                ? 'border-rose-500'
                                : 'border-admin-border',
                        )}
                        placeholder="Contoh: +62812345678"
                    />
                    {errors.phone && (
                        <p className="text-xs font-semibold text-rose-500">
                            {errors.phone}
                        </p>
                    )}
                </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    <Mail size={11} /> Alamat Email
                </label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={cn(
                        'w-full rounded-2xl border bg-admin-bg/50 px-5 py-4 text-sm font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent',
                        errors.email
                            ? 'border-rose-500'
                            : 'border-admin-border',
                    )}
                    required
                />
                {errors.email && (
                    <p className="text-xs font-semibold text-rose-500">
                        {errors.email}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 border-t border-admin-border pt-4">
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={processing}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-admin-border px-6 py-4 text-sm font-bold text-admin-text transition-all hover:bg-admin-card-hover active:scale-95 disabled:opacity-50"
                >
                    <RotateCcw size={16} /> Reset
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className={cn(
                        'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-lg shadow-admin-primary/20 transition-all duration-300 active:scale-[0.98]',
                        processing
                            ? 'cursor-not-allowed bg-admin-primary/60'
                            : 'bg-admin-primary hover:bg-admin-accent',
                    )}
                >
                    {processing ? (
                        <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <Save size={16} />
                    )}
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}
