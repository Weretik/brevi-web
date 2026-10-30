import { IntroductionArticlePicker, IntroductionModelPicker } from '@admin/clients/ui';

import type { useIntroductionCatalogPickers } from '../../hooks/introductions/use-introduction-catalog-pickers';

export function IntroductionCatalogPickers({
  pickers,
}: {
  pickers: ReturnType<typeof useIntroductionCatalogPickers>;
}) {
  return (
    <>
      <IntroductionModelPicker {...pickers.model} />
      <IntroductionArticlePicker {...pickers.article} />
    </>
  );
}
