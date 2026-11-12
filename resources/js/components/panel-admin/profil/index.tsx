import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { User, Lock } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';
import AdminToast from '@/components/panel-admin/admin-toast';

import ProfileInfoForm from './components/profile-info-form';
import PasswordChangeForm from './components/password-change-form';
import ProfilePreviewCard from './components/profile-preview-card';

export default function ProfilEditor() {
    const { auth } = usePage().props as any;
    const user = auth?.user || {
        name: 'Admin',
        email: 'admin@peb.co.id',
        phone: '',
        avatar: '',
    };

    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

    // State Toast
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');

    const triggerToast = (type: 'success' | 'error', message: string) => {
        setToastType(type);
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    return (
        <div className="animate-fadeIn grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
            {/* Form Kontainer */}
            <div className="space-y-6 xl:col-span-7">
                <AnimeReveal delay={100} distance={20} direction="up">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-admin-border bg-admin-card p-8 shadow-2xl">
                        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-admin-accent/5 blur-3xl transition-all duration-700 group-hover:bg-admin-accent/10" />

                        <div className="mb-6 flex items-center gap-3 border-b border-admin-border/50 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-admin-text">
                                    Profil Saya
                                </h3>
                                <p className="mt-1 text-xs text-admin-text-muted">
                                    Kelola informasi akun dan keamanan Anda.
                                </p>
                            </div>
                        </div>

                        {/* Pilihan Tab */}
                        <div className="mb-6 flex gap-1.5 rounded-2xl border border-admin-border/60 bg-admin-bg p-1">
                            {(
                                [
                                    {
                                        key: 'info',
                                        label: 'Informasi Profil',
                                        icon: <User size={13} />,
                                    },
                                    {
                                        key: 'password',
                                        label: 'Ganti Password',
                                        icon: <Lock size={13} />,
                                    },
                                ] as const
                            ).map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all',
                                        activeTab === tab.key
                                            ? 'border border-admin-accent/30 bg-admin-card text-admin-accent shadow-sm'
                                            : 'border border-transparent text-admin-text-muted hover:text-admin-text',
                                    )}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'info' ? (
                            <ProfileInfoForm
                                user={user}
                                onSuccessToast={(msg) =>
                                    triggerToast('success', msg)
                                }
                                onErrorToast={(msg) =>
                                    triggerToast('error', msg)
                                }
                            />
                        ) : (
                            <PasswordChangeForm
                                onSuccessToast={(msg) =>
                                    triggerToast('success', msg)
                                }
                                onErrorToast={(msg) =>
                                    triggerToast('error', msg)
                                }
                            />
                        )}
                    </div>
                </AnimeReveal>
            </div>

            {/* Preview Sisi Kanan */}
            <div className="space-y-6 xl:col-span-5">
                <AnimeReveal delay={250} distance={20} direction="up">
                    <ProfilePreviewCard user={user} />
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
