import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/panel-admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const PanelAdminController = { index }

export default PanelAdminController