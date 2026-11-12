import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';

interface ProfilePreviewCardProps {
    user: {
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        created_at?: string;
        role?: {
            name: string;
            description?: string;
        };
    };
}

export default function ProfilePreviewCard({ user }: ProfilePreviewCardProps) {
    const displayAvatar =
        user.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d2e2e&color=fff&size=96`;

    // Format tanggal bergabung dari database (created_at) ke Bahasa Indonesia
    const joinDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '01 Januari 2024';

    const roleName = user.role?.name
        ? user.role.name.replace('_', ' ')
        : 'Administrator';

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-6 shadow-xl">
            <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-admin-accent/5 blur-3xl" />

            {/* Profile Card Header */}
            <div className="flex flex-col items-center border-b border-admin-border/50 pt-4 pb-6 text-center">
                <div className="relative mb-4">
                    <img
                        src={displayAvatar}
                        alt={user.name}
                        className="size-24 rounded-full border-4 border-admin-accent object-cover shadow-xl shadow-admin-accent/20"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d2e2e&color=fff&size=96`;
                        }}
                    />
                    <span className="absolute right-1 bottom-1 size-5 rounded-full border-2 border-admin-card bg-emerald-400 shadow-sm" />
                </div>
                <h3 className="max-w-full truncate text-xl font-black text-admin-text">
                    {user.name}
                </h3>
                <span className="mt-1 flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-400 uppercase">
                    <Shield size={10} /> {roleName}
                </span>
                <p className="mt-2 max-w-full truncate text-xs text-admin-text-muted">
                    {user.email}
                </p>
            </div>

            {/* Info List */}
            <div className="space-y-3 pt-5">
                {[
                    {
                        icon: <User size={14} />,
                        label: 'Nama Lengkap',
                        value: user.name,
                    },
                    {
                        icon: <Mail size={14} />,
                        label: 'Email',
                        value: user.email,
                    },
                    {
                        icon: <Phone size={14} />,
                        label: 'Telepon',
                        value: user.phone || 'Belum diatur',
                    },
                    {
                        icon: <Calendar size={14} />,
                        label: 'Bergabung',
                        value: joinDate,
                    },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl border border-admin-border/50 bg-admin-bg/30 p-3"
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-admin-accent/10 text-admin-accent">
                            {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold tracking-widest text-admin-text-muted uppercase">
                                {item.label}
                            </p>
                            <p className="truncate text-xs font-semibold text-admin-text">
                                {item.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-[10px] font-bold text-admin-text-muted">
                <span>KARTU PROFIL</span>
                <span className="flex items-center gap-1 text-emerald-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />{' '}
                    Online
                </span>
            </div>
        </div>
    );
}
