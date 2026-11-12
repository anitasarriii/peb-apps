import { ReactNode, createElement } from 'react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export const protectBrandName = (text: string | null | undefined): ReactNode => {
    if (!text || typeof text !== 'string') return text;

    // Check for brand terms — longest pattern first to avoid partial matches
    const brandTerms = ['PT Pelayanan Energi Batam (PEB)', 'PT Pelayanan Energi Batam'];
    const matchedTerm = brandTerms.find((term) => text.includes(term));

    if (!matchedTerm) return text;

    const parts = text.split(matchedTerm);

    return parts.map((part, index) =>
        createElement(
            'span',
            { key: index },
            part,
            index !== parts.length - 1
                ? createElement('span', { className: 'notranslate' }, '\u00A0' + matchedTerm + '\u00A0')
                : null,
        ),
    );
};
