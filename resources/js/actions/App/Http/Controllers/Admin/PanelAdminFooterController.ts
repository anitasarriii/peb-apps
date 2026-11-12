import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminFooterController::update
 * @see app/Http/Controllers/Admin/PanelAdminFooterController.php:16
 * @route '/panel-admin/footer'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/footer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminFooterController::update
 * @see app/Http/Controllers/Admin/PanelAdminFooterController.php:16
 * @route '/panel-admin/footer'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminFooterController::update
 * @see app/Http/Controllers/Admin/PanelAdminFooterController.php:16
 * @route '/panel-admin/footer'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const PanelAdminFooterController = { update }

export default PanelAdminFooterController