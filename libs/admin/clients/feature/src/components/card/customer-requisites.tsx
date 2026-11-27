import { CardSection } from '@admin/shared/ui';
import { Box, Typography } from '@mui/material';

import type { CustomerDetail } from '@admin/clients/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** «Реквізити» of a client card: legal name, code, KeepinCRM link and the last change. */
export function CustomerRequisites({ customer }: { customer: CustomerDetail }) {
  const rows: [string, string | null, boolean?][] = [
    ['Повна назва', customer.legalName],
    ['ЄДРПОУ / ІПН', customer.taxIdentity, true],
    ['KeepinCRM', customer.keepinCrmId, true],
    ...customer.externalIdentities
      .filter((identity) => identity.externalId !== customer.keepinCrmId)
      .map((identity): [string, string, boolean] => [identity.source, identity.externalId, true]),
    ['Змінено', new Date(customer.updatedAt).toLocaleString('uk-UA'), true],
  ];
  return (
    <CardSection title="Реквізити">
      <Box
        component="dl"
        sx={{ display: 'grid', gridTemplateColumns: 'minmax(110px, auto) 1fr', gap: 1, m: 0 }}
      >
        {rows
          .filter(([, value]) => !!value)
          .map(([label, value, isMono]) => (
            <Box key={label} sx={{ display: 'contents' }}>
              <Typography component="dt" variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography
                component="dd"
                variant="body2"
                sx={{ m: 0, overflowWrap: 'anywhere', ...(isMono ? mono : {}) }}
              >
                {value}
              </Typography>
            </Box>
          ))}
      </Box>
    </CardSection>
  );
}
