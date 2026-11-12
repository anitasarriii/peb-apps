import { ChevronRight } from 'lucide-react';

interface PreviewPanelProps {
    backgroundSrc: string;
    text: string;
    buttonHref: string;
    buttonLabel: string;
}

export default function PreviewPanel({
    backgroundSrc,
    text,
    buttonHref,
    buttonLabel,
}: PreviewPanelProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-admin-border">
            {backgroundSrc && (
                <div className="absolute inset-0">
                    <img
                        src={backgroundSrc}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                                'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-[#0d2e2e]/70" />
                </div>
            )}
            {!backgroundSrc && (
                <div className="absolute inset-0 bg-[#0d2e2e]" />
            )}

            <div className="relative z-10 flex flex-col items-start justify-between gap-6 px-8 py-10 sm:flex-row sm:items-center">
                <p className="text-base font-semibold text-white italic md:text-lg">
                    {text || 'Anda membutuhkan layanan dari kami?'}
                </p>
                <a
                    href={buttonHref}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0d2e2e] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1a4a4a]"
                >
                    {buttonLabel || 'Hubungi Kami'}
                    <ChevronRight className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}
