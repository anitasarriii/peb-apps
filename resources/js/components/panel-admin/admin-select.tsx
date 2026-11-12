import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSelectProps {
    value: string;
    onValueChange?: (value: string) => void;
    onChange?: (value: string) => void;
    options: (string | { value: string; label: string })[];
    placeholder?: string;
    labels?: Record<string, string>;
}

export default function AdminSelect({
    value,
    onValueChange,
    onChange,
    options,
    placeholder = 'Pilih...',
    labels,
}: AdminSelectProps) {
    const handleChange = (val: string) => {
        onValueChange?.(val);
        onChange?.(val);
    };

    return (
        <SelectPrimitive.Root value={value} onValueChange={handleChange}>
            {/* Trigger */}
            <SelectPrimitive.Trigger
                className={cn(
                    'group flex w-full cursor-pointer items-center justify-between gap-3',
                    'rounded-2xl border border-admin-border bg-admin-bg/50 px-5 py-4',
                    'text-sm font-medium text-admin-text outline-hidden',
                    'transition-all duration-300',
                    'hover:border-admin-accent/40',
                    'focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30',
                    'data-[state=open]:border-admin-accent data-[state=open]:ring-1 data-[state=open]:ring-admin-accent/30',
                )}
            >
                <SelectPrimitive.Value
                    placeholder={
                        <span className="text-admin-text-muted">
                            {placeholder}
                        </span>
                    }
                />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown
                        size={16}
                        className="shrink-0 text-admin-text-muted transition-transform duration-300 group-data-[state=open]:rotate-180"
                    />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            {/* Dropdown Content */}
            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={6}
                    className={cn(
                        'z-[9999] w-[var(--radix-select-trigger-width)]',
                        'overflow-hidden rounded-2xl border border-admin-border',
                        'bg-admin-card shadow-2xl shadow-black/30',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                    )}
                >
                    <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-admin-text-muted">
                        <ChevronDown size={14} className="rotate-180" />
                    </SelectPrimitive.ScrollUpButton>

                    <SelectPrimitive.Viewport className="max-h-60 p-1.5">
                        {options.map((option) => {
                            const optionValue =
                                typeof option === 'string'
                                    ? option
                                    : option.value;
                            const optionLabel =
                                typeof option === 'string'
                                    ? (labels?.[option] ?? option)
                                    : option.label;

                            return (
                                <SelectPrimitive.Item
                                    key={optionValue}
                                    value={optionValue}
                                    className={cn(
                                        'group relative flex w-full cursor-pointer items-center gap-3 select-none',
                                        'rounded-xl px-4 py-2.5 text-sm font-medium outline-hidden',
                                        'text-admin-text-muted transition-all duration-150',
                                        'hover:bg-admin-card-hover hover:text-admin-text',
                                        'data-[state=checked]:bg-admin-accent/10 data-[state=checked]:text-admin-accent',
                                        'data-[highlighted]:bg-admin-card-hover data-[highlighted]:text-admin-text',
                                        'data-[highlighted][data-state=checked]:bg-admin-accent/15 data-[highlighted][data-state=checked]:text-admin-accent',
                                    )}
                                >
                                    {/* Check indicator */}
                                    <span className="flex size-4 shrink-0 items-center justify-center">
                                        <SelectPrimitive.ItemIndicator>
                                            <Check
                                                size={13}
                                                className="text-admin-accent"
                                            />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>

                                    <SelectPrimitive.ItemText className="flex-1">
                                        {optionLabel}
                                    </SelectPrimitive.ItemText>

                                    {/* Active dot */}
                                    <span className="size-1.5 rounded-full bg-admin-accent opacity-0 shadow-[0_0_6px_rgba(0,164,185,0.8)] transition-opacity group-data-[state=checked]:opacity-100" />
                                </SelectPrimitive.Item>
                            );
                        })}
                    </SelectPrimitive.Viewport>

                    <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-admin-text-muted">
                        <ChevronDown size={14} />
                    </SelectPrimitive.ScrollDownButton>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}
