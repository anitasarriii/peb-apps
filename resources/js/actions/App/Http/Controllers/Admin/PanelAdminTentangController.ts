import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:19
 * @route '/panel-admin/tentang/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:19
 * @route '/panel-admin/tentang/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:19
 * @route '/panel-admin/tentang/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateProfil
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:106
 * @route '/panel-admin/tentang/profil-section'
 */
export const updateProfil = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfil.url(options),
    method: 'post',
})

updateProfil.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/profil-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateProfil
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:106
 * @route '/panel-admin/tentang/profil-section'
 */
updateProfil.url = (options?: RouteQueryOptions) => {
    return updateProfil.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateProfil
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:106
 * @route '/panel-admin/tentang/profil-section'
 */
updateProfil.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfil.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateVisiMisi
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:180
 * @route '/panel-admin/tentang/visi-misi-section'
 */
export const updateVisiMisi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVisiMisi.url(options),
    method: 'post',
})

updateVisiMisi.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/visi-misi-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateVisiMisi
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:180
 * @route '/panel-admin/tentang/visi-misi-section'
 */
updateVisiMisi.url = (options?: RouteQueryOptions) => {
    return updateVisiMisi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateVisiMisi
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:180
 * @route '/panel-admin/tentang/visi-misi-section'
 */
updateVisiMisi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVisiMisi.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateTim
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:254
 * @route '/panel-admin/tentang/tim-section'
 */
export const updateTim = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTim.url(options),
    method: 'post',
})

updateTim.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/tim-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateTim
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:254
 * @route '/panel-admin/tentang/tim-section'
 */
updateTim.url = (options?: RouteQueryOptions) => {
    return updateTim.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateTim
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:254
 * @route '/panel-admin/tentang/tim-section'
 */
updateTim.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTim.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateQuote
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:330
 * @route '/panel-admin/tentang/quote-section'
 */
export const updateQuote = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateQuote.url(options),
    method: 'post',
})

updateQuote.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/quote-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateQuote
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:330
 * @route '/panel-admin/tentang/quote-section'
 */
updateQuote.url = (options?: RouteQueryOptions) => {
    return updateQuote.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updateQuote
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:330
 * @route '/panel-admin/tentang/quote-section'
 */
updateQuote.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateQuote.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updatePartner
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:365
 * @route '/panel-admin/tentang/partner-section'
 */
export const updatePartner = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePartner.url(options),
    method: 'post',
})

updatePartner.definition = {
    methods: ["post"],
    url: '/panel-admin/tentang/partner-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updatePartner
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:365
 * @route '/panel-admin/tentang/partner-section'
 */
updatePartner.url = (options?: RouteQueryOptions) => {
    return updatePartner.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminTentangController::updatePartner
 * @see app/Http/Controllers/Admin/PanelAdminTentangController.php:365
 * @route '/panel-admin/tentang/partner-section'
 */
updatePartner.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePartner.url(options),
    method: 'post',
})
const PanelAdminTentangController = { updateHero, updateProfil, updateVisiMisi, updateTim, updateQuote, updatePartner }

export default PanelAdminTentangController