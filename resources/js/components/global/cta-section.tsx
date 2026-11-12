import { ArrowRight } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';
import { sectionCtaClassName } from '@/components/global/section-cta-style';

interface CtaSectionProps {
    text?: string;
    buttonLabel?: string;
    buttonHref?: string;
    backgroundSrc?: string;
}

export default function CtaSection({
    text = 'Anda membutuhkan layanan dari kami?',
    buttonLabel = 'Hubungi Kami',
    buttonHref = '#hubungi',
    backgroundSrc = '/assets/beranda/cta/cta.jpg',
}: CtaSectionProps) {
    return (
        <section className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={backgroundSrc}
                    alt=""
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0d2e2e]/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex w-full flex-col items-start justify-between gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8 lg:px-12 lg:py-10">
                <AnimeReveal delay={100} distance={30} direction="right">
                    <p className="text-base font-semibold text-white italic md:text-lg lg:text-xl">
                        {text}
                    </p>
                </AnimeReveal>
                <AnimeReveal delay={300} distance={30} direction="left">
                    <a href={buttonHref} className={sectionCtaClassName}>
                        {buttonLabel}
                        <ArrowRight aria-hidden="true" />
                    </a>
                </AnimeReveal>
            </div>
        </section>
    );
}
