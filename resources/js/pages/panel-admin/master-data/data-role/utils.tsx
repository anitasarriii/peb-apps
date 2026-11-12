import { ShieldAlert, Shield, Eye } from 'lucide-react';
import React from 'react';

export const getRoleIcon = (name: string) => {
    if (name === 'super_admin') return <ShieldAlert size={18} />;
    if (name === 'admin') return <Shield size={18} />;
    return <Eye size={18} />;
};

export const getRoleColor = (name: string, fallback: string | null) => {
    return fallback || 'text-blue-400';
};
