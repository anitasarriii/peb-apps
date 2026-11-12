import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
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
const kontak = {
    store: Object.assign(store, store),
}

export default kontak