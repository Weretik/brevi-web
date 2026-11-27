import { CustomerContacts } from '@admin/clients/ui';
import { CardMetricStrip, CardSection } from '@admin/shared/ui';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { CustomerRecentQuotes } from './customer-recent-quotes';
import { CustomerRequisites } from './customer-requisites';
import { useCustomerOverview } from '../../hooks/card/use-customer-overview';

import type { CustomerCardAccess } from '../../clients.routes';
import type { CustomerTab } from '../../hooks/card/use-customer-tab';
import type { CustomerContact, CustomerDetail } from '@admin/clients/model';
import type { CardMetric } from '@admin/shared/ui';

interface Props {
  customer: CustomerDetail;
  access: CustomerCardAccess;
  from?: string;
  to?: string;
  canEditContacts: boolean;
  onEditContact: (contact?: CustomerContact) => void;
  onTab: (tab: CustomerTab) => void;
}

/** «Огляд» of a client card (CARD-001): counts of the period, the latest КП, contacts and requisites. */
export function CustomerOverview(props: Props) {
  const { customer, access, from, to, canEditContacts, onEditContact, onTab } = props;
  const navigate = useNavigate();
  const overview = useCustomerOverview({ customerPublicId: customer.publicId, from, to, access });
  const metrics = (
    [
      access.quotes && {
        label: 'КП',
        value: overview.counts.quotes,
        onOpen: () => onTab('quotes'),
      },
      access.productionOrders && {
        label: 'Завдання в цех',
        value: overview.counts.orders,
        onOpen: () => onTab('orders'),
      },
      access.tasks && {
        label: 'Завдання менеджерам',
        value: overview.counts.tasks,
        onOpen: () => onTab('tasks'),
      },
      access.embroidery && {
        label: 'Розрахунки вишивки',
        value: overview.counts.embroidery,
        onOpen: () => onTab('embroidery'),
      },
    ] as (CardMetric | false)[]
  ).filter((metric): metric is CardMetric => !!metric);

  return (
    <Stack spacing={2}>
      {!!metrics.length && <CardMetricStrip metrics={metrics} />}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(320px, 1fr)' },
          alignItems: 'start',
        }}
      >
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          {access.quotes && (
            <CustomerRecentQuotes
              quotes={overview.recentQuotes}
              loading={overview.quotesLoading}
              failed={overview.quotesFailed}
              onOpen={(quote) => navigate(`/crm/quotes/${quote.id}`)}
              onOpenAll={() => onTab('quotes')}
            />
          )}
          <CustomerRequisites customer={customer} />
        </Stack>
        <CardSection title="Контакти">
          <CustomerContacts
            contacts={customer.contacts}
            canEdit={canEditContacts}
            onEdit={onEditContact}
          />
        </CardSection>
      </Box>
    </Stack>
  );
}
