import { ShieldAlert, Shield, Eye } from 'lucide-react';
import React from 'react';

export const getRoleStyle = (name: string) => {
    if (name === 'super_admin')
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (name === 'admin')
        return 'bg-admin-accent/10 text-admin-accent border-admin-accent/20';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
};

export const getRoleIcon = (name: string) => {
    if (name === 'super_admin') return <ShieldAlert size={12} />;
    if (name === 'admin') return <Shield size={12} />;
    return <Eye size={12} />;
};

export const avatarFallback = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d2e2e&color=fff`;
