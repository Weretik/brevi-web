import type { SxProps, Theme } from '@mui/material';

/** Outlines the preview part of the field in focus; `paths` are exact paths or prefixes ending with «.» or «:». */
export function previewHighlight(focused: string | null, ...paths: string[]): SxProps<Theme> {
  const on =
    focused !== null &&
    paths.some((path) =>
      path.endsWith('.') || path.endsWith(':') ? focused.startsWith(path) : focused === path,
    );
  return on
    ? {
        outline: 2,
        outlineColor: 'primary.main',
        outlineOffset: 2,
        borderRadius: 0.5,
        bgcolor: 'primary.light',
      }
    : {};
}
