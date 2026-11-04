import { useSearchParams } from 'react-router-dom';

export const sewingCardTabs = ['fabrics', 'materials', 'labour', 'pricing'] as const;
export type SewingCardTab = (typeof sewingCardTabs)[number];

export const sewingCardTabLabels: Record<SewingCardTab, string> = {
  fabrics: 'Тканини',
  materials: 'Комплектація',
  labour: 'Трудовитрати',
  pricing: 'Розрахунок',
};

/** The open tab of the sewing card, kept in `?tab=` like other «Цех» pages. */
export function useSewingCardTab() {
  const [params, setParams] = useSearchParams();
  const value = params.get('tab');
  const tab: SewingCardTab = (sewingCardTabs as readonly string[]).includes(value ?? '')
    ? (value as SewingCardTab)
    : 'fabrics';
  const setTab = (next: SewingCardTab) =>
    setParams(
      (current) => {
        const copy = new URLSearchParams(current);
        if (next === 'fabrics') copy.delete('tab');
        else copy.set('tab', next);
        return copy;
      },
      { replace: true },
    );
  return { tab, setTab };
}
