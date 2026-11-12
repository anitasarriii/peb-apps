import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * CustomDropdown — Komponen dropdown kustom dengan animasi dan dark mode support.
 * Mendukung click-outside detection untuk menutup dropdown secara otomatis.
 */
const CustomDropdown = ({
    value,
    onChange,
    options,
    icon: Icon,
}: {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    icon: LucideIcon;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click-outside handler untuk menutup dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full lg:w-52" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border bg-gray-50/50 px-4 py-2.5 transition-all duration-500 select-none dark:bg-black/20',
                    isOpen
                        ? 'border-[#00A4B9] bg-white shadow-xl shadow-[#00A4B9]/5 dark:bg-[#1a3a3a]'
                        : 'border-gray-200/60 hover:border-[#00A4B9]/20 hover:bg-white dark:border-white/10 dark:hover:bg-[#1a3a3a]',
                )}
            >
                <Icon
                    className={cn(
                        'transition-colors duration-500',
                        isOpen
                            ? 'text-[#00A4B9] dark:text-[#2dd4bf]'
                            : 'text-gray-400 dark:text-white/40',
                    )}
                    size={18}
                />
                <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-white/80">
                    {value}
                </span>
                <ChevronDown
                    className={cn(
                        'text-gray-400 transition-transform duration-500 dark:text-white/40',
                        isOpen && 'rotate-180',
                    )}
                    size={16}
                />
            </div>

            <div
                className={cn(
                    'absolute top-[calc(100%+0.5rem)] right-0 left-0 z-[100] origin-top overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-500 dark:border-white/10 dark:bg-[#1a3a3a]',
                    isOpen
                        ? 'visible translate-y-0 scale-100 opacity-100'
                        : 'invisible -translate-y-2 scale-95 opacity-0',
                )}
            >
                <div className="max-h-60 overflow-y-auto py-2 transition-all [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-[#00A4B9]/30 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={cn(
                                'flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                                value === opt
                                    ? 'bg-[#00A4B9]/5 text-[#00A4B9] dark:bg-[#00A4B9]/10 dark:text-[#2dd4bf]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#00A4B9] dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-[#2dd4bf]',
                            )}
                        >
                            {opt}
                            {value === opt && (
                                <div className="size-1.5 rounded-full bg-[#00A4B9] dark:bg-[#2dd4bf]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomDropdown;
