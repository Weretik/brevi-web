import { lastCustomerKeepinSync } from '@admin/clients/model';
import { CustomersReferenceGrid } from '@admin/clients/ui';
import {
  ReferenceFilterBar,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomerCreateDrawer } from '../../../components/customers/customer-create-drawer';
import { customerError } from '../../../errors/customer-error';
import { useCustomerKeepinSync } from '../../../hooks/customers/use-customer-keepin-sync';
import { useCustomerReferenceList } from '../../../hooks/customers/use-customer-reference-list';

import type { ReactNode } from 'react';

interface Props {
  /** Tabs of the «Контрагенти» page, shown above the header. */
  tabs?: ReactNode;
}

/** «Контрагенти → Клієнти»: clients from KeepinCRM, refreshed daily; a row opens the client card. */
export function CustomersReferenceContent({ tabs }: Props) {
  const navigate = useNavigate();
  const state = useCustomerReferenceList();
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [creating, setCreating] = useState(false);
  const { sync, syncing } = useCustomerKeepinSync((text, ok) => setNotice({ text, ok }));
  const { list } = state;
  const page = list.currentData;
  const lastSync = lastCustomerKeepinSync(page?.rows ?? []);

  return (
    <Box sx={{ minWidth: 0 }}>
      {tabs}
      <ReferencePageHeader
        title="Клієнти"
        subtitle={
          lastSync ? (
            <>
              Картки оновлюються з KeepinCRM щодня. Останнє оновлення:{' '}
              <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                {new Date(lastSync).toLocaleString('uk-UA', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </Box>
            </>
          ) : (
            'Клієнти з KeepinCRM. Назва, контакт і телефони оновлюються щодня.'
          )
        }
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<SyncOutlinedIcon />}
              disabled={syncing}
              onClick={() => void sync()}
            >
              {syncing ? 'Оновлення…' : 'Оновити з KeepinCRM'}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => setCreating(true)}
            >
              Додати клієнта
            </Button>
          </>
        }
      />
      {notice && (
        <Alert
          severity={notice.ok ? 'success' : 'error'}
          onClose={() => setNotice(null)}
          sx={{ mb: 2 }}
        >
          {notice.text}
        </Alert>
      )}
      <ReferenceListAlerts
        error={list.error ? customerError(list.error) : null}
        loading={list.isLoading}
        onRetry={() => void list.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <ReferenceSearchBar
        placeholder="Знайти клієнта за назвою, телефоном або email"
        label="Пошук клієнтів"
        value={state.term}
        onChange={state.setTerm}
      />
      <ReferenceFilterBar
        activity={state.activity}
        activityCounts={state.counts}
        onActivityChange={state.setActivity}
        count={page?.total ?? 0}
        total={state.counts[state.activity]}
        countLabel="Кількість клієнтів"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <CustomersReferenceGrid
          page={page}
          loading={list.isFetching}
          searching={Boolean(state.search) || state.counts.all > 0}
          unavailable={Boolean(list.error)}
          onPageChange={state.setPage}
          onOpen={(id) => navigate(`/crm/clients/${id}`)}
        />
      </Paper>
      {creating && (
        <CustomerCreateDrawer
          onClose={() => setCreating(false)}
          onCreated={(customer) => {
            setCreating(false);
            setNotice({ text: `Клієнта «${customer.displayName}» створено.`, ok: true });
          }}
        />
      )}
    </Box>
  );
}
