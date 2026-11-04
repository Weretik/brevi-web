import { quoteDraftProblems, quoteDraftSummary, quoteTierVisibility } from '@admin/quotes/model';
import { QuoteProblemsCard, QuoteSendActions, QuoteSummaryCard } from '@admin/quotes/ui';
import { Stack } from '@mui/material';

import type { QuoteDraft, QuoteTier } from '@admin/quotes/model';

interface Props {
  draft: QuoteDraft;
  /** Wide screens: the actions live here; narrower ones get the sticky bar instead. */
  withActions: boolean;
  dirty: boolean;
  saving: boolean;
  generating: boolean;
  locked: boolean;
  onTierShown: (tier: QuoteTier, shown: boolean) => void;
  onGo: (target: string) => void;
  onSave: () => void;
  onPdf: () => void;
  onSend: () => void;
}

/** The right column: «Підсумок», «Перед надсиланням» (only with problems) and the КП actions. */
export function QuoteEditorAside({
  draft,
  withActions,
  dirty,
  saving,
  generating,
  locked,
  onTierShown,
  onGo,
  onSave,
  onPdf,
  onSend,
}: Props) {
  const summary = quoteDraftSummary(draft);
  return (
    <Stack component="aside" aria-label="Підсумок КП" sx={{ gap: 2 }}>
      <QuoteSummaryCard
        {...summary}
        tiers={{
          retail: quoteTierVisibility(draft, 'retail'),
          wholesale: quoteTierVisibility(draft, 'wholesale'),
          large: quoteTierVisibility(draft, 'large'),
        }}
        disabled={locked || draft.items.length === 0}
        onTierShown={onTierShown}
      />
      <QuoteProblemsCard problems={quoteDraftProblems(draft)} onGo={onGo} />
      {withActions && (
        <QuoteSendActions
          layout="card"
          dirty={dirty}
          saving={saving}
          generating={generating}
          locked={locked}
          onSave={onSave}
          onPdf={onPdf}
          onSend={onSend}
        />
      )}
    </Stack>
  );
}
