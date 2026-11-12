import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminCtaController::update
 * @see app/Http/Controllers/Admin/PanelAdminCtaController.php:20
 * @route '/panel-admin/cta-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/cta-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminCtaController::update
 * @see app/Http/Controllers/Admin/PanelAdminCtaController.php:20
 * @route '/panel-admin/cta-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminCtaController::update
 * @see app/Http/Controllers/Admin/PanelAdminCtaController.php:20
 * @route '/panel-admin/cta-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const ctaSection = {
    update: Object.assign(update, update),
}

export default ctaSection