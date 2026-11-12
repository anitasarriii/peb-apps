import type { ImgHTMLAttributes } from 'react';

interface PebLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
    inverse?: boolean;
}

export default function PebLogo({
    inverse = false,
    src,
    alt = 'PT Pelayanan Energi Batam',
    ...props
}: PebLogoProps) {
    return (
        <img
            src={
                src ||
                (inverse
                    ? '/assets/logo/logo-putih.svg'
                    : '/assets/logo/logo.png')
            }
            alt={alt}
            {...props}
        />
    );
}
