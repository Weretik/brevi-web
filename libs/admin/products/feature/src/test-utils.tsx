import { AdminApiProvider, resetAdminApiState } from '@admin/shared/api-client';
import { configureApiEnvironment } from '@admin/shared/config';
import { render as testingLibraryRender } from '@testing-library/react';

import type { RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';

export function resetAdminApi(): void {
  resetAdminApiState();
}

function adaptStubbedFetch(): void {
  const testFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const response = await (input instanceof Request && init === undefined
      ? testFetch(`${new URL(input.url).pathname}${new URL(input.url).search}`, {
          method: input.method,
        })
      : testFetch(input, init));
    if (response instanceof Response) return response;
    const responseLike = response as unknown as {
      status?: number;
      ok?: boolean;
      json?: () => Promise<unknown>;
    };
    const status =
      responseLike.ok === false
        ? (responseLike.status ?? 500)
        : responseLike.ok === true
          ? responseLike.status && responseLike.status < 400
            ? responseLike.status
            : 200
          : (responseLike.status ?? 200);
    const payload = status === 204 || !responseLike.json ? null : await responseLike.json();
    return new Response(payload === null ? null : JSON.stringify(payload), {
      status,
      headers: payload === null ? undefined : { 'Content-Type': 'application/json' },
    });
  };
}

export function render(ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) {
  configureApiEnvironment({ production: true, api: { baseUrl: 'http://localhost' } });
  resetAdminApi();
  adaptStubbedFetch();
  return testingLibraryRender(ui, { wrapper: AdminApiProvider, ...options });
}
