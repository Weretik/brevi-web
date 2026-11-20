/** Pauses before the 2nd and 3rd attempt; short, so a page waits well under a second for a brief API hiccup. */
export const RETRY_DELAYS_MS = [150, 450] as const;

type Fetch = typeof fetch;

/** A brief failure worth repeating: a busy or restarting API (429, 5xx), not an answer about the data. */
const isTransientStatus = (status: number) => status === 429 || status >= 500;

const isTimeout = (error: unknown) =>
  error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError');

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * A public GET that repeats a brief failure, so one dropped connection or a Cloud Run instance that is starting
 * or being replaced during a deploy does not turn into an error page. Each attempt has its own timeout; a timeout
 * is not repeated, because the visitor has already waited for it. Only safe reads go through here.
 */
export async function getWithRetry(
  fetchImpl: Fetch,
  url: URL,
  headers: HeadersInit,
  timeoutMs: number,
  delaysMs: readonly number[] = RETRY_DELAYS_MS,
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const isLast = attempt >= delaysMs.length;
    try {
      const response = await fetchImpl(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (isLast || !isTransientStatus(response.status)) return response;
      // Release the connection of the discarded answer before the next attempt.
      await response.body?.cancel();
    } catch (error) {
      if (isLast || isTimeout(error)) throw error;
    }
    await pause(delaysMs[attempt]);
  }
}
