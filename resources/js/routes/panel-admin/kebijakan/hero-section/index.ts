import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::update
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:20
 * @route '/panel-admin/kebijakan/hero-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/kebijakan/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::update
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:20
 * @route '/panel-admin/kebijakan/hero-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::update
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:20
 * @route '/panel-admin/kebijakan/hero-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const heroSection = {
    update: Object.assign(update, update),
}

export default heroSection