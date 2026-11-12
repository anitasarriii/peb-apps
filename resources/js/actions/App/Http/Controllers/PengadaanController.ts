import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PengadaanController::index
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pengadaan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PengadaanController::index
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PengadaanController::index
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PengadaanController::index
 * @see app/Http/Controllers/PengadaanController.php:15
 * @route '/pengadaan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

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
const PengadaanController = { index, detail }

export default PengadaanController