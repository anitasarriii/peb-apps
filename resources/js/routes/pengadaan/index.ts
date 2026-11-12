import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PengadaanController::detail
 * @see app/Http/Controllers/PengadaanController.php:54
 * @route '/pengadaan/detail'
 */
export const detail = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})

detail.definition = {
    methods: ["get","head"],
    url: '/pengadaan/detail',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PengadaanController::detail
 * @see app/Http/Controllers/PengadaanController.php:54
 * @route '/pengadaan/detail'
 */
detail.url = (options?: RouteQueryOptions) => {
    return detail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengadaanController::detail
 * @see app/Http/Controllers/PengadaanController.php:54
 * @route '/pengadaan/detail'
 */
detail.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PengadaanController::detail
 * @see app/Http/Controllers/PengadaanController.php:54
 * @route '/pengadaan/detail'
 */
detail.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detail.url(options),
    method: 'head',
})
const pengadaan = {
    detail: Object.assign(detail, detail),
}

export default pengadaan