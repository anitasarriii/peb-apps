import { useState } from 'react';
import { BriefcaseBusiness, ShieldCheck } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import Mermaid from '@/components/global/mermaid';

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

interface TeamSectionProps {
    title?: string;
    subtitle?: string;
    members?: TeamMember[];
}

export default function TeamSection({
    title = 'Tim Kepemimpinan',
    subtitle = 'Dibalik keberhasilan PEB, terdapat para profesional berdedikasi tinggi dengan pengalaman luas di industri energi.',
    members = [
        {
            name: 'Rudi Hermawan',
            role: 'Komisaris Utama',
            image: 'https://i.pravatar.cc/400?u=rudi_h',
        },
        {
            name: 'Slamet Riyadi',
            role: 'Komisaris',
            image: 'https://i.pravatar.cc/400?u=slamet',
        },
        {
            name: 'Budi Santoso',
            role: 'Direktur Utama',
            image: 'https://i.pravatar.cc/400?u=budi',
        },
        {
            name: 'Siti Aminah',
            role: 'Direktur Operasional',
            image: 'https://i.pravatar.cc/400?u=siti',
        },
        {
            name: 'Hendra Wijaya',
            role: 'Direktur Keuangan',
            image: 'https://i.pravatar.cc/400?u=hendra',
        },
        {
            name: 'Maya Putri',
            role: 'Direktur Teknik',
            image: 'https://i.pravatar.cc/400?u=maya',
        },
    ],
}: TeamSectionProps) {
    const visibleMembers = members.filter(
        (member) =>
            member.role.trim().replace(/\s+/g, ' ').toLowerCase() !==
            'komite komisaris',
    );

    const commissioners = visibleMembers.filter(
        (member) =>
            member.role.toLowerCase().includes('komisaris') ||
            member.role.toLowerCase().includes('commissioner'),
    );

    const directors = visibleMembers.filter(
        (member) =>
            !member.role.toLowerCase().includes('komisaris') &&
            !member.role.toLowerCase().includes('commissioner'),
    );

    const renderLeadershipGroup = (
        groupMembers: TeamMember[],
        heading: string,
        label: string,
        reverse = false,
    ) =>
        groupMembers.map((member, index) => (
            <AnimeReveal
                key={member.name + member.role}
                delay={120 + index * 70}
                distance={24}
                direction="up"
                className={
                    'group grid items-center overflow-visible rounded-2xl border border-[#0d2e2e]/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-white/10 dark:bg-[#102d2d] ' +
                    (reverse
                        ? 'sm:grid-cols-[minmax(0,1fr)_30%]'
                        : 'sm:grid-cols-[30%_minmax(0,1fr)]')
                }
            >
                <div
                    className={
                        'relative z-10 mx-auto -mt-4 w-[calc(100%-2rem)] max-w-[280px] rounded-2xl border border-[#0d2e2e]/10 bg-white p-2 shadow-xl shadow-[#0d2e2e]/15 transition-transform duration-300 motion-safe:group-hover:-translate-y-1 sm:my-[-12px] sm:w-[calc(100%-1rem)] dark:border-white/15 dark:bg-[#163b3b] dark:shadow-black/25 ' +
                        (reverse ? 'sm:order-2' : '')
                    }
                >
                    <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="h-72 w-full rounded-xl bg-[#EDF5F6] object-contain object-center sm:h-80 dark:bg-[#0d2e2e]"
                    />
                </div>
                <div className="relative flex flex-col justify-center rounded-2xl bg-linear-to-br from-white to-[#EDF5F6]/70 p-6 sm:p-7 lg:p-8 dark:from-[#102d2d] dark:to-[#163b3b]">
                    <div className="flex items-center gap-3 border-b border-[#0d2e2e]/8 pb-4 dark:border-white/10">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#00A4B9]/10 text-[#008c9e] dark:text-[#2dd4bf]">
                            {reverse ? (
                                <BriefcaseBusiness
                                    size={19}
                                    aria-hidden="true"
                                />
                            ) : (
                                <ShieldCheck size={19} aria-hidden="true" />
                            )}
                        </span>
                        <div>
                            <p className="text-xs font-medium text-[#008c9e] dark:text-[#2dd4bf]">
                                {label}
                            </p>
                            <h3 className="mt-1 text-sm font-semibold text-[#1a2e2e] dark:text-white">
                                {heading}
                            </h3>
                        </div>
                    </div>
                    <h4 className="mt-5 text-lg leading-snug font-semibold text-[#1a2e2e] sm:text-xl dark:text-white">
                        {member.name}
                    </h4>
                    <p className="mt-2 text-xs font-medium text-[#008c9e] dark:text-[#2dd4bf]">
                        {member.role}
                    </p>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#1a2e2e]/65 dark:text-white/65">
                        {reverse
                            ? 'Menjalankan pengelolaan dan operasional perseroan untuk mendukung layanan energi yang andal dan berkelanjutan.'
                            : 'Mengawasi pengelolaan perseroan dan memberikan arahan untuk mendukung tata kelola perusahaan yang baik.'}
                    </p>
                </div>
            </AnimeReveal>
        ));

    const [activeTab, setActiveTab] = useState<'tim' | 'struktur'>('tim');
    const [imageError, setImageError] = useState(false);

    const mermaidChart = `
graph TD
    Direktur["DIREKTUR"]

    %% Level 1: Divisi Utama
    Direktur --> M_Keu["MANAGER KEUANGAN DAN<br/>PENGEMBANGAN BISNIS"]
    Direktur --> M_Ops["MANAGER OPERASI DAN<br/>PEMELIHARAAN PEMBANGKIT"]
    Direktur --> M_HC["MANAGER HUMAN CAPITAL<br/>DAN KEMITRAAN TENAGA<br/>KERJA"]
    Direktur --> Sek_Per["SEKRETARIS PERUSAHAAN"]
    Direktur --> SPI["KEPALA SATUAN<br/>PENGAWASAN INTERN"]
    Direktur --> Pengadaan["Assistant Manager Pengadaan /<br/>Administrasi Kontrak / K3L (Bagian Pengadaan & K3L)"]

    %% Manager Keuangan dan Pengembangan Bisnis
    M_Keu --> AM_Kinerja["Assistant Manager Kinerja dan<br/>Manajemen Risiko"]
    AM_Kinerja --> Sub_Kinerja["Kinerja dan Perencanaan Korporat<br/>Manajemen Risiko dan Kepatuhan"]

    M_Keu --> AM_Keu["Assistant Manager Keuangan,<br/>Akuntansi dan Pajak"]
    AM_Keu --> Sub_Keu["Keuangan, Akuntansi dan Pajak"]

    M_Keu --> AM_Rev["Assistant Manager Revenue dan<br/>Billing"]
    AM_Rev --> Sub_Rev["Billing dan Settlement"]

    M_Keu --> AM_Bisnis["Assistant Manager Pengembangan<br/>Bisnis"]
    AM_Bisnis --> Sub_Bisnis["Pengembangan Bisnis"]

    %% Manager Operasi dan Pemeliharaan Pembangkit
    M_Ops --> AM_Pembangkit["Assistant Manager Pembangkit"]
    AM_Pembangkit --> Sub_Pembangkit["Manajemen Proyek Pembangkit<br/>Operasi dan Pemeliharaan<br/>Pembangkit"]

    M_Ops --> AM_EBT["Assistant Manager Energi Baru<br/>Terbarukan"]
    AM_EBT --> Sub_EBT["Manajemen Proyek Pembangkit EBT<br/>Operasi dan Pemeliharaan<br/>Pembangkit EBT"]

    M_Ops --> AM_Gas["Assistant Manager Infrastruktur<br/>Gas"]
    AM_Gas --> Sub_Gas["Perencanaan Gas<br/>Operasi dan Pemeliharaan Gas"]

    %% Manager Human Capital dan Kemitraan Tenaga Kerja
    M_HC --> AM_Kemitraan["Assistant Manager Kemitraan<br/>Tenaga Kerja"]
    AM_Kemitraan --> Sub_Kemitraan["Kemitraan Tenaga Kerja"]

    M_HC --> AM_HC["Assistant Manager Human Capital<br/>dan General Affair"]
    AM_HC --> Sub_HC["Human Capital<br/>General Affair dan Infrastruktur IT"]

    %% Sekretaris Perusahaan
    Sek_Per --> Sub_Humas["Hubungan Masyarakat dan<br/>TJSL"]
    Sek_Per --> Sub_Hukum["Hukum"]

    %% Kepala Satuan Pengawasan Intern
    SPI --> Sub_Audit["Operasi dan<br/>Manajemen Audit"]

    %% Bagian Kanan (Pengadaan & K3L)
    Direktur --> AM_Pengadaan["Assistant Manager Pengadaan"]
    AM_Pengadaan --> Sub_AdmKontrak["Administrasi Kontrak<br/>Pengadaan"]
    
    Direktur --> AM_K3L["Assistant Manager K3L"]
    AM_K3L --> Sub_K3L["K3L"]
    `;

    return (
        <section className="relative bg-white px-5 py-12 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-14 dark:bg-[#0a1a1a]">
            {/* Efek Shadow Pembatas Atas */}
            <div className="pointer-events-none absolute top-0 right-0 left-0 h-12 bg-linear-to-b from-black/5 to-transparent transition-colors dark:from-white/5"></div>

            <div className="relative z-10 mx-auto w-full max-w-[1200px]">
                {/* Header Section */}
                <AnimeReveal
                    delay={100}
                    distance={30}
                    direction="up"
                    className="mb-9 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"
                >
                    <div className="max-w-2xl">
                        <h2 className="mb-3 text-xl font-bold text-[#1a2e2e] transition-colors duration-500 sm:text-2xl dark:text-white">
                            {activeTab === 'tim' ? title : 'Struktur Jabatan'}
                        </h2>
                        <p className="text-xs leading-relaxed text-[#1a2e2e]/70 transition-colors duration-500 sm:text-sm md:text-base dark:text-white/70">
                            {activeTab === 'tim'
                                ? subtitle
                                : 'Bagan hierarki yang menunjukkan susunan organisasi dan garis koordinasi di dalam perusahaan.'}
                        </p>
                    </div>

                    {/* Toggle Buttons */}
                    <AnimeReveal
                        delay={110}
                        distance={20}
                        direction="up"
                        className="flex w-full justify-start md:w-auto md:justify-end"
                    >
                        <div className="flex max-w-full rounded-xl border border-[#0d2e2e]/10 bg-[#EDF5F6] p-1 dark:border-white/10 dark:bg-white/5">
                            <button
                                onClick={() => setActiveTab('tim')}
                                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 sm:px-4 ${
                                    activeTab === 'tim'
                                        ? 'bg-[#0d2e2e] text-white shadow-sm dark:bg-[#2dd4bf] dark:text-[#0d2e2e]'
                                        : 'text-[#1a2e2e]/70 hover:text-[#1a2e2e] dark:text-white/70 dark:hover:text-white'
                                }`}
                            >
                                Tim Kepemimpinan
                            </button>
                            <button
                                onClick={() => setActiveTab('struktur')}
                                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 sm:px-4 ${
                                    activeTab === 'struktur'
                                        ? 'bg-[#00A4B9] text-white shadow-md'
                                        : 'text-[#1a2e2e]/70 hover:text-[#1a2e2e] dark:text-white/70 dark:hover:text-white'
                                }`}
                            >
                                Struktur Jabatan
                            </button>
                        </div>
                    </AnimeReveal>
                </AnimeReveal>

                {/* Tab: Tim Kepemimpinan */}
                {activeTab === 'tim' && (
                    <div className="mx-auto max-w-[1000px] space-y-10 pt-4 sm:space-y-12">
                        {renderLeadershipGroup(
                            commissioners,
                            'Dewan Komisaris',
                            'Pengawas Perseroan',
                        )}
                        {renderLeadershipGroup(
                            directors,
                            'Dewan Direksi',
                            'Pelaksana Perseroan',
                            true,
                        )}
                    </div>
                )}

                {/* Tab: Struktur Jabatan */}
                {activeTab === 'struktur' && (
                    <AnimeReveal
                        delay={120}
                        distance={30}
                        direction="up"
                        className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8 dark:border-white/10 dark:bg-[#1a3a3a]"
                    >
                        <div className="mb-8 flex flex-col items-center">
                            <span className="mb-1.5 text-xs font-bold tracking-widest text-[#00A4B9] uppercase md:text-xs dark:text-[#2dd4bf]">
                                Hierarki Perusahaan
                            </span>
                            <h3 className="relative text-lg font-bold text-[#1a2e2e] after:absolute after:bottom-[-6px] after:left-1/2 after:h-[2.5px] after:w-10 after:-translate-x-1/2 after:rounded-full after:bg-[#00A4B9] after:content-[''] sm:text-xl md:text-2xl dark:text-white dark:after:bg-[#2dd4bf]">
                                Bagan Struktur Organisasi
                            </h3>
                        </div>

                        {!imageError ? (
                            <div className="flex w-full justify-center overflow-x-auto rounded-2xl bg-white p-2 dark:bg-white/95">
                                <img
                                    src="/images/struktur-jabatan-peb.png"
                                    alt="Struktur Jabatan PEB"
                                    className="mx-auto max-h-[75vh] w-auto max-w-full object-contain transition-transform duration-300"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        ) : (
                            <Mermaid chart={mermaidChart} />
                        )}
                    </AnimeReveal>
                )}
            </div>
        </section>
    );
}
