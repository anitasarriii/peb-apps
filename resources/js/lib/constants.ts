/**
 * Konfigurasi durasi animasi dan delay global untuk menjaga sinkronisasi
 * antara page loader, transisi halaman, dan menu navigasi (navbar).
 */
export const ANIMATION_TIMINGS = {
    // Durasi PageLoader ditampilkan secara penuh sebelum mulai menghilang (ms)
    // Dipercepat dari semula 2500ms menjadi 1200ms
    PAGE_LOADER_DELAY: 1200,

    // Durasi animasi fade out kontainer PageLoader (ms)
    // Dipercepat dari semula 1000ms menjadi 800ms
    PAGE_LOADER_FADE_DURATION: 800,

    // Durasi transisi masuk konten utama halaman (#main-content) (ms)
    // Dipercepat dari semula 1200ms menjadi 1000ms
    MAIN_CONTENT_ENTER_DURATION: 1000,

    // Delay sebelum animasi masuk navbar dimulai (ms)
    // Dihitung secara dinamis agar selalu sinkron ketika PAGE_LOADER_DELAY berubah
    get NAVBAR_ANIMATION_DELAY() {
        return this.PAGE_LOADER_DELAY + (this.MAIN_CONTENT_ENTER_DURATION / 2);
    }
};
