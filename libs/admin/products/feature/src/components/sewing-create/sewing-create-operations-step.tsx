import { SewingLabourTable } from '@admin/products/ui';
import { Stack } from '@mui/material';

import { SewingCompositionScreen } from '../sewing-composition/sewing-composition-screen';

import type { useSewingCompositionController } from '../../hooks/sewing-composition/use-sewing-composition-controller';
import type { SewingLabourLine } from '@admin/products/model';

interface Props {
  productId: number;
  controller: ReturnType<typeof useSewingCompositionController>;
  labour: SewingLabourLine[];
  costsKnown: boolean;
}

/** Step 4 «Операції»: time, quantity and part of each operation. */
export function SewingCreateOperationsStep(props: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <SewingLabourTable lines={props.labour} costsKnown={props.costsKnown} />
      <SewingCompositionScreen
        productId={props.productId}
        controller={props.controller}
        section="operations"
      />
    </Stack>
  );
}
