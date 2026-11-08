import { leadCategoryDescriptionMaxLength } from '@admin/leads/model';
import { LeadCallResultFormFields } from '@admin/leads/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, TextField } from '@mui/material';

import type { LeadReferences } from '../../hooks/references/use-lead-references';

/** Side panel of «Довідники»: a call result or the description of a category. */
export function ReferenceDrawer({ references }: { references: LeadReferences }) {
  const editing = references.editing;
  if (!editing) return null;
  const isResult = editing.kind === 'result';

  return (
    <ReferenceEditorDrawer
      titleId="lead-reference-title"
      title={
        isResult
          ? editing.id
            ? 'Результат дзвінка'
            : 'Новий результат дзвінка'
          : `Категорія ${editing.code}`
      }
      description={
        isResult
          ? 'Кнопка, яку менеджер натискає після дзвінка в «Мій день».'
          : 'Код приходить із таблиці, опис бачать менеджери в картці ліда.'
      }
      formId="lead-reference-form"
      paperWidth={480}
      readOnly={false}
      saving={references.saving}
      submitLabel={isResult && !editing.id ? 'Додати' : 'Зберегти'}
      onClose={references.close}
      onEdit={() => undefined}
      onSubmit={references.submit}
    >
      {references.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {references.error}
        </Alert>
      )}
      {isResult ? (
        <LeadCallResultFormFields
          values={editing.values}
          errors={references.resultErrors}
          showErrors={references.showErrors}
          disabled={references.saving}
          onChange={(values) => references.change({ ...editing, values })}
        />
      ) : (
        <TextField
          label="Опис"
          value={editing.description}
          disabled={references.saving}
          autoFocus
          fullWidth
          multiline
          minRows={2}
          error={references.showErrors && Boolean(references.categoryError)}
          helperText={
            (references.showErrors && references.categoryError) ||
            'Наприклад: підтверджений сигнал, 50+ одиниць.'
          }
          onChange={(event) => references.change({ ...editing, description: event.target.value })}
          slotProps={{ htmlInput: { maxLength: leadCategoryDescriptionMaxLength } }}
        />
      )}
    </ReferenceEditorDrawer>
  );
}
