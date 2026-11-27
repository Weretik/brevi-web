/** The signed-in staff member as «Ціна вишивки» sees them. */
export interface EmbroideryViewer {
  /** «Ціна вишивки: собівартість і налаштування» with «Редагувати»: the «Налаштування» tab. */
  canEditSettings: boolean;
}

export type EmbroideryTab = 'calculation' | 'saved' | 'settings';

/** `?tab=saved` opens «Збережені», `?tab=settings` «Налаштування»; anything else is «Розрахунок». */
export function embroideryTabOf(search: URLSearchParams, viewer: EmbroideryViewer): EmbroideryTab {
  const tab = search.get('tab');
  if (tab === 'saved') return 'saved';
  return viewer.canEditSettings && tab === 'settings' ? 'settings' : 'calculation';
}

export const embroideryPricingParametersHref = '/references/pricing-parameters';
