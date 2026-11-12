import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ServisController::index
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/servis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServisController::index
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServisController::index
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServisController::index
 * @see app/Http/Controllers/ServisController.php:17
 * @route '/servis'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ServisController::detail
 * @see app/Http/Controllers/ServisController.php:55
 * @route '/servis/detail'
 */
export const detail = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})

detail.definition = {
    methods: ["get","head"],
    url: '/servis/detail',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServisController::detail
 * @see app/Http/Controllers/ServisController.php:55
 * @route '/servis/detail'
 */
detail.url = (options?: RouteQueryOptions) => {
    return detail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServisController::detail
 * @see app/Http/Controllers/ServisController.php:55
 * @route '/servis/detail'
 */
detail.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServisController::detail
 * @see app/Http/Controllers/ServisController.php:55
 * @route '/servis/detail'
 */
detail.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detail.url(options),
    method: 'head',
})
const ServisController = { index, detail }

export default ServisController