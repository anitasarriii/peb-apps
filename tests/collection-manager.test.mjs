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
const mocks = {
    inertia: moduleUrl(`import { createElement } from '${reactUrl}';
        export const usePage = () => ({url: globalThis.collectionTestUrl});
        export const router = { on: () => () => {}, visit() {}, post() {} };
        export const Link = ({children, ...props}) => createElement('a', props, children);`),
    routes: moduleUrl(`const route = () => ({});
        route.url = ({query} = {}) => '/panel-admin' + (query ? '?' + new URLSearchParams(query) : '');
        export {route as index, route as update};`),
    icons: moduleUrl(`export const ArrowLeft = () => null;
        export const Pencil = ArrowLeft, Plus = ArrowLeft, Search = ArrowLeft, Trash2 = ArrowLeft;`),
    editor: moduleUrl(`import { createElement } from '${reactUrl}';
        export default function Editor(props) {
            globalThis.collectionEditorProps = props;
            return createElement('form', {'data-record-form': true});
        }`),
};
const source = await readFile(
    new URL(
        '../resources/js/components/panel-admin/collection-manager.tsx',
        import.meta.url,
    ),
    'utf8',
);
const compiled = ts
    .transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            jsx: ts.JsxEmit.ReactJSX,
            target: ts.ScriptTarget.ES2022,
        },
    })
    .outputText.replace(/from (['"])([^'"]+)\1/g, (match, quote, name) => {
        const target =
            name === '@inertiajs/react'
                ? mocks.inertia
                : name === 'lucide-react'
                  ? mocks.icons
                  : name.startsWith('@/routes/')
                    ? mocks.routes
                    : name.startsWith('./')
                      ? mocks.editor
                      : pathToFileURL(require.resolve(name)).href;
        return `from ${JSON.stringify(target)}`;
    });
const { default: CollectionManager } = await import(moduleUrl(compiled));
const records = Array.from({ length: 12 }, (_, index) => ({
    id: String(index),
    title: `Data ${index}`,
    category: 'Kategori',
    gallery: [],
    poinUtamaList: [],
    dokumenList: [],
}));

for (const kind of ['gallery', 'finance', 'news', 'portfolio', 'annual']) {
    test(`${kind} displays a paginated table and links to separate forms`, () => {
        globalThis.collectionTestUrl = '/panel-admin';
        const section =
            kind === 'annual'
                ? { annual_reports: records, keberlanjutan_items: [] }
                : { items: records };
        const html = renderToStaticMarkup(
            createElement(CollectionManager, { kind, section }),
        );
        assert.match(html, /<table/);
        assert.equal((html.match(/<tbody.*?<tr/g) ?? []).length, 1);
        assert.equal((html.match(/aria-label="Edit /g) ?? []).length, 10);
        assert.match(html, /mode=create/);
        assert.match(html, /mode=edit/);
        assert.doesNotMatch(html, /data-record-form/);
    });

    test(`${kind} opens the selected form without dropping other records`, () => {
        globalThis.collectionTestUrl = '/panel-admin?mode=edit&record=5';
        const section =
            kind === 'annual'
                ? { annual_reports: records, keberlanjutan_items: [] }
                : { items: records };
        const html = renderToStaticMarkup(
            createElement(CollectionManager, { kind, section }),
        );
        assert.match(html, /data-record-form/);
        assert.doesNotMatch(html, /<table/);
        assert.equal(globalThis.collectionEditorProps.selectedId, '5');
        const payload = Object.values(globalThis.collectionEditorProps).find(
            (value) => value && typeof value === 'object',
        );
        assert.equal((payload.items ?? payload.annual_reports).length, 12);
    });

    test(`${kind} opens a blank draft and leaves original data intact`, () => {
        globalThis.collectionTestUrl = '/panel-admin?mode=create';
        const section =
            kind === 'annual'
                ? { annual_reports: records, keberlanjutan_items: [] }
                : { items: records };
        renderToStaticMarkup(
            createElement(CollectionManager, { kind, section }),
        );
        const payload = Object.values(globalThis.collectionEditorProps).find(
            (value) => value && typeof value === 'object',
        );
        const items = payload.items ?? payload.annual_reports;
        assert.equal(items.length, 13);
        assert.equal(items.at(-1).title, '');
        assert.equal(records.length, 12);
    });
}

test('sustainability form preserves annual reports', () => {
    globalThis.collectionTestUrl =
        '/panel-admin?mode=create&collection=keberlanjutan_items';
    renderToStaticMarkup(
        createElement(CollectionManager, {
            kind: 'annual',
            section: { annual_reports: records, keberlanjutan_items: [] },
        }),
    );
    const props = globalThis.collectionEditorProps;
    assert.equal(props.selectedCollection, 'keberlanjutan_items');
    assert.equal(props.laporanTahunanSection.annual_reports.length, 12);
    assert.equal(props.laporanTahunanSection.keberlanjutan_items.length, 1);
});

test('empty lists and missing edit targets have usable empty states', () => {
    globalThis.collectionTestUrl = '/panel-admin';
    assert.match(
        renderToStaticMarkup(
            createElement(CollectionManager, {
                kind: 'gallery',
                section: { items: [] },
            }),
        ),
        /Belum ada data/,
    );
    globalThis.collectionTestUrl = '/panel-admin?mode=edit&record=missing';
    assert.match(
        renderToStaticMarkup(
            createElement(CollectionManager, {
                kind: 'gallery',
                section: { items: [] },
            }),
        ),
        /Data tidak ditemukan/,
    );
});
