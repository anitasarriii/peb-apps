import { Facebook, Globe, AtSign, MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import CtaSection from './cta-section';

interface FooterLink {
    label: string;
    href: string;
}

interface FooterSectionProps {
    logoSrc?: string;
    description?: string;
    exploreLinks?: FooterLink[];
    address?: string;
    phone?: string;
    email?: string;
    subscribeHeading?: string;
    subscribeDescription?: string;
    copyrightText?: ReactNode;
    hideCta?: boolean;
}

const defaultExploreLinks: FooterLink[] = [
    { label: 'Tentang Kami', href: '/tentang-kami' },
    { label: 'Layanan & Produk', href: '/servis' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Portofolio', href: '/portfolio' },
    { label: 'Kebijakan Korporat', href: '/kebijakan' },
    { label: 'Pengadaan', href: '/pengadaan' },
    { label: 'Berita Terkini', href: '#' },
    { label: 'Karir', href: '#' },
];

export default function FooterSection({
    logoSrc = '/assets/logo/logo-putih.png',
    description = 'Energi bagi negeri. Kami berkomitmen untuk menyediakan energi yang andal dan berkelanjutan untuk mendukung pertumbuhan industri dan ekonomi Batam.',
    exploreLinks = defaultExploreLinks,
    address = 'Gedung Graha Energi Lt. 3\nJl. Terusan Brigjen Katamso KM 8\nTanjung Uncang, Batam 29424',
    phone = 'Telephone : (0778) 736 1031\nFax : (0778) 494 397',
    email = 'info@peb.co.id',
    subscribeHeading = 'Berlangganan Info',
    subscribeDescription = 'Dapatkan informasi tender terbaru langsung ke email Anda.',
    copyrightText = (
        <span>
            © {new Date().getFullYear()} PT Pelayanan Energi Batam. All rights
            reserved. Powered by{' '}
            <a
                href="https://kalanara.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-[#FFE872]"
            >
                KGI
            </a>
        </span>
    ),
    hideCta = false,
}: FooterSectionProps) {
    const { props } = usePage();
    const ctaSection = (props as any).ctaSection;
    const footerData = (props as any).footer;
    const [emailInput, setEmailInput] = useState('');

    const logo = footerData?.logo_src ?? logoSrc;
    const desc = footerData?.description ?? description;
    const links = footerData?.explore_links ?? exploreLinks;
    const addr = footerData?.address ?? address;
    const tel = footerData?.phone ?? phone;
    const mail = footerData?.email ?? email;
    const subHeading = footerData?.subscribe_heading ?? subscribeHeading;
    const subDesc = footerData?.subscribe_description ?? subscribeDescription;
    const subButtonLabel = footerData?.subscribe_button_label ?? 'Langganan';
    const copyright = footerData?.copyright_text ? (
        <span>{footerData.copyright_text}</span>
    ) : (
        copyrightText
    );
    const privacyLink = footerData?.privacy_href ?? '#';
    const tosLink = footerData?.tos_href ?? '#';

    const facebookLink =
        footerData?.socials?.find((s: any) => s.platform === 'Facebook')
            ?.href ?? '#';
    const websiteLink =
        footerData?.socials?.find((s: any) => s.platform === 'Website')?.href ??
        '#';
    const emailLink =
        footerData?.socials?.find((s: any) => s.platform === 'Email')?.href ??
        '#';

    const handleSubscribe = (e: FormEvent) => {
        e.preventDefault();
        setEmailInput('');
    };

    return (
        <>
            {!hideCta && (
                <CtaSection
                    text={ctaSection?.text}
                    buttonLabel={ctaSection?.button_label}
                    buttonHref={ctaSection?.button_href}
                    backgroundSrc={ctaSection?.background_src}
                />
            )}
            <footer className="bg-[#0d2e2e] px-5 pt-9 transition-colors duration-500 sm:px-8 lg:px-12 lg:pt-11 dark:bg-[#051515]">
                {/* Main Footer */}
                <div className="mx-auto w-full pb-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
                        {/* Column 1 — Brand */}
                        <div>
                            <div className="mb-4">
                                <img
                                    src={logo}
                                    alt="PT Pelayanan Energi Batam"
                                    className="h-12 w-auto object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <p className="mb-6 max-w-xs text-xs leading-relaxed text-white/60 sm:text-sm">
                                {desc}
                            </p>
                            <div className="flex items-center gap-3">
                                <a
                                    href={facebookLink}
                                    className="text-[#FFE872] transition-colors hover:text-white"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a
                                    href={websiteLink}
                                    className="text-[#FFE872] transition-colors hover:text-white"
                                    aria-label="Website"
                                >
                                    <Globe className="h-4 w-4" />
                                </a>
                                <a
                                    href={emailLink}
                                    className="text-[#FFE872] transition-colors hover:text-white"
                                    aria-label="Email"
                                >
                                    <AtSign className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Column 2 — Explore */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold text-[#FFE872]">
                                Explore
                            </h3>
                            <ul className="space-y-2.5">
                                {links.map((link: any) => (
                                    <li key={link.id || link.label}>
                                        <a
                                            href={link.href}
                                            className="text-xs text-white/60 transition-colors hover:text-white sm:text-sm"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3 — Hubungi Kami */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold text-[#FFE872]">
                                Hubungi Kami
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFE872]" />
                                    <span className="text-xs leading-relaxed whitespace-pre-line text-white/60 sm:text-sm">
                                        {addr}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-[#FFE872]" />
                                    <span className="text-xs whitespace-pre-line text-white/60 sm:text-sm">
                                        {tel}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-[#FFE872]" />
                                    <span className="text-xs text-white/60 sm:text-sm">
                                        {mail}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4 — Berlangganan */}
                        <div>
                            <h3 className="mb-3 text-sm font-bold text-[#FFE872]">
                                {subHeading}
                            </h3>
                            <p className="mb-4 text-xs leading-relaxed text-white/60 sm:text-sm">
                                {subDesc}
                            </p>
                            <form
                                onSubmit={handleSubscribe}
                                className="flex flex-col gap-2.5"
                            >
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) =>
                                        setEmailInput(e.target.value)
                                    }
                                    placeholder="Alamat Email Anda"
                                    className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs text-white transition-colors outline-none placeholder:text-white/40 focus:border-[#FFE872] sm:text-sm dark:bg-black/20"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="cursor-pointer rounded-lg bg-[#FFE872] px-5 py-2.5 text-xs font-bold text-[#0d2e2e] transition-all hover:bg-[#f0e060] active:scale-95 sm:text-sm"
                                >
                                    {subButtonLabel}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row">
                        <p className="text-xs text-white/40">{copyright}</p>
                        <div className="flex items-center gap-6">
                            <a
                                href={privacyLink}
                                className="text-xs text-white/40 transition-colors hover:text-white/70"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href={tosLink}
                                className="text-xs text-white/40 transition-colors hover:text-white/70"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
