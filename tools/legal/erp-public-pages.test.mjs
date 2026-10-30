import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

let server;
let origin;
before(async () => {
  server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL('../../apps/admin-react/', import.meta.url)),
    server: { host: '127.0.0.1', port: 0 },
    logLevel: 'silent',
  });
  await server.listen();
  origin = `http://127.0.0.1:${server.httpServer.address().port}`;
});
after(async () => {
  await server?.close();
});

for (const page of ['index', 'privacy', 'terms']) {
  test(`anonymous ${page} document is complete without ERP authentication or JavaScript`, async () => {
    const response = await fetch(`${origin}/brevi-erp/${page}.html`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    assert.match(html, /<html lang="uk">/);
    assert.match(html, /<h1>/);
    assert.match(html, /pp\.brevi@gmail\.com/);
    assert.doesNotMatch(html, /<script/i);
    for (const target of ['index.html', 'privacy.html', 'terms.html', 'legal.css']) {
      assert.ok(html.includes(`href="${target}"`), `${page} links to ${target}`);
      const linked = await fetch(new URL(target, response.url));
      assert.equal(linked.status, 200);
      if (target.endsWith('.css')) assert.match(linked.headers.get('content-type'), /text\/css/);
      else assert.match(await linked.text(), /<h1>/);
    }
  });
}

test('privacy discloses server processing, Google permissions, revocation and Limited Use', async () => {
  const html = await (await fetch(`${origin}/brevi-erp/privacy.html`)).text();
  for (const disclosure of [
    'gmail.send',
    'openid',
    'email',
    'Limited Use',
    'PDF',
    'myaccount.google.com/connections',
    'сервер',
    'видален',
    'зберіга',
  ]) {
    assert.ok(html.includes(disclosure), `missing privacy disclosure: ${disclosure}`);
  }
});
