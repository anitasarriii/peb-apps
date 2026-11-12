import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:18
 * @route '/panel-admin/beranda/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/beranda/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:18
 * @route '/panel-admin/beranda/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:18
 * @route '/panel-admin/beranda/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateAbout
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:115
 * @route '/panel-admin/beranda/about-section'
 */
export const updateAbout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateAbout.url(options),
    method: 'post',
})

updateAbout.definition = {
    methods: ["post"],
    url: '/panel-admin/beranda/about-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateAbout
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:115
 * @route '/panel-admin/beranda/about-section'
 */
updateAbout.url = (options?: RouteQueryOptions) => {
    return updateAbout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateAbout
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:115
 * @route '/panel-admin/beranda/about-section'
 */
updateAbout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateAbout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateLayanan
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:186
 * @route '/panel-admin/beranda/layanan-section'
 */
export const updateLayanan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLayanan.url(options),
    method: 'post',
})

updateLayanan.definition = {
    methods: ["post"],
    url: '/panel-admin/beranda/layanan-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateLayanan
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:186
 * @route '/panel-admin/beranda/layanan-section'
 */
updateLayanan.url = (options?: RouteQueryOptions) => {
    return updateLayanan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateLayanan
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:186
 * @route '/panel-admin/beranda/layanan-section'
 */
updateLayanan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLayanan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updatePortfolio
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:220
 * @route '/panel-admin/beranda/portfolio-section'
 */
export const updatePortfolio = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePortfolio.url(options),
    method: 'post',
})

updatePortfolio.definition = {
    methods: ["post"],
    url: '/panel-admin/beranda/portfolio-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updatePortfolio
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:220
 * @route '/panel-admin/beranda/portfolio-section'
 */
updatePortfolio.url = (options?: RouteQueryOptions) => {
    return updatePortfolio.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updatePortfolio
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:220
 * @route '/panel-admin/beranda/portfolio-section'
 */
updatePortfolio.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePortfolio.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateStatistik
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:270
 * @route '/panel-admin/beranda/statistik-section'
 */
export const updateStatistik = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatistik.url(options),
    method: 'post',
})

updateStatistik.definition = {
    methods: ["post"],
    url: '/panel-admin/beranda/statistik-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateStatistik
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:270
 * @route '/panel-admin/beranda/statistik-section'
 */
updateStatistik.url = (options?: RouteQueryOptions) => {
    return updateStatistik.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updateStatistik
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:270
 * @route '/panel-admin/beranda/statistik-section'
 */
updateStatistik.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatistik.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updatePartner
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:334
 * @route '/panel-admin/beranda/partner-section'
 */
export const updatePartner = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePartner.url(options),
    method: 'post',
})

updatePartner.definition = {
    methods: ["post"],
    url: '/panel-admin/beranda/partner-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updatePartner
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:334
 * @route '/panel-admin/beranda/partner-section'
 */
updatePartner.url = (options?: RouteQueryOptions) => {
    return updatePartner.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::updatePartner
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:334
 * @route '/panel-admin/beranda/partner-section'
 */
updatePartner.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePartner.url(options),
    method: 'post',
})
const PanelAdminBerandaController = { updateHero, updateAbout, updateLayanan, updatePortfolio, updateStatistik, updatePartner }

export default PanelAdminBerandaController