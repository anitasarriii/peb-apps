// ============================================================
// Types — Partner Section
// Re-export dari partner-row-editor agar definisi tetap DRY
// ============================================================

export type { PartnerItem } from './partner-row-editor';

export const defaultPartners = [
    { id: '1', name: 'PLN Batam', logoSrc: '', logoSource: 'none' as const },
    { id: '2', name: 'Pertamina', logoSrc: '', logoSource: 'none' as const },
    { id: '3', name: 'Siemens', logoSrc: '', logoSource: 'none' as const },
    { id: '4', name: 'Schneider', logoSrc: '', logoSource: 'none' as const },
    { id: '5', name: 'GE Energy', logoSrc: '', logoSource: 'none' as const },
    { id: '6', name: 'ABB', logoSrc: '', logoSource: 'none' as const },
    { id: '7', name: 'Wartsila', logoSrc: '', logoSource: 'none' as const },
    { id: '8', name: 'Vestas', logoSrc: '', logoSource: 'none' as const },
    { id: '9', name: 'Ka Ge Ih', logoSrc: '', logoSource: 'none' as const },
];
