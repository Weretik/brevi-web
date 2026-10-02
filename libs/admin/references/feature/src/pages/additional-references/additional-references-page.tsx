import { AdditionalReferencesGrid } from '@admin/references/ui';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

import { AdditionalReferenceDialog } from '../../components/additional-references/additional-reference-dialog';
import { useAdditionalReferences } from '../../hooks/additional-references/use-additional-references';

import type { AdditionalReference } from '@admin/references/model';

export function AdditionalReferencesPage() {
  const { rows, loading, error, reload } = useAdditionalReferences();
  const [active, setActive] = useState<AdditionalReference | null>(null);
  const [saved, setSaved] = useState(false);
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Додаткові довідники
      </Typography>
      {error && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {error}
        </Alert>
      )}
      {saved && (
        <Alert severity="success" onClose={() => setSaved(false)}>
          Запис збережено.
        </Alert>
      )}
      <AdditionalReferencesGrid rows={rows} loading={loading} onEdit={setActive} />
      {active && (
        <AdditionalReferenceDialog
          key={active.id}
          reference={active}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setSaved(true);
          }}
        />
      )}
    </Box>
  );
}

export default AdditionalReferencesPage;
