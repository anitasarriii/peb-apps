import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BeritaAcaraController::index
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/berita-acara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BeritaAcaraController::index
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BeritaAcaraController::index
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BeritaAcaraController::index
 * @see app/Http/Controllers/BeritaAcaraController.php:14
 * @route '/berita-acara'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BeritaAcaraController::detail
 * @see app/Http/Controllers/BeritaAcaraController.php:27
 * @route '/berita-acara/detail'
 */
export const detail = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})

detail.definition = {
    methods: ["get","head"],
    url: '/berita-acara/detail',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BeritaAcaraController::detail
 * @see app/Http/Controllers/BeritaAcaraController.php:27
 * @route '/berita-acara/detail'
 */
detail.url = (options?: RouteQueryOptions) => {
    return detail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BeritaAcaraController::detail
 * @see app/Http/Controllers/BeritaAcaraController.php:27
 * @route '/berita-acara/detail'
 */
detail.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BeritaAcaraController::detail
 * @see app/Http/Controllers/BeritaAcaraController.php:27
 * @route '/berita-acara/detail'
 */
detail.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detail.url(options),
    method: 'head',
})
const BeritaAcaraController = { index, detail }

export default BeritaAcaraController