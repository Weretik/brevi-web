import { Alert } from '@mui/material';

const reasons: Record<string, string> = {
  UnapprovedOffer: 'Перевірте та підтвердьте ціну постачальника й зовнішні ціни.',
  MissingSupplierCost: 'Вкажіть ціну постачальника для розрахунку за націнкою.',
  MissingRule: 'Оберіть і підтвердьте правило націнки для цього товару.',
  AmbiguousRule: 'Уточніть єдине правило націнки для товару.',
  InvalidMarkup: 'Перевірте націнки у правилі.',
  InvalidAmount: 'Перевірте вхідні суми.',
  InactiveProduct: 'Товар неактивний.',
  MissingOffer: 'Додайте вхідні ціни для товару.',
  NumericOverflow: 'Суми завеликі. Перевірте ціни та націнки.',
};
export function PpePricingBlockers({ blockers }: { blockers: readonly string[] }) {
  return (
    <>
      {[...new Set(blockers)].map((code) => (
        <Alert severity="warning" key={code}>
          {reasons[code] ?? 'Перевірте дані ціноутворення товару.'}
        </Alert>
      ))}
    </>
  );
}
