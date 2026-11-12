import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::update
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:126
 * @route '/panel-admin/pengadaan/daftar-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/pengadaan/daftar-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::update
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:126
 * @route '/panel-admin/pengadaan/daftar-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminPengadaanController::update
 * @see app/Http/Controllers/Admin/PanelAdminPengadaanController.php:126
 * @route '/panel-admin/pengadaan/daftar-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const daftarSection = {
    update: Object.assign(update, update),
}

export default daftarSection