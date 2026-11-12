import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
});

interface MermaidProps {
    chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && chart) {
            mermaid
                .render(
                    'mermaid-chart-' + Math.random().toString(36).substr(2, 9),
                    chart
                )
                .then((result) => {
                    if (ref.current) {
                        ref.current.innerHTML = result.svg;
                    }
                })
                .catch((e) => {
                    console.error('Mermaid parsing error', e);
                });
        }
    }, [chart]);

    return (
        <div
            ref={ref}
            className="flex w-full justify-center overflow-x-auto p-4"
        />
    );
}
