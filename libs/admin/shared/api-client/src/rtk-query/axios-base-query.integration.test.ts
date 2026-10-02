import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { axiosBaseQuery } from './axios-base-query';

import type { BaseQueryApi } from '@reduxjs/toolkit/query';

const queryApi = (signal: AbortSignal): BaseQueryApi => ({ signal }) as BaseQueryApi;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('axiosBaseQuery', () => {
  it('uses the configured base URL through the Axios fetch adapter', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test/' } });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ value: 1 }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetcher);

    const result = await axiosBaseQuery(
      { url: '/api/example' },
      queryApi(new AbortController().signal),
      {},
    );

    expect(result).toEqual({ data: { value: 1 } });
    expect((fetcher.mock.calls[0]?.[0] as Request).url).toBe('https://api.brevi.test/api/example');
  });

  it('passes RTK Query cancellation to the underlying request', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'https://api.brevi.test' } });
    let observeRequest!: (request: Request) => void;
    const requestObserved = new Promise<Request>((resolve) => {
      observeRequest = resolve;
    });
    const fetcher = vi.fn((input: RequestInfo | URL) => {
      const request = input as Request;
      observeRequest(request);
      return new Promise<Response>((_resolve, reject) => {
        request.signal.addEventListener('abort', () =>
          reject(new DOMException('Aborted', 'AbortError')),
        );
      });
    });
    vi.stubGlobal('fetch', fetcher);
    const controller = new AbortController();

    const resultPromise = axiosBaseQuery({ url: '/api/example' }, queryApi(controller.signal), {});
    const request = await requestObserved;
    controller.abort();
    const result = await resultPromise;

    expect(result).toHaveProperty('error.code', 'Network');
    expect(request.signal.aborted).toBe(true);
  });
});
