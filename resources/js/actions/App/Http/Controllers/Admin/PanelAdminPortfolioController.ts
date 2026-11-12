import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:20
 * @route '/panel-admin/portfolio/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/portfolio/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:20
 * @route '/panel-admin/portfolio/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:20
 * @route '/panel-admin/portfolio/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::updateDaftarPortfolio
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:124
 * @route '/panel-admin/portfolio/daftar-section'
 */
export const updateDaftarPortfolio = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftarPortfolio.url(options),
    method: 'post',
})

updateDaftarPortfolio.definition = {
    methods: ["post"],
    url: '/panel-admin/portfolio/daftar-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::updateDaftarPortfolio
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:124
 * @route '/panel-admin/portfolio/daftar-section'
 */
updateDaftarPortfolio.url = (options?: RouteQueryOptions) => {
    return updateDaftarPortfolio.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminPortfolioController::updateDaftarPortfolio
 * @see app/Http/Controllers/Admin/PanelAdminPortfolioController.php:124
 * @route '/panel-admin/portfolio/daftar-section'
 */
updateDaftarPortfolio.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateDaftarPortfolio.url(options),
    method: 'post',
})
const PanelAdminPortfolioController = { updateHero, updateDaftarPortfolio }

export default PanelAdminPortfolioController