import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::update
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:124
 * @route '/panel-admin/portfolio/daftar-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/portfolio/daftar-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::update
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:124
 * @route '/panel-admin/portfolio/daftar-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::update
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:124
 * @route '/panel-admin/portfolio/daftar-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const daftarSection = {
    update: Object.assign(update, update),
}

export default daftarSection