import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

import type { EmailTemplateDetailView } from '@admin/clients/model';

export function EmailTemplateDetails({
  value,
  canManage,
  canActivate,
  disabled,
  onCopy,
  onActivate,
}: {
  value: EmailTemplateDetailView;
  canManage: boolean;
  canActivate: boolean;
  disabled: boolean;
  onCopy: () => void;
  onActivate: () => void;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography component="h2" variant="h6">
            {value.label} · Версія {value.number}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {value.subject}
          </Typography>
          <Typography component="div" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {value.body}
          </Typography>
          {canManage && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button disabled={disabled} onClick={onCopy}>
                Копіювати до нової версії
              </Button>
              <Button variant="outlined" disabled={disabled || !canActivate} onClick={onActivate}>
                Активувати цю версію
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
