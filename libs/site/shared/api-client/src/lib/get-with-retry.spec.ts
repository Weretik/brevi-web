import { getWithRetry } from './get-with-retry';

const URL_ = new URL('https://api.example.com/api/public/catalog/categories');
const NO_DELAYS = [0, 0];

const respond = (status: number) => new Response('{}', { status });
const call = (fetchMock: typeof fetch) =>
  getWithRetry(fetchMock, URL_, { Accept: 'application/json' }, 1000, NO_DELAYS);

describe('getWithRetry', () => {
  it('returns the first answer that is not a brief failure', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respond(503))
      .mockResolvedValueOnce(respond(200));

    const response = await call(fetchMock);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('repeats a dropped connection and a busy API', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Network connection lost.'))
      .mockResolvedValueOnce(respond(429))
      .mockResolvedValueOnce(respond(200));

    expect((await call(fetchMock)).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('gives up after three attempts with the last answer or error', async () => {
    const failing = vi.fn().mockImplementation(async () => respond(502));
    expect((await call(failing)).status).toBe(502);
    expect(failing).toHaveBeenCalledTimes(3);

    const offline = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    await expect(call(offline)).rejects.toThrow('fetch failed');
    expect(offline).toHaveBeenCalledTimes(3);
  });

  it('does not repeat answers about the data or a timeout', async () => {
    for (const status of [200, 404, 410]) {
      const fetchMock = vi.fn().mockResolvedValue(respond(status));
      expect((await call(fetchMock)).status).toBe(status);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }

    const slow = vi
      .fn()
      .mockRejectedValue(new DOMException('The operation timed out.', 'TimeoutError'));
    await expect(call(slow)).rejects.toThrow('timed out');
    expect(slow).toHaveBeenCalledTimes(1);
  });
});
