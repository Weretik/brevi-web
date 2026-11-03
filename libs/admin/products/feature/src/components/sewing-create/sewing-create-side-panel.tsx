import { sewingCreateStepInfo } from '@admin/products/model';
import {
  SewingCreateChecklist,
  SewingCreateInstructionCard,
  SewingCreateLabourCard,
} from '@admin/products/ui';

import type {
  SewingCreateCheck,
  SewingCreateLabour,
  SewingCreateStep,
} from '@admin/products/model';

interface Props {
  step: SewingCreateStep;
  checks: readonly SewingCreateCheck[];
  labour: SewingCreateLabour | null;
}

/** Right column of «Нова модель»: what blocks the calculation, labour and the step rule. */
export function SewingCreateSidePanel({ step, checks, labour }: Props) {
  return (
    <>
      <SewingCreateChecklist checks={checks} />
      {labour && <SewingCreateLabourCard labour={labour} />}
      <SewingCreateInstructionCard text={sewingCreateStepInfo[step].instruction} />
    </>
  );
}
