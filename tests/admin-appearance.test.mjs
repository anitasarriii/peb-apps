import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

test('compiled admin styles are compact, scoped, and retain visible keyboard focus', () => {
    const manifest = JSON.parse(
        readFileSync('public/build/manifest.json', 'utf8'),
    );
    const stylesheet = manifest['resources/css/app.css'].file;
    const css = readFileSync(path.join('public/build', stylesheet), 'utf8');
    const directory = mkdtempSync(path.join(tmpdir(), 'peb-admin-appearance-'));
    const fixture = path.join(directory, 'appearance.html');
    writeFileSync(
        fixture,
        `<!doctype html><html><head><style>${css}</style></head><body>
        <p id="public" class="text-sm">Public website text</p>
        <div class="admin-typography">
            <p id="body" class="text-sm">Admin text</p>
            <h2 id="heading" class="text-3xl font-black">Admin heading</h2>
            <div id="card" class="rounded-[2.5rem] p-8 shadow-2xl">Card</div>
            <input id="input" class="rounded-2xl py-4 text-sm" value="Form field">
            <label id="label" class="text-[10px]">Field label</label>
            <table><tbody><tr><td id="cell" class="py-5">Table row</td></tr></tbody></table>
            <button id="focus">Save</button>
            <textarea id="textarea" class="w-full resize-none">Text</textarea>
            <div id="editor" contenteditable="true">Editor</div>
            <div class="grid grid-cols-1 xl:grid-cols-12"><div id="form" class="xl:col-span-7">Form</div><div id="preview" class="xl:col-span-5">Live preview</div></div>
        </div><pre id="result"></pre>
        <script>
        const style = (id) => getComputedStyle(document.getElementById(id));
        document.getElementById('focus').focus();
        document.getElementById('result').textContent = JSON.stringify({
            publicFont: parseFloat(style('public').fontSize),
            rootFont: parseFloat(getComputedStyle(document.documentElement).fontSize),
            adminFont: parseFloat(style('body').fontSize),
            heading: parseFloat(style('heading').fontSize),
            inputFont: parseFloat(style('input').fontSize),
            label: parseFloat(style('label').fontSize),
            radius: parseFloat(style('card').borderRadius),
            padding: parseFloat(style('card').paddingTop),
            rowPadding: parseFloat(style('cell').paddingTop),
            focusWidth: parseFloat(style('focus').outlineWidth),
            textareaResize: style('textarea').resize,
            editorResize: style('editor').resize,
            textareaWidth: document.getElementById('textarea').getBoundingClientRect().width,
            viewport: innerWidth,
            formRight: document.getElementById('form').getBoundingClientRect().right,
            previewLeft: document.getElementById('preview').getBoundingClientRect().left,
            previewPosition: style('preview').position,
        });
        </script></body></html>`,
    );
    try {
        const output = execFileSync(
            'C:/Program Files/Google/Chrome/Application/chrome.exe',
            [
                '--headless',
                '--disable-gpu',
                '--window-size=1100,900',
                '--no-first-run',
                '--no-default-browser-check',
                `--user-data-dir=${path.join(directory, 'profile')}`,
                '--dump-dom',
                pathToFileURL(fixture).href,
            ],
            {
                encoding: 'utf8',
                timeout: 30000,
                stdio: ['ignore', 'pipe', 'pipe'],
            },
        );
        const result = JSON.parse(
            output.match(/<pre id="result">([^<]+)<\/pre>/)[1],
        );
        assert.ok(
            result.adminFont < result.publicFont,
            'Admin uses a smaller scale than the public website',
        );
        assert.equal(result.inputFont, result.adminFont);
        assert.equal(result.rootFont, 14);
        assert.equal(result.publicFont, 12.25);
        assert.ok(result.adminFont >= 11 && result.adminFont <= 13);
        assert.ok(result.heading > result.adminFont && result.heading <= 18);
        assert.ok(result.label >= 10);
        assert.ok(result.radius < 20);
        assert.ok(result.padding <= 24);
        assert.ok(result.rowPadding <= 16);
        assert.equal(result.focusWidth, 2);
        assert.equal(result.textareaResize, 'vertical');
        assert.equal(result.editorResize, 'vertical');
        assert.ok(result.textareaWidth <= result.viewport);
        assert.ok(Math.abs(result.formRight - result.previewLeft) < 2);
        assert.equal(result.previewPosition, 'sticky');
    } finally {
        const resolved = path.resolve(directory);
        assert.ok(resolved.startsWith(path.resolve(tmpdir()) + path.sep));
        assert.ok(path.basename(resolved).startsWith('peb-admin-appearance-'));
        rmSync(resolved, {
            recursive: true,
            force: true,
            maxRetries: 4,
            retryDelay: 250,
        });
    }
});
