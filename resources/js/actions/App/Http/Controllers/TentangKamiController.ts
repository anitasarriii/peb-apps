import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TentangKamiController::index
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tentang-kami',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TentangKamiController::index
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TentangKamiController::index
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TentangKamiController::index
 * @see app/Http/Controllers/TentangKamiController.php:18
 * @route '/tentang-kami'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const TentangKamiController = { index }

export default TentangKamiController