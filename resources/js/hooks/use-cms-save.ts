import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function useCmsSave() {
    const state = useState(false);
    const [, setSaving] = state;

    useEffect(
        () =>
            router.on('finish', (event) => {
                if (event.detail.visit.method !== 'get') {
                    setSaving(false);
                }
            }),
        [setSaving],
    );

    return state;
}
