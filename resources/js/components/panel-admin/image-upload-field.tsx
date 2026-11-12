import { useId } from 'react';

interface ImageUploadFieldProps {
    label: string;
    source: string;
    preview?: string;
    fileName?: string;
    onUrlChange: (value: string) => void;
    onFileChange: (file: File, preview: string) => void;
}

export default function ImageUploadField({
    label,
    source,
    preview,
    fileName,
    onUrlChange,
    onFileChange,
}: ImageUploadFieldProps) {
    const id = useId();

    return (
        <div className="min-w-0 space-y-3 rounded-xl border border-admin-border p-4">
            <label
                htmlFor={id}
                className="block text-xs font-semibold text-admin-text"
            >
                {label}
            </label>
            <input
                id={id}
                type="text"
                value={source}
                onChange={(event) => onUrlChange(event.target.value)}
                placeholder="/assets/... atau https://... (opsional jika memilih file)"
                className="w-full min-w-0 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text"
            />
            <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                aria-label={`Upload ${label}`}
                onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
return;
}

                    if (file.size > 500 * 1024 * 1024) {
                        alert('Ukuran gambar maksimal 500 MB.');
                        event.target.value = '';

                        return;
                    }

                    if (preview?.startsWith('blob:')) {
URL.revokeObjectURL(preview);
}

                    onFileChange(file, URL.createObjectURL(file));
                }}
                className="block w-full min-w-0 text-xs text-admin-text file:mr-3 file:rounded-lg file:border-0 file:bg-admin-accent/10 file:px-3 file:py-2 file:text-admin-accent"
            />
            <p className="text-xs break-words text-admin-text-muted">
                {fileName || 'JPG, PNG, GIF, WebP • Maksimal 500 MB per gambar'}
            </p>
            {(preview || source) && (
                <img
                    src={preview || source}
                    alt={`Preview ${label}`}
                    className="max-h-64 w-full rounded-lg bg-admin-bg object-contain"
                />
            )}
        </div>
    );
}
