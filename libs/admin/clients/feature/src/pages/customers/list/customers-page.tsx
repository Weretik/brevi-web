import { useListCustomersQuery } from '@admin/clients/data-access';
import { CustomersTable } from '@admin/clients/ui';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { customerError } from '../../../errors/customer-error';

export default function CustomersPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const search = params.get('search') ?? '';
  const activeParam = params.get('active') ?? 'true';
  const active = ['true', 'false', 'all'].includes(activeParam) ? activeParam : 'true';
  const rawPage = Number(params.get('page') ?? '1');
  const page = Number.isInteger(rawPage) && rawPage > 0 && rawPage <= 1_000_000 ? rawPage : 1;
  const [term, setTerm] = useState(search);
  useEffect(() => {
    setTerm(search);
  }, [search]);
  const query = useListCustomersQuery({
    search,
    active: active === 'all' ? undefined : active === 'true',
    page,
    pageSize: 25,
  });
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  };
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', gap: 2 }}
        >
          <Typography component="h1" variant="h4">
            Клієнти
          </Typography>
          <Button
            variant="contained"
            disabled={query.isLoading || !!query.error}
            onClick={() => navigate('/crm/clients/new')}
          >
            Створити клієнта
          </Button>
        </Stack>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            setFilter('search', term.trim());
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              label="Пошук клієнтів"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 300 } }}
            />
            <Button type="submit">Знайти</Button>
            <TextField
              select
              label="Стан клієнта"
              value={active}
              onChange={(event) => setFilter('active', event.target.value)}
            >
              <MenuItem value="true">Активні</MenuItem>
              <MenuItem value="false">Неактивні</MenuItem>
              <MenuItem value="all">Усі</MenuItem>
            </TextField>
          </Stack>
        </Box>
        {(query.isLoading || (query.isFetching && !query.currentData)) && (
          <CircularProgress aria-label="Завантаження клієнтів" />
        )}
        {query.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
          >
            {customerError(query.error)}
          </Alert>
        )}
        {!query.error && query.currentData && (
          <>
            {!query.currentData.rows.length && (
              <Alert severity="info">Клієнтів за цими умовами не знайдено.</Alert>
            )}
            <Box sx={{ overflowX: 'auto' }}>
              <CustomersTable
                data={query.currentData}
                onOpen={(id) => navigate(`/crm/clients/${id}`)}
                onPage={(page) => setFilter('page', String(page))}
              />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
