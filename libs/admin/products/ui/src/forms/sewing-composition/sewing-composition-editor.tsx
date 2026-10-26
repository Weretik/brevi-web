import { Alert, Button, Stack, Typography } from '@mui/material';
import { useId } from 'react';

import { SewingMaterialSection } from './sewing-material-section';
import { SewingOperationSection } from './sewing-operation-section';
import { useSewingCompositionForm } from '../../hooks/sewing-composition/use-sewing-composition-form';

import type { SewingCompositionEditorProps } from './sewing-composition-editor-props';

export function SewingCompositionEditor({
  scope,
  articleSku,
  version,
  materials,
  operations,
  lookups,
  canManage,
  dirty,
  saving = false,
  errors = {},
  blockers = [],
  error,
  onMaterialsChange,
  onOperationsChange,
  onSave,
  onCancel,
}: SewingCompositionEditorProps) {
  const {
    materialError,
    operationError,
    updateMaterial,
    updateOperation,
    validate,
    addMaterial,
    addOperation,
  } = useSewingCompositionForm({
    scope,
    materials,
    operations,
    lookups,
    errors,
    onMaterialsChange,
    onOperationsChange,
    onSave,
  });
  const headingId = useId();
  const readonly = !canManage || saving;
  return (
    <Stack component="section" aria-labelledby={headingId} sx={{ gap: 2 }}>
      <Stack>
        <Typography id={headingId} variant="h6" component="h2">
          {scope === 'Model' ? 'Спільний склад моделі' : `Склад артикулу ${articleSku ?? ''}`}
        </Typography>
        <Typography color="text.secondary">
          {scope === 'Model'
            ? `Спільні матеріали та операції для всіх артикулів · версія ${version}`
            : `Матеріали лише для цього артикулу · спільні рядки не дублюються · версія ${version}`}
        </Typography>
      </Stack>
      {!canManage && <Alert severity="info">Перегляд без права редагування.</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {blockers.length > 0 && (
        <Alert severity="warning" aria-label="Причини блокування розрахунку">
          <Typography component="div" sx={{ fontWeight: 600 }}>
            Потрібна перевірка
          </Typography>
          <ul>
            {blockers.map((blocker, index) => (
              <li key={`${index}-${blocker}`}>{blocker}</li>
            ))}
          </ul>
        </Alert>
      )}
      <SewingMaterialSection
        scope={scope}
        materials={materials}
        lookups={lookups}
        readonly={readonly}
        canManage={canManage}
        saving={saving}
        materialError={materialError}
        updateMaterial={updateMaterial}
        onMaterialsChange={onMaterialsChange}
        addMaterial={addMaterial}
      />
      {scope === 'Model' && (
        <SewingOperationSection
          operations={operations}
          lookups={lookups}
          readonly={readonly}
          canManage={canManage}
          saving={saving}
          operationError={operationError}
          updateOperation={updateOperation}
          onOperationsChange={onOperationsChange}
          addOperation={addOperation}
        />
      )}
      {canManage && (
        <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} disabled={saving}>
            Скасувати зміни
          </Button>
          <Button variant="contained" onClick={validate} disabled={!dirty || saving}>
            {saving ? 'Збереження…' : 'Зберегти склад'}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
