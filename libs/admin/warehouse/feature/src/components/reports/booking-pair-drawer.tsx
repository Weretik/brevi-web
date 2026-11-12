import { ReferenceEditorDrawer } from '@admin/references/ui';
import { BookingPairDetails } from '@admin/warehouse/ui';

import type { BookingPair } from '@admin/warehouse/model';

interface Props {
  pair: BookingPair;
  today: string;
  /** «Прихід» for the stock keepers; null for the rest. */
  onReceive: (() => void) | null;
  onClose: () => void;
}

/** A pair of «Що замовити › Тканина»: its figures and the queue of tasks; the table stays in place. */
export function BookingPairDrawer({ pair, today, onReceive, onClose }: Props) {
  return (
    <ReferenceEditorDrawer
      titleId="booking-pair-title"
      title={`${pair.fabricName} · ${pair.color}`}
      description={[pair.fabricCode, pair.supplier].filter(Boolean).join(' · ')}
      formId="booking-pair"
      paperWidth={560}
      readOnly
      saving={false}
      editLabel={onReceive ? 'Прихід' : null}
      onClose={onClose}
      onEdit={() => onReceive?.()}
      onSubmit={() => undefined}
    >
      <BookingPairDetails pair={pair} today={today} />
    </ReferenceEditorDrawer>
  );
}
