import { useCmsSave } from '@/hooks/use-cms-save';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { update as updateCta } from '@/routes/panel-admin/cta-section';
import AdminToast from '@/components/panel-admin/admin-toast';
import EditorPanel from './editor-panel';
import PreviewPanel from './preview-panel';

interface CtaSection {
    text: string;
    button_label: string;
    button_href: string;
    bg_source: 'url' | 'upload';
    background_src: string;
    bg_file_name: string;
}

interface CtaSectionEditorProps {
    ctaSection?: CtaSection;
}

export default function CtaSectionEditor({
    ctaSection,
}: CtaSectionEditorProps) {
    const [text, setText] = useState(
        ctaSection?.text ?? 'Anda membutuhkan layanan dari kami?',
    );
    const [buttonLabel, setButtonLabel] = useState(
        ctaSection?.button_label ?? 'Hubungi Kami',
    );
    const [buttonHref, setButtonHref] = useState(
        ctaSection?.button_href ?? '#hubungi',
    );
    const [backgroundSrc, setBackgroundSrc] = useState(
        ctaSection?.background_src ?? '/assets/beranda/cta/cta.jpg',
    );
    const [bgSource, setBgSource] = useState<'url' | 'upload'>(
        ctaSection?.bg_source ?? 'url',
    );
    const [uploadingBg, setUploadingBg] = useState(false);
    const [bgFileName, setBgFileName] = useState(
        ctaSection?.bg_file_name ?? '',
    );
    const [bgFile, setBgFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useCmsSave();
    const [showToast, setShowToast] = useState(false);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

    const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingBg(true);
        setBgFileName(file.name);
        setBgFile(file);

        const localUrl = URL.createObjectURL(file);
        setBackgroundSrc(localUrl);
        setUploadingBg(false);
    };

    const handleSave = () => {
        setIsSaving(true);

        const formData = new FormData();
        formData.append('text', text);
        formData.append('button_label', buttonLabel);
        formData.append('button_href', buttonHref);
        formData.append('bg_source', bgSource);
        formData.append('background_src', backgroundSrc || '');
        formData.append('bg_file_name', bgFileName || '');

        if (bgSource === 'upload' && bgFile) {
            formData.append('bg_file', bgFile);
        }

        router.post(updateCta.url(), formData as any, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            },
            onError: (err) => {
                setIsSaving(false);
                console.error('Save failed:', err);
                const errorMsg = Object.values(err).join('\n');
                alert(
                    `Gagal menyimpan perubahan:\n${errorMsg || 'Silakan periksa kolom input Anda.'}`,
                );
            },
        });
    };

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Tab toggle */}
            <div className="flex w-fit items-center gap-2 rounded-2xl border border-admin-border bg-admin-bg p-1.5">
                {(['editor', 'preview'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'cursor-pointer rounded-xl px-5 py-2 text-sm font-bold transition-all duration-200',
                            activeTab === tab
                                ? 'bg-admin-accent text-white shadow'
                                : 'text-admin-text-muted hover:text-admin-text',
                        )}
                    >
                        {tab === 'editor' ? 'Editor' : 'Live Preview'}
                    </button>
                ))}
            </div>

            {activeTab === 'editor' ? (
                <EditorPanel
                    text={text}
                    setText={setText}
                    buttonLabel={buttonLabel}
                    setButtonLabel={setButtonLabel}
                    buttonHref={buttonHref}
                    setButtonHref={setButtonHref}
                    backgroundSrc={backgroundSrc}
                    setBackgroundSrc={setBackgroundSrc}
                    bgSource={bgSource}
                    setBgSource={setBgSource}
                    uploadingBg={uploadingBg}
                    bgFileName={bgFileName}
                    isSaving={isSaving}
                    handleBgFileChange={handleBgFileChange}
                    handleSave={handleSave}
                />
            ) : (
                <PreviewPanel
                    backgroundSrc={backgroundSrc}
                    text={text}
                    buttonHref={buttonHref}
                    buttonLabel={buttonLabel}
                />
            )}

            <AdminToast
                show={showToast}
                message="Perubahan berhasil disimpan!"
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
