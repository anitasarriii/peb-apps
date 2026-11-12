import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function PortfolioPagination({
    currentPage,
    totalPages,
    onPageChange,
}: PortfolioPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-16 flex items-center justify-center gap-2">
            {/* Prev button */}
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all hover:border-[#00A4B9] hover:text-[#00A4B9] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#122b2b] dark:text-white/20 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={cn(
                            'flex size-10 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300',
                            currentPage === pageNum
                                ? 'bg-[#00A4B9] font-bold text-white shadow-lg shadow-[#00A4B9]/20 dark:bg-[#2dd4bf] dark:text-[#0d2e2e]'
                                : 'border border-gray-200 bg-white text-gray-600 hover:border-[#00A4B9] hover:text-[#00A4B9] dark:border-white/10 dark:bg-[#122b2b] dark:text-white/60 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]',
                        )}
                    >
                        {pageNum}
                    </button>
                ),
            )}

            {/* Next button */}
            <button
                onClick={() =>
                    onPageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all hover:border-[#00A4B9] hover:text-[#00A4B9] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#122b2b] dark:text-white/20 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
