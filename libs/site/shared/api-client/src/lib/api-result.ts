/** Outcome of a server-side API read, so a caller can map it to `notFound()` or to an empty state. */
export type ApiResult =
  { kind: 'ok'; data: unknown } | { kind: 'not-found' } | { kind: 'unavailable'; status?: number };
