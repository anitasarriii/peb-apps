import React from 'react';

interface StatCardData {
    label: string;
    value: string;
    description: string;
}

interface StatTabProps {
    stat: StatCardData;
    setStat: React.Dispatch<React.SetStateAction<StatCardData>>;
}

export default function StatTab({ stat, setStat }: StatTabProps) {
    return (
        <div className="animate-fadeIn space-y-5">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Label Kartu
                    </label>
                    <input
                        type="text"
                        value={stat.label}
                        onChange={(e) =>
                            setStat((prev) => ({
                                ...prev,
                                label: e.target.value,
                            }))
                        }
                        className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-xs font-bold text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                        Nilai Stat
                    </label>
                    <input
                        type="text"
                        value={stat.value}
                        onChange={(e) =>
                            setStat((prev) => ({
                                ...prev,
                                value: e.target.value,
                            }))
                        }
                        className="w-full rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-xs font-bold text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-admin-text-muted uppercase">
                    Deskripsi Detail
                </label>
                <textarea
                    value={stat.description}
                    onChange={(e) =>
                        setStat((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                    rows={4}
                    className="w-full resize-none rounded-xl border border-admin-border bg-admin-bg/50 px-4 py-3 text-xs leading-relaxed text-admin-text outline-hidden transition-all duration-300 focus:border-admin-accent"
                    required
                />
            </div>
        </div>
    );
}
