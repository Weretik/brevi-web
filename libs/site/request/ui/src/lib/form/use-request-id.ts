import { useEffect, useState } from 'react';

/**
 * One id for this filled form, made in the browser after hydration (the server render has none), so the same
 * form sent twice is one request. «Надіслати ще одну» starts a new attempt and so a new id.
 */
export function useRequestId() {
  const [id, setId] = useState('');
  useEffect(() => setId(crypto.randomUUID()), []);
  return id;
}
