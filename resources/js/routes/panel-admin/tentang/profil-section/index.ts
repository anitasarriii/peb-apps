import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:106
 * @route '/panel-admin/tentang/profil-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/profil-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:106
 * @route '/panel-admin/tentang/profil-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:106
 * @route '/panel-admin/tentang/profil-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const profilSection = {
    update: Object.assign(update, update),
}

export default profilSection