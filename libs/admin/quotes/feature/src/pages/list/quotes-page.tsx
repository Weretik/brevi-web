import { useGetQuoteStaffQuery } from '@admin/quotes/data-access';
import { quoteEditorPath } from '@admin/quotes/model';
import { QuotesTable } from '@admin/quotes/ui';
import { ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, MenuItem, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuoteDeleteDialog } from '../../components/editor/quote-delete-dialog';
import { QuoteLegacyArchiveNotice } from '../../components/list/quote-legacy-archive-notice';
import { QuoteStartDrawer } from '../../components/start/quote-start-drawer';
import { useQuoteDelete } from '../../hooks/lifecycle/use-quote-delete';
import { useRouteNotice } from '../../hooks/lifecycle/use-route-notice';
import { useQuoteList } from '../../hooks/list/use-quote-list';

import type { QuoteActor } from '@admin/quotes/model';

/**
 * «Комерційні пропозиції»: a Manager sees own КП; Director and Admin see all and filter by manager. The Director
 * deletes a КП from its row (crm R-34).
 */
export default function QuotesPage({ actor }: { actor: QuoteActor }) {
  const navigate = useNavigate();
  const list = useQuoteList();
  const staff = useGetQuoteStaffQuery(undefined, { skip: !actor.canSeeAll });
  const total = list.page?.total ?? 0;
  const [starting, setStarting] = useState(false);
  const removal = useQuoteDelete(() => undefined);
  const saved = useRouteNotice();

  return (
    <Box>
      <ReferencePageHeader
        overline="Менеджер сервісу"
        title="Комерційні пропозиції"
        subtitle={
          actor.canSeeAll ? 'Комерційні пропозиції всіх менеджерів' : 'Ваші комерційні пропозиції'
        }
        actions={
          <>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => setStarting(true)}
            >
              Нове КП
            </Button>
          </>
        }
      />
      {actor.canDelete && <QuoteLegacyArchiveNotice />}
      <ReferenceSearchBar
        placeholder="Знайти КП за номером, клієнтом або підприємством…"
        label="Пошук КП"
        value={list.search}
        onChange={list.setSearch}
      />
      {actor.canSeeAll && (
        <TextField
          select
          size="small"
          label="Відповідальний"
          value={list.responsibleUserId ?? ''}
          onChange={(event) =>
            list.setResponsible(event.target.value === '' ? null : Number(event.target.value))
          }
          sx={{ mb: 1.5, minWidth: 240 }}
        >
          <MenuItem value="">Усі менеджери</MenuItem>
          {(staff.data ?? []).map((member) => (
            <MenuItem key={member.userId} value={member.userId}>
              {member.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {list.error && (
        <Alert
          severity="error"
          sx={{ mb: 1.5 }}
          action={
            <Button color="inherit" onClick={list.retry}>
              Повторити
            </Button>
          }
        >
          {list.error}
        </Alert>
      )}
      <QuotesTable
        rows={list.page?.items ?? []}
        rowCount={total}
        loading={list.loading}
        searching={list.narrowed}
        paginationModel={list.pagination}
        onPaginationModelChange={list.setPagination}
        onOpen={(row) => navigate(quoteEditorPath(row.kind, row.id))}
        onDelete={actor.canDelete ? removal.ask : undefined}
      />
      <QuoteDeleteDialog flow={removal} />
      <Snackbar
        open={saved.notice !== null}
        message={saved.notice}
        autoHideDuration={4000}
        onClose={saved.dismiss}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      {starting && <QuoteStartDrawer onClose={() => setStarting(false)} />}
    </Box>
  );
}
