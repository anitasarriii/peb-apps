import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:20
 * @route '/panel-admin/kebijakan/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/kebijakan/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:20
 * @route '/panel-admin/kebijakan/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:20
 * @route '/panel-admin/kebijakan/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::updateKebijakanPeb
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:124
 * @route '/panel-admin/kebijakan/kebijakan-peb'
 */
export const updateKebijakanPeb = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateKebijakanPeb.url(options),
    method: 'post',
})

updateKebijakanPeb.definition = {
    methods: ["post"],
    url: '/panel-admin/kebijakan/kebijakan-peb',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::updateKebijakanPeb
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:124
 * @route '/panel-admin/kebijakan/kebijakan-peb'
 */
updateKebijakanPeb.url = (options?: RouteQueryOptions) => {
    return updateKebijakanPeb.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::updateKebijakanPeb
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:124
 * @route '/panel-admin/kebijakan/kebijakan-peb'
 */
updateKebijakanPeb.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateKebijakanPeb.url(options),
    method: 'post',
})
const PanelAdminKebijakanController = { updateHero, updateKebijakanPeb }

export default PanelAdminKebijakanController