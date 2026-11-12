import { cn } from '@/lib/utils';
import { ICON_MAP, type ServiceItem } from './service-card-editor';

interface PreviewPanelProps {
    title: string;
    services: ServiceItem[];
}

function PreviewCard({ service }: { service: ServiceItem }) {
    return (
        <div className="relative rounded-2xl border border-emerald-500/5 bg-white p-5 pt-8 text-sm text-[#1a2e2e] shadow-sm transition-all duration-300 dark:bg-[#122323] dark:text-white">
            <div className="absolute -top-4 left-3 flex h-8 w-8 items-center justify-center rounded-xl border border-admin-border/5 bg-white text-[#2bb5b2] shadow-md dark:bg-[#1a2e2e]">
                {ICON_MAP[service.icon]}
            </div>
            <h4 className="mt-2 text-xs font-bold text-[#1a2e2e] dark:text-white">
                {service.title || 'Judul Layanan'}
            </h4>
            <p className="mt-1.5 line-clamp-3 text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
                {service.description ||
                    'Deskripsi layanan akan muncul di sini.'}
            </p>
        </div>
    );
}

export default function PreviewPanel({ title, services }: PreviewPanelProps) {
    return (
        <div className="custom-scrollbar relative flex-1 overflow-y-auto rounded-[2rem] border border-admin-border bg-[#edf5f6] p-5 select-none dark:bg-[#0a1a1a]">
            {/* Layout Konten Utama Mockup */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <h2 className="text-xs leading-tight font-bold text-[#1a2e2e] lg:text-sm dark:text-white">
                        {title || 'Layanan Terbaik Akan Selalu Kami Berikan'}
                    </h2>
                    <div className="h-0.5 w-10 rounded-full bg-emerald-400" />
                </div>

                <div className="mt-2 grid grid-cols-1 gap-4">
                    {services.map((service) => (
                        <PreviewCard key={service.id} service={service} />
                    ))}
                    {services.length === 0 && (
                        <p className="py-12 text-center text-[10px] text-gray-400 dark:text-gray-500">
                            Belum ada layanan untuk ditampilkan.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
