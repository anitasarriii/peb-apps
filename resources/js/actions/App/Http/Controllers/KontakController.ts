import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KontakController::index
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kontak',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KontakController::index
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KontakController::index
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KontakController::index
 * @see app/Http/Controllers/KontakController.php:21
 * @route '/kontak'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KontakController::store
 * @see app/Http/Controllers/KontakController.php:35
 * @route '/kontak'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kontak',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KontakController::store
 * @see app/Http/Controllers/KontakController.php:35
 * @route '/kontak'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KontakController::store
 * @see app/Http/Controllers/KontakController.php:35
 * @route '/kontak'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const KontakController = { index, store }

export default KontakController