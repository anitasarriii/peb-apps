import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KebijakanController::index
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kebijakan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KebijakanController::index
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KebijakanController::index
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KebijakanController::index
 * @see app/Http/Controllers/KebijakanController.php:14
 * @route '/kebijakan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const KebijakanController = { index }

export default KebijakanController