import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminBeritaController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminBeritaController.php:20
 * @route '/panel-admin/berita/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/berita/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBeritaController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminBeritaController.php:20
 * @route '/panel-admin/berita/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBeritaController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminBeritaController.php:20
 * @route '/panel-admin/berita/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminBeritaController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminBeritaController.php:124
 * @route '/panel-admin/berita/daftar-section'
 */
export const updateDaftar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftar.url(options),
    method: 'post',
})

updateDaftar.definition = {
    methods: ["post"],
    url: '/panel-admin/berita/daftar-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBeritaController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminBeritaController.php:124
 * @route '/panel-admin/berita/daftar-section'
 */
updateDaftar.url = (options?: RouteQueryOptions) => {
    return updateDaftar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBeritaController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminBeritaController.php:124
 * @route '/panel-admin/berita/daftar-section'
 */
updateDaftar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftar.url(options),
    method: 'post',
})
const PanelAdminBeritaController = { updateHero, updateDaftar }

export default PanelAdminBeritaController