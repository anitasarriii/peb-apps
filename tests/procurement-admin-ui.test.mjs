import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const moduleUrl = (source) =>
    `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const reactUrl = pathToFileURL(require.resolve('react')).href;
const inertia = moduleUrl(
    `import { createElement } from '${reactUrl}'; export const usePage = () => ({props:{auth:{user:{name:'Procurement Test',role:globalThis.procurementTestRole}},notifications:[]}}); export const router = {post(){}}; export const Link = ({children,...props}) => createElement('a',props,children);`,
);
const utils = moduleUrl(
    `export const cn = (...values) => values.filter(Boolean).join(' ');`,
);
const wrapper = moduleUrl(
    `export default function Wrapper({children}) {return children ?? null;}`,
);
async function load(relative) {
    const source = await readFile(
        new URL(`../resources/js/${relative}`, import.meta.url),
        'utf8',
    );
    const imports = source.match(
        /import\s*\{([^}]+)\}\s*from ['"]lucide-react['"]/,
    );
    const icons = moduleUrl(
        `import {createElement} from '${reactUrl}'; ${
            imports
                ? imports[1]
                      .split(',')
                      .map((name) => name.trim())
                      .filter(Boolean)
                      .map(
                          (name) =>
                              `export const ${name} = () => createElement('i',{'data-icon':'${name}'});`,
                      )
                      .join('\n')
                : ''
        }`,
    );
    const types = moduleUrl(
        `export const STATUS_STYLE = {TERBUKA:'',TUTUP:'',SELEKSI:''}; export const STATUS_OPTIONS = ['TERBUKA','SELEKSI','TUTUP'];`,
    );
    const compiled = ts
        .transpileModule(source, {
            compilerOptions: {
                module: ts.ModuleKind.ESNext,
                jsx: ts.JsxEmit.ReactJSX,
                target: ts.ScriptTarget.ES2022,
            },
        })
        .outputText.replace(
            /from (['"])([^'"]+)\1/g,
            (match, quote, name) =>
                `from ${JSON.stringify(name === '@inertiajs/react' ? inertia : name === 'lucide-react' ? icons : name === '@/lib/utils' ? utils : name.endsWith('/types') ? types : name.startsWith('@/') || name.startsWith('./') ? wrapper : pathToFileURL(require.resolve(name)).href)}`,
        );
    return (await import(moduleUrl(compiled))).default;
}
const Sidebar = await load('components/panel-admin/admin-sidebar.tsx');
const Header = await load('components/panel-admin/admin-header.tsx');
const Table = await load(
    'components/panel-admin/pengadaan/daftar-pengadaan/components/ProcurementTable.tsx',
);
const Editor = await load(
    'components/panel-admin/pengadaan/daftar-pengadaan/components/ActiveItemEditor.tsx',
);
const Dashboard = await load('components/panel-admin/admin-dashboard.tsx');

test('procurement editor refreshes its initial state when server data arrives or changes', () => {
    const content = (section) =>
        Dashboard({
            activeTab: 'Daftar Pengadaan',
            recentProjects: [],
            pageProps: { daftarPengadaan: section },
        }).props.children.at(-1);
    const initial = content(undefined);
    const section = {
        id: 1,
        updated_at: '2026-11-03T10:00:00Z',
        items: Array.from({ length: 41 }, (_, index) => ({
            id: String(index),
            isArchived: index >= 3,
        })),
    };
    const loaded = content(section);
    const refreshed = content({
        ...section,
        updated_at: '2026-11-03T10:01:00Z',
    });
    assert.notEqual(initial.key, loaded.key);
    assert.notEqual(loaded.key, refreshed.key);
    assert.equal(loaded.props.daftarPengadaan.items.length, 41);
    assert.equal(
        loaded.props.daftarPengadaan.items.filter((item) => item.isArchived)
            .length,
        38,
    );
});
const noop = () => {};
const menuItems = [
    { name: 'Dashboard', icon: noop, permission: 'view_dashboard' },
    {
        name: 'Pengadaan',
        icon: noop,
        permission: 'manage_procurement',
        children: [
            { name: 'Hero Pengadaan' },
            { name: 'Daftar Pengadaan' },
            { name: 'SEO Pengadaan' },
        ],
    },
    {
        name: 'Master Data',
        icon: noop,
        children: [
            { name: 'Data User', permission: 'manage_users' },
            { name: 'Data Role', permission: 'manage_roles' },
        ],
    },
];
test('procurement sidebar contains only procurement list and logout even with broad permission flags', () => {
    globalThis.procurementTestRole = {
        name: 'admin_pengadaan',
        label: 'Admin Pengadaan',
        permissions: {
            view_dashboard: true,
            manage_procurement: true,
            manage_users: true,
            manage_roles: true,
        },
    };
    const html = renderToStaticMarkup(
        createElement(Sidebar, {
            sidebarOpen: true,
            setSidebarOpen: noop,
            activeTab: 'Daftar Pengadaan',
            setActiveTab: noop,
            openDropdowns: { Pengadaan: true },
            toggleDropdown: noop,
            menuItems,
        }),
    );
    assert.match(html, /Daftar Pengadaan/);
    assert.match(html, /Keluar/);
    assert.match(html, /Admin Pengadaan/);
    for (const label of [
        'Dashboard',
        'Hero Pengadaan',
        'SEO Pengadaan',
        'Data User',
        'Data Role',
        'Lihat Profil',
    ])
        assert.ok(!html.includes(label), label);
    const header = renderToStaticMarkup(
        createElement(Header, {
            sidebarOpen: true,
            setSidebarOpen: noop,
            isDark: false,
            onToggleDark: noop,
        }),
    );
    assert.doesNotMatch(header, /data-icon="Bell"/);
});
test('super admin retains normal navigation and notification actions', () => {
    globalThis.procurementTestRole = { name: 'super_admin' };
    const html = renderToStaticMarkup(
        createElement(Sidebar, {
            sidebarOpen: true,
            setSidebarOpen: noop,
            activeTab: 'Dashboard',
            setActiveTab: noop,
            openDropdowns: { 'Master Data': true },
            toggleDropdown: noop,
            menuItems,
        }),
    );
    assert.match(html, /Dashboard/);
    assert.match(html, /Data User/);
    assert.match(html, /Data Role/);
    const header = renderToStaticMarkup(
        createElement(Header, {
            sidebarOpen: true,
            setSidebarOpen: noop,
            isDark: false,
            onToggleDark: noop,
        }),
    );
    assert.match(header, /data-icon="Bell"/);
});
test('last procurement record remains deletable and empty tables retain the add action', () => {
    const props = {
        items: [
            {
                id: 'one',
                title: 'Last tender',
                status: 'TERBUKA',
                category: 'Jasa',
                location: 'Batam',
            },
        ],
        onAdd: noop,
        onEdit: noop,
        onDelete: noop,
        disabled: false,
    };
    const html = renderToStaticMarkup(createElement(Table, props));
    const button = html.match(
        /<button[^>]*aria-label="Hapus Last tender"[^>]*>/,
    )?.[0];
    assert.ok(button);
    assert.doesNotMatch(button, /\sdisabled(?:=|\s|>)/);
    const empty = renderToStaticMarkup(
        createElement(Table, { ...props, items: [] }),
    );
    assert.match(empty, /Tambah/);
    assert.match(empty, /<table/);
});
test('procurement form exposes the existing archive flag', () => {
    const html = renderToStaticMarkup(
        createElement(Editor, {
            activeItem: {
                id: 'one',
                title: 'Tender',
                category: 'Jasa',
                status: 'TERBUKA',
                isArchived: true,
            },
            categories: ['Jasa'],
            handleChange: noop,
            activeSyaratList: [],
            activeDokumenList: [],
            fileInputRef: { current: null },
            fileRefs: { current: {} },
        }),
    );
    assert.match(html, /Arsipkan pengadaan ini/);
    assert.match(html, /type="checkbox"[^>]*checked/);
});
