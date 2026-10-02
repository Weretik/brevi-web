import { configureAppConfig } from '@admin/shared/config';
import { AxiosHeaders } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { logRequest } from './api-logging.interceptor';

import type { TimedRequestConfig } from './api-logging.interceptor';

afterEach(() => {
  configureAppConfig({ production: false });
  vi.restoreAllMocks();
});

describe('API logging', () => {
  it('removes query values from development request logs', () => {
    configureAppConfig({ production: false, enableHttpLogs: true });
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const config = {
      headers: new AxiosHeaders(),
      method: 'get',
      url: '/api/products?token=secret',
    } as TimedRequestConfig;

    logRequest(config);

    expect(info).toHaveBeenCalledWith('[Admin API]', 'GET', '/api/products');
    expect(info.mock.calls.flat().join(' ')).not.toContain('secret');
  });
});
