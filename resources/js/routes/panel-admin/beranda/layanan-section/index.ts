import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::update
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:186
 * @route '/panel-admin/beranda/layanan-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/beranda/layanan-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::update
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:186
 * @route '/panel-admin/beranda/layanan-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminBerandaController::update
 * @see app/Http/Controllers/Admin/PanelAdminBerandaController.php:186
 * @route '/panel-admin/beranda/layanan-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const layananSection = {
    update: Object.assign(update, update),
}

export default layananSection