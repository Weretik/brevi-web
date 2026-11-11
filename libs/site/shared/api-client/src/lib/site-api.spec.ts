import { siteApiGet, siteApiPostForm } from './site-api';

const json = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('siteApiGet', () => {
  it('builds the address with a sorted query and skips empty values', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(200, { items: [] }));

    const result = await siteApiGet(
      '/api/public/catalog/products',
      { sectionId: 7, language: 'ru', type: undefined, page: 1 },
      fetchMock,
      'https://api.example.com',
    );

    expect(result).toEqual({ kind: 'ok', data: { items: [] } });
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://api.example.com/api/public/catalog/products?language=ru&page=1&sectionId=7',
    );
  });

  it('maps 404, other statuses, and a network error to typed results', async () => {
    const call = (fetchMock: typeof fetch) =>
      siteApiGet('/api/public/catalog/tree', {}, fetchMock, 'https://api.example.com');

    expect(await call(vi.fn().mockResolvedValue(json(404)))).toEqual({ kind: 'not-found' });
    expect(await call(vi.fn().mockResolvedValue(json(401)))).toEqual({
      kind: 'unavailable',
      status: 401,
    });
    expect(await call(vi.fn().mockRejectedValue(new TypeError('fetch failed')))).toEqual({
      kind: 'unavailable',
    });
  });
});

describe('siteApiPostForm', () => {
  it('posts the form to the public address and reads the answer', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(200, { id: 5 }));
    const body = new FormData();
    body.set('phone', '0504698675');

    const result = await siteApiPostForm(
      '/api/public/site-requests',
      body,
      fetchMock,
      'https://api.example.com',
    );

    expect(result).toEqual({ kind: 'ok', data: { id: 5 } });
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://api.example.com/api/public/site-requests',
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'POST', body });
  });

  it('treats a refused or failed post as unavailable', async () => {
    const call = (fetchMock: typeof fetch) =>
      siteApiPostForm(
        '/api/public/site-requests',
        new FormData(),
        fetchMock,
        'https://api.example.com',
      );

    expect(await call(vi.fn().mockResolvedValue(json(429)))).toEqual({
      kind: 'unavailable',
      status: 429,
    });
    expect(await call(vi.fn().mockRejectedValue(new TypeError('fetch failed')))).toEqual({
      kind: 'unavailable',
    });
  });
});
