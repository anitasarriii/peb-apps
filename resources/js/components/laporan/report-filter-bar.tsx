import { Calendar, Search, Filter } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import CustomDropdown from '@/components/laporan/custom-dropdown';

/**
 * Props untuk ReportFilterBar.
 * State filter dikelola di parent (ReportSection) dan diteruskan via props
 * agar semua section bisa bereaksi terhadap perubahan filter.
 */
interface ReportFilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    categoryFilter: string;
    onCategoryChange: (value: string) => void;
    yearFilter: string;
    onYearChange: (value: string) => void;
    onReset: () => void;
    categories: string[];
    years: string[];
}

/**
 * ReportFilterBar — Modern filter bar dengan search input, category dropdown,
 * year dropdown, dan tombol reset. Menggunakan backdrop-blur dan rounded design.
 */
export default function ReportFilterBar({
    searchTerm,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    yearFilter,
    onYearChange,
    onReset,
    categories,
    years,
}: ReportFilterBarProps) {
    return (
        <AnimeReveal delay={200} distance={20} className="relative z-30">
            <div className="mb-8 w-full">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#0d2e2e]/10 bg-white p-3 transition-colors duration-500 lg:flex-row dark:border-white/10 dark:bg-[#122b2b]">
                    {/* Search Input */}
                    <div className="flex w-full min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200/60 bg-gray-50/50 px-4 py-2.5 transition-colors focus-within:border-[#00A4B9]/40 dark:border-white/10 dark:bg-black/20">
                        <Search
                            className="text-gray-400 dark:text-white/30"
                            size={20}
                        />
                        <input
                            type="text"
                            aria-label="Cari laporan"
                            placeholder="Cari kata kunci laporan atau analisis..."
                            className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 dark:text-white/80 dark:placeholder:text-white/20"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <CustomDropdown
                        value={categoryFilter}
                        onChange={onCategoryChange}
                        options={categories}
                        icon={Filter}
                    />

                    {/* Year Filter */}
                    <CustomDropdown
                        value={yearFilter}
                        onChange={onYearChange}
                        options={years}
                        icon={Calendar}
                    />

                    {/* Reset Filter Button */}
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex min-h-10 w-full shrink-0 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-xs font-medium text-[#008c9e] transition-colors hover:bg-[#00A4B9]/5 lg:w-auto dark:text-[#2dd4bf]"
                    >
                        Reset filter
                    </button>
                </div>
            </div>
        </AnimeReveal>
    );
}
