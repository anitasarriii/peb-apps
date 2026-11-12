import { Quote } from 'lucide-react';
import AnimeReveal from '@/components/global/anime-reveal';

interface QuoteSectionProps {
    quoteText?: string;
    description?: string;
    buttonLabel?: string;
    buttonHref?: string;
}

export default function QuoteSection({
    quoteText = '"Energi Bagi Negeri."',
    description = 'Komitmen kami adalah menjadi denyut nadi yang tak pernah berhenti untuk kemajuan Batam dan Indonesia.',
    buttonLabel = 'Lihat Portofolio Kami',
    buttonHref = '#portofolio',
}: QuoteSectionProps) {
    return (
        <section
            className="flex w-full items-center justify-center px-5 py-12 text-center sm:px-8 lg:px-12 lg:py-14"
            style={{
                background:
                    'linear-gradient(90deg, #082F3A 0%, #082F3AE5 70%, #00A4B9CC 100%)',
            }}
        >
            <div className="mx-auto flex max-w-4xl flex-col items-center">
                {/* Quote Icon */}
                <AnimeReveal
                    delay={100}
                    distance={30}
                    direction="up"
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5"
                >
                    <Quote
                        className="h-6 w-6 text-[#FFF098]"
                        fill="currentColor"
                    />
                </AnimeReveal>

                {/* Main Quote */}
                <AnimeReveal delay={200} distance={30} direction="up">
                    <h2 className="mb-3 text-xl font-bold tracking-wide text-white sm:text-2xl lg:text-3xl">
                        {quoteText}
                    </h2>
                </AnimeReveal>

                {/* Subtitle */}
                <AnimeReveal delay={300} distance={30} direction="up">
                    <p className="mb-6 max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
                        {description}
                    </p>
                </AnimeReveal>

                {/* Button */}
                <AnimeReveal delay={400} distance={30} direction="up">
                    <a
                        href={buttonHref}
                        className="inline-block rounded-full bg-[#FFF098] px-5 py-2.5 text-xs font-bold text-[#082F3A] shadow-[0_0_30px_rgba(255,240,152,0.3)] transition-all duration-500 hover:scale-105 hover:bg-white hover:shadow-[0_0_40px_rgba(255,240,152,0.5)] sm:text-sm"
                    >
                        {buttonLabel}
                    </a>
                </AnimeReveal>
            </div>
        </section>
    );
}
