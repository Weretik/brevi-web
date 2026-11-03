import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Card, CardContent, Stack, Typography } from '@mui/material';

import type { SewingCreateCheck, SewingCreateCheckState } from '@admin/products/model';

interface Props {
  checks: readonly SewingCreateCheck[];
}

const stateText: Record<SewingCreateCheckState, string> = {
  ok: 'виправлено',
  blocking: 'заважає',
  unknown: 'ще не перевірено',
};

function StateIcon({ state }: { state: SewingCreateCheckState }) {
  if (state === 'ok')
    return <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'success.main' }} />;
  if (state === 'blocking')
    return <ErrorOutlineIcon fontSize="small" sx={{ color: 'warning.main' }} />;
  return <RadioButtonUncheckedIcon fontSize="small" sx={{ color: 'text.disabled' }} />;
}

/** «Що заважає розрахунку»: the sheet's readiness reasons with their current state. */
export function SewingCreateChecklist({ checks }: Props) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'grid', gap: 1.5 }}>
        <Typography variant="h6" component="h2">
          Що заважає розрахунку
        </Typography>
        <Stack component="ul" aria-label="Що заважає розрахунку" sx={{ m: 0, p: 0, gap: 1 }}>
          {checks.map((check) => (
            <Stack
              key={check.key}
              component="li"
              direction="row"
              sx={{ gap: 1, alignItems: 'center', listStyle: 'none' }}
            >
              <StateIcon state={check.state} />
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  color: check.state === 'blocking' ? 'text.primary' : 'text.secondary',
                  textDecoration: check.state === 'ok' ? 'line-through' : undefined,
                }}
              >
                {check.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {stateText[check.state]}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
