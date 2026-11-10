import { IBM_Plex_Mono, Manrope } from 'next/font/google';

/** Manrope for the interface; IBM Plex Mono for numbers, SKUs, prices, and step labels. Self-hosted by next/font. */
export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});
