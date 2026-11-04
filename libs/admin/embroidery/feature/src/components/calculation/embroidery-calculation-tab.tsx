import { embroideryPriceText, formatEmbroideryMoney } from '@admin/embroidery/model';
import {
  EmbroideryBreakdownTable,
  EmbroideryCostCard,
  EmbroideryCutLayout,
  EmbroideryExpensesSection,
  EmbroideryMaterialSection,
  EmbroideryPriceCards,
  EmbroideryProgramSection,
  EmbroiderySubjectSection,
} from '@admin/embroidery/ui';
import { Alert, Box, Button, Link, Snackbar, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

import type { useEmbroideryCalculation } from '../../hooks/calculation/use-embroidery-calculation';
import type { EmbroideryPrice } from '@admin/embroidery/model';

interface Props {
  calculator: ReturnType<typeof useEmbroideryCalculation>;
  seesCost: boolean;
  onOpenSettings: () => void;
}

/** Variant A: the form on the left, the live prices in a sticky right column, the details below the form. */
export function EmbroideryCalculationTab({ calculator, seesCost, onOpenSettings }: Props) {
  const { values, errors, calculation } = calculator;
  const [copied, setCopied] = useState<string | null>(null);
  const wide = useMediaQuery(useTheme().breakpoints.up('lg'));
  const rows = calculation?.cost?.rows ?? [];
  const program = rows.find((row) => row.kind === 'Program');

  const copy = async (price: EmbroideryPrice | null) => {
    const quantity = values.quantity ?? 0;
    const prices = price ? [price] : (calculation?.prices ?? []);
    const text = prices.map((item) => embroideryPriceText(item, quantity)).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(price ? `Ціну «${price.name}» скопійовано.` : 'Ціни скопійовано.');
    } catch {
      setCopied('Не вдалося скопіювати. Виділіть ціну вручну.');
    }
  };

  const prices = (
    <Stack sx={{ gap: 2 }}>
      {calculator.requestError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={calculator.retry}>
              Повторити
            </Button>
          }
        >
          {calculator.requestError}
        </Alert>
      ) : (
        <EmbroideryPriceCards
          prices={calculation?.prices ?? []}
          quantity={values.quantity}
          error={calculation?.error ?? null}
          missing={calculation?.missing ?? []}
          missingAction={
            seesCost ? (
              <Link component="button" type="button" onClick={onOpenSettings}>
                Заповнити в «Налаштуваннях»
              </Link>
            ) : (
              'Попросіть директора заповнити «Налаштування».'
            )
          }
          waiting={calculator.waiting}
          fetching={calculator.fetching}
          onCopy={(price) => void copy(price)}
        />
      )}
      {calculation?.cost && <EmbroideryCostCard cost={calculation.cost} />}
    </Stack>
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        alignItems: 'start',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 340px' },
      }}
    >
      <Stack sx={{ gap: 2, minWidth: 0 }}>
        <EmbroiderySubjectSection
          values={values}
          hoops={calculator.hoops}
          errors={errors}
          onChange={calculator.change}
        />
        <EmbroideryProgramSection
          values={values}
          errors={errors}
          programCost={program ? formatEmbroideryMoney(program.amount) : null}
          onChange={calculator.change}
        />
        <EmbroideryMaterialSection
          mode={values.mode}
          value={values.materialMode}
          calculation={calculation}
          onChange={(materialMode) => calculator.change({ materialMode })}
        />
        <EmbroideryExpensesSection
          values={values}
          expenses={calculator.expenses}
          rows={rows}
          needsMachineTime={calculator.needsMachineTime}
          errors={errors}
          onTick={calculator.tick}
          onChange={calculator.change}
        />
        {!wide && prices}
        {calculation?.cost && <EmbroideryBreakdownTable cost={calculation.cost} />}
        {calculation?.stabilizer && (
          <EmbroideryCutLayout title="Рулон флізеліну" cut={calculation.stabilizer} />
        )}
        {calculation?.fabric && (
          <EmbroideryCutLayout title="Рулон тканини" cut={calculation.fabric} />
        )}
      </Stack>
      {wide && <Box sx={{ position: 'sticky', top: 88 }}>{prices}</Box>}
      <Snackbar
        open={copied !== null}
        autoHideDuration={3000}
        onClose={() => setCopied(null)}
        message={copied}
      />
    </Box>
  );
}
