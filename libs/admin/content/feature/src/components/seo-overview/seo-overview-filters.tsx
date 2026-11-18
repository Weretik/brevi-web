import { seoAreaLabels, seoAreas, seoProblemKinds, seoProblemLabels } from '@admin/content/model';
import { MenuItem, Stack, TextField } from '@mui/material';

import type { SeoArea, SeoProblemKind } from '@admin/content/model';

/** Narrow the SEO overview to one area and one problem. */
export function SeoOverviewFilters({
  area,
  problem,
  onArea,
  onProblem,
}: {
  area: SeoArea | null;
  problem: SeoProblemKind | null;
  onArea: (area: SeoArea | null) => void;
  onProblem: (problem: SeoProblemKind | null) => void;
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5, mb: 2 }}>
      <TextField
        select
        size="small"
        label="Розділ"
        value={area ?? ''}
        onChange={(event) =>
          onArea(event.target.value === '' ? null : (event.target.value as SeoArea))
        }
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">Усі</MenuItem>
        {seoAreas.map((value) => (
          <MenuItem key={value} value={value}>
            {seoAreaLabels[value]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="Проблема"
        value={problem ?? ''}
        onChange={(event) =>
          onProblem(event.target.value === '' ? null : (event.target.value as SeoProblemKind))
        }
        sx={{ minWidth: 280 }}
      >
        <MenuItem value="">Усі</MenuItem>
        {seoProblemKinds.map((value) => (
          <MenuItem key={value} value={value}>
            {seoProblemLabels[value]}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
