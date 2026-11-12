import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::read
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:104
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}/read'
 */
export const read = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

read.definition = {
    methods: ["patch"],
    url: '/panel-admin/kontak/pesan-masuk/{contactMessage}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::read
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:104
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}/read'
 */
read.url = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contactMessage: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { contactMessage: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    contactMessage: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contactMessage: typeof args.contactMessage === 'object'
                ? args.contactMessage.id
                : args.contactMessage,
                }

    return read.definition.url
            .replace('{contactMessage}', parsedArgs.contactMessage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::read
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:104
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}/read'
 */
read.patch = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::readAll
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:118
 * @route '/panel-admin/kontak/pesan-masuk/read-all'
 */
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

readAll.definition = {
    methods: ["post"],
    url: '/panel-admin/kontak/pesan-masuk/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::readAll
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:118
 * @route '/panel-admin/kontak/pesan-masuk/read-all'
 */
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::readAll
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:118
 * @route '/panel-admin/kontak/pesan-masuk/read-all'
 */
readAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::destroy
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:128
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}'
 */
export const destroy = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/panel-admin/kontak/pesan-masuk/{contactMessage}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::destroy
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:128
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}'
 */
destroy.url = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contactMessage: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { contactMessage: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    contactMessage: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        contactMessage: typeof args.contactMessage === 'object'
                ? args.contactMessage.id
                : args.contactMessage,
                }

    return destroy.definition.url
            .replace('{contactMessage}', parsedArgs.contactMessage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::destroy
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:128
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}'
 */
destroy.delete = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const pesanMasuk = {
    read: Object.assign(read, read),
readAll: Object.assign(readAll, readAll),
destroy: Object.assign(destroy, destroy),
}

export default pesanMasuk