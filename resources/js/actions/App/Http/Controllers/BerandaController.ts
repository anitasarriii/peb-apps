import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
const index980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

index980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return index980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
const index48fee47d5a045c05229f0e377fbd8a66 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index48fee47d5a045c05229f0e377fbd8a66.url(options),
    method: 'get',
})

index48fee47d5a045c05229f0e377fbd8a66.definition = {
    methods: ["get","head"],
    url: '/beranda',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
index48fee47d5a045c05229f0e377fbd8a66.url = (options?: RouteQueryOptions) => {
    return index48fee47d5a045c05229f0e377fbd8a66.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
index48fee47d5a045c05229f0e377fbd8a66.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index48fee47d5a045c05229f0e377fbd8a66.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BerandaController::index
 * @see app/Http/Controllers/BerandaController.php:21
 * @route '/beranda'
 */
index48fee47d5a045c05229f0e377fbd8a66.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index48fee47d5a045c05229f0e377fbd8a66.url(options),
    method: 'head',
})

export const index = {
    '/': index980bb49ee7ae63891f1d891d2fbcf1c9,
    '/beranda': index48fee47d5a045c05229f0e377fbd8a66,
}

const BerandaController = { index }

export default BerandaController