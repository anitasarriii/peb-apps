import { ReactNode } from 'react';

interface BrandNameProps {
    short?: boolean;
}

export default function BrandName({ short = false }: BrandNameProps): ReactNode {
    return (
        <span className="notranslate">
            {short ? 'PEB' : '\u00A0PT Pelayanan Energi Batam (PEB)\u00A0'}
        </span>
    );
}
