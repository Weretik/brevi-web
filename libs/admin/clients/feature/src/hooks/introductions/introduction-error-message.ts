import { isAdminApiError } from '@admin/shared/api-client';

const blockers: Readonly<Record<string, string>> = {
  selection_unavailable: 'Модель або артикул більше недоступні.',
  model_unavailable_or_wrong_season: 'Модель недоступна або не відповідає сезону.',
  fabric_metadata_missing: 'Не заповнено склад або щільність тканини.',
  product_url_invalid: 'Для моделі немає чинного посилання Brevi.',
  large_wholesale_price_unavailable: 'Немає чинної крупногуртової ціни.',
  featured_mapping_changed: 'Конфігурація головних моделей змінилася. Оновіть добірку.',
};

export function introductionErrorMessage(error: unknown): string {
  if (!isAdminApiError(error))
    return error instanceof Error ? error.message : 'Не вдалося виконати дію з добіркою.';
  const details = Object.entries(error.fieldErrors ?? {}).map(([field, code]) => {
    const label = field.startsWith('slots.') ? `Позиція ${field.slice(6)}` : 'Добірка';
    return `${label}: ${blockers[code] ?? code}`;
  });
  return [error.message, ...details].filter(Boolean).join(' ');
}
