import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::update
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:126
 * @route '/panel-admin/galeri/galeri-foto'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/galeri/galeri-foto',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::update
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:126
 * @route '/panel-admin/galeri/galeri-foto'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::update
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:126
 * @route '/panel-admin/galeri/galeri-foto'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const galeriFoto = {
    update: Object.assign(update, update),
}

export default galeriFoto