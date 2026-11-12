import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    // Memuat environment variables (termasuk deteksi sistem Vercel)
    const env = loadEnv(mode, process.cwd(), '');
    const isVercel =
        env.VERCEL === '1' ||
        process.env.VERCEL === '1' ||
        process.env.CI === 'true';

    // Inisialisasi plugin dasar yang selalu berjalan
    const activePlugins = [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
                'resources/js/pages/panel-admin/master-data/data-user/index.tsx',
                'resources/js/pages/panel-admin/master-data/data-role/index.tsx',
            ],
            refresh: true,
            fonts: [
                bunny('Inter', {
                    weights: [400, 500, 600, 700, 800, 900],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
    ];

    // Tambahkan Wayfinder jika di lokal (bukan di Vercel)
    if (!isVercel && command === 'serve') {
        activePlugins.push(wayfinder({ formVariants: true }));
    }

    return {
        plugins: activePlugins,
    };
});
