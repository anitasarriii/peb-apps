import AnimeReveal from '@/components/global/anime-reveal';

interface PortfolioFilterProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    categories?: string[];
}

// Label yang lebih readable untuk kategori
const CATEGORY_LABELS: Record<string, string> = {
    all: 'Semua Proyek',
    gas: 'Gas Infrastructure',
    solar: 'Solar Energy',
    operations: 'Operations',
    power: 'Power Plant',
};

function getCategoryLabel(id: string): string {
    return (
        CATEGORY_LABELS[id] ??
        id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')
    );
}

export default function PortfolioFilter({
    activeCategory,
    onCategoryChange,
    categories,
}: PortfolioFilterProps) {
    // Gunakan kategori dari DB jika tersedia, fallback ke default
    const categoryIds = categories?.length
        ? ['all', ...categories]
        : ['all', 'gas', 'solar', 'operations', 'power'];

    return (
        <AnimeReveal delay={200} distance={20} className="flex w-max flex-nowrap gap-2">
            {categoryIds.map((id) => (
                <button
                    key={id}
                    onClick={() => onCategoryChange(id)}
                    className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 select-none ${
                        activeCategory === id
                            ? 'bg-[#0d2e2e] text-white shadow-md dark:bg-[#00A4B9]'
                            : 'border-gray-150 border bg-white text-gray-500 hover:bg-gray-100 dark:border-white/5 dark:bg-[#122b2b] dark:text-white/60 dark:hover:bg-white/5'
                    }`}
                >
                    {getCategoryLabel(id)}
                </button>
            ))}
        </AnimeReveal>
    );
}
