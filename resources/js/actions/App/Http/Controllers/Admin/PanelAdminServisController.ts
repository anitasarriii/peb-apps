import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:23
 * @route '/panel-admin/servis/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/servis/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:23
 * @route '/panel-admin/servis/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:23
 * @route '/panel-admin/servis/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateHeroDetail
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:127
 * @route '/panel-admin/servis/hero-detail-section'
 */
export const updateHeroDetail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHeroDetail.url(options),
    method: 'post',
})

updateHeroDetail.definition = {
    methods: ["post"],
    url: '/panel-admin/servis/hero-detail-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateHeroDetail
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:127
 * @route '/panel-admin/servis/hero-detail-section'
 */
updateHeroDetail.url = (options?: RouteQueryOptions) => {
    return updateHeroDetail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateHeroDetail
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:127
 * @route '/panel-admin/servis/hero-detail-section'
 */
updateHeroDetail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHeroDetail.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:230
 * @route '/panel-admin/servis/daftar-section'
 */
export const updateDaftar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftar.url(options),
    method: 'post',
})

updateDaftar.definition = {
    methods: ["post"],
    url: '/panel-admin/servis/daftar-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:230
 * @route '/panel-admin/servis/daftar-section'
 */
updateDaftar.url = (options?: RouteQueryOptions) => {
    return updateDaftar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:230
 * @route '/panel-admin/servis/daftar-section'
 */
updateDaftar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftar.url(options),
    method: 'post',
})
const PanelAdminServisController = { updateHero, updateHeroDetail, updateDaftar }

export default PanelAdminServisController