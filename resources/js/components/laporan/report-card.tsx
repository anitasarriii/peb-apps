import { Link } from '@inertiajs/react';
import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { useState } from 'react';

interface ReportCardProps {
    title: string;
    description: string;
    image?: string;
    badge?: string;
    meta?: string;
    href: string;
    fileUrl?: string;
}

export default function ReportCard({
    title,
    description,
    image,
    badge,
    meta,
    href,
    fileUrl,
}: ReportCardProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const canDownload = Boolean(fileUrl && fileUrl !== '#');

    return (
        <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white shadow-[0_4px_24px_rgba(13,46,46,0.03)] transition-colors duration-300 hover:border-[#00A4B9]/40 dark:border-white/10 dark:bg-[#122b2b]">
            <Link
                href={href}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-[2/1] overflow-hidden bg-[#e9f1f2] dark:bg-white/5"
            >
                {image && !imageFailed ? (
                    <img
                        src={image}
                        alt=""
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-[#008c9e]/40 dark:text-[#2dd4bf]/40">
                        <FileText className="size-10" strokeWidth={1} />
                    </div>
                )}
            </Link>
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] leading-5">
                    {badge && (
                        <span className="font-medium text-[#008c9e] dark:text-[#2dd4bf]">
                            {badge}
                        </span>
                    )}
                    {meta && (
                        <span className="text-[#0d2e2e]/45 dark:text-white/45">
                            {meta}
                        </span>
                    )}
                </div>
                <h3 className="mb-2 line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-[#0d2e2e] dark:text-white">
                    <Link
                        href={href}
                        className="transition-colors hover:text-[#008c9e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A4B9] dark:hover:text-[#2dd4bf]"
                    >
                        {title}
                    </Link>
                </h3>
                <p className="mb-3 line-clamp-2 text-xs leading-5 text-[#0d2e2e]/60 dark:text-white/60">
                    {description
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ')}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#0d2e2e]/10 pt-3 dark:border-white/10">
                    <Link
                        href={href}
                        className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-[#008c9e] hover:underline dark:text-[#2dd4bf]"
                    >
                        Lihat laporan{' '}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    {canDownload ? (
                        <a
                            href={fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Unduh ${title}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#00A4B9]/10 px-3 text-xs font-medium text-[#008c9e] transition-colors hover:bg-[#00A4B9]/20 dark:text-[#2dd4bf]"
                        >
                            <Download className="size-3.5" aria-hidden="true" />{' '}
                            Unduh
                        </a>
                    ) : (
                        <span className="text-[11px] text-[#0d2e2e]/40 dark:text-white/40">
                            Berkas belum tersedia
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
