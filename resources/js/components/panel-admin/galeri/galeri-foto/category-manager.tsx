import { useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';

interface CategoryManagerProps {
    categories: string[];
    onAdd: (category: string) => void;
    onDelete: (category: string) => void;
}

export default function CategoryManager({
    categories,
    onAdd,
    onDelete,
}: CategoryManagerProps) {
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = () => {
        const trimmed = newCategory.trim();
        if (!trimmed || categories.includes(trimmed)) return;
        onAdd(trimmed);
        setNewCategory('');
    };

    return (
        <div className="space-y-3 rounded-3xl border border-admin-border/60 bg-admin-bg/30 p-5">
            <div className="mb-1 flex items-center gap-2">
                <Tag size={14} className="text-admin-accent" />
                <label className="text-xs font-bold text-admin-text">
                    Manajemen Kategori Filter ({categories.length})
                </label>
            </div>

            {/* Chip list */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <div
                        key={cat}
                        className="group/cat flex items-center gap-1.5 rounded-xl border border-admin-border bg-admin-card px-3 py-1.5 text-xs font-bold text-admin-text"
                    >
                        <span>{cat}</span>
                        <button
                            type="button"
                            onClick={() => onDelete(cat)}
                            className="cursor-pointer opacity-0 transition-all group-hover/cat:opacity-100 hover:text-red-400"
                        >
                            <Trash2 size={11} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Input tambah */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    className="flex-1 rounded-xl border border-admin-border bg-admin-bg px-4 py-2.5 text-xs font-medium text-admin-text outline-hidden transition-all focus:border-admin-accent"
                    placeholder="Nama kategori baru..."
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-admin-accent/10 px-4 py-2.5 text-xs font-bold text-admin-accent transition-all hover:bg-admin-accent hover:text-white"
                >
                    <Plus size={13} /> Tambah
                </button>
            </div>
        </div>
    );
}
