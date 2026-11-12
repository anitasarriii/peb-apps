import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::update
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:21
 * @route '/panel-admin/laporan/hero-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/laporan/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::update
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:21
 * @route '/panel-admin/laporan/hero-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminLaporanController::update
 * @see app/Http/Controllers/Admin/PanelAdminLaporanController.php:21
 * @route '/panel-admin/laporan/hero-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const heroSection = {
    update: Object.assign(update, update),
}

export default heroSection