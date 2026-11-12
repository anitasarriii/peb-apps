import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CmsPreferencesController::update
 * @see app/Http/Controllers/Admin/CmsPreferencesController.php:23
 * @route '/panel-admin/preferences'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/preferences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CmsPreferencesController::update
 * @see app/Http/Controllers/Admin/CmsPreferencesController.php:23
 * @route '/panel-admin/preferences'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CmsPreferencesController::update
 * @see app/Http/Controllers/Admin/CmsPreferencesController.php:23
 * @route '/panel-admin/preferences'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const preferences = {
    update: Object.assign(update, update),
}

export default preferences