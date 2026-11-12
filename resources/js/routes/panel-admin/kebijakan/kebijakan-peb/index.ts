import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::update
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:124
 * @route '/panel-admin/kebijakan/kebijakan-peb'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/kebijakan/kebijakan-peb',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::update
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:124
 * @route '/panel-admin/kebijakan/kebijakan-peb'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKebijakanController::update
 * @see app/Http/Controllers/Admin/PanelAdminKebijakanController.php:124
 * @route '/panel-admin/kebijakan/kebijakan-peb'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const kebijakanPeb = {
    update: Object.assign(update, update),
}

export default kebijakanPeb