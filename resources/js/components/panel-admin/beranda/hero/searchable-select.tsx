import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface SearchableSelectProps {
    value?: number;
    options: UserOption[];
    onChange: (id: number) => void;
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

export default function SearchableSelect({
    value,
    options = [],
    onChange,
    onSearchChange,
    placeholder = 'Cari situs user...',
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstMount = useRef(true);
    const onSearchChangeRef = useRef(onSearchChange);

    const { auth } = usePage().props as any;
    const currentUserId = auth?.user?.id;

    useEffect(() => {
        onSearchChangeRef.current = onSearchChange;
    }, [onSearchChange]);

    // Debounce search query input
    useEffect(() => {
        // Abaikan pemanggilan pertama kali saat mount (karena query kosong)
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            onSearchChangeRef.current(searchQuery);
            setIsSearching(false);
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedOption = options.find((opt) => opt.id === value);

    return (
        <div ref={containerRef} className="relative z-50 w-full sm:w-64">
            {/* Button Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-admin-border bg-admin-card px-4 py-2.5 text-xs font-bold text-admin-text transition-all duration-300 hover:border-admin-accent/50 hover:bg-admin-bg/50 focus:ring-1 focus:ring-admin-accent/50"
            >
                <span className="truncate">
                    {selectedOption
                        ? `${selectedOption.name} ${selectedOption.id === currentUserId ? '(Situs Saya)' : ''} (${selectedOption.email.split('@')[0]})`
                        : 'Pilih Situs User'}
                </span>
                <ChevronDown
                    size={14}
                    className={cn(
                        'text-admin-text-muted transition-transform duration-300',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="animate-fadeIn absolute right-0 mt-2 w-full min-w-[280px] origin-top-right rounded-2xl border border-admin-border bg-admin-card p-2 shadow-2xl">
                    {/* Search Input */}
                    <div className="relative mb-2 flex items-center">
                        <Search
                            size={14}
                            className="absolute left-3 text-admin-text-muted"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-admin-border bg-admin-bg/50 py-2 pr-8 pl-9 text-xs text-admin-text transition-all duration-300 outline-none placeholder:text-admin-text-muted/60 focus:border-admin-accent/50 focus:ring-1 focus:ring-admin-accent/30"
                            autoFocus
                        />
                        {isSearching && (
                            <Loader2
                                size={14}
                                className="absolute right-3 animate-spin text-admin-accent"
                            />
                        )}
                    </div>

                    {/* Options List */}
                    <div className="custom-scrollbar max-h-60 space-y-1 overflow-y-auto pr-1">
                        {options.length > 0 ? (
                            options.map((opt) => {
                                const isSelected = opt.id === value;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            'flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-200',
                                            isSelected
                                                ? 'bg-admin-accent/10 font-bold text-admin-accent'
                                                : 'text-admin-text hover:bg-admin-bg',
                                        )}
                                    >
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="truncate font-semibold">
                                                {opt.name}{' '}
                                                {opt.id === currentUserId
                                                    ? '(Situs Saya)'
                                                    : ''}
                                            </p>
                                            <p className="truncate text-[10px] text-admin-text-muted">
                                                {opt.email}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <Check
                                                size={14}
                                                className="shrink-0 text-admin-accent"
                                            />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="py-6 text-center text-xs text-admin-text-muted/60">
                                Tidak ada situs user yang ditemukan.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
