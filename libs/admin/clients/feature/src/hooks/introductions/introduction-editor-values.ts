import { introductionLayout } from '@admin/clients/model';

import type { IntroductionDraftSlot, IntroductionDraftValues } from './use-introduction-draft';
import type { IntroductionSelection, IntroductionTemplateDetail } from '@admin/clients/model';

export function introductionEditorValues(detail: IntroductionTemplateDetail) {
  const values: IntroductionDraftValues = {
    name: detail.name,
    format: detail.format,
    emailTemplateVersionId: detail.emailTemplateVersionId,
  };
  const slots = introductionLayout(detail.format).map((slot): IntroductionDraftSlot => {
    const uid = (slot.season === 'summer' ? 100 : 200) + slot.position - 1;
    const selection = detail.selections.find((row) => row.slotUid === uid);
    return {
      key: slot.key,
      productId: selection?.productId ?? null,
      articleId: selection?.articleId ?? null,
      productLabel: selection ? 'Збережена модель' : null,
      fabricLabel: selection ? 'Збережений артикул' : null,
    };
  });
  return {
    values,
    slots,
    source: {
      id: detail.id,
      versionId: detail.versionId,
      revision: detail.revision,
      archived: detail.archived,
      mappingVersionId: detail.mappingVersionId,
    },
  };
}

export function introductionWriteSelections(
  format: IntroductionDraftValues['format'],
  slots: readonly IntroductionDraftSlot[],
): IntroductionSelection[] {
  return introductionLayout(format).map((slot) => {
    const selected = slots.find((row) => row.key === slot.key);
    if (!selected?.productId || !selected.articleId)
      throw new Error('Оберіть модель і тканину для кожної позиції.');
    return {
      slotUid: ((slot.season === 'summer' ? 100 : 200) +
        slot.position -
        1) as IntroductionSelection['slotUid'],
      productId: selected.productId,
      articleId: selected.articleId,
    };
  });
}
