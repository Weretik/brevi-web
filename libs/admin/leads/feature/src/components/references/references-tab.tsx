import { LeadCallResultsList, LeadCategoriesList, LeadStatsCard } from '@admin/leads/ui';
import { Alert, Box, Button, CircularProgress } from '@mui/material';

import type { LeadReferences } from '../../hooks/references/use-lead-references';

interface Props {
  references: LeadReferences;
  canEdit: boolean;
}

/** «Довідники»: replaces the sheet «Справочники»; lists a manager picks from. */
export function ReferencesTab({ references, canEdit }: Props) {
  if (references.loadError) return <Alert severity="error">{references.loadError}</Alert>;
  if (references.loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} aria-label="Завантаження довідників" />
      </Box>
    );
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
        alignItems: 'start',
      }}
    >
      <LeadStatsCard
        title="Результати дзвінка"
        action={
          canEdit && (
            <Button size="small" onClick={references.createResult}>
              + Додати
            </Button>
          )
        }
      >
        <LeadCallResultsList
          results={references.results}
          onEdit={canEdit ? references.editResult : undefined}
        />
      </LeadStatsCard>
      <LeadStatsCard title="Категорії">
        <LeadCategoriesList
          categories={references.categories}
          onEdit={canEdit ? references.editCategory : undefined}
        />
      </LeadStatsCard>
    </Box>
  );
}
