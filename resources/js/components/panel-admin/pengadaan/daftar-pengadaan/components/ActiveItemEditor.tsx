import React from 'react';
import AdminSelect from '@/components/panel-admin/admin-select';
import RichTextEditor from '@/components/panel-admin/laporan/berita-pengumuman/rich-text-editor';
import type { PengadaanItem, Dokumen, Syarat, StatusType } from '../types';
import { STATUS_OPTIONS } from '../types';
import CoverImageEditor from './CoverImageEditor';
import ImageUploadField from '@/components/panel-admin/image-upload-field';
import DokumenListEditor from './DokumenListEditor';
import MapsLocationEditor from './MapsLocationEditor';
import SyaratListEditor from './SyaratListEditor';

interface ActiveItemEditorProps {
    activeItem: PengadaanItem;
    categories: string[];
    handleChange: (updated: PengadaanItem) => void;

    // Cover Image Props
    sourceType: 'url' | 'upload';
    displayUrl: string;
    uploadingImage: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // Syarat Props
    activeDeskripsi: string;
    activeSyaratList: Syarat[];
    handleAddSyarat: () => void;
    handleDeleteSyarat: (id: string) => void;
    handleChangeSyarat: (id: string, text: string) => void;
    draggedSyaratIdx: number | null;
    setDraggedSyaratIdx: (idx: number | null) => void;
    handleDragStartSyarat: (idx: number) => void;
    handleDragOverSyarat: (e: React.DragEvent, idx: number) => void;

    // Dokumen Props
    activeDokumenList: Dokumen[];
    handleAddDokumen: () => void;
    handleDeleteDokumen: (id: string) => void;
    handleChangeDokumen: (updated: Dokumen) => void;
    draggedDokIdx: number | null;
    setDraggedDokIdx: (idx: number | null) => void;
    handleDragStartDok: (idx: number) => void;
    handleDragOverDok: (e: React.DragEvent, idx: number) => void;
    handleFileUpload: (
        dokId: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;

    // Maps Props
    activeMapsLabel: string;
    activeMapsMode: 'koordinat' | 'embed';
    activeMapsKoordinat: string;
    activeMapsEmbedUrl: string;
    resolvedMapsUrl: string;
}

export default function ActiveItemEditor({
    activeItem,
    categories,
    handleChange,
    sourceType,
    displayUrl,
    uploadingImage,
    fileInputRef,
    handleFileChange,
    activeDeskripsi,
    activeSyaratList,
    handleAddSyarat,
    handleDeleteSyarat,
    handleChangeSyarat,
    draggedSyaratIdx,
    setDraggedSyaratIdx,
    handleDragStartSyarat,
    handleDragOverSyarat,
    activeDokumenList,
    handleAddDokumen,
    handleDeleteDokumen,
    handleChangeDokumen,
    draggedDokIdx,
    setDraggedDokIdx,
    handleDragStartDok,
    handleDragOverDok,
    handleFileUpload,
    fileRefs,
    activeMapsLabel,
    activeMapsMode,
    activeMapsKoordinat,
    activeMapsEmbedUrl,
    resolvedMapsUrl,
}: ActiveItemEditorProps) {
    const fieldClass =
        'w-full rounded-lg border border-admin-border bg-admin-bg/40 px-3 py-2.5 text-sm text-admin-text outline-none transition-colors focus:border-admin-accent';
    const labelClass = 'mb-2 block text-xs font-medium text-admin-text';
    const optionalClass =
        'rounded-xl border border-admin-border bg-admin-bg/20';
    const summaryClass =
        'cursor-pointer px-4 py-3.5 text-sm font-medium text-admin-text marker:text-admin-text-muted';

    return (
        <div className="space-y-6">
            <section
                aria-labelledby="procurement-basic-title"
                className="space-y-4"
            >
                <div className="border-b border-admin-border pb-3">
                    <h4
                        id="procurement-basic-title"
                        className="text-sm font-semibold text-admin-text"
                    >
                        Informasi utama
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-admin-text-muted">
                        Isi judul, kategori, jadwal, dan wilayah pengadaan.
                    </p>
                </div>
                <div>
                    <label htmlFor="procurement-title" className={labelClass}>
                        Judul pengadaan <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="procurement-title"
                        type="text"
                        value={activeItem.title}
                        onChange={(event) =>
                            handleChange({
                                ...activeItem,
                                title: event.target.value,
                            })
                        }
                        className={fieldClass}
                        placeholder="Contoh: Pengadaan jasa pemeliharaan pembangkit"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex items-center gap-3 text-sm text-admin-text sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={!!activeItem.isArchived}
                            onChange={(event) =>
                                handleChange({
                                    ...activeItem,
                                    isArchived: event.target.checked,
                                })
                            }
                            className="size-4 accent-admin-accent"
                        />
                        Arsipkan pengadaan ini
                    </label>
                    <div>
                        <span className={labelClass}>Kategori</span>
                        <AdminSelect
                            value={activeItem.category}
                            onValueChange={(value) =>
                                handleChange({ ...activeItem, category: value })
                            }
                            options={categories}
                        />
                    </div>
                    <div>
                        <span className={labelClass}>Status</span>
                        <AdminSelect
                            value={activeItem.status}
                            onValueChange={(value) =>
                                handleChange({
                                    ...activeItem,
                                    status: value as StatusType,
                                })
                            }
                            options={STATUS_OPTIONS}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="procurement-start"
                            className={labelClass}
                        >
                            {activeItem.isArchived
                                ? 'Tanggal pengumuman'
                                : 'Tanggal mulai'}{' '}
                            <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="procurement-start"
                            type={
                                !activeItem.startDate ||
                                /^\d{4}-\d{2}-\d{2}$/.test(activeItem.startDate)
                                    ? 'date'
                                    : 'text'
                            }
                            value={activeItem.startDate}
                            onChange={(event) =>
                                handleChange({
                                    ...activeItem,
                                    startDate: event.target.value,
                                })
                            }
                            className={fieldClass}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="procurement-end" className={labelClass}>
                            Tanggal selesai{' '}
                            {!activeItem.isArchived && (
                                <span className="text-red-400">*</span>
                            )}
                        </label>
                        <input
                            id="procurement-end"
                            type={
                                !activeItem.endDate ||
                                /^\d{4}-\d{2}-\d{2}$/.test(activeItem.endDate)
                                    ? 'date'
                                    : 'text'
                            }
                            value={activeItem.endDate}
                            onChange={(event) =>
                                handleChange({
                                    ...activeItem,
                                    endDate: event.target.value,
                                })
                            }
                            className={fieldClass}
                            required={!activeItem.isArchived}
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="procurement-location"
                        className={labelClass}
                    >
                        Lokasi / wilayah <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="procurement-location"
                        type="text"
                        value={activeItem.location}
                        onChange={(event) =>
                            handleChange({
                                ...activeItem,
                                location: event.target.value,
                            })
                        }
                        className={fieldClass}
                        placeholder="Contoh: Batam Center, Batam"
                        required
                    />
                </div>
            </section>

            <section
                className="space-y-3 border-t border-admin-border pt-5"
                aria-labelledby="procurement-description-title"
            >
                <h4
                    id="procurement-description-title"
                    className="text-sm font-semibold text-admin-text"
                >
                    Deskripsi pengadaan
                </h4>
                <RichTextEditor
                    value={activeDeskripsi}
                    onChange={(value) =>
                        handleChange({ ...activeItem, deskripsi: value })
                    }
                    placeholder="Jelaskan pekerjaan, ruang lingkup, dan informasi penting pengadaan..."
                />
            </section>

            <section
                className="space-y-3"
                aria-labelledby="procurement-additional-title"
            >
                <div className="pt-1">
                    <h4
                        id="procurement-additional-title"
                        className="text-sm font-semibold text-admin-text"
                    >
                        Informasi tambahan
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-admin-text-muted">
                        Opsional. Buka bagian yang ingin dilengkapi.
                    </p>
                </div>
                <details className={optionalClass}>
                    <summary className={summaryClass}>Gambar sampul</summary>
                    <div className="border-t border-admin-border p-4">
                        <CoverImageEditor
                            activeItem={activeItem}
                            sourceType={sourceType}
                            displayUrl={displayUrl}
                            uploadingImage={uploadingImage}
                            fileInputRef={fileInputRef}
                            handleFileChange={handleFileChange}
                            handleChange={handleChange}
                        />
                    </div>
                </details>
                <details className={optionalClass}>
                    <summary className={summaryClass}>
                        Gambar utama halaman detail
                    </summary>
                    <div className="border-t border-admin-border p-4">
                        <ImageUploadField
                            label="Gambar utama Pengadaan"
                            source={activeItem.bannerImage || ''}
                            preview={activeItem.bannerPreviewUrl}
                            fileName={activeItem.bannerFileName}
                            onUrlChange={(bannerImage) =>
                                handleChange({
                                    ...activeItem,
                                    bannerImage,
                                    bannerFile: null,
                                    bannerPreviewUrl: undefined,
                                })
                            }
                            onFileChange={(bannerFile, bannerPreviewUrl) =>
                                handleChange({
                                    ...activeItem,
                                    bannerFile,
                                    bannerPreviewUrl,
                                    bannerFileName: bannerFile.name,
                                })
                            }
                        />
                        <p className="mt-2 text-xs text-admin-text-muted">
                            Jika belum diisi, halaman detail memakai gambar
                            sampul.
                        </p>
                    </div>
                </details>
                <details className={optionalClass}>
                    <summary className={summaryClass}>
                        Syarat pendaftaran{' '}
                        <span className="ml-2 text-xs font-normal text-admin-text-muted">
                            {activeSyaratList.length} syarat
                        </span>
                    </summary>
                    <div className="border-t border-admin-border p-4">
                        <SyaratListEditor
                            activeSyaratList={activeSyaratList}
                            handleAddSyarat={handleAddSyarat}
                            handleDeleteSyarat={handleDeleteSyarat}
                            handleChangeSyarat={handleChangeSyarat}
                            draggedSyaratIdx={draggedSyaratIdx}
                            setDraggedSyaratIdx={setDraggedSyaratIdx}
                            handleDragStartSyarat={handleDragStartSyarat}
                            handleDragOverSyarat={handleDragOverSyarat}
                        />
                    </div>
                </details>
                <details className={optionalClass}>
                    <summary className={summaryClass}>
                        Dokumen pendukung{' '}
                        <span className="ml-2 text-xs font-normal text-admin-text-muted">
                            {activeDokumenList.length} dokumen
                        </span>
                    </summary>
                    <div className="border-t border-admin-border p-4">
                        <DokumenListEditor
                            activeDokumenList={activeDokumenList}
                            handleAddDokumen={handleAddDokumen}
                            handleDeleteDokumen={handleDeleteDokumen}
                            handleChangeDokumen={handleChangeDokumen}
                            draggedDokIdx={draggedDokIdx}
                            setDraggedDokIdx={setDraggedDokIdx}
                            handleDragStartDok={handleDragStartDok}
                            handleDragOverDok={handleDragOverDok}
                            handleFileUpload={handleFileUpload}
                            fileRefs={fileRefs}
                        />
                    </div>
                </details>
                <details className={optionalClass}>
                    <summary className={summaryClass}>Peta lokasi</summary>
                    <div className="border-t border-admin-border p-4">
                        <MapsLocationEditor
                            activeItem={activeItem}
                            activeMapsLabel={activeMapsLabel}
                            activeMapsMode={activeMapsMode}
                            activeMapsKoordinat={activeMapsKoordinat}
                            activeMapsEmbedUrl={activeMapsEmbedUrl}
                            resolvedMapsUrl={resolvedMapsUrl}
                            handleChange={handleChange}
                        />
                    </div>
                </details>
            </section>
        </div>
    );
}
