import {
  formatDiscount,
  formatImportTime,
  priceFileLabel,
  priceSourceMethodLabel,
} from '@admin/references/model';
import { Alert, Box, Stack, Typography } from '@mui/material';

import { ReferenceDetailsList } from '../reference-editor/reference-details-list';
import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type { PriceSource } from '@admin/references/model';

/** Read-only side panel content of an «Імпорт цін» row: logic, discount, products and last update. */
export function PriceSourceDetails({
  source,
  onOpenSupplier,
}: {
  source: PriceSource;
  /** A click on the supplier opens its card (CAT-019). */
  onOpenSupplier?: () => void;
}) {
  const run = source.lastRun;
  return (
    <Stack sx={{ gap: 2 }}>
      {!source.supplierName && (
        <Alert severity="error">
          Постачальника «{source.title}» немає в «Контрагенти → Постачальники». Додайте його, щоб
          оновлювати ціни.
        </Alert>
      )}
      {source.method !== 'File' && !source.automaticUpdateConnected && (
        <Alert severity="warning">
          Автоматичне оновлення ще не підключено: ціни цього постачальника поки не змінюються.
        </Alert>
      )}
      <ReferenceFormSection title="Як оновлюється">
        <ReferenceDetailsList
          items={[
            {
              label: 'Джерело',
              value:
                priceFileLabel(source.fileKind, source.fileCount) ??
                priceSourceMethodLabel(source.method),
            },
            {
              label: 'Постачальник',
              value: source.supplierName,
              onOpen: source.supplierName ? onOpenSupplier : undefined,
            },
            { label: 'Розклад', value: source.schedule },
            { label: 'Логіка', value: source.logic },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Знижка та товари">
        <ReferenceDetailsList
          items={[
            {
              label: 'Знижка від ціни постачальника',
              value: formatDiscount(source.discountPercent),
              mono: true,
            },
            {
              label: 'Змінено',
              value:
                source.settingsUpdatedAt && source.settingsUpdatedBy
                  ? `${formatImportTime(source.settingsUpdatedAt)}, ${source.settingsUpdatedBy}`
                  : null,
            },
            { label: 'Товарів постачальника', value: String(source.productCount), mono: true },
            {
              label: 'З ручною ціною (не оновлюються)',
              value: source.manualPriceCount > 0 ? String(source.manualPriceCount) : null,
              mono: true,
            },
          ]}
        />
      </ReferenceFormSection>
      {run && (
        <ReferenceFormSection title="Останнє оновлення">
          <ReferenceDetailsList
            items={[
              {
                label: 'Коли',
                value: `${formatImportTime(run.finishedAt)}, ${run.trigger}`,
                mono: true,
              },
              { label: 'Хто', value: run.actor },
              {
                label: 'Результат',
                value: `Перевірено ${run.checked}, змінено ${run.changed}, без змін ${run.unchanged}, пропущено ${run.skipped}`,
              },
            ]}
          />
          {run.problems.length > 0 && (
            <Box>
              <Typography variant="overline" color="warning.main">
                Проблеми ({run.problems.length})
              </Typography>
              <Stack component="ul" sx={{ m: 0, pl: 2.5, gap: 0.5 }}>
                {run.problems.map((problem, index) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={`${problem.productCode ?? ''}-${index}`}
                  >
                    {[problem.productCode, problem.productName].filter(Boolean).join(' · ')}
                    {(problem.productCode || problem.productName) && ': '}
                    {problem.message}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </ReferenceFormSection>
      )}
    </Stack>
  );
}
