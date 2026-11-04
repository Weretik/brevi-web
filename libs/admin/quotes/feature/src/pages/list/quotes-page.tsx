import { useGetQuoteStaffQuery } from '@admin/quotes/data-access';
import { quoteEditorPath } from '@admin/quotes/model';
import { QuotesTable } from '@admin/quotes/ui';
import { ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { Alert, Box, Button, ListItemText, Menu, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuoteList } from '../../hooks/list/use-quote-list';

import type { QuoteActor } from '@admin/quotes/model';

/** «КП»: a Manager sees own КП; Director and Admin see all and filter by manager. */
export default function QuotesPage({ actor }: { actor: QuoteActor }) {
  const navigate = useNavigate();
  const list = useQuoteList();
  const staff = useGetQuoteStaffQuery(undefined, { skip: !actor.canSeeAll });
  const total = list.page?.total ?? 0;
  const [newMenu, setNewMenu] = useState<HTMLElement | null>(null);
  const create = (path: string) => {
    setNewMenu(null);
    navigate(path);
  };

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
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              endIcon={<KeyboardArrowDownOutlinedIcon />}
              aria-haspopup="menu"
              aria-expanded={newMenu !== null}
              onClick={(event) => setNewMenu(event.currentTarget)}
            >
              Нове КП
            </Button>
            <Menu
              anchorEl={newMenu}
              open={newMenu !== null}
              onClose={() => setNewMenu(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => create('/crm/quotes/new')}>
                <ListItemText
                  primary="КП під запит"
                  secondary="Під заявку клієнта: товари, кількість, ціни"
                />
              </MenuItem>
              <MenuItem onClick={() => create('/crm/quotes/new?custom=1')}>
                <ListItemText
                  primary="КП з нуля (новий виріб)"
                  secondary="Виріб, якого немає в каталозі: тканина, фурнітура, операції"
                />
              </MenuItem>
              <MenuItem onClick={() => create('/crm/quote-introductions/new')}>
                <ListItemText
                  primary="КП для знайомства"
                  secondary="Рекламний каталог моделей для нового клієнта"
                />
              </MenuItem>
            </Menu>
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
