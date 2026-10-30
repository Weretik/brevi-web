const messages: Readonly<Record<string, string>> = {
  MissingFabric: 'Додайте тканину до складу.',
  MissingOperation: 'Додайте операцію до складу.',
  MissingMaterialCost: 'Для матеріалу немає підтвердженої вартості. Уточніть довідник.',
  UnapprovedReference: 'Позицію довідника ще не погоджено.',
  MissingSettings: 'Немає погоджених налаштувань розрахунку.',
  ApplicationSaleNotApproved: 'Погодьте продажну суму нанесення.',
  ArtworkFileNotVerified: 'Файл нанесення потребує перевірки доступності.',
  PriceOutOfRange: 'Підсумкова ціна виходить за допустимі межі.',
  NumericOverflow: 'Склад перевищує допустимі межі розрахунку.',
};
export function customBlockerMessage(code: string): string {
  return (
    messages[code] ??
    'Джерело не дозволяє розрахувати ціну. Перевірте склад, норми та погодження довідників.'
  );
}
