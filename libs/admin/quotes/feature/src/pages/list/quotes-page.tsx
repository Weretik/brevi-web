import { useGetQuoteStaffQuery } from '@admin/quotes/data-access';
import { quoteEditorPath } from '@admin/quotes/model';
import { QuotesTable } from '@admin/quotes/ui';
import { ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useQuoteList } from '../../hooks/list/use-quote-list';

import type { QuoteActor } from '@admin/quotes/model';

/** «КП»: a Manager sees own КП; Director and Admin see all and filter by manager. */
export default function QuotesPage({ actor }: { actor: QuoteActor }) {
  const navigate = useNavigate();
  const list = useQuoteList();
  const staff = useGetQuoteStaffQuery(undefined, { skip: !actor.canSeeAll });
  const total = list.page?.total ?? 0;

  return (
    <Box>
      <ReferencePageHeader
        overline="Менеджер сервісу"
        title="КП"
        subtitle={
          actor.canSeeAll ? 'Комерційні пропозиції всіх менеджерів' : 'Ваші комерційні пропозиції'
        }
        actions={
          <>
            <Button onClick={() => navigate('/crm/quote-introductions/new')}>
              КП для знайомства
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => navigate('/crm/quotes/new')}
            >
              Нове КП
            </Button>
          </>
        }
      />
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
      />
    </Box>
  );
}
