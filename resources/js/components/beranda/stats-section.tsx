import {
    Users,
    MapPin,
    Briefcase,
    Hammer,
    Star,
    Zap,
    TrendingUp,
    Award,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';

// --- Tipe Ikon yang didukung (sesuai panel admin) ---
type IconKey =
    | 'Users'
    | 'MapPin'
    | 'Briefcase'
    | 'Hammer'
    | 'Star'
    | 'Zap'
    | 'TrendingUp'
    | 'Award';

// Peta nama ikon (string dari database) ke komponen JSX
const ICON_MAP: Record<IconKey, React.ReactNode> = {
    Users: <Users className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />,
    MapPin: <MapPin className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />,
    Briefcase: <Briefcase className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />,
    Hammer: <Hammer className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />,
    Star: <Star className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />,
    Zap: <Zap className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />,
    TrendingUp: (
        <TrendingUp className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />
    ),
    Award: <Award className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10" />,
};

// --- Interface ---
interface StatItem {
    id: string;
    icon: string; // string dari database, di-resolve via ICON_MAP
    value: string;
    label: string;
}

interface StatsSectionProps {
    backgroundSrc?: string;
    stats?: StatItem[];
}

// --- Data default (fallback jika database kosong) ---
const defaultStats: StatItem[] = [
    { id: '1', icon: 'Users', value: '682', label: 'Karyawan' },
    { id: '2', icon: 'MapPin', value: '68', label: 'Lokasi Sites' },
    { id: '3', icon: 'Briefcase', value: '42', label: 'Proyek' },
    { id: '4', icon: 'Hammer', value: '17', label: 'Izin Usaha' },
];

// Helper: resolve ikon dari string, fallback ke Users jika tidak ditemukan
function resolveIcon(iconKey: string): React.ReactNode {
    return ICON_MAP[iconKey as IconKey] ?? ICON_MAP['Users'];
}

function AnimatedStatValue({ value }: { value: string }) {
    const elementRef = useRef<HTMLSpanElement>(null);
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const targetMatch = value.match(/[\d.,]+/);

        if (!targetMatch) {
            setDisplayValue(value);
            return;
        }

        const numericTarget = Number(targetMatch[0].replace(/[^\d]/g, ''));
        const formatValue = (currentValue: number) =>
            value.replace(
                targetMatch[0],
                Math.round(currentValue).toLocaleString('id-ID'),
            );

        const element = elementRef.current;
        if (!element) {
            return;
        }

        let animationFrameId = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const startedAt = performance.now();
                const duration = 1600;
                const animate = (timestamp: number) => {
                    const progress = Math.min(
                        (timestamp - startedAt) / duration,
                        1,
                    );
                    const easedProgress = 1 - Math.pow(1 - progress, 3);

                    setDisplayValue(formatValue(numericTarget * easedProgress));

                    if (progress < 1) {
                        animationFrameId = requestAnimationFrame(animate);
                    }
                };

                animationFrameId = requestAnimationFrame(animate);
                observer.disconnect();
            },
            { threshold: 0.1 },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [value]);

    return <span ref={elementRef}>{displayValue}</span>;
}

export default function StatsSection({
    backgroundSrc = '/assets/beranda/team/team.jpg',
    stats,
}: StatsSectionProps) {
    // Gunakan data dari database jika tersedia, fallback ke default
    const displayStats = stats && stats.length > 0 ? stats : defaultStats;

    return (
        <section className="relative overflow-hidden bg-[#EDF5F6] pb-4 transition-colors duration-500 lg:pb-6 dark:bg-[#0a1a1a]">
            {/* Background Image */}
            <div className="absolute inset-y-0 right-4 left-4 overflow-hidden rounded-b-[2.5rem] bg-[#0d2e2e] lg:right-6 lg:left-6">
                <img
                    src={backgroundSrc}
                    alt=""
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d2e2e] via-[#0d2e2e]/85 to-[#0d2e2e]/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-4 py-8 lg:px-6 lg:py-10">
                <div className="grid w-full grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0d2e2e]/35 shadow-xl shadow-black/10 backdrop-blur-md md:grid-cols-4">
                    {displayStats.map((stat, index) => (
                        <AnimeReveal
                            key={stat.id}
                            delay={100 + index * 100}
                            distance={30}
                            direction="up"
                            className={`${index % 2 === 1 ? 'border-l border-white/10' : ''} ${index >= 2 ? 'border-t border-white/10 md:border-t-0' : ''} ${index > 0 ? 'md:border-l md:border-white/10' : ''}`}
                        >
                            <div className="group flex h-full flex-col items-center justify-center p-4 text-center transition-colors duration-300 hover:bg-white/5 md:p-5 lg:py-5">
                                <div className="mb-2 text-white transition-transform duration-500 group-hover:scale-90 group-hover:opacity-80 md:mb-3">
                                    {resolveIcon(stat.icon)}
                                </div>
                                <p className="mb-1 text-xl font-bold text-white transition-transform duration-500 group-hover:scale-105 md:text-2xl lg:text-3xl">
                                    <AnimatedStatValue value={stat.value} />
                                </p>
                                <p className="text-xs text-white/70 md:text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        </AnimeReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
