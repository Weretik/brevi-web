import { notFound } from 'next/navigation';

/**
 * Unknown paths under a locale (`/uk/no-such-page`) get the 404 inside the site frame from `[locale]/not-found.tsx`
 * instead of the bare `global-not-found.tsx`, so the visitor keeps the menu and the phone.
 */
export default function UnknownPage() {
  notFound();
}
