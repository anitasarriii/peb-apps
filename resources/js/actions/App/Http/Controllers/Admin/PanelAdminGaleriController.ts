import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:22
 * @route '/panel-admin/galeri/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/galeri/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:22
 * @route '/panel-admin/galeri/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:22
 * @route '/panel-admin/galeri/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::updateGaleriFoto
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:126
 * @route '/panel-admin/galeri/galeri-foto'
 */
export const updateGaleriFoto = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateGaleriFoto.url(options),
    method: 'post',
})

updateGaleriFoto.definition = {
    methods: ["post"],
    url: '/panel-admin/galeri/galeri-foto',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::updateGaleriFoto
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:126
 * @route '/panel-admin/galeri/galeri-foto'
 */
updateGaleriFoto.url = (options?: RouteQueryOptions) => {
    return updateGaleriFoto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminGaleriController::updateGaleriFoto
 * @see app/Http/Controllers/Admin/PanelAdminGaleriController.php:126
 * @route '/panel-admin/galeri/galeri-foto'
 */
updateGaleriFoto.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateGaleriFoto.url(options),
    method: 'post',
})
const PanelAdminGaleriController = { updateHero, updateGaleriFoto }

export default PanelAdminGaleriController