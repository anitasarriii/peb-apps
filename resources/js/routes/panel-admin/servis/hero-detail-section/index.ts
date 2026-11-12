import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::update
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:127
 * @route '/panel-admin/servis/hero-detail-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/servis/hero-detail-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::update
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:127
 * @route '/panel-admin/servis/hero-detail-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminServisController::update
 * @see app/Http/Controllers/Admin/PanelAdminServisController.php:127
 * @route '/panel-admin/servis/hero-detail-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const heroDetailSection = {
    update: Object.assign(update, update),
}

export default heroDetailSection