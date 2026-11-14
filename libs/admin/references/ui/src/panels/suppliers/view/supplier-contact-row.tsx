import { Box, Link } from '@mui/material';

import type { ReactNode } from 'react';

/** A `tel:` link of a phone as typed, or null when it has no digits. */
export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : null;
}

/** One contact of the supplier: an icon and a text that is a link when it has `href`. */
export function SupplierContactRow({
  icon,
  href,
  external,
  mono,
  accent,
  children,
}: {
  icon: ReactNode;
  href?: string | null;
  external?: boolean;
  mono?: boolean;
  accent?: boolean;
  children: ReactNode;
}) {
  const content = (
    <>
      <Box component="span" sx={{ display: 'flex', color: 'primary.dark' }} aria-hidden>
        {icon}
      </Box>
      <Box
        component="span"
        sx={{
          minWidth: 0,
          overflowWrap: 'anywhere',
          fontFamily: mono ? 'var(--admin-font-mono)' : undefined,
          color: accent ? 'primary.dark' : 'text.primary',
        }}
      >
        {children}
      </Box>
    </>
  );
  const sx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    minHeight: 48,
    px: 1.5,
    borderRadius: 1,
    fontSize: 14,
    textDecoration: 'none',
  } as const;
  return href ? (
    <Link
      href={href}
      underline="none"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      sx={{ ...sx, '&:hover': { bgcolor: 'action.hover' } }}
    >
      {content}
    </Link>
  ) : (
    <Box sx={sx}>{content}</Box>
  );
}
