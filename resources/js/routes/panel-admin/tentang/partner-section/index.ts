import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:365
 * @route '/panel-admin/tentang/partner-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/partner-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:365
 * @route '/panel-admin/tentang/partner-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::update
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:365
 * @route '/panel-admin/tentang/partner-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const partnerSection = {
    update: Object.assign(update, update),
}

export default partnerSection