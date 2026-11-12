import React, { useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Tulis ringkasan berita di sini...',
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    // Sync input value with the editor's innerHTML (only if they are different to prevent cursor jumps)
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            // Send empty string if editor is empty or just has a break line
            if (html === '<br>' || html === '') {
                onChange('');
            } else {
                onChange(html);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const executeCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value);
        handleInput();
        editorRef.current?.focus();
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-admin-border bg-admin-bg/50 transition-all duration-300 focus-within:border-admin-accent/80 focus-within:shadow-[0_0_12px_rgba(0,164,185,0.15)]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-admin-border/50 bg-admin-card/30 p-2 select-none">
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('bold');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Tebal (Bold)"
                >
                    <Bold size={13} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('italic');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Miring (Italic)"
                >
                    <Italic size={13} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('underline');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Garis Bawah (Underline)"
                >
                    <Underline size={13} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('strikeThrough');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Coret (Strikethrough)"
                >
                    <Strikethrough size={13} />
                </button>

                <div className="mx-1 h-4 w-px bg-admin-border/50" />

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('insertUnorderedList');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Daftar Bullet (Unordered List)"
                >
                    <List size={13} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('insertOrderedList');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Daftar Angka (Ordered List)"
                >
                    <ListOrdered size={13} />
                </button>

                <div className="mx-1 h-4 w-px bg-admin-border/50" />

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('justifyLeft');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Rata Kiri"
                >
                    <AlignLeft size={13} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('justifyCenter');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Rata Tengah"
                >
                    <AlignCenter size={13} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('justifyRight');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Rata Kanan"
                >
                    <AlignRight size={13} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('justifyFull');
                    }}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-admin-text active:scale-90"
                    title="Rata Kiri-Kanan (Justify)"
                >
                    <AlignJustify size={13} />
                </button>

                <div className="mx-1 h-4 w-px bg-admin-border/50" />

                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('removeFormat');
                    }}
                    className="ml-auto flex size-7 cursor-pointer items-center justify-center rounded-lg text-admin-text-muted transition-all hover:bg-admin-card-hover hover:text-red-400 active:scale-90"
                    title="Hapus Format"
                >
                    <Trash2 size={13} />
                </button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                role="textbox"
                aria-multiline="true"
                aria-label={placeholder || 'Isi konten'}
                onInput={handleInput}
                onBlur={handleInput}
                onPaste={handlePaste}
                className="custom-scrollbar prose prose-sm max-h-[300px] min-h-[140px] max-w-none overflow-y-auto px-5 py-4 text-sm font-medium text-admin-text outline-hidden focus:outline-hidden dark:prose-invert [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&:empty:before]:pointer-events-none [&:empty:before]:text-admin-text-muted/50 [&:empty:before]:content-[attr(data-placeholder)]"
                data-placeholder={placeholder}
            />
        </div>
    );
}
