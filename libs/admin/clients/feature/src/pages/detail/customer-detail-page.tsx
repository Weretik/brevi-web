import { CounterpartyFinance } from '@admin/accounting/feature';
import { CustomerEmbroidery } from '@admin/embroidery/feature';
import { CustomerProductionOrders } from '@admin/production/feature';
import { CustomerQuotes } from '@admin/quotes/feature';
import { useCardPeriod } from '@admin/shared/routing';
import { CardPeriodFilter } from '@admin/shared/ui';
import { CustomerTasks } from '@admin/tasks/feature';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CustomerCardDialogs } from '../../components/card/customer-card-dialogs';
import { CustomerCardHeader } from '../../components/card/customer-card-header';
import { CustomerCardTabs } from '../../components/card/customer-card-tabs';
import { CustomerOverview } from '../../components/card/customer-overview';
import { UnsavedClientDialog } from '../../components/changes/unsaved-client-dialog';
import { customerError } from '../../errors/customer-error';
import { useCustomerTab } from '../../hooks/card/use-customer-tab';
import { useCustomerDetail } from '../../hooks/customers/use-customer-detail';

import type { CustomerCardAccess } from '../../clients.routes';

const noAccess: CustomerCardAccess = {
  quotes: false,
  productionOrders: false,
  tasks: false,
  embroidery: false,
  finance: false,
};

/**
 * Client card (CARD-001, concept «Огляд і вкладки»): header, one period for every tab, «Огляд» and
 * the full lists of everything linked to the client, 20 rows per page. Editing opens the side panel.
 */
export default function CustomerDetailPage({ access = noAccess }: { access?: CustomerCardAccess }) {
  const detail = useCustomerDetail();
  const { query, customer, navigate, blocker, refresh } = detail;
  const { tab, tabs, setTab } = useCustomerTab(access);
  const { period, setPeriod, from, to } = useCardPeriod();
  const [editing, setEditing] = useState(false);
  const busy = detail.pending || !!detail.contact || detail.merge;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {(query.isLoading || (!customer && query.isFetching)) && (
        <CircularProgress aria-label="Завантаження клієнта" />
      )}
      {query.error && (
        <Alert severity="error" action={<Button onClick={() => void refresh()}>Повторити</Button>}>
          {customerError(query.error)}
        </Alert>
      )}
      {!query.error && customer && (
        <Stack spacing={2.5}>
          <CustomerCardHeader
            customer={customer}
            canCreateQuote={access.quotes}
            busy={busy}
            onBack={() => navigate('/references/counterparties?tab=clients')}
            onEdit={() => setEditing(true)}
            onMerge={() => detail.setMerge(true)}
            onNewQuote={() =>
              navigate('/crm/quotes/new', {
                state: {
                  prefill: {
                    internalName: customer.displayName,
                    companyName: customer.legalName ?? customer.displayName,
                    recipientName: customer.contactName ?? '',
                    customerPublicId: customer.publicId,
                  },
                },
              })
            }
          />
          {detail.saved && (
            <Alert severity="success" onClose={() => detail.setSaved(false)}>
              Клієнта збережено.
            </Alert>
          )}
          {tab === 'finance' ? (
            <Typography variant="body2" color="text.secondary">
              «Фінанси» мають свій період у фільтрах нижче.
            </Typography>
          ) : (
            <CardPeriodFilter value={period} onChange={setPeriod} />
          )}
          <CustomerCardTabs tab={tab} tabs={tabs} onChange={setTab} />
          {tab === 'overview' && (
            <CustomerOverview
              customer={customer}
              access={access}
              from={from}
              to={to}
              canEditContacts={customer.canEdit && !busy}
              onEditContact={(value) => detail.setContact({ value })}
              onTab={setTab}
            />
          )}
          {tab === 'quotes' && (
            <CustomerQuotes customerPublicId={customer.publicId} from={from} to={to} />
          )}
          {tab === 'orders' && (
            <CustomerProductionOrders customerPublicId={customer.publicId} from={from} to={to} />
          )}
          {tab === 'tasks' && (
            <CustomerTasks customerPublicId={customer.publicId} from={from} to={to} />
          )}
          {tab === 'embroidery' && (
            <CustomerEmbroidery customerPublicId={customer.publicId} from={from} to={to} />
          )}
          {tab === 'finance' && <CounterpartyFinance kind="Client" id={customer.publicId} />}
        </Stack>
      )}
      {customer && (
        <CustomerCardDialogs
          detail={detail}
          customer={customer}
          editing={editing}
          onCloseEdit={() => setEditing(false)}
        />
      )}
      <UnsavedClientDialog blocker={blocker} />
    </Box>
  );
}
