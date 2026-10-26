import { Alert, List, ListItem } from '@mui/material';

import type { SewingPriceCalculation } from '@admin/products/model';

const messages: Record<string, string> = {
  UnreviewedMaterial: 'Підтвердьте матеріали у складі виробу.',
  UnreviewedOperation: 'Перевірте та підтвердьте операції у складі виробу.',
  MissingCost: 'Додайте затверджену вартість матеріалу або додаткових витрат.',
  MissingMaterialCost:
    'Перевірте наявність, активність і затверджену вартість матеріалів та додаткових витрат.',
  MissingFabric: 'Додайте тканину до складу цього артикула.',
  MissingOperations: 'Додайте операції до складу виробу.',
  MissingOperationTime: 'Вкажіть норму часу або підтверджений ручний час операції.',
  InactiveArticle: 'Товар або артикул неактивний. Перевірте його стан.',
  InactiveReference: 'Перевірте активність використаних матеріалів та операцій.',
  UnapprovedReference: 'Потрібна затверджена версія вартості або норми.',
  MissingSettings: 'Потрібні затверджені налаштування розрахунку.',
  AmbiguousSettings: 'Усуньте конфлікт актуальних версій налаштувань.',
  AmbiguousReferenceVersion: 'Усуньте конфлікт версій вартості або норми.',
  UnitMismatch: 'Узгодьте одиниці виміру матеріалу та його вартості.',
  InvalidSchedule: 'Перевірте зарплату, робочі дні, тривалість зміни та кількість швачок.',
  InvalidRate: 'Перевірте коефіцієнти розрахунку.',
  InvalidMultiplier: 'Перевірте коефіцієнти трьох цін.',
  InvalidSettingPrecision: 'Перевірте точність чисел у налаштуваннях розрахунку.',
  NumericOverflow: 'Перевірте величини норм, кількостей і налаштувань.',
  UnsupportedFormula: 'Потрібне оновлення правил розрахунку. Зверніться до адміністратора.',
};

export function SewingPricingBlockers({
  blockers,
}: {
  blockers: SewingPriceCalculation['blockers'];
}) {
  const texts = [
    ...new Set(
      blockers.map(
        ({ code }) =>
          messages[code] ?? 'Перевірте склад, вартості та норми артикула перед розрахунком.',
      ),
    ),
  ];
  return (
    <Alert severity="warning">
      <strong>Розрахунок заблоковано</strong>
      <List dense disablePadding>
        {texts.map((text) => (
          <ListItem key={text} disableGutters>
            {text}
          </ListItem>
        ))}
      </List>
    </Alert>
  );
}
