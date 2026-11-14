import { fabricNormModelCaption, formatMeters } from '@admin/production/model';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, CircularProgress, List, ListItemButton, Paper, Typography } from '@mui/material';

import type { FabricNormRow } from '@admin/production/model';

interface Props {
  rows: FabricNormRow[];
  selectedCode: string | null;
  loading: boolean;
  /** «Моделей не знайдено» when the search hides everything, else the empty catalogue text. */
  emptyLabel: string;
  onSelect: (row: FabricNormRow) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/**
 * The left column of «Норми витрати тканини»: one line per model with «MOD-025 · Літо» (or its
 * problem) and the one-colour metres; the list scrolls inside like a table.
 */
export function FabricNormModelList({ rows, selectedCode, loading, emptyLabel, onSelect }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: { xs: 360, md: 'var(--admin-table-height)' },
        overflowY: 'auto',
        minWidth: 0,
      }}
    >
      {loading && rows.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label="Завантаження моделей" />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          {emptyLabel}
        </Typography>
      ) : (
        <List disablePadding aria-label="Моделі">
          {rows.map((row) => {
            const selected = row.modelCode === selectedCode;
            const name = row.modelName ?? row.modelCode;
            return (
              <ListItemButton
                key={row.modelCode}
                selected={selected}
                aria-current={selected ? 'true' : undefined}
                onClick={() => onSelect(row)}
                divider
                sx={{
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                    {name}
                  </Typography>
                  {row.problem ? (
                    <Typography
                      variant="caption"
                      color="error.main"
                      component="div"
                      noWrap
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <ErrorOutlineOutlinedIcon sx={{ fontSize: 14 }} aria-hidden />
                      {row.modelCode} · {row.problem}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary" component="div" noWrap>
                      {fabricNormModelCaption(row)}
                      {!row.modelIsActive ? ' · вимкнена' : ''}
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ ...mono, fontWeight: 600, flexShrink: 0 }}
                  color={row.norm?.oneColor == null ? 'text.secondary' : 'text.primary'}
                >
                  {row.norm ? formatMeters(row.norm.oneColor) : 'немає'}
                </Typography>
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Paper>
  );
}
