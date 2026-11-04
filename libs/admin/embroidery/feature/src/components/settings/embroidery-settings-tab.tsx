import { emptyEmbroideryExpense, emptyEmbroideryHoop } from '@admin/embroidery/model';
import {
  EmbroideryExpensesTable,
  EmbroideryHoopsTable,
  EmbroideryMarkupsSection,
  EmbroideryMaterialsSection,
  EmbroideryRatesSection,
  EmbroiderySettingsSaveBar,
} from '@admin/embroidery/ui';
import { Alert, Box, Button, CircularProgress, Snackbar, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { EmbroiderySettingsRowPanels } from './embroidery-settings-row-panels';
import { embroideryPricingParametersHref } from '../../model/embroidery-viewer';

import type { EmbroiderySettingsOpenRow } from './embroidery-settings-row-panels';
import type { EmbroiderySettingsEditor } from '../../hooks/settings/use-embroidery-settings-editor';
import type { EmbroiderySettingsSectionId } from '@admin/embroidery/model';

const anchorOf = (id: EmbroiderySettingsSectionId) => `embroidery-settings-${id}`;

/** Ids of rows with problems in one list, from paths like `hoops.<id>.label`. */
const rowsWithErrors = (errors: Readonly<Record<string, string>>, list: 'hoops' | 'expenses') =>
  new Set(
    Object.keys(errors)
      .filter((path) => path.startsWith(`${list}.`))
      .map((path) => path.split('.')[1] ?? ''),
  );

/** «Налаштування»: Director and Admin edit the rates the calculation uses, and save the page whole. */
export function EmbroiderySettingsTab({ editor }: { editor: EmbroiderySettingsEditor }) {
  const [open, setOpen] = useState<EmbroiderySettingsOpenRow>(null);
  const { draft, errors, settings } = editor;
  const hoopErrors = useMemo(() => rowsWithErrors(errors, 'hoops'), [errors]);
  const expenseErrors = useMemo(() => rowsWithErrors(errors, 'expenses'), [errors]);

  if (editor.loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Завантаження налаштувань" />
      </Box>
    );
  if (editor.loadError || !draft || !settings)
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={editor.retryLoad}>
            Повторити
          </Button>
        }
      >
        {editor.loadError ?? 'Не вдалося відкрити налаштування.'}
      </Alert>
    );

  const goTo = (id: EmbroiderySettingsSectionId) =>
    document.getElementById(anchorOf(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const save = async () => {
    if (await editor.save()) return;
    const first = (Object.keys(editor.errorCounts) as EmbroiderySettingsSectionId[])[0];
    if (first) goTo(first);
  };

  return (
    <Box sx={{ pb: 2 }}>
      {editor.saveError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            editor.saveError.stale ? (
              <Button color="inherit" onClick={() => void editor.reload()}>
                Оновити
              </Button>
            ) : undefined
          }
        >
          {editor.saveError.message}
        </Alert>
      )}
      <Stack sx={{ gap: 2, maxWidth: 1040 }}>
        <EmbroideryRatesSection
          rates={draft.rates}
          stitchRate={settings.stitchRate}
          pricingParametersHref={embroideryPricingParametersHref}
          errors={errors}
          onChange={editor.changeRates}
        />
        <EmbroideryMarkupsSection
          markups={draft.markups}
          errors={errors}
          onChange={editor.changeMarkup}
        />
        <EmbroideryMaterialsSection
          draft={draft}
          errors={errors}
          onChange={editor.changeMaterials}
        />
        <EmbroideryHoopsTable
          hoops={draft.hoops}
          error={errors['hoops']}
          rowsWithErrors={hoopErrors}
          onOpen={(row) => setOpen({ kind: 'hoop', row, isNew: false })}
          onAdd={() =>
            setOpen({ kind: 'hoop', row: emptyEmbroideryHoop(draft.hoops), isNew: true })
          }
        />
        <EmbroideryExpensesTable
          expenses={draft.expenses}
          error={errors['expenses']}
          rowsWithErrors={expenseErrors}
          onOpen={(row) => setOpen({ kind: 'expense', row, isNew: false })}
          onAdd={() =>
            setOpen({ kind: 'expense', row: emptyEmbroideryExpense(draft.expenses), isNew: true })
          }
        />
      </Stack>

      <EmbroiderySettingsSaveBar
        changed={editor.changed}
        errorCounts={editor.errorCounts}
        saving={editor.saving}
        canSaveUnchanged={draft.version === 0}
        onGoTo={goTo}
        onDiscard={editor.discard}
        onSave={() => void save()}
      />

      <EmbroiderySettingsRowPanels
        open={open}
        draft={draft}
        editor={editor}
        onClose={() => setOpen(null)}
      />
      <Snackbar
        open={editor.savedNotice}
        autoHideDuration={3000}
        onClose={editor.dismissSavedNotice}
        message="Налаштування збережено. Нові розрахунки вже рахуються за ними."
      />
    </Box>
  );
}
