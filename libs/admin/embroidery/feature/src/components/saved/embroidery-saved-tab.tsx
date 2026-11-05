import { useGetEmbroideryCalculationsQuery } from '@admin/embroidery/data-access';
import { EmbroiderySavedTable } from '@admin/embroidery/ui';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  LinearProgress,
  Paper,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import { useDeferredValue, useState } from 'react';

import { EmbroiderySavedDrawer } from './embroidery-saved-drawer';

import type { EmbroideryCalculationRequest } from '@admin/embroidery/model';

interface Props {
  canDelete: boolean;
  onRepeat: (request: EmbroideryCalculationRequest) => void;
}

const pageSize = 25;

/** «Збережені»: everyone's saved calculations, newest first, with search. */
export function EmbroiderySavedTab({ canDelete, onRepeat }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const deferred = useDeferredValue(search);
  const list = useGetEmbroideryCalculationsQuery({ search: deferred, page, pageSize });
  const rows = list.data?.items ?? [];

  return (
    <Paper variant="outlined" component="section" aria-label="Збережені розрахунки">
      <Box sx={{ p: 2 }}>
        <TextField
          size="small"
          fullWidth
          label="Пошук"
          placeholder="Назва, клієнт або номер ВШ-0042"
          value={search}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </Box>
      <Box sx={{ height: 4 }}>{list.isFetching && <LinearProgress />}</Box>
      {list.isError ? (
        <Alert
          severity="error"
          sx={{ m: 2 }}
          action={
            <Button color="inherit" onClick={() => void list.refetch()}>
              Повторити
            </Button>
          }
        >
          {(list.error as { message?: string } | undefined)?.message ??
            'Не вдалося завантажити збережені розрахунки.'}
        </Alert>
      ) : rows.length === 0 && !list.isLoading ? (
        <Typography color="text.secondary" sx={{ px: 2, pb: 3 }}>
          {deferred.trim()
            ? 'Нічого не знайдено.'
            : 'Поки нічого не збережено. Порахуйте ціну і натисніть «Зберегти розрахунок».'}
        </Typography>
      ) : (
        <>
          <EmbroiderySavedTable rows={rows} onOpen={(row) => setOpenId(row.id)} />
          <TablePagination
            component="div"
            count={list.data?.total ?? 0}
            page={page - 1}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} з ${count}`}
            onPageChange={(_event, next) => setPage(next + 1)}
          />
        </>
      )}
      {openId !== null && (
        <EmbroiderySavedDrawer
          id={openId}
          canDelete={canDelete}
          onClose={() => setOpenId(null)}
          onRepeat={(request) => {
            setOpenId(null);
            onRepeat(request);
          }}
        />
      )}
    </Paper>
  );
}
