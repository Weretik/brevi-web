import { useGetFinanceCategoriesQuery } from '@admin/accounting/data-access';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FinanceCounterpartyDialogs } from '../../components/counterparties/finance-counterparty-dialogs';
import { FinanceCounterpartyDrawer } from '../../components/counterparties/finance-counterparty-drawer';
import { FinanceCounterpartyFilters } from '../../components/counterparties/finance-counterparty-filters';
import { FinanceCounterpartyTabGrids } from '../../components/counterparties/finance-counterparty-tab-grids';
import { FinanceReviewDrawer } from '../../components/review/finance-review-drawer';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';
import { useFinanceCounterpartyActions } from '../../hooks/counterparties/use-finance-counterparty-actions';
import { useFinanceCounterpartyList } from '../../hooks/counterparties/use-finance-counterparty-list';

import type { FinanceCounterpartyEditorMode } from '../../hooks/counterparties/use-finance-counterparty-editor';
import type {
  FinanceCounterparty,
  FinanceParty,
  FinanceTransaction,
} from '@admin/accounting/model';

/**
 * «Бухгалтерія → Контрагенти»: own finance counterparties, clients and suppliers (read-only here)
 * and one-off names of operations.
 */
export function FinanceCounterpartiesPage() {
  const { canCreate } = usePageRights();
  const list = useFinanceCounterpartyList();
  const navigate = useNavigate();
  const categories = useGetFinanceCategoriesQuery().data ?? [];
  const { cutoverDate } = useAccountingSettings();
  const [active, setActive] = useState<{
    mode: FinanceCounterpartyEditorMode;
    counterparty: FinanceCounterparty | null;
  } | null>(null);
  const [reviewing, setReviewing] = useState<FinanceTransaction | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const actions = useFinanceCounterpartyActions(setActionMessage);
  const page = list.page;
  const grid = {
    rowCount: page?.total ?? 0,
    loading: list.loading,
    searching: Boolean(list.search.trim()),
    unavailable: Boolean(list.error),
    paginationModel: list.paginationModel,
    onPaginationModelChange: list.changePage,
  };

  function openParty(party: FinanceParty) {
    navigate(
      party.kind === 'Client'
        ? `/crm/clients/${encodeURIComponent(party.id)}`
        : '/references/counterparties',
    );
  }

  function review(transaction: FinanceTransaction) {
    if (transaction.status === 'Active') setReviewing(transaction);
    else setActionMessage('Анульовану операцію змінити не можна.');
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Контрагенти"
        subtitle="З ким рухаються гроші. Клієнти й постачальники беруться з їхніх розділів"
        actions={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => setActive({ mode: 'create', counterparty: null })}
            >
              Додати контрагента
            </Button>
          ) : null
        }
      />
      <ReferenceListAlerts
        error={list.error}
        loading={list.loading}
        onRetry={list.refetch}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <FinanceCounterpartyFilters list={list} />
      <FinanceCounterpartyTabGrids
        tab={list.tab}
        page={page}
        grid={grid}
        cutoverDate={cutoverDate}
        onView={(counterparty) => setActive({ mode: 'view', counterparty })}
        onEdit={(counterparty) =>
          setActive({ mode: counterparty.mergedIntoId ? 'view' : 'edit', counterparty })
        }
        onArchive={(id) =>
          actions.archive.request(page?.financial.find((row) => row.id === id) ?? null)
        }
        onOpenParty={openParty}
        onReview={review}
        onPromote={(id) => actions.promote.request(page?.oneoffs.find((row) => row.id === id))}
      />
      {active && (
        <FinanceCounterpartyDrawer
          key={`${active.mode}-${active.counterparty?.id ?? 'new'}`}
          mode={active.mode}
          counterparty={active.counterparty}
          categories={categories}
          onClose={() => setActive(null)}
          onSaved={(message) => {
            setActive(null);
            setActionMessage(message);
          }}
        />
      )}
      {reviewing && (
        <FinanceReviewDrawer
          key={reviewing.id}
          transaction={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={(message) => {
            setReviewing(null);
            setActionMessage(message);
          }}
        />
      )}
      <FinanceCounterpartyDialogs actions={actions} />
    </Box>
  );
}

export default FinanceCounterpartiesPage;
