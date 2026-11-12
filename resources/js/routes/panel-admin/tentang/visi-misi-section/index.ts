import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:180
 * @route '/panel-admin/tentang/visi-misi-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/visi-misi-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:180
 * @route '/panel-admin/tentang/visi-misi-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:180
 * @route '/panel-admin/tentang/visi-misi-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const visiMisiSection = {
    update: Object.assign(update, update),
}

export default visiMisiSection