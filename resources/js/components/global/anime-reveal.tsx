import { animate } from 'animejs';
import { useEffect, useRef } from 'react';

interface AnimeRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
}

export default function AnimeReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    distance = 50,
}: AnimeRevealProps) {
    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentEl = elRef.current;

        if (!currentEl) {
            return;
        }

        if (
            currentEl.closest('.admin-typography') ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            currentEl.style.opacity = '1';
            currentEl.style.transform = 'none';
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const translateY =
                            direction === 'up'
                                ? [distance, 0]
                                : direction === 'down'
                                  ? [-distance, 0]
                                  : [0, 0];
                        const translateX =
                            direction === 'left'
                                ? [distance, 0]
                                : direction === 'right'
                                  ? [-distance, 0]
                                  : [0, 0];

                        animate(currentEl, {
                            translateY,
                            translateX,
                            opacity: [0, 1],
                            duration: 1200,
                            delay: delay,
                            // Easing di Anime v4
                            ease: 'outElastic(1, 0.8)',
                        });

                        observer.unobserve(currentEl);
                    }
                });
            },
            { threshold: 0.15 }, // Trigger saat 15% elemen terlihat
        );

        observer.observe(currentEl);

        return () => {
            if (currentEl) {
                observer.unobserve(currentEl);
            }
        };
    }, [delay, direction, distance]);

    return (
        <div ref={elRef} className={`opacity-0 ${className}`}>
            {children}
        </div>
    );
}
