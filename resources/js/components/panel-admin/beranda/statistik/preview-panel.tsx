import { ICON_MAP, type StatItem } from './stat-row-editor';

interface PreviewPanelProps {
    backgroundSrc: string;
    stats: StatItem[];
}

export default function PreviewPanel({
    backgroundSrc,
    stats,
}: PreviewPanelProps) {
    return (
        <div className="relative h-full flex-1 overflow-hidden rounded-[2rem] border border-admin-border bg-[#edf5f6] select-none dark:bg-[#071717]">
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

            <div className="custom-scrollbar relative z-10 flex h-full flex-col justify-center overflow-y-auto p-5">
                <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="flex flex-col items-center rounded-xl border border-white/10 bg-white/10 px-3 py-4 text-center backdrop-blur-md dark:bg-white/5"
                        >
                            <div className="mb-2 scale-90 text-white">
                                {ICON_MAP[stat.icon]}
                            </div>
                            <p className="mb-0.5 text-lg leading-none font-black text-white">
                                {stat.value || '—'}
                            </p>
                            <p className="text-[8px] font-medium text-white/77">
                                {stat.label || 'Label'}
                            </p>
                        </div>
                    ))}
                    {stats.length === 0 && (
                        <p className="col-span-2 py-8 text-center text-[9px] text-white/50">
                            Belum ada data statistik.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
