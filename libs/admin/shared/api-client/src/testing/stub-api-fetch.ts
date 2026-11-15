import { vi } from 'vitest';

/** What a stub answers: a real `Response`, or the `ok`/`status`/`json` subset that tests usually need. */
export type StubResponse =
  | Response
  | {
      readonly ok?: boolean;
      readonly status?: number;
      readonly json?: () => unknown;
      readonly blob?: () => Promise<Blob> | Blob;
    };

/** The request as tests assert on it: the path with its query string, and the method and text body. */
export type StubHandler = (
  path: string,
  init: { method: string; body?: string; headers: Headers },
) => StubResponse | Promise<StubResponse>;

const emptyStatuses = new Set([204, 205, 304]);

async function toResponse(answer: StubResponse): Promise<Response> {
  if (answer instanceof Response) return answer;
  const status = answer.status ?? (answer.ok === false ? 500 : 200);
  if (emptyStatuses.has(status)) return new Response(null, { status });
  if (answer.blob) return new Response(await answer.blob(), { status });
  const body = answer.json ? await answer.json() : undefined;

  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Replaces the global fetch for one test and returns the handler's mock: every `apiClient` call reaches `handler`
 * with its path (no origin) and init, and its answer becomes a `Response`. Call `vi.unstubAllGlobals()` after the test.
 */
export function stubApiFetch<Handler extends StubHandler>(handler: Handler): Handler {
  vi.stubGlobal('fetch', async (request: Request) => {
    const url = new URL(request.url);
    const body = request.body ? await request.text() : undefined;
    const init = { method: request.method, body, headers: request.headers };

    return toResponse(await handler(`${url.pathname}${url.search}`, init));
  });

  return handler;
}
