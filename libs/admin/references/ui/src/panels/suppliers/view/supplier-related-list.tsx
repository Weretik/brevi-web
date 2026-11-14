import { Box, Stack, Typography } from '@mui/material';

import { supplierSectionTitle } from './supplier-contacts';

/** A row of the extra section, for example a fabric of this supplier in the current КП. */
export interface SupplierViewRelatedRow {
  key: string | number;
  label: string;
  value?: string | null;
}

/** The extra section of the supplier card; nothing when it has no rows. */
export function SupplierRelatedList({
  related,
}: {
  related: { title: string; rows: readonly SupplierViewRelatedRow[] } | undefined;
}) {
  if (!related || related.rows.length === 0) return null;
  return (
    <Stack spacing={1}>
      <Typography sx={supplierSectionTitle}>{related.title}</Typography>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {related.rows.map((row) => (
          <Box
            component="li"
            key={row.key}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              py: 1,
              fontSize: 14,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <span>{row.label}</span>
            {row.value && (
              <Box
                component="span"
                sx={{ fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' }}
              >
                {row.value}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
