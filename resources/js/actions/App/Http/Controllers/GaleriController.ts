import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GaleriController::index
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/galeri',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GaleriController::index
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GaleriController::index
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GaleriController::index
 * @see app/Http/Controllers/GaleriController.php:14
 * @route '/galeri'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const GaleriController = { index }

export default GaleriController