import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::update
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:13
 * @route '/panel-admin/kontak/hero-section'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/kontak/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::update
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:13
 * @route '/panel-admin/kontak/hero-section'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::update
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:13
 * @route '/panel-admin/kontak/hero-section'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const heroSection = {
    update: Object.assign(update, update),
}

export default heroSection