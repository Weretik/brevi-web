import { ReferenceFilterChip, ReferenceSearchBar } from '@admin/references/ui';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { ReactNode } from 'react';

interface Props<T extends string> {
  search: string;
  searchPlaceholder: string;
  searchLabel: string;
  views: readonly T[];
  labels: Record<T, string>;
  counts: Record<T, number>;
  view: T;
  /** A problem chip with nothing in it is hidden unless it is chosen; the first chip always shows. */
  hideEmpty?: readonly T[];
  /** Suppliers for the supplier chip; the chip shows only when there are two or more. */
  suppliers?: readonly string[];
  supplier?: string | null;
  /** «Знайдено: N»; left out when null. */
  shown?: number | null;
  onSearch: (value: string) => void;
  onView: (view: T) => void;
  onSupplier?: (supplier: string | null) => void;
  /** More filters after the chips, e.g. the period chip. */
  extra?: ReactNode;
  /** Chips only, without the search. */
  hideSearch?: boolean;
}

/** The search over a «Що замовити» report, its chips with counts and the supplier chip. */
export function ReportFilterBar<T extends string>({
  search,
  searchPlaceholder,
  searchLabel,
  views,
  labels,
  counts,
  view,
  hideEmpty = [],
  suppliers = [],
  supplier = null,
  shown = null,
  onSearch,
  onView,
  onSupplier,
  extra,
  hideSearch = false,
}: Props<T>) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <Box sx={{ mb: 2 }}>
      {!hideSearch && (
        <ReferenceSearchBar
          placeholder={searchPlaceholder}
          label={searchLabel}
          value={search}
          onChange={onSearch}
        />
      )}
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Stack
          direction="row"
          role="group"
          aria-label="Що показати"
          sx={{ gap: 1, flexWrap: 'wrap' }}
        >
          {views
            .filter((value) => !hideEmpty.includes(value) || value === view || counts[value] > 0)
            .map((value) => (
              <ReferenceFilterChip
                key={value}
                label={labels[value]}
                count={counts[value]}
                selected={view === value}
                onClick={() => onView(value)}
              />
            ))}
        </Stack>
        {onSupplier && suppliers.length > 1 && (
          <>
            <ReferenceFilterChip
              label={supplier ?? 'Постачальник'}
              selected={supplier !== null}
              ariaHasPopup
              icon={<ExpandMoreOutlinedIcon fontSize="small" />}
              onClick={(event) => setAnchor(event.currentTarget)}
            />
            <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
              {[null, ...suppliers].map((name) => (
                <MenuItem
                  key={name ?? ''}
                  selected={name === supplier}
                  onClick={() => {
                    setAnchor(null);
                    onSupplier(name);
                  }}
                >
                  {name ?? 'Усі постачальники'}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        {extra}
        <Box sx={{ flex: 1 }} />
        {shown !== null && (
          <Typography variant="body2" color="text.secondary" aria-live="polite">
            Знайдено: {shown}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
