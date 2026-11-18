import { formatEmbroideryMoney } from '@admin/embroidery/model';
import {
  EmbroideryBreakdownTable,
  EmbroideryCutLayout,
  EmbroideryExpensesSection,
  EmbroideryMaterialSection,
  EmbroideryProgramSection,
  EmbroiderySubjectSection,
} from '@admin/embroidery/ui';
import { usePageRights } from '@admin/shared/ui';
import { Box, Button, Snackbar, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

import { EmbroideryCalculationPrices } from './embroidery-calculation-prices';
import { useEmbroideryCopy } from '../../hooks/calculation/use-embroidery-copy';
import { EmbroiderySaveDrawer } from '../saved/list/embroidery-save-drawer';

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
  const { canCreate } = usePageRights();
  const wide = useMediaQuery(useTheme().breakpoints.up('lg'));
  const rows = calculation?.cost?.rows ?? [];
  const program = rows.find((row) => row.kind === 'Program');

  const prices = (
    <EmbroideryCalculationPrices
      calculator={calculator}
      seesCost={seesCost}
      onOpenSettings={onOpenSettings}
      onCopy={(price) => void copier.copy(calculation?.prices ?? [], price, values.quantity ?? 0)}
      onSave={calculator.priced && canCreate ? () => setSaving(true) : undefined}
    />
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
