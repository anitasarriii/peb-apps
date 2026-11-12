import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LaporanController::index
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/laporan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanController::index
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanController::index
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LaporanController::index
 * @see app/Http/Controllers/LaporanController.php:15
 * @route '/laporan'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanController::detail
 * @see app/Http/Controllers/LaporanController.php:54
 * @route '/laporan/detail'
 */
export const detail = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})

detail.definition = {
    methods: ["get","head"],
    url: '/laporan/detail',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanController::detail
 * @see app/Http/Controllers/LaporanController.php:54
 * @route '/laporan/detail'
 */
detail.url = (options?: RouteQueryOptions) => {
    return detail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanController::detail
 * @see app/Http/Controllers/LaporanController.php:54
 * @route '/laporan/detail'
 */
detail.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LaporanController::detail
 * @see app/Http/Controllers/LaporanController.php:54
 * @route '/laporan/detail'
 */
detail.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detail.url(options),
    method: 'head',
})
const LaporanController = { index, detail }

export default LaporanController