import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BerandaController::home
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BerandaController::home
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BerandaController::home
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BerandaController::home
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BerandaController::beranda
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
export const beranda = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: beranda.url(options),
    method: 'get',
})

beranda.definition = {
    methods: ["get","head"],
    url: '/beranda',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BerandaController::beranda
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
beranda.url = (options?: RouteQueryOptions) => {
    return beranda.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BerandaController::beranda
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
beranda.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: beranda.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BerandaController::beranda
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
beranda.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: beranda.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TentangKamiController::tentangKami
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
export const tentangKami = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tentangKami.url(options),
    method: 'get',
})

tentangKami.definition = {
    methods: ["get","head"],
    url: '/tentang-kami',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TentangKamiController::tentangKami
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
tentangKami.url = (options?: RouteQueryOptions) => {
    return tentangKami.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TentangKamiController::tentangKami
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
tentangKami.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tentangKami.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TentangKamiController::tentangKami
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
tentangKami.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tentangKami.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ServisController::servis
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
export const servis = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: servis.url(options),
    method: 'get',
})

servis.definition = {
    methods: ["get","head"],
    url: '/servis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServisController::servis
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
servis.url = (options?: RouteQueryOptions) => {
    return servis.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServisController::servis
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
servis.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: servis.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServisController::servis
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
servis.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: servis.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GaleriController::galeri
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
export const galeri = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galeri.url(options),
    method: 'get',
})

galeri.definition = {
    methods: ["get","head"],
    url: '/galeri',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GaleriController::galeri
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
galeri.url = (options?: RouteQueryOptions) => {
    return galeri.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GaleriController::galeri
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
galeri.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galeri.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GaleriController::galeri
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
galeri.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: galeri.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KebijakanController::kebijakan
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
export const kebijakan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kebijakan.url(options),
    method: 'get',
})

kebijakan.definition = {
    methods: ["get","head"],
    url: '/kebijakan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KebijakanController::kebijakan
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
kebijakan.url = (options?: RouteQueryOptions) => {
    return kebijakan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KebijakanController::kebijakan
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
kebijakan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kebijakan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KebijakanController::kebijakan
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
kebijakan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kebijakan.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PortfolioController::portfolio
 * @see app/Http/Controllers/PortfolioController.php:15
 * @route '/portfolio'
 */
export const portfolio = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portfolio.url(options),
    method: 'get',
})

portfolio.definition = {
    methods: ["get","head"],
    url: '/portfolio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PortfolioController::portfolio
 * @see app/Http/Controllers/PortfolioController.php:15
 * @route '/portfolio'
 */
portfolio.url = (options?: RouteQueryOptions) => {
    return portfolio.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortfolioController::portfolio
 * @see app/Http/Controllers/PortfolioController.php:15
 * @route '/portfolio'
 */
portfolio.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portfolio.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PortfolioController::portfolio
 * @see app/Http/Controllers/PortfolioController.php:15
 * @route '/portfolio'
 */
portfolio.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: portfolio.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PengadaanController::pengadaan
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
export const pengadaan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pengadaan.url(options),
    method: 'get',
})

pengadaan.definition = {
    methods: ["get","head"],
    url: '/pengadaan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PengadaanController::pengadaan
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
pengadaan.url = (options?: RouteQueryOptions) => {
    return pengadaan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengadaanController::pengadaan
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
pengadaan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pengadaan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PengadaanController::pengadaan
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
pengadaan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pengadaan.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanController::laporan
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
export const laporan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: laporan.url(options),
    method: 'get',
})

laporan.definition = {
    methods: ["get","head"],
    url: '/laporan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanController::laporan
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
laporan.url = (options?: RouteQueryOptions) => {
    return laporan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanController::laporan
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
laporan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: laporan.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LaporanController::laporan
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
laporan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: laporan.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BeritaAcaraController::beritaAcara
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
export const beritaAcara = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: beritaAcara.url(options),
    method: 'get',
})

beritaAcara.definition = {
    methods: ["get","head"],
    url: '/berita-acara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BeritaAcaraController::beritaAcara
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
beritaAcara.url = (options?: RouteQueryOptions) => {
    return beritaAcara.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BeritaAcaraController::beritaAcara
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
beritaAcara.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: beritaAcara.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BeritaAcaraController::beritaAcara
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
beritaAcara.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: beritaAcara.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KontakController::kontak
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
export const kontak = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kontak.url(options),
    method: 'get',
})

kontak.definition = {
    methods: ["get","head"],
    url: '/kontak',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KontakController::kontak
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
kontak.url = (options?: RouteQueryOptions) => {
    return kontak.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KontakController::kontak
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
kontak.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kontak.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KontakController::kontak
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
kontak.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kontak.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:131
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:131
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:131
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:131
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})