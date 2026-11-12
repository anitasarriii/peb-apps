import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SeoMetaController::update
 * @see app/Http/Controllers/Admin/SeoMetaController.php:12
 * @route '/panel-admin/seo-meta/{page_type}'
 */
export const update = (args: { page_type: string | number } | [page_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/panel-admin/seo-meta/{page_type}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SeoMetaController::update
 * @see app/Http/Controllers/Admin/SeoMetaController.php:12
 * @route '/panel-admin/seo-meta/{page_type}'
 */
update.url = (args: { page_type: string | number } | [page_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    page_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        page_type: args.page_type,
                }

    return update.definition.url
            .replace('{page_type}', parsedArgs.page_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SeoMetaController::update
 * @see app/Http/Controllers/Admin/SeoMetaController.php:12
 * @route '/panel-admin/seo-meta/{page_type}'
 */
update.post = (args: { page_type: string | number } | [page_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})
const seoMeta = {
    update: Object.assign(update, update),
}

export default seoMeta