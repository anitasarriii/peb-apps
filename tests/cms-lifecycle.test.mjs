import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const moduleUrl = (text) =>
    `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`;
const hooks = moduleUrl(`
export function useRef(value) { return {current: value}; }
export function useState(value) { const slot = globalThis.cmsTestState.length; globalThis.cmsTestState.push(value); return [value, value => { globalThis.cmsTestState[slot] = value; }]; }
export function useEffect(callback) { callback(); }
`);
const jsx = moduleUrl(
    'export const jsx = (type, props) => ({type, props}); export const jsxs = jsx; export const Fragment = "fragment";',
);
const inertia = moduleUrl(
    'export const Head = "head"; export const router = {on(name, callback) { globalThis.cmsTestEvents[name] = callback; return () => {}; }};',
);
async function load(file) {
    const source = readFileSync(file, 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
            jsx: ts.JsxEmit.ReactJSX,
        },
    }).outputText;
    return import(
        moduleUrl(
            compiled.replace(
                /from (['"])([^'"]+)\1/g,
                (_, quote, name) =>
                    `from ${JSON.stringify(name === 'react' ? hooks : name === 'react/jsx-runtime' ? jsx : name === '@inertiajs/react' ? inertia : moduleUrl('export const LoaderCircle = () => null; export default () => null;'))}`,
            ),
        )
    );
}

test('CMS request lifecycle rejects duplicate submits, tracks real transfer progress and unlocks after completion', async () => {
    globalThis.cmsTestState = [];
    globalThis.cmsTestEvents = {};
    globalThis.window = {
        location: {
            href: 'http://localhost/panel-admin?tab=Galeri+Foto&mode=create',
        },
    };
    const { default: RequestFeedback } = await load(
        'resources/js/components/panel-admin/request-feedback.tsx',
    );
    RequestFeedback();
    const visit = { method: 'post', headers: {} };
    const event = { detail: { visit } };
    assert.equal(globalThis.cmsTestEvents.before(event), undefined);
    assert.equal(visit.headers['X-Cms-Return-To-List'], '1');
    assert.equal(globalThis.cmsTestEvents.before(event), false);
    globalThis.cmsTestEvents.start(event);
    assert.equal(globalThis.cmsTestState[0], true);
    globalThis.cmsTestEvents.progress({
        detail: { progress: { percentage: 37 } },
    });
    assert.equal(globalThis.cmsTestState[1], 37);
    globalThis.cmsTestEvents.networkError();
    assert.match(globalThis.cmsTestState[2], /belum dapat dikonfirmasi/);
    globalThis.cmsTestEvents.finish(event);
    assert.equal(globalThis.cmsTestState[0], false);
    assert.equal(globalThis.cmsTestState[1], null);
    assert.equal(globalThis.cmsTestEvents.before(event), undefined);
});

test('shared save state also stops on cancelled or failed mutation finish', async () => {
    globalThis.cmsTestState = [];
    globalThis.cmsTestEvents = {};
    const { useCmsSave } = await load('resources/js/hooks/use-cms-save.ts');
    const [, setSaving] = useCmsSave();
    setSaving(true);
    globalThis.cmsTestEvents.finish({ detail: { visit: { method: 'get' } } });
    assert.equal(globalThis.cmsTestState[0], true);
    globalThis.cmsTestEvents.finish({
        detail: { visit: { method: 'post', cancelled: true } },
    });
    assert.equal(globalThis.cmsTestState[0], false);
});

test('policy page renders the stored SEO and Open Graph values', async () => {
    const { default: Kebijakan } = await load(
        'resources/js/pages/kebijakan.tsx',
    );
    const tree = Kebijakan({
        seoMeta: {
            meta_title: 'Kebijakan terbaru',
            meta_description: 'Deskripsi terbaru',
            author: 'PT PEB',
            robots_index: 'noindex',
            robots_follow: 'nofollow',
            og_title: 'Judul OG terbaru',
            og_description: 'Deskripsi OG terbaru',
            og_image: '/storage/seo-og/new-image.jpg',
        },
    });
    const tags = [];
    function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) {
            node.forEach(visit);
            return;
        }
        if (node.type === 'meta') tags.push(node.props);
        visit(node.props?.children);
    }
    visit(tree);
    assert.ok(
        tags.some(
            (tag) =>
                tag.name === 'description' &&
                tag.content === 'Deskripsi terbaru',
        ),
    );
    assert.ok(
        tags.some(
            (tag) =>
                tag.name === 'robots' && tag.content === 'noindex,nofollow',
        ),
    );
    assert.ok(
        tags.some(
            (tag) =>
                tag.property === 'og:title' &&
                tag.content === 'Judul OG terbaru',
        ),
    );
    assert.ok(
        tags.some(
            (tag) =>
                tag.property === 'og:image' &&
                tag.content === '/storage/seo-og/new-image.jpg',
        ),
    );
});

for (const [file, carousel] of [
    ['servis/hero/index.tsx', true],
    ['kebijakan/hero/index.tsx', true],
    ['galeri/hero/index.tsx', true],
    ['pengadaan/hero/index.tsx', true],
    ['portfolio/hero/index.tsx', true],
    ['laporan/hero/index.tsx', true],
    ['galeri/galeri-foto/photo-editor.tsx', false],
    ['servis/daftar-servis/service-card-editor.tsx', false],
    ['laporan/berita-pengumuman/index.tsx', false],
    ['laporan/laporan-keuangan/index.tsx', false],
]) {
    test(`${file} attaches the selected file synchronously without simulated transfer timers`, () => {
        const source = readFileSync(
            `resources/js/components/panel-admin/${file}`,
            'utf8',
        );
        const ast = ts.createSourceFile(
            file,
            source,
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TSX,
        );
        let initializer;
        function visit(node) {
            if (
                ts.isVariableDeclaration(node) &&
                node.name.getText(ast) === 'handleFileChange'
            )
                initializer = node.initializer;
            ts.forEachChild(node, visit);
        }
        visit(ast);
        assert.ok(initializer);
        const js = ts.transpileModule(
            `const handler = ${initializer.getText(ast)};`,
            { compilerOptions: { target: ts.ScriptTarget.ES2022 } },
        ).outputText;
        const changes = [];
        const item = {
            id: 'test',
            imagePreviewUrl: '',
            imageSrc: '',
            imageSourceType: 'upload',
        };
        const scope = new Proxy(
            {
                carouselItems: [item],
                item,
                service: item,
                activeItem: item,
                URL: {
                    createObjectURL: () => 'blob:preview',
                    revokeObjectURL() {},
                },
                updateCarouselItem: (...args) => changes.push(args),
                updateItem: (...args) => changes.push(args),
                onChange: (value) => changes.push(value),
                handleChange: (value) => changes.push(value),
                setUploadProgress() {},
                setUploadingImage() {},
                fileInputRef: { current: null },
                setInterval() {
                    throw new Error('Simulated progress is forbidden');
                },
                setTimeout() {
                    throw new Error('Artificial preview delay is forbidden');
                },
            },
            { has: (target, key) => key in target },
        );
        const handler = new Function(
            'scope',
            `with (scope) { ${js} return handler; }`,
        )(scope);
        const fileObject = {
            name: 'photo.jpg',
            size: 6000000,
            type: 'image/jpeg',
        };
        const event = { target: { files: [fileObject], value: 'photo.jpg' } };
        if (carousel) handler(0, event);
        else handler(event);
        assert.ok(
            changes.some((change) =>
                Array.isArray(change)
                    ? change.includes(fileObject)
                    : Object.values(change).includes(fileObject),
            ),
            'Selected file is present before the handler returns',
        );
    });
}
