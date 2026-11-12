import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    FileText,
    Download,
    Share2,
    Copy,
    MessageCircle,
    Info,
    TrendingUp,
    FileBarChart2,
    BookOpen,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AnimeReveal from '@/components/global/anime-reveal';
import { cn } from '@/lib/utils';

interface ReportDetailContentProps {
    item?: any | null;
    type?: string | null;
    laporanKeuanganSection?: any | null;
    laporanTahunanSection?: any | null;
}

const flipbookStyles = `
    .book-container {
        position: relative;
        width: 100%;
        perspective: 2000px;
    }
    .book {
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.5s;
    }
    .book img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-select: none;
        pointer-events: none;
    }
    .sheet {
        position: absolute;
        width: 50%;
        height: 100%;
        top: 0;
        left: 50%;
        transform-origin: left center;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .sheet.flipped {
        transform: rotateY(-180deg);
    }
    .page-face {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        backface-visibility: hidden;
        background-color: white;
        box-shadow: inset 3px 0 20px rgba(0,0,0,0.1), 0 1px 10px rgba(0,0,0,0.05);
    }
    .page-face.front {
        z-index: 2;
    }
    .page-face.back {
        transform: rotateY(180deg);
        z-index: 1;
    }
`;

function FlipBook({
    pdfUrl,
    coverUrl,
    title,
    subtitle,
    type = 'annual',
}: {
    pdfUrl: string;
    coverUrl: string;
    title: string;
    subtitle: string;
    type?: string;
}) {
    const [pdfPages, setPdfPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(
        !!pdfUrl && pdfUrl !== '#' && pdfUrl !== '',
    );
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const [zoom, setZoom] = useState(1);
    const fileRefs = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);

    const currentPage = Math.floor((activePageIndex + 1) / 2);
    const currentMobilePage = activePageIndex;

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.4));
    const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));
    const resetZoom = () => setZoom(1);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom <= 1) {
            return;
        }

        setIsDragging(true);
        setStartX(e.pageX - (fileRefs.current?.offsetLeft || 0));
        setStartY(e.pageY - (fileRefs.current?.offsetTop || 0));
        setScrollLeft(fileRefs.current?.scrollLeft || 0);
        setScrollTop(fileRefs.current?.scrollTop || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || zoom <= 1) {
            return;
        }

        e.preventDefault();
        const x = e.pageX - (fileRefs.current?.offsetLeft || 0);
        const y = e.pageY - (fileRefs.current?.offsetTop || 0);
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;

        if (fileRefs.current) {
            fileRefs.current.scrollLeft = scrollLeft - walkX;
            fileRefs.current.scrollTop = scrollTop - walkY;
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (zoom <= 1) {
            return;
        }

        setIsDragging(true);
        const touch = e.touches[0];
        setStartX(touch.pageX - (fileRefs.current?.offsetLeft || 0));
        setStartY(touch.pageY - (fileRefs.current?.offsetTop || 0));
        setScrollLeft(fileRefs.current?.scrollLeft || 0);
        setScrollTop(fileRefs.current?.scrollTop || 0);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || zoom <= 1) {
            return;
        }

        const touch = e.touches[0];
        const x = touch.pageX - (fileRefs.current?.offsetLeft || 0);
        const y = touch.pageY - (fileRefs.current?.offsetTop || 0);
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;

        if (fileRefs.current) {
            fileRefs.current.scrollLeft = scrollLeft - walkX;
            fileRefs.current.scrollTop = scrollTop - walkY;
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (fileRefs.current) {
                const containerWidth =
                    fileRefs.current.parentElement?.clientWidth || 800;
                const mobile = window.innerWidth < 768;
                setIsMobile(mobile);

                const targetWidth = mobile ? 400 : 840;
                const s = Math.min(1, containerWidth / targetWidth);
                setScale(s);
            }
        };
        window.addEventListener('resize', handleResize);
        setTimeout(handleResize, 100);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!pdfUrl || pdfUrl === '#' || pdfUrl === '') {
            return;
        }

        const renderPdf = async (pdfjsLib: any) => {
            try {
                setLoading(true);
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const pageCount = Math.min(pdf.numPages, 12);
                const urls: string[] = [];

                for (let i = 1; i <= pageCount; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        await page.render({ canvasContext: context, viewport })
                            .promise;
                        urls.push(canvas.toDataURL());
                    }
                }

                setPdfPages(urls);
                setLoading(false);
            } catch (err) {
                console.error('Error rendering PDF:', err);
                setLoading(false);
            }
        };

        const win = window as any;

        if (win.pdfjsLib) {
            renderPdf(win.pdfjsLib);

            return;
        }

        const script = document.createElement('script');
        script.src =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            const pdfjsLib = win.pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            renderPdf(pdfjsLib);
        };
        script.onerror = () => {
            setLoading(false);
        };
        document.body.appendChild(script);
    }, [pdfUrl]);

    const hasPdf = pdfPages.length > 0;
    const pages: React.ReactNode[] = [];

    if (hasPdf) {
        const list = [...pdfPages];

        if (list.length % 2 !== 0) {
            list.push('');
        }

        // Menggunakan halaman pertama dari PDF (list[0]) sebagai sampul depan (cover)
        pages.push(
            <div
                key="cover"
                className="relative flex h-full w-full items-center justify-center bg-[#0d2e2e]"
            >
                <img
                    src={list[0] || coverUrl}
                    alt="Cover"
                    className="h-full w-full object-cover select-none"
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
            </div>,
        );

        // Merender halaman-halaman berikutnya dari PDF mulai dari indeks ke-1
        for (let i = 1; i < list.length; i++) {
            pages.push(
                list[i] ? (
                    <img
                        key={i}
                        src={list[i]}
                        alt={`Page ${i + 1}`}
                        className="h-full w-full bg-white object-contain select-none"
                        draggable="false"
                        onDragStart={(e) => e.preventDefault()}
                    />
                ) : (
                    <div
                        key={i}
                        className="flex h-full w-full items-center justify-center bg-gray-50 text-xs text-gray-400"
                    >
                        Halaman Sengaja Dikosongkan
                    </div>
                ),
            );
        }
    } else {
        pages.push(
            <div
                key="fallback-0"
                className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0d2e2e] p-8 text-white select-none"
            >
                <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-[#00A4B9]/10 blur-3xl" />
                <div>
                    <span className="text-[10px] font-black tracking-widest text-[#00A4B9] uppercase">
                        PT Pelayanan Energi Batam
                    </span>
                    <h1 className="mt-8 border-l-4 border-[#00A4B9] pl-3 text-2xl leading-tight font-black tracking-tight text-white">
                        {title}
                    </h1>
                </div>
                <div className="flex flex-col items-start gap-4">
                    <img
                        src={coverUrl}
                        alt="Cover Preview"
                        className="h-44 w-32 rounded-lg border border-white/20 bg-teal-950 object-cover shadow-2xl"
                    />
                    <span className="text-[10px] font-bold tracking-wider text-white/50">
                        {type === 'keberlanjutan'
                            ? 'SUSTAINABILITY REPORT'
                            : 'ANNUAL REPORT'}{' '}
                        &bull; EDISI DIGITAL
                    </span>
                </div>
            </div>,
        );

        pages.push(
            <div
                key="fallback-1"
                className="flex h-full w-full flex-col justify-between border-r border-gray-100 bg-[#fafdfd] p-8 text-[#0d2e2e] select-none"
            >
                <div>
                    <h3 className="text-sm font-black tracking-widest text-[#00A4B9] uppercase">
                        {type === 'keberlanjutan'
                            ? 'Komitmen Keberlanjutan'
                            : 'Sambutan Direksi'}
                    </h3>
                    <p className="mt-6 text-xs leading-relaxed text-gray-600">
                        {type === 'keberlanjutan'
                            ? '"PT Pelayanan Energi Batam berkomitmen penuh terhadap aspek keberlanjutan. Kami mengintegrasikan praktik ESG (Environmental, Social, and Governance) dalam setiap aspek bisnis kami untuk masa depan Batam yang lebih bersih dan hijau."'
                            : '"Selamat datang di laporan digital PT Pelayanan Energi Batam. Edisi ini mendokumentasikan pencapaian strategis perusahaan, keandalan jaringan pipa gas, ekspansi infrastruktur energi bersih, serta kepatuhan tata kelola GCG yang baik."'}
                    </p>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[#00A4B9]/20 text-xs font-bold text-[#00A4B9]">
                        PEB
                    </div>
                    <div>
                        <p className="text-[10px] font-bold">Direksi Utama</p>
                        <p className="text-[9px] text-gray-400">
                            PT Pelayanan Energi Batam
                        </p>
                    </div>
                </div>
            </div>,
        );

        pages.push(
            <div
                key="fallback-2"
                className="flex h-full w-full flex-col justify-between bg-white p-8 text-[#0d2e2e] select-none"
            >
                <div>
                    <h3 className="text-sm font-black tracking-widest text-[#00A4B9] uppercase">
                        Ikhtisar Laporan
                    </h3>
                    <p className="mt-4 text-xs leading-relaxed text-gray-600">
                        {subtitle}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f4fafb] p-3">
                    <div>
                        <span className="block text-[9px] text-gray-400">
                            Status Audit
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">
                            Wajar Tanpa Pengecualian
                        </span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">
                            Efisiensi Energi
                        </span>
                        <span className="text-[11px] font-bold text-[#00A4B9]">
                            +14.2% YoY
                        </span>
                    </div>
                </div>
            </div>,
        );

        pages.push(
            <div
                key="fallback-3"
                className="flex h-full w-full flex-col justify-between border-r border-gray-100 bg-[#fafdfd] p-8 text-[#0d2e2e] select-none"
            >
                <div>
                    <h3 className="text-sm font-black tracking-widest text-[#00A4B9] uppercase">
                        {type === 'keberlanjutan'
                            ? 'Pilar Keberlanjutan'
                            : 'Pencapaian Utama'}
                    </h3>
                    <ul className="mt-4 space-y-2.5 text-[11px] text-gray-600">
                        {type === 'keberlanjutan' ? (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00A4B9]" />
                                    <span>
                                        Pilar Lingkungan: Mengurangi emisi
                                        karbon melalui transisi ke energi gas
                                        bersih.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00A4B9]" />
                                    <span>
                                        Pilar Sosial: Pemberdayaan masyarakat
                                        pesisir di Batam melalui program CSR
                                        berkelanjutan.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00A4B9]" />
                                    <span>
                                        Pilar Tata Kelola: Penerapan
                                        zero-tolerance policy terhadap tindakan
                                        korupsi dan suap.
                                    </span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00A4B9]" />
                                    <span>
                                        Pembangunan pipa gas interkoneksi Batam
                                        untuk optimalisasi industri.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00A4B9]" />
                                    <span>
                                        Implementasi PLTS Atap berkapasitas
                                        tinggi di kawasan komersial.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#00A4B9]" />
                                    <span>
                                        Peningkatan keandalan gas supply Batam
                                        hingga 99.98% uptime.
                                    </span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <div className="text-right text-[9px] text-gray-400">
                    Halaman 3 dari 6
                </div>
            </div>,
        );

        pages.push(
            <div
                key="fallback-4"
                className="flex h-full w-full flex-col justify-between bg-white p-8 text-[#0d2e2e] select-none"
            >
                <div>
                    <h3 className="text-sm font-black tracking-widest text-[#00A4B9] uppercase">
                        Kinerja Keuangan
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-gray-600">
                        Kinerja finansial korporat mencatat pertumbuhan positif
                        yang didorong oleh kenaikan volume transmisi gas dan
                        efisiensi biaya operasional secara berkala.
                    </p>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between border-b border-gray-50 pb-1 text-[10px]">
                            <span className="text-gray-500">
                                Pendapatan Bersih
                            </span>
                            <span className="font-bold">Meningkat 8.4%</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1 text-[10px]">
                            <span className="text-gray-500">Aset Korporat</span>
                            <span className="font-bold">Tumbuh 12.1%</span>
                        </div>
                    </div>
                </div>
                <div className="text-right text-[9px] text-gray-400">
                    Halaman 4 dari 6
                </div>
            </div>,
        );

        pages.push(
            <div
                key="fallback-5"
                className="flex h-full w-full flex-col justify-between bg-[#fafdfd] p-8 text-[#0d2e2e] select-none"
            >
                <div>
                    <h3 className="text-sm font-black tracking-widest text-[#00A4B9] uppercase">
                        TATA KELOLA (GCG)
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-gray-600">
                        Kami menjunjung tinggi prinsip Transparansi,
                        Akuntabilitas, Responsibilitas, Independensi, dan
                        Fairness (TARIF) dalam menjalankan seluruh tata kelola
                        perusahaan di Kepulauan Riau.
                    </p>
                </div>
                <div className="text-right text-[9px] text-gray-400">
                    Halaman 5 dari 6
                </div>
            </div>,
        );

        pages.push(
            <div
                key="fallback-6"
                className="flex h-full w-full flex-col justify-between bg-white p-8 text-[#0d2e2e] select-none"
            >
                <div>
                    <h3 className="text-sm font-black tracking-widest text-[#00A4B9] uppercase">
                        CSR & Transisi Hijau
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-gray-600">
                        Program CSR PEB difokuskan pada pengembangan masyarakat
                        pesisir Batam melalui penyediaan fasilitas listrik ramah
                        lingkungan, beasiswa pendidikan, dan perlindungan
                        ekosistem hutan bakau.
                    </p>
                </div>
                <div className="text-right text-[9px] text-gray-400">
                    Halaman 6 dari 6
                </div>
            </div>,
        );

        pages.push(
            <div
                key="fallback-7"
                className="relative flex h-full w-full flex-col justify-between overflow-hidden border-l border-white/10 bg-[#0d2e2e] p-8 text-white select-none"
            >
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#00A4B9]/10 blur-3xl" />
                <div className="my-auto space-y-4 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#00A4B9] text-sm font-black shadow-lg shadow-[#00A4B9]/20">
                        PEB
                    </div>
                    <div>
                        <h4 className="text-sm font-bold tracking-widest">
                            TERIMA KASIH
                        </h4>
                        <p className="mt-1 text-[9px] text-white/40">
                            PT Pelayanan Energi Batam
                        </p>
                    </div>
                </div>
                <div className="text-center text-[8px] leading-relaxed text-white/30">
                    Batam Center, Ruko Greenland Blok A1 No. 3-4, Batam,
                    Indonesia &bull; www.peb.co.id
                </div>
            </div>,
        );
    }

    const totalSheets = Math.ceil(pages.length / 2);

    const nextMobile = () => {
        if (activePageIndex < pages.length - 1) {
            setActivePageIndex(activePageIndex + 1);
        }
    };

    const prevMobile = () => {
        if (activePageIndex > 0) {
            setActivePageIndex(activePageIndex - 1);
        }
    };

    const next = () => {
        const nextDesktopPage = currentPage + 1;

        if (nextDesktopPage <= totalSheets) {
            setActivePageIndex(
                nextDesktopPage === 0 ? 0 : nextDesktopPage * 2 - 1,
            );
        }
    };

    const prev = () => {
        const prevDesktopPage = currentPage - 1;

        if (prevDesktopPage >= 0) {
            setActivePageIndex(
                prevDesktopPage === 0 ? 0 : prevDesktopPage * 2 - 1,
            );
        }
    };

    let translateX = 0;

    if (currentPage === 0) {
        translateX = -25;
    } else if (currentPage === totalSheets) {
        translateX = 25;
    }

    return (
        <div
            ref={fileRefs}
            className={cn(
                'scrollbar-thin flex w-full flex-col items-center overflow-auto py-6 transition-all duration-300 select-none',
                zoom > 1 ? 'justify-start' : 'justify-center',
                zoom > 1
                    ? isDragging
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                    : '',
            )}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
        >
            <style dangerouslySetInnerHTML={{ __html: flipbookStyles }} />
            {loading ? (
                <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 text-[#0d2e2e] dark:text-white">
                    <div className="size-8 animate-spin rounded-full border-4 border-[#00A4B9]/30 border-t-[#00A4B9]" />
                    <p className="animate-pulse text-xs font-bold tracking-widest uppercase">
                        Memuat 3D Flipbook...
                    </p>
                </div>
            ) : (
                <div className="flex w-full flex-col items-center">
                    {isMobile ? (
                        /* Mobile Single Page Viewport Wrapper */
                        <div
                            className="flex flex-shrink-0 items-center justify-center"
                            style={{
                                height: `${520 * scale * zoom}px`,
                                width: `${400 * scale * zoom}px`,
                            }}
                        >
                            <div
                                className="border-gray-150 overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-[#122b2b]"
                                style={{
                                    transform: `scale(${scale * zoom})`,
                                    width: '400px',
                                    height: '500px',
                                    transformOrigin: 'center center',
                                    transition: 'transform 0.3s ease-out',
                                }}
                            >
                                {pages[currentMobilePage]}
                            </div>
                        </div>
                    ) : (
                        /* 3D Book Viewport Wrapper */
                        <div
                            className="book-container flex flex-shrink-0 items-center justify-center"
                            style={{
                                height: `${530 * scale * zoom}px`,
                                width: `${800 * scale * zoom}px`,
                            }}
                        >
                            <div
                                className="book"
                                style={{
                                    transform: `scale(${scale * zoom}) translateX(${translateX}%)`,
                                    width: '800px',
                                    height: '500px',
                                    transformOrigin: 'center center',
                                    transition:
                                        'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                                }}
                            >
                                {Array.from({ length: totalSheets }).map(
                                    (_, idx) => {
                                        const isFlipped = idx < currentPage;
                                        const zIndex = isFlipped
                                            ? idx + 2
                                            : totalSheets - idx + 2;

                                        return (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    'sheet',
                                                    isFlipped && 'flipped',
                                                )}
                                                style={{
                                                    zIndex: zIndex,
                                                }}
                                            >
                                                {/* Front Face */}
                                                <div className="page-face front border-gray-150 overflow-hidden rounded-r-2xl border-l bg-white shadow-xl dark:bg-[#122b2b]">
                                                    {pages[idx * 2]}
                                                    <div className="pointer-events-none absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-black/10 to-transparent" />
                                                </div>

                                                {/* Back Face */}
                                                <div className="page-face back border-gray-150 overflow-hidden rounded-l-2xl border-r bg-white shadow-xl dark:bg-[#122b2b]">
                                                    {pages[idx * 2 + 1]}
                                                    <div className="pointer-events-none absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-black/10 to-transparent" />
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}

                    {/* Book controls */}
                    <div className="border-gray-150 mt-8 flex flex-wrap items-center justify-center gap-4 rounded-2xl border bg-white px-4 py-2.5 shadow-md sm:rounded-full sm:px-6 sm:py-3 md:gap-6 dark:border-white/5 dark:bg-[#122b2b]">
                        {/* Navigasi Halaman */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={isMobile ? prevMobile : prev}
                                disabled={
                                    isMobile
                                        ? currentMobilePage === 0
                                        : currentPage === 0
                                }
                                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-[#00A4B9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60 dark:hover:bg-[#00A4B9]"
                                title="Halaman Sebelumnya"
                            >
                                &larr;
                            </button>
                            <span className="min-w-[100px] text-center text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50">
                                {isMobile
                                    ? currentMobilePage === 0
                                        ? 'Sampul Depan'
                                        : currentMobilePage === pages.length - 1
                                          ? 'Sampul Belakang'
                                          : `Halaman ${currentMobilePage}`
                                    : currentPage === 0
                                      ? 'Sampul Depan'
                                      : currentPage === totalSheets
                                        ? 'Sampul Belakang'
                                        : `Halaman ${currentPage * 2} - ${currentPage * 2 + 1}`}
                            </span>
                            <button
                                type="button"
                                onClick={isMobile ? nextMobile : next}
                                disabled={
                                    isMobile
                                        ? currentMobilePage === pages.length - 1
                                        : currentPage === totalSheets
                                }
                                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-[#00A4B9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60 dark:hover:bg-[#00A4B9]"
                                title="Halaman Berikutnya"
                            >
                                &rarr;
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="hidden h-6 w-[1px] bg-gray-200 sm:block dark:bg-white/10" />

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={zoomOut}
                                disabled={zoom <= 0.6}
                                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-[#00A4B9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60 dark:hover:bg-[#00A4B9]"
                                title="Perkecil"
                            >
                                <ZoomOut size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={resetZoom}
                                className="min-w-[40px] text-center text-[10px] font-bold text-[#00A4B9] transition-colors hover:text-[#008c9e] dark:text-[#2dd4bf] dark:hover:text-[#00A4B9]"
                                title="Reset Zoom"
                            >
                                {Math.round(zoom * 100)}%
                            </button>
                            <button
                                type="button"
                                onClick={zoomIn}
                                disabled={zoom >= 2.4}
                                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-[#00A4B9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60 dark:hover:bg-[#00A4B9]"
                                title="Perbesar"
                            >
                                <ZoomIn size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ReportDetailContent({
    item,
    type = 'keuangan',
    laporanKeuanganSection,
    laporanTahunanSection,
}: ReportDetailContentProps) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const reportTitle = item?.title || 'Detail Laporan & Publikasi';
        const text = `Lihat Dokumen Laporan Resmi PT Pelayanan Energi Batam: ${reportTitle}`;
        let shareUrl = '';

        switch (platform) {
            case 'Facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'Twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'WhatsApp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        setShowShareMenu(false);
    };

    const fallbackCopy = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            alert('Tautan halaman laporan berhasil disalin!');
        } catch (err) {
            console.error('Gagal menyalin tautan:', err);
            alert(
                'Gagal menyalin tautan otomatis. Silakan salin tautan dari address bar browser Anda.',
            );
        }

        document.body.removeChild(textArea);
    };

    const handleCopyLink = () => {
        const url = window.location.href;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(url)
                .then(() => alert('Tautan halaman laporan berhasil disalin!'))
                .catch(() => fallbackCopy(url));
        } else {
            fallbackCopy(url);
        }
    };

    // Close share menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                shareMenuRef.current &&
                !shareMenuRef.current.contains(event.target as Node)
            ) {
                setShowShareMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const otherReports = (() => {
        if (type === 'annual' && laporanTahunanSection?.annual_reports) {
            return laporanTahunanSection.annual_reports
                .filter((i: any) => i.id !== item?.id)
                .slice(0, 3);
        }

        if (
            type === 'keberlanjutan' &&
            laporanTahunanSection?.keberlanjutan_items
        ) {
            return laporanTahunanSection.keberlanjutan_items
                .filter((i: any) => i.id !== item?.id)
                .slice(0, 3);
        }

        if (laporanKeuanganSection?.items) {
            return laporanKeuanganSection.items
                .filter((i: any) => i.id !== item?.id)
                .slice(0, 3);
        }

        return [];
    })();

    const archives = (() => {
        const list: any[] = [];

        // Kumpulkan Laporan Tahunan jika tipenya bukan annual
        if (type !== 'annual' && laporanTahunanSection?.annual_reports) {
            laporanTahunanSection.annual_reports.forEach((r: any) => {
                list.push({
                    id: r.id,
                    title: r.title,
                    date: r.date || '10 April 2024',
                    type: 'annual',
                    icon: <BookOpen className="size-6 text-[#ca8a04]" />,
                });
            });
        }

        // Kumpulkan Laporan Keuangan jika tipenya bukan keuangan
        if (type !== 'keuangan' && laporanKeuanganSection?.items) {
            laporanKeuanganSection.items.forEach((r: any) => {
                list.push({
                    id: r.id,
                    title: r.title,
                    date: r.date || '22 Maret 2024',
                    type: 'keuangan',
                    icon: <FileBarChart2 className="size-6 text-[#00A4B9]" />,
                });
            });
        }

        // Kumpulkan Laporan Keberlanjutan jika tipenya bukan keberlanjutan
        if (
            type !== 'keberlanjutan' &&
            laporanTahunanSection?.keberlanjutan_items
        ) {
            laporanTahunanSection.keberlanjutan_items.forEach((r: any) => {
                list.push({
                    id: r.id,
                    title: r.title,
                    date: r.date || '15 Maret 2024',
                    type: 'keberlanjutan',
                    icon: <BookOpen className="size-6 text-emerald-600" />,
                });
            });
        }

        return list;
    })();

    return (
        <main className="bg-[#f7fafb] px-5 py-8 transition-colors duration-500 sm:px-8 lg:px-12 lg:py-10 dark:bg-[#0a1a1a]">
            <div className="mx-auto w-full max-w-[1200px]">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-7">
                    {/* Left Content Column (8 cols) */}
                    <div className="min-w-0 space-y-5">
                        {/* 3D Flipbook Preview Card */}
                        {(type === 'annual' || type === 'keberlanjutan') && (
                            <AnimeReveal delay={100} distance={20}>
                                <div className="overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white p-4 shadow-xs transition-all duration-500 sm:p-8 lg:p-6 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                    <div className="border-gray-150 mb-6 flex items-center justify-between border-b pb-4 dark:border-white/5">
                                        <div>
                                            <h2 className="text-base font-semibold text-[#0d2e2e] dark:text-white">
                                                Buku Laporan Interaktif (3D)
                                            </h2>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Klik sudut kanan atau tombol
                                                panah di bawah untuk membalik
                                                halaman.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mx-auto w-full max-w-[640px]">
                                        <FlipBook
                                            pdfUrl={item?.fileUrl || ''}
                                            coverUrl={
                                                item?.imageSrc ||
                                                item?.image ||
                                                '/assets/tentang-kami/hero/hero.png'
                                            }
                                            title={item?.title || ''}
                                            subtitle={item?.subtitle || ''}
                                            type={type}
                                        />
                                    </div>
                                </div>
                            </AnimeReveal>
                        )}

                        {/* Combined Information Card (Deskripsi, Ikhtisar, & Download) */}
                        <AnimeReveal delay={150} distance={20}>
                            <div className="overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white shadow-xs transition-all duration-500 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                {/* Content Wrapper with Padding */}
                                <div className="space-y-6 p-5 sm:p-6">
                                    {/* Deskripsi Section */}
                                    {type !== 'annual' &&
                                        type !== 'keberlanjutan' && (
                                            <div className="space-y-5">
                                                <h2 className="text-base font-semibold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                                    Deskripsi Laporan
                                                </h2>
                                                <div className="space-y-4 text-sm leading-7 text-gray-600 transition-colors duration-500 dark:text-white/60">
                                                    <p>
                                                        {item?.subtitle ||
                                                            'Laporan ini menyajikan posisi keuangan yang komprehensif dari seluruh lini bisnis PEB, termasuk infrastruktur gas bumi, pembangkit listrik, serta pengembangan energi baru terbarukan di wilayah Batam. Laporan keuangan ini telah diaudit secara independen dan disusun sesuai dengan Standar Akuntansi Keuangan yang berlaku di Indonesia.'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    {/* Ikhtisar Section */}
                                    {type !== 'annual' &&
                                        type !== 'keberlanjutan' &&
                                        (item?.poinUtamaList &&
                                        item.poinUtamaList.length > 0 ? (
                                            <div className="space-y-5">
                                                <h2 className="text-base font-semibold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                                    Poin Utama & Bab Laporan
                                                </h2>
                                                <div className="grid grid-cols-1 gap-6">
                                                    {item.poinUtamaList.map(
                                                        (
                                                            poin: any,
                                                            i: number,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    poin.id || i
                                                                }
                                                                className="group flex items-start gap-5"
                                                            >
                                                                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eaf8f9] transition-colors duration-500 dark:bg-[#00A4B9]/10">
                                                                    <CheckCircle2
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                                    />
                                                                </div>
                                                                <p className="text-sm leading-7 text-gray-600 transition-colors duration-500 dark:text-white/70">
                                                                    {poin.text}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-5">
                                                <h2 className="text-base font-semibold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                                    Poin Utama & Bab Laporan
                                                </h2>
                                                <div className="grid grid-cols-1 gap-6">
                                                    {[
                                                        'Neraca Keuangan Audited menggambarkan pertumbuhan aset bersih perusahaan sebesar 12.4% YoY.',
                                                        'Laporan Laba Rugi menunjukkan peningkatan efisiensi biaya transmisi gas dan penguatan laba operasional.',
                                                        'Kajian Arus Kas terperinci mengenai alokasi investasi proyek energi surya strategis di Sekupang.',
                                                        'Opini Auditor Independen dengan hasil Wajar Tanpa Pengecualian (WTP) atas laporan konsolidasi.',
                                                    ].map((text, i) => (
                                                        <div
                                                            key={i}
                                                            className="group flex items-start gap-5"
                                                        >
                                                            <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#eaf8f9] transition-colors duration-500 dark:bg-[#00A4B9]/10">
                                                                <CheckCircle2
                                                                    size={18}
                                                                    className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                                />
                                                            </div>
                                                            <p className="text-sm leading-7 text-gray-600 transition-colors duration-500 dark:text-white/70">
                                                                {text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                    {/* Nested Download Document Box */}
                                    {type === 'annual' ||
                                    type === 'keberlanjutan' ? (
                                        <div className="mt-6 space-y-4">
                                            <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-[#f4f7f7] p-4 transition-all duration-500 sm:flex-row lg:p-6 dark:border-white/5 dark:bg-black/20">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors duration-500 dark:bg-[#122b2b]">
                                                        <FileText
                                                            size={32}
                                                            className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                                            {item?.title}
                                                        </h4>
                                                        <p className="mt-1 text-sm font-medium text-gray-400 transition-colors duration-500 dark:text-white/40">
                                                            Ukuran File:{' '}
                                                            {item?.fileSize ||
                                                                'TBA'}{' '}
                                                            • Format: PDF
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            item?.fileUrl &&
                                                            item.fileUrl !== '#'
                                                        ) {
                                                            window.open(
                                                                item.fileUrl,
                                                                '_blank',
                                                            );
                                                        } else {
                                                            alert(
                                                                'Berkas laporan tidak tersedia.',
                                                            );
                                                        }
                                                    }}
                                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00A4B9] px-4 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-[#00A4B9]/20 transition-all hover:bg-[#008c9e] active:scale-95 md:w-auto dark:bg-[#00A4B9] dark:hover:bg-[#008c9e]"
                                                >
                                                    <Download size={20} />
                                                    Unduh dokumen
                                                </button>
                                            </div>
                                        </div>
                                    ) : item?.dokumenList &&
                                      item.dokumenList.length > 0 ? (
                                        <div className="mt-6 space-y-4">
                                            {item.dokumenList.map(
                                                (doc: any, idx: number) => {
                                                    const format = doc.fileUrl
                                                        ? doc.fileUrl
                                                              .split('.')
                                                              .pop()
                                                              ?.toUpperCase()
                                                        : 'PDF';

                                                    return (
                                                        <div
                                                            key={doc.id || idx}
                                                            className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-[#f4f7f7] p-4 transition-all duration-500 sm:flex-row lg:p-6 dark:border-white/5 dark:bg-black/20"
                                                        >
                                                            <div className="flex items-center gap-6">
                                                                <div className="flex size-10 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors duration-500 dark:bg-[#122b2b]">
                                                                    <FileText
                                                                        size={
                                                                            32
                                                                        }
                                                                        className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                                                        {
                                                                            doc.name
                                                                        }
                                                                    </h4>
                                                                    <p className="mt-1 text-sm font-medium text-gray-400 transition-colors duration-500 dark:text-white/40">
                                                                        Ukuran
                                                                        File:{' '}
                                                                        {doc.fileSize ||
                                                                            'TBA'}{' '}
                                                                        •
                                                                        Format:{' '}
                                                                        {format ||
                                                                            'PDF'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    if (
                                                                        doc.fileUrl &&
                                                                        doc.fileUrl !==
                                                                            '#'
                                                                    ) {
                                                                        window.open(
                                                                            doc.fileUrl,
                                                                            '_blank',
                                                                        );
                                                                    } else {
                                                                        alert(
                                                                            'Berkas laporan tidak tersedia.',
                                                                        );
                                                                    }
                                                                }}
                                                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00A4B9] px-4 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-[#00A4B9]/20 transition-all hover:bg-[#008c9e] active:scale-95 md:w-auto dark:bg-[#00A4B9] dark:hover:bg-[#008c9e]"
                                                            >
                                                                <Download
                                                                    size={20}
                                                                />
                                                                Unduh dokumen
                                                            </button>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-[#f4f7f7] p-4 transition-all duration-500 sm:flex-row lg:p-6 dark:border-white/5 dark:bg-black/20">
                                            <div className="flex items-center gap-6">
                                                <div className="flex size-10 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors duration-500 dark:bg-[#122b2b]">
                                                    <FileText
                                                        size={32}
                                                        className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[#0d2e2e] transition-colors duration-500 dark:text-white">
                                                        Dokumen Laporan Keuangan
                                                        Audited 2024
                                                    </h4>
                                                    <p className="mt-1 text-sm font-medium text-gray-400 transition-colors duration-500 dark:text-white/40">
                                                        Ukuran File: 14.2 MB •
                                                        Format: PDF
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    alert(
                                                        'Mengunduh berkas Laporan Keuangan Audited 2024...',
                                                    )
                                                }
                                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00A4B9] px-4 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-[#00A4B9]/20 transition-all hover:bg-[#008c9e] active:scale-95 md:w-auto dark:bg-[#00A4B9] dark:hover:bg-[#008c9e]"
                                            >
                                                <Download size={20} />
                                                Unduh dokumen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AnimeReveal>

                        {/* Lokasi / Informasi Tambahan Card */}
                        <AnimeReveal delay={300} distance={20}>
                            <div className="rounded-2xl border border-[#0d2e2e]/10 bg-white p-8 shadow-xs transition-all duration-500 lg:p-6 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#eaf8f9] transition-colors duration-500 dark:bg-[#00A4B9]/10">
                                            <Info
                                                size={24}
                                                className="text-[#00A4B9] dark:text-[#2dd4bf]"
                                            />
                                        </div>
                                        <h2 className="text-base font-semibold text-[#0d2e2e] transition-colors duration-500 lg:text-lg dark:text-white">
                                            Informasi Tambahan Publikasi
                                        </h2>
                                    </div>
                                    <div className="space-y-4 text-sm leading-relaxed text-gray-600 transition-colors duration-500 dark:text-white/60">
                                        <p>
                                            Seluruh dokumen laporan yang
                                            dipublikasikan oleh PT Pelayanan
                                            Energi Batam dilindungi oleh hak
                                            cipta perusahaan. Publikasi kembali
                                            sebagian atau seluruh dokumen ini
                                            wajib mencantumkan sumber resmi dan
                                            tidak untuk disalahgunakan.
                                        </p>
                                        <p className="font-semibold text-[#00A4B9] dark:text-[#2dd4bf]">
                                            Tanggal Rilis Pers:{' '}
                                            {item?.date || '15 Maret 2025'} |
                                            Dikeluarkan oleh: Divisi Hubungan
                                            Masyarakat & GCG PEB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AnimeReveal>

                        {/* Social Share & Copy */}
                        <AnimeReveal delay={500} distance={20}>
                            <div className="flex items-center justify-center gap-3 pt-6 transition-colors duration-500 md:justify-end">
                                <span className="mr-2 text-sm font-medium text-gray-400 transition-colors duration-500 dark:text-white/30">
                                    Bagikan Info Laporan:
                                </span>
                                <div className="relative" ref={shareMenuRef}>
                                    {/* Vertical Share Menu */}
                                    <div
                                        className={`absolute bottom-full left-1/2 mb-4 flex origin-bottom -translate-x-1/2 flex-col gap-3 transition-all duration-300 ${showShareMenu ? 'visible scale-100 opacity-100' : 'invisible scale-90 opacity-0'}`}
                                    >
                                        {[
                                            {
                                                icon: (
                                                    <span className="text-xs font-bold text-white">
                                                        FB
                                                    </span>
                                                ),
                                                label: 'Facebook',
                                                color: 'bg-[#1877F2]',
                                            },
                                            {
                                                icon: (
                                                    <span className="text-xs font-bold text-white">
                                                        X
                                                    </span>
                                                ),
                                                label: 'Twitter',
                                                color: 'bg-[#000000]',
                                            },
                                            {
                                                icon: (
                                                    <span className="text-xs font-bold text-white">
                                                        WA
                                                    </span>
                                                ),
                                                label: 'WhatsApp',
                                                color: 'bg-[#25D366]',
                                            },
                                        ].map((social, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    handleShare(social.label)
                                                }
                                                className={`${social.color} border-[#0d2e2e]/10/10 flex size-10 cursor-pointer items-center justify-center rounded-xl border shadow-xl transition-all hover:scale-110`}
                                                title={social.label}
                                            >
                                                {social.icon}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() =>
                                            setShowShareMenu(!showShareMenu)
                                        }
                                        className={`flex size-12 cursor-pointer items-center justify-center rounded-2xl border shadow-sm transition-all ${showShareMenu ? 'border-[#00A4B9] bg-[#00A4B9] text-white' : 'border-gray-150 bg-white text-gray-500 hover:bg-[#00A4B9] hover:text-white dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60'}`}
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    className="border-gray-150 flex size-12 cursor-pointer items-center justify-center rounded-2xl border bg-white text-gray-500 shadow-sm transition-all hover:bg-[#00A4B9] hover:text-white dark:border-white/10 dark:bg-[#1a3a3a] dark:text-white/60 dark:hover:bg-[#00A4B9]"
                                    title="Salin Tautan"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </AnimeReveal>
                    </div>

                    {/* Right Sidebar Column (4 cols) */}
                    <div className="min-w-0 space-y-5">
                        {/* Other Publications */}
                        <AnimeReveal delay={200} distance={20}>
                            <div className="rounded-2xl border border-[#0d2e2e]/10 bg-white p-8 shadow-xs transition-all duration-500 lg:p-6 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-5 transition-colors duration-500 dark:border-white/5">
                                        <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-white/30">
                                            Laporan Lainnya
                                        </h3>
                                    </div>
                                    <div className="space-y-5">
                                        {otherReports.length > 0
                                            ? otherReports.map(
                                                  (
                                                      otherItem: any,
                                                      i: number,
                                                  ) => (
                                                      <div
                                                          key={
                                                              otherItem.id || i
                                                          }
                                                          onClick={() =>
                                                              router.visit(
                                                                  `/laporan/detail?type=${type}&id=${otherItem.id}`,
                                                              )
                                                          }
                                                          className="group flex cursor-pointer gap-3"
                                                      >
                                                          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-colors duration-500 dark:border-white/5 dark:bg-black/20">
                                                              <FileText className="size-6 text-[#00A4B9] dark:text-[#2dd4bf]" />
                                                          </div>
                                                          <div className="space-y-2">
                                                              <h4 className="line-clamp-2 text-xs leading-5 font-semibold text-[#0d2e2e] transition-colors duration-500 group-hover:text-[#00A4B9] dark:text-white dark:group-hover:text-[#2dd4bf]">
                                                                  {
                                                                      otherItem.title
                                                                  }
                                                              </h4>
                                                              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase transition-colors duration-500 dark:text-white/40">
                                                                  {otherItem.date ||
                                                                      (type ===
                                                                      'annual'
                                                                          ? '10 April 2024'
                                                                          : type ===
                                                                              'keuangan'
                                                                            ? '22 Maret 2024'
                                                                            : '15 Maret 2024')}
                                                              </p>
                                                          </div>
                                                      </div>
                                                  ),
                                              )
                                            : [
                                                  {
                                                      title: 'Laporan Keberlanjutan Transisi Hijau',
                                                      date: '28 April 2025',
                                                      icon: (
                                                          <TrendingUp className="size-6 text-[#16a34a]" />
                                                      ),
                                                  },
                                                  {
                                                      title: 'Laporan Kinerja Pengoperasian Pipa Gas',
                                                      date: '20 Januari 2025',
                                                      icon: (
                                                          <FileText className="size-6 text-[#2563eb]" />
                                                      ),
                                                  },
                                              ].map((otherItem, i) => (
                                                  <div
                                                      key={i}
                                                      onClick={() =>
                                                          alert(
                                                              'Mengalihkan ke laporan terkait...',
                                                          )
                                                      }
                                                      className="group flex cursor-pointer gap-3"
                                                  >
                                                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-colors duration-500 dark:border-white/5 dark:bg-black/20">
                                                          {otherItem.icon}
                                                      </div>
                                                      <div className="space-y-2">
                                                          <h4 className="line-clamp-2 text-xs leading-5 font-semibold text-[#0d2e2e] transition-colors duration-500 group-hover:text-[#00A4B9] dark:text-white dark:group-hover:text-[#2dd4bf]">
                                                              {otherItem.title}
                                                          </h4>
                                                          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase transition-colors duration-500 dark:text-white/40">
                                                              {otherItem.date}
                                                          </p>
                                                      </div>
                                                  </div>
                                              ))}
                                    </div>
                                </div>
                            </div>
                        </AnimeReveal>

                        {/* Past Archives */}
                        <AnimeReveal delay={300} distance={20}>
                            <div className="rounded-2xl border border-[#0d2e2e]/10 bg-white p-8 shadow-xs transition-all duration-500 lg:p-6 dark:border-white/5 dark:bg-[#122b2b] dark:shadow-none">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-5 transition-colors duration-500 dark:border-white/5">
                                        <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-white/30">
                                            Arsip Laporan
                                        </h3>
                                    </div>
                                    <div className="space-y-5">
                                        {archives
                                            .slice(0, 3)
                                            .map(
                                                (
                                                    archiveItem: any,
                                                    i: number,
                                                ) => (
                                                    <div
                                                        key={
                                                            archiveItem.id || i
                                                        }
                                                        onClick={() =>
                                                            router.visit(
                                                                `/laporan/detail?type=${archiveItem.type}&id=${archiveItem.id}`,
                                                            )
                                                        }
                                                        className="group flex cursor-pointer gap-3"
                                                    >
                                                        <div className="border-gray-150 flex size-10 shrink-0 items-center justify-center rounded-2xl border bg-gray-50 shadow-sm transition-colors duration-500 dark:border-white/5 dark:bg-black/20">
                                                            {archiveItem.icon}
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <h4 className="line-clamp-2 text-xs leading-5 font-semibold text-[#0d2e2e] transition-colors duration-500 group-hover:text-[#00A4B9] dark:text-white dark:group-hover:text-[#2dd4bf]">
                                                                {
                                                                    archiveItem.title
                                                                }
                                                            </h4>
                                                            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase transition-colors duration-500 dark:text-white/40">
                                                                {
                                                                    archiveItem.date
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                    </div>
                                </div>
                            </div>
                        </AnimeReveal>

                        {/* GCG / PR Contact CTA Sidebar */}
                        <AnimeReveal delay={400} distance={20}>
                            <div className="relative overflow-hidden rounded-2xl bg-[#0d2e2e] p-5 text-white shadow-xs transition-all duration-500 hover:-translate-y-1">
                                <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/10 blur-2xl" />
                                <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-black/10 blur-3xl" />

                                <div className="relative z-10 space-y-5">
                                    <h3 className="text-base leading-snug font-semibold">
                                        Butuh Informasi Hubungan Investor &
                                        Publik?
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/80">
                                        Untuk pertanyaan media, informasi
                                        penanaman modal, atau permohonan cetak
                                        dokumen resmi, silakan hubungi PR
                                        korporat kami.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            alert(
                                                'Menghubungi Hubungan Masyarakat PEB...',
                                            )
                                        }
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-xs font-semibold text-[#00A4B9] shadow-xl transition-all hover:bg-[#eaf8f9]"
                                    >
                                        <MessageCircle size={20} />
                                        HUBUNGI HUBMAS
                                    </button>
                                </div>
                            </div>
                        </AnimeReveal>
                    </div>
                </div>
            </div>
        </main>
    );
}
