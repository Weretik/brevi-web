import { SewingCreateModelSummary } from './sewing-create-model-summary';
import { SewingCreateReviewStep } from './sewing-create-review-step';
import { SewingLabourTab } from '../sewing-model/sewing-labour-tab';
import { SewingMaterialsTab } from '../sewing-model/sewing-materials-tab';
import { SewingVariantsTab } from '../sewing-model/sewing-variants-tab';

import type { useSewingCreateDraft } from '../../hooks/sewing-create/use-sewing-create-draft';
import type { useSewingCreateOverview } from '../../hooks/sewing-create/use-sewing-create-overview';
import type { SewingCreateStep } from '@admin/products/model';

interface Props {
  productId: number;
  step: SewingCreateStep;
  draft: ReturnType<typeof useSewingCreateDraft>;
  overview: ReturnType<typeof useSewingCreateOverview>;
  active: boolean;
  onActiveChange: (active: boolean) => void;
}

/** The content of one step of a saved draft, built from the sewing card tabs. */
export function SewingCreateDraftStep(props: Props) {
  const { card, model, writes } = props.draft;
  const sectionId = card.row?.sectionId;
  switch (props.step) {
    case 1:
      return (
        <SewingCreateModelSummary
          productId={props.productId}
          row={card.row}
          sectionName={sectionId == null ? null : (card.sectionNames.get(sectionId) ?? null)}
          loading={card.overviewLoading}
        />
      );
    case 2:
      return <SewingVariantsTab model={model} writes={writes} />;
    case 3:
      return <SewingMaterialsTab model={model} writes={writes} />;
    case 4:
      return (
        <SewingLabourTab
          model={model}
          writes={writes}
          seamstressPerMinute={card.seamstressPerMinute}
        />
      );
    case 5:
      return (
        <SewingCreateReviewStep
          productId={props.productId}
          summary={card.articles}
          totals={card.totals}
          active={props.active}
          saving={props.overview.saving}
          message={props.overview.message}
          onActiveChange={props.onActiveChange}
        />
      );
  }
}
