import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const directory = mkdtempSync(path.join(tmpdir(), 'peb-responsive-'));
const chrome = spawn(
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    [
        '--headless',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--no-first-run',
        '--remote-debugging-port=0',
        `--user-data-dir=${directory}`,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
);
let socket;
try {
    const endpoint = await new Promise((resolve, reject) => {
        let output = '';
        const timer = setTimeout(
            () => reject(new Error('Chrome startup timeout')),
            20000,
        );
        chrome.stderr.on('data', (chunk) => {
            output += chunk;
            const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
            if (match) {
                clearTimeout(timer);
                resolve(match[1]);
            }
        });
        chrome.on('error', reject);
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve) =>
        socket.addEventListener('open', resolve, { once: true }),
    );
    let nextId = 0;
    const pending = new Map();
    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            const { resolve, reject, timer } = pending.get(message.id);
            pending.delete(message.id);
            clearTimeout(timer);
            message.error
                ? reject(new Error(JSON.stringify(message.error)))
                : resolve(message.result);
        }
    });
    const call = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const id = ++nextId;
            const timer = setTimeout(() => {
                pending.delete(id);
                reject(new Error(`${method} timeout`));
            }, 30000);
            pending.set(id, { resolve, reject, timer });
            socket.send(JSON.stringify({ id, method, params, sessionId }));
        });
    const failures = [];
    await Promise.all(
        [360, 768, 1440].map(async (width) => {
            const { targetId } = await call('Target.createTarget', {
                url: 'about:blank',
            });
            const { sessionId } = await call('Target.attachToTarget', {
                targetId,
                flatten: true,
            });
            await call(
                'Emulation.setDeviceMetricsOverride',
                {
                    width,
                    height: 900,
                    deviceScaleFactor: 1,
                    mobile: width < 640,
                },
                sessionId,
            );
            for (const route of [
                '/',
                '/tentang-kami',
                '/servis',
                '/kebijakan',
                '/galeri',
                '/portfolio',
                '/pengadaan',
                '/laporan',
                '/berita-acara',
                '/kontak',
                '/login',
            ]) {
                await call(
                    'Page.navigate',
                    { url: `http://127.0.0.1:8000${route}` },
                    sessionId,
                );
                let result;
                for (let attempt = 0; attempt < 15; attempt++) {
                    result = await call(
                        'Runtime.evaluate',
                        {
                            expression: `new Promise(resolve => setTimeout(() => resolve({width: innerWidth, scroll: document.documentElement.scrollWidth, mounted: location.pathname === ${JSON.stringify(route)} && !!document.querySelector('#app')?.children.length, offenders: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 2 && getComputedStyle(e).position !== 'fixed').slice(0,5).map(e=>e.tagName+'.'+e.className)}), 1000))`,
                            awaitPromise: true,
                            returnByValue: true,
                        },
                        sessionId,
                    );
                    if (result.result.value?.mounted) break;
                }
                const value = result.result.value;
                console.log(`${width} ${route}: ${JSON.stringify(value)}`);
                if (!value.mounted || value.scroll > value.width + 2)
                    failures.push({ width, route, ...value });
                if (route === '/portfolio') {
                    const popup = await call(
                        'Runtime.evaluate',
                        {
                            expression: `new Promise(resolve => { const card = document.querySelector('[aria-label^="Lihat detail "]'); if (!card) { resolve({error:'Project card missing'}); return; } card.click(); setTimeout(() => { const dialog = document.querySelector('[role="dialog"][aria-modal="true"]'); const result = dialog ? {width: dialog.clientWidth, scroll: dialog.scrollWidth, right: dialog.getBoundingClientRect().right, viewport: innerWidth, locked: document.body.style.overflow === 'hidden'} : {error:'Popup missing'}; document.querySelector('[aria-label="Tutup detail proyek"]')?.click(); resolve(result); }, 700); })`,
                            awaitPromise: true,
                            returnByValue: true,
                        },
                        sessionId,
                    );
                    const modal = popup.result.value;
                    console.log(
                        `${width} portfolio popup: ${JSON.stringify(modal)}`,
                    );
                    if (
                        modal.error ||
                        modal.scroll > modal.width + 1 ||
                        modal.right > modal.viewport ||
                        !modal.locked
                    )
                        failures.push({ width, popup: modal });
                }
            }
            await call('Target.closeTarget', { targetId });
        }),
    );
    assert.deepEqual(
        failures,
        [],
        'Public pages must mount without horizontal document overflow',
    );
    console.log('PASS: 33 responsive page checks');
} finally {
    socket?.close();
    chrome.kill();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    assert.ok(
        path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep),
    );
    rmSync(directory, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 300,
    });
}
