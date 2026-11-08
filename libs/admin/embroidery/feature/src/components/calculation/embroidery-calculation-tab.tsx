import { formatEmbroideryMoney } from '@admin/embroidery/model';
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

import { useEmbroideryCopy } from '../../hooks/calculation/use-embroidery-copy';
import { EmbroiderySaveDrawer } from '../saved/embroidery-save-drawer';

import type { useEmbroideryCalculation } from '../../hooks/calculation/use-embroidery-calculation';

interface Props {
  calculator: ReturnType<typeof useEmbroideryCalculation>;
  seesCost: boolean;
  onOpenSettings: () => void;
  onOpenSaved: () => void;
}

/** Variant A: the form on the left, the live prices in a sticky right column, the details below the form. */
export function EmbroideryCalculationTab({
  calculator,
  seesCost,
  onOpenSettings,
  onOpenSaved,
}: Props) {
  const { values, errors, calculation } = calculator;
  const copier = useEmbroideryCopy();
  const [saving, setSaving] = useState(false);
  const [savedNumber, setSavedNumber] = useState<string | null>(null);
  const wide = useMediaQuery(useTheme().breakpoints.up('lg'));
  const rows = calculation?.cost?.rows ?? [];
  const program = rows.find((row) => row.kind === 'Program');

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
          onCopy={(price) =>
            void copier.copy(calculation?.prices ?? [], price, values.quantity ?? 0)
          }
          onSave={calculator.priced ? () => setSaving(true) : undefined}
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
        open={copier.message !== null}
        autoHideDuration={3000}
        onClose={copier.close}
        message={copier.message}
      />
      <Snackbar
        open={savedNumber !== null}
        autoHideDuration={6000}
        onClose={() => setSavedNumber(null)}
        message={`Збережено як ${savedNumber ?? ''}.`}
        action={
          <Button color="inherit" size="small" onClick={onOpenSaved}>
            До збережених
          </Button>
        }
      />
      {saving && calculator.priced && (
        <EmbroiderySaveDrawer
          request={calculator.priced}
          prices={calculation?.prices ?? []}
          onClose={() => setSaving(false)}
          onSaved={(summary) => {
            setSaving(false);
            setSavedNumber(summary.number);
          }}
        />
      )}
    </Box>
  );
}
