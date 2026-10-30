import {
  IntroductionFormatSelector,
  IntroductionSeasonSlots,
  IntroductionSelectionReview,
} from '@admin/clients/ui';
import { Alert, Stack } from '@mui/material';

import { useIntroductionSelection } from './use-introduction-selection';

import type { IntroductionSelectionActions } from './use-introduction-selection';
import type { IntroductionFormat, IntroductionSlotView } from '@admin/clients/model';

export interface IntroductionSelectionPanelProps extends IntroductionSelectionActions {
  readonly format: IntroductionFormat;
  readonly slots: readonly IntroductionSlotView[];
  /** Must change whenever the format or chosen product/fabric changes. UI-only identity, not a backend DTO. */
  readonly selectionToken: string;
  readonly disabled: boolean;
  readonly onFormatChange: (format: IntroductionFormat) => void;
  readonly onChooseProduct: (slotKey: string) => void;
  readonly onChooseFabric: (slotKey: string) => void;
}

export function IntroductionSelectionPanel(props: IntroductionSelectionPanelProps) {
  const state = useIntroductionSelection(props);
  const busy = props.disabled || state.checking || state.applying;
  const blockers = [
    ...new Set([
      ...(state.layoutValid ? [] : ['Позиції не відповідають обраному сезонному формату.']),
      ...(state.review?.blockers ?? []),
      ...props.slots.flatMap((slot) => slot.blockers),
    ]),
  ];
  return (
    <Stack spacing={3} aria-label="Добірка для першого знайомства">
      <IntroductionFormatSelector
        value={props.format}
        disabled={busy}
        onChange={(format) => {
          state.invalidate();
          props.onFormatChange(format);
        }}
      />
      <IntroductionSeasonSlots
        slots={props.slots}
        disabled={busy}
        onChooseProduct={(slotKey) => {
          state.invalidate();
          props.onChooseProduct(slotKey);
        }}
        onChooseFabric={(slotKey) => {
          state.invalidate();
          props.onChooseFabric(slotKey);
        }}
      />
      {state.error && <Alert severity="error">{state.error}</Alert>}
      <IntroductionSelectionReview
        serverApprovedForCurrentSelection={state.canApply}
        blockers={blockers}
        disabled={busy || !state.layoutValid || !props.selectionToken}
        checking={state.checking}
        applying={state.applying}
        onCheck={() => void state.check()}
        onApply={() => void state.apply()}
      />
    </Stack>
  );
}
