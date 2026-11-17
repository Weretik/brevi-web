import { useRef } from 'react';

/**
 * The `requestId` of one form (idempotency rules, Brevi Web specifics): the same id while the
 * person retries the same values, so a lost answer is replayed by BreviERP instead of saving
 * twice; a new id when the values change or after a success, so an edit is never swallowed by
 * the first saved copy.
 */
export interface RequestIdKeeper {
  /** The id for this attempt; changed values (compared as JSON) start a new attempt. */
  forPayload: (payload: unknown) => string;
  /** Starts a new attempt: call after a success or a conflict. */
  renew: () => void;
}

export function createRequestIdKeeper(
  newId: () => string = () => crypto.randomUUID(),
): RequestIdKeeper {
  let current: { payload: string; id: string } | null = null;
  return {
    forPayload: (payload) => {
      const serialized = JSON.stringify(payload) ?? '';
      if (current?.payload !== serialized) current = { payload: serialized, id: newId() };
      return current.id;
    },
    renew: () => {
      current = null;
    },
  };
}

/** One {@link RequestIdKeeper} for the life of the component; stable across renders. */
export function useRequestId(): RequestIdKeeper {
  const keeper = useRef<RequestIdKeeper | null>(null);
  keeper.current ??= createRequestIdKeeper();
  return keeper.current;
}
