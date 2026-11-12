import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\NotificationController::read
 * @see app/Http/Controllers/Settings/NotificationController.php:15
 * @route '/settings/notifications/{notification}/read'
 */
export const read = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

read.definition = {
    methods: ["post"],
    url: '/settings/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\NotificationController::read
 * @see app/Http/Controllers/Settings/NotificationController.php:15
 * @route '/settings/notifications/{notification}/read'
 */
read.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return read.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\NotificationController::read
 * @see app/Http/Controllers/Settings/NotificationController.php:15
 * @route '/settings/notifications/{notification}/read'
 */
read.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\NotificationController::readAll
 * @see app/Http/Controllers/Settings/NotificationController.php:33
 * @route '/settings/notifications/read-all'
 */
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

readAll.definition = {
    methods: ["post"],
    url: '/settings/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\NotificationController::readAll
 * @see app/Http/Controllers/Settings/NotificationController.php:33
 * @route '/settings/notifications/read-all'
 */
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\NotificationController::readAll
 * @see app/Http/Controllers/Settings/NotificationController.php:33
 * @route '/settings/notifications/read-all'
 */
readAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\NotificationController::destroy
 * @see app/Http/Controllers/Settings/NotificationController.php:59
 * @route '/settings/notifications/{notification}'
 */
export const destroy = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/notifications/{notification}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\NotificationController::destroy
 * @see app/Http/Controllers/Settings/NotificationController.php:59
 * @route '/settings/notifications/{notification}'
 */
destroy.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return destroy.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\NotificationController::destroy
 * @see app/Http/Controllers/Settings/NotificationController.php:59
 * @route '/settings/notifications/{notification}'
 */
destroy.delete = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\NotificationController::destroyAll
 * @see app/Http/Controllers/Settings/NotificationController.php:69
 * @route '/settings/notifications'
 */
export const destroyAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

destroyAll.definition = {
    methods: ["delete"],
    url: '/settings/notifications',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\NotificationController::destroyAll
 * @see app/Http/Controllers/Settings/NotificationController.php:69
 * @route '/settings/notifications'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\NotificationController::destroyAll
 * @see app/Http/Controllers/Settings/NotificationController.php:69
 * @route '/settings/notifications'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})
const NotificationController = { read, readAll, destroy, destroyAll }

export default NotificationController