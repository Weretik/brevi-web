import type { TypographyVariantsOptions } from '@mui/material/styles';

export const fontFamily = '"IBM Plex Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/** Numbers, codes, sums, quantities, and dates. Use with `fontVariantNumeric: 'tabular-nums'`. */
export const monoFontFamily = '"IBM Plex Mono", ui-monospace, "Cascadia Mono", Consolas, monospace';

export const typography: TypographyVariantsOptions = {
  fontFamily,
  h1: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontSize: 24, fontWeight: 700, letterSpacing: '-0.015em' },
  h3: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' },
  h4: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' },
  h5: { fontSize: 18, fontWeight: 700 },
  h6: { fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
  subtitle1: { fontSize: 15, fontWeight: 600 },
  subtitle2: { fontSize: 13, fontWeight: 600 },
  body1: { fontSize: 14 },
  body2: { fontSize: 13 },
  button: { fontSize: 14, fontWeight: 700, textTransform: 'none' },
  caption: { fontSize: 12 },
  overline: { fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', lineHeight: 1.6 },
};
