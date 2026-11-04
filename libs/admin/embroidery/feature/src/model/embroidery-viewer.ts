/** The signed-in staff member as «Ціна вишивки» sees them. */
export interface EmbroideryViewer {
  /** Director and Admin: the cost and «Налаштування». */
  canEditSettings: boolean;
}

export type EmbroideryTab = 'calculation' | 'settings';

/** `?tab=settings` opens «Налаштування»; anything else is «Розрахунок». */
export const embroideryTabOf = (
  search: URLSearchParams,
  viewer: EmbroideryViewer,
): EmbroideryTab =>
  viewer.canEditSettings && search.get('tab') === 'settings' ? 'settings' : 'calculation';

export const embroideryPricingParametersHref = '/references/pricing-parameters';
