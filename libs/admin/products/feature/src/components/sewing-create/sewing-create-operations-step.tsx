import { SewingLabourTable } from '@admin/products/ui';
import { Alert, FormControlLabel, Stack, Switch, Typography } from '@mui/material';

import { SewingCompositionScreen } from '../sewing-composition/sewing-composition-screen';

import type { useSewingCompositionController } from '../../hooks/sewing-composition/use-sewing-composition-controller';
import type { SewingLabourLine } from '@admin/products/model';

interface Props {
  productId: number;
  controller: ReturnType<typeof useSewingCompositionController>;
  labour: SewingLabourLine[];
  costsKnown: boolean;
  verified: boolean;
  verifiedOn: string | null;
  saving: boolean;
  message: string | null;
  onVerifiedChange: (verified: boolean) => void;
}

/** Step 4 «Операції»: time, quantity and part of each operation, then «Перевірено». */
export function SewingCreateOperationsStep(props: Props) {
  const blocked = props.saving || props.controller.drafts.dirty || props.controller.busy;
  return (
    <Stack sx={{ gap: 2 }}>
      <SewingLabourTable lines={props.labour} costsKnown={props.costsKnown} />
      <SewingCompositionScreen
        productId={props.productId}
        controller={props.controller}
        section="operations"
      />
      {props.message && <Alert severity="error">{props.message}</Alert>}
      <Stack sx={{ gap: 0.5 }}>
        <FormControlLabel
          control={
            <Switch
              checked={props.verified}
              disabled={blocked}
              onChange={(event) => props.onVerifiedChange(event.target.checked)}
            />
          }
          label={
            props.verified && props.verifiedOn
              ? `Перевірено та підтверджено ${props.verifiedOn}`
              : 'Перевірено та підтверджено'
          }
        />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Ставте тільки після реальної перевірки операцій і часу.
          {props.controller.drafts.dirty ? ' Спершу збережіть зміни операцій.' : ''}
        </Typography>
      </Stack>
    </Stack>
  );
}
