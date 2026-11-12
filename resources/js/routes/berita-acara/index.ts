import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
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
const beritaAcara = {
    detail: Object.assign(detail, detail),
}

export default beritaAcara