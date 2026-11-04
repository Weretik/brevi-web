import { SewingCreateLayout } from '@admin/products/ui';
import { useState } from 'react';

import { SewingCreateDraftStep } from './sewing-create-draft-step';
import { SewingCreateSidePanel } from './sewing-create-side-panel';
import { useSewingCreateDraft } from '../../hooks/sewing-create/use-sewing-create-draft';
import { useSewingCreateOverview } from '../../hooks/sewing-create/use-sewing-create-overview';

import type { SewingCreateStep } from '@admin/products/model';

interface Props {
  productId: number;
  step: SewingCreateStep;
  listHref: string;
  onStep: (step: SewingCreateStep) => void;
  onExit: () => void;
  onLaunched: () => void;
}

/** Steps 2–5 of a saved draft (and step 1 read-only); «Запустити модель» makes it active. */
export function SewingCreateDraftWizard({
  productId,
  step,
  listHref,
  onStep,
  onExit,
  onLaunched,
}: Props) {
  const draft = useSewingCreateDraft(productId);
  const { card, writes } = draft;
  const overview = useSewingCreateOverview(card.row);
  const [active, setActive] = useState(true);
  const open = onStep;
  const launch = async () => {
    if (await overview.save({ isActive: active })) onLaunched();
  };

  return (
    <SewingCreateLayout
      listHref={listHref}
      name={card.row?.name ?? null}
      code={draft.modelCode}
      step={step}
      ready={draft.ready}
      stepper={{ done: draft.done, canOpen: () => true, onSelect: open }}
      exitDisabled={overview.saving}
      onExit={onExit}
      onBack={step > 1 ? () => open((step - 1) as SewingCreateStep) : null}
      next={
        step === 5
          ? {
              label: 'Запустити модель',
              busy: overview.saving,
              disabled: !card.row || writes.busy,
              onClick: () => void launch(),
            }
          : {
              label: 'Далі',
              busy: false,
              disabled: false,
              onClick: () => open((step + 1) as SewingCreateStep),
            }
      }
      side={
        <SewingCreateSidePanel step={step} checks={draft.checks} labour={draft.labourSummary} />
      }
    >
      <SewingCreateDraftStep
        productId={productId}
        step={step}
        draft={draft}
        overview={overview}
        active={active}
        onActiveChange={setActive}
      />
    </SewingCreateLayout>
  );
}
