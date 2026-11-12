import { ImageIcon } from 'lucide-react';
import type { ProjectItem } from './project-card-editor';

interface PreviewPanelProps {
    sectionTitle: string;
    sectionDesc: string;
    projects: ProjectItem[];
}

export default function PreviewPanel({
    sectionTitle,
    sectionDesc,
    projects,
}: PreviewPanelProps) {
    return (
        <div className="custom-scrollbar relative flex-1 overflow-y-auto rounded-[2rem] border border-admin-border bg-[#edf5f6] p-5 select-none dark:bg-[#061818]">
            {/* Layout Konten Utama Mockup */}
            <div className="space-y-5">
                <div className="space-y-2">
                    <h2 className="text-xs font-bold text-[#1a2e2e] lg:text-sm dark:text-white">
                        {sectionTitle || 'Portfolio Proyek'}
                    </h2>
                    <p className="text-[9px] leading-relaxed text-[#1a2e2e]/70 dark:text-white/60">
                        {sectionDesc}
                    </p>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex flex-col gap-2 rounded-xl border border-admin-border/10 bg-white p-2 dark:bg-[#112a2a]"
                        >
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (
                                                e.target as HTMLImageElement
                                            ).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[8px] font-bold text-white backdrop-blur-md">
                                    {project.year}
                                </div>
                            </div>
                            <div>
                                <span className="block text-[7px] font-bold tracking-widest text-[#1a2e2e]/40 uppercase dark:text-white/40">
                                    {project.category || 'KATEGORI'}
                                </span>
                                <h3 className="mt-0.5 text-[9px] leading-tight font-bold text-[#1a2e2e] dark:text-white">
                                    {project.title || 'Judul Proyek'}
                                </h3>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <p className="py-8 text-center text-[10px] text-gray-400 dark:text-gray-500">
                            Belum ada proyek untuk ditampilkan.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
