import { SewingCreateModelSummary } from './sewing-create-model-summary';
import { SewingCreateOperationsStep } from './sewing-create-operations-step';
import { SewingCreateReviewStep } from './sewing-create-review-step';
import { SewingCardArticlesTab } from '../sewing-card/sewing-card-articles-tab';
import { SewingCompositionScreen } from '../sewing-composition/sewing-composition-screen';

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
  /** An Article row opens its own materials on step 3. */
  onOpenArticle: (articleId: number) => void;
}

/** The content of one step of a saved draft, built from the sewing card pieces. */
export function SewingCreateDraftStep(props: Props) {
  const { card, controller } = props.draft;
  const version = controller.queries.articles.data?.version ?? 0;
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
      return (
        <SewingCardArticlesTab
          rows={card.articles}
          loading={card.summaryLoading}
          error={card.summaryError}
          onRetry={card.reloadSummary}
          canCreate={controller.canManage && Boolean(controller.queries.articles.data)}
          version={version}
          creating={controller.articleCreation.state.isLoading}
          createError={controller.articleCreation.error}
          onCreate={controller.selection.requestCreateArticle}
          onOpen={props.onOpenArticle}
        />
      );
    case 3:
      return (
        <SewingCompositionScreen
          productId={props.productId}
          controller={controller}
          section="materials"
        />
      );
    case 4:
      return (
        <SewingCreateOperationsStep
          productId={props.productId}
          controller={controller}
          labour={props.draft.labour}
          costsKnown={card.seamstressPerMinute !== null}
        />
      );
    case 5:
      return (
        <SewingCreateReviewStep
          productId={props.productId}
          articles={card.articles}
          totals={card.totals}
          labourMinutes={props.draft.labourMinutes}
          compositionVersion={version}
          canManage={controller.canManage}
          dirty={controller.drafts.dirty || controller.busy}
          active={props.active}
          saving={props.overview.saving}
          message={props.overview.message}
          onActiveChange={props.onActiveChange}
        />
      );
  }
}
