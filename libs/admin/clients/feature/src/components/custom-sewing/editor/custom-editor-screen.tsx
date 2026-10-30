import { Box, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomWorkspace } from './custom-workspace';
import { useClientDirtyGuard } from '../../../hooks/navigation/use-client-dirty-guard';
import { UnsavedClientDialog } from '../../changes/unsaved-client-dialog';

export function CustomEditorScreen({ draftId }: { draftId?: string }) {
  const navigate = useNavigate();
  const [dirty, setDirty] = useState(false);
  const [locked, setLocked] = useState(false);
  const guard = useClientDirtyGuard(dirty || locked);
  const state = useCallback((changed: boolean, busy: boolean) => {
    setDirty(changed);
    setLocked(busy);
  }, []);
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h5">
          Індивідуальне пошиття
        </Typography>
        <CustomWorkspace
          initialId={draftId}
          onState={state}
          onCreated={(id) => {
            guard.allowNavigation();
            navigate(`/crm/custom-sewing/${id}`, { replace: true });
          }}
        />
        <UnsavedClientDialog blocker={guard.blocker} locked={locked} />
      </Stack>
    </Box>
  );
}
