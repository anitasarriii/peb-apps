import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import preferences from './preferences'
import beranda from './beranda'
import ctaSection from './cta-section'
import footer from './footer'
import header from './header'
import tentang from './tentang'
import servis from './servis'
import kebijakan from './kebijakan'
import galeri from './galeri'
import portfolio from './portfolio'
import laporan from './laporan'
import berita from './berita'
import pengadaan from './pengadaan'
import kontak from './kontak'
import seoMeta from './seo-meta'
import users from './users'
import roles from './roles'
/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/panel-admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PanelAdminController::index
 * @see app/Http/Controllers/Admin/PanelAdminController.php:46
 * @route '/panel-admin'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const panelAdmin = {
    index: Object.assign(index, index),
preferences: Object.assign(preferences, preferences),
beranda: Object.assign(beranda, beranda),
ctaSection: Object.assign(ctaSection, ctaSection),
footer: Object.assign(footer, footer),
header: Object.assign(header, header),
tentang: Object.assign(tentang, tentang),
servis: Object.assign(servis, servis),
kebijakan: Object.assign(kebijakan, kebijakan),
galeri: Object.assign(galeri, galeri),
portfolio: Object.assign(portfolio, portfolio),
laporan: Object.assign(laporan, laporan),
berita: Object.assign(berita, berita),
pengadaan: Object.assign(pengadaan, pengadaan),
kontak: Object.assign(kontak, kontak),
seoMeta: Object.assign(seoMeta, seoMeta),
users: Object.assign(users, users),
roles: Object.assign(roles, roles),
}

export default panelAdmin