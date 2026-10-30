import {
  CustomApplicationFields,
  CustomIdentityFields,
  CustomMaterialFields,
  CustomOperationFields,
} from '@admin/clients/ui';
import {
  useListFabricsQuery,
  useListGarmentAccessoriesQuery,
  useListGarmentPartOperationsQuery,
} from '@admin/references/data-access';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { CustomEditorActions } from './custom-editor-actions';
import { CustomPriceResult } from './custom-price-result';
import { useCustomEditor } from '../../../hooks/custom-sewing/use-custom-editor';
import { CustomArtworkPicker } from '../../custom-files/custom-artwork-picker';
import { CustomFilesPanel } from '../../custom-files/custom-files-panel';
import { CustomSuggestionsPanel } from '../../custom-suggestions/custom-suggestions-panel';
import { CustomTemplatesPanel } from '../../custom-templates/custom-templates-panel';

import type { CustomConfiguration, CustomDetail } from '@admin/clients/model';

export function CustomEditorForm({
  initial,
  seed,
  onAccepted,
  onState,
  reload,
  onApplied,
  onAccessLost,
  onSuggested,
}: {
  initial: CustomDetail | null;
  seed?: CustomConfiguration;
  onAccepted: (value: CustomDetail) => void;
  onState: (dirty: boolean, locked: boolean) => void;
  reload?: () => Promise<CustomDetail>;
  onApplied?: (value: CustomDetail) => void;
  onAccessLost?: () => void;
  onSuggested?: (configuration: CustomConfiguration) => void;
}) {
  const [filesDirty, setFilesDirty] = useState(false);
  const [filesLocked, setFilesLocked] = useState(false);
  const [templatesBusy, setTemplatesBusy] = useState(false);
  const externalLocked = filesDirty || filesLocked || templatesBusy;
  const editor = useCustomEditor(initial, seed, onAccepted, externalLocked);
  const fileState = useCallback((dirty: boolean, locked: boolean) => {
    setFilesDirty(dirty);
    setFilesLocked(locked);
  }, []);
  const accessLost = () => {
    editor.forbid();
    onAccessLost?.();
  };
  const fabrics = useListFabricsQuery();
  const accessories = useListGarmentAccessoriesQuery();
  const operations = useListGarmentPartOperationsQuery();
  useEffect(
    () =>
      onState(
        editor.dirty || filesDirty,
        editor.pending || editor.uncertain || filesLocked || templatesBusy,
      ),
    [
      editor.dirty,
      editor.pending,
      editor.uncertain,
      filesDirty,
      filesLocked,
      templatesBusy,
      onState,
    ],
  );
  const preview = editor.dirty ? null : (editor.detail?.preview ?? null);
  if (editor.forbidden)
    return <Alert severity="error">Конфігурацію не знайдено або доступ обмежено.</Alert>;
  return (
    <Stack spacing={3}>
      <Typography component="h2" variant="h6">
        {editor.detail
          ? `Приватна конфігурація · зміна ${editor.detail.revision}`
          : 'Нова приватна конфігурація'}
      </Typography>
      {editor.error && <Alert severity="error">{editor.error}</Alert>}
      {editor.uncertain && (
        <Alert severity="warning">
          Результат запиту невідомий. Введення заблоковане; повторіть ту саму дію для уточнення
          результату.
        </Alert>
      )}
      {editor.detail?.canEdit === false && (
        <Alert severity="info">Конфігурація доступна лише для читання.</Alert>
      )}
      {(fabrics.error || accessories.error || operations.error) && (
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => {
                void fabrics.refetch();
                void accessories.refetch();
                void operations.refetch();
              }}
            >
              Повторити
            </Button>
          }
        >
          Не вдалося завантажити довідники. Збережений склад залишився доступним.
        </Alert>
      )}
      <CustomIdentityFields
        value={editor.configuration}
        disabled={editor.locked}
        errors={editor.errors}
        onChange={editor.setConfiguration}
      />
      <CustomMaterialFields
        title="Тканини"
        rows={editor.configuration.fabrics}
        choices={fabrics.currentData ?? []}
        disabled={editor.locked}
        onChange={(value) => editor.setConfiguration({ ...editor.configuration, fabrics: value })}
      />
      <CustomMaterialFields
        title="Фурнітура"
        rows={editor.configuration.accessories}
        choices={accessories.currentData ?? []}
        disabled={editor.locked}
        onChange={(value) =>
          editor.setConfiguration({ ...editor.configuration, accessories: value })
        }
      />
      <CustomOperationFields
        rows={editor.configuration.operations}
        choices={(operations.currentData ?? []).map((row) => ({
          id: row.id,
          name: `${row.garmentPartName}: ${row.name}`,
        }))}
        disabled={editor.locked}
        onChange={(value) =>
          editor.setConfiguration({ ...editor.configuration, operations: value })
        }
      />
      <CustomApplicationFields
        rows={editor.configuration.applications}
        disabled={editor.locked}
        onChange={(value) =>
          editor.setConfiguration({ ...editor.configuration, applications: value })
        }
      />
      {editor.detail && (
        <CustomArtworkPicker
          id={editor.detail.id}
          rows={editor.configuration.applications}
          disabled={editor.locked}
          onChange={(applications) =>
            editor.setConfiguration({ ...editor.configuration, applications })
          }
        />
      )}
      {onSuggested && (
        <CustomSuggestionsPanel
          configuration={editor.configuration}
          disabled={editor.locked || editor.dirty || !editor.detail}
          onApply={onSuggested}
        />
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {(['delivery', 'packaging'] as const).map((field) => (
          <TextField
            key={field}
            type="number"
            label={field === 'delivery' ? 'Доставка, грн' : 'Пакування, грн'}
            value={editor.configuration[field]}
            disabled={editor.locked}
            error={!!editor.errors[field]}
            helperText={editor.errors[field]}
            onChange={(event) =>
              editor.setConfiguration({
                ...editor.configuration,
                [field]: Number(event.target.value),
              })
            }
          />
        ))}
      </Stack>
      {Object.entries(editor.errors)
        .filter(([key]) => ['fabrics', 'accessories', 'operations', 'applications'].includes(key))
        .map(([key, message]) => (
          <Alert key={key} severity="error">
            {message}
          </Alert>
        ))}
      <CustomPriceResult basis={preview} />
      <CustomEditorActions editor={editor} blocked={externalLocked} reload={reload} />
      {editor.detail && (
        <CustomFilesPanel
          key={`${editor.detail.id}:${editor.detail.revision}`}
          detail={editor.detail}
          disabled={
            editor.dirty ||
            editor.pending ||
            editor.uncertain ||
            !editor.detail.canEdit ||
            templatesBusy
          }
          onAccepted={(value) => {
            setFilesDirty(false);
            setFilesLocked(false);
            editor.accept(value);
          }}
          onState={fileState}
          onAccessLost={accessLost}
        />
      )}
      {onApplied && (
        <CustomTemplatesPanel
          detail={editor.detail}
          disabled={
            editor.dirty ||
            editor.pending ||
            editor.uncertain ||
            filesDirty ||
            filesLocked ||
            editor.detail?.canEdit === false
          }
          onApplied={onApplied}
          onBusy={setTemplatesBusy}
          onAccessLost={accessLost}
        />
      )}
      {editor.detail?.currentVersion && (
        <Alert severity="success">
          Збережена версія №{editor.detail.currentVersion.number}. Зміни чернетки не змінюють цю
          версію.
        </Alert>
      )}
    </Stack>
  );
}
