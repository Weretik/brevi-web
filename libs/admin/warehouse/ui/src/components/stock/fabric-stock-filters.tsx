import { ReferenceFilterChip, ReferenceSearchBar } from '@admin/references/ui';
import { stockProblemLabels, stockProblems } from '@admin/warehouse/model';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { StockProblem } from '@admin/warehouse/model';

interface Props {
  search: string;
  problem: StockProblem;
  counts: Record<StockProblem, number>;
  supplier: string | null;
  suppliers: readonly string[];
  /** Pairs shown and pairs on the shelf. */
  shown: number;
  total: number;
  onSearch: (value: string) => void;
  onProblem: (problem: StockProblem) => void;
  onSupplier: (supplier: string | null) => void;
}

/**
 * «Залишки» filters: the search, the problem chips with their counts (instead of a warning banner) and the supplier.
 */
export function FabricStockFilters({
  search,
  problem,
  counts,
  supplier,
  suppliers,
  shown,
  total,
  onSearch,
  onProblem,
  onSupplier,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <Box sx={{ mb: 2 }}>
      <ReferenceSearchBar
        placeholder="Знайти тканину, код або колір"
        label="Пошук залишків"
        value={search}
        onChange={onSearch}
      />
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Stack direction="row" role="group" aria-label="Проблеми" sx={{ gap: 1, flexWrap: 'wrap' }}>
          {stockProblems
            .filter((value) => value === 'all' || value === problem || counts[value] > 0)
            .map((value) => (
              <ReferenceFilterChip
                key={value}
                label={stockProblemLabels[value]}
                count={counts[value]}
                selected={problem === value}
                onClick={() => onProblem(value)}
              />
            ))}
        </Stack>
        {suppliers.length > 1 && (
          <>
            <ReferenceFilterChip
              label={supplier ?? 'Постачальник'}
              selected={supplier !== null}
              ariaHasPopup
              icon={<ExpandMoreOutlinedIcon fontSize="small" />}
              onClick={(event) => setAnchor(event.currentTarget)}
            />
            <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
              <MenuItem
                selected={supplier === null}
                onClick={() => {
                  setAnchor(null);
                  onSupplier(null);
                }}
              >
                Усі постачальники
              </MenuItem>
              {suppliers.map((name) => (
                <MenuItem
                  key={name}
                  selected={name === supplier}
                  onClick={() => {
                    setAnchor(null);
                    onSupplier(name);
                  }}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        <Box sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" aria-live="polite">
          Знайдено: {shown} із {total}
        </Typography>
      </Stack>
    </Box>
  );
}
