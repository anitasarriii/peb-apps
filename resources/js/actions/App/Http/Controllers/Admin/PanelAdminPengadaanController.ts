import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:22
 * @route '/panel-admin/pengadaan/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/pengadaan/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:22
 * @route '/panel-admin/pengadaan/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:22
 * @route '/panel-admin/pengadaan/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:126
 * @route '/panel-admin/pengadaan/daftar-section'
 */
export const updateDaftar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftar.url(options),
    method: 'post',
})

updateDaftar.definition = {
    methods: ["post"],
    url: '/panel-admin/pengadaan/daftar-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:126
 * @route '/panel-admin/pengadaan/daftar-section'
 */
updateDaftar.url = (options?: RouteQueryOptions) => {
    return updateDaftar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::updateDaftar
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:126
 * @route '/panel-admin/pengadaan/daftar-section'
 */
updateDaftar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftar.url(options),
    method: 'post',
})
const PanelAdminPengadaanController = { updateHero, updateDaftar }

export default PanelAdminPengadaanController