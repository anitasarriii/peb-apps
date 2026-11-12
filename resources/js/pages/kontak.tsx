import { Head, useForm, usePage } from '@inertiajs/react';
import { Building, Phone, Mail, Clock, Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import AnimeReveal from '@/components/global/anime-reveal';
import FooterSection from '@/components/global/footer-section';
import HeroSection from '@/components/global/hero-section-v2';
import Navbar from '@/components/global/navbar';

interface SeoMeta {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
}

interface Props {
    seoMeta?: SeoMeta | null;
    heroKontak?: {
        title?: string;
        subtitle?: string;
        carousel_items?: any[];
    } | null;
}

export default function Kontak({ seoMeta, heroKontak }: Props) {
    const { props } = usePage();
    const footerData = (props as any).footer;

    const pageTitle =
        seoMeta?.meta_title ?? 'Hubungi Kami | PT Pelayanan Energi Batam';
    const pageDesc =
        seoMeta?.meta_description ??
        'Hubungi PT Pelayanan Energi Batam untuk pertanyaan, kerja sama bisnis, atau informasi layanan energi.';

    const address =
        footerData?.address ??
        'Gedung Graha Energi Lt. 3\nJl. Terusan Brigjen Katamso KM 8\nTanjung Uncang, Batam 29424';
    const phone =
        footerData?.phone ??
        'Telephone : (0778) 736 1031\nFax : (0778) 494 397';
    const email = footerData?.email ?? 'info@peb.co.id';

    const firstPhone = phone.split('\n')[0] || '';
    const cleanTel = firstPhone.replace(/[^\d+]/g, '');

    // Inertia form hook untuk menangani state form, validation, dan submission
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/kontak', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Pesan Anda berhasil terkirim. Terima kasih!');
            },
            onError: () => {
                toast.error(
                    'Gagal mengirim pesan. Mohon periksa kembali input Anda.',
                );
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#f7fafb] transition-colors duration-500 dark:bg-[#0a1a1a]">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                {seoMeta?.meta_keywords && (
                    <meta name="keywords" content={seoMeta.meta_keywords} />
                )}
            </Head>

            {/* Header & Hero */}
            <div className="relative overflow-hidden">
                <Navbar activeLink="Hubungi Kami" ctaVariant="white" />
                <HeroSection
                    title={heroKontak?.title || 'Hubungi Kami'}
                    subtitle={
                        heroKontak?.subtitle ||
                        'Kami siap mendengar kebutuhan energi dan kerja sama strategis Anda. Hubungi tim ahli kami kapan saja.'
                    }
                    imageSrc="/assets/tentang-kami/hero/banner_about.jpg"
                    slides={heroKontak?.carousel_items}
                />
            </div>

            {/* Main Content Section */}
            <section className="px-5 py-9 sm:px-8 lg:px-12 lg:py-10">
                <div className="mx-auto w-full max-w-[1200px]">
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
                        {/* Kolom Kiri: Informasi Kontak — order-2 di mobile (form ditampilkan dulu) */}
                        <div className="order-2 flex min-w-0 flex-col lg:order-1 lg:col-span-5">
                            <AnimeReveal
                                delay={100}
                                distance={30}
                                direction="up"
                            >
                                <h2 className="text-xl font-bold tracking-tight text-[#1a2e2e] sm:text-2xl dark:text-white">
                                    Mari Terhubung
                                </h2>
                                <div className="mt-3 mb-4 h-[3px] w-16 rounded-full bg-[#f5e879]" />
                                <p className="mb-5 max-w-md text-sm leading-6 text-[#1a2e2e]/65 dark:text-white/60">
                                    Hubungi kami melalui detail kontak di bawah
                                    ini, atau gunakan formulir di samping untuk
                                    mengirim pesan langsung. Kami berkomitmen
                                    merespons dalam 1-2 hari kerja.
                                </p>
                            </AnimeReveal>

                            {/* Grid 2 kolom di mobile/sm, 1 kolom di lg */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                {/* Alamat */}
                                <AnimeReveal
                                    delay={200}
                                    distance={20}
                                    direction="up"
                                >
                                    <div className="flex gap-3 rounded-xl border border-[#0d2e2e]/10 bg-white p-3.5 dark:border-white/5 dark:bg-white/5">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00A4B9]/10 text-[#008c9e] dark:bg-[#00A4B9] dark:text-white">
                                            <Building className="size-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-medium text-[#1a2e2e]/50 dark:text-white/40">
                                                Kantor Pusat
                                            </h4>
                                            <p className="mt-1 text-sm leading-relaxed font-medium whitespace-pre-line text-[#1a2e2e] dark:text-white">
                                                {address}
                                            </p>
                                        </div>
                                    </div>
                                </AnimeReveal>

                                <AnimeReveal
                                    delay={300}
                                    distance={20}
                                    direction="up"
                                >
                                    <a
                                        href={`tel:${cleanTel}`}
                                        className="flex gap-3 rounded-xl border border-[#0d2e2e]/10 bg-white p-3.5 transition-colors hover:border-[#00A4B9]/40 dark:border-white/5 dark:bg-white/5"
                                    >
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00A4B9]/10 text-[#008c9e] dark:bg-[#00A4B9] dark:text-white">
                                            <Phone className="size-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-medium text-[#1a2e2e]/50 dark:text-white/40">
                                                Telepon & Fax
                                            </h4>
                                            <p className="mt-1 text-sm font-medium whitespace-pre-line text-[#1a2e2e] dark:text-white">
                                                {phone}
                                            </p>
                                        </div>
                                    </a>
                                </AnimeReveal>

                                {/* Email */}
                                <AnimeReveal
                                    delay={400}
                                    distance={20}
                                    direction="up"
                                >
                                    <a
                                        href={`mailto:${email}`}
                                        className="flex gap-3 rounded-xl border border-[#0d2e2e]/10 bg-white p-3.5 transition-colors hover:border-[#00A4B9]/40 dark:border-white/5 dark:bg-white/5"
                                    >
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00A4B9]/10 text-[#008c9e] dark:bg-[#00A4B9] dark:text-white">
                                            <Mail className="size-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-medium text-[#1a2e2e]/50 dark:text-white/40">
                                                Email Resmi
                                            </h4>
                                            <p className="mt-1 text-sm font-medium break-all text-[#1a2e2e] dark:text-white">
                                                {email}
                                            </p>
                                        </div>
                                    </a>
                                </AnimeReveal>

                                {/* Jam Kerja */}
                                <AnimeReveal
                                    delay={500}
                                    distance={20}
                                    direction="up"
                                >
                                    <div className="flex gap-3 rounded-xl border border-[#0d2e2e]/10 bg-white p-3.5 dark:border-white/5 dark:bg-white/5">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00A4B9]/10 text-[#008c9e] dark:bg-[#00A4B9] dark:text-white">
                                            <Clock className="size-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-medium text-[#1a2e2e]/50 dark:text-white/40">
                                                Jam Kerja
                                            </h4>
                                            <p className="mt-1 text-sm font-semibold text-[#1a2e2e] dark:text-white">
                                                Senin - Jumat: 08:00 - 17:00 WIB
                                            </p>
                                        </div>
                                    </div>
                                </AnimeReveal>
                            </div>
                        </div>

                        {/* Kolom Kanan: Form Hubungi Kami — order-1 di mobile (tampil pertama) */}
                        <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
                            <AnimeReveal
                                delay={200}
                                distance={40}
                                direction="left"
                            >
                                <div className="relative overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white p-5 shadow-[0_4px_24px_rgba(13,46,46,0.03)] sm:p-6 dark:border-white/5 dark:bg-[#112424]/80">
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-semibold text-[#1a2e2e] sm:text-xl dark:text-white">
                                            Kirim Pesan Langsung
                                        </h3>
                                        <p className="mt-2 mb-5 text-sm leading-6 text-[#1a2e2e]/60 dark:text-white/40">
                                            Isi data Anda di bawah ini dan kami
                                            akan memproses pertanyaan Anda
                                            secepat mungkin.
                                        </p>

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-3 sm:space-y-4"
                                        >
                                            {/* Nama & Email — side by side di sm ke atas */}
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                                {/* Nama */}
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-[#1a2e2e]/70 dark:text-white/40">
                                                        Nama Lengkap
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Nama lengkap Anda"
                                                        className="w-full rounded-lg border border-black/10 bg-[#f7fafb] px-3 py-2.5 text-sm text-[#1a2e2e] outline-hidden placeholder:text-black/30 focus:border-[#00A4B9] focus:bg-white dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/20 dark:focus:border-[#00A4B9] dark:focus:bg-black/45"
                                                        required
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-1 text-xs font-medium text-red-500">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-[#1a2e2e]/70 dark:text-white/40">
                                                        Alamat Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="email@domain.com"
                                                        className="w-full rounded-lg border border-black/10 bg-[#f7fafb] px-3 py-2.5 text-sm text-[#1a2e2e] outline-hidden placeholder:text-black/30 focus:border-[#00A4B9] focus:bg-white dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/20 dark:focus:border-[#00A4B9] dark:focus:bg-black/45"
                                                        required
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-xs font-medium text-red-500">
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Subjek */}
                                            <div>
                                                <label className="mb-1.5 block text-xs font-medium text-[#1a2e2e]/70 dark:text-white/40">
                                                    Subjek / Perihal
                                                </label>
                                                <select
                                                    value={data.subject}
                                                    onChange={(e) =>
                                                        setData(
                                                            'subject',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-black/10 bg-[#f7fafb] px-3 py-2.5 text-sm text-[#1a2e2e] outline-hidden focus:border-[#00A4B9] focus:bg-white dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#00A4B9] dark:focus:bg-black/45"
                                                    required
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                        className="text-black/30 dark:text-white/35"
                                                    >
                                                        Pilih Perihal
                                                    </option>
                                                    <option
                                                        value="Kerja Sama Bisnis"
                                                        className="text-[#1a2e2e] dark:bg-[#0d2e2e]"
                                                    >
                                                        Kerja Sama Bisnis
                                                    </option>
                                                    <option
                                                        value="Layanan & Produk"
                                                        className="text-[#1a2e2e] dark:bg-[#0d2e2e]"
                                                    >
                                                        Layanan & Produk
                                                    </option>
                                                    <option
                                                        value="Tender / Pengadaan"
                                                        className="text-[#1a2e2e] dark:bg-[#0d2e2e]"
                                                    >
                                                        Tender / Pengadaan
                                                    </option>
                                                    <option
                                                        value="Karir & SDM"
                                                        className="text-[#1a2e2e] dark:bg-[#0d2e2e]"
                                                    >
                                                        Karir & SDM
                                                    </option>
                                                    <option
                                                        value="Lainnya"
                                                        className="text-[#1a2e2e] dark:bg-[#0d2e2e]"
                                                    >
                                                        Lainnya
                                                    </option>
                                                </select>
                                                {errors.subject && (
                                                    <p className="mt-1 text-xs font-medium text-red-500">
                                                        {errors.subject}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Pesan */}
                                            <div>
                                                <label className="mb-1.5 block text-xs font-medium text-[#1a2e2e]/70 dark:text-white/40">
                                                    Isi Pesan
                                                </label>
                                                <textarea
                                                    value={data.message}
                                                    onChange={(e) =>
                                                        setData(
                                                            'message',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Tulis pesan lengkap Anda di sini..."
                                                    rows={4}
                                                    className="w-full resize-none rounded-lg border border-black/10 bg-[#f7fafb] px-3 py-2.5 text-sm text-[#1a2e2e] outline-hidden placeholder:text-black/30 focus:border-[#00A4B9] focus:bg-white dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/20 dark:focus:border-[#00A4B9] dark:focus:bg-black/45"
                                                    required
                                                />
                                                {errors.message && (
                                                    <p className="mt-1 text-xs font-medium text-red-500">
                                                        {errors.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <div className="pt-1">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#0d2e2e] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#153e3e] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 dark:bg-[#00A4B9] dark:hover:bg-[#00b9d1]"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                            <span>
                                                                Mengirim
                                                                Pesan...
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="h-4 w-4 text-[#FFE872] dark:text-white" />
                                                            <span>
                                                                Kirim Pesan
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </AnimeReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Maps Section */}
            <section className="px-5 pb-9 sm:px-8 lg:px-12 lg:pb-10">
                <div className="mx-auto w-full max-w-[1200px]">
                    <AnimeReveal delay={100} distance={40} direction="up">
                        <div className="overflow-hidden rounded-2xl border border-[#0d2e2e]/10 bg-white p-4 shadow-xs sm:p-5 dark:border-white/5 dark:bg-white/5">
                            <h3 className="mb-2 text-base font-semibold text-[#1a2e2e] dark:text-white">
                                Lokasi Kantor Pusat
                            </h3>
                            <p className="mb-4 text-xs leading-6 text-[#1a2e2e]/60 dark:text-white/40">
                                Kunjungi kantor kami untuk rapat langsung atau
                                keperluan resmi.
                            </p>
                            <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[280px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15956.36476198215!2d103.90151500000002!3d1.09389!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d9f35abfd3891f%3A0x28a3217168c97eed!2sPT%20Pelayanan%20Energi%20Batam!5e0!3m2!1sen!2sus!4v1782269456137!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta Lokasi Kantor Pusat PT Pelayanan Energi Batam"
                                    className="absolute inset-0 h-full w-full grayscale dark:grayscale-0 dark:invert"
                                />
                            </div>
                        </div>
                    </AnimeReveal>
                </div>
            </section>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
