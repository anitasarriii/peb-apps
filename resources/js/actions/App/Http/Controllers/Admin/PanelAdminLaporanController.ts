import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:21
 * @route '/panel-admin/laporan/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/laporan/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:21
 * @route '/panel-admin/laporan/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:21
 * @route '/panel-admin/laporan/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateKeuangan
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:125
 * @route '/panel-admin/laporan/keuangan-section'
 */
export const updateKeuangan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateKeuangan.url(options),
    method: 'post',
})

updateKeuangan.definition = {
    methods: ["post"],
    url: '/panel-admin/laporan/keuangan-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateKeuangan
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:125
 * @route '/panel-admin/laporan/keuangan-section'
 */
updateKeuangan.url = (options?: RouteQueryOptions) => {
    return updateKeuangan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateKeuangan
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:125
 * @route '/panel-admin/laporan/keuangan-section'
 */
updateKeuangan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateKeuangan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateTahunan
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:250
 * @route '/panel-admin/laporan/tahunan-section'
 */
export const updateTahunan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTahunan.url(options),
    method: 'post',
})

updateTahunan.definition = {
    methods: ["post"],
    url: '/panel-admin/laporan/tahunan-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateTahunan
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:250
 * @route '/panel-admin/laporan/tahunan-section'
 */
updateTahunan.url = (options?: RouteQueryOptions) => {
    return updateTahunan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::updateTahunan
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:250
 * @route '/panel-admin/laporan/tahunan-section'
 */
updateTahunan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTahunan.url(options),
    method: 'post',
})
const PanelAdminLaporanController = { updateHero, updateKeuangan, updateTahunan }

export default PanelAdminLaporanController