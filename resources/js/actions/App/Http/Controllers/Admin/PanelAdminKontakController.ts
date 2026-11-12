import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:13
 * @route '/panel-admin/kontak/hero-section'
 */
export const updateHero = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

updateHero.definition = {
    methods: ["post"],
    url: '/panel-admin/kontak/hero-section',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:13
 * @route '/panel-admin/kontak/hero-section'
 */
updateHero.url = (options?: RouteQueryOptions) => {
    return updateHero.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::updateHero
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:13
 * @route '/panel-admin/kontak/hero-section'
 */
updateHero.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateHero.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::toggleRead
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:104
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}/read'
 */
export const toggleRead = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleRead.url(args, options),
    method: 'patch',
})

toggleRead.definition = {
    methods: ["patch"],
    url: '/panel-admin/kontak/pesan-masuk/{contactMessage}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::toggleRead
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:104
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}/read'
 */
toggleRead.url = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleRead.definition.url
            .replace('{contactMessage}', parsedArgs.contactMessage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::toggleRead
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:104
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}/read'
 */
toggleRead.patch = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleRead.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::markAllRead
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:118
 * @route '/panel-admin/kontak/pesan-masuk/read-all'
 */
export const markAllRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

markAllRead.definition = {
    methods: ["post"],
    url: '/panel-admin/kontak/pesan-masuk/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::markAllRead
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:118
 * @route '/panel-admin/kontak/pesan-masuk/read-all'
 */
markAllRead.url = (options?: RouteQueryOptions) => {
    return markAllRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::markAllRead
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:118
 * @route '/panel-admin/kontak/pesan-masuk/read-all'
 */
markAllRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::destroyMessage
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:128
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}'
 */
export const destroyMessage = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMessage.url(args, options),
    method: 'delete',
})

destroyMessage.definition = {
    methods: ["delete"],
    url: '/panel-admin/kontak/pesan-masuk/{contactMessage}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::destroyMessage
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:128
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}'
 */
destroyMessage.url = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyMessage.definition.url
            .replace('{contactMessage}', parsedArgs.contactMessage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminKontakController::destroyMessage
 * @see app/Http/Controllers/Admin/PanelAdminKontakController.php:128
 * @route '/panel-admin/kontak/pesan-masuk/{contactMessage}'
 */
destroyMessage.delete = (args: { contactMessage: number | { id: number } } | [contactMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMessage.url(args, options),
    method: 'delete',
})
const PanelAdminKontakController = { updateHero, toggleRead, markAllRead, destroyMessage }

export default PanelAdminKontakController